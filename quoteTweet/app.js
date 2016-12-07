'use strict';
angular.module('TweeterApp', ['ngMaterial', 'ngMdIcons'])
    .controller('MainCtrl', ['$scope', '$http', '$templateCache', function ($scope, $http, $templateCache) {

        $scope.getRandomQuote = function () {
            $.ajax( { url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
                success: function ( data ) {
                    var post = data.shift(); // The data is an array of posts. Grab the first one.
                    $(".dynamic-content").fadeOut(function(){
                        $( '#random-quote' ).html( post.content );
                        $( '#quoted' ).text( "- " + post.title );
                        var tweet = $("#random-quote").text().replace(/(:)|(;)/g, function(match, col, semiCol){
                            if (col) return "%3A";
                            if (semiCol) return "%3B";
                        })
                        + "%0A%23" +
                        post.title.replace(/&#(\d+);/g, function(match, code) {
                            return String.fromCharCode(code);
                        }).replace(/(\w*)([^a-zA-Z]+)(\w*)/g, "$1$3");
                        $scope.quote = tweet;
                    });
                    $(".dynamic-content").fadeIn();

                    // If the Source is available, use it. Otherwise hide it.
                    if ( typeof post.custom_meta !== 'undefined' && typeof post.custom_meta.Source !== 'undefined' ) {
                        $( '#quote-source' ).html( 'Source:' + post.custom_meta.Source );
                    } else {
                        $( '#quote-source' ).text( '' );
                    }
                    },
                cache: false
            });
        };

        // $scope.getRandomTweet = function () {
        //     // $.ajax( { url: 'https://api.twitter.com/1.1/',
        //     $.ajax( { url: 'https://stream.twitter.com/1.1/statuses/sample.json',
        //         type: "GET",
        //         dataType: "jsonp",
        //         success: function ( data ) {
        //             var post = data.shift(); // The data is an array of posts. Grab the first one.
        //             $(".dynamic-content").fadeOut(function(){
        //                 $( '#random-quote' ).html( post.content );
        //                 $( '#quoted' ).text( "- " + post.title );
        //                 var tweet = $("#random-quote").text().replace(/(:)|(;)/g, function(match, col, semiCol){
        //                     if (col) return "%3A";
        //                     if (semiCol) return "%3B";
        //                 })
        //                 + "%0A%23" +
        //                 post.title.replace(/&#(\d+);/g, function(match, code) {
        //                     return String.fromCharCode(code);
        //                 }).replace(/(\w*)([^a-zA-Z]+)(\w*)/g, "$1$3");
        //                 $scope.quote = tweet;
        //             });
        //             $(".dynamic-content").fadeIn();

        //             // If the Source is available, use it. Otherwise hide it.
        //             if ( typeof post.custom_meta !== 'undefined' && typeof post.custom_meta.Source !== 'undefined' ) {
        //                 $( '#quote-source' ).html( 'Source:' + post.custom_meta.Source );
        //             } else {
        //                 $( '#quote-source' ).text( '' );
        //             }
        //             },
        //         cache: false
        //     });
        // };

        $scope.getRandomTweet = function () {
            var access_token = '1973004535-it60jdn8PQatSmiyYEX1U6ZutUdMlWja8dk2UaP';
            $http({method: 'GET',
                    url: 'https://stream.twitter.com/1.1/statuses/sample.json?access_token=' + access_token,
                    // url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
                    cache: false})
                .success(function ( data ) {
                    var post = data.shift(); // The data is an array of posts. Grab the first one.
                    $(".dynamic-content").fadeOut(function(){
                        $( '#random-quote' ).html( post.content );
                        $( '#quoted' ).text( "- " + post.title );
                    });
                    $(".dynamic-content").fadeIn();
                    var tweet = $("#random-quote").text() + "%0A%23" +
                        post.title.replace(/(\w*)([^a-zA-Z]+)(\w*)/g, "$1$3");
                    $scope.quote = tweet;
                })
        };

        $scope.facebookPost = function () {
            var id = 'facebook-jssdk';
            var js, fjs = document.getElementsByTagName("script")[0];
            if (document.getElementById(id)) return;
            js = document.createElement("script"); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
            fjs.parentNode.insertBefore(js, fjs);
        };

        $scope.tweet = function () {

        };

        $scope.getRandomQuote();

    }]);