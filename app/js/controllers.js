'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);


app.controller('appController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $http.get('assets/selection.json').then(function(response) {
        if (response.status === 200 && response.data != null) {
            $scope.animelist = response.data;
        }
    })

    $http.get('assets/current.json').then(function(response) {
        if (response.status === 200 && response.data != null) {
            $scope.current_anime = response.data;

            $sce.trustAsResourceUrl($scope.current_anime.trailer_url);
        }
    })

    $http.get('assets/announcement.json').then(function(response) {
        if (response.status === 200 && response.data != null) {
            $scope.announcement = response.data;
        }
    })

    $scope.alertNotSupported = function() {
        alert("Feature is not yet supported");
    }
}]);
