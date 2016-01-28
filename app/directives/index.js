var app = require('angular').module('timey')

app.directive('inputEvent', require('./inputEvent'))
app.directive('valueFunc', require('./valueFunc'))
app.directive('clock', require('./clock/index'))
