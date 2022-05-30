import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { ethers } from "hardhat";  // creates runtime environment
import '@nomiclabs/hardhat-waffle' // loaded via hardhat.config but here extends typing for vscode
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

  let p1Address: string

  beforeEach(async () => {
    const [p1Signer, p2Signer, p3Signer, ...addrs] = await ethers.getSigners();
    provider = p1Signer.provider as Provider; // handle undefined
    p1Address = p1Signer.address;

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
    await expect(p1ConnectFour.initializeGame({value:0})).to.emit(p1ConnectFour, "GameInitialized").withArgs(0, p1Address, 0)
    // can we capture individual elements? e.g. gameId?  

    const game0 = await p1ConnectFour.games(GAME_ID); // a game is a struct in solidity but here it's an array
    console.log("GAME", game0)

    expect(game0.player1).to.equal(p1Address);
    expect(game0.player2).to.equal(ZERO_ADDRESS);
    expect(game0.betAmount).to.equal(0);
    expect(game0.status).to.equal(INITIALIZED_STATUS);

    let contractBalance = await provider.getBalance(p1ConnectFour.address)
    console.log("contract balance", p1ConnectFour.address)
    expect(contractBalance).to.equal(0);   

    
    // game counter increments (if global state is available)

    // expect(await p1ConnectFour.games(gameId));

    // board exists on game and is empty

    // gameID in game array

    // check for emission
  });

  it("should initialize 2 games", async () => {});

  it("should fail to start game if incorrect value sent", async () => {});

  it("should fail to start game when called by the player who initialized it", async () => {});

  it("should fail to start a game that doesn't exist", async () => {});

  it("should fail to start game when it is not in the Initialized state", async () => {});

  it("should start game in correct state", async () => {});

  it("should fail to play move on game that has not started yet", async () => {});

  it("should fail to play move on a game that doesn't exist", async () => {});

  it("should fail to play move on a column that is out of bounds", async () => {});

  it("should fail to play move when caller is not one of the 2 players in the game", async () => {});

  it("should fail to play move when column has all of its discs placed", async () => {});

  it("should fail to play move when it is not the caller's turn", async () => {});

  it("should play move correctly for player 1", async () => {});

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
});
