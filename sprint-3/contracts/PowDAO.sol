// SPDX-License-Identifier: MIT
// Code snippets taken from MulockDAO v2 https://github.com/MolochVentures/moloch/blob/master/contracts/Moloch.sol

// Quickly initiate a DAO by sending an array of address in the constructor of this contract on deploy.
// DAO proposals can be created by anyone, but only voted on by members.
// Members can create proposals to add or kick members.
// Members cannot withdraw their deposited funds once they are deposited
// All deposited funds will be used for the good of the DAO.
// Public Goods...
// This type of DAO can be used by sports teams to pay for field time, equipment, travel, etc.
// Another use case is for public contruction or maintenance projects.
// A neighborhood/ town/ governoment can deposit a bunch of funds which can be democratically
// voted on and invoices can be submitted by the contractors.

pragma solidity ^0.8.4;


contract PowDAO {

    // GLOBAL CONSTANTS
    // ***************
    uint256 public votingPeriodInSeconds; // default = 7 days
    uint256 public proposalVoteCliffInSeconds; // default = 1 day

    // INTERNAL ACCOUNTING
    // *******************
    uint256 public proposalCount = 0; // total proposals submitted, also used as the proposalId for the next proposal that gets submitted

    // EVENTS
    // ***************
    event SubmitProposal(
        address proposer,
        uint256 paymentRequested,
        string details,
        bool[5] flags,
        uint256 proposalId,
        address indexed senderAddress
    );
    event SubmitVote(
        uint256 indexed proposalIndex,
        address indexed delegateKey,
        address indexed memberAddress,
        Vote vote
    );
    event CancelProposal(uint256 indexed proposalId, address applicantAddress);
    event ProcessedProposal(
        address proposer,
        uint256 paymentRequested,
        string details,
        bool[5] flags,
        uint256 proposalId,
        address indexed senderAddress
    );
    event Deposit(address sender, uint256 amount);
    event Withdraw(address proposerAddress, uint256 amount);

    mapping(uint256 => Proposal) public proposals;
    mapping(address => Member) public members;
    mapping(address => uint256) private _payoutTotals; // The beneficiaries address and how much they are approved for.

    struct Member {
        uint256 shares; // the # of voting shares assigned to this member
        bool exists; // always true once a member has been created
        uint256 jailed; // set to the proposalIndex of a passing DAO kick proposal for this member. Prevents voting on proposals.
    }

    struct Proposal {
        address proposer; // the account that submitted the proposal (can be non-member)
        uint256 paymentRequested; // amount of tokens requested as payment
        uint256 startingTime; // the time in which voting can start for this proposal
        uint256 yesVotes; // the total number of YES votes for this proposal
        uint256 noVotes; // the total number of NO votes for this proposal
        bool[5] flags; // [processed, didPass, cancelled, memberAdd, memberKick]
        string details; // proposal details - could be IPFS hash, plaintext, or JSON
        mapping(address => Vote) votesByMember; // the votes on this proposal by each member
        bool exists; // always true once a member has been created
    }

    enum Vote {
        Null, // default value, counted as abstention
        Yes,
        No
    }

    modifier onlyMember() {
        require(
            members[msg.sender].shares > 0,
            "Your are not a member of the PowDAO."
        );
        _;
    }

    // CONSTRUCTOR
    // ***************
    // Members imported as an array. Only members can vote on a proposal.
    constructor(address[] memory approvedMembers) public {
        for (uint256 i = 0; i < approvedMembers.length; i++) {
            members[approvedMembers[i]] = Member(1, true, 0);
        }

        votingPeriodInSeconds = 604800; // 7 days = 604800 = 60 * 60 * 24 * 7
        proposalVoteCliffInSeconds = 86400; // 1 day = 86400 = 60 * 60 * 24
    }

    // ALLOWANCE FUNCTIONS
    //***********
    // An allowance is given to a proposer when their proposal gets a majority vote and the voting period has expired.

    // Internal function
    function _increasePayout(address recipient, uint256 addedValue)
        internal
        returns (bool)
    {
        uint256 currentBalance = 0;
        if (_payoutTotals[recipient] != 0) {
            currentBalance = _payoutTotals[recipient];
        }
        _payoutTotals[recipient] = addedValue + currentBalance;
        return true;
    }

    // Internal function
    function _decreasePayout(address beneficiary, uint256 subtractedValue)
        internal
        returns (bool)
    {
        uint256 currentAllowance = _payoutTotals[beneficiary];
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased payout below zero"
        );
        _payoutTotals[beneficiary] = currentAllowance - subtractedValue;
        return true;
    }

    // Public
    function payout(address recipient) public view returns (uint256) {
        return _payoutTotals[recipient];
    }

    // A proposer calls function and if address has an allowance, recieves ETH in return.
    function getPayout(address payable addressOfProposer)
        public
        returns (bool)
    {
        // Get the available allowance first amd store in uint256.
        uint256 allowanceAvailable = _payoutTotals[addressOfProposer];
        require(allowanceAvailable > 0, "You do not have any funds available.");

        addressOfProposer.call{value: allowanceAvailable}("");
        _decreasePayout(addressOfProposer, allowanceAvailable);
        // console.log("transfer success");
        emit Withdraw(addressOfProposer, allowanceAvailable);
        return true;
    }

    // MEMBER FUNCTIONS
    //*****************
    // Vote on adding new members who want to contribute funds or work.
    // OR kick members who do not contribute.
    function addMember(address newMemAddress, string memory details)
        public
        onlyMember
    {
        _submitMemberProposal(newMemAddress, details, 0); // 0 adds a member
    }

    function kickMember(address memToKick, string memory details)
        public
        onlyMember
    {
        _submitMemberProposal(memToKick, details, 1); // 1 kicks a member
    }

    // Create a proposal that shows the address (member to be added) as the proposer.
    // And sets the flags to indicate the type of proposal, either add or kick.
    function _submitMemberProposal(
        address entity,
        string memory details,
        uint256 action
    ) internal {
        Proposal storage prop = proposals[proposalCount];

        prop.proposer = entity;
        prop.paymentRequested = 0;
        prop.startingTime = block.timestamp;
        prop.details = details;
        prop.exists = true;

        if (action == 0) {
            prop.flags = [false, false, false, true, false]; // memberAdd
        } else if (action == 1) {
            prop.flags = [false, false, false, false, true]; // memberkick
        } else {
            revert("unknown action value, must be 0 or 1");
        }

        emit SubmitProposal(
            prop.proposer,
            0,
            prop.details,
            prop.flags,
            proposalCount,
            msg.sender
        );
        proposalCount += 1;
    }

    // PROPOSAL FUNCTIONS
    // ***************
    // SUBMIT PROPOSAL, public function
    // Set applicant, paymentRequested, timelimit, details.
    // All payments made in the native currency.
    function submitProposal(uint256 paymentRequested, string memory details)
        public
        returns (uint256 proposalId)
    {
        address applicant = msg.sender;
        require(applicant != address(0), "applicant cannot be 0");
        require(
            members[applicant].jailed == 0,
            "proposal applicant must not be jailed"
        );
        bool[5] memory flags; // [processed, didPass, cancelled, memberAdd, memberKick]
        _submitProposal(paymentRequested, details, flags);
        return proposalCount - 1; // return proposalId - contracts calling submit might want it
    }

    // Internal submit function
    function _submitProposal(
        uint256 paymentRequested,
        string memory details,
        bool[5] memory flags
    ) internal {
        Proposal storage prop = proposals[proposalCount];
        prop.proposer = msg.sender;
        prop.paymentRequested = paymentRequested;
        prop.startingTime = block.timestamp;
        prop.flags = flags;
        prop.details = details;
        prop.exists = true;
        emit SubmitProposal(
            msg.sender,
            paymentRequested,
            details,
            flags,
            proposalCount,
            msg.sender
        );
        proposalCount += 1;
    }

    // Function cancels a proposal if it has not been cancelled already.
    function _cancelProposal(uint256 proposalId) internal onlyMember {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.flags[2], "proposal has already been cancelled");
        proposal.flags[2] = true; // cancelled
        emit CancelProposal(proposalId, msg.sender);
    }

    // Function which can be called when the proposal voting time has expired.
    // To either act on the proposal or cancel if not a majority yes vote.
    function processProposal(uint256 proposalId)
        public
        onlyMember
        returns (bool)
    {
        require(proposals[proposalId].exists, "This proposal does not exist.");
        require(
            proposals[proposalId].flags[0] == false,
            "This proposal has already been processed"
        );
        require(
            getCurrentTime() >= proposals[proposalId].startingTime,
            "voting period has not started"
        );
        require(
            hasVotingPeriodExpired(proposals[proposalId].startingTime),
            "proposal voting period has not expired yet"
        );
        require(
            proposals[proposalId].paymentRequested <= address(this).balance,
            "DAO balance too low to accept the proposal."
        );

        Proposal storage prop = proposals[proposalId];

        // flags = [processed, didPass, cancelled, memberAdd, memberKick]
        if (prop.flags[3] == true) {
            // Member add
            prop.flags[0] = true;
            if (prop.yesVotes > prop.noVotes) {
                members[prop.proposer] = Member(1, true, 0);
                prop.flags[1] = true;
            } else {
                prop.flags[2] = true;
            }
        }
        if (prop.flags[4] == true) {
            // Member kick
            prop.flags[0] = true;
            if (prop.yesVotes > prop.noVotes) {
                members[prop.proposer].shares = 0;
                members[prop.proposer].jailed = proposalId;
                prop.flags[1] = true;
            } else {
                _cancelProposal(proposalId);
            }
        }
        if (prop.flags[3] == false && prop.flags[4] == false) {
            prop.flags[0] = true;
            if (prop.yesVotes > prop.noVotes) {
                prop.flags[1] = true;
                _increasePayout(prop.proposer, prop.paymentRequested);
            } else {
                _cancelProposal(proposalId);
            }
        } else {
            revert("invalid flag configuration");
        }

        emit ProcessedProposal(
            prop.proposer,
            prop.paymentRequested,
            prop.details,
            prop.flags,
            proposalId,
            prop.proposer
        );
        return true;
    }

    // Function to submit a vote to a proposal if you are a member of the DAO and you have not voted yet.
    // Voting period must be in session
    function submitVote(uint256 proposalId, Vote vote) public onlyMember {
        require(
            members[msg.sender].exists,
            "Your are not a member of the PowDAO."
        );
        require(proposals[proposalId].exists, "This proposal does not exist.");

        address memberAddress = msg.sender;
        Member storage member = members[memberAddress];
        Proposal storage prop = proposals[proposalId];

        require(
            getCurrentTime() >= prop.startingTime + proposalVoteCliffInSeconds,
            "voting period has not started"
        );
        require(
            !hasVotingPeriodExpired(prop.startingTime),
            "proposal voting period has expired"
        );
        require(
            prop.votesByMember[memberAddress] == Vote.Null,
            "member has already voted"
        );
        require(
            vote == Vote.Yes || vote == Vote.No,
            "vote must be either Yes or No"
        );

        prop.votesByMember[memberAddress] = vote;

        if (vote == Vote.Yes) {
            prop.yesVotes = prop.yesVotes + member.shares;
        } else if (vote == Vote.No) {
            prop.noVotes = prop.noVotes + member.shares;
        }

        emit SubmitVote(proposalId, msg.sender, memberAddress, vote);
    }

    // Function to receive Ether and emit an event
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // HELPER FUNCTIONS
    //*****************
    function max(uint256 x, uint256 y) internal pure returns (uint256) {
        return x >= y ? x : y;
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getProposalFlags(uint256 proposalId)
        public
        view
        returns (bool[5] memory)
    {
        return proposals[proposalId].flags;
    }

    function getMemberProposalVote(address memberAddress, uint256 proposalIndex)
        public
        view
        returns (Vote)
    {
        require(members[memberAddress].exists, "member does not exist");
        require(proposals[proposalIndex].exists, "proposal does not exist");
        return
            proposals[proposalIndex].votesByMember[
                memberAddress
            ];
    }

    function hasVotingPeriodExpired(uint256 startingTime)
        public
        view
        returns (bool)
    {
        return (getCurrentTime() >= startingTime + votingPeriodInSeconds);
    }
}
