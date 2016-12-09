'use strict';

angular.module('TicTacToeApp', ['ngMaterial'])

    .controller('GameCtrl', ['$scope', function ($scope) {
        $scope.game = "tic-tac-toe";
        $scope.avitar = 'X';
        $scope.avitarSelect = function (avitar) {
            $scope.avitar = avitar;
        }
    }])

    .directive('boardCell', [function(){
        return {
            resstrict: 'E',
            template: '<div class="boardCell" layout="row" layout-align="center center" flex><span class="move"></span></div>',
            replace: true,
            link: function($scope, elem, attrs, controller) {
                elem.on('click', function (event) {
                    var move = angular.element(elem).children();
                    move.text($scope.avitar);
                    console.log("clicked!");
                });
            }
        };
    }]);