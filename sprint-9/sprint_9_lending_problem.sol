// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.0;
 
pragma experimental ????????;

import './??????????.sol';
 
contract lending {
 
   struct Terms {

       uint256 loanDaiAmount;

       uint256 feeDaiAmount;

       uint256 ethCollateralAmount;

       uint256 repayByTimestamp;
   }
 
   Terms public terms;

   enum LoanState {
       ???????,
       ?????,
       ?????
       }
   LoanState public state;
 
   modifier onlyInState(LoanState expectedState) {
       require(state == expectedState, "Not allowed in this state");
       _;
   }
 
   address payable public lender;
   address payable public borrower;
   address public daiAddress;
 
   constructor(Terms memory _terms, address _daiAddress) {
       terms = _terms;
       daiAddress = _daiAddress;
       address lender = msg.sender;
       state = LoanState.Created;
   }
 
   function fundLoan() public onlyInState(LoanState.Created) {

       state = LoanState.Funded;
       BloomToken(daiAddress).transferFrom(
           msg.sender,
           address(this),
           terms.loanDaiAmount
       );
   }

   function takeLoanAndAcceptLoanTerms() public payable onlyInState(LoanState.Funded) {

       require(msg.value == terms.ethCollateralAmount, "Invalid collateral amount");

       address borrower = msg.sender;
       state = LoanState.Taken;

       BloomToken(daiAddress).transfer(borrower, terms.loanDaiAmount);
   }
 
   function repay() public onlyInState(LoanState.Taken) {

       require(msg.sender == borrower, "Only the borrower can repay the loan");

       BloomToken(daiAddress).transferFrom(
           borrower,
           lender,
           terms.loanDaiAmount + terms.feeDaiAmount
       );
       selfdestruct(borrower);
   }
 
}

