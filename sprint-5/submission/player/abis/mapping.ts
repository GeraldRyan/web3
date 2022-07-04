import {
  GameInitialized as GameInitializedEvent,
  GameStarted as GameStartedEvent,
  RewardClaimed as RewardClaimedEvent,
} from "../generated/ConnectFour/ConnectFour";

import { Player } from "../generated/schema";

export function handleGameInitialized(event: GameInitializedEvent): void {
  let player = Player.load(event.params.player1.toHex());
  if (player === null) {
    player = new Player(event.params.player1.toHex());
  }
  player.totalGames += 1;
  player.totalBets = player.totalBets.plus(event.params.betAmount);
  player.netProfit = player.totalClaimed.minus(player.totalBets);
  player.save();
}

export function handleGameStarted(event: GameStartedEvent): void {
  let player = Player.load(event.params.player2.toHex());
  if (player === null) {
    player = new Player(event.params.player2.toHex());
  }
  player.totalGames += 1;
  player.totalBets = player.totalBets.plus(event.transaction.value);
  player.netProfit = player.totalClaimed.minus(player.totalBets);
  player.save();
}

export function handleRewardClaimed(event: RewardClaimedEvent): void {
  let player = Player.load(event.params.winner.toHex());
  if (player === null) {
    return;
  }
  player.gamesWon += 1;
  player.totalClaimed = player.totalClaimed.plus(event.params.rewardAmount);
  player.netProfit = player.totalClaimed.minus(player.totalBets);
  player.save();
}
