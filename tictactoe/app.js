'use strict';

angular.module('TicTacToeApp', ['ngMaterial'])

    .controller('GameCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
        $scope.game = "tic-tac-toe";
        $scope.playingAs = angular.element('.playing-as');

        var selectSection = angular.element('.select-section'),
            boardDisplay = angular.element('#board-display'),
            currentBoard,
            human = 1,
            computer = 2,
            draw = 3,
            humanAvitar,
            computerAvitar,
            humansTurn = false,
            maximizer = true,
            choice,
            emptyCell = null,
            winMessage = "You Won!!!",
            looseMessage = "You Lost :(",
            drawMessage = "It's a Draw!";

        $scope.avitarSelect = function (avitar, computer) {
            fadeBoardIn();
            $scope.humanDisplay =  avitar;
            humanAvitar = avitar;
            computerAvitar = computer;
            if (avitar === 'X') {
                humansTurn = true;
            } else {
                delayedMakeComputerMove(true);
            }
        }

        $scope.humanMakeMove = function (move) {
            if (humansTurn && currentBoard[move] === emptyCell) {
                currentBoard[move] = human;
                updateDisplay(move);
                humansTurn = false;
                if (!GameOver(currentBoard)) {
                    delayedMakeComputerMove();
                }
            }
        }

        function delayedMakeComputerMove (first) {
            var delay = Math.floor(Math.random() * 1000) + 200;
            $timeout(function () {
                makeComputerMove(first);
            }, delay);
        }

        function randomMove () {
            var move = Math.floor(Math.random() * 9);
            return move;
        }

        function makeComputerMove (first) {
            var move;
            if (first) {
                move = randomMove();
            } else {
                minimax(currentBoard, 0);
                move = choice;
            }
                currentBoard[move] = computer;
                updateDisplay(move);
                choice = [];
            if (!GameOver(currentBoard)) {
                    humansTurn = true;
            }
        }

        function updateDisplay (move) {
            var cells = angular.element('.cell'),
                cell = angular.element(cells[move]);
            if (typeof move === 'number') {
                cell.text(currentBoard[move] === human ? humanAvitar : computerAvitar);
                cell.fadeTo(300, 0.83);
            } else {
                cells.text('');
            }
        }

        function newBoard () {
            return new Array(9).fill(emptyCell);
        }

        function startNewGame () {
            humansTurn = false;
            currentBoard = newBoard();
            fadeBoardOut();
            $timeout(function () {
                updateDisplay();
            }, 100);
            choice = null;
        }
        startNewGame();

        function fadeBoardIn () {
            selectSection.fadeTo(300, 0)
            selectSection.slideUp(400);
            $timeout(function () {
                boardDisplay.fadeTo(300, 1);
                $scope.playingAs.fadeTo(300, 1);
            }, 100);
        }

        function fadeBoardOut () {
            boardDisplay.fadeTo(300, 0);
            $scope.playingAs.fadeTo(300, 0);
            $timeout(function () {
                selectSection.fadeTo(300, 1)
                selectSection.slideDown(400);
            }, 300);
        }

        function CheckForWinner (board) {
            if (board[0] && board[0] === board[1] && board[1] === board[2]) {return board[0];}
            if (board[3] && board[3] === board[4] && board[4] === board[5]) {return board[3];}
            if (board[6] && board[6] === board[7] && board[7] === board[8]) {return board[6];}
            if (board[0] && board[0] === board[3] && board[3] === board[6]) {return board[0];}
            if (board[1] && board[1] === board[4] && board[4] === board[7]) {return board[1];}
            if (board[2] && board[2] === board[5] && board[5] === board[8]) {return board[2];}
            if (board[0] && board[0] === board[4] && board[4] === board[8]) {return board[0];}
            if (board[2] && board[2] === board[4] && board[4] === board[6]) {return board[2];}
            return checkForDraw(board);
        }

        function checkForDraw (board) {
            var space =  board.some(function (element) {
                return element === emptyCell;
            });
            return space ? 0 : draw;
        }

        function GameOver(board) {
            switch (CheckForWinner(board)) {
                case 0:
                    return false;
                case human:
                    showEndMessage(winMessage);
                    break;
                case computer:
                    showEndMessage(looseMessage);
                    break;
                default:
                    showEndMessage(drawMessage);
                    break;
            }
            return true;
        }

        function showEndMessage (message) {
            $timeout(function () {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(message)
                )
                    .finally(function () {
                        startNewGame();
                    });
            }, 600);
        }

        $scope.makeMove = function (board, move, player) {
            var newBoard = board.slice(0);
            if (newBoard[move] === emptyCell) {
                newBoard[move] = player;
                return newBoard;
            }
        }

        function minimax (board, depth) {
            if (CheckForWinner(board) !== 0)
                return score(board, depth);
            
            depth+=1;
            var scores = [],
                moves = [],
                availableMoves = GetAvailableMoves(board),
                move, possible_game;

            availableMoves.map(function (value, index) {
                move = availableMoves[index];
                possible_game = GetNewState(board, move);
                scores.push(minimax(possible_game, depth));
                moves.push(move);
                board = UndoMove(board, move);
            })

            var max_score, max_score_index, min_score,
                    min_score_index;
            if (maximizer) {
                max_score = Math.max.apply(Math, scores);
                max_score_index = scores.indexOf(max_score);
                choice = moves[max_score_index];
                return scores[max_score_index];

            } else {
                min_score = Math.min.apply(Math, scores);
                min_score_index = scores.indexOf(min_score);
                choice = moves[min_score_index];
                return scores[min_score_index];
            }
        }

        function GetAvailableMoves(board) {
            var possibleMoves = [];
            board.map(function (value, index) {
                if (board[index] === emptyCell) {
                    possibleMoves.push(index);
                }
            })
            return possibleMoves;
        }

        function score(board, depth) {
            var score = CheckForWinner(board);
            if (score === draw)
                return 0;
            else if (score === human)
                return depth-10;
            else if (score === computer)
                return 10-depth;
        }

        function UndoMove(board, move) {
            board[move] = emptyCell;
            ChangeTurn();
            return board;
        }

        function GetNewState(board, move) {
            var piece = ChangeTurn();
            board[move] = piece;
            return board;
        }

        function ChangeTurn() {
            var avitar;
            if (maximizer) {
                avitar = computer;
            } else {
                avitar = human;
            }
            maximizer = !maximizer;
            return avitar;
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
