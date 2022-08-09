// SPDX-License-Identifier: GPL-3.0-or-later
 
pragma solidity 0.8.0;
 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
 
interface Ireward{
   function redeemreward(uint amount)external;
}
 
contract staking is ERC20("XBloom", "xBloom"), Ownable {
   IERC20 ?????;
   Ireward ?????;
 
   mapping (address=>uint)trackblock;
 
   mapping (address=>bool)checkifstaked;
 
   
   function setxBloomcontractadd(address add)public onlyOwner{
      ????????=IERC20(add);
  
   }
   function setrewardaddress(address add)public onlyOwner{
      ??????=Ireward(add);
   }
 
  function stake(uint amount)public{
       require(_xBloom.balanceOf(msg.sender)>= amount*10**18 ,"not enough balance" );
       require(checkifstaked[msg.sender]==false,"please redeem stake before staking again");
       trackblock[msg.sender]=block.number;
        _mint(msg.sender, amount*10**18);
        checkifstaked[msg.sender]=true;
        _xBloom.transferFrom(msg.sender,address(this),amount*10**18);
 
   } 
 
  function ????????()public{
    require(checkifstaked[msg.sender]==true, "cant redeem you havent staked");
     uint rewardblockno= block.number- trackblock[msg.sender];
    uint reward=rewardblockno*(10*10**18);
    uint _reward= balanceOf(msg.sender)+reward;
     checkifstaked[msg.sender]=false;
    _burn(msg.sender,balanceOf(msg.sender));
    _Ireward.redeemreward(reward);
    _xBloom.transfer(msg.sender,_reward);
 
  }
 
}

