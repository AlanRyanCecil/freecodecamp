'use strict';

angular.module('CalculatorApp', ['ngMaterial'])
    .controller('MainCtrl', ['$scope', function($scope){
        $scope.greeting = "Hello Calculator!";
        $scope.displayScreen = "0";

        var opperator = "",
            answer = 0,
            persist = false,
            point = true,
            x = NaN,
            y = NaN;

        $scope.numberButton = function(numb) {
            console.log(numb);
            if (!persist && numb === '0') {
                return;
            }

            if ($scope.displayScreen.length < 10) {
                $scope.displayScreen = persist ? $scope.displayScreen += numb : numb;
            }
            persist = true;
        };

        $scope.opperatorButton = function(opp){
            if (opperator) {
                $scope.calculate();
            }

            x = parseFloat($scope.displayScreen);
            opperator = opp;
            persist = false;
            point = true;
        }

        $scope.pointButton = function() {
            if (point) {
                $scope.displayScreen = persist ? $scope.displayScreen += '.' : '0.';
            }
            persist = true;
            point = false;
        }

        $scope.clear = function(){
            $scope.displayScreen = "0";
            persist = false;
            point = true;
        };

        $scope.calculate = function(){
            y = parseFloat($scope.displayScreen);

            switch (opperator){
                case '+':
                    answer = x + y;
                    break;
                case '-':
                    answer = x - y;
                    break;
                case 'X':
                    answer = x * y;
                    break;
                case '/':
                    answer = x / y;
                    break;
            }
            $scope.displayScreen = answer.toPrecision(10) == answer ? answer.toString() : answer.toPrecision(7);
            x = NaN;
            y = NaN;
            opperator = "";
            persist = false;
        }
    }])