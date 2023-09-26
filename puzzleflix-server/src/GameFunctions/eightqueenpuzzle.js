maxRow = 8;
maxColumn = 8;

const checkWin = (boardString, callback) => {

    const queenCount = 0;

    board = JSON.parse(boardString);

    for (let row = 0; row < maxRow; row++) {
        for (let column = 0; column < maxColumn; column++) {
            if (board[row][column].localeCompare(1) == 0) {
                queenCount++;

                //check that there are no other queens on the same row or same column 
                for (let i = 0; i < maxRow; i++) {
                    if (i != column && board[row][i].localeCompare(1) == 0) {
                        callback([false, "Conflicting Queens"]);
                    }

                    if (i != row && board[i][column].localeCompare(1) == 0) {
                        callback([false, "Conflicting Queens"]);
                    }
                }

                for (let cartesian = 1; cartesian < 5; cartesian++) {

                    const coveredXPos = row;
                    const coveredYPos = column;

                    while (coveredXPos >= 0 && coveredXPos < 8 && coveredYPos >= 0 && coveredYPos < 8) {
                        switch (cartesian) {
                            case 1:
                                coveredXPos++;
                                coveredYPos++;
                                break;

                            case 2:
                                coveredXPos++;
                                coveredYPos--;
                                break;

                            case 3:
                                coveredXPos--;
                                coveredYPos--;
                                break;

                            case 4:
                                coveredXPos--;
                                coveredYPos++;
                                break;

                        }

                        if (board[coveredXPos][coveredYPos].localeCompare(1) == 0) {
                            callback([false, "Conflicting Queens"]);
                        }

                    }
                }
            }
        }
    }

    if (queenCount == 8) {
        callback([true, "Win"]);
    } else {
        callback([false, "Incorrect Number of Queens"]);
    }
}

module.exports = {
    checkWin
}


