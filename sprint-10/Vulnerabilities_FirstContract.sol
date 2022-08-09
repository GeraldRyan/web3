//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract firstContract {
  mapping (address => uint) public balances;
    
  function donate(address to) payable public{
    balances[to] += msg.value;
  }
    
  function withdraw(uint amount) public{
    if (balances[msg.sender]>= amount) {

       (bool success,) = msg.sender.call{value: amount}(""); 
      
        require(success, "Transfer failed.");

      balances[msg.sender]-=amount;
    }
  }  

  function balanceOf(address to) view public returns(uint){
    return balances[to];
  }
}
