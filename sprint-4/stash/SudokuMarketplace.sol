// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
/**
 * @title Sudoku Marketplace
 * @author Nassim Dehouche
 */

//Please implement the functions below, using the extact same signature (function name, arguments, returns)

//optional: make your contract Ownable and/or pausable
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SudokuMarketplace is Ownable, Pausable {
    /// @dev Toggle pause boolean
    function togglePause() external onlyOwner {}

    /// @dev Sudoku creation event
    event sudokuCreated(address _proposer, uint _index);
    /// @dev Solution submission event
    event solutionSubmitted(address _solver, address _proposer, uint _index);
    /// @dev Sudoku solution event
    event sudokuSolved(
        address _solver,
        address _proposer,
        uint _index,
        uint _value
    );

    constructor(){
        
    }

    /// @notice Time-window to submit a solution from the time a Sudoku grid is created
    uint public deadline = 600;
    /// @notice Fee to be paid by solvers
    uint public fee = 1000000000;

    /* @notice Test Sudoku:
     * [[5,3,4,6,7,8,9,1,2],
     * [6,7,2,1,9,5,3,4,8],
     * [1,9,8,3,4,2,5,6,7],
     * [8,5,9,7,6,1,4,2,3],
     * [4,2,6,8,5,3,7,9,1],
     * [7,1,3,9,2,4,8,5,6],
     * [9,6,1,5,3,7,2,8,4],
     * [2,8,7,4,1,9,6,3,5],
     * [3,4,5,2,8,6,1,7,9]];
     */

    /// @dev The Sudoku structure
    struct Sudoku {
        uint[9][9] grid;
        uint creationTime;
        bool solved;
        address payable solver;
        uint value;
    }

    /// @dev Mapping proposers with an array of their proposed Sudokus
    mapping(address => Sudoku[]) public sudokus;

    /// @dev Receive function
    receive() external payable {}

    /// @dev Fallback function. We check data length in fallback functions as a best practice
    fallback() external payable {
        require(msg.data.length == 0, "ERROR: msg.data.length should be 0");
    }

    /// @dev Digit verification for proposers
    // All digits must be <= 9
    function validDigitsProblem(uint[9][9] calldata _grid)
        public
        pure
        returns (bool valid)
    {}

    /// @dev Digit verification for solvers
    // All digits must be non-zero and <=9
    function validDigitsSolution(uint[9][9] calldata _grid)
        public
        pure
        returns (bool valid)
    {}

    /// @dev Sudoku verification for both proposers and solvers
    // All rows, colums and 3x3 grids must have UNIQUE numbers
    function validSudoku(uint[9][9] calldata _grid)
        public
        pure
        returns (bool valid)
    {}

    /// @dev Modifier for proposers
    modifier OnlyIfValidProblem(uint[9][9] calldata _grid) {
        _;
    }

    /// @notice Submit function for proposers
    function submitProblem(uint[9][9] calldata _grid)
        public
        payable
        OnlyIfPaidEnough
        OnlyIfValidProblem(_grid)
        whenNotPaused
        returns (uint _id)
    {}

    /// @dev Checks that solution is for the right problem, meaning all non-zero cells should be equal to the proposed problem, to begin with
    function rightPuzzle(
        uint[9][9] memory _problem,
        uint[9][9] calldata _solution
    ) public pure returns (bool valid) {}

    /// @dev Checks deadline
    modifier OnlyIfStillOpen(address proposer, uint index) {
        // added this gcr
        _;
    }

    /// @dev Checks that sudoku hasn't been already solved
    modifier OnlyIfNotSolved(address proposer, uint index) {
        _;
    }

    /// @dev Payment modifier
    modifier OnlyIfPaidEnough() {
        _;
    }

    /// @dev Digit modifier for solutions
    modifier OnlyIfValidDigitsSolution(uint[9][9] calldata _grid) {
        _;
    }

    /**
@dev The submitSolution function. We want to allow wrong submissions to collect fees,
we just verify that they are not trivially wrong with modifier OnlyIfValidDigitsSolution()
*/
    function submitSolution(
        address proposer,
        uint index,
        uint[9][9] calldata _solution
    )
        public
        payable
        OnlyIfStillOpen(proposer, index)
        OnlyIfPaidEnough
        OnlyIfValidDigitsSolution(_solution)
    {}

    //@notice Proposers can withdraw the value held in their Sudoku if no one could solve it
    function withdrawValue(uint index)
        public
        OnlyIfNotSolved(msg.sender, index)
        whenNotPaused
    {}
}
