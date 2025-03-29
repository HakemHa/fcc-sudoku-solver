const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({'puzzle': '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
            .end(function(err, res){
                let actual = res.body.solution;
                let expected = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Required field missing';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({'puzzle': '1.5.=2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Invalid characters in puzzle';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({'puzzle': '1.5.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Expected puzzle to be 81 characters long';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({'puzzle': '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
            .end(function(err, res){
                let actual = res.body.solution;
                let expected = null;
                assert.equal(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "A3",
                value: "5"
            })
            .end(function(err, res){
                let actual = res.body.valid;
                let expected = true;
                assert.equal(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "A4",
                value: "8"
            })
            .end(function(err, res){
                let actual = res.body.conflict;
                let expected = ["row"];
                assert.sameMembers(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "A2",
                value: "5"
            })
            .end(function(err, res){
                let actual = res.body.conflict;
                let expected = ["row", "region"];
                assert.sameMembers(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "A7",
                value: "2"
            })
            .end(function(err, res){
                let actual = res.body.conflict;
                let expected = ["row", "column", "region"];
                assert.sameMembers(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                value: "2"
            })
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Required field(s) missing';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "Z7",
                value: "2"
            })
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Invalid coordinate';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "A72",
                value: "2"
            })
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Invalid coordinate';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "A0",
                value: "2"
            })
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Invalid coordinate';
                assert.equal(actual, expected);
                done();
            });
    });
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: "A1",
                value: "A"
            })
            .end(function(err, res){
                let actual = res.body.error;
                let expected = 'Invalid value';
                assert.equal(actual, expected);
                done();
            });
    });
});

