function findSubsets(matrix) {
  const n = matrix.length;
  if (n === 0) return [[]];
  const cols = matrix[0].length;
  const result = [];
  const colCounts = new Array(cols).fill(0);
  const current = [];

  const dfs = (i) => {
    if (i === n) {
      // Check if all columns have exactly one 1
      if (colCounts.every(count => count === 1)) {
        result.push([...current]);
      }
      return;
    }

    // Option 1: Skip the current row
    dfs(i + 1);

    // Option 2: Include the current row if it doesn't violate the column counts
    let canInclude = true;
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 1 && colCounts[j] >= 1) {
        canInclude = false;
        break;
      }
    }

    if (canInclude) {
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] === 1) {
          colCounts[j]++;
        }
      }
      current.push(i);
      dfs(i + 1);
      current.pop();
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] === 1) {
          colCounts[j]--;
        }
      }
    }
  };

  dfs(0);
  return result;
}

// Example usage:
const binaryMatrix = [
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
  console.log("done")
  return matrix;
}

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
const solutions = findSubsets(convertSudokuToExactCover(hardSudoku));
console.timeEnd('Sudoku Solve');
console.log('Solution found:', solutions.length > 0);

