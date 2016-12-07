'use strict';

angular.module('PomodoroApp', ['ngMaterial'])
    .controller('PomCtrl', ['$scope', '$interval', '$timeout', 'UpdateTimeService', function ($scope, $interval, $timeout, UpdateTimeService) {
        $scope.work = 2;
        $scope.break = 1;
        $scope.totalTime = ($scope.work + $scope.break) * 60;
        $scope.timerStart = 0;
        $scope.timerStop = true;
        $scope.timerOn = false;
        $scope.timeAtStop = 0;
        $scope.elapsedTime = 0;
        $scope.alpha = 0;
        $scope.widthDivider = 3;
        $scope.rad = (window.innerWidth / $scope.widthDivider) / 2;

        $scope.updateTime = function () {
            // $scope.totalTime = ($scope.work + $scope.break) ? ($scope.work + $scope.break) * 60 : 60;
            UpdateTimeService.work = $scope.work * 60 * UpdateTimeService.fps;
            UpdateTimeService.break = $scope.break * 60 * UpdateTimeService.fps;
            console.log("time changed");
        };

        $scope.timerStartButton = function () {
            if (!$scope.timerOn) {
                $scope.timerStart = $scope.timerStart ? Date.now() - ($scope.timeAtStop - $scope.timerStart) : Date.now();
                $scope.timerOn = true;
            }

        };
        $scope.timerStopButton = function () {
            if ($scope.timerOn) {
                $scope.timeAtStop = Date.now();
                $scope.timerOn = false;
            }
        };

        $scope.timerResetButton = function () {
            $scope.timerStart = 0;
            $timeout(function(){
                $scope.timerStopButton();
            }, 2);
        };

        $scope.$on('updateWorkDisplay', function (event, data) {
            $scope.work = data / (60 * UpdateTimeService.fps);
        });

        $scope.$on('updateBreakDisplay', function (event, data) {
            $scope.break = data / (60 * UpdateTimeService.fps);
        });

    }])

    .service('UpdateTimeService', [function () {
        this.fps = 5;
        this.work = 600;
        this.break = 300;
    }])

    .directive('chartJsPieTimer', ['$interval', 'UpdateTimeService', function ($interval, UpdateTimeService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<canvas height="100"></canvas>',
            link: function (scope, ielement, iattrs, controller) {
                var pieCtx = ielement[0].getContext('2d');

                var data = {
                    // labels: [
                    //     "",
                    //     "Work",
                    //     "Break"
                    // ],
                    datasets: [
                        {
                            data: [0, (UpdateTimeService.work), (UpdateTimeService.break)],
                            backgroundColor: [
                                "transparent",
                                "#86b925",
                                "#28a386"
                            ],
                            hoverBackgroundColor: [
                                "transparent",
                                "#86b925",
                                "#28a386"
                            ],
                            borderWidth: [0, 0, 0],
                            borderColor: [
                                "transparent",
                                "#86b925",
                                "#28a386"
                            ]
                        }]
                };

                var pieChart = new Chart(pieCtx, {
                    type: 'doughnut',
                    data: data,
                    options: {
                        cutoutPercentage: 85,
                        tooltips: {
                            enabled: false
                        }
                    }
                });

                var timeStart = Date.now();

                function updateData () {
                    pieChart.data.datasets[0].data[1] = UpdateTimeService.work;
                    pieChart.data.datasets[0].data[2] = UpdateTimeService.break;
                }

                var intervalId = $interval(function () {
                    if (UpdateTimeService.work > 0) {
                        UpdateTimeService.work -= 1;
                        updateData();
                        pieChart.data.datasets[0].data[0] += 1;
                        pieChart.update();
                        if (UpdateTimeService.work % (60 * UpdateTimeService.fps) === 0) {scope.$emit('updateWorkDisplay', UpdateTimeService.work);}
                        console.log("working");
                    } else if (UpdateTimeService.work === 0 && UpdateTimeService.break > 0) {
                        UpdateTimeService.break -= 1;
                        updateData();
                        pieChart.data.datasets[0].data[0] += 1;
                        pieChart.update();
                        if (UpdateTimeService.break % (60 * UpdateTimeService.fps) === 0) {scope.$emit('updateBreakDisplay', UpdateTimeService.break);}
                        console.log("on break");
                    } else {
                        $interval.cancel(intervalId);
                        console.log("interval stopped");
                    }
                }, 1000 / UpdateTimeService.fps);
            }
        }
    }]);