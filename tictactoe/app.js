'use strict';

angular.module('TicTacToeApp', ['ngMaterial'])

    .controller('GameCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
        $scope.game = "tic-tac-toe";
        $scope.board = angular.element('.board');
        $scope.selectSection = angular.element('.select-section'),
        $scope.playerOne = angular.element('.player-one');
        $scope.win = "You Won!!!";
        $scope.loose = "You Lost :(";
        $scope.draw = "It's a Draw!";
        $scope.endMessage = $scope.win;

        $scope.resetGame = function () {
            $scope.board.fadeTo(500, 0);
            $scope.board.find('.move').fadeOut(300);
            $scope.playerOne.fadeTo(500, 0);
            $scope.selectSection.slideDown(800);
            $scope.selectSection.fadeTo(300, 1);
            $timeout(function () {
                $scope.board.find('.move').text('');
                $scope.avitar = null;
                $scope.computer = null;
                $scope.playersTurn = false;
                $scope.squares = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                $scope.playersMoves = [];
                $scope.computersMoves = [];
            }, 1000);
        }
        $scope.resetGame();

        $scope.avitarSelect = function (avitar, comp) {
            $scope.avitar =  avitar;
            $scope.computer = comp;
            $scope.selectSection.fadeTo(300, 0);
            $timeout(function () {
                $scope.selectSection.slideUp(800);
                $scope.board.fadeTo(500, 1);
                $scope.playerOne.fadeTo(500, 1);
                if ($scope.computer === 'X') {
                    $scope.computerTakeTurn();
                } else {
                    $scope.playersTurn = true;
                }
            }, 400);
        }

        $scope.computerTakeTurn = function () {
            var computerThink = Math.floor(Math.random() * 1000) + 500;
            $timeout(function () {
                var randomIndex = Math.floor(Math.random() * $scope.squares.length),
                    randomId = $scope.squares[randomIndex],
                    compMove = angular.element('#' + randomId).children(),
                    playedSquare = Number($scope.squares.splice(randomIndex, 1)[0])

                $scope.computersMoves.push(playedSquare);
                compMove.text($scope.computer);
                compMove.fadeIn(300);
                $timeout($scope.checkForWin($scope.computersMoves, $scope.loose), 1000);
                $scope.playersTurn = true;
            }, computerThink);
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

        $scope.intersection = function (arr1, arr2) {
            var response = [],
                x;
            for (x in arr2) {
                if (arr1.includes(arr2[x])) {
                    response.push(arr2[x]);
                }
            }
            return response;
        }

        $scope.checkForWin = function (moves, end) {
            if ($scope.intersection(moves, [1, 2, 3]).length === 3 ||
               $scope.intersection(moves, [4, 5, 6]).length === 3 ||
               $scope.intersection(moves, [7, 8, 9]).length === 3 ||
               $scope.intersection(moves, [1, 4, 7]).length === 3 ||
               $scope.intersection(moves, [2, 5, 8]).length === 3 ||
               $scope.intersection(moves, [3, 6, 9]).length === 3 ||
               $scope.intersection(moves, [1, 5, 9]).length === 3 ||
               $scope.intersection(moves, [3, 5, 7]).length === 3 ) {
                $scope.showEndMessage(end);
                return true;
            } else if (!$scope.squares[0]) {
                $scope.showEndMessage($scope.draw);
            }
        }
    }])

    .directive('boardCell', ['$timeout', function($timeout){
        return {
            resstrict: 'E',
            template: '<div class="board-cell" layout="row" layout-align="center center" flex><span class="move"></span></div>',
            replace: true,
            link: function($scope, elem, attrs, controller) {
                elem.on('click', function (event) {
                var playerMove = angular.element(elem).children();
                    if ($scope.playersTurn && !playerMove.text()) {
                        var playIndex = $scope.squares.indexOf(elem.attr('id')),
                            playedSquare = Number($scope.squares.splice(playIndex, 1)[0]);

                        $scope.playersTurn = false;
                        $scope.playersMoves.push(playedSquare);
                        playerMove.text($scope.avitar);
                        playerMove.fadeIn(300);
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
