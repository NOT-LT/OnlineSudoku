class Node {
  constructor() {
    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
    this.column = null;
    this.rowID = null;
  }
}

class ColumnNode extends Node {
  constructor(name) {
    super();
    this.name = name;
    this.size = 0;
    this.column = this;
  }
}

class DLX {
  constructor(sparseMatrix, rowIDs, columnCount) {
    this.root = new ColumnNode('root');
    this.columns = Array.from({ length: columnCount }, (_, i) => new ColumnNode(i));
    this.solution = [];
    this.firstSolution = null;

    // Link columns
    for (let i = columnCount - 1; i >= 0; i--) {
      const col = this.columns[i];
      col.right = this.root.right || this.root;
      col.left = this.root;
      if (this.root.right) this.root.right.left = col;
      this.root.right = col;
    }

    // Add rows
    for (let i = 0; i < sparseMatrix.length; i++) {
      const row = sparseMatrix[i];
      const rowID = rowIDs[i];
      let firstNode = null;

      for (const colIdx of row) {
        const col = this.columns[colIdx];
        const node = new Node();
        node.column = col;
        node.rowID = rowID;

        node.down = col;
        node.up = col.up || col;
        col.up ? col.up.down = node : null;
        col.up = node;
        col.size++;

        if (firstNode) {
          node.left = firstNode.left;
          node.right = firstNode;
          firstNode.left.right = node;
          firstNode.left = node;
        } else {
          firstNode = node;
          node.left = node;
          node.right = node;
        }
      }
    }
  }

  cover(col) {
    col.right.left = col.left;
    col.left.right = col.right;
    for (let row = col.down; row !== col; row = row.down) {
      for (let node = row.right; node !== row; node = node.right) {
        node.down.up = node.up;
        node.up.down = node.down;
        node.column.size--;
      }
    }
  }

  uncover(col) {
    for (let row = col.up; row !== col; row = row.up) {
      for (let node = row.left; node !== row; node = node.left) {
        node.column.size++;
        node.down.up = node;
        node.up.down = node;
      }
    }
    col.right.left = col;
    col.left.right = col;
  }

  search() {
    if (this.root.right === this.root) {
      this.firstSolution = [...this.solution];
      return true;
    }

    let col = this.root.right;
    for (let tmp = col.right; tmp !== this.root; tmp = tmp.right) {
      if (tmp.size < col.size) col = tmp;
    }

    this.cover(col);

    for (let row = col.down; row !== col; row = row.down) {
      this.solution.push(row);
      for (let node = row.right; node !== row; node = node.right) {
        this.cover(node.column);
      }

      if (this.search()) return true;

      this.solution.pop();
      for (let node = row.left; node !== row; node = node.left) {
        this.uncover(node.column);
      }
    }

    this.uncover(col);
    return false;
  }
}

function sudokuDLXSolver(grid) {
  const N = grid.length;
  const SUB = Math.sqrt(N);
  const ALL = Array.from({ length: N }, (_, i) => i);
  const boxIndex = (r, c) => Math.floor(r / SUB) * SUB + Math.floor(c / SUB);

  const sparseMatrix = [];
  const rowIDs = [];

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const val = grid[row][col];
      const options = val ? [val - 1] : ALL;

      for (const num of options) {
        sparseMatrix.push([
          row * N + col,
          N * N + row * N + num,
          2 * N * N + col * N + num,
          3 * N * N + boxIndex(row, col) * N + num
        ]);
        rowIDs.push((row << 16) | (col << 8) | (num + 1));
      }
    }
  }

  const dlx = new DLX(sparseMatrix, rowIDs, 4 * N * N);
  dlx.search();

  if (!dlx.firstSolution) return null;
  const solution = Array.from({ length: N }, () => Array(N).fill(0));

  for (const node of dlx.firstSolution) {
    const id = node.rowID;
    const r = (id >> 16) & 0xff;
    const c = (id >> 8) & 0xff;
    const n = id & 0xff;
    solution[r][c] = n;
  }

  return solution;
}

