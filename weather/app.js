'use strict';

angular.module('WeatherApp', ['ngMaterial'])
    .controller('MainCtrl', function ($scope, $http, $sce) {
        $scope.message = "Hello Weather";
        $scope.posts = [];
        $scope.weather = {};
        $scope.tempDisp = true;
        $scope.background = '';

        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var key = 'be3abaa02a1f027b';
            var url = 'https://api.wunderground.com/api/' + key + '/conditions/geolookup/q/' + lat + ',' + lng + '.json';
            
            $http.get(url).then(function(response){
                var data = response.data;
                $scope.weather.location = data.location.city + ", " + data.location.state;
                $scope.weather.condition = data.current_observation.weather;
                $scope.weather.temp_f = data.current_observation.temp_f + String.fromCharCode(176) + "F";
                $scope.weather.temp_c = data.current_observation.temp_c + String.fromCharCode(176) + "C";
                $scope.weather.temp_x = $scope.weather.temp_f;
                selectBackground();
                $('#readout-container').fadeIn();
            });
    });
        $scope.scaleToggle = function(){
            var temp = angular.element('#temperature');

            if ($scope.weather.temp_x === $scope.weather.temp_f) {
                $scope.weather.temp_x = $scope.weather.temp_c;
            } else {
                $scope.weather.temp_x = $scope.weather.temp_f;
            }
        }

        function selectBackground(){
            var condition = $scope.weather.condition;
            if (condition.match('Scattered Clouds')) $scope.background = 'http://www.goodwp.com/images/201102/goodwp.com_15328.jpg';
            if (condition.match('Partly Cloudy')) $scope.background = 'http://wallpapercave.com/wp/U3S60PL.jpg';
            if (condition.match('Mostly Cloudy')) $scope.background = 'http://hayatimagazine.com/wp-content/uploads/2015/04/tree-under-cloudy-sky-nature-hd-wallpaper-1920x1200-3821.jpg';
            if (condition.match('Overcast')) $scope.background = 'http://www.artsfon.com/pic/201502/1920x1200/artsfon.com-58070.jpg';
            if (condition.match('Fog')) $scope.background = 'http://www.pptback.com/uploads/fog-and-landscapes-backgrounds-powerpoint.jpg';
            if (condition.match('Rain')) $scope.background = 'http://en.dailypakistan.com.pk/wp-content/uploads/2015/07/48.jpg';
            if (condition.match('Thunderstorm')) $scope.background = 'http://i.imgur.com/jaiTh.jpg?2';
            if (condition.match('Snow')) $scope.background = 'http://www.zastavki.com/pictures/1920x1200/2009/Winter_wallpapers_Snowstorm_019273_.jpg';
        }
})

    .directive('backgroundDirective', function(){

        return {
            restrict: 'E',
            replace: true,
            template: '<div></div>',
            link: function($scope, iElm, iAttrs, controller) {
                iElm.css({
                    'background-image': 'url("' + $scope.background + '")',
                    'width': '100vw',
                    'height': '300vh',
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px'
                });
                $scope.$watch('background', function(newValue, oldValue){
                    if (newValue !== oldValue) {
                        iElm.fadeOut(function(){
                            iElm.css({'background-image': 'url("' + $scope.background + '")'});
                            iElm.fadeIn();
                        });
                    }
                });
            }
        }
    });