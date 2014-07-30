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
        for (var i = 0; i < $scope.animelist.length; i++) {
            if ($scope.animelist[i].title === votedTitle) {
                $scope.animelist[i].vote_count++;
                $scope.animelist.$save(i);
            }
        }
        alert("Vote has been recorded");
        $('input[name=title]').attr('checked',false);
    }
}]);
