/**
 * Deep-copy a 2D array (matrix).
 */
function deepCopy(matrix) {
  return matrix.map(row => row.slice());
}

/**
 * Given a 0/1 matrix, returns an array of all exact-cover solutions.
 * Each solution is represented as an array of original row indices.
 */

function minCol(currentMatrix) {
  let minCount = Infinity;
  let chosenCol = -1;
  for (let j = 0; j < currentMatrix[0].length; j++) {
    let count = 0;
    for (let i = 0; i < currentMatrix.length; i++) {
      if (currentMatrix[i][j] === 1) count++;
    }
    if (count > 0 && count < minCount) {
      minCount = count;
      chosenCol = j;
    }
  }
  return chosenCol;
}

function findAllExactCovers(matrix) {
  const nRows = matrix.length;
  const nCols = matrix[0]?.length || 0;
  const rowMapping = Array.from({ length: nRows }, (_, i) => i);
  const allSolutions = [];


  function search(currentMatrix, currentMapping, partialSoln) {
    // 1) If there are no columns left (i.e. currentMatrix[0].length === 0),
    //    we’ve covered every column exactly once → record one solution.
    if (currentMatrix.length > 0 && currentMatrix[0].length === 0) {
      allSolutions.push(partialSoln.slice());
      return;
    }

    // 2) If there are rows left but no rows can cover any column, dead end:
    if (currentMatrix.length === 0) {
      // columns remain but no rows to cover them → no solution down this branch
      return;
    }

    const numCols = currentMatrix[0].length;

    // 3) Choose the column with the fewest 1s (heuristic to reduce branching).
    chosenCol = minCol(currentMatrix)
    // If no column has any 1, we’re done (though this shouldn’t happen except trivial).
    if (chosenCol === -1) {
      return;
    }

    // 4) For each row 'i' that has a 1 in chosenCol:
    for (let i = 0; i < currentMatrix.length; i++) {
      if (currentMatrix[i][chosenCol] == 1) {

        let rowOriginalIndex = currentMapping[i];

        let coveredCols = [];
        for (let k = 0; k < currentMatrix[0]?.length; k++) {
          if (currentMatrix[i][k] == 1) {
            coveredCols.push(k);
          }
        }

        if (coveredCols.length === currentMatrix[0]?.length) {
          allSolutions.push(partialSoln.concat(rowOriginalIndex));
          continue;
        }

        // Removing conflicting rows
        const newMatrix = [];
        const IndicesMap = [];
        for (let r = 0; r < currentMatrix.length; r++) {
          if (r === i) continue;
          // If row r has a 1 in ANY of the columns this row covers, drop it:
          let conflict = false;
          for (const c of coveredCols) {
            if (currentMatrix[r][c] === 1) {
              conflict = true;
              break;
            }
          }
          if (conflict) continue;
          newMatrix.push(currentMatrix[r].slice());
          IndicesMap.push(currentMapping[r]);
        }

        // Removing covered columns
        for (const c of coveredCols.slice().sort((a, b) => b - a)) {
          for (let rr = 0; rr < newMatrix.length; rr++) {
            newMatrix[rr].splice(c, 1);
          }
        }


        partialSoln.push(rowOriginalIndex);
        search(newMatrix, IndicesMap, partialSoln);
        partialSoln.pop();
      } else {
        continue;
      }

    }

  }

  // Kick off the recursion
  search(matrix, rowMapping, []);
  return allSolutions;
}

// =======================
// Example usage (6×7 matrix):
// =======================
const example = [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
];

const s1 = [
  [0, 0, 0, 1],
  [1, 0, 1, 0],
  [0, 0, 1, 1],
  [0, 1, 0, 1]
]

// Find *all* exact covers of that 6×7 example
const hardSudoku = [
  [8,0,0,0,0,0,0,0,0],
  [0,0,3,6,0,0,0,0,0],
  [0,7,0,0,9,0,2,0,0],
  [0,5,0,0,0,7,0,0,0],
  [0,0,0,0,4,5,7,0,0],
  [0,0,0,1,0,0,0,3,0],
  [0,0,1,0,0,0,0,6,8],
  [0,0,8,5,0,0,0,1,0],
  [0,9,0,0,0,0,4,0,0]
];

console.time('Sudoku Solve');
const solutions = findAllExactCovers(convertSudokuToExactCover(hardSudoku));
console.timeEnd('Sudoku Solve');
console.log('Solution found:', solutions.length > 0);

function convertSudokuToExactCover(sudoku) {
  // Initialize a 729x324 matrix filled with 0s
  const matrix = Array.from({ length: 729 }, () => new Array(324).fill(0));
  
  // Helper function to calculate the exact cover row index
  function getRowIndex(row, col, num) {
    return row * 81 + col * 9 + num;
  }

  // For each cell (row, col) in the Sudoku grid
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = sudoku[row][col];
      const nums = value === 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [value - 1];
      
      // For each possible number in the cell
      for (const num of nums) {
        const rowIdx = getRowIndex(row, col, num);
        
        // Constraint 1: Cell constraint (row,col has exactly one number)
        matrix[rowIdx][row * 9 + col] = 1;
        
        // Constraint 2: Row constraint (row has each number exactly once)
        matrix[rowIdx][81 + row * 9 + num] = 1;
        
        // Constraint 3: Column constraint (col has each number exactly once)
        matrix[rowIdx][162 + col * 9 + num] = 1;
        
        // Constraint 4: Box constraint (box has each number exactly once)
        const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        matrix[rowIdx][243 + box * 9 + num] = 1;
      }
    }
  }
  
  return matrix;
}

// Expected output (only one valid cover):
// All exact-cover solutions: [ [ 0, 3, 4 ] ]
// Explanation: Rows 0, 3, 4 cover each of the 7 columns exactly once.
