document.addEventListener("DOMContentLoaded", function() {
    var sq = document.getElementsByClassName("square");
    var squares = [];
    for (prop in sq) { // Converting this HTMLCollection object into an actual array to make array methods available.
        squares.push(sq[prop]);
    }
    squares = squares.slice(0, 9); //Removing the additional properties that were inherited by the conversion (just want to refer only to the 9 squares on the grid)
    var game = {
        playerLetter: "",
        compLetter: "",
        isOver: false,
        onFirstMove: true,
        reset: function() {
            game.isOver = true;
            setTimeout(function() {
                var board = document.querySelector(".board");
                board.classList.remove("flip-board");
                setTimeout(function() {
                    document.location = document.location.href;
                }, 1000);
            }, 2000);
        },
        checkForDraw: function() {
            var testArray = squares.filter(function(value) {
                return value.dataset.ismarked === "true";
            });
            if (testArray.length === 9) {
                message("It's a draw. Restarting game.");
                this.reset();
            }
        }
    };

    var winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function message(string) {
        var message = document.getElementById("message");
        message.innerHTML = string;
        message.classList.add("enlarge-message");
        setTimeout(function() {
            message.classList.remove("enlarge-message");
        }, 500);

    }

    function compMark(position) { // Functionality for computer-player to mark a square with a letter
        var square = squares[position];
        var letter = document.createTextNode(game.compLetter);
        square.appendChild(letter);
        square.dataset.ismarked = "true";
        square.dataset.claimedby = "comp";
    }

    function compMove() { //Complete logic for computer decision-making process
        var compMadeMove = false;

        function testForWinChance(array) {
            var newArray = [];
            array.map(function(num) {
                if (squares[num].dataset.claimedby !== "comp") {
                    newArray.push(num);
                }
            });
            if (newArray.length === 1 && squares[newArray[0]].dataset.ismarked === "false") {
                if (game.isOver === false) {
                    compMark(newArray[0]);
                    console.log("Complete Row!");
                    message("I win. Restarting game...");
                    game.isOver = true;
                    compMadeMove = true;
                    game.reset();
                }
            }
        }

        function testForNeedToBlock(array) {
            var newArray = [];
            array.map(function(num) {
                if (squares[num].dataset.claimedby !== "player") {
                    newArray.push(num);
                }
            });
            if (newArray.length === 1 && squares[newArray[0]].dataset.ismarked === "false") {
                compMark(newArray[0]);
                console.log("Block!");
                message("Blocked.");
                compMadeMove = true;

            }
        }

        //Do AI Logic and make decision
        aiLogic: {
            if (game.isOver === false && game.onFirstMove === true) { //Comp will try to take center as first move
                if (squares[4].dataset.ismarked === "false") {
                    compMark(4);
                    game.onFirstMove === false;
                    console.log("Take Center on first move!");
                    break aiLogic;
                }
            }
            if (game.isOver === false) { //Comp will try to get center on second move
                var newArray = [];
                var positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                positions.map(function(num) {
                    if (squares[num].dataset.ismarked === "true") {
                        newArray.push(num);
                    }
                });
                if (newArray.length === 1 && squares[4].dataset.ismarked === "false") {
                    compMark(4);
                    console.log("Take center on second move!");
                    break aiLogic;
                }
            }
            if (game.isOver === false) { //If player took center as first move, comp will take a corner
                var newArray = [];
                var positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                positions.map(function(num) {
                    if (squares[num].dataset.ismarked === "true") {
                        newArray.push(num);
                    }
                });
                if (newArray.length === 1 && squares[4].dataset.claimedby === "player") {
                    var randomCorner = Math.floor((Math.random() * 4) + 1);
                    switch (randomCorner) {
                        case 1:
                            compMark(0);
                            break;
                        case 2:
                            compMark(2);
                            break;
                        case 3:
                            compMark(6);
                            break;
                        case 4:
                            compMark(8);
                            break;
                    }
                    console.log("Take a corner");
                    break aiLogic;
                }
            }
            if (game.isOver === false) { //Comp looks for chance to get three in row
                winConditions.map(function(array) {
                    testForWinChance(array);
                });
                if (compMadeMove) {
                    game.checkForDraw();
                    break aiLogic;
                }
            }
            if (game.isOver === false) { //Comp checks if player is about to complete three in row, and if so, blocks
                winConditions.map(function(array) {
                    testForNeedToBlock(array);
                });
                if (compMadeMove) {
                    game.checkForDraw();
                    break aiLogic;
                }
            }
            if (game.isOver === false) { //If comp has center square, then it will pick left or right square as next option
                var newArray = [];
                var positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                positions.map(function(num) {
                    if (squares[num].dataset.ismarked === "true") {
                        newArray.push(num);
                    }
                });
                if (newArray.length === 2 && squares[4].dataset.claimedby === "comp") {
                    if (squares[3].dataset.ismarked === "false") {
                        compMark(3);
                        console.log("Second middle row!");
                        message("You're in trouble.");
                        break aiLogic;
                    }
                    else {
                        compMark(5);
                        console.log("Second middle row!");
                        message("You're in trouble.");
                        break aiLogic;
                    }

                }

            }
            if (game.isOver === false) { // Otherwise, comp just picks a random square
                var availablePos = [];
                var positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                positions.map(function(num) {
                    if (squares[num].dataset.ismarked === "false") {
                        availablePos.push(num);
                    }
                });
                var randomChoice = Math.round((Math.random() * (availablePos.length - 1)));
                compMark(availablePos[randomChoice]);
                console.log("Random choice! " + randomChoice);
                game.checkForDraw();
                break aiLogic;
            }

        }
    }

    function decideWhoStarts() {
        var coinFlip = Math.round(Math.random());
        if (coinFlip === 0) {
            message("You go first.");
            game.onFirstMove = false;
        }
        else {
            message("I get the first move.");
            compMove();
            game.onFirstMove = false;
        }
    }

    (function() { //Functionality allowing the user to select X vs O
        var choices = document.getElementsByClassName("choice-button");
        for (i = 0; i < choices.length; i++) {
            choices[i].addEventListener("click", function() {

                if (this.innerHTML === "X") {
                    var board = document.querySelector(".board");
                    game.playerLetter = "X";
                    game.compLetter = "O";
                    board.classList.toggle("flip-board");
                    document.getElementById("xChoice").style.visibility = "hidden";
                    document.getElementById("oChoice").style.visibility = "hidden";
                }
                else if (this.innerHTML === "O") {
                    var board = document.querySelector(".board");
                    game.playerLetter = "O";
                    game.compLetter = "X";
                    board.classList.toggle("flip-board");
                    document.getElementById("xChoice").style.visibility = "hidden";
                    document.getElementById("oChoice").style.visibility = "hidden";
                };
                decideWhoStarts();
            });
        }
    }());

    (function() { //Functionality for human-player to mark a square with a letter.
        var squares = document.getElementsByClassName("square");
        for (i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", function() {
                if (!this.innerHTML && game.isOver === false) { //As long as the square being clicked is empty
                    var letter = document.createTextNode(game.playerLetter);
                    this.appendChild(letter);
                    this.dataset.ismarked = "true";
                    this.dataset.claimedby = "player";
                    game.checkForDraw();
                    compMove();
                }
            });
        }
    }());

    document.addEventListener("keyup", function(event) {
        //console.log(event.keyCode);
        if (event.keyCode === 90) {
            var board = document.querySelector(".board");
            board.classList.toggle("flip-board");
        }
    });

});