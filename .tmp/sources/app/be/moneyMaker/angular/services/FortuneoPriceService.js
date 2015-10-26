angular.module('app.services').service("fortuneoPrice", function($sce, messageFlash, $http, downloadService) {
  var exchangeRateTax, prices, taxValue;
  taxValue = 0.0025;
  exchangeRateTax = 0.005;
  prices = [
    {
      markets: ['Paris', 'Brussels'],
      0: 5.95,
      2500: 9.50,
      5000: 13.50,
      25000: 19.50,
      50000: 19.50 * 2,
      75000: 19.50 * 3
    }, {
      markets: ['NYSE', 'NasdaqNM', 'Toronto', 'London', 'AMEX'],
      0: 11.00,
      2500: 12.50,
      5000: 16.50,
      25000: 21,
      50000: 21 * 2,
      75000: 21 * 3
    }
  ];
  this.convert = function(currentValue, marketSymbol, exchangeRate, buy) {
    var eurValue, key, market, price, priceType, result, tax, value, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
    if (buy == null) {
      buy = true;
    }
    result = {};
    eurValue = 0;
    if (exchangeRate === null) {
      eurValue = currentValue;
    } else {
      if (buy) {
        exchangeRate = exchangeRate * (1 + exchangeRateTax);
      } else {
        exchangeRate = exchangeRate / (1 + exchangeRateTax);
      }
      eurValue = currentValue * exchangeRate;
      result.exchangeRate = 1 / exchangeRate;
    }
    priceType = null;
    for (_i = 0, _len = prices.length; _i < _len; _i++) {
      price = prices[_i];
      _ref = price.markets;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        market = _ref[_j];
        if (market === marketSymbol) {
          priceType = price;
        }
      }
    }
    if (priceType === null) {
      price = eurValue * 0.0125;
      if (price < 150) {
        price = 150;
      }
    } else {
      _ref2 = Object.keys(priceType);
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        key = _ref2[_k];
        if (key !== '$$hashKey' && key !== 'markets') {
          if (eurValue > parseFloat(key)) {
            price = priceType[key];
          }
        }
      }
    }
    tax = eurValue * taxValue;
    if (buy) {
      value = eurValue + price + tax;
    } else {
      value = eurValue - price - tax;
    }
    result.price = price;
    result.tax = tax;
    result.value = value;
    return result;
  };
  return;
});