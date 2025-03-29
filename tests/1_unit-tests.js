const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        let actual = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
        let expected = true;
        assert.equal(actual, expected);
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        let actual = solver.validate('1.=..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
        let expected = false;
        assert.equal(actual, expected);
    });
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        let actual = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3.');
        let expected = false;
        assert.equal(actual, expected);
    });
    test('Logic handles a valid row placement', () => {
        let actual = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 3);
        let expected = true;
        assert.equal(actual, expected);
    });
    test('Logic handles an invalid row placement', () => {
        let actual = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 1);
        let expected = false;
        assert.equal(actual, expected);
    });
    test('Logic handles a valid column placement', () => {
        let actual = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 3);
        let expected = true;
        assert.equal(actual, expected);
    });
    test('Logic handles an invalid column placement', () => {
        let actual = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 2);
        let expected = false;
        assert.equal(actual, expected);
    });
    test('Logic handles a valid region (3x3 grid) placement', () => {
        let actual = solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 3);
        let expected = true;
        assert.equal(actual, expected);
    });
    test('Logic handles an invalid region (3x3 grid) placement', () => {
        let actual = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 2);
        let expected = false;
        assert.equal(actual, expected);
    });
    test('Valid puzzle strings pass the solver', () => {
        let actual = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
        let expected = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        assert.equal(actual, expected);
    });
    test('Invalid puzzle strings fail the solver', () => {
        let actual = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37');
        let expected = null;
        assert.equal(actual, expected);
    });
    test('Solver returns the expected solution for an incomplete puzzle', () => {
        let actual = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
        let expected = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        assert.equal(actual, expected);
    });
});
