class DLXNode {
  constructor() {
    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
    this.column = null;
    this.row = -1;
  }
}

class DLXSolver {
  constructor(matrix) {
    this.header = new DLXNode();
    this.columns = [];
    this.solution = [];
    this.solutions = [];
    this.initialize(matrix);
  }

  initialize(matrix) {
    // Create column headers
    const cols = matrix[0].length;
    for (let j = 0; j < cols; j++) {
      const columnNode = new DLXNode();
      columnNode.column = columnNode;
      this.columns.push(columnNode);
      
      columnNode.left = this.header.left;
      columnNode.right = this.header;
      this.header.left.right = columnNode;
      this.header.left = columnNode;
    }

    // Create rows and link nodes
    for (let i = 0; i < matrix.length; i++) {
      let rowStart = null;
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          const columnNode = this.columns[j];
          const newNode = new DLXNode();

          newNode.row = i;
          newNode.column = columnNode;

          newNode.up = columnNode.up;
          newNode.down = columnNode;
          columnNode.up.down = newNode;
          columnNode.up = newNode;

          if (rowStart === null) {
            rowStart = newNode;
            newNode.left = newNode;
            newNode.right = newNode;
          } else {
            newNode.left = rowStart.left;
            newNode.right = rowStart;
            rowStart.left.right = newNode;
            rowStart.left = newNode;
          }
        }
      }
    }
  }

  cover(columnNode) {
    columnNode.right.left = columnNode.left;
    columnNode.left.right = columnNode.right;

    for (let rowNode = columnNode.down; rowNode !== columnNode; rowNode = rowNode.down) {
      for (let rightNode = rowNode.right; rightNode !== rowNode; rightNode = rightNode.right) {
        rightNode.up.down = rightNode.down;
        rightNode.down.up = rightNode.up;
      }
    }
  }

  uncover(columnNode) {
    for (let rowNode = columnNode.up; rowNode !== columnNode; rowNode = rowNode.up) {
      for (let leftNode = rowNode.left; leftNode !== rowNode; leftNode = leftNode.left) {
        leftNode.up.down = leftNode;
        leftNode.down.up = leftNode;
      }
    }

    columnNode.right.left = columnNode;
    columnNode.left.right = columnNode;
  }

  search() {
    if (this.header.right === this.header) {
      this.solutions.push([...this.solution]);
      return;
    }

    let columnNode = this.header.right;
    this.cover(columnNode);

    for (let rowNode = columnNode.down; rowNode !== columnNode; rowNode = rowNode.down) {
      this.solution.push(rowNode.row);

      for (let rightNode = rowNode.right; rightNode !== rowNode; rightNode = rightNode.right) {
        this.cover(rightNode.column);
      }

      this.search();

      for (let leftNode = rowNode.left; leftNode !== rowNode; leftNode = leftNode.left) {
        this.uncover(leftNode.column);
      }

      this.solution.pop();
    }

    this.uncover(columnNode);
  }

  solve() {
    this.solutions = [];
    this.search();
    return this.solutions;
  }
}

function convertSudokuToExactCover(sudoku) {
  const matrix = Array.from({ length: 729 }, () => new Array(324).fill(0));
  
  function getRowIndex(row, col, num) {
    return row * 81 + col * 9 + num;
  }

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = sudoku[row][col];
      const nums = value === 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [value - 1];
      
      for (const num of nums) {
        const rowIdx = getRowIndex(row, col, num);
        
        // Cell constraint
        matrix[rowIdx][row * 9 + col] = 1;
        
        // Row constraint
        matrix[rowIdx][81 + row * 9 + num] = 1;
        
        // Column constraint
        matrix[rowIdx][162 + col * 9 + num] = 1;
        
        // Box constraint
        const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        matrix[rowIdx][243 + box * 9 + num] = 1;
      }
    }
  }
  
  return matrix;
}

function solveSudoku(sudoku) {
  // Convert Sudoku to exact cover matrix
  const exactCoverMatrix = convertSudokuToExactCover(sudoku);
  
  // Solve using DLX
  const dlx = new DLXSolver(exactCoverMatrix);
  const solutions = dlx.solve();
  
  if (solutions.length === 0) {
    return null; // No solution found
  }
  
  // Convert solution back to Sudoku grid
  const solution = solutions[0];
  const solvedSudoku = JSON.parse(JSON.stringify(sudoku));
  
  for (const rowIdx of solution) {
    const num = (rowIdx % 9) + 1;
    const cellIdx = Math.floor(rowIdx / 9);
    const row = Math.floor(cellIdx / 9);
    const col = cellIdx % 9;
    solvedSudoku[row][col] = num;
  }
  
  return solvedSudoku;
}

// Example usage
const sudoku = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

console.time('Sudoku Solve');
const solution = solveSudoku(sudoku);
console.timeEnd('Sudoku Solve');
console.log('Solution:', solution);