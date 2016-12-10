'use strict';

angular.module('TicTacToeApp', ['ngMaterial'])

    .controller('GameCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.game = "tic-tac-toe";
        $scope.avitar = null;
        var board = angular.element('.board'),
            selectSection = angular.element('.select-section'),
            playerOne = angular.element('.player-one');
        $scope.avitarSelect = function (avitar) {
            $scope.avitar =  avitar;
            board.fadeTo(1000, 1);
            selectSection.fadeTo(300, 0);
            selectSection.slideUp(1000);
            $timeout(function () {
                playerOne.fadeTo(1000, 1);
            }, 900);
        }
    }])

    .directive('boardCell', [function(){
        return {
            resstrict: 'E',
            template: '<div class="board-cell" layout="row" layout-align="center center" flex><span class="move"></span></div>',
            replace: true,
            link: function($scope, elem, attrs, controller) {
                elem.on('click', function (event) {
                    var move = angular.element(elem).children();
                    if (!$scope.avitar) {
                        alert("Please select X or O")
                    } else if (!move.text()) {
                        move.text($scope.avitar);
                        move.fadeIn(500);
                    }
                });
            }
        };
    }]);