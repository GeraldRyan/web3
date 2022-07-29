// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {DAI} from './DAI.sol';

contract BasicLoan{
    struct Terms{
        uint256 loanDaiAmount;
        uint256 feeDaiAmount;
        uint256 ethCollateralAmount;
        uint256 repayByTimestamp;
    }

    Terms public terms;

    enum LoanState {Created, Funded, Taken}
    LoanState public state;

    address payable public lender;
    address payable public borrower;
    address public daiAddress;

    constructor (Terms memory _terms, address _daiAddress){
        terms = _terms;
        daiAddress = _daiAddress;
        lender = payable(msg.sender);
        state = LoanState.Created;
    }

    modifier onlyInState(LoanState expectedState){
        require(state == expectedState, "Not allowed in this state");
        _;
    }

    function fundLoan() public onlyInState(LoanState.Created){
        state = LoanState.Funded;
        DAI(daiAddress).transferFrom(msg.sender, address(this), terms.loanDaiAmount);
    }

    function takeALoanAndAcceptLoanTerms()
    public 
    payable 
    onlyInState(LoanState.Funded){
        require(msg.value == terms.ethCollateralAmount, "Invalid Collateral amount");
        borrower = payable(msg.sender);
        state = LoanState.Taken;
        DAI(daiAddress).transfer(borrower, terms.loanDaiAmount);
    }

    function repay() public onlyInState(LoanState.Taken){
        require(msg.sender == borrower, "Only the borrower can repay the loan");
        DAI(daiAddress).transferFrom(borrower, lender, terms.loanDaiAmount + terms.feeDaiAmount);
        selfdestruct(borrower);
    }

    function liquidate() public onlyInState(LoanState.Taken){
        require(msg.sender == lender, "Only the lender can liquidate the loan");
        require(block.timestamp >= terms.repayByTimestamp, "Cannot liquidate before the loan is due");
        selfdestruct(lender);
    }


}

