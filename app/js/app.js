'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/appPartial.html', controller: 'appController'});
}]);
