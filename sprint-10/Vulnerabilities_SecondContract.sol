//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/math/SafeMath.sol";

contract secondContract {
    
 using SafeMath for uint256;
    uint256[] public marks;
    bool registered = false;

    function addmark(uint256 mark) public {
                marks.push(mark) ;
    }
    

    function average()  view public returns (uint256) {
    uint256 result =0;
        
        for(uint i=0;i<marks.length;i++) {
         result +=marks[i];
         
                 }
            return  result.div(marks.length, "error to get the average");
        }

  

}