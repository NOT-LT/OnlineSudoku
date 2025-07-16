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

  /**
   * Recursive search function.
   *
   * @param {number[][]} currentMatrix  The submatrix we’re working on.
   * @param {number[]} currentMapping  Maps each row of currentMatrix → original row index.
   * @param {number[]} partialSoln    The list of original row indices chosen so far.
   */
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
      if (currentMatrix[i][chosenCol] !== 1) continue;

      // This row’s original index:
      const origRowIdx = currentMapping[i];

      // a) Find all columns that this row 'covers':
      const colsToCover = [];
      for (let j = 0; j < numCols; j++) {
        if (currentMatrix[i][j] === 1) {
          colsToCover.push(j);
        }
      }

      // b) If this single row covers *all* remaining columns, we’ve found a full cover in one step:
      if (colsToCover.length === numCols) {
        allSolutions.push(partialSoln.concat(origRowIdx));
        // Continue to next candidate row— there might be other ways to cover everything with this same row as part.
        continue;
      }

      // c) Otherwise, build the reduced matrix by removing all rows that conflict:
      //    - “Conflict” = row has a 1 in any of colsToCover.
      const newRows = [];
      const newRowMap = [];
      for (let r = 0; r < currentMatrix.length; r++) {
        if (r === i) continue;
        // If row r has a 1 in ANY of the columns this row covers, drop it:
        let conflict = false;
        for (const c of colsToCover) {
          if (currentMatrix[r][c] === 1) {
            conflict = true;
            break;
          }
        }
        if (conflict) continue;
        newRows.push(currentMatrix[r].slice());
        newRowMap.push(currentMapping[r]);
      }

      // d) Now remove the covered columns (in descending order so indices stay correct):
      for (const c of colsToCover.slice().sort((a, b) => b - a)) {
        for (let rr = 0; rr < newRows.length; rr++) {
          newRows[rr].splice(c, 1);
        }
      }

      // e) Recurse on the smaller matrix:
      partialSoln.push(origRowIdx);
      search(newRows, newRowMap, partialSoln);
      partialSoln.pop();
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
  [1, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 1]
];

const s1 = [
  [0, 0, 0, 1],
  [1, 0, 1, 0],
  [0, 0, 1, 1],
  [0, 1, 0, 1]
]

// Find *all* exact covers of that 6×7 example
const solutions = findAllExactCovers(example);
console.log("All exact-cover solutions:", solutions);

// Expected output (only one valid cover):
// All exact-cover solutions: [ [ 0, 3, 4 ] ]
// Explanation: Rows 0, 3, 4 cover each of the 7 columns exactly once.
