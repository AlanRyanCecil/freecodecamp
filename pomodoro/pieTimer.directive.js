'use strict';

angular.module('PomodoroApp')
    .directive('pieTimer', ['$window', '$interval', function($window, $interval){

        return {
            restrict: 'E',
            replace: true,
            link: function(scope, iElm, iAttrs, controller) {

            var width = window.innerWidth / scope.widthDivider,
                height = width;

                var svg = d3.select('pie-timer')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + (width / 2) + ', ' + (height / 2) + ')');

                svg.append('circle')
                    .attr('r', scope.rad - 1)
                    .attr('class', 'strokeBG');
                svg.append('path');
                svg.append('circle')
                    .attr('r', scope.rad - (scope.rad / 5))
                    .attr('class', 'fillBG');

                var circ = d3.select('body').selectAll('path');
                var r = 0,
                    x = 0,
                    y = 0,
                    mid = 0,
                    animPie = 0;

                $interval(function(){
                    if (scope.timerOn) {
                        scope.elapsedTime =  scope.timerStart ? Date.now() - scope.timerStart : 0;
                        scope.elapsedTime %= 1000 * scope.totalTime;
                        scope.alpha = 360 * (scope.elapsedTime / (1000 * scope.totalTime));

                        r = ( scope.alpha * Math.PI / 180 );
                        x = Math.sin( r ) * scope.rad;
                        y = Math.cos( r ) * - scope.rad;
                        mid = ( scope.alpha > 180 ) ? 1 : 0;
                        animPie = 'M 0 0 v -' + scope.rad + ' A ' + scope.rad + ' ' + scope.rad + ' 1 '
                                 + mid + ' 1 ' 
                                 +  x  + ' ' 
                                 +  y  + ' z';

                        circ.attr('d', animPie);
                    }
                });

                var timerContainer = d3.select('svg'),
                    timerGroup = d3.select('g'),
                    strokeBG = d3.select('.strokeBG'),
                    fillBG = d3.select('.fillBG');

                angular.element($window).on('resize', function(){
                    scope.rad = (window.innerWidth / scope.widthDivider) / 2;
                    width = window.innerWidth / scope.widthDivider;
                    height = width;

                    timerGroup.attr('transform', 'translate(' + (width / 2) + ', ' + (height / 2) + ')');

                    timerContainer
                        .attr('width', width)
                        .attr('height', width);

                    fillBG.attr('r', scope.rad - (scope.rad / 5));
                    strokeBG.attr('r', scope.rad - 1);
                });

            }
        };
    }]);