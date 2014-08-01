'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'firebase'
]).
config(['$locationProvider', '$routeProvider', '$sceProvider', '$sceDelegateProvider', function($locationProvider, $routeProvider, $sceProvider, $sceDelegateProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/appPartial.html', controller: 'appController'});
    $routeProvider.when('/entries', {templateUrl: 'partials/entriesPartial.html', controller: 'entriesController'});
    $routeProvider.when('/announcements', {templateUrl: 'partials/announcementsPartial.html', controller: 'announcementsController'});
    // $routeProvider.when('/entries', {templateUrl: 'partials/entriesPartial.html', controller: 'entriesController'});
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://www.youtube.com**']);
}]);
