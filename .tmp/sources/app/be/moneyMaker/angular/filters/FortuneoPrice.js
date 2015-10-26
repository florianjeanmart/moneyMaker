angular.module('app.filters').filter("numberToI18N", function($filter) {
  var prices;
  prices = [];
  prices = [
    {
      market: ['Paris', 'Brussels'],
      2500: 5.95,
      5000: 9.50,
      25000: 13.50,
      50000: 19.50
    }, {
      market: ['NYSE', 'NasdaqNM', 'Toronto', 'London'],
      2500: 11.00,
      5000: 12.50,
      25000: 16.50,
      50000: 21
    }
  ];
  prices;
  return function(input, marketSymbol) {
    var price, value;
    if (input != null) {
      price = 0;
      value = parseFloat(input);
      if (value < 2500) {
        price = 5.95;
      } else if (value < 5000) {
        price = 9.50;
      }
      if (value > 50000) {
        return price = 19.50 * value / 50000;
      }
    }
  };
});