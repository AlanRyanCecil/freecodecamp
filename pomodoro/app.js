'use strict';

angular.module('PomodoroApp', ['ngMaterial'])
    .controller('PomCtrl', ['$scope', '$interval', '$timeout', function ($scope, $interval, $timeout) {
        $scope.workInput = 25;
        $scope.work = 0;
        $scope.workCache = $scope.workInput;
        $scope.breakInput = 5;
        $scope.break = 0;
        $scope.breakCache = $scope.breakInput;
        $scope.nullTime = 0;
        $scope.timerOn = false;
        $scope.fps = 5;

        $scope.minToMill = function (min) {
            return min * 60 * $scope.fps;
        }

        $scope.updateTime = function () {
            $scope.work = $scope.minToMill($scope.workInput);
            $scope.break = $scope.minToMill($scope.breakInput);
            $scope.workCache = $scope.workInput;
            $scope.breakCache = $scope.breakInput;
            $scope.nullTime = 0;
            $scope.$emit('updateTime');
            console.log("time changed");
        };

        $scope.updateTime();

        $scope.timerStartButton = function () {
            if (!$scope.timerOn) {$scope.soundTone();}
            $scope.timerOn = true;
        };

        $scope.timerStopButton = function () {
            $scope.timerOn = false;
            Tone.Transport.stop();
        };

        $scope.timerResetButton = function () {
            $scope.timerStart = 0;
            $scope.timerOn = false;
            $timeout(function(){
                $scope.timerStopButton();
            }, 2);
        };

        $scope.$on('updateWorkDisplay', function (event, data) {
            $scope.workInput = data / (60 * $scope.fps);
        });

        $scope.$on('updateBreakDisplay', function (event, data) {
            $scope.breakInput = data / (60 * $scope.fps);
        });

        //create a synth and connect it to the master output (your speakers)
        var synth = new Tone.Synth({
            "oscillator" : {
                "type" : "sine",
                "modulationFrequency" : 1
            },
            "envelope" : {
                "attack" : 5,
                "decay" : 5,
                "sustain" : 5,
                "release" : 15,
            }
        }).toMaster();

        $scope.tone = new Tone.Loop(function(time){
            synth.triggerAttackRelease(440, "16n", time);
        }, "1n");
        $scope.tone.start("0m").stop("1m");

        $scope.soundTone =   function () {
            Tone.Transport.start();
            $timeout(function () {
                Tone.Transport.stop();
            }, 100);
        }


    }])

    .directive('chartJsPieTimer', ['$interval',function ($interval) {
        return {
            restrict: 'E',
            replace: true,
            template: '<canvas height="100"></canvas>',
            link: function ($scope, ielement, iattrs, controller) {
                var pieCtx = ielement[0].getContext('2d');

                var data = {
                    datasets: [
                        {
                            data: [0, ($scope.work), ($scope.break)],
                            backgroundColor: [
                                "transparent",
                                "#86b925",
                                "#3e94c3"
                            ],
                            hoverBackgroundColor: [
                                "transparent",
                                "#86b925",
                                "#3e94c3"
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
                        cutoutPercentage: 75,
                        tooltips: {
                            enabled: false
                        }
                    }
                });

                var timeStart = Date.now();

                function updateData () {
                    pieChart.data.datasets[0].data[0] = $scope.nullTime;
                    pieChart.data.datasets[0].data[1] = $scope.work;
                    pieChart.data.datasets[0].data[2] = $scope.break;
                }

                $scope.$on('updateTime', function () {
                    updateData();
                    pieChart.update();
                });

                var intervalId = $interval(function () {
                    if ($scope.work === 1 && $scope.timerOn) {$scope.soundTone();}
                    if ($scope.break === 1 && $scope.timerOn) {$scope.soundTone();}

                    if ($scope.work > 0 && $scope.timerOn) {
                        $scope.work -= 1;
                        $scope.nullTime += 1;
                        updateData();
                        pieChart.update();
                        if ($scope.work % (60 * $scope.fps) === 0) {$scope.$emit('updateWorkDisplay', $scope.work);}
                        console.log("working");
                    } else if (!$scope.work && $scope.break > 0 && $scope.timerOn) {
                        $scope.break -= 1;
                        $scope.nullTime += 1;
                        updateData();
                        pieChart.update();
                        if ($scope.break % (60 * $scope.fps) === 0) {$scope.$emit('updateBreakDisplay', $scope.break);}
                        console.log("on break");
                    } else if (!$scope.work && !$scope.break && $scope.timerOn) {
                        $scope.workInput = $scope.workCache;
                        $scope.breakInput = $scope.breakCache;
                        $scope.work = $scope.minToMill($scope.workCache);
                        $scope.break = $scope.minToMill($scope.breakCache);
                        $scope.nullTime = 0;
                        $scope.timerOn = false;
                        updateData();
                        pieChart.update();
                        console.log("interval stopped");
                    }
                }, 1000 / $scope.fps);
            }
        }
    }]);