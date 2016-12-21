'use strict';

angular.module('SimonSaysApp')

    .directive('gameConsole', ['$interval',function ($interval) {
        return {
            restrict: 'E',
            replace: true,
            template: '<canvas height="150"></canvas>',
            link: function ($scope, elem, attrs, controller) {
                var gameCtx = elem[0].getContext('2d');

                var data = {
                    labels: ['red', 'blue', 'yellow', 'green'],
                    datasets: [
                        {
                            data: [25, 25, 25, 25],
                            backgroundColor: [
                                '#B50018',
                                '#004DC7',
                                '#F2BA00',
                                '#16C041'
                            ],
                            hoverBackgroundColor: [
                                '#E50024',
                                '#1C4CDC',
                                'yellow',
                                '#24DE27'
                            ],
                            borderWidth: [11, 11, 11, 11],
                            borderColor: [
                                '#333333',
                                '#333333',
                                '#333333',
                                '#333333',
                            ]
                        }]
                };

                var gameDisplay = new Chart(gameCtx, {
                    type: 'doughnut',
                    data: data,
                    options: {
                        cutoutPercentage: 50,
                        tooltips: {
                            enabled: false
                        },
                        onClick: function (event, item) {
                            if (item[0]) {
                                console.log(item[0]._index);
                            }
                        }
                    }
                });
            }
        }
    }]);