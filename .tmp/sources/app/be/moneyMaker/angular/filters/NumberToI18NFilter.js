angular.module('app.filters').filter("numberToI18N", function($filter) {
  return function(input, nbDecimal) {
    if (nbDecimal == null) {
      nbDecimal = 2;
    }
    if (input != null) {
      return $filter("number")(parseFloat(input), nbDecimal);
    }
    return "";
  };
});