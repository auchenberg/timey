module.exports = function ($parse) {
  return {
    compile: function ($element, attr) {
      var value = $parse(attr['valueFunc'])
      return function (scope, element, attr) {
        scope.$watch(function () {
          element.val(value(scope))
        })
      }
    }
  }
}
