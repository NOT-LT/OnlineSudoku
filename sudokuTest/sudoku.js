"use strict";
// Utility function to print the board
function printBoard(board) {
    console.log("Sudoku Solution:");
    for (let i = 0; i < 9; i++) {
        let rowStr = "";
        for (let j = 0; j < 9; j++) {
            rowStr += board[i][j] + " ";
            if ((j + 1) % 3 === 0 && j !== 8)
                rowStr += "| ";
        }
        console.log(rowStr);
        if ((i + 1) % 3 === 0 && i !== 8) {
            console.log("------+-------+------");
        }
    }
}
// Finds the empty cell with fewest possible numbers (Most Constrained Variable heuristic)
function findEmptyCell(board) {
    let minOptions = 10;
    let bestCell = null;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                const options = getValidNumbers(board, i, j);
                if (options.length < minOptions) {
                    minOptions = options.length;
                    bestCell = [i, j, options];
                    if (minOptions === 1)
                        break; // Found cell with only one option
                }
            }
        }
        if (minOptions === 1)
            break;
    }
    return bestCell;
}
// Gets all valid numbers for a cell (Forward Checking)
function getValidNumbers(board, i, j) {
    const used = new Set();
    // Check row and column
    for (let x = 0; x < 9; x++) {
        used.add(board[i][x]);
        used.add(board[x][j]);
    }
    // Check 3x3 box
    const boxX = Math.floor(i / 3) * 3;
    const boxY = Math.floor(j / 3) * 3;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            used.add(board[boxX + x][boxY + y]);
        }
    }
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => !used.has(num));
}
// Optimized solver using backtracking with heuristics
function solveOptimized(board) {
    const cell = findEmptyCell(board);
    if (!cell)
        return true; // Puzzle solved
    const [i, j, options] = cell;
    for (const num of options) {
        board[i][j] = num;
        if (solveOptimized(board))
            return true;
        board[i][j] = 0; // Backtrack
    }
    return false;
}
// Benchmark function
function measurePerformance(board) {
    // Create a deep copy of the board to avoid modifying the original
    const boardCopy = board.map(row => [...row]);
    console.log("Starting solve...");
    const startTime = performance.now();
    const solved = solveOptimized(boardCopy);
    const endTime = performance.now();
    console.log(`Solved: ${solved}`);
    console.log(`Time taken: ${(endTime - startTime).toFixed(2)}ms`);
    if (solved) {
        printBoard(boardCopy);
    }
}
// Evil difficulty Sudoku puzzle
const evilSudoku = [
     [8, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 6, 0, 0, 0, 0, 0],
  [0, 7, 0, 0, 9, 0, 2, 0, 0],
  [0, 5, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 4, 5, 7, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 3, 0],
  [0, 0, 1, 0, 0, 0, 0, 6, 8],
  [0, 0, 8, 5, 0, 0, 0, 1, 0],
  [0, 9, 0, 0, 0, 0, 4, 0, 0]
];
// Run the solver
measurePerformance(evilSudoku);
