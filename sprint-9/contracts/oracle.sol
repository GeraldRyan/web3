// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import '../../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

AggregatorV3Interface internal priceFeed;

contract PriceConsumerV3{
    priceFeed = AggregatorV3Interface()
}
