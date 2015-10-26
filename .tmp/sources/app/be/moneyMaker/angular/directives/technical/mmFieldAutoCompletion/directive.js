angular.module('app.directives').directive("mmFieldAutoCompletion", function(directiveService) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngInfo: '='
    }),
    templateUrl: "$/angular/templates/mm-field-auto-completion.html",
    replace: true,
    transclude: true,
    link: function(scope) {
      directiveService.autoScopeImpl(scope);
      scope.result = null;
      scope.$watch('result', function() {
        if (scope.result != null) {
          scope.getInfo().field = scope.result.originalObject.key;
        } else {
          scope.getInfo().field = null;
        }
        return scope.isValid();
      });
      scope.isValid = function() {
        var isValid;
        if (scope.getInfo().disabled === true || scope.getInfo().hidden === true) {
          scope.getInfo().isValid = true;
          return;
        }
        isValid = true;
        if (!(scope.getInfo().field != null)) {
          isValid = false;
        }
        scope.getInfo().isValid = isValid;
        return;
      };
      scope.isValid();
      return scope.logField = function() {
        return console.log(scope.getInfo());
      };
    }
  };
});