function sudokuDLXSolverRandom(grid) {
  const N = grid.length;
  const SUB = Math.sqrt(N);
  const ALL = Array.from({ length: N }, (_, i) => i);
  const boxIndex = (r, c) => Math.floor(r / SUB) * SUB + Math.floor(c / SUB);

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const sparseMatrix = [];
  const rowIDs = [];

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const val = grid[row][col];
      const options = val ? [val - 1] : shuffle(ALL.slice());

      for (const num of options) {
        sparseMatrix.push([
          row * N + col,
          N * N + row * N + num,
          2 * N * N + col * N + num,
          3 * N * N + boxIndex(row, col) * N + num
        ]);
        rowIDs.push((row << 16) | (col << 8) | (num + 1));
      }
    }
  }

  const dlx = new DLX(sparseMatrix, rowIDs, 4 * N * N);
  dlx.search(1); // Only need one random valid solution

  if (!dlx.firstSolution) return null;
  const solution = Array.from({ length: N }, () => Array(N).fill(0));

  for (const node of dlx.firstSolution) {
    const id = node.rowID;
    const r = (id >> 16) & 0xff;
    const c = (id >> 8) & 0xff;
    const n = id & 0xff;
    solution[r][c] = n;
  }

  return solution;
}


function sudokuDLXSolverWithCount(grid) {
  class Node {
    constructor() {
      this.left = this;
      this.right = this;
      this.up = this;
      this.down = this;
      this.column = null;
      this.rowID = null;
    }
  }

  class ColumnNode extends Node {
    constructor(name) {
      super();
      this.name = name;
      this.size = 0;
      this.column = this;
    }
  }

  class DLX {
    constructor(sparseMatrix, rowIDs, columnCount) {
      this.root = new ColumnNode('root');
      this.columns = Array.from({ length: columnCount }, (_, i) => new ColumnNode(i));
      this.solution = [];
      this.rowIDs = rowIDs;
      this.solutionCount = 0;
      this.firstSolution = null;

      // Link columns
      for (let i = columnCount - 1; i >= 0; i--) {
        const col = this.columns[i];
        col.right = this.root.right || this.root;
        col.left = this.root;
        if (this.root.right) this.root.right.left = col;
        this.root.right = col;
      }

      // Add rows
      for (let i = 0; i < sparseMatrix.length; i++) {
        const row = sparseMatrix[i];
        const rowID = rowIDs[i];
        let firstNode = null;

        for (const colIdx of row) {
          const col = this.columns[colIdx];
          const node = new Node();
          node.column = col;
          node.rowID = rowID;

          node.down = col;
          node.up = col.up || col;
          if (col.up) col.up.down = node;
          col.up = node;
          col.size++;

          if (firstNode) {
            node.left = firstNode.left;
            node.right = firstNode;
            firstNode.left.right = node;
            firstNode.left = node;
          } else {
            firstNode = node;
            node.left = node;
            node.right = node;
          }
        }
      }
    }

    cover(col) {
      col.right.left = col.left;
      col.left.right = col.right;
      for (let row = col.down; row !== col; row = row.down) {
        for (let node = row.right; node !== row; node = node.right) {
          node.down.up = node.up;
          node.up.down = node.down;
          node.column.size--;
        }
      }
    }

    uncover(col) {
      for (let row = col.up; row !== col; row = row.up) {
        for (let node = row.left; node !== row; node = node.left) {
          node.column.size++;
          node.down.up = node;
          node.up.down = node;
        }
      }
      col.right.left = col;
      col.left.right = col;
    }

    search() {
      if (this.root.right === this.root) {
        this.solutionCount++;
        if (!this.firstSolution) {
          this.firstSolution = [...this.solution];
        }
        return;
      }

      let col = this.root.right;
      for (let tmp = col.right; tmp !== this.root; tmp = tmp.right) {
        if (tmp.size < col.size) col = tmp;
      }

      this.cover(col);

      for (let row = col.down; row !== col; row = row.down) {
        this.solution.push(row);
        for (let node = row.right; node !== row; node = node.right) {
          this.cover(node.column);
        }

        this.search();

        this.solution.pop();
        for (let node = row.left; node !== row; node = node.left) {
          this.uncover(node.column);
        }
      }

      this.uncover(col);
    }
  }

  const N = grid.length;
  const SUB = Math.sqrt(N);
  const ALL = Array.from({ length: N }, (_, i) => i);
  const boxIndex = (r, c) => Math.floor(r / SUB) * SUB + Math.floor(c / SUB);

  const sparseMatrix = [];
  const rowIDs = [];

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const val = grid[row][col];
      const options = val ? [val - 1] : ALL;

      for (const num of options) {
        sparseMatrix.push([
          row * N + col,
          N * N + row * N + num,
          2 * N * N + col * N + num,
          3 * N * N + boxIndex(row, col) * N + num
        ]);
        rowIDs.push((row << 16) | (col << 8) | (num + 1));
      }
    }
  }

  const dlx = new DLX(sparseMatrix, rowIDs, 4 * N * N);
  dlx.search();

  let oneSolution = null;

  if (dlx.firstSolution) {
    oneSolution = Array.from({ length: N }, () => Array(N).fill(0));
    for (const node of dlx.firstSolution) {
      const id = node.rowID;
      const r = (id >> 16) & 0xff;
      const c = (id >> 8) & 0xff;
      const n = id & 0xff;
      oneSolution[r][c] = n;
    }
  }

  return {
    count: dlx.solutionCount,
    solution: oneSolution
  };
}

