const rowCheck = false;
const regionCheck = false;

class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString.match(/^[1-9.]{81}$/)) {
      return false;
    }
    return true;
  }
  checkRowPlacement(puzzleString, row, column, value) {
    if (!this.validate(puzzleString)) {
      return false;
    }
    let used = {};
    used[value] = true;
    for (let i = 1; i < 10; i++) {
      if (i == column) {
        continue;
      }
      let nextNumber = puzzleString[9*(row-1)+(i-1)];
      if (nextNumber !== "." && !(nextNumber in used)) {
        used[nextNumber] = true;
      }
      else if (nextNumber in used) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (!this.validate(puzzleString)) {
      return false;
    }
    let used = {};
    used[value] = true;
    for (let i = 1; i < 10; i++) {
      if (i == row) {
        continue;
      }
      let nextNumber = puzzleString[9*(i-1)+(column-1)];
      if (nextNumber !== "." && !(nextNumber in used)) {
        used[nextNumber] = true;
      }
      else if (nextNumber in used) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (!this.validate(puzzleString)) {
      return false;
    }
    let pivot = [3*Math.floor((row-1)/3), 3*Math.floor((column-1)/3)];
    let used = {};
    used[value] = true;
    for (let i = 1; i < 10; i++) {
      let idxNextNumber = 9*(pivot[0]+Math.floor((i-1)/3))+(pivot[1]+(i-1)%3)
      if (idxNextNumber === 9*(row-1)+(column-1)) {
        continue;
      }
      let nextNumber = puzzleString[idxNextNumber];
      if (nextNumber !== "." && !(nextNumber in used)) {
        used[nextNumber] = true;
      }
      else if (nextNumber in used) {
        return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return null;
    }
    return this.solveBacktracker(puzzleString, 1, 1);
  }

  solveBacktracker(puzzleString, row,  column) {
    if (puzzleString[9*(row-1)+(column-1)] !== ".") {
      if (column === 9 && row === 9) {
        return puzzleString;
      }
      if (column === 9) {
        return this.solveBacktracker(puzzleString, row+1, 1);
      }
      else {
        return this.solveBacktracker(puzzleString, row, column+1);
      }
    }
    else {
      let ans = "";
      for (let i = 1; i < 10; i++) {
        i = String(i);
        let rowValid = this.checkRowPlacement(puzzleString, row, column, i);
        let columnValid = this.checkColPlacement(puzzleString, row, column, i);
        let regionValid = this.checkRegionPlacement(puzzleString, row, column, i);
        if (rowValid && columnValid && regionValid) {
          let newPuzzleString = puzzleString.slice(0, 9*(row-1)+(column-1)) + String(i) + puzzleString.slice(9*(row-1)+(column-1)+1, puzzleString.length);
          if (column === 9 && row === 9) {
            return newPuzzleString;
          }
          if (column === 9) {
            ans = this.solveBacktracker(newPuzzleString, row+1, 1);
          }
          else {
            ans = this.solveBacktracker(newPuzzleString, row, column+1);
          }
          if (ans !== null && ans.match(/^[1-9]{81}$/)) {
            return ans;
          }
        }
      }
      return null;
    }
  }
}

module.exports = SudokuSolver;
