//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMyCompanyOracle {
    function getcurentValue(IERC20 token) external returns (uint256);
}

contract fourthContract is Ownable {

    IERC20 public token;
    IMyCompanyOracle public oracle;
    mapping(address => uint256) public Investors;

    constructor (address tokenAddress, address MyoracleAddress) {
        token = IERC20(tokenAddress);
        oracle = IMyCompanyOracle(MyoracleAddress);
    }


    function Invest(uint256 amount) external payable {

        uint256 deposit = amount * oracle.getcurentValue(token);
        
     
        
        token.transfer(msg.sender, amount);

        Investors[msg.sender] += deposit;
    }

    
}