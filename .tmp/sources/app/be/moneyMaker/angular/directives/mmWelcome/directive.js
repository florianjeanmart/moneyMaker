angular.module('app.directives').directive("mmWelcome", function($location, $http) {
  return {
    restrict: "E",
    scope: {},
    templateUrl: "$/angular/templates/mm-welcome.html",
    replace: true,
    transclude: true,
    link: function(scope) {
      scope.nav = function(loc) {
        return $location.path(loc);
      };
      return scope.test = function() {
        return $http.get("test");
      };
    }
  };
});