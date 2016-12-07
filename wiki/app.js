'use strict';

angular.module('WikiApp', ['ngMaterial'])
    .controller('MainCtrl', function($scope, $http){
        $scope.greeting = 'wonKi';
        $scope.articles = {};
        $scope.searchTerm = null;

        $scope.getSearchArticle = function () {
            $.ajax({
                type: "GET",
                url: "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages&inprop=url|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + $scope.searchTerm + "&callback=?",
                contentType: "application/json; charset=utf-8",
                async: true,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    $scope.articles = data.query.pages;
                    $scope.$apply();
                    console.log($scope.articles);
                },
                error: function (errorMessage) {
                }
            });

        }

    });