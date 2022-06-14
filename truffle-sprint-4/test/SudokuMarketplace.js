const SudokuMarketplace = artifacts.require("SudokuMarketplace");
require("truffle-test-utils").init();
let marketplaceInstance;
var sudoku;

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
// function timeout(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

contract("SudokuMarketplace", function(accounts) {
  it("should state that contracts are deployed", async function() {
    await SudokuMarketplace.deployed();
    return assert.isTrue(true);
  });

  beforeEach(async () => {
    marketplaceInstance = await SudokuMarketplace.deployed();
  });

  /*Test Sudoku:
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
  it("accounts[0] should be able to submit a correct Sudoku grid", async () => {
    await marketplaceInstance.submitProblem(
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ],
      { from: accounts[0], to: marketplaceInstance.address, value: 1000000000 }
    );
    sudoku = await marketplaceInstance.sudokus(accounts[0], 0);
    return assert.isTrue(sudoku.value == 1000000000);
  });

  it("accounts[1] should be able to submit an incorrect solution", async () => {
    await marketplaceInstance.submitSolution(
      accounts[0],
      0,
      [
        [3, 5, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ],
      { from: accounts[1], to: marketplaceInstance.address, value: 1000000000 }
    );
    sudoku = await marketplaceInstance.sudokus(accounts[0], 0);
    return assert.isTrue(sudoku.value == 2000000000 && sudoku.solved == false);
  });

  it("accounts[2] should be able to submit a correct solution", async () => {
    await marketplaceInstance.submitSolution(
      accounts[0],
      0,
      [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ],
      { from: accounts[2], to: marketplaceInstance.address, value: 1000000000 }
    );
    sudoku = await marketplaceInstance.sudokus(accounts[0], 0);
    return assert.isTrue(
      sudoku.value == 0 && sudoku.solved == true && sudoku.solver == accounts[2]
    );
  });
});
