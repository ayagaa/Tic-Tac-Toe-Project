//Game module that contains al the code for the 
//Tic Tac Toe Game
const Game = (
    function() {
        //Game object that will be returned by the Game module whenever it is 
        //initiated
        var gameObject = {
            //Represents the current container for the game
            board: null,
            //The player whose turn it is to play
            currentPlayer: null,
            //The player who starts the game
            Player1: null,
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

        //Changes the state of the board to indicate he current active player
        //The player whose turn it is to make a move
        const toggleBoard = () => {
            //Get all boxes in the tic tac toe game
            let boxes = board.find('.box');
            //Variable to hold the class 
            let symbolClass = currentPlayer.playerSymbol !== 'X' ? 'active-symbol-o' : 'active-symbol-x';

            for (let i = 0; i < boxes.length; i++) {
                if (!boxes[i].classList.contains('box-filled-1') &&
                    !boxes[i].classList.contains('box-filled-2')) {
                    $(boxes[i]).removeClass('active-symbol-o');
                    $(boxes[i]).removeClass('active-symbol-x');
                    $(boxes[i]).addClass(symbolClass);
                }
            }
        }

        const checkGameEnd = () => {
            let currentBoard = getBoard();

            if (winning(currentBoard, currentPlayer.playerSymbol)) {
                gameEnded = true;
                currentPlayer.isWinner = true;
            } else if (getEmptyBoxes(currentBoard).length === 0) {
                gameEnded = isDraw = true;
            }
            if (!gameEnded) {
                toggleBoard();
                if (currentPlayer.isAI) {
                    setTimeout(makeAIMove, 1500);
                }
            } else {
                if (isDraw) {
                    setTimeout(() => {
                        togglePage(board.find('#game-page'), board.find('#tie-page'))
                    }, 3000);
                } else {
                    winningPlayer = currentPlayer;
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

        const makeAIMove = () => {
            fc = 0;
            let currentBoard = getBoard();
            let bestSpot = minimax(currentBoard, currentPlayer);
            let box = board.find('.box')[bestSpot.index];
            if (currentPlayer.isAI) {
                setTimeout(() => {
                    currentPlayer.play(box, currentPlayer);
                    checkGameEnd();
                    toggleActivePlayer((currentPlayer === Player1 ? Player2 : Player1));
                    toggleBoard();
                }, 2000);
            }
        }

        const toggleActivePlayer = (player) => {
            currentPlayer = player;
            selectActivePlayer(player.playerSymbol, board);
        }

        const start = (gameBoard) => {
            gameStarted = true;
            toggleActivePlayer(currentPlayer);
            if (currentPlayer.isAI) {
                makeAIMove();
            }
        }

        const makeMove = (box, player) => {
            if (box) {
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

        const togglePage = (hidePage, showPage) => {
            $(hidePage).removeClass('shown');
            $(hidePage).addClass('hidden');
            $(showPage).removeClass('hidden');
            $(showPage).addClass('shown');
        }

        const initiatePlayers = () => {
            const player1Name = $('#player-1-name').val();
            const player2Name = $('#player-2-name').val();
            if (startingPlayer !== 'Opponent') {
                Player1 = { playerType: 'player1', playerSymbol: 'O', playerName: (player1Name ? player1Name : 'Computer'), isAI: !(player1Name), play: makeMove };
                Player2 = { playerType: 'player2', playerSymbol: 'X', playerName: (player2Name ? player2Name : 'Computer'), isAI: !(player2Name), play: makeMove };
            } else {
                Player1 = { playerType: 'player1', playerSymbol: 'O', playerName: (player2Name ? player2Name : 'Computer'), isAI: !(player2Name), play: makeMove };
                Player2 = { playerType: 'player2', playerSymbol: 'X', playerName: (player1Name ? player1Name : 'Computer'), isAI: !(player1Name), play: makeMove };
            }
            currentPlayer = Player1;
            $('#player1 p').html(Player1.playerName);
            $('#player2 p').html(Player2.playerName);

        }

        const getBoard = () => {
            let boxes = board.find('.box');
            let currentBoard = [];
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].classList.contains('box-filled-1')) {
                    currentBoard.push('O');
                } else if (boxes[i].classList.contains('box-filled-2')) {
                    currentBoard.push('X');
                } else {
                    currentBoard.push(i);
                }
            }
            return currentBoard;
        }

        let fc = 0;

        const getEmptyBoxes = (board) => {
            return board.filter(s => s != "O" && s != "X");
        }

        const minimax = (currentBoard, player) => {
            fc++;
            let moves = [];
            let availableBoxes = getEmptyBoxes(currentBoard);
            if (Player1.isAI) {
                if (winning(currentBoard, Player2.playerSymbol)) {
                    return { score: -10 };
                } else if (winning(currentBoard, Player1.playerSymbol)) {
                    return { score: 10 };
                } else if (availableBoxes.length === 0) {
                    return { score: 0 };
                }
            } else {
                if (winning(currentBoard, Player1.playerSymbol)) {
                    return { score: -10 };
                } else if (winning(currentBoard, Player2.playerSymbol)) {
                    return { score: 10 };
                } else if (availableBoxes.length === 0) {
                    return { score: 0 };
                }
            }

            for (let i = 0; i < availableBoxes.length; i++) {
                let move = {};
                move.index = currentBoard[availableBoxes[i]];
                currentBoard[availableBoxes[i]] = player.playerSymbol;
                let result = (player === Player1) ? minimax(currentBoard, Player2) : minimax(currentBoard, Player1);
                move.score = result.score;

                currentBoard[availableBoxes[i]] = move.index;

                moves.push(move);
            }

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
                let bestScore = 10000;
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        }

        const Player = (playerType, playerName, isAI) => {
            this.playerType = playerType;
            this.playerName = playerName;
            this.isAI = isAI;
            this.isWinner = false;
            if (playerType === 'player1') {
                this.playerSymbol = 'O';
            } else {
                this.playerSymbol = 'X';
            }
            const play = (box, player) => {
                if (box) {
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

        const winning = (board, player) => {
            if (
                (board[0] == player && board[1] == player && board[2] == player) ||
                (board[3] == player && board[4] == player && board[5] == player) ||
                (board[6] == player && board[7] == player && board[8] == player) ||
                (board[0] == player && board[3] == player && board[6] == player) ||
                (board[1] == player && board[4] == player && board[7] == player) ||
                (board[2] == player && board[5] == player && board[8] == player) ||
                (board[0] == player && board[4] == player && board[8] == player) ||
                (board[2] == player && board[4] == player && board[6] == player)
            ) {
                return true;
            } else {
                return false;
            }
        }

        gameObject.startGame = (gameBoard) => {
            gameStarted = false;
            gameEnded = false;
            isDraw = false;
            board = $(gameBoard);
            board.on('click', (event) => {
                if (event.target.classList.contains('box') && gameStarted && !gameEnded && !currentPlayer.isAI) {
                    if (!currentPlayer.isAI) {
                        currentPlayer.play(event.target, currentPlayer);
                        checkGameEnd();
                        toggleActivePlayer((currentPlayer === Player1 ? Player2 : Player1));
                        toggleBoard();
                    }
                    if (currentPlayer.isAI) {
                        makeAIMove();
                    }
                } else if (event.target['id'] === 'btnEnter') {
                    togglePage(board.find('#welcome-page'), board.find('#player-page'));
                } else if (event.target['id'] === 'btnPlayer') {
                    togglePage(board.find('#player-page'), board.find('#opponent-page'));
                } else if (event.target['id'] === 'btnOpponent') {
                    $('#btnPlayer1').html($('#player-1-name').val() ? $('#player-1-name').val() : 'Computer');
                    $('#btnPlayer2').html($('#player-2-name').val() ? $('#player-2-name').val() : 'Computer');
                    togglePage(board.find('#opponent-page'), board.find('#play-order-page'));
                } else if (event.target['id'] === 'btnPlayer1') {
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
                } else if (event.target['id'] === 'btnRestart1' ||
                    event.target['id'] === 'btnRestart2' ||
                    event.target['id'] === 'btnRestart3') {
                    location.reload();
                }
            });
        }
        return gameObject;
    }()
);