//Game module that contains al the code for the 
//Tic Tac Toe Game
const Game = (
    function() {
        //Game object that will be returned by the Game module whenever it is 
        //initiated. The Game module export object
        var gameObject = {
            //Represents the current container for the game
            board: null,
            //The player whose turn it is to play
            currentPlayer: null,
            //The player 'O' who always starts the game
            Player1: null,
            //The player 'X'
            Player2: null,
            //Indicates if the starting player is the opponent or not
            startingPlayer: null,
            //Holds the value for the winning player
            winningPlayer: null,
            //Boolean to check if the game has started
            gameStarted: false,
            //Boolean to check if game has ended
            gameEnded: false,
            //Boolean to check if the game ended in a draw
            isDraw: false
        };

        //Switch between the various pages as the user progresses
        //from the start page to the results page
        const togglePage = (hidePage, showPage) => {
            //Switch classes of the pages to show or hide the respective pages
            $(hidePage).removeClass('shown');
            $(hidePage).addClass('hidden');
            $(showPage).removeClass('hidden');
            $(showPage).addClass('shown');
        }

        //Changes the state of the board to indicate he current active player
        //The player whose turn it is to make a move when the mouse hovers
        //over the boxes it will either show 'O' or 'X' depending on the current player
        const toggleBoard = () => {
            //Get all boxes in the tic tac toe game
            let boxes = board.find('.box');
            //Variable to hold the class that will either show 'X' or 'O' when the current player
            //mouse hovers over an empty square. active-symbol-o to show 'O' and active-symbol-x to show 'X'
            let symbolClass = currentPlayer.playerSymbol !== 'X' ? 'active-symbol-o' : 'active-symbol-x';
            //Loop and check for the boxes that have not been filled yet and add the class
            //then will enable the box to show 'O' or 'X' when the current player hovers
            //the mouse over the board 
            for (let i = 0; i < boxes.length; i++) {
                if (!boxes[i].classList.contains('box-filled-1') &&
                    !boxes[i].classList.contains('box-filled-2')) {
                    $(boxes[i]).removeClass('active-symbol-o');
                    $(boxes[i]).removeClass('active-symbol-x');
                    $(boxes[i]).addClass(symbolClass);
                }
            }
        }

        //Indicate the current player at the top of the game page
        //by switching the 'active' class on the player1 and player2 list items
        const selectActivePlayer = (playerSymbol, gameBoard) => {
            const $player1Sign = $(gameBoard).find('#player1');
            const $player2Sign = $(gameBoard).find('#player2');

            if (playerSymbol === 'O') {
                $player1Sign.addClass('active');
                $player2Sign.removeClass('active');
            } else {
                $player1Sign.removeClass('active');
                $player2Sign.addClass('active');
            }
        }

        //Set the current player
        const toggleActivePlayer = (player) => {
            currentPlayer = player;
            selectActivePlayer(player.playerSymbol, board);
        }

        //Return an array with the state of the board in terms of the symbols
        //eg. ['X', 1, 'O', 'X', 'O', 'O', 'X', 'O' ] an array of 8 items
        //This will indicate the symbol marked for a particular box or the index
        const getBoard = () => {
            //Get all the game boxes
            let boxes = board.find('.box');
            let currentBoard = [];
            //Loop through all the boxes
            for (let i = 0; i < boxes.length; i++) {
                //If the box contains the class 'box-filled-1' then add the symbol 'O' to the array
                if (boxes[i].classList.contains('box-filled-1')) {
                    currentBoard.push('O');
                }
                //If the box contains the class 'box-filled-2' then add the symbol 'X' to the array
                else if (boxes[i].classList.contains('box-filled-2')) {
                    currentBoard.push('X');
                }
                //If the box contains neither of those classes then add the index to the array
                else {
                    currentBoard.push(i);
                }
            }
            return currentBoard;
        }

        //Return all the boxes that have not been marked as 'X' or 'O'
        const getEmptyBoxes = (board) => {
            return board.filter(s => s != "O" && s != "X");
        }

        //Check if the current board state has a winning combination for a certain symbol
        //Return a boolean true when there is a winning combination and false if 
        //there is no winning combination
        const winning = (board, symbol) => {
            if (
                (board[0] === symbol && board[1] === symbol && board[2] === symbol) ||
                (board[3] === symbol && board[4] === symbol && board[5] === symbol) ||
                (board[6] === symbol && board[7] === symbol && board[8] === symbol) ||
                (board[0] === symbol && board[3] === symbol && board[6] === symbol) ||
                (board[1] === symbol && board[4] === symbol && board[7] === symbol) ||
                (board[2] === symbol && board[5] === symbol && board[8] === symbol) ||
                (board[0] === symbol && board[4] === symbol && board[8] === symbol) ||
                (board[2] === symbol && board[4] === symbol && board[6] === symbol)
            ) {
                return true;
            } else {
                return false;
            }
        }

        //Variable to keep count as to how many times 
        //the minimax function call
        let fc = 0;

        //The minimax function 
        const minimax = (currentBoard, player) => {
            //Add one to function calls
            fc++;
            let moves = [];
            //Check the none filled boxes
            let availableBoxes = getEmptyBoxes(currentBoard);
            //Checks for the state of the board if its a win, lose or draw
            if (Player1.isAI) {
                if (winning(currentBoard, Player2.playerSymbol)) {
                    return { score: -10 };
                } else if (winning(currentBoard, Player1.playerSymbol)) {
                    return { score: 10 };
                } else if (availableBoxes.length === 0) {
                    return { score: 0 };
                }
            }
            if (Player2.isAI) {
                if (winning(currentBoard, Player1.playerSymbol)) {
                    return { score: -10 };
                } else if (winning(currentBoard, Player2.playerSymbol)) {
                    return { score: 10 };
                } else if (availableBoxes.length === 0) {
                    return { score: 0 };
                }
            }
            //Loop through the unmarked boxes
            for (let i = 0; i < availableBoxes.length; i++) {
                //Create an object for each and store the index of that box that was stored as a number in the object's index key
                let move = {};
                move.index = currentBoard[availableBoxes[i]];
                //Set the empty box to the current player
                currentBoard[availableBoxes[i]] = player.playerSymbol;
                //Get the score for the opposing player by calling minimax
                let result = (player === Player1) ? minimax(currentBoard, Player2) : minimax(currentBoard, Player1);
                move.score = result.score;
                //Reset the box to empty
                currentBoard[availableBoxes[i]] = move.index;
                //Add the move to the moves array
                moves.push(move);
            }
            //If its the computer's turn, loop over the moves and choose the move with the highest score
            let bestMove;

            if (player.isAI) {
                bestScore = -10000;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else {
                //Else loop over the moves and choose the move the lowest score
                let bestScore = 10000;
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            //Return the chosen move (object) from the array to the higher depth
            return moves[bestMove];
        }

        //Function used to make the computer player move
        const makeAIMove = () => {
            fc = 0;
            //Get the state of the current board
            let currentBoard = getBoard();
            //Determine the best move and choose the right box to mark
            let bestSpot = minimax(currentBoard, currentPlayer);
            //Get the box
            let box = board.find('.box')[bestSpot.index];
            if (currentPlayer.isAI) {
                setTimeout(() => {
                    //Mark the box with the symbol of the AI player
                    currentPlayer.play(box, currentPlayer);
                    //Check if the game has ended and switch the board to the
                    //player whose turn it is
                    checkGameEnd();
                    toggleActivePlayer((currentPlayer === Player1 ? Player2 : Player1));
                    toggleBoard();
                }, 2000);
            }
        }

        //Function used to make the human player move by marking the box 
        //the player has clicked
        const makeMove = (box, player) => {
            //Boolean to check if a move has been made
            let moveMade = false;
            if (box) {
                //Check if the box if it wasn't previously marked
                if (!box.classList.contains('box-filled-1') &&
                    !box.classList.contains('box-filled-2')) {
                    if (player.playerSymbol === 'O') {
                        moveMade = true;
                        box.classList.add('box-filled-1');
                    } else if (player.playerSymbol === 'X') {
                        moveMade = true;
                        box.classList.add('box-filled-2');
                    }
                }
            }
            return moveMade;
        }

        //Function to check if the conditions that can end the game have been met
        //and then proceeds to show the result
        //Result can be a draw or win
        const checkGameEnd = () => {
            //Get the current board state
            let currentBoard = getBoard();
            //Check if the board state is that the current player has won
            if (winning(currentBoard, currentPlayer.playerSymbol)) {
                gameEnded = true;
                currentPlayer.isWinner = true;
            }
            //If there is no winner check if the board is filled 
            //if so its a draw
            else if (getEmptyBoxes(currentBoard).length === 0) {
                gameEnded = isDraw = true;
            }
            if (!gameEnded) {
                //If the game has not ended change the state of the
                //board for the current player
                toggleBoard();
                //If the current player is AI(Computer) make its move
                //after 1500 milliseconds
                if (currentPlayer.isAI) {
                    setTimeout(makeAIMove, 1500);
                }
            } else {
                //If the game has ended check if its a draw
                if (isDraw) {
                    //Show the tie page if its a draw after 3 seconds
                    setTimeout(() => {
                        togglePage(board.find('#game-page'), board.find('#tie-page'))
                    }, 3000);
                } else {
                    //If its a win then the current player is the winner
                    winningPlayer = currentPlayer;
                    //Check the symbol of the winner and show the respective winner page and name after 3 seconds
                    if (winningPlayer.playerSymbol === "O") {
                        board.find('#win-one-page p').html(winningPlayer.playerName + ' won!!!');
                        setTimeout(() => {
                            togglePage(board.find('#game-page'), board.find('#win-one-page'))
                        }, 3000);
                    } else {
                        board.find('#win-two-page p').html(winningPlayer.playerName + ' won!!!')
                        setTimeout(() => {
                            togglePage(board.find('#game-page'), board.find('#win-two-page'))
                        }, 3000);
                    }
                }
            }
        }

        //Function to start the game
        const start = (gameBoard) => {
            gameStarted = true;
            //Set the active/ current player
            toggleActivePlayer(currentPlayer);
            //If the current player is computer make the AI move
            if (currentPlayer.isAI) {
                makeAIMove();
            }
        }

        //Player class/ module that will hold the properties of the players
        const Player = (playerType, playerName, isAI) => {
            //The player type which is either player1/ player2
            this.playerType = playerType;
            //The name of the player
            this.playerName = playerName;
            //Boolean to indicate whether the player is a computer or not
            this.isAI = isAI;
            //Boolean to indicate if the player is a winner
            this.isWinner = false;
            //If playerType is player1 the symbol is 'O' and 'X' if player2
            if (playerType === 'player1') {
                this.playerSymbol = 'O';
            } else {
                this.playerSymbol = 'X';
            }
            //Function to make a player move by marking the box accordingly
            const play = (box, player) => {
                if (box) {
                    //If the box is not yet marked then mark it with the playerSymbol
                    //by adding the appropriate class
                    if (!box.classList.contains('box-filled-1') &&
                        !box.classList.contains('box-filled-2')) {
                        if (player.playerSymbol === 'O') {
                            box.classList.add('box-filled-1');
                        } else if (player.playerSymbol === 'X') {
                            box.classList.add('box-filled-2');
                        }
                    }
                }
            }
        }

        //Function to initialize the game players
        const initiatePlayers = () => {
            //Get the player names from the respective text inputs
            const player1Name = $('#player-1-name').val();
            const player2Name = $('#player-2-name').val();
            //Check the player who starts
            if (startingPlayer !== 'Opponent') {
                //If it is not the opponent to start initialize the players with the player names as follows
                //if the player name was not provided then assume that it is computer (AI)
                Player1 = { playerType: 'player1', playerSymbol: 'O', playerName: (player1Name ? player1Name : 'Computer'), isAI: !(player1Name), play: makeMove };
                Player2 = { playerType: 'player2', playerSymbol: 'X', playerName: (player2Name ? player2Name : 'Computer'), isAI: !(player2Name), play: makeMove };
            } else {
                Player1 = { playerType: 'player1', playerSymbol: 'O', playerName: (player2Name ? player2Name : 'Computer'), isAI: !(player2Name), play: makeMove };
                Player2 = { playerType: 'player2', playerSymbol: 'X', playerName: (player1Name ? player1Name : 'Computer'), isAI: !(player1Name), play: makeMove };
            }
            currentPlayer = Player1;
            //Set the names of the players on the game board
            $('#player1 p').html(Player1.playerName);
            $('#player2 p').html(Player2.playerName);

        }

        //Function that will be called when the page is loaded to start the game
        //The parameter gameBoard is the container of the game and all its other pages
        gameObject.startGame = (gameBoard) => {
            gameStarted = false;
            gameEnded = false;
            isDraw = false;
            board = $(gameBoard);
            //Click event handler
            board.on('click', (event) => {
                if (event.target.classList.contains('box') && gameStarted && !gameEnded && !currentPlayer.isAI) {
                    //Action when user clicks on a box on the game board in order to mark it
                    if (!currentPlayer.isAI) {
                        //If the current player is not computer or (AI) check if the move made was successful
                        if (makeMove(event.target.classList.contains('box'), currentPlayer)) {
                            //Check if move ended the game as win or tie
                            checkGameEnd();
                            //If the game did not end then change the current player and give the chance to the next player
                            toggleActivePlayer((currentPlayer === Player1 ? Player2 : Player1));
                            toggleBoard();
                        }
                    }
                    //If the new current player is computer make the AI move
                    if (currentPlayer.isAI) {
                        makeAIMove();
                    }
                } else if (event.target['id'] === 'btnEnter') {
                    //Action when user clicks the button on the welcome-page. It moves to the player-page
                    togglePage(board.find('#welcome-page'), board.find('#player-page'));
                } else if (event.target['id'] === 'btnPlayer') {
                    //Action when user clicks the button on the player-page. It moves to the opponent-page
                    //In the player-page one enters the name of the first human player
                    togglePage(board.find('#player-page'), board.find('#opponent-page'));
                } else if (event.target['id'] === 'btnOpponent') {
                    //Action when user clicks the button on the opponent-page. It moves to the player-order-page
                    //In the opponent-page the user may enter the name of the opponent or leave it blank if playing versus
                    //the computer. Select the input names from the text inputs and use them to mark the
                    //buttons on the play-order-page. If no names were supplied then the name assigned will be 'Computer'
                    $('#btnPlayer1').html($('#player-1-name').val() ? $('#player-1-name').val() : 'Computer');
                    $('#btnPlayer2').html($('#player-2-name').val() ? $('#player-2-name').val() : 'Computer');
                    togglePage(board.find('#opponent-page'), board.find('#play-order-page'));
                }
                //Action when the user clicks a button on the player-order-page. This moves to the game-page to start playing.
                //In the play-order-page the user decides who will be the first player. If one clicks the btnPlayer1 button
                //the opponent player will not start and vice-verser
                else if (event.target['id'] === 'btnPlayer1') {
                    startingPlayer = '';
                    initiatePlayers();
                    toggleBoard();
                    togglePage(board.find('#play-order-page'), board.find('#game-page'));
                    start($(gameBoard));
                } else if (event.target['id'] === 'btnPlayer2') {
                    startingPlayer = 'Opponent';
                    initiatePlayers();
                    toggleBoard();
                    togglePage(board.find('#play-order-page'), board.find('#game-page'));
                    start($(gameBoard));
                }
                //On the results page which may indicate the winner or tie when you click the button
                //It will reload the page to restart the game
                else if (event.target['id'] === 'btnRestart1' ||
                    event.target['id'] === 'btnRestart2' ||
                    event.target['id'] === 'btnRestart3') {
                    location.reload();
                }
            });
        }
        return gameObject;
    }()
);