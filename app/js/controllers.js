'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);


app.controller('appController', ['$scope', '$http', '$sce', '$firebase', function($scope, $http, $sce, $firebase) {
    $scope.announcement = $firebase(new Firebase("https://plntr-anime-project.firebaseio.com/announcement")).$asObject();

    $scope.animelist = $firebase(new Firebase("https://plntr-anime-project.firebaseio.com/selection")).$asArray();

    $scope.current_anime = $firebase(new Firebase("https://plntr-anime-project.firebaseio.com/current")).$asObject();

    $http.get('assets/test.json');

    $scope.alertNotSupported = function() {
        alert("Feature is not yet supported");
    }

    $scope.vote = {selected: ""};
    $scope.updateVote = function()  {
        var votedTitle = $scope.vote.selected;
        if (votedTitle === "") {
            return;
        }
        var updated = $scope.animelist.map(function(json) {
            if (json.title === votedTitle) {
                json.vote_count++;
            }
            return json;
        });
        $.post('assets/test.json', updated);
    }
}]);
