// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';

interface Ireward{
    function redeemreward(uint amount ) external;
}

contract 