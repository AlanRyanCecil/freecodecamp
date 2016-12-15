'use strict';

angular.module('TicTacToeApp', ['ngMaterial'])

    .controller('GameCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
        $scope.game = "tic-tac-toe";
        $scope.selectSection = angular.element('.select-section'),
        $scope.boardDisplay = angular.element('#board-display');
        $scope.playingAs = angular.element('.playing-as');
        $scope.win = "You Won!!!";
        $scope.loose = "You Lost :(";
        $scope.draw = "It's a Draw!";
        $scope.endMessage = $scope.win;

        $scope.freshBoard = function () {
            return ['Z', '', '', '', '', '', '', '', ''];
        }

        $scope.boardState = $scope.freshBoard();

        $scope.updateDisplay = function (board) {
            $scope.cellsDisplay = angular.element('.cell');
            board.map(function (value, index) {
                angular.element($scope.cellsDisplay[index]).text(value);
            })
        }

        $scope.avitarSelect = function (avitar, computer) {
            $scope.human =  avitar;
            $scope.computer = computer;
        }

        $scope.showEndMessage = function (message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(message)
            )
                .finally(function () {
                    $scope.resetGame();
                });
        }

    $scope.checkForWin = function (player, board) {
        if (board[0] === player && board[1] === player && board[2] === player ||
            board[3] === player && board[4] === player && board[5] === player ||
            board[6] === player && board[7] === player && board[8] === player ||
            board[0] === player && board[3] === player && board[6] === player ||
            board[1] === player && board[4] === player && board[7] === player ||
            board[2] === player && board[5] === player && board[8] === player ||
            board[0] === player && board[4] === player && board[8] === player ||
            board[2] === player && board[4] === player && board[6] === player) {
            return true;
        } else {
            return false;
        }
    }

    $scope.checkForTie = function (board) {
        return board.every(function (element) {
            return element !== '';
        });
    }

    function great (a, b) {
        return a > b;
    }

    function less (a, b) {
        return a < b;
    }

    $scope.makeMove = function (board, move, player) {
        var newBoard = Array.from(board);
        if (newBoard[move] === '') {
            newBoard[move] = player;
            return newBoard;
        }
    }

    $scope.miniMax = function(board, max) {
        if (max) {
            var bestMoveValue = -100,
                currentPlayer = $scope.computer,
                opponent = $scope.human,
                greatOrLess = great;
        } else {
            var bestMoveValue = 100,
                currentPlayer = $scope.human,
                opponent = $scope.computer,
                greatOrLess = less;
        }
        if ($scope.checkForWin($scope.computer, board)) {
            return 1;
        } else if ($scope.checkForWin($scope.human, board)) {
            return -1;
        } else if ($scope.checkForTie(board)) {
            return 0;
        } else {
            var newBoard,
                move,
                predictedMoveValue;

            board.map(function (value, index) {
                newBoard = $scope.makeMove(board, index, currentPlayer);
                if (newBoard) {
                    predictedMoveValue = $scope.miniMax(newBoard, !max)[1];
                    if (greatOrLess(predictedMoveValue, bestMoveValue)) {
                        bestMoveValue = predictedMoveValue;
                        move = index;
                    }
                }
            })
            return [move, bestMoveValue];
        }
    };

}])

    .directive('boardCell', ['$timeout', function($timeout){
        return {
            resstrict: 'E',
            template: '<div class="cell" layout="row" layout-align="center center" flex></div>',
            replace: true,
            link: function($scope, elem, attrs, controller) {
                var cell = angular.element(elem).children('.cell')
                angular.element(elem).children('.move').attr('ng-model', 'surfer');
                elem.on('click', function (event) {
                    if ($scope.playersTurn && !cell.text()) {
                        var playIndex = $scope.squares.indexOf(elem.attr('id')),
                            playedSquare = Number($scope.squares.splice(playIndex, 1)[0]);

                        $scope.playersTurn = false;
                        $scope.playersMoves.push(playedSquare);
                        // cell.text($scope.avitar);
                        cell.fadeIn(300);
                        if ($scope.checkForWin($scope.playersMoves, $scope.win)) {
                        } else if ($scope.squares[0]) {
                            $scope.computerTakeTurn();
                        } else {
                            $scope.showEndMessage($scope.draw);
                        }
                    }
                });
            }
        };
    }])

    .config(['$mdAriaProvider', function ($mdAriaProvider) {
        $mdAriaProvider.disableWarnings();
    }]);
