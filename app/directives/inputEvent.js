module.exports = function ($parse) {
  return {
    compile: function ($element, attr) {
      var fn = $parse(attr['inputEvent'])
      return function (scope, element, attr) {
        element.on('change', function (event) {
          scope.$apply(function () {
            fn(scope, {$event: event})
          })
        })
      }
    }
  }
}
