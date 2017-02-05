var angular = require('angular')
require('angular-animate')
require('angular-route')

var app = angular.module('timey', [
  'ngRoute'
])

require('./controllers')
require('./directives')

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider.when('/', {
    controller: 'AppCtrl',
    templateUrl: 'views/home.html'
  })

  $routeProvider.when('/:zones*', {
    controller: 'AppCtrl',
    templateUrl: 'views/home.html'
  })

  $routeProvider.otherwise({
    redirectTo: '/'
  })

  $locationProvider.html5Mode(true)

}])




