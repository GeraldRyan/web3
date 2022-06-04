import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";


import {
  ConnectFour
} from "../typechain"


describe("ConnectFour", () => {


  let player1: string
  let player2: string


  let provider: Provider


  const INITIALIZED_STATUS = 1
  const STARTED_STATUS = 2
  const FIRST_GAME_ID = 0
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
  const MIN_BET = BigNumber.from(0);
  const MAX_BET = ethers.utils.parseUnits("2.0")


  let p1ConnectFour: ConnectFour
  let p2ConnectFour: ConnectFour
  let p3ConnectFour: ConnectFour


  const PLAYER_1_BET_AMOUNT = ethers.utils.parseUnits("1.0")


  const MAX_ROW_INDEX = 5
  const COL_MAX_INDEX = 6


  const Direction = {
    LeftDiagonal: 0,
    Up: 1,
    RightDiagonal: 2,
    Right: 3
  }


  beforeEach(async () => {
    const [player1Signer, player2Signer, player3Signer] = await ethers.getSigners();
    player1 = player1Signer.address
    player2 = player2Signer.address


    provider = player1Signer.provider as Provider


    const ConnectFour = await ethers.getContractFactory("ConnectFour")
    p1ConnectFour = await ConnectFour.deploy(MIN_BET, MAX_BET)
    await p1ConnectFour.deployed()


    const actualMinBetAmount = await p1ConnectFour.minBetAmount()
    const actualMaxBetAmount = await p1ConnectFour.maxBetAmount()


    expect(actualMinBetAmount).to.equal(MIN_BET)
    expect(actualMaxBetAmount).to.equal(MAX_BET)


    // we'll use this to execute functions where the msg.sender is player2 and player3
    p2ConnectFour = p1ConnectFour.connect(player2Signer)
    p3ConnectFour = p1ConnectFour.connect(player3Signer)
  })


  it("should initialize properly and set Game state", async () => {
    const actualGameId = 0
    await expect(p1ConnectFour.initializeGame({ value: 0 }))
      .to.emit(p1ConnectFour, "GameInitialized")
      .withArgs(actualGameId, player1, 0)


    const game = await p1ConnectFour.games(actualGameId)


    expect(game.player1).to.equal(player1)
    expect(game.player2).to.equal(ZERO_ADDRESS)
    expect(game.betAmount).to.equal(0)
    expect(game.status).to.equal(INITIALIZED_STATUS)
    expect(game.isPlayer1Turn).to.equal(true)


    const contractBalance = await provider.getBalance(p1ConnectFour.address)
    expect(contractBalance).to.equal(0)
  })


  it("should initialize 2 games", async () => {
    await expect(p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT }))
      .to.emit(p1ConnectFour, "GameInitialized")
      .withArgs(FIRST_GAME_ID, player1, PLAYER_1_BET_AMOUNT)


    let game = await p1ConnectFour.games(FIRST_GAME_ID)


    expect(game.player1).to.equal(player1)
    expect(game.player2).to.equal(ZERO_ADDRESS)
    expect(game.betAmount).to.equal(PLAYER_1_BET_AMOUNT)
    expect(game.status).to.equal(INITIALIZED_STATUS)
    let contractBalance = await provider.getBalance(p1ConnectFour.address)
    expect(contractBalance).to.equal(PLAYER_1_BET_AMOUNT)


    await expect(p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT }))
      .to.emit(p1ConnectFour, "GameInitialized")
      .withArgs(1, player1, PLAYER_1_BET_AMOUNT)


    game = await p1ConnectFour.games(1)


    expect(game.player1).to.equal(player1)
    expect(game.player2).to.equal(ZERO_ADDRESS)
    expect(game.betAmount).to.equal(PLAYER_1_BET_AMOUNT)
    expect(game.status).to.equal(INITIALIZED_STATUS)


    contractBalance = await provider.getBalance(p1ConnectFour.address)
    expect(contractBalance).to.equal(PLAYER_1_BET_AMOUNT.mul(2))
  })


  it("should fail to start game if incorrect value sent", async () => {
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()


    await expect(p2ConnectFour.startGame(FIRST_GAME_ID, { value: 0 }))
      .to.be.reverted
  })


  it("should fail to start game when called by the player who initialized it", async () => {
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()

    await expect(p1ConnectFour.startGame(FIRST_GAME_ID, { value: 0 }))
      .to.be.reverted
  })


  it("should fail to start a game that doesn't exist", async () => {
    await expect(p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT }))
      .to.be.reverted
  })




  it("should fail to start game when it is not in the Initialized state", async () => {
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()
    await (await p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT }))


    await expect(p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT }))
      .to.be.reverted
  })


  it("should start game in correct state", async () => {
    console.log("PLayer 2", player2);
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()
    await (await p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT }))


    let game = await p1ConnectFour.games(FIRST_GAME_ID)


    expect(game.player1).to.equal(player1)
    expect(game.player2).to.equal(player2)

    expect(game.betAmount).to.equal(PLAYER_1_BET_AMOUNT)
    expect(game.status).to.equal(STARTED_STATUS)
  })



  it("should fail to play move on game that has not started yet", async () => {
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()


    await expect(p1ConnectFour.playMove(FIRST_GAME_ID, 0))
      .to.be.reverted
  })


  it("should fail to play move on a game that doesn't exist", async () => {
    await expect(p1ConnectFour.playMove(FIRST_GAME_ID, 0))
      .to.be.reverted
  })


  it("should fail to play move on a column that is out of bounds", async () => {
    await startAGame()


    await expect(p1ConnectFour.playMove(FIRST_GAME_ID, 7))
      .to.be.reverted
  })


  it("should fail to play move when caller is not one of the 2 players in the game", async () => {
    await startAGame()


    await expect(p3ConnectFour.playMove(FIRST_GAME_ID, 42))
      .to.be.reverted
  })


  it("should fail to play move when column has all of its discs placed", async () => {
    await startAGame()


    // now fill up a column
    for (let i = 0; i < 6; i++) {
      const currentConnectFour = i % 2 === 0 ? p1ConnectFour : p2ConnectFour
      await currentConnectFour.playMove(FIRST_GAME_ID, 0)
    }


    // now column 0 has all of its rows filled up, and when we try to play another
    // disc in that column it reverts
    await expect(p2ConnectFour.playMove(FIRST_GAME_ID, 0))
      .to.be.reverted
  })


  it("should fail to play move when it is not the caller's turn", async () => {
    await startAGame()


    await expect(p2ConnectFour.playMove(FIRST_GAME_ID, 42))
      .to.be.reverted


    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)


    await expect(p1ConnectFour.playMove(FIRST_GAME_ID, 42))
      .to.be.reverted
  })


  it("should play move correctly for player 1", async () => {
    await startAGame()


    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)
  })


  it("should play move correctly for player 2", async () => {
    await startAGame()


    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)


    await p2ConnectFour.playMove(FIRST_GAME_ID, 1)


    const game = await p1ConnectFour.games(FIRST_GAME_ID)
  })


  it("should play 2 moves correctly in the same column", async () => {
    await startAGame()


    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)


    await p2ConnectFour.playMove(FIRST_GAME_ID, 0)
  })


  it("should fail to claim when game is in the wrong state", async () => {
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()


    await expect(p2ConnectFour.claimReward(FIRST_GAME_ID, player1, 0, 0, Direction.Up))
      .to.be.reverted
  })


  it("should fail to claim when the four-in-a-row dics are out of bounds", async () => {
    await startAGame()


    await expect(p2ConnectFour.claimReward(FIRST_GAME_ID, player1, 7, 8, Direction.Up))
      .to.be.reverted
    await expect(p2ConnectFour.claimReward(FIRST_GAME_ID, player1, 0, 10, Direction.Up))
      .to.be.reverted
  })


  it("should fail to claim reward when coordinates are for discs of different players", async () => {
    await startAGame()


    // fill up a column with alternating player's discs
    for (let i = 0; i < 6; i++) {
      const currentConnectFour = i % 2 === 0 ? p1ConnectFour : p2ConnectFour
      await currentConnectFour.playMove(FIRST_GAME_ID, 0)
    }


    // now try to falsly claim this is a winning four-in-a-row for player 1, which should
    // fail because the four-in-a-row has both player1 and player's discs
    await expect(p1ConnectFour.claimReward(FIRST_GAME_ID, player1, 0, 0, Direction.Up))
      .to.be.reverted


    // now with player 2
    await expect(p2ConnectFour.claimReward(FIRST_GAME_ID, player2, 0, 0, Direction.Up))
      .to.be.reverted
  })


  it("should fail to claim reward when four-in-a-row is for the discs of opposing player", async () => {
    await startAGame()


    // fill up a column with alternating player's discs
    for (let i = 0; i <= MAX_ROW_INDEX * 2; i++) {
      const currentConnectFour = i % 2 === 0 ? p1ConnectFour : p2ConnectFour
      // make the two opponents place their disc in different rows
      const currCol = i % 2 === 0 ? 0 : 1
      await currentConnectFour.playMove(FIRST_GAME_ID, currCol)
    }


    // now try to falsly claim this is a winning four-in-a-row for player 2, which should
    // fail because the four-in-a-row has only player 1's discs
    await expect(p2ConnectFour.claimReward(FIRST_GAME_ID, player2, 0, 0, Direction.Up))
      .to.be.reverted


    // now with player 2
    await expect(p1ConnectFour.claimReward(FIRST_GAME_ID, player1, 1, 0, Direction.Up))
      .to.be.reverted
  })


  it("should correctly claim reward in right direction", async () => {
    const beginningBalance = await provider.getBalance(player1)
    await startAGame()


    // play 4 moves
    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 1)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 2)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 3)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await expect(p1ConnectFour.claimReward(FIRST_GAME_ID, player1, 0, 0, Direction.Right))
      .to.emit(p1ConnectFour, "RewardClaimed")
      .withArgs(FIRST_GAME_ID, player1, player1, PLAYER_1_BET_AMOUNT.mul(2))


    let contractBalance = await provider.getBalance(p1ConnectFour.address)
    expect(contractBalance).to.equal(0)


    // show that the winner increased their balance by their initial bet amount
    contractBalance = await provider.getBalance(player1)
    expect(contractBalance.sub(beginningBalance)).to.be.closeTo(PLAYER_1_BET_AMOUNT, ethers.utils.parseEther("0.001").toNumber()) // gas discrepancy
  })


  it("should correctly claim reward in up direction", async () => {
    const beginningBalance = await provider.getBalance(player2)
    await startAGame()


    // play 4 moves
    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 1)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 2)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 3)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await expect(p2ConnectFour.claimReward(FIRST_GAME_ID, player2, COL_MAX_INDEX, 0, Direction.Up))
      .to.emit(p1ConnectFour, "RewardClaimed")
      .withArgs(FIRST_GAME_ID, player2, player2, PLAYER_1_BET_AMOUNT.mul(2))


    let contractBalance = await provider.getBalance(p2ConnectFour.address)
    expect(contractBalance).to.equal(0)


    // show that the winner increased their balance by their initial bet amount
    contractBalance = await provider.getBalance(player2)
    expect(contractBalance.sub(beginningBalance)).to.be.closeTo(PLAYER_1_BET_AMOUNT, ethers.utils.parseEther("0.001").toNumber()) // gas discrepancy
  })


  it("should correctly claim reward in left diagonal direction", async () => {
    const beginningBalance = await provider.getBalance(player1)
    await startAGame()


    // this will create a winning four-in-a-row for player1
    // -------------------------
    // |/  /  /  /  /  /  /  /|
    // |/  /  /  /  /  /  /  /|
    // |/p1/  /  /  /  /  /  /|
    // |/p1/p1/  /  /  /  /  /|
    // |/p2/p2/p1/  /  /  /  /|
    // |/p1/p2/p2/p1/  /  /p2/|
    // -------------------------


    await p1ConnectFour.playMove(FIRST_GAME_ID, 3)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 2)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 2)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 1)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 1)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 1)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 0)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)
    await p2ConnectFour.playMove(FIRST_GAME_ID, COL_MAX_INDEX)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 0)


    await expect(p1ConnectFour.claimReward(FIRST_GAME_ID, player1, 3, 0, Direction.LeftDiagonal))
      .to.emit(p1ConnectFour, "RewardClaimed")
      .withArgs(FIRST_GAME_ID, player1, player1, PLAYER_1_BET_AMOUNT.mul(2))


    let contractBalance = await provider.getBalance(p1ConnectFour.address)
    expect(contractBalance).to.equal(0)


    // show that the winner increased their balance by their initial bet amount
    contractBalance = await provider.getBalance(player1)
    expect(contractBalance.sub(beginningBalance)).to.be.closeTo(PLAYER_1_BET_AMOUNT, ethers.utils.parseEther("0.001").toNumber()) // gas discrepancy
  })


  it("should correctly claim reward in right diagonal direction", async () => {
    const beginningBalance = await provider.getBalance(player1)
    await startAGame()


    // this will create a winning four-in-a-row for player1
    // -------------------------
    // |/  /  /  /  /  /  /  /|
    // |/  /  /  /  /  /  /  /|
    // |/  /  /  /  /  /  /p1/|
    // |/  /  /  /  /  /p1/p1/|
    // |/  /  /  /  /p1/p2/p2/|
    // |/p2/  /  /p1/p2/p2/p1/|
    // -------------------------


    await p1ConnectFour.playMove(FIRST_GAME_ID, 3)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 4)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 4)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 5)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 6)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 5)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 5)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 6)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 6)
    await p2ConnectFour.playMove(FIRST_GAME_ID, 0)


    await p1ConnectFour.playMove(FIRST_GAME_ID, 6)


    await expect(p1ConnectFour.claimReward(FIRST_GAME_ID, player1, 3, 0, Direction.RightDiagonal))
      .to.emit(p1ConnectFour, "RewardClaimed")
      .withArgs(FIRST_GAME_ID, player1, player1, PLAYER_1_BET_AMOUNT.mul(2))


    let contractBalance = await provider.getBalance(p1ConnectFour.address)
    expect(contractBalance).to.equal(0)


    // show that the winner increased their balance by their initial bet amount
    contractBalance = await provider.getBalance(player1)
    expect(contractBalance.sub(beginningBalance)).to.be.closeTo(PLAYER_1_BET_AMOUNT, ethers.utils.parseEther("0.001").toNumber()) // gas discrepancy
  })


  const startAGame = async () => {
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()
    await (await p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT }))
  }


});