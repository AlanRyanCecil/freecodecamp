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
            UpdateTimeService.work = $scope.work * 60 * 5;
            UpdateTimeService.break = $scope.break * 60 * 5;
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
            // scope: {},
            link: function (scope, ielement, iattrs, controller) {
                var pieCtx = ielement[0].getContext('2d');

                function minToMill (mins) {
                    return mins * 60 * framesPerMin;
                }

                var framesPerMin = 5,
                    workPeriod = minToMill(UpdateTimeService.work),
                    breakPeriod = minToMill(UpdateTimeService.break),
                    data = {
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
                        console.log("working");
                    } else if (UpdateTimeService.work === 0 && UpdateTimeService.break > 0) {
                        UpdateTimeService.break -= 1;
                        updateData();
                        pieChart.data.datasets[0].data[0] += 1;
                        pieChart.update();
                        console.log("on break");
                    } else {
                        $interval.cancel(intervalId);
                        console.log("interval stopped");
                    }
                }, 1000 / framesPerMin);
            }
        }
    }]);