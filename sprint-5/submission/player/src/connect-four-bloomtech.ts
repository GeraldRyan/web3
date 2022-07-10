import { bigInt, BigInt } from "@graphprotocol/graph-ts"
import {
  ConnectFourBloomtech,
  BoardUpdated,
  GameInitialized,
  GameStarted,
  RewardClaimed
} from "../generated/ConnectFourBloomtech/ConnectFourBloomtech"
import { Player } from "../generated/schema"

export function handleGameInitialized(event: GameInitialized): void {

  let player = Player.load(event.params.player1.toHex())
  if (player == null) {
    player = new Player(event.params.player1.toHex())
  }
  player.totalGames += 1;
  player.totalBets = player.totalBets.plus(event.params.betAmount);


  // if (player.totalClaimed == null){
  //   player.netProfit = BigInt.fromI32(0).minus(player.totalBets);
  // }
  // else {
  player.netProfit = player.totalClaimed.minus(player.totalBets);
  // }

  player.save();
}

export function handleGameStarted(event: GameStarted): void {
  let player = Player.load(event.params.player2.toHex());
  if (player == null) {
    player = new Player(event.params.player2.toHex());
  }
  player.totalGames += 1;
  player.totalBets = player.totalBets.plus(event.transaction.value);

  player.netProfit = player.totalClaimed.minus(player.totalBets);
  player.save();
}

export function handleRewardClaimed(event: RewardClaimed): void {
  let player = Player.load(event.params.winner.toHex());
  if (player == null) {
    return;
  }
  player.gamesWon += 1;

  player.totalClaimed = player.totalClaimed.plus(event.params.rewardAmount);

  player.netProfit = player.totalClaimed.minus(player.totalBets);
  player.save();
}
