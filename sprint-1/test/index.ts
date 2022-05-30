import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { ethers } from "hardhat"; // creates runtime environment
import "@nomiclabs/hardhat-waffle"; // loaded via hardhat.config but here extends typing for vscode
import { BigNumber } from "@ethersproject/bignumber";
import { ConnectFour } from "../typechain";

describe("ConnectFour", () => {
  let provider: Provider;

  const INITIALIZED_STATUS = 1;
  const STARTED_STATUS = 2;
  const FIRST_GAME_ID = 0;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const MIN_BET = BigNumber.from(0);
  const MAX_BET = ethers.utils.parseUnits("2.0");

  let p1ConnectFour: ConnectFour;
  let p2ConnectFour: ConnectFour;
  let p3ConnectFour: ConnectFour;

  const PLAYER_1_BET_AMOUNT = ethers.utils.parseUnits("1.0");

  const MAX_ROW_INDEX = 5;
  const COL_MAX_INDEX = 6;

  const Direction = {
    LeftDiagonal: 0,
    Up: 1,
    RightDiagonal: 2,
    Right: 3,
  };

  let p1Address: string;
  let p2Address: string;

  beforeEach(async () => {
    const [p1Signer, p2Signer, p3Signer, ...addrs] = await ethers.getSigners();
    provider = p1Signer.provider as Provider; // handle undefined
    p1Address = p1Signer.address;
    p2Address = p2Signer.address;

    const ConnectFourFactory = await ethers.getContractFactory("ConnectFour"); // what is the factory of these factories?
    p1ConnectFour = await ConnectFourFactory.deploy(MIN_BET, MAX_BET);
    await p1ConnectFour.deployed();

    const returnedMinBet = await p1ConnectFour.minBetAmount();
    const returnedMaxBet = await p1ConnectFour.maxBetAmount();

    expect(returnedMaxBet).to.equal(MAX_BET);
    expect(returnedMinBet).to.equal(MIN_BET);

    p2ConnectFour = p1ConnectFour.connect(p2Signer);
    p3ConnectFour = p1ConnectFour.connect(p3Signer);
  });

  it("should initialize properly and set Game state", async () => {
    const [p1Signer, p2Signer, p3Signer, ...addrs] = await ethers.getSigners();
    const GAME_ID = 0;
    await expect(p1ConnectFour.initializeGame({ value: 0 }))
      .to.emit(p1ConnectFour, "GameInitialized")
      .withArgs(0, p1Address, 0);
    // can we capture individual elements? e.g. gameId?

    const game0 = await p1ConnectFour.games(GAME_ID); // a game is a struct in solidity but here it's an array

    expect(game0.player1).to.equal(p1Address);
    expect(game0.player2).to.equal(ZERO_ADDRESS);
    expect(game0.betAmount).to.equal(0);
    expect(game0.status).to.equal(INITIALIZED_STATUS);

    let contractBalance = await provider.getBalance(p1ConnectFour.address);
    expect(contractBalance).to.equal(0);
  });

  it("should initialize 2 games", async () => {
    // init game 1
    await expect(p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT }))
      .to.emit(p1ConnectFour, "GameInitialized")
      .withArgs(FIRST_GAME_ID, p1Address, PLAYER_1_BET_AMOUNT);

    let game = await p1ConnectFour.games(FIRST_GAME_ID);

    expect(game.player1).to.equal(p1Address);
    expect(game.player2).to.equal(ZERO_ADDRESS);
    expect(game.betAmount).to.equal(PLAYER_1_BET_AMOUNT);
    expect(game.status).to.equal(INITIALIZED_STATUS);
    let contractBalance = await provider.getBalance(p1ConnectFour.address);
    expect(contractBalance).to.equal(PLAYER_1_BET_AMOUNT);

    // init game 2
    await expect(p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT }))
      .to.emit(p1ConnectFour, "GameInitialized")
      .withArgs(1, p1Address, PLAYER_1_BET_AMOUNT);

    game = await p1ConnectFour.games(1);

    expect(game.player1).to.equal(p1Address);
    expect(game.player2).to.equal(ZERO_ADDRESS);
    expect(game.betAmount).to.equal(PLAYER_1_BET_AMOUNT);
    expect(game.status).to.equal(INITIALIZED_STATUS);

    contractBalance = await provider.getBalance(p1ConnectFour.address);
    expect(contractBalance).to.equal(PLAYER_1_BET_AMOUNT.mul(2));
  });

  it("should fail to start game if incorrect value sent", async () => {
    await (
      await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })
    ).wait();
    // NOT YET IMPLEMENTED
    await expect(p2ConnectFour.startGame(FIRST_GAME_ID, { value: 0 })).to.be
      .reverted;
  });

  it("should fail to start game when called by the player who initialized it", async () => {
    await expect(p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT }))
      .to.emit(p1ConnectFour, "GameInitialized")
      .withArgs(FIRST_GAME_ID, p1Address, PLAYER_1_BET_AMOUNT);

    let game = await p1ConnectFour.games(FIRST_GAME_ID);
    await expect(
      p1ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT })
    ).to.be.reverted;
  });

  it("should fail to start a game that doesn't exist", async () => {
    await expect(p2ConnectFour.startGame(4, { value: PLAYER_1_BET_AMOUNT })).to
      .be.reverted;
  });

  it("should fail to start game when it is not in the Initialized state", async () => {
    await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT });
    await await p2ConnectFour.startGame(FIRST_GAME_ID, {
      value: PLAYER_1_BET_AMOUNT,
    });
    await expect(
      p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT })
    ).to.be.reverted;
  });

  it("should start game in correct state", async () => {
    await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT });
    await p2ConnectFour.startGame(FIRST_GAME_ID, {
      value: PLAYER_1_BET_AMOUNT,
    });
    let game = await p1ConnectFour.games(FIRST_GAME_ID);

    // copied from solution
    expect(game.player1).to.equal(p1Address);
    expect(game.player2).to.equal(p2Address);
    expect(game.betAmount).to.equal(PLAYER_1_BET_AMOUNT);
    expect(game.status).to.equal(STARTED_STATUS);
  });

  it("started game should emit event", async ()=>{
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()
    await expect(p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT }))
      .to.emit(p1ConnectFour, "GameStarted").withArgs(FIRST_GAME_ID, p2Address);
  })

  // but first test that it succeeds in playing one that has started, otherwise we get false positives.
  it("should fail to play move on game that has not started yet", async () => {
    await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT });
    await p2ConnectFour.startGame(FIRST_GAME_ID, {
      value: PLAYER_1_BET_AMOUNT,
    });
    let game = await p1ConnectFour.games(FIRST_GAME_ID);
  });

  it("should fail to play move on a game that doesn't exist", async () => {});

  it("should fail to play move on a column that is out of bounds", async () => {});

  it("should fail to play move when caller is not one of the 2 players in the game", async () => {
      await startGame();
      await expect(p3ConnectFour.playMove(FIRST_GAME_ID, 0)).to.be.reverted;
  });

  it("should fail to play move when column has all of its discs placed", async () => {});

  it("should fail to play move when it is not the caller's turn", async () => {
    // await startGame();

    // await p1ConnectFour.playMove(FIRST_GAME_ID, 0);
    // await expect(p1ConnectFour.playMove(FIRST_GAME_ID, 0)).to.be.reverted
  });

  // start here- prove it works before doing the fail cases above
  it("should play move correctly for player 1", async () => {
      startGame();

    //   await p1ConnectFour.playMove(FIRST_GAME_ID, 0);

  });

  it("should play move correctly for player 2", async () => {});

  it("should play 2 moves correctly in the same column", async () => {});

  it("should fail to claim when game is in the wrong state", async () => {});

  it("should fail to claim when the four-in-a-row dics are out of bounds", async () => {});

  it("should fail to claim reward when coordinates are for discs of different players", async () => {});

  it("should fail to claim reward when four-in-a-row is for the discs of opposing player", async () => {});

  it("should correctly claim reward in right direction", async () => {});

  it("should correctly claim reward in up direction", async () => {});

  it("should correctly claim reward in left diagonal direction", async () => {});

  it("should correctly claim reward in right diagonal direction", async () => {});

  const startGame = async () => {
    const [p1Signer, p2Signer, p3Signer, ...addrs] = await ethers.getSigners();
    await (await p1ConnectFour.initializeGame({ value: PLAYER_1_BET_AMOUNT })).wait()
    p2ConnectFour = p1ConnectFour.connect(p2Signer);
    await (await p2ConnectFour.startGame(FIRST_GAME_ID, { value: PLAYER_1_BET_AMOUNT }))
  }
});