function sudokuSolutionCount(grid) {
  class Node {
    constructor() {
      this.left = this;
      this.right = this;
      this.up = this;
      this.down = this;
      this.column = null;
      this.rowID = null;
    }
  }

  class ColumnNode extends Node {
    constructor(name) {
      super();
      this.name = name;
      this.size = 0;
      this.column = this;
    }
  }

  class DLX {
    constructor(sparseMatrix, rowIDs, columnCount) {
      this.root = new ColumnNode('root');
      this.columns = Array.from({ length: columnCount }, (_, i) => new ColumnNode(i));
      this.solution = [];
      this.rowIDs = rowIDs;
      this.solutionCount = 0;
      this.firstSolution = null;

      // Link columns
      for (let i = columnCount - 1; i >= 0; i--) {
        const col = this.columns[i];
        col.right = this.root.right || this.root;
        col.left = this.root;
        if (this.root.right) this.root.right.left = col;
        this.root.right = col;
      }

      // Add rows
      for (let i = 0; i < sparseMatrix.length; i++) {
        const row = sparseMatrix[i];
        const rowID = rowIDs[i];
        let firstNode = null;

        for (const colIdx of row) {
          const col = this.columns[colIdx];
          const node = new Node();
          node.column = col;
          node.rowID = rowID;

          node.down = col;
          node.up = col.up || col;
          if (col.up) col.up.down = node;
          col.up = node;
          col.size++;

          if (firstNode) {
            node.left = firstNode.left;
            node.right = firstNode;
            firstNode.left.right = node;
            firstNode.left = node;
          } else {
            firstNode = node;
            node.left = node;
            node.right = node;
          }
        }
      }
    }

    cover(col) {
      col.right.left = col.left;
      col.left.right = col.right;
      for (let row = col.down; row !== col; row = row.down) {
        for (let node = row.right; node !== row; node = node.right) {
          node.down.up = node.up;
          node.up.down = node.down;
          node.column.size--;
        }
      }
    }

    uncover(col) {
      for (let row = col.up; row !== col; row = row.up) {
        for (let node = row.left; node !== row; node = node.left) {
          node.column.size++;
          node.down.up = node;
          node.up.down = node;
        }
      }
      col.right.left = col;
      col.left.right = col;
    }

    search() {
      if (this.root.right === this.root) {
        this.solutionCount++;
        if (!this.firstSolution) {
          this.firstSolution = [...this.solution];
        }
        return;
      }

      let col = this.root.right;
      for (let tmp = col.right; tmp !== this.root; tmp = tmp.right) {
        if (tmp.size < col.size) col = tmp;
      }

      this.cover(col);

      for (let row = col.down; row !== col; row = row.down) {
        this.solution.push(row);
        for (let node = row.right; node !== row; node = node.right) {
          this.cover(node.column);
        }

        this.search();

        this.solution.pop();
        for (let node = row.left; node !== row; node = node.left) {
          this.uncover(node.column);
        }
      }

      this.uncover(col);
    }
  }

  const N = grid.length;
  const SUB = Math.sqrt(N);
  const ALL = Array.from({ length: N }, (_, i) => i);
  const boxIndex = (r, c) => Math.floor(r / SUB) * SUB + Math.floor(c / SUB);

  const sparseMatrix = [];
  const rowIDs = [];

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const val = grid[row][col];
      const options = val ? [val - 1] : ALL;

      for (const num of options) {
        sparseMatrix.push([
          row * N + col,
          N * N + row * N + num,
          2 * N * N + col * N + num,
          3 * N * N + boxIndex(row, col) * N + num
        ]);
        rowIDs.push((row << 16) | (col << 8) | (num + 1));
      }
    }
  }

  const dlx = new DLX(sparseMatrix, rowIDs, 4 * N * N);
  dlx.search();

  let oneSolution = null;

  if (dlx.firstSolution) {
    oneSolution = Array.from({ length: N }, () => Array(N).fill(0));
    for (const node of dlx.firstSolution) {
      const id = node.rowID;
      const r = (id >> 16) & 0xff;
      const c = (id >> 8) & 0xff;
      const n = id & 0xff;
      oneSolution[r][c] = n;
    }
  }

  return {
    count: dlx.solutionCount,
    solution: oneSolution
  };
}

