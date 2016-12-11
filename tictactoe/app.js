'use strict';

angular.module('TicTacToeApp', ['ngMaterial'])

    .controller('GameCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
        $scope.game = "tic-tac-toe";
        $scope.board = angular.element('.board');
        $scope.selectSection = angular.element('.select-section'),
        $scope.playerOne = angular.element('.player-one');
        $scope.playersMoves = [];
        $scope.computersMoves = [];
        $scope.win = "You Won!!!";
        $scope.loose = "You Lost :(";
        $scope.endMessage = $scope.win;

        $scope.resetGame = function () {
            $scope.board.fadeTo(1000, 0);
            $scope.selectSection.slideDown(1000);
            $scope.selectSection.fadeTo(300, 1);
            $scope.playerOne.fadeTo(1000, 0);
            $scope.avitar = null;
            $scope.computer = null;
            $scope.squares = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            $timeout(function () {
                $scope.board.find('.move').text('');
            }, 1000);
        }
        $scope.resetGame();

        $scope.avitarSelect = function (avitar, comp) {
            $scope.avitar =  avitar;
            $scope.computer = comp;
            $scope.board.fadeTo(1000, 1);
            $scope.selectSection.fadeTo(300, 0);
            $scope.selectSection.slideUp(1000);
            $timeout(function () {
                $scope.playerOne.fadeTo(1000, 1);
            }, 900);
        }

        $scope.showEndMessage = function (message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(message)
            )
                .finally(function () {
                    $scope.resetGame();
                    console.log("Dialog closed!");
                });
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
                    console.log($scope.squares);
                    if (!playerMove.text()) {
                        var playIndex = $scope.squares.indexOf(elem.attr('id')),
                            playedSquare = $scope.squares.splice(playIndex, 1);

                        playerMove.text($scope.avitar);
                        playerMove.fadeIn(300);
                        var computerThink = Math.floor(Math.random() * 1000) + 500;
                        if ($scope.squares[0]) {
                            $timeout(function () {
                                var randomIndex = Math.floor(Math.random() * $scope.squares.length);
                                var randomId = $scope.squares[randomIndex];
                                var compMove = angular.element('#' + randomId).children();
                                $scope.computersMoves.push($scope.squares.splice(randomIndex, 1));
                                console.log(randomId);

                                compMove.text($scope.computer);
                                compMove.fadeIn(300);
                            }, computerThink);
                        } else {
                            $scope.showEndMessage($scope.win);
                        }
                    }
                });
            }
        };
    }]);