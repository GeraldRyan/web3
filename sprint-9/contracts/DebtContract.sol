// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import {DAI} from './DAI.sol';

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


}

