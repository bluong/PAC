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
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://www.youtube.com**', "www.youtube-nocookie.com**"]);
}]);
