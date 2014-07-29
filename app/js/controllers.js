'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);


app.controller('appController', ['$scope', '$http', function($scope, $http) {
    $http.get('assets/makeshift.json').then(function(response) {
        if (response.status === 200 && response.data != null) {
            $scope.animelist = response.data;
        }
    })

    $http.get('assets/current.json').then(function(response) {
        if (response.status === 200 && response.data != null) {
            $scope.current_anime = response.data;
        }
    })
}]);
