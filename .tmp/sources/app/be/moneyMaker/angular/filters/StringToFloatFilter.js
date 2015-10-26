angular.module('app.filters').filter("stringToFloat", function() {
  return function(input) {
    if (input != null) {
      return parseFloat(input);
    }
  };
});