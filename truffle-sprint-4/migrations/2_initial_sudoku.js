const myContract = artifacts.require("SudokuMarketplace");

module.exports = function(deployer){
  deployer.deploy(myContract);
}