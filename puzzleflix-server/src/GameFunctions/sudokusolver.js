const maxRow = 9;
const maxColumn = 9;

let board = new Array(9).fill(0).map(() => new Array(9).fill(0));
let solutionCount = 0;
var solution = new Array();

const backtrack = (i, j) => {
    if (j === maxColumn) {
        return backtrack(i + 1, 0);
    }

    if (i === maxRow) {
        solutionCount++;
        if (solutionCount > 1) {
            return true;
        } else {
            solution = JSON.parse(JSON.stringify(board));
            return false;
        }
    }

    if (board[i][j] !== 0) {
        return backtrack(i, j + 1);
    }

    for (let num = 1; num <= 9; num++) {
        if (!isValid(i, j, num)) {
            continue;
        }

        board[i][j] = num;

        if (backtrack(i, j + 1)) {
            return true;
        }

        board[i][j] = 0;
    }

    return false;
};

const isValid = (row, column, num) => {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) {
            return false;
        }

        if (board[i][column] === num) {
            return false;
        }

        if (
            board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][
                Math.floor(column / 3) * 3 + (i % 3)
            ] === num
        ) {
            return false;
        }
    }

    return true;
};

const runSolver = (puzzleBoard, callback) => {
    try {
        board = JSON.parse(JSON.stringify(puzzleBoard));
        solutionCount = 0;
        solution = new Array();
        backtrack(0, 0);
        if (solutionCount == 0) {
            callback([false, "Your puzzle has no solution. Make sure it has a unique solution.", null]);
        } else if (solutionCount == 1) {
            solutionCount = 0;
            callback([true, "Unique Solution", solution]);
        } else if (solutionCount == 2) {
            solutionCount = 0;
            callback([false, "Your puzzle has more than one solution. Make sure it has a unique solution.", null]);
        }
    } catch (error) {
        return error;
    }
};

/**
 * randomly generate a complete sudoku board
 * @returns a complete sudoku board
 */
const generateCompleteBoard = () => {
    board = new Array(9).fill(0).map(() => new Array(9).fill(0));
    n = 20 - Math.floor(Math.random() * 10);
    let row, column, num;
    Math.floor(Math.random() * 10);

    while (n > 0) {
        row = Math.floor(Math.random() * 9);
        column = Math.floor(Math.random() * 9);
        if (board[row][column] == 0) {
            num = Math.floor(Math.random() * 9) + 1;
            if (isValid(row, column, num)) {
                board[row][column] = num;
                n--;
            }
        }
    }
    backtrack(0, 0);
    return solution;
};

/**
 * Generate a random sudoku board which has a unique solution
 */
const generateRandomSudoku = () => {
    sudoku = JSON.parse(JSON.stringify(generateCompleteBoard()));

    //generate an array of 81 numbers containing 0-80 where each element is distinct but randomly ordered
    let randomArray = new Array(81).fill(0).map((_, i) => i);
    randomArray.sort(() => Math.random() - 0.5);

    let index, row, column, value;
    //remove 30-50 numbers from the sudoku board
    let n = 30 + Math.floor(Math.random() * 20);
    while (n > 0 && randomArray.length > 0) {
        index = randomArray.pop();
        row = Math.floor(index / 9);
        column = index % 9;
        value = sudoku[row][column];
        sudoku[row][column] = 0;
        runSolver(sudoku, (result) => {
            if (result[0] == false) {
                sudoku[row][column] = value;
            } else {
                n--;
            }
        });
    }
    return sudoku;
};

module.exports = {
    runSolver,
    generateRandomSudoku,
};
