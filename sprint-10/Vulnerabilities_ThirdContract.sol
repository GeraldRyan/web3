//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Address.sol";
contract thirdContract {
    using Address for address payable;
    bytes32 private hashedkey; 
    
    constructor(bytes32 _hash) payable {
        hashedkey = _hash;
        }

    function AskForTheReward(bytes memory password) external  {
        bytes32 hashedPassword = keccak256(password);
        // If a user is able to get the secret, he will to take the reward 
        require(hashedPassword == hashedkey, "Incorrect Password");
        sendFunds(payable(msg.sender));
        }
        
    function sendFunds(address payable to) internal {
        uint256 amount = address(this).balance; // amount will contain the balance the contract instance
        require(address(this).balance >= amount, "Address: insufficient balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
         }

    function getHashedKey() public view returns (bytes32) { 
    return hashedkey; 
    }
 
 }