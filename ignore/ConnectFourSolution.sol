//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

/// @title ConnectFour
/// @author Bloomtech
/// @custom:revision 1.0: @zasnicoff, February 2022
/// @notice Allows any two players to place a 50-50 bet on who will win a game of Connect Four.
/// @notice For info on the rules of Connect Four, see https://en.wikipedia.org/wiki/Connect_Four
/// @dev See the {Game} struct for details on how the board is represented
/// @dev Some variables use the uint8 or uint16 type to make it easier for frontend apps to manipulate return values and events, avoiding BigNumbers type conversions. But this might limit the number of concurrent games or cause overflows.

import "hardhat/console.sol";

contract ConnectFour {
    /// @dev represents a single disc in the Connect Four board
    enum Disc {
        Empty,
        Player1,
        Player2
    }

    /// @dev status of an individual Game
    /// @dev: add 'Draw' in case of game draw, along with corresponding logic that might return the funds to players. Otherwise, funds will be locked forever.
    enum Status {
        NonExistent,
        Initialized,
        Started,
        BetWithdrawn
    }

    /// @dev indicates the direction to check the winning line of 4 discs
    /// @dev when calling the ClainReward method, user must send the bottom-most and left-most disc index of the four.
    enum WinningDirection {
        LeftDiagonal,
        Up,
        RightDiagonal,
        Right
    }

    /// @notice struct to represent a Connect Four game between 2 opponents. Each opponent
    /// enters the game by sending the betAmount, so that each game will have a pool of 2 * betAmount
    /// @dev player1 is the address who called ConnectFour.initializeGame, and player2
    /// is the player that called ConnectFour.startGame
    /// @dev each board is comprised of 7 columns, 6 rows, and starts out with each Cell initialized
    /// to Cell.Empty. The board is a single array, and to get the correct disc given a column and row
    /// ID (which are 0-indexed), see ConnectFour.boardIndex. We represent a position in the board as a tuple of
    /// (column, row). The disc (0, 0) is in the bottom left of the board and the disc in the top left of
    /// the board has the coordinates (0, 5) and exists at index 35 in the board array
    ///
    /// See this ASCII grid below for the board and the indexes of different slots
    ///
    /// -------------------------
    /// |/35/  /  /  /  /  /41/|
    /// |/  /  /  /  /  /  /  /|
    /// |/  /  /  /  /  /  /  /|
    /// |/  /  /  /  /  /  /  /|
    /// |/  /  /  /  /  /  /  /|
    /// |/0 /  /  /  /  /  /6 /|
    /// -------------------------

    struct Game {
        address player1; // address of the player that first initialized the game and chose the betAmount
        address player2; // address of the player that accepted the challenge and started the previously initialized game
        Disc[42] board; // array representing the state of board's discs in a 7 column 6 row grid, at first all are empty
        uint256 betAmount; // number of wei each player bets on the game; the winner will receive 2 * betAmount
        Status status; // various states that denote the lifecycle of a game
        bool isPlayer1Turn; // true if it is player 1's turn, false if it is player 2's turn. Initially it is player 1's turn
    }

    event GameInitialized(uint16 gameId, address player1, uint256 betAmount);

    event GameStarted(uint16 gameId, address player2);

    event RewardClaimed(
        uint16 gameId,
        address winner,
        address recipient,
        uint256 rewardAmount
    );

    /// @dev only the last move idx is sent; frontend logic should keep a record of all the moves or query the blockchain (event filters) to update the local copy of the board. Maybe implement a getter method to return the full board.
    event BoardUpdated(uint16 gameId, Disc player, uint8 boardIdx);

    /// @notice stores the Game structs for each game, identified by each uint16 game ID
    mapping(uint16 => Game) public games;

    /// @notice the minimum amount of wei that can be bet in a game. Setting a higher value (e.g. 1 ETH or 10e18 WEI) indicates
    /// this is a contract meant for whales only. Set this lower if you want everyone to participate
    uint256 public minBetAmount;

    /// @notice the maximum amount of wei that can be bet in a game. Set this to ensure people don't lose their shirts :D
    uint256 public maxBetAmount;

    /// @dev A monotonically incrementing counter used for new Game IDs. Starts out at 0, and increments by 1 with every new Game
    uint16 internal gameIdCounter = 0;

    /// @dev the last row in the board; trying to index row 6 would revert because it is out of bounds
    uint8 internal constant ROW_MAX_INDEX = 5;

    /// @dev the last column in the board; trying to index column 7 would revert because it is out of bounds
    uint8 internal constant COL_MAX_INDEX = 6;

    /// @dev the first row in the board
    uint8 internal constant MIN_ROW_INDEX = 0;

    /// @notice Set the minimum and maximum amounts that can be bet on any Games created through
    /// this contract
    /// @dev Increase _minBetAmount if you want to attract degenerates, lower _maxBetAmount to keep them away
    /// @param _minBetAmount the lowest amount a player will be able to bet
    /// @param _maxBetAmount the largest amount a player will be able to bet

    constructor(uint256 _minBetAmount, uint256 _maxBetAmount) {
        minBetAmount = _minBetAmount;
        maxBetAmount = _maxBetAmount;
        gameIdCounter = 0;
    }

    /// @notice Create a Game that can be started by any other address. To initialize a game the caller
    /// must send an ETH amount between the min and max bet amounts
    /// @notice Each game is for a 50/50 bet, so when the caller of this functions sends, say, 1 ETH,
    /// the opponent must send in the same amount of 1 ETH in ConnectFour.startGame()
    /// @dev the returned gameId is a monotonically increasing ID used to interact with this new Game, so cocnurrent games can be played by any number of players
    /// @return a game ID, which can be used by each player to interact with the new Game

    function initializeGame() external payable returns (uint16) {
        require(
            msg.value >= minBetAmount && msg.value <= maxBetAmount,
            "ConnectFour: msg.value must be above minimum and below maximum bet amounts"
        );

        uint16 gameId = gameIdCounter;
        gameIdCounter++;

        Disc[42] memory board;
        games[gameId] = Game(
            msg.sender,
            address(0x0), //no player2 yet
            board,
            msg.value,
            Status.Initialized,
            true
        );

        emit GameInitialized(gameId, msg.sender, msg.value);
        // now ConnectFour.startGame() can be called by the address of player 2

        return gameId;
    }

    /// @notice Start a game that has already been initialized by player1. The caller of this function (player2)
    /// must send in the same amount of ETH as player1 sent in. Afterwards the Game has started, and players
    /// may call ConnectFour.playMove() to place their discs
    /// @param _gameId the game's ID, returned when player1 called ConnectFour.initializeGame()

    function startGame(uint16 _gameId) external payable {
        require(
            games[_gameId].status == Status.Initialized,
            "Connect Four: game with this gameId does not exist or is already started"
        );
        require(
            msg.sender != games[_gameId].player1,
            "ConnectFour: game starter cannot be same as initializer"
        );
        require(
            msg.value == games[_gameId].betAmount,
            "ConnectFour: msg.value must equal game's betAmount set by the initializer"
        );

        // transition the shared Game object into the Started state
        games[_gameId].status = Status.Started;
        games[_gameId].player2 = msg.sender;
        emit GameStarted(_gameId, msg.sender);

        // now the game as started, and ConnectFour.playMove() can be called by player1, then player2, then player1, ... etc.
    }

    /// @notice Place a disc in the given column with the given Game. player1 and player2 will take
    /// turns placing one of their discs in a column, where it will fall until it stays in the bottom-most
    /// slot or onto the bottom-most previously-placed disc. For more info on how to play Connect Four, see
    /// the wikipedia page https://en.wikipedia.org/wiki/Connect_Four
    /// @dev illegal moves will cause the transaction to revert, such as placing a disc out of bounds of the 7x6
    /// board, trying to place a disc in a column which is already full, or going out of turn
    /// @param _gameId the game's ID, returned when player1 called ConnectFour.initializeGame()
    /// @param _col the index of the column to place a disc in, valid values are 0 through 6 inclusive

    function playMove(uint16 _gameId, uint8 _col) external {
        // ensure the game state and caller are correct
        require(
            games[_gameId].status == Status.Started,
            "ConnectFour: game does not exist or has not started or is finished"
        );
        Game memory gameState = games[_gameId];
        require(
            gameState.isPlayer1Turn
                ? msg.sender == gameState.player1
                : msg.sender == gameState.player2,
            "ConnectFour: caller must be a player for this gameID, or wait for your turn"
        );

        // set this turn's new disc to the appropriate player, based on whose turn it is
        Disc newDisc = gameState.isPlayer1Turn ? Disc.Player1 : Disc.Player2;

        // starting from the bottom-most row in the column, advance upwards
        // until we find the first empty slot, or we reach the end of the board
        for (uint8 row = MIN_ROW_INDEX; row <= ROW_MAX_INDEX; row++) {
            uint8 idx = boardIndex(_col, row);
            Disc rowDisc = gameState.board[idx];

            if (rowDisc == Disc.Empty) {
                // we found first empty row in this column, let's
                // update the game state accordingly
                games[_gameId].board[idx] = newDisc;
                //@zasnicoff:
                emit BoardUpdated(_gameId, newDisc, idx);
                games[_gameId].isPlayer1Turn = !games[_gameId].isPlayer1Turn;
                break;
            } else if (row == ROW_MAX_INDEX) {
                // we've gone through all of the rows of this column but all of them already have a disc previously placed
                // by player1 or player2, so this means the caller tried to place a disc in a column that was already
                // full, which is an illegal move
                revert("ConnectFour: column is full");
            }
        }
    }

    /// @notice Withdraws the bet amounts of both players to the recipient for the given game when there exists; recipient may be different from player as to allow winnder to choose receiving address (another personal account, a contract, a friend etc.)
    /// a winning four-in-a-row of the caller's discs. The caller specifies the four-in-a-row by providing
    /// starting column and row coordinates (bottom-most and left-most index), as well as a direction in which to look for the 4 winning discs
    /// @dev As an example, imagine there is a winning four-in-a-row at coordinates (0,0), (0,1), (0,2), (0,3).
    /// Then the following function arguments will correctly claim the reward:
    /// _startingWinDiscCol = 0, _startingWinDiscRow = 0, _direction = Up
    /// @dev Note: >>>>> there exists a vulnerability in this contract that we will exploit in a later Sprint. Can you find it? :D <<<<<
    /// @param _gameId the game's ID, returned when player1 called ConnectFour.initializeGame()
    /// @param _recipient the address who will receive the bet's reward ETH
    /// @param _startingWinDiscCol the left-most column index for the end chip of the four-in-a-row
    /// @param _startingWinDiscRow the bottom-most row index for the end chip of the four-in-a-row
    /// @param _direction one of 4 possible directions in which to move when verifying the four-in-a-row

    function claimReward(
        uint16 _gameId,
        address payable _recipient,
        uint8 _startingWinDiscCol,
        uint8 _startingWinDiscRow,
        WinningDirection _direction
    ) external {
        require(
            games[_gameId].status == Status.Started,
            "ConnectFour: game does not exist or has not started or is finished"
        );

        Game memory gameState = games[_gameId];

        // used to verify that the discs were previously placed by the correct player
        Disc callerDisc = gameState.player1 == msg.sender
            ? Disc.Player1
            : Disc.Player2;

        uint8 currCol = _startingWinDiscCol;
        uint8 currRow = _startingWinDiscRow;
        uint8 idx;
        // we iterate 3 times here, and do a final check out of the loop
        for (uint8 i = 0; i < 3; i++) {
            idx = boardIndex(currCol, currRow);
            // if we made it to this point, it means we have a valid column and row
            // because it would have reverted inside boardIndex
            require(
                gameState.board[idx] == callerDisc,
                "ConnectFour: the four in a row must only contain caller's discs"
            );
            if (_direction == WinningDirection.LeftDiagonal) {
                currCol -= 1;
                currRow += 1;
            } else if (_direction == WinningDirection.Up) {
                currRow += 1;
            } else if (_direction == WinningDirection.RightDiagonal) {
                currCol += 1;
                currRow += 1;
            } else if (_direction == WinningDirection.Right) {
                currCol += 1;
            } else {
                revert("Unhandled enum");
            }
        }
        //last check to confirm 4 chips
        idx = boardIndex(currCol, currRow);
        require(
            gameState.board[idx] == callerDisc,
            "ConnectFour: the four in a row must only contain caller's discs"
        );

        // if we've made it to this point, then we've know we have a valid set of 4 winning disc, so we should
        // end the game and payout the winner

        uint256 rewardAmount = 2 * gameState.betAmount;
        (bool sent, ) = _recipient.call{value: rewardAmount}("");
        require(sent, "ConnectFour: reward transfer to recipient failed");

        /// @notice Game status changes AFTER reward transfer is successful, otherwise game won't be playable is case of transfer failure
        games[_gameId].status = Status.BetWithdrawn;

        emit RewardClaimed(_gameId, msg.sender, _recipient, rewardAmount);
    }

    /// @notice utility funcion. Returns the index of a disc in the board, given its column and row index (0-indexed)
    /// @dev this function will throw if the column or row are out of bounds
    /// @param _col the index of the column, valid values are 0 through 6 inclusive
    /// @param _row the index of the row, valid values are 0 through 5 inclusive
    /// @return the index of the board corresponding to these coordinates

    function boardIndex(uint8 _col, uint8 _row) public pure returns (uint8) {
        require(
            _col <= COL_MAX_INDEX && _row <= ROW_MAX_INDEX,
            "ConnectFour: board index is out of range"
        );
        return _row * 7 + _col;
    }
}
