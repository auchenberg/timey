var angular = require('angular')
require('angular-animate')
require('angular-route')

var app = angular.module('app', [
  'ngRoute'
])

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider.when('/', {
    controller: 'AppController',
    templateUrl: 'views/home.html'
  })

  $routeProvider.when('/:zones*', {
    controller: 'AppController',
    templateUrl: 'views/home.html'
  })

  $routeProvider.otherwise({
    redirectTo: '/'
  })

  $locationProvider.html5Mode(true)

}])

module.exports = app
