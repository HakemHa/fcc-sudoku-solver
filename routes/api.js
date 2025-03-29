'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (!("puzzle" in req.body && "coordinate" in req.body && "value" in req.body)) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      let puzzleString = req.body.puzzle;
      if (puzzleString.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }
      if (!(solver.validate(puzzleString))) {
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }
      let coordinate = req.body.coordinate.toUpperCase();
      let column = coordinate[1];
      let row = String(coordinate[0].charCodeAt(0) - 64);
      if (coordinate.length !== 2 || coordinate[0].charCodeAt(0) > 73 || coordinate[0].charCodeAt(0) < 65 || coordinate[1].charCodeAt(0) > 57 || coordinate[1].charCodeAt(0) < 49) {
        res.json({ error: 'Invalid coordinate' });
        return;
      }
      let value = req.body.value;
      if (value.length > 1 || value.charCodeAt(0) < 49 || value.charCodeAt(0) > 57) {
        res.json({ error: 'Invalid value' });
        return;
      }
      let rowValid = solver.checkRowPlacement(puzzleString, row, column, value);
      let columnValid = solver.checkColPlacement(puzzleString, row, column, value);
      let regionValid = solver.checkRegionPlacement(puzzleString, row, column, value);
      let valid = rowValid && columnValid && regionValid;
      if (valid) {
        res.json({ valid: valid });
        return;
      }
      else {
        let conflict = [];
        if (!rowValid) conflict.push('row');
        if (!columnValid) conflict.push('column');
        if (!regionValid) conflict.push('region');
        res.json({ valid:valid, conflict:conflict });
        return;
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!("puzzle" in req.body)) {
        res.json({ error: 'Required field missing' });
        return;
      }
      let puzzleString = req.body.puzzle;
      if (puzzleString.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }
      if (!(solver.validate(puzzleString))) {
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }
      let solution = solver.solve(puzzleString);
      if (solution === null) {
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }
      res.json({ solution:solution });
      return;
    });
};
