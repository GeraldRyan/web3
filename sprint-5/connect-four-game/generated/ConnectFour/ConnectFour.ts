// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class BoardUpdated extends ethereum.Event {
  get params(): BoardUpdated__Params {
    return new BoardUpdated__Params(this);
  }
}

export class BoardUpdated__Params {
  _event: BoardUpdated;

  constructor(event: BoardUpdated) {
    this._event = event;
  }

  get gameId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get player(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get boardIndex(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class GameInitialized extends ethereum.Event {
  get params(): GameInitialized__Params {
    return new GameInitialized__Params(this);
  }
}

export class GameInitialized__Params {
  _event: GameInitialized;

  constructor(event: GameInitialized) {
    this._event = event;
  }

  get gameId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get player1(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get betAmount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class GameStarted extends ethereum.Event {
  get params(): GameStarted__Params {
    return new GameStarted__Params(this);
  }
}

export class GameStarted__Params {
  _event: GameStarted;

  constructor(event: GameStarted) {
    this._event = event;
  }

  get gameId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get player2(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class RewardClaimed extends ethereum.Event {
  get params(): RewardClaimed__Params {
    return new RewardClaimed__Params(this);
  }
}

export class RewardClaimed__Params {
  _event: RewardClaimed;

  constructor(event: RewardClaimed) {
    this._event = event;
  }

  get gameId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get winner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get recipient(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get rewardAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class ConnectFour__gamesResult {
  value0: Address;
  value1: Address;
  value2: BigInt;
  value3: i32;
  value4: boolean;

  constructor(
    value0: Address,
    value1: Address,
    value2: BigInt,
    value3: i32,
    value4: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set(
      "value3",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value3))
    );
    map.set("value4", ethereum.Value.fromBoolean(this.value4));
    return map;
  }

  getPlayer1(): Address {
    return this.value0;
  }

  getPlayer2(): Address {
    return this.value1;
  }

  getBetAmount(): BigInt {
    return this.value2;
  }

  getStatus(): i32 {
    return this.value3;
  }

  getIsPlayer1Turn(): boolean {
    return this.value4;
  }
}

export class ConnectFour extends ethereum.SmartContract {
  static bind(address: Address): ConnectFour {
    return new ConnectFour("ConnectFour", address);
  }

  boardIndex(_col: BigInt, _row: BigInt): BigInt {
    let result = super.call(
      "boardIndex",
      "boardIndex(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_col),
        ethereum.Value.fromUnsignedBigInt(_row)
      ]
    );

    return result[0].toBigInt();
  }

  try_boardIndex(_col: BigInt, _row: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "boardIndex",
      "boardIndex(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_col),
        ethereum.Value.fromUnsignedBigInt(_row)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  games(param0: BigInt): ConnectFour__gamesResult {
    let result = super.call(
      "games",
      "games(uint256):(address,address,uint256,uint8,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new ConnectFour__gamesResult(
      result[0].toAddress(),
      result[1].toAddress(),
      result[2].toBigInt(),
      result[3].toI32(),
      result[4].toBoolean()
    );
  }

  try_games(param0: BigInt): ethereum.CallResult<ConnectFour__gamesResult> {
    let result = super.tryCall(
      "games",
      "games(uint256):(address,address,uint256,uint8,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ConnectFour__gamesResult(
        value[0].toAddress(),
        value[1].toAddress(),
        value[2].toBigInt(),
        value[3].toI32(),
        value[4].toBoolean()
      )
    );
  }

  maxBetAmount(): BigInt {
    let result = super.call("maxBetAmount", "maxBetAmount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_maxBetAmount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("maxBetAmount", "maxBetAmount():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  minBetAmount(): BigInt {
    let result = super.call("minBetAmount", "minBetAmount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_minBetAmount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("minBetAmount", "minBetAmount():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _minBetAmount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _maxBetAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ClaimRewardCall extends ethereum.Call {
  get inputs(): ClaimRewardCall__Inputs {
    return new ClaimRewardCall__Inputs(this);
  }

  get outputs(): ClaimRewardCall__Outputs {
    return new ClaimRewardCall__Outputs(this);
  }
}

export class ClaimRewardCall__Inputs {
  _call: ClaimRewardCall;

  constructor(call: ClaimRewardCall) {
    this._call = call;
  }

  get _gameId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _recipient(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _startingWinDiscCol(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _startingWinDiscRow(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _direction(): i32 {
    return this._call.inputValues[4].value.toI32();
  }
}

export class ClaimRewardCall__Outputs {
  _call: ClaimRewardCall;

  constructor(call: ClaimRewardCall) {
    this._call = call;
  }
}

export class InitializeGameCall extends ethereum.Call {
  get inputs(): InitializeGameCall__Inputs {
    return new InitializeGameCall__Inputs(this);
  }

  get outputs(): InitializeGameCall__Outputs {
    return new InitializeGameCall__Outputs(this);
  }
}

export class InitializeGameCall__Inputs {
  _call: InitializeGameCall;

  constructor(call: InitializeGameCall) {
    this._call = call;
  }
}

export class InitializeGameCall__Outputs {
  _call: InitializeGameCall;

  constructor(call: InitializeGameCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class PlayMoveCall extends ethereum.Call {
  get inputs(): PlayMoveCall__Inputs {
    return new PlayMoveCall__Inputs(this);
  }

  get outputs(): PlayMoveCall__Outputs {
    return new PlayMoveCall__Outputs(this);
  }
}

export class PlayMoveCall__Inputs {
  _call: PlayMoveCall;

  constructor(call: PlayMoveCall) {
    this._call = call;
  }

  get _gameId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _col(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class PlayMoveCall__Outputs {
  _call: PlayMoveCall;

  constructor(call: PlayMoveCall) {
    this._call = call;
  }
}

export class StartGameCall extends ethereum.Call {
  get inputs(): StartGameCall__Inputs {
    return new StartGameCall__Inputs(this);
  }

  get outputs(): StartGameCall__Outputs {
    return new StartGameCall__Outputs(this);
  }
}

export class StartGameCall__Inputs {
  _call: StartGameCall;

  constructor(call: StartGameCall) {
    this._call = call;
  }

  get _gameId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class StartGameCall__Outputs {
  _call: StartGameCall;

  constructor(call: StartGameCall) {
    this._call = call;
  }
}
