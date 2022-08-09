/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ConnectFour, ConnectFourInterface } from "../ConnectFour";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minBetAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxBetAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
    ],
    name: "GameInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "player2",
        type: "address",
      },
    ],
    name: "GameStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_col",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_row",
        type: "uint256",
      },
    ],
    name: "boardIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_startingWinDiscCol",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startingWinDiscRow",
        type: "uint256",
      },
      {
        internalType: "enum ConnectFour.WinningDirection",
        name: "_direction",
        type: "uint8",
      },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        internalType: "enum ConnectFour.Status",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "isPlayer1Turn",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initializeGame",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxBetAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minBetAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_col",
        type: "uint256",
      },
    ],
    name: "playMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
    ],
    name: "startGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600060035534801561001557600080fd5b50604051610d0b380380610d0b83398181016040528101906100379190610061565b816001819055508060028190555050506100c7565b60008151905061005b816100b0565b92915050565b60008060408385031215610078576100776100ab565b5b60006100868582860161004c565b92505060206100978582860161004c565b9150509250929050565b6000819050919050565b600080fd5b6100b9816100a1565b81146100c457600080fd5b50565b610c35806100d66000396000f3fe60806040526004361061007b5760003560e01c8063d4c82d951161004e578063d4c82d9514610147578063e5ed1d5914610170578063e8fcf9ed1461018c578063fa968eea146101b55761007b565b8063117a5b90146100805780639fbfd1bb146100c1578063a0a1f49b146100fe578063cab11d5d1461011c575b600080fd5b34801561008c57600080fd5b506100a760048036038101906100a291906106b4565b6101e0565b6040516100b8959493929190610841565b60405180910390f35b3480156100cd57600080fd5b506100e860048036038101906100e3919061075c565b610270565b6040516100f591906108f4565b60405180910390f35b61010661032e565b60405161011391906108f4565b60405180910390f35b34801561012857600080fd5b50610131610572565b60405161013e91906108f4565b60405180910390f35b34801561015357600080fd5b5061016e600480360381019061016991906106e1565b610578565b005b61018a600480360381019061018591906106b4565b61057f565b005b34801561019857600080fd5b506101b360048036038101906101ae919061075c565b610582565b005b3480156101c157600080fd5b506101ca610586565b6040516101d791906108f4565b60405180910390f35b60006020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060040154908060050160009054906101000a900460ff16908060050160019054906101000a900460ff16905085565b600060068311806102815750600083105b6102c0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102b7906108d4565b60405180910390fd5b60058211806102cf5750600082105b61030e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610305906108b4565b60405180910390fd5b8260078361031c91906109ad565b6103269190610957565b905092915050565b6000600154341015801561034457506002543411155b610383576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161037a90610894565b60405180910390fd5b600060035490506003600081548092919061039d90610a86565b91905055506103aa61058c565b6040518060c001604052803373ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020018281526020013481526020016001600381111561040e5761040d610afe565b5b81526020016001151581525060008084815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020190602a6104d19291906105af565b506060820151816004015560808201518160050160006101000a81548160ff0219169083600381111561050757610506610afe565b5b021790555060a08201518160050160016101000a81548160ff0219169083151502179055509050507f9bd9e3cff520c68fd6f4d97be2cb72c5ec83b02a7cd1c3f7b53ebbc42acb954c8233346040516105629392919061090f565b60405180910390a1819250505090565b60025481565b5050505050565b50565b5050565b60015481565b604051806105400160405280602a90602082028036833780820191505090505090565b82602a601f016020900481019282156106475791602002820160005b8382111561061857835183826101000a81548160ff021916908360028111156105f7576105f6610afe565b5b021790555092602001926001016020816000010492830192600103026105cb565b80156106455782816101000a81549060ff0219169055600101602081600001049283019260010302610618565b505b5090506106549190610658565b5090565b5b80821115610671576000816000905550600101610659565b5090565b60008135905061068481610bc1565b92915050565b60008135905061069981610bd8565b92915050565b6000813590506106ae81610be8565b92915050565b6000602082840312156106ca576106c9610b2d565b5b60006106d88482850161069f565b91505092915050565b600080600080600060a086880312156106fd576106fc610b2d565b5b600061070b8882890161069f565b955050602061071c88828901610675565b945050604061072d8882890161069f565b935050606061073e8882890161069f565b925050608061074f8882890161068a565b9150509295509295909350565b6000806040838503121561077357610772610b2d565b5b60006107818582860161069f565b92505060206107928582860161069f565b9150509250929050565b6107a581610a07565b82525050565b6107b481610a2b565b82525050565b6107c381610a74565b82525050565b60006107d6600d83610946565b91506107e182610b32565b602082019050919050565b60006107f9601683610946565b915061080482610b5b565b602082019050919050565b600061081c601983610946565b915061082782610b84565b602082019050919050565b61083b81610a6a565b82525050565b600060a082019050610856600083018861079c565b610863602083018761079c565b6108706040830186610832565b61087d60608301856107ba565b61088a60808301846107ab565b9695505050505050565b600060208201905081810360008301526108ad816107c9565b9050919050565b600060208201905081810360008301526108cd816107ec565b9050919050565b600060208201905081810360008301526108ed8161080f565b9050919050565b60006020820190506109096000830184610832565b92915050565b60006060820190506109246000830186610832565b610931602083018561079c565b61093e6040830184610832565b949350505050565b600082825260208201905092915050565b600061096282610a6a565b915061096d83610a6a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156109a2576109a1610acf565b5b828201905092915050565b60006109b882610a6a565b91506109c383610a6a565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156109fc576109fb610acf565b5b828202905092915050565b6000610a1282610a4a565b9050919050565b6000610a2482610a4a565b9050919050565b60008115159050919050565b6000819050610a4582610bad565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610a7f82610a37565b9050919050565b6000610a9182610a6a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610ac457610ac3610acf565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600080fd5b7f636865636b2062657420616d7400000000000000000000000000000000000000600082015250565b7f526f7720696e646578206f7574206f662072616e676500000000000000000000600082015250565b7f436f6c756d6e20696e646578206f7574206f662072616e676500000000000000600082015250565b60048110610bbe57610bbd610afe565b5b50565b610bca81610a19565b8114610bd557600080fd5b50565b60048110610be557600080fd5b50565b610bf181610a6a565b8114610bfc57600080fd5b5056fea2646970667358221220b50168fdc1bd5d5e8aff7ff924ce1db9be5e30d48d788ae8cb328e9801af8d7764736f6c63430008060033";

export class ConnectFour__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _minBetAmount: BigNumberish,
    _maxBetAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ConnectFour> {
    return super.deploy(
      _minBetAmount,
      _maxBetAmount,
      overrides || {}
    ) as Promise<ConnectFour>;
  }
  getDeployTransaction(
    _minBetAmount: BigNumberish,
    _maxBetAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _minBetAmount,
      _maxBetAmount,
      overrides || {}
    );
  }
  attach(address: string): ConnectFour {
    return super.attach(address) as ConnectFour;
  }
  connect(signer: Signer): ConnectFour__factory {
    return super.connect(signer) as ConnectFour__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ConnectFourInterface {
    return new utils.Interface(_abi) as ConnectFourInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ConnectFour {
    return new Contract(address, _abi, signerOrProvider) as ConnectFour;
  }
}
