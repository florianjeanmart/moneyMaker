angular.module('app.controllers').controller("MainCtrl", function($scope) {
  return console.log("je suis le MainCtrl");
});
angular.module('app').run(function($rootScope, $location) {
  return $rootScope.isMenuCurrentlySelected = function(loc) {
    if ($location.path().substring(0, loc.length) === loc) {
      return true;
    } else {
      return false;
    }
  };
});