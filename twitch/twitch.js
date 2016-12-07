'use strict';

angular.module('twitchApp', ['ngMaterial'])
    .controller('twitchCtrl', function($scope, $http){
        $scope.channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
        $scope.streams = [];
        $scope.offline = "http://mediad.publicbroadcasting.net/p/wvxu/files/201503/off_air.png";

        $scope.press = function (channel) {
            $http({
                method: 'GET',
                url: 'https://api.twitch.tv/kraken/streams/' + channel
            }).then(
            function successCallback(response) {
                $scope.streams.push(response.data);
                console.log(response);
            },
            function errorCallback(response) {
                console.log("nayy...");
                console.log(response);
            }
            )
        };
        $scope.streamName = function(url) {
            return url.match(/[\w]*$/i)[0];
        }

        $scope.channelUrl = function(url) {
            return "https://www.twitch.tv/" + $scope.streamName(url);
        }
        angular.element(document).ready(function(){
            console.log("loaded!!!");
            console.log($scope.channels.length);
            for (var i = 0; i < $scope.channels.length; i++) {
                $scope.press($scope.channels[i]);
            }
        })
    })