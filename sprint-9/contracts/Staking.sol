// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

interface Ireward{
    function redeemreward(uint amount ) external;
}

contract staking is ERC20("XBloom", "xBloom"), Ownable{
    IERC20 _xBloom;
    Ireward _Ireward;

    mapping(address=> uint256)trackblock;
    mapping(address=> bool) checkifstaked;

    function setBloomcontractadd(address add)public onlyOwner{
        _Ireward=Ireward(add);
    }
    
    function setrewardaddress(address add) public onlyOwner{
        _xBloom=IERC20(add);
    }

    function stake (uint amount) public {
        require(_xBloom.balanceOf(msg.sender)>= amount*10**18,"Not enough balance");
        require(checkifstaked[msg.sender]==false, "please redeem stake before staking again");
        trackblock[msg.sender]=block.number;
        _mint(msg.sender, amount*10**18);
        checkifstaked[msg.sender]= true;
        _xBloom.transferFrom(msg.sender, address(this), amount*10**18);
    } 

    function redeem()public{
        require(checkifstaked[msg.sender]==true, "can't redeem since you haven't staked");
        uint rewardblockno = block.number - trackblock[msg.sender];
        uint reward =rewardblockno*(10*10**18);
        uint _reward = balanceOf(msg.sender)+reward;
        checkifstaked[msg.sender] = false;
        _burn(msg.sender, balanceOf(msg.sender));
        _Ireward.redeemreward(reward);
        _xBloom.transfer(msg.sender, _reward);
    }


}