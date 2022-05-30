// import { Provider } from "@ethersproject/abstract-provider";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { BigNumber } from "@ethersproject/bignumber";
// import {
//  ConnectFour
// } from "../typechain"


// describe("ConnectFour", () => {


//   let player1: string
//   let player2: string


//   let provider: Provider

  
//   const INITIALIZED_STATUS = 1
//   const STARTED_STATUS = 2
//   const FIRST_GAME_ID = 0
//   const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
//   const MIN_BET = BigNumber.from(0);
//   const MAX_BET = ethers.utils.parseUnits("2.0")

//   let p1cf: ConnectFour
//   let p2cf: ConnectFour
//   let p3cf: ConnectFour

//   const PLAYER_1_BET_AMOUNT = ethers.utils.parseUnits("1.0")

//   const MAX_ROW_INDEX = 5
//   const COL_MAX_INDEX = 6


//   const Direction = {
//     LeftDiagonal: 0,
//     Up: 1,
//     RightDiagonal: 2,
//     Right: 3
//   }


//   beforeEach(async () => {
//     const [player1Signer, player2Signer, player3Signer, ...addrs] = await ethers.getSigners(); // why are there three? Why are there any at this point? 
//     const p1 = player1Signer.address;
//     const p2 = player2Signer.address;

//     const provider = player1Signer.provider;

//     const ConnectFourFactory = await ethers.getContractFactory("ConnectFour");  // what is the factory of these factories? 
//     p1cf = await ConnectFourFactory.deploy(MIN_BET,MAX_BET);
//     await p1cf.deployed(); // can't find purpose of this

//     const actualMinBet = await p1cf.minBetAmount(); // is this created automatically from property? 
//     const actualMaxBet = await p1cf.maxBetAmount();

//     expect(actualMaxBet).to.equal(MAX_BET);
//     expect(actualMinBet).to.equal(MIN_BET);
//   })


//   it("should initialize properly and set Game state", async () => {
//     // gameId correct, i.e. 0
//     // where does the gameId live? It's only spit out once in initializeGame? Oh we haven't init yet. 
//     const gameId = await p1cf.initializeGame({value:1})  // where in the docs is it written to use an {} to sub for msg? Also this does NOT return a gameID but a Transaction object. Yet we return a gameId in the contract file. Somewhere it gets mutated. 
//     expect(gameId).to.equal(0);
    
//     // game counter increments (if global state is available)

//     expect(await p1cf.games(gameId))

//     // board exists on game and is empty

//     // gameID in game array

//     // check for emission
//   })


//   it("should initialize 2 games", async () => {
//   })


//   it("should fail to start game if incorrect value sent", async () => {
//   })


//   it("should fail to start game when called by the player who initialized it", async () => {
//   })


//   it("should fail to start a game that doesn't exist", async () => {
//   })


//   it("should fail to start game when it is not in the Initialized state", async () => {
//   })


//   it("should start game in correct state", async () => {
//   })


//   it("should fail to play move on game that has not started yet", async () => {
//   })


//   it("should fail to play move on a game that doesn't exist", async () => {
//   })


//   it("should fail to play move on a column that is out of bounds", async () => {
//   })


//   it("should fail to play move when caller is not one of the 2 players in the game", async () => {
//   })


//   it("should fail to play move when column has all of its discs placed", async () => {
//   })


//   it("should fail to play move when it is not the caller's turn", async () => {
//   })


//   it("should play move correctly for player 1", async () => {
//   })


//   it("should play move correctly for player 2", async () => {
//   })


//   it("should play 2 moves correctly in the same column", async () => {
//   })


//   it("should fail to claim when game is in the wrong state", async () => {
//   })


//   it("should fail to claim when the four-in-a-row dics are out of bounds", async () => {
//   })


//   it("should fail to claim reward when coordinates are for discs of different players", async () => {
//   })


//   it("should fail to claim reward when four-in-a-row is for the discs of opposing player", async () => {
//   })


//   it("should correctly claim reward in right direction", async () => {
//   })


//   it("should correctly claim reward in up direction", async () => {
//   })


//   it("should correctly claim reward in left diagonal direction", async () => {
//   })


//   it("should correctly claim reward in right diagonal direction", async () => {
//   })
// });