// 
function sudokuGenerator(difficultyLevel = 1) {
  const filledGrid = sudokuDLXSolverRandom(empty9x9); // Already shuffled and filled grid
  let hintCells = Math.floor(Math.random() * (49 - 36 + 1)) + 36;
  if (difficultyLevel === 2) {
    hintCells = Math.floor(Math.random() * (35 - 32 + 1)) + 32;
  }
  else if (difficultyLevel === 3) {
    hintCells = Math.floor(Math.random() * (31 - 28) + 1) + 28
  }
  else if (difficultyLevel === 4) {
    hintCells = Math.floor(Math.random() * (27 - 24) + 1) + 24
  }
  else if (difficultyLevel === 5) {
    hintCells = Math.floor(Math.random() * (23 - 17) + 1) + 17
  }

  function removeCells(grid, count, attempts = 0) {
    if (attempts > 10000) return; // Prevent infinite loop
    if (count <= 0 || count > (81 - 17)) return;
    let row = Math.floor(Math.random() * grid.length);
    let col = Math.floor(Math.random() * grid[0].length);
    let prevValue = grid[row][col];
    if (prevValue === 0) {
      removeCells(grid, count, attempts+1); // Retry if the cell is already empty
      return;
    }
    grid[row][col] = 0; // Remove the cell
    if (sudokuDLXSolverWithCount(grid).count === 1) {
      removeCells(grid, count - 1, attempts+1); // Retry with the same count
    } else {
      grid[row][col] = prevValue; // Restore the cell
      removeCells(grid, count, attempts+1); // Remove another cell
      return;
    }
  }
  removeCells(filledGrid, (81 - hintCells), 0);
  return filledGrid;
}   

//  function sudokuGenerator(difficultyLevel = 1) {
//   const filledGrid = sudokuDLXSolverRandom(empty9x9); // Already shuffled and filled grid
//   let hintCells = Math.floor(Math.random() * (49 - 36 + 1)) + 36;
//   if (difficultyLevel === 2) {
//     hintCells = Math.floor(Math.random() * (35 - 32 + 1)) + 32;
//   }
//   else if (difficultyLevel === 3) {
//     hintCells = Math.floor(Math.random() * (31 - 28) + 1) + 28
//   }
//   else if (difficultyLevel === 4) {
//     hintCells = Math.floor(Math.random() * (27 - 24) + 1) + 24
//   }
//   else if (difficultyLevel === 5) {
//     hintCells = Math.floor(Math.random() * (29 - 25) + 1) + 28
//   }

//   function removeCells(grid, count) {
//     if (count <= 0 || count > (81 - 17)) return;
//     let row = Math.floor(Math.random() * grid.length);
//     let col = Math.floor(Math.random() * grid[0].length);
//     let prevValue = grid[row][col];
//     if (prevValue === 0) {
//       removeCells(grid, count); // Retry if the cell is already empty
//       return;
//     }
//     grid[row][col] = 0; // Remove the cell
//     if (sudokuDLXSolverWithCount(grid).count === 1) {
//       removeCells(grid, count - 1); // Retry with the same count
//     } else {
//       grid[row][col] = prevValue; // Restore the cell
//       removeCells(grid, count); // Remove another cell
//       return;
//     }
//   }
//   removeCells(filledGrid, (81 - hintCells));
//   return filledGrid;
// }


// Helper function
function countClues(grid) {
  let count = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] !== 0) count++;
    }
  }
  return count;
}



function removeNumbersCarefully(puzzle, solvedBoard, targetClues) {
    const positions = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (puzzle[i][j] !== 0) {
                positions.push([i, j]);
            }
        }
    }
    shuffleArray(positions);

    let cellsToRemove = countClues(puzzle) - targetClues;
    let attempts = 0;
    const maxAttempts = Infinity;

    while (cellsToRemove > 0 && attempts < maxAttempts) {
        const [row, col] = positions[attempts % positions.length];
        
        if (puzzle[row][col] !== 0) {
            const backup = puzzle[row][col];
            puzzle[row][col] = 0;
            
            const result = sudokuDLXSolverWithCount(puzzle);
            
            if (result.count !== 1) {
                puzzle[row][col] = backup;
            } else {
                cellsToRemove--;
            }
        }
        attempts++;
    }
    
    return puzzle;
}

function createSymmetricPattern(solvedBoard, targetClues) {
    const puzzle = solvedBoard.map(row => [...row]);
    const symmetryType = Math.floor(Math.random() * 3); // 0: diagonal, 1: rotational, 2: none
    
    let positions = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (symmetryType === 0 && i <= j) continue; // Diagonal symmetry
            if (symmetryType === 1 && (i < 5 || (i === 4 && j < 5))) continue; // Rotational symmetry
            positions.push([i, j]);
        }
    }
    shuffleArray(positions);
    
    let cellsToRemove = 81 - targetClues;
    let attempts = 0;
    
    while (cellsToRemove > 0 && attempts < positions.length) {
        const [i, j] = positions[attempts];
        const backup = puzzle[i][j];
        puzzle[i][j] = 0;
        
        // Apply symmetry
        if (symmetryType === 0) {
            puzzle[j][i] = 0;
        } else if (symmetryType === 1) {
            puzzle[8-i][8-j] = 0;
        }
        
        const result = sudokuDLXSolverWithCount(puzzle);
        if (result.count !== 1) {
            puzzle[i][j] = backup;
            if (symmetryType === 0) {
                puzzle[j][i] = backup;
            } else if (symmetryType === 1) {
                puzzle[8-i][8-j] = backup;
            }
        } else {
            cellsToRemove -= (symmetryType === 2 ? 1 : 2);
        }
        attempts++;
    }
    
    return puzzle;
}

function rateDifficulty(puzzle, solution) {
    // Implement your difficulty rating algorithm here
    // This could consider factors like:
    // - Number of empty cells
    // - Required solving techniques
    // - Number of candidates per cell
    // For now, we'll use a simple metric
    return countClues(puzzle);
}

function countClues(grid) {
    return grid.flat().filter(x => x !== 0).length;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function puzzleParser(puzzle, size) {
  const expectedLength = size * size;
  const matrix = new Array(size).fill(0).map(() => new Array(size));

  // Use regex to match only valid tokens: 1–size or "."/0 for blank
  const tokens = [...puzzle.matchAll(/\d+|[.]/g)].map(m => m[0]);

  if (tokens.length !== expectedLength) {
    throw new Error(`Invalid puzzle length: expected ${expectedLength}, got ${tokens.length}`);
  }

  let idx = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const token = tokens[idx++];
      if (token === '.' || token === '0') {
        matrix[row][col] = 0;
      } else {
        const num = parseInt(token, 10);
        if (num < 1 || num > size) {
          throw new Error(`Invalid number '${token}' at row ${row + 1}, col ${col + 1}`);
        }
        matrix[row][col] = num;
      }
    }
  }

  return matrix;
}




// const puzzle9x9 = [
//   [8, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 3, 6, 0, 0, 0, 0, 0],
//   [0, 7, 0, 0, 9, 0, 2, 0, 0],
//   [0, 5, 0, 0, 0, 7, 0, 0, 0],
//   [0, 0, 0, 0, 4, 5, 7, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0, 3, 0],
//   [0, 0, 1, 0, 0, 0, 0, 6, 8],
//   [0, 0, 8, 5, 0, 0, 0, 1, 0],
//   [0, 9, 0, 0, 0, 0, 4, 0, 0]
// ];

// const empty9x9 = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];

// const sudoku16x16 = [
//   [0, 2, 0, 0, 0, 13, 0, 0, 0, 0, 9, 0, 0, 7, 0, 0],
//   [0, 0, 10, 0, 0, 0, 0, 12, 0, 0, 0, 15, 0, 0, 0, 0],
//   [3, 0, 0, 14, 0, 0, 0, 0, 7, 0, 0, 0, 0, 13, 0, 0],
//   [0, 0, 0, 0, 8, 0, 2, 0, 0, 14, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0, 9, 0, 3, 0, 0, 5, 0, 0, 0],
//   [0, 8, 0, 0, 12, 0, 0, 0, 1, 0, 0, 0, 0, 0, 10, 0],
//   [0, 0, 0, 7, 0, 0, 0, 0, 0, 12, 0, 13, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 7, 0, 0, 0, 2],
//   [0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 5, 0, 7, 0, 0, 12, 0, 0, 0],
//   [0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 15, 0, 0, 0, 8, 0],
//   [0, 3, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 14, 0, 0],
//   [0, 0, 12, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
//   [0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0],
//   [0, 0, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
// ];


// let p = sudokuGenerator(4);
// console.log(p.map(row => row.join(' ')).join('\n'));
// console.log('Clues:', countClues(p));