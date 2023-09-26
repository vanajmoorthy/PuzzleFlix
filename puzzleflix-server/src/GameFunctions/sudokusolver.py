maxRow, maxColumn = 9, 9

#= [['0' for _ in range(9)] for _ in range(9)]
board = [["0" for _ in range(9)] for _ in range(9)]

def populateBoard(boardString):
    board = eval(boardString)
    return board

def backtrack(i, j):

    if j == maxColumn:
        return backtrack(i+1, 0)

    if i == maxRow:
        return True

    if board[i][j] != 0:
        return backtrack(i, j+1)

    for num in range(1, 10):
        elt = str(num)
        if not isValid(i, j, num):
            continue

        board[i][j] = num

        if backtrack(i, j+1):
            return True
        
        board[i][j] = 0

    return False

def isValid(row, column, num):
    for i in range(9):
        if board[row][i] == num:
            return False
        if board[i][column] == num:
            return False
        if board[(row//3)*3+i//3][(column//3)*3+i%3] == num:
            return False

    return True
    
backtrack(0, 0)
print(board)