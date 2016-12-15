'use strict';

angular.module('TicTacToeApp', ['ngMaterial'])

    .controller('GameCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
        $scope.game = "tic-tac-toe";
        $scope.playingAs = angular.element('.playing-as');

        var selectSection = angular.element('.select-section'),
            boardDisplay = angular.element('#board-display'),
            currentBoard,
            computerAvitar,
            humansTurn = false,
            choice,
            emptyCell = '',
            win = "You Won!!!",
            loose = "You Lost :(",
            draw = "It's a Draw!",
            human = 1,
            computer = 2;

        $scope.avitarSelect = function (avitar, computer) {
            $scope.humanAvitar =  avitar;
            computerAvitar = computer;
            if (avitar === 'X') {
                humansTurn = true;
            } else {
                makeComputerMove();
            }
        }

        $scope.humanMakeMove = function (index) {
            if (humansTurn && currentBoard[index] === '') {
                currentBoard[index] = $scope.humanAvitar;
                updateDisplay();
                humansTurn = false;
                if (!GameOver(currentBoard)) {
                    makeComputerMove();
                }
            }
        }

        function makeComputerMove () {
                minimax(currentBoard, 0);
                var move = $scope.choice;
                currentBoard[move] = computerAvitar;
                updateDisplay();
                choice = [];
            if (!GameOver(currentBoard)) {
                    humansTurn = true;
            }
            // active_turn = "HUMAN";
            // if (!GameOver(currentBoard))
            // {
                
            // }
        }

        function updateDisplay () {
            var cells = angular.element('.cell');
            currentBoard.map(function (value, index) {
                angular.element(cells[index]).text(value);
            })
        }

        function startNewGame () {
            $scope.humanAvitar = null;
            humansTurn = false;
            currentBoard = ['', '', '', '', '', '', '', '', ''];
            updateDisplay();
            choice = null;
        }
        startNewGame();

        function checkForWin (player, board) {
            if (board[0] === player && board[1] === player && board[2] === player ||
                board[3] === player && board[4] === player && board[5] === player ||
                board[6] === player && board[7] === player && board[8] === player ||
                board[0] === player && board[3] === player && board[6] === player ||
                board[1] === player && board[4] === player && board[7] === player ||
                board[2] === player && board[5] === player && board[8] === player ||
                board[0] === player && board[4] === player && board[8] === player ||
                board[2] === player && board[4] === player && board[6] === player) {
                return player;
            }
        }

        function checkForDraw (board) {
            return board.every(function (element) {
                return element !== '';
            });
        }

        function GameOver(game) {
            if (CheckForWinner(game) === 0)
                return false;
            else if (CheckForWinner(game) === 1)
            {
                showEndMessage(draw);
            }
            else if (CheckForWinner(game) === 2)
            {
                showEndMessage(win);
            }
            else
            {
                showEndMessage(loose);
            }
            return true;
        }

        function showEndMessage (message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(message)
            )
                .finally(function () {
                    startNewGame();
                });
        }

        $scope.computerTakeTurn = function () {
            if ($scope.checkForWin($scope.humanAvitar, currentBoard)) {
                $scope.showEndMessage($scope.win);
            } else if ($scope.checkForWin(computerAvitar, currentBoard)) {
                $scope.showEndMessage($scope.loose);
            } else if ($scope.checkForDraw(currentBoard)) {
                $scope.showEndMessage($scope.draw);
            } else {
                var move = $scope.miniMax(currentBoard, true)[0];
                currentBoard[move] = computerAvitar;
                updateDisplay();
                // updateDisplay();
                humansTurn = true;
            }
        }

        function great (a, b) {
            return a > b;
        }

        function less (a, b) {
            return a < b;
        }

        $scope.makeMove = function (board, move, player) {
            var newBoard = board.slice(0);
            if (newBoard[move] === '') {
                newBoard[move] = player;
                return newBoard;
            }
        }

        function minimax (tempBoardGame, depth) {
            if (CheckForWinner(tempBoardGame) !== 0)
                return score(tempBoardGame, depth);
            
            depth+=1;
            var scores = [],
                moves = [],
                availableMoves = GetAvailableMoves(tempBoardGame),
                move, possible_game;

            availableMoves.map(function (value, index) {
                move = availableMoves[index];
                possible_game = GetNewState(move, tempBoardGame);
                scores.push(minimax(possible_game, depth));
                moves.push(move);
                tempBoardGame = UndoMove(tempBoardGame, move);
            })

            var max_score, max_score_index, min_score,
                    min_score_index;
            if (active_turn === "COMPUTER") {
                max_score = Math.max.apply(Math, scores);
                max_score_index = scores.indexOf(max_score);
                $scope.choice = moves[max_score_index];
                return scores[max_score_index];

            } else {
                min_score = Math.min.apply(Math, scores);
                min_score_index = scores.indexOf(min_score);
                $scope.choice = moves[min_score_index];
                return scores[min_score_index];
            }
        }

        function GetAvailableMoves(board) {
            var possibleMoves = [];
            currentBoard.map(function (value, index) {
                if (board[index] === emptyCell) {
                    possibleMoves.push(index);
                }
            })
            return possibleMoves;
        }

}])

    .service('indexService', [function () {
        var i = 0;
        this.index = function () {
            return i++;
        }
    }])

    .directive('boardCell', ['$timeout', 'indexService', function($timeout, indexService){
        return {
            resstrict: 'E',
            template: '<div class="cell" layout="row" layout-align="center center" flex></div>',
            replace: true,
            link: function($scope, elem, attrs, controller) {
                var index = indexService.index(),
                    cell = angular.element(elem);
                cell.attr('id', index);
                elem.on('click', function (event) {
                    $scope.humanMakeMove(index);
                });
            }
        };
    }])

    .config(['$mdAriaProvider', function ($mdAriaProvider) {
        $mdAriaProvider.disableWarnings();
    }]);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var BOARD_SIZE = 9;
var UNOCCUPIED = '';
var HUMAN_PLAYER = 'O';
var COMPUTER_PLAYER = 'X';
var active_turn = "HUMAN";
var searchTimes = new Array();
var showAverageTime = true;



function MakeMove(pos)
{
    if (!GameOver(board) && board[pos] == UNOCCUPIED)
    {
        board[pos] = HUMAN_PLAYER;
        if (!GameOver(board))
        {
            // var alert = document.getElementById("turnInfo");
            // active_turn = "COMPUTER";
            // alert.innerHTML = "Computer's turn.";
            // makeComputerMove();
        }
    }
}

function score(game, depth) {
    var score = CheckForWinner(game);
    if (score === 1)
        return 0;
    else if (score === 2)
        return depth-10;
    else if (score === 3)
        return 10-depth;
}

function UndoMove(game, move) {
    game[move] = UNOCCUPIED;
    ChangeTurn();
    return game;
}

function GetNewState(move, game) {
    var piece = ChangeTurn();
    game[move] = piece;
    return game;
}

function ChangeTurn() {
    var piece;
    if (active_turn === "COMPUTER") {
        piece = 'X';
        active_turn = "HUMAN";
    } else {
        piece = 'O';
        active_turn = "COMPUTER";
    }
    return piece;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN_PLAYER won
//   3 if COMPUTER_PLAYER won
function CheckForWinner(game) {
    // Check for horizontal wins
    var i;
    for (i = 0; i <= 6; i += 3)
    {
        if (game[i] === HUMAN_PLAYER && game[i + 1] === HUMAN_PLAYER && game[i + 2] === HUMAN_PLAYER)
            return 2;
        if (game[i] === COMPUTER_PLAYER && game[i + 1] === COMPUTER_PLAYER && game[i + 2] === COMPUTER_PLAYER)
            return 3;
    }

    // Check for vertical wins
    for (i = 0; i <= 2; i++)
    {
        if (game[i] === HUMAN_PLAYER && game[i + 3] === HUMAN_PLAYER && game[i + 6] === HUMAN_PLAYER)
            return 2;
        if (game[i] === COMPUTER_PLAYER && game[i + 3] === COMPUTER_PLAYER && game[i + 6] === COMPUTER_PLAYER)
            return 3;
    }

    // Check for diagonal wins
    if ((game[0] === HUMAN_PLAYER && game[4] === HUMAN_PLAYER && game[8] === HUMAN_PLAYER) ||
            (game[2] === HUMAN_PLAYER && game[4] === HUMAN_PLAYER && game[6] === HUMAN_PLAYER))
        return 2;

    if ((game[0] === COMPUTER_PLAYER && game[4] === COMPUTER_PLAYER && game[8] === COMPUTER_PLAYER) ||
            (game[2] === COMPUTER_PLAYER && game[4] === COMPUTER_PLAYER && game[6] === COMPUTER_PLAYER))
        return 3;

    // Check for tie
    for (i = 0; i < BOARD_SIZE; i++)
    {
        if (game[i] !== HUMAN_PLAYER && game[i] !== COMPUTER_PLAYER)
            return 0;
    }
    return 1;
}
