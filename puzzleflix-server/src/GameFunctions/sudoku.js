const db = require('../database.js');

/* Check if matches solution

Puzzle Format: [[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9]...]

*/


const emptyBoard = () => {
    // Generate an empty sudoku board by filling the array with 0
    var sudokuArr = new Array(81).fill(0);

    return sudokuArr;
};

// Check if the puzzle is valid
const checkValidity = (values) => {

    var inputArray = eval(values);

    // Check if the rows are valid 
    if (inputArray.length != 9) {
        //console.log("incorrect row count");
        return false;
    } else {
        // Check if the columns are valid
        var correctColumnLength = true;
        for (var i = 0; i < inputArray.length; i++) {
            if (inputArray[i].length != 9) {
                correctColumnLength = false;
                break;
            }
        }
        if (correctColumnLength) {
            //console.log("valid rows and columns ");
            return true;
        } else {
            //console.log("invalid columns");
            return false;
        }
    }
};

// Check if the solution is viable
const checkSolution = (values, callback) => {
    var solutionArr = eval(values);

    //  Check if the solution is in the range of the board
    checkValidity(solutionArr);
    var rowValid = true;
    // Create a temporary array to store the rows
    var rowElements = [];

    // Check the row arrays
    for (var i = 0; i < 9; i++) {
        //  Store the row arrays into the temp array to check
        //  Sort the elements to check if the elements are from 1 to 9
        rowElements = solutionArr[i].slice().sort();
        for (var j = 0; j <= 8; j++) {

            if (rowElements[j] != j + 1) {
                rowValid = false;
                //console.log("solution rows incorrect");
                break;

            }

        }
        rowElements = [];



    }
    var columnValid = true;
    // Check the columns 
    for (var column = 0; column < 9; column++) {

        let thisCol = [];

        for (row = 0; row < 9; row++) {
            thisCol.push(solutionArr[row][column]);
        }

        //  Sort the elements to check if the elements are from 1 to 9
        thisCol.sort();
        for (var k = 0; k <= 8; k++) {
            if (thisCol[k] != k + 1) {
                columnValid = false;
                //console.log("solution column incorrect");
                break;
            }
        }
    }
    /*  Return false if either the rows or the columns are incorrect
        Return true if both the rows and columns are correct
    */
    var validSolution = true;
    if (rowValid == false || columnValid == false) {
        //console.log("Solution incorrect"); 
        validSolution = false;
        callback(validSolution);
    } else {
        //console.log("Solution correct");
        validSolution = true;
        callback(validSolution);
    }



};

const checkMatchPID = (pid, solution, callback) => {
    // Get Correct solution from db
    correctSolution = [1];

    db.getPuzzleSolutionID(pid, (puzzleData) => {
        //console.log(puzzleData);
        correctSolution = puzzleData;

        // Check
        callback(checkMatch(solution, correctSolution, callback));
    });

};

// Working 
const checkMatch = (solution, correctSolution, callback) => {

    // Ensure that they are the same AND in the correct order
    solution = solution.toString();
    correctSolution = correctSolution.toString();
    isSolved = (solution == correctSolution);

    callback(isSolved);
};

// Clear board


// Export
module.exports = {
    checkMatch,
    checkSolution
};

// export function checkSolution(values,callback){
// return callback;
// }

let arr1 = [[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9]];
let arr2 = [[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[1, 2, 3, 4, 5, 6, 8, 7, 9]];

let arr3 = [];

//checkMatch(arr1,arr2, function(callback) {
//    console.log(callback);
//});

//checkValidity(arr1);

/*
checkMatchPID('9cfa47f0-5ad7-11ed-84c1-af3d0d645b35', "arr3", function(callback) {
    console.log(callback);
});
*/

/*
let puzzle = '[[0,0,0,0,0,5,9,0,8],[0,8,7,1,0,0,0,4,0],[6,0,4,7,0,8,0,0,0],[7,0,0,0,0,0,0,0,0],[0,0,0,5,0,0,1,0,0],[0,0,0,0,4,0,0,0,0],[2,0,0,0,5,0,0,0,0],[0,0,0,0,0,0,2,0,1],[0,0,6,0,2,0,0,3,0]]';
let sol = '[[1,2,3,4,6,5,9,7,8],[5,8,7,1,9,2,3,4,6],[6,9,4,7,3,8,5,1,2],[7,3,2,6,1,9,4,8,5],[4,6,9,5,8,3,1,2,7],[8,1,5,2,4,7,6,9,3],[2,7,1,3,5,4,8,6,9],[3,4,8,9,7,6,2,5,1],[9,5,6,8,2,1,7,3,4]]';

checkSolution(sol, function(callback) {
    console.log(callback);
});*/