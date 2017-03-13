// Create a single Sudoku board cell objectalong with various methods and return the cell object
function boardCell(row, col) {
    var boardCellObj = {
        row: row,
        col: col,
        quadrant: 0,
        knownVal: 0,
        possibleVals: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true },
        solvedVal: 0,
        cellStyle: "",
        displayVal: " ",
        tooltip: " ",
        tooltipPossVals: "",
        solved: false,
        setKnown: function (value) {
            value = Number(value);
            if (value < 1 || value > 9) return;
            this.knownVal = value;
            this.displayVal = value;
            this.solved = true;
            this.possibleVals = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false };
            this.possibleVals[value] = true;
            this.tooltipPossVals = ", PossibleVals: " + value;
            //for (var propertyNum in this.possibleVals) if (this.possibleVals[propertyNum]) this.tooltipPossVals += propertyNum + ", ";
            this.cellStyle += "font-weight: bold;";
        },
        setSolved: function (value) {
            value = Number(value);
            if (value < 1 || value > 9) return;
            this.solvedVal = value;
            this.displayVal = value;
            this.solved = true;
            this.possibleVals = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false };
            this.possibleVals[value] = true;
            this.tooltipPossVals = ", PossibleVals: " + value;
            //for (var propertyNum in this.possibleVals) if (this.possibleVals[propertyNum]) this.tooltipPossVals += propertyNum + ", ";
            this.cellStyle += "color: blue;";
        },
        setPossVals: function (possibleValsObj) {
            this.possibleVals = possibleValsObj;
            this.tooltipPossVals = ", PossibleVals: ";
            for (var propertyNum in this.possibleVals) if (this.possibleVals[propertyNum]) this.tooltipPossVals += propertyNum + ", ";
        }
    }

    // Based on our row and col, determine the quadrant for this cell
    switch (Math.floor((row - 1) / 3)) {
        case 0:
            boardCellObj.quadrant = Math.floor((col - 1) / 3) + 1;
            break;
        case 1:
            boardCellObj.quadrant = Math.floor((col - 1) / 3) + 4;
            break;
        case 2:
            boardCellObj.quadrant = Math.floor((col - 1) / 3) + 7;
            break;
    }

    // Set the style for the background color based on our quadrant
    if ((boardCellObj.quadrant % 2) == 0)
        boardCellObj.cellStyle += " background-color: lightblue;";
    else
        boardCellObj.cellStyle += " background-color: whitesmoke;";

    // Set the basic toolip info for this cell
    boardCellObj.tooltip = "Row: " + row;
    boardCellObj.tooltip += ", Col: " + col;
    boardCellObj.tooltip += ", Quad: " + boardCellObj.quadrant;
    boardCellObj.tooltipPossVals = ", PossibleVals: "
    for (var propertyNum in boardCellObj.possibleVals) if (boardCellObj.possibleVals[propertyNum]) boardCellObj.tooltipPossVals += propertyNum + ", ";

    return boardCellObj;
}

// Create a 9 row by 9 col Sudoku board made up of boardCell objects
function boardCells() {
    var sudokuCells = new Array();

    for (var i = 1; i <= 9; i++) {
        sudokuCells[i - 1] = new Array();
        for (var j = 1; j <= 9; j++) {
            sudokuCells[i - 1][j - 1] = boardCell(i, j);
        }
    }

    return sudokuCells;
}

// Display the current state of our board - Only used with the non-Angular model
function paintBoard(sudokuBoard) {
    var myStr = "<table border=\"1\">";

    for (var i = 1; i <= 9; i++) {
        myStr += "<tr>";
        for (var j = 1; j <= 9; j++) {
            myStr += "<td><div data-tip=\"This is the text of the tooltip2\"><input data-toggle=\"tooltip\" title=\"" + sudokuBoard[i - 1][j - 1].tooltip + sudokuBoard[i - 1][j - 1].tooltipPossVals +
                "\" type=\"text\" size=\"2\" onChange=\"sudokuBoard[" + (i - 1) + "][" + (j - 1) + "].setKnown(this.value);\" value=\"" +
                sudokuBoard[i - 1][j - 1].displayVal + "\" style=\"" + sudokuBoard[i - 1][j - 1].cellStyle + "\"></div></td>";
        }
        myStr += "</tr>";
    }
    myStr += "</table>";
    document.getElementById("sudokuBoard").innerHTML = myStr;
}

// Solve for the value of this particular cell (if possible at this time)
function solveCell(sudokuBoardToSolve, row, col) {
    possibleValsObj = sudokuBoardToSolve[row-1][col-1].possibleVals;

    // Look at existing values in this row and eliminate corresponding possibilities for this cell
    for (var j = 1; j <= 9; j++) {
        if ((sudokuBoardToSolve[row - 1][j - 1].knownVal >= 1 && sudokuBoardToSolve[row - 1][j - 1].knownVal <= 9) ||
            (sudokuBoardToSolve[row - 1][j - 1].solvedVal >= 1 && sudokuBoardToSolve[row - 1][j - 1].solvedVal <= 9)) {
            possibleValsObj[sudokuBoardToSolve[row - 1][j - 1].knownVal] = false;
            possibleValsObj[sudokuBoardToSolve[row - 1][j - 1].solvedVal] = false;
        }
    }

    // Look at existing values in this col and eliminate corresponding possibilities for this cell
    for (var i = 1; i <= 9; i++) {
        if ((sudokuBoardToSolve[i - 1][col - 1].knownVal >= 1 && sudokuBoardToSolve[i - 1][col - 1].knownVal <= 9) ||
            (sudokuBoardToSolve[i - 1][col - 1].solvedVal >= 1 && sudokuBoardToSolve[i - 1][col - 1].solvedVal <= 9)) {
            possibleValsObj[sudokuBoardToSolve[i - 1][col - 1].knownVal] = false;
            possibleValsObj[sudokuBoardToSolve[i - 1][col - 1].solvedVal] = false;
        }
   }

    // Look at existing values in this quadrant and eliminate corresponding possibilities for this cell
    var quadrant = sudokuBoardToSolve[row - 1][col - 1].quadrant;
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            if (sudokuBoardToSolve[i - 1][j - 1].quadrant == quadrant) {
                if ((sudokuBoardToSolve[i - 1][j - 1].knownVal >= 1 && sudokuBoardToSolve[i - 1][j - 1].knownVal <= 9) ||
                    (sudokuBoardToSolve[i - 1][j - 1].solvedVal >= 1 && sudokuBoardToSolve[i - 1][j - 1].solvedVal <= 9)) {
                    possibleValsObj[sudokuBoardToSolve[i - 1][j - 1].knownVal] = false;
                    possibleValsObj[sudokuBoardToSolve[i - 1][j - 1].solvedVal] = false;
                }
            }
        }
    }

    // Update the possibleVals property for this cell
    sudokuBoardToSolve[row - 1][col - 1].setPossVals(possibleValsObj);

    // Check to see if we've narrowed it to only one posisble value at this point
    var possibleCount = 0;
    var possibleVal = 0;
    for (var propertyNum in possibleValsObj) {
        if (possibleValsObj[propertyNum]) {
            possibleVal = propertyNum;
            ++possibleCount;
        }
    }
    if (possibleCount == 1) return possibleVal;


    // We still show multiple possible values for this cell so apply the logic to see if this cell is the 
    // only possible cell in this row, col or quad to contain a given value

    // For each of our possible values, see if any other cell in this row also has the same possible value
    for (var propertyNum in possibleValsObj) {
        if (possibleValsObj[propertyNum]) {
            var uniqueVal = true;  // Assume this is the only cell in the row with this possible value
            for (var j = 1; j <= 9; j++) {
                if ((j != col) &&
                    (sudokuBoardToSolve[row - 1][j - 1].possibleVals[propertyNum])) uniqueVal = false;  //Nope, we found another cell in this row with the same possible value
            }
            if (uniqueVal) return propertyNum;  // This was the only cell in this row with that possible value so return the cell solution
        }
    }

    // For each of our possible values, see if any other cell in this col also has the same possible value
    for (var propertyNum in possibleValsObj) {
        if (possibleValsObj[propertyNum]) {
            var uniqueVal = true;  // Assume this is the only cell in the col with this possible value
            for (var i = 1; i <= 9; i++) {
                if ((i != row) &&
                    (sudokuBoardToSolve[i - 1][col - 1].possibleVals[propertyNum])) uniqueVal = false;  //Nope, we found another cell in this col with the same possible value
            }
            if (uniqueVal) return propertyNum;  // This was the only cell in this col with that possible value so return the cell solution
        }
    }

    // For each of our possible values, see if any other cell in this quadrant also has the same possible value
    for (var propertyNum in possibleValsObj) {
        if (possibleValsObj[propertyNum]) {
            var uniqueVal = true;  // Assume this is the only cell in the quadrant with this possible value
            for (var i = 1; i <= 9 && uniqueVal; i++) {
                for (var j = 1; j <= 9 && uniqueVal; j++) {
                    if ((sudokuBoardToSolve[i - 1][j - 1].quadrant == quadrant) &&          // We're in the same quadrant
                        (i != row || j != col) &&                                           // But not looking at the same cell
                        (sudokuBoardToSolve[i - 1][j - 1].possibleVals[propertyNum])) {     // And the value we are checking is "true" in the list of possible values
                        uniqueVal = false;  //Nope, we found another cell in this quadrant with the same possible value
                    }
                }
            }
            if (uniqueVal) return propertyNum;  // This was the only cell in this quadrant with that possible value so return the cell solution
        }
    }

    // Still no solution for this cell
    return 0;
}

// Run through each cell on the board attempting to solve for it's value, repeat until solved or we can no longer make progress
function solveBoard(sudokuBoardToSolve) {
    var unsolvedCells = true;
    var unsolvedCellCount = 81, unsolvedCellCountPrevious = 82;
    var passNo = 0;

    while (unsolvedCells && (unsolvedCellCount < unsolvedCellCountPrevious)) {
        unsolvedCells = false;
        unsolvedCellCountPrevious = unsolvedCellCount;
        unsolvedCellCount = 0;
        ++passNo;
        for (var i = 1; i <= 9; i++) {
            for (var j = 1; j <= 9; j++) {
                // If not already solved, try to solve this cell
                if (!sudokuBoardToSolve[i - 1][j - 1].solved) {
                    sudokuBoardToSolve[i - 1][j - 1].setSolved(solveCell(sudokuBoardToSolve, i, j));
                    // If still not solved then increment our unsolved count
                    if (!sudokuBoardToSolve[i - 1][j - 1].solved) {
                        unsolvedCells = true;
                        ++unsolvedCellCount;
                    }
                }
            }
        }
        console.log("Finished pass #" + passNo + " with Unsolved Cells: " + unsolvedCellCount);
        if (passNo >= 100) unsolvedCells = false;  // Just give up after 100 passes
    }
    return sudokuBoardToSolve;
}


/* These are helper functions to setup various boards */
function setBoard(sudokuBoard) {
    return setBoardVeryDifficult(sudokuBoard);
}

// For testing purposes pre-fill this easy board
function setBoardEasy(sudokuBoard) {
    sudokuBoard[0][0].setKnown(6);
    sudokuBoard[0][1].setKnown(5);
    sudokuBoard[0][3].setKnown(8);
    sudokuBoard[0][6].setKnown(3);
    sudokuBoard[0][8].setKnown(2);
    sudokuBoard[1][5].setKnown(5);
    sudokuBoard[2][0].setKnown(1);
    sudokuBoard[2][3].setKnown(2);
    sudokuBoard[2][4].setKnown(7);
    sudokuBoard[2][5].setKnown(4);
    sudokuBoard[2][6].setKnown(6);
    sudokuBoard[2][7].setKnown(8);
    sudokuBoard[3][0].setKnown(4);
    sudokuBoard[3][2].setKnown(8);
    sudokuBoard[3][3].setKnown(1);
    sudokuBoard[3][5].setKnown(2);
    sudokuBoard[3][6].setKnown(7);
    sudokuBoard[3][8].setKnown(9);
    sudokuBoard[4][0].setKnown(5);
    sudokuBoard[4][1].setKnown(2);
    sudokuBoard[4][2].setKnown(9);
    sudokuBoard[4][4].setKnown(6);
    sudokuBoard[4][5].setKnown(3);
    sudokuBoard[5][0].setKnown(7);
    sudokuBoard[5][2].setKnown(1);
    sudokuBoard[5][3].setKnown(4);
    sudokuBoard[5][6].setKnown(5);
    sudokuBoard[6][0].setKnown(2);
    sudokuBoard[6][5].setKnown(6);
    sudokuBoard[6][6].setKnown(9);
    sudokuBoard[6][8].setKnown(8);
    sudokuBoard[7][0].setKnown(9);
    sudokuBoard[7][1].setKnown(1);
    sudokuBoard[7][3].setKnown(3);
    sudokuBoard[7][6].setKnown(4);
    sudokuBoard[8][0].setKnown(3);
    sudokuBoard[8][5].setKnown(7);
    sudokuBoard[8][7].setKnown(1);
    return sudokuBoard;
}

// Here is a more difficult board - actually an impossible board to solve without taking a guess
function setBoardVeryDifficult(sudokuBoard) {
    sudokuBoard[0][0].setKnown(5);
    sudokuBoard[0][3].setKnown(7);
    sudokuBoard[1][1].setKnown(7);
    sudokuBoard[1][8].setKnown(8);
    sudokuBoard[2][4].setKnown(4);
    sudokuBoard[2][5].setKnown(3);
    sudokuBoard[2][6].setKnown(1);
    sudokuBoard[3][0].setKnown(4);
    sudokuBoard[3][1].setKnown(1);
    sudokuBoard[3][4].setKnown(5);
    sudokuBoard[3][6].setKnown(7);
    sudokuBoard[3][7].setKnown(8);
    sudokuBoard[3][8].setKnown(3);
    sudokuBoard[4][0].setKnown(3);
    sudokuBoard[4][2].setKnown(6);
    sudokuBoard[4][7].setKnown(5);
    sudokuBoard[4][8].setKnown(1);
    sudokuBoard[5][6].setKnown(2);
    sudokuBoard[6][4].setKnown(2);
    sudokuBoard[6][6].setKnown(4);
    sudokuBoard[6][8].setKnown(7);
    sudokuBoard[7][1].setKnown(3);
    sudokuBoard[7][4].setKnown(1);
    sudokuBoard[8][4].setKnown(3);
    sudokuBoard[8][5].setKnown(8);
    return sudokuBoard;
}

// Let's try this difficult, but not impossible board
function setBoardDifficult(sudokuBoard) {
    sudokuBoard[0][4].setKnown(2);
    sudokuBoard[1][0].setKnown(9);
    sudokuBoard[1][1].setKnown(2);
    sudokuBoard[1][2].setKnown(5);
    sudokuBoard[1][4].setKnown(7);
    sudokuBoard[1][5].setKnown(8);
    sudokuBoard[1][6].setKnown(1);
    sudokuBoard[2][0].setKnown(7);
    sudokuBoard[2][1].setKnown(1);
    sudokuBoard[2][7].setKnown(8);
    sudokuBoard[3][1].setKnown(5);
    sudokuBoard[3][4].setKnown(9);
    sudokuBoard[3][5].setKnown(3);
    sudokuBoard[4][2].setKnown(4);
    sudokuBoard[4][3].setKnown(6);
    sudokuBoard[4][5].setKnown(2);
    sudokuBoard[4][8].setKnown(9);
    sudokuBoard[5][1].setKnown(3);
    sudokuBoard[5][4].setKnown(1);
    sudokuBoard[5][5].setKnown(4);
    sudokuBoard[6][0].setKnown(6);
    sudokuBoard[6][7].setKnown(3);
    sudokuBoard[7][4].setKnown(4);
    sudokuBoard[7][6].setKnown(2);
    sudokuBoard[7][7].setKnown(5);
    sudokuBoard[8][7].setKnown(6);
    sudokuBoard[8][8].setKnown(1);
    return sudokuBoard;
}
