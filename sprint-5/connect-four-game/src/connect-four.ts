import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ConnectFour,
  BoardUpdated,
  GameInitialized,
  GameStarted,
  RewardClaimed
} from "../generated/ConnectFour/ConnectFour"
import { Game } from "../generated/schema"

export function handleGameInitialized(event: GameInitialized): void {
  let game = new Game(event.params.gameId.toString().padStart(5,"0"));
  game.betAmount = event.params.betAmount;
  game.player1 = event.params.player1;
  game.status = "initialized";
  game.nextPlayer = new Address(0);
  game.save();
}

export function handleGameStarted(event: GameStarted): void {
  let id = event.params.gameId.toString().padStart(5, "O");
  let game = Game.load(id);
  if (game == null){
    return;
  }
  game.player2 = event.params.player2;
  game.status = "started";
  game.nextPlayer = game.player1;
  game.save();
}

export function handleBoardUpdated(event: BoardUpdated): void {

  let id = event.params.gameId.toString().padStart(5, "0");
  let game = Game.load(id);
  if ( game === null){
    return;
  }  
  let moves = game.moves;
  if (moves == null){
    moves = []
  }
  moves.push(event.params.boardIndex) // Instructor uses number/int8 but I deployed with bigint already 
  game.moves = moves;
  if (event.params.player == 1){
    game.nextPlayer = game.player2;
  }
  else {
    game.nextPlayer = game.player1;
  }
  game.save();
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.boardIndex(...)
  // - contract.games(...)
  // - contract.maxBetAmount(...)
  // - contract.minBetAmount(...)
}

export function handleRewardClaimed(event: RewardClaimed): void {
  let id = event.params.gameId.toString().padStart(5, "0");
  let game = Game.load(id);
  if (game == null){
    return;
  }
  game.winner = event.params.winner;
  game.status = "finished";
  game.save();
}
