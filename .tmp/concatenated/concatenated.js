angular.module('app.directives', []);
angular.module('app.filters', []);
angular.module('app.services', []);
angular.module('app.controllers', ['app.services', 'ngRoute', 'ngTable', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'angucomplete', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);
angular.module('app', ['app.directives', 'app.filters', 'app.services', 'app.controllers']);
angular.module('app.controllers').config(function($routeProvider) {
  $routeProvider.when('/currency', {
    templateUrl: '$/angular/views/currency.html',
    controller: 'CurrencyCtrl'
  }).when('/myShare', {
    templateUrl: '$/angular/views/my-share.html',
    controller: 'MyShareCtrl'
  }).when('/stock', {
    templateUrl: '$/angular/views/stock.html',
    controller: 'StockCtrl'
  }).otherwise({
    redirectTo: '/'
  });
  return;
});angular.module('app.services').service("modalService", function($rootScope) {
  this.CREATE_SHARE = 'create-share';
  this.CREATE_CURRENCY = 'create-currency';
  this.SELL_SHARE = 'SELL_SHARE';
  this.SELL_SIMULATION = 'SELL_SIMULATION';
  this.show = function(modalName, params) {
    var args;
    args = [];
    args.show = true;
    args.params = params;
    args.target = modalName;
    $rootScope.displayModalBackground = true;
    return $rootScope.$broadcast('SHOW_MODAL', args);
  };
  this.close = function(modalName) {
    var args;
    args = [];
    args.show = false;
    args.target = modalName;
    $rootScope.displayModalBackground = false;
    return $rootScope.$broadcast('SHOW_MODAL', args);
  };
  return;
});angular.module('app.services').service("messageFlash", function(flash) {
  this.display = function(type, message, opts) {
    var options;
    options = {
      message: message,
      type: type,
      hideAfter: 5,
      showCloseButton: true
    };
    return Messenger().post(angular.extend(options, angular.copy(opts)));
  };
  this.displaySuccess = function(message, opts) {
    return this.display('success', message, opts);
  };
  this.displayInfo = function(message, opts) {
    return this.display('info', message, opts);
  };
  this.displayError = function(message, opts) {
    return this.display('error', message, opts);
  };
  return;
});angular.module('app.services').service("fortuneoPrice", function($sce, messageFlash, $http, downloadService) {
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
});angular.module('app.services').service("openDayService", function(flash) {
  this.getNbOpenDays = function(date1, date2) {
    var day, i, nbDay, nbOpenDay;
    nbDay = (date2 - date1) / (24 * 3600 * 1000);
    i = 0;
    nbOpenDay = 0;
    while (i < nbDay) {
      day = new Date(date1 + (24 * 3600 * 1000 * i)).getDay();
      if (day !== 5 && day !== 6) {
        nbOpenDay++;
      }
      i++;
    }
    if (nbOpenDay === 0) {
      nbOpenDay = 1;
    }
    return nbOpenDay;
  };
  return;
});angular.module('app.services').service("downloadService", function($http, $q) {
  this.downloadsInProgress = 0;
  this.getDownloadsInProgress = function() {
    return this.downloadsInProgress;
  };
  this.getJson = function(url, callback) {
    var deferred, promise;
    console.log("GET URL TO " + url);
    deferred = $q.defer();
    this.downloadsInProgress++;
    promise = $http({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json"
      }
    });
    promise.success(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: true
      }));
    });
    promise.error(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: false
      }));
    });
    return deferred.promise;
  };
  this.postJson = function(url, data, callback) {
    var deferred, promise;
    console.log("POST URL TO " + url);
    deferred = $q.defer();
    if (data === null) {
      data = {};
    }
    this.downloadsInProgress++;
    promise = $http({
      method: "POST",
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
    promise.success(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: true
      }));
    });
    promise.error(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: false
      }));
    });
    return deferred.promise;
  };
  return;
});angular.module('app.services').service("directiveService", function($sce) {
  this.autoScope = function(s) {
    var k, res, v;
    res = {};
    for (k in s) {
      v = s[k];
      res[k] = v;
      if (k.slice(0, 2) === 'ng' && v === '=') {
        res[k[2].toLowerCase() + k.slice(3)] = '@';
      }
    }
    return res;
  };
  this.autoScopeImpl = function(s, name) {
    var fget, key, val;
    s.$$NAME = name;
    for (key in s) {
      val = s[key];
      if (key.slice(0, 2) === 'ng') {
        fget = function(scope, k) {
          return function() {
            var v;
            v = 0;
            if (scope[k] === void 0 || scope[k] === null || scope[k] === '') {
              v = scope[k[2].toLowerCase() + k.slice(3)];
            } else {
              v = scope[k];
            }
            if (scope['decorate' + k.slice(2)]) {
              return scope['decorate' + k.slice(2)](v);
            } else {
              return v;
            }
          };
        };
        s['get' + key.slice(2)] = fget(s, key);
      }
    }
    s.isTrue = function(v) {
      return v === true || v === 'true' || v === 'y';
    };
    s.isFalse = function(v) {
      return v === false || v === 'false' || v === 'n';
    };
    s.isNull = function(v) {
      return v === null;
    };
    return s.html = function(v) {
      return $sce.trustAsHtml(v);
    };
  };
  return;
});angular.module('app.services').service("frequencyService", function($rootScope) {
  this.DAY = {
    label: 'DAILY',
    time: 24 * 3600 * 1000
  };
  this.WEEK = {
    label: 'WEEKLY',
    time: 7 * this.DAY.time
  };
  this.MONTH = {
    label: 'MONTHLY',
    time: 30.4375 * this.DAY.time
  };
  this.YEAR = {
    label: 'YEARLY',
    time: 365.25 * this.DAY.time
  };
  this.QUARTER = {
    label: 'QUARTERLY',
    time: this.YEAR.time / 4
  };
  this.getFrequency = function(frequencyString) {
    if (frequencyString === this.DAY.label) {
      return this.DAY;
    }
    if (frequencyString === this.WEEK.label) {
      return this.WEEK;
    }
    if (frequencyString === this.MONTH.label) {
      return this.MONTH;
    }
    if (frequencyString === this.YEAR.label) {
      return this.YEAR;
    }
    if (frequencyString === this.QUARTER.label) {
      return this.QUARTER;
    }
    return null;
  };
  return;
});angular.module('app.services').service("generateId", function($rootScope) {
  this.generate = function() {
    var i, possible, text;
    text = "";
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    i = 0;
    while (i < 20) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      i++;
    }
    return text;
  };
  return;
});angular.module('app.filters').filter("numberToI18N", function($filter) {
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
});angular.module('app.filters').filter("numberToI18N", function($filter) {
  return function(input, nbDecimal) {
    if (nbDecimal == null) {
      nbDecimal = 2;
    }
    if (input != null) {
      return $filter("number")(parseFloat(input), nbDecimal);
    }
    return "";
  };
});angular.module('app.filters').filter("stringToFloat", function() {
  return function(input) {
    if (input != null) {
      return parseFloat(input);
    }
  };
});angular.module('app.directives').directive("mmModalCreateCurrency", function(directiveService, messageFlash, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngParams: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-create-currency.html",
    controller: function($scope, modalService) {
      directiveService.autoScopeImpl($scope);
      $scope.fields = {
        name: {
          fieldTitle: "Name in international system",
          validationRegex: "^[A-Z]{3}$",
          validationMessage: "3 majuscules letters",
          focus: function() {
            return true;
          }
        },
        symbol: {
          fieldTitle: "Symbol",
          validationRegex: "^.{1,3}$",
          validationMessage: "max 3 characters"
        }
      };
      $scope.allFieldValid = function() {
        var key, _i, _len, _ref;
        _ref = Object.keys($scope.fields);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (key !== '$$hashKey') {
            if (!($scope.fields[key].isValid != null) || $scope.fields[key].isValid === false) {
              return false;
            }
          }
        }
        return true;
      };
      $scope.save = function() {
        var data;
        if ($scope.allFieldValid()) {
          data = {};
          data.name = $scope.fields.name.field;
          data.symbol = $scope.fields.symbol.field;
          $scope.isLoading = true;
          $http.post('/currency/create', data).success(function(data) {
            messageFlash.displaySuccess("new currency are created");
            return $scope.close();
          }).error(function(data) {
            messageFlash.displayError(data.message);
            return $scope.isLoading = false;
          });
        }
        return false;
      };
      return $scope.close = function() {
        return modalService.close(modalService.CREATE_CURRENCY);
      };
    },
    link: function(scope) {}
  };
});angular.module('app.directives').directive("mmModalSellShare", function(directiveService, messageFlash, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngParams: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-sell-share.html",
    controller: function($scope, modalService) {
      directiveService.autoScopeImpl($scope);
      $scope.fields = {
        date: {
          fieldTitle: "date",
          validationRegex: "^.{1,255}$",
          validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH"
        },
        price: {
          fieldTitle: "Price",
          validationRegex: "^[0-9.]+$",
          validationMessage: "Only number",
          numbersOnly: 'double'
        }
      };
      $scope.allFieldValid = function() {
        var key, _i, _len, _ref;
        _ref = Object.keys($scope.fields);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (key !== '$$hashKey') {
            if (!($scope.fields[key].isValid != null) || $scope.fields[key].isValid === false) {
              return false;
            }
          }
        }
        return true;
      };
      $scope.save = function() {
        var dto, url;
        if ($scope.allFieldValid()) {
          dto = {};
          dto.shareId = $scope.getParams().share.shareId;
          dto.price = $scope.fields.price.field;
          dto.date = $scope.fields.date.field;
          console.log(dto);
          url = "share/sell";
          $scope.isLoading = true;
          $http.post(url, dto).success(function(data, status) {
            $scope.getParams().refreshShare(data);
            $scope.close();
            return $scope.isLoading = false;
          }).error(function(data) {
            messageFlash.displayError(data.message);
            return $scope.isLoading = false;
          });
        }
        return;
      };
      return $scope.close = function() {
        return modalService.close(modalService.SELL_SHARE);
      };
    },
    link: function(scope) {}
  };
});angular.module('app.directives').directive("mmModalManager", function(directiveService, $compile) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngCondition: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-manager.html",
    replace: true,
    link: function(scope, element) {
      scope.$on('SHOW_MODAL', function(event, args) {
        if (args.show === true) {
          scope.displayModal(args.target, args.params);
        } else {
          scope.removeModal(args.target);
        }
        return;
      });
      scope.displayModal = function(target, params) {
        var directive, paramName;
        paramName = 'params_' + target.replace(/-/g, "_");
        scope[paramName] = params;
        console.log("display mode");
        console.log(params);
        console.log("<mm-modal-" + target + " ng-params=\"" + paramName + "\" ></mm-modal-" + target + ">");
        directive = $compile("<mm-modal-" + target + " ng-params=\"" + paramName + "\" ></mm-modal-" + target + ">")(scope);
        element.append(directive);
        return;
      };
      return scope.removeModal = function(target) {
        var child, _i, _len, _ref;
        _ref = element.children();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (child.tagName.toLowerCase() === 'mm-modal-' + target.toLowerCase()) {
            angular.element(child).remove();
          }
        }
        return;
      };
    }
  };
});angular.module('app.directives').directive("mmModalCreateShare", function(directiveService, messageFlash, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngParams: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-create-share.html",
    controller: function($scope, modalService) {
      directiveService.autoScopeImpl($scope);
      $scope.fields = {
        stock: {
          fieldTitle: "Stock",
          url: "stock/autoCompletion/",
          focus: function() {
            return true;
          }
        },
        stockEdit: {
          fieldTitle: "Stock",
          disabled: true,
          field: null
        },
        nb: {
          fieldTitle: "Number",
          validationRegex: "^[0-9]+$",
          validationMessage: "Only number",
          numbersOnly: 'integer'
        },
        price: {
          fieldTitle: "Price",
          validationRegex: "^[0-9.]+$",
          validationMessage: "Only number",
          numbersOnly: 'double'
        },
        date: {
          fieldTitle: "date",
          validationRegex: "^.{1,255}$",
          validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH"
        },
        sellPrice: {
          fieldTitle: "Sell price",
          validationRegex: "^[0-9.]+$",
          validationMessage: "Only number",
          numbersOnly: 'double',
          hidden: true
        },
        sellDate: {
          fieldTitle: "Sell date",
          validationRegex: "^.{1,255}$",
          validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH",
          hidden: true
        }
      };
      if (($scope.getParams() != null) && ($scope.getParams().share != null)) {
        console.log($scope.getParams().share);
        $scope.fields.stockEdit.field = $scope.getParams().share.stock.name + " (" + $scope.getParams().share.stock.symbol + ")";
        $scope.fields.nb.field = $scope.getParams().share.nbShare + "";
        $scope.fields.price.field = $scope.getParams().share.buyPrice + "";
        $scope.fields.date.field = $scope.getParams().share.buyDate + "";
        $scope.fields.stock.hidden = true;
        if ($scope.getParams().share.sellPrice != null) {
          $scope.fields.sellPrice.hidden = false;
          $scope.fields.sellPrice.field = $scope.getParams().share.sellPrice;
          $scope.fields.sellDate.hidden = false;
          $scope.fields.sellDate.field = $scope.getParams().share.sellDate;
        }
      } else {
        $scope.fields.stockEdit.hidden = true;
      }
      $scope.allFieldValid = function() {
        var key, _i, _len, _ref;
        _ref = Object.keys($scope.fields);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (key !== '$$hashKey') {
            if (!($scope.fields[key].isValid != null) || $scope.fields[key].isValid === false) {
              return false;
            }
          }
        }
        return true;
      };
      $scope.save = function() {
        var dto, url;
        if ($scope.allFieldValid()) {
          dto = {};
          if (($scope.getParams() != null) && ($scope.getParams().share != null)) {
            dto.shareId = $scope.getParams().share.shareId;
            dto.sellDate = $scope.fields.sellDate.field;
            dto.sellPrice = $scope.fields.sellPrice.field;
            url = "share/edit";
          } else {
            dto.stockName = $scope.fields.stock.field;
            url = "share/create";
          }
          dto.number = $scope.fields.nb.field;
          dto.price = $scope.fields.price.field;
          dto.date = $scope.fields.date.field;
          console.log(dto);
          $scope.isLoading = true;
          $http.post(url, dto).success(function(data, status) {
            if (($scope.getParams() != null) && ($scope.getParams().share != null)) {
              $scope.getParams().refreshShare(data);
            } else {
              $scope.getParams().addShare(data);
            }
            $scope.close();
            return $scope.isLoading = false;
          }).error(function(data) {
            messageFlash.displayError(data.message);
            return $scope.isLoading = false;
          });
        }
        return;
      };
      return $scope.close = function() {
        return modalService.close(modalService.CREATE_SHARE);
      };
    },
    link: function(scope) {}
  };
});angular.module('app.directives').directive("mmModalSellSimulation", function(directiveService, messageFlash, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngParams: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-sell-simulation.html",
    controller: function($scope, modalService, fortuneoPrice) {
      directiveService.autoScopeImpl($scope);
      $scope.buy = true;
      $scope.result = {};
      $scope.priceCurrency = null;
      $scope.fields = {
        stock: {
          fieldTitle: "Stock",
          url: "stock/autoCompletion/",
          field: $scope.getParams().stock,
          focus: function() {
            return true;
          }
        },
        nb: {
          fieldTitle: "Number",
          validationRegex: "^[0-9]+$",
          validationMessage: "Only number",
          field: $scope.getParams().nbShare,
          numbersOnly: 'integer'
        },
        buyPrice: {
          fieldTitle: "Buy price (total in €)",
          validationRegex: "^[0-9.]*$",
          validationMessage: "Only number",
          field: $scope.getParams().buyPrice,
          numbersOnly: 'double'
        },
        sellPrice: {
          fieldTitle: "Sell price (by share in currency)",
          validationRegex: "^[0-9.]+$",
          validationMessage: "Only number",
          numbersOnly: 'double'
        },
        date: {
          fieldTitle: "date",
          validationRegex: "^.{1,255}$",
          validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH",
          field: new Date()
        }
      };
      if ($scope.getParams().stock != null) {
        $scope.fields.stock.field = $scope.getParams().stock.name + " (" + $scope.getParams().stock.symbol + ")";
      }
      $scope.fieldsResult = {
        totalCurrency: {
          fieldTitle: 'Price in currency',
          disabled: true,
          numbersOnly: 'double'
        },
        exchangeRate: {
          fieldTitle: 'Exchange rate',
          disabled: true,
          numbersOnly: 'double'
        },
        price: {
          fieldTitle: 'Cost management',
          disabled: true,
          numbersOnly: 'double'
        },
        tax: {
          fieldTitle: 'Taxe',
          disabled: true,
          numbersOnly: 'double'
        },
        value: {
          fieldTitle: 'Total',
          disabled: true,
          numbersOnly: 'double'
        },
        percentCost: {
          fieldTitle: 'Cost in %',
          disabled: true,
          numbersOnly: 'double'
        }
      };
      $scope.allFieldValid = function() {
        var key, _i, _len, _ref;
        _ref = Object.keys($scope.fields);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (key !== '$$hashKey') {
            if (!($scope.fields[key].isValid != null) || $scope.fields[key].isValid === false) {
              return false;
            }
          }
        }
        return true;
      };
      $scope.simulation = function() {
        if ($scope.allFieldValid()) {
          return $scope.loadStock();
        }
      };
      $scope.loadStock = function() {
        return $http.get("stock/get/" + $scope.fields.stock.field).success(function(data, status) {
          $scope.stock = data;
          if ($scope.stock.currency.symbol !== 'EUR') {
            return $scope.loadCurrencyValue();
          } else {
            return $scope.compute();
          }
        }).error(function(data, status) {
          return messageFlash.displayError(data.messages);
        });
      };
      $scope.loadCurrencyValue = function() {
        return $http.get("currency/value/" + $scope.stock.currency.symbol + "/EUR/" + $scope.fields.date.field).success(function(data, status) {
          return $scope.compute(data.value);
        }).error(function(data, status) {
          return messageFlash.displayError(data.messages);
        });
      };
      $scope.compute = function(exchangeRate) {
        var percentCostDelta;
        if (exchangeRate == null) {
          exchangeRate = null;
        }
        $scope.fieldsResult.totalCurrency.field = $scope.fields.nb.field * $scope.fields.buyPrice.field;
        $scope.result = fortuneoPrice.convert($scope.fieldsResult.totalCurrency.field, $scope.stock.market.symbol, exchangeRate, $scope.buy);
        $scope.fieldsResult.exchangeRate.field = $scope.result.exchangeRate;
        $scope.fieldsResult.price.field = $scope.result.price;
        $scope.fieldsResult.tax.field = $scope.result.tax;
        if ($scope.fields.buyPrice.field != null) {
          console.log($scope.result.value + " " + $scope.fields.buyPrice.field);
          $scope.fieldsResult.value.field = $scope.result.value - $scope.fields.buyPrice.field;
        } else {
          $scope.fieldsResult.value.field = $scope.result.value;
        }
        percentCostDelta = ($scope.result.value - ($scope.fieldsResult.totalCurrency.field * exchangeRate)) / ($scope.fieldsResult.totalCurrency.field * exchangeRate) * 100;
        if ($scope.buy) {
          return $scope.fieldsResult.percentCost.field = percentCostDelta;
        } else {
          return $scope.fieldsResult.percentCost.field = -percentCostDelta;
        }
      };
      return $scope.close = function() {
        return modalService.close(modalService.SELL_SIMULATION);
      };
    },
    link: function(scope) {}
  };
});angular.module('app.directives').directive("mmTable", function(directiveService, $timeout, ngTableParams, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      /* DATA
      .data = []
      .start_date = data
      .frequency = servicePeriod
      */
      ngData: '='
    }),
    templateUrl: "$/angular/templates/mm-table.html",
    replace: true,
    transclude: true,
    link: function(scope) {
      scope.tableParams = new ngTableParams({
        page: 1,
        count: 100,
        sorting: {
          name: "asc"
        }
      }, {
        total: 50,
        getData: function($defer, params) {
          console.log("GET DATA !! : ");
          console.log(params);
          $http.get("stock/page/NASDAQ/" + params.page() + "/" + params.count()).success(function(data, status) {
            console.log(data);
            params.total(data.total);
            return $defer.resolve(data.stockList);
          });
          return;
        }
      });
      return;
    }
  };
});angular.module('app.directives').directive("ngEnter", function() {
  return function(scope, element, attrs) {
    return element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          return scope.$eval(attrs.ngEnter);
        });
        return event.preventDefault();
      }
    });
  };
});angular.module('app.directives').directive("mmFieldDate", function(directiveService, $filter, generateId) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngInfo: '='
    }),
    templateUrl: "$/angular/templates/mm-field-date.html",
    replace: true,
    transclude: true,
    compile: function() {
      return {
        pre: function(scope) {
          scope.id = generateId.generate();
          return scope.idHtag = '#' + scope.id;
        },
        post: function(scope) {
          directiveService.autoScopeImpl(scope);
          scope.result = null;
          scope.$watch('result', function() {
            return scope.resultFormated = $filter('date')(scope.result, 'yyyy-MM-dd');
          });
          scope.$watch('getInfo().field', function() {
            if (scope.getInfo().field != null) {
              return scope.result = new Date(Number(scope.getInfo().field));
            }
          });
          scope.$watch('result', function() {
            if (scope.result != null) {
              scope.getInfo().field = scope.result.getTime();
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
    }
  };
});angular.module('app.directives').directive("focusMe", function($timeout, $parse) {
  return {
    restrict: 'A',
    scope: {
      focusMe: '='
    },
    link: function(scope, element, attrs) {
      scope.$watch('focusMe', function() {
        if (scope.focusMe === true) {
          return element[0].focus();
        }
      });
      return;
    }
  };
});angular.module('app.directives').directive("mmFieldText", function(directiveService, $timeout) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngInfo: '='
    }),
    templateUrl: "$/angular/templates/mm-field-text.html",
    replace: true,
    transclude: true,
    compile: function() {
      return {
        pre: function(scope) {
          return directiveService.autoScopeImpl(scope);
        },
        post: function(scope) {
          directiveService.autoScopeImpl(scope);
          scope.isValidationDefined = (scope.getInfo().validationRegex != null) || (scope.getInfo().validationFct != null);
          scope.hideIsValidIcon = !!scope.getInfo().hideIsValidIcon;
          scope.fieldType = (scope.getInfo().fieldType != null) ? scope.getInfo().fieldType : "text";
          if (!(scope.getInfo().field != null)) {
            scope.getInfo().field = "";
          }
          if (!(scope.getInfo().isValid != null)) {
            scope.getInfo().isValid = !scope.isValidationDefined;
          }
          if (scope.isValidationDefined) {
            scope.$watch('getInfo().field', function(n, o) {
              if (n !== o) {
                return scope.isValid();
              }
            });
          }
          scope.isValid = function() {
            var isValid;
            if (scope.getInfo().disabled === true || scope.getInfo().hidden === true) {
              scope.getInfo().isValid = true;
              return;
            }
            if (!scope.getInfo().field) {
              scope.getInfo().field = "";
              /*
              scope.getInfo().isValid = false
              return
              */
            }
            isValid = true;
            if (typeof scope.getInfo().field !== 'string') {
              scope.getInfo().field += "";
            }
            if (scope.getInfo().validationRegex != null) {
              isValid = scope.getInfo().field.match(scope.getInfo().validationRegex);
            }
            if (scope.getInfo().validationFct != null) {
              isValid = isValid && scope.getInfo().validationFct();
            }
            scope.getInfo().isValid = isValid;
            return;
          };
          scope.isValid();
          scope.logField = function() {
            return console.log(scope.getInfo());
          };
          scope.errorMessage = "";
          return scope.setErrorMessage = function(errorMessage) {
            scope.errorMessage = errorMessage;
            if (scope.lastTimeOut != null) {
              $timeout.cancel(scope.lastTimeOut);
            }
            return scope.lastTimeOut = $timeout(function() {
              scope.errorMessage = "";
              return scope.lastTimeOut = null;
            }, 2000);
          };
        }
      };
    }
  };
});angular.module('app.directives').directive("mmFieldAutoCompletion", function(directiveService) {
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
});angular.module('app.directives').directive("numbersOnly", function($filter, $locale) {
  return {
    restrict: 'A',
    require: "ngModel",
    link: function(scope, element, attrs, modelCtrl) {
      var convertToFloat, convertToString, displayError, errorMessage, filterFloat, nbDecimal;
      if (attrs.numbersOnly === "integer" || attrs.numbersOnly === "double") {
        if (attrs.numbersOnly === "integer") {
          errorMessage = 'Only integer';
        } else {
          errorMessage = 'Only number';
        }
        nbDecimal = 3;
        if (attrs.numbersOnly === "integer") {
          nbDecimal = 0;
        }
        scope.$root.$on('$localeChangeSuccess', function(event, current, previous) {
          var result;
          if (modelCtrl.$modelValue != null) {
            result = convertToString(parseFloat(modelCtrl.$modelValue));
            if (result != null) {
              modelCtrl.$setViewValue(result.toString());
              return modelCtrl.$render();
            }
          }
        });
        modelCtrl.$parsers.unshift(function(viewValue) {
          var result, resultString, resultToDisplay;
          if (viewValue === "") {
            return null;
          }
          result = convertToFloat(viewValue);
          if (isNaN(result)) {
            displayError();
            if (scope.lastValidValue != null) {
              resultString = scope.lastValidValue.toString();
              if (attrs.numbersOnly === "percent") {
                resultToDisplay = (scope.lastValidValue * 100).toString();
              } else {
                resultToDisplay = scope.lastValidValue.toString();
              }
            } else {
              resultString = "";
              resultToDisplay = "";
            }
            modelCtrl.$setViewValue(resultToDisplay);
            modelCtrl.$render();
          } else {
            if (attrs.numbersOnly === "percent") {
              result = result / 100;
            }
            scope.lastValidValue = result;
            resultString = result.toString();
          }
          if (resultString === "") {
            return null;
          }
          return resultString;
        });
        modelCtrl.$formatters.unshift(function(modelValue) {
          var result;
          result = parseFloat(modelValue);
          if (attrs.numbersOnly === "percent") {
            result = result * 100;
          }
          return convertToString(result);
        });
        displayError = function() {
          if (scope.setErrorMessage != null) {
            return scope.setErrorMessage(errorMessage);
          }
        };
        convertToString = function(value) {
          var formats, result;
          if (!(value != null) || isNaN(value)) {
            return "";
          }
          value = value.toFixed(nbDecimal);
          formats = $locale.NUMBER_FORMATS;
          return result = value.toString().replace(new RegExp("\\.", "g"), formats.DECIMAL_SEP);
        };
        convertToFloat = function(viewValue) {
          var decimalRegex, formats, value;
          if (viewValue === "") {
            return NaN;
          }
          formats = $locale.NUMBER_FORMATS;
          decimalRegex = formats.DECIMAL_SEP;
          if (decimalRegex === ".") {
            decimalRegex = "\\.";
          }
          value = viewValue.replace(new RegExp(decimalRegex, "g"), ".");
          return filterFloat(value);
        };
        filterFloat = function(value) {
          var regexFloat;
          if (attrs.numbersOnly === "integer") {
            regexFloat = new RegExp("^(\\-|\\+)?([0-9]+|Infinity)$");
          } else {
            regexFloat = new RegExp("^(\\-|\\+)?([0-9]+(\\.[0-9]*)?|Infinity)$");
          }
          if (regexFloat.test(value)) {
            return Number(value);
          }
          return NaN;
        };
        return scope.$root.$on('FORM_LOADING_FINISH', function(event, current, previous) {
          if (modelCtrl.$modelValue != null) {
            return scope.lastValidValue = modelCtrl.$modelValue;
          }
        });
      }
    }
  };
});angular.module('app.directives').directive("ngEscape", function() {
  return function(scope, element, attrs) {
    return element.bind("keydown keypress", function(event) {
      if (event.which === 27) {
        scope.$apply(function() {
          return scope.$eval(attrs.ngEscape);
        });
        return event.preventDefault();
      }
    });
  };
});angular.module('app.directives').directive("mmWelcome", function($location, $http) {
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
});angular.module('app.directives').directive("mmChartArea", function(directiveService, $timeout, generateId) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngData: '='
    }),
    templateUrl: "$/angular/templates/mm-chart-area.html",
    replace: true,
    transclude: true,
    compile: function() {
      return {
        pre: function(scope) {
          return scope.id = generateId.generate();
        },
        post: function(scope, element) {
          directiveService.autoScopeImpl(scope);
          return scope.$watch('getData()', function() {
            var dataToDisplay;
            if (scope.getData() != null) {
              console.log(scope.getData());
              dataToDisplay = scope.getData().values;
              return $("#" + scope.id).highcharts("StockChart", {
                rangeSelector: {
                  selected: 1,
                  inputEnabled: $("#" + scope.id).width() > 480
                },
                title: {
                  text: scope.getData().title
                },
                series: [
                  {
                    name: scope.getData().seriesTitle,
                    data: dataToDisplay,
                    tooltip: {
                      valueDecimals: 4
                    }
                  }
                ]
              });
            }
          });
        }
      };
    }
  };
});angular.module('app.controllers').controller("CurrencyCtrl", function($scope, $http, messageFlash, modalService) {
  var url;
  $scope.currencies = [];
  $scope.reference = null;
  $scope.currency = null;
  url = "currency/all";
  $http.get(url).success(function(data, status) {
    $scope.currencies = data.currenciesList;
    return messageFlash.displaySuccess("Currency list loaded");
  }).error(function(data, status) {
    return messageFlash.displaySuccess(data.messages);
  });
  $scope.$watch('currency', function(o, n) {
    if (o !== n) {
      return $scope.loadValues();
    }
  });
  $scope.$watch('reference', function(o, n) {
    if (o !== n) {
      return $scope.loadValues();
    }
  });
  $scope.loadValues = function() {
    if (($scope.currency != null) && ($scope.reference != null)) {
      return $http.get("currency/values/" + $scope.reference.name + "/" + $scope.currency.name).success(function(data, status) {
        var value, values, _i, _len, _ref;
        values = [];
        _ref = data.values;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          value = _ref[_i];
          values[values.length] = [value.date + 10 * 3600 * 1000, value.value];
        }
        $scope.chartData = {};
        $scope.chartData.values = values;
        $scope.chartData.title = data.reference.name + " to " + data.currency.name + " exchange rate";
        return $scope.chartData.seriesTitle = data.currency.name;
      }).error(function(data, status) {
        return messageFlash.displayError(data.messages);
      });
    }
  };
  return $scope.createCurrency = function() {
    return modalService.show(modalService.CREATE_CURRENCY);
  };
});angular.module('app.controllers').controller("MyShareCtrl", function($scope, $http, messageFlash, modalService, ngTableParams, $filter, fortuneoPrice, generateId, openDayService) {
  $scope.idChartStock = generateId.generate();
  $scope.idChartShare = generateId.generate();
  $scope.idChartResult = generateId.generate();
  $scope.idChartResultAverage = generateId.generate();
  $scope.editShare = function(share) {
    var params;
    params = {};
    params.share = share;
    params.refreshShare = $scope.refreshShare;
    return modalService.show(modalService.CREATE_SHARE, params);
  };
  $scope.refreshShare = function(share) {
    var i, shareToCompare, _i, _len, _ref;
    i = 0;
    console.log($scope.shares);
    _ref = $scope.shares;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      shareToCompare = _ref[_i];
      console.log(shareToCompare);
      if (share.shareId === shareToCompare.shareId) {
        $scope.shares.splice(i, 1);
        break;
      }
      i++;
    }
    return $scope.addShare(share);
  };
  $scope.showAll = function() {
    var share, _i, _len, _ref, _results;
    _ref = $scope.shares;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      share = _ref[_i];
      $scope.setVisibleChart(share);
      _results.push(share.visible = true);
    }
    return _results;
  };
  $scope.hideAll = function() {
    var share, _i, _len, _ref, _results;
    _ref = $scope.shares;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      share = _ref[_i];
      $scope.setVisibleChart(share);
      _results.push(share.visible = false);
    }
    return _results;
  };
  $scope.remove = function(share) {
    var data;
    data = {};
    data.value = share.shareId;
    return $http.post("share/remove", data).success(function(data, status) {
      var i, shareToCompare, _i, _len, _ref;
      i = 0;
      _ref = $scope.shares;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        shareToCompare = _ref[_i];
        if (share.shareId === shareToCompare.shareId) {
          $scope.shares.splice(i, 1);
          break;
        }
        i++;
      }
      return $scope.loadTable();
    });
  };
  $scope.addShare = function(share) {
    $scope.shares.push(share);
    return $scope.loadTable();
  };
  $scope.createMyShare = function() {
    var params;
    params = {};
    params.addShare = $scope.addShare;
    return modalService.show(modalService.CREATE_SHARE, params);
  };
  $scope.sellSimulation = function(share) {
    var params;
    params = {};
    if (share != null) {
      params.stock = share.stock;
      params.nbShare = share.nbShare;
      params.buyPrice = share.totalEur;
    }
    return modalService.show(modalService.SELL_SIMULATION, params);
  };
  $scope.shares = [];
  $http.get("share/myShares").success(function(data, status) {
    console.log(data);
    console.log(new Date(data.shareList[0].buyDate));
    console.log(new Date(data.shareList[0].stockValues[0].date));
    messageFlash.displaySuccess("My shares loaded ! ");
    $scope.shares = data.shareList;
    $scope.loadTable();
    return $scope.buildChart();
  }).error(function(data) {
    messageFlash.displayError(data.message);
    return $scope.isLoading = false;
  });
  $scope.loadTable = function() {
    var buyConvert, days, nbSell, sellConvert, share, totalDay, totalPercentSell, _i, _len, _ref;
    $scope.summary = {
      value: 0
    };
    totalPercentSell = 0;
    nbSell = 0;
    totalDay = 0;
    _ref = $scope.shares;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      share = _ref[_i];
      share.visible = true;
      share.total = share.buyPrice * share.nbShare;
      buyConvert = fortuneoPrice.convert(share.total, share.stock.market.symbol, share.buyEuroConversion, true);
      share.totalEur = buyConvert.value;
      share.totalEurDetails = {
        exchangeRate: buyConvert.exchangeRate,
        tax: buyConvert.tax,
        cost: buyConvert.price
      };
      if (share.sellPrice != null) {
        share.sellTotal = share.sellPrice * share.nbShare;
        sellConvert = fortuneoPrice.convert(share.sellTotal, share.stock.market.symbol, share.sellEuroConversion, false);
        share.sellTotalEur = sellConvert.value;
        share.totalSellEurDetails = {
          exchangeRate: sellConvert.exchangeRate,
          tax: sellConvert.tax,
          cost: sellConvert.price
        };
        share.differenceEur = share.sellTotalEur - share.totalEur;
        share.differencePercentEur = share.differenceEur / share.totalEur * 100;
        $scope.summary.value += share.differenceEur;
        nbSell++;
        totalPercentSell += share.differencePercentEur;
        days = openDayService.getNbOpenDays(share.buyDate, share.sellDate);
        share.differencePercentEurAverageByDay = share.differencePercentEur / days;
      }
    }
    $scope.averagePercentSell = totalPercentSell / nbSell;
    if ($scope.tableParams != null) {
      return $scope.tableParams.reload();
    } else {
      return $scope.tableParams = new ngTableParams({
        page: 1,
        count: 100,
        sorting: {
          code: "asc"
        }
      }, {
        total: 0,
        getData: function($defer, params) {
          var orderedData;
          orderedData = $filter("orderBy")($scope.shares, params.orderBy());
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          return params.total($scope.shares.length);
        }
      });
    }
  };
  $scope.sellShare = function(share) {
    var params;
    params = {};
    params.share = share;
    params.refreshShare = $scope.refreshShare;
    return modalService.show(modalService.SELL_SHARE, params);
  };
  $scope.isCompare = false;
  $scope.colorMap = {
    counter: 0
  };
  $scope.$watch('isCompare', function(o, n) {
    if (o !== n) {
      return $scope.buildChart();
    }
  });
  $scope.buildChart = function() {
    if ($scope.shares != null) {
      $scope.buildChartStock();
      $scope.buildChartShare();
      $scope.buildChartResult();
      return $scope.buildChartResultAverage();
    }
  };
  $scope.setVisibleChart = function(share) {
    if (share.visible === true) {
      $("#" + $scope.idChartShare).highcharts().get(share.shareId).hide();
      $("#" + $scope.idChartResult).highcharts().get(share.shareId).hide();
      $("#" + $scope.idChartStock).highcharts().get(share.shareId).hide();
      return $("#" + $scope.idChartResultAverage).highcharts().get(share.shareId).hide();
    } else {
      $("#" + $scope.idChartShare).highcharts().get(share.shareId).show();
      $("#" + $scope.idChartResult).highcharts().get(share.shareId).show();
      $("#" + $scope.idChartStock).highcharts().get(share.shareId).show();
      return $("#" + $scope.idChartResultAverage).highcharts().get(share.shareId).show();
    }
  };
  $scope.buildChartStock = function() {
    var price, series, share, value, _i, _j, _len, _len2, _ref, _ref2;
    series = [];
    _ref = $scope.shares;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      share = _ref[_i];
      price = [];
      _ref2 = share.stockValues;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        value = _ref2[_j];
        price.push([value.date + 12 * 3600 * 1000, value.valueClose]);
      }
      series.push({
        id: share.shareId,
        name: share.stock.symbol,
        data: price,
        yAxis: 0,
        tooltip: {
          valueDecimals: 4
        },
        dataGrouping: {
          units: $scope.groupingUnits
        }
      });
    }
    return $("#" + $scope.idChartStock).highcharts("StockChart", {
      chart: {
        zoomType: 'x'
      },
      rangeSelector: {
        selected: 1,
        inputEnabled: $("#" + $scope.idChartStock).width() > 480
      },
      title: {
        text: "TITLE"
      },
      scrollbar: {
        liveRedraw: false
      },
      plotOptions: {
        series: {
          compare: $scope.isCompare === true ? 'percent' : null
        }
      },
      yAxis: $scope.yAxis,
      series: series
    });
  };
  $scope.buildChartShare = function() {
    var color, price, serie, series, share, value, _i, _j, _len, _len2, _ref, _ref2;
    series = [];
    _ref = $scope.shares;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      share = _ref[_i];
      price = [];
      if ($scope.colorMap[share.stock.symbol] != null) {
        color = $scope.colorMap[share.stock.symbol];
      } else {
        color = Highcharts.getOptions().colors[$scope.colorMap.counter];
        $scope.colorMap.counter++;
        $scope.colorMap[share.stock.symbol] = color;
      }
      _ref2 = share.stockValues;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        value = _ref2[_j];
        price.push([value.date + 12 * 3600 * 1000, fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, true).value]);
      }
      serie = {
        id: share.shareId,
        name: share.stock.symbol,
        data: price,
        yAxis: 0,
        color: color,
        tooltip: {
          valueDecimals: 4
        },
        dataGrouping: {
          units: $scope.groupingUnits
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [[0, color], [1, Highcharts.Color(color).setOpacity(0).get('rgba')]]
        }
      };
      series.push(serie);
    }
    return $("#" + $scope.idChartShare).highcharts("StockChart", {
      chart: {
        zoomType: 'x'
      },
      rangeSelector: {
        selected: 1,
        inputEnabled: $("#" + $scope.idChartShare).width() > 480
      },
      title: {
        text: "TITLE"
      },
      scrollbar: {
        liveRedraw: false
      },
      plotOptions: {
        series: {
          compare: $scope.isCompare === true ? 'percent' : null
        }
      },
      yAxis: $scope.yAxis,
      series: series
    });
  };
  $scope.buildChartResult = function() {
    var averageData, averageValue, buyValue, color, nbTotal, plotLines, price, series, share, shareToCompute, startValuePrice, total, value, valuePrice, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4;
    series = [];
    _ref = $scope.shares;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      share = _ref[_i];
      price = [];
      buyValue = fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, true).value;
      if ($scope.colorMap[share.stock.symbol] != null) {
        color = $scope.colorMap[share.stock.symbol];
      } else {
        color = Highcharts.getOptions().colors[$scope.colorMap.counter];
        $scope.colorMap.counter++;
        $scope.colorMap[share.stock.symbol] = color;
      }
      if ($scope.isCompare === true) {
        startValuePrice = (fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100;
      } else {
        startValuePrice = fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue;
      }
      price.push([share.buyDate, startValuePrice]);
      _ref2 = share.stockValues;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        value = _ref2[_j];
        if ($scope.isCompare === true) {
          if (value.date === share.sellDate) {
            valuePrice = (fortuneoPrice.convert(share.sellPrice * share.nbShare, share.stock.market.symbol, share.sellEuroConversion, false).value - buyValue) / buyValue * 100;
          } else {
            valuePrice = (fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100;
          }
        } else {
          if (value.date === share.sellDate) {
            valuePrice = fortuneoPrice.convert(share.sellPrice * share.nbShare, share.stock.market.symbol, share.sellEuroConversion, false).value - buyValue;
          } else {
            valuePrice = fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue;
          }
        }
        price.push([value.date + 12 * 3600 * 1000, valuePrice]);
      }
      console.log("price for " + share.stock.symbol);
      console.log(price);
      series.push({
        id: share.shareId,
        name: share.stock.symbol,
        data: price,
        type: 'area',
        yAxis: 0,
        color: color,
        width: '2px',
        tooltip: {
          valueDecimals: 4
        },
        dataGrouping: {
          units: $scope.groupingUnits
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [[0, Highcharts.Color(color).setOpacity(0.5).get('rgba')], [1, Highcharts.Color(color).setOpacity(0).get('rgba')]]
        }
      });
    }
    averageData = [];
    _ref3 = $scope.shares;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      share = _ref3[_k];
      if (share.sellDate != null) {
        nbTotal = 0;
        total = 0;
        _ref4 = $scope.shares;
        for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
          shareToCompute = _ref4[_l];
          if ((shareToCompute.sellDate != null) && shareToCompute.sellDate <= share.sellDate) {
            if ($scope.isCompare === true) {
              buyValue = fortuneoPrice.convert(shareToCompute.buyPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.buyEuroConversion, true).value;
              total += (fortuneoPrice.convert(shareToCompute.sellPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.sellEuroConversion, false).value - buyValue) / buyValue * 100;
            } else {
              buyValue = fortuneoPrice.convert(shareToCompute.buyPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.buyEuroConversion, true).value;
              total += fortuneoPrice.convert(shareToCompute.sellPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.sellEuroConversion, false).value - buyValue;
            }
            nbTotal++;
          }
        }
        averageValue = total / nbTotal;
        averageData.push([share.sellDate + 12 * 3600 * 1000, averageValue]);
      }
    }
    /*
    averageData.push [
        new Date()
        averageValue
    ]
    */
    averageData = $scope.orderValues(averageData);
    console.log(averageData);
    series.push({
      id: 'average',
      name: "Average",
      data: averageData,
      yAxis: 0,
      width: '2px',
      step: true,
      tooltip: {
        valueDecimals: 4
      },
      dataGrouping: {
        units: $scope.groupingUnits
      }
    });
    plotLines = [
      {
        value: 0,
        color: 'red',
        dashStyle: 'shortdash',
        width: 2,
        label: {
          text: ''
        }
      }
    ];
    if ($scope.isCompare === true) {
      plotLines.push({
        value: $scope.averagePercentSell,
        color: 'green',
        dashStyle: 'shortdash',
        width: 2,
        label: {
          text: 'average'
        }
      });
    }
    return $("#" + $scope.idChartResult).highcharts("StockChart", {
      chart: {
        zoomType: 'x'
      },
      rangeSelector: {
        selected: 1,
        inputEnabled: $("#" + $scope.idChartResult).width() > 480
      },
      scrollbar: {
        liveRedraw: false
      },
      plotOptions: {
        series: {
          compare: null
        }
      },
      yAxis: {
        title: {
          text: $scope.isCompare === true ? 'Percent' : 'Value (Eur)'
        },
        plotLines: plotLines
      },
      series: series
    });
  };
  $scope.orderValues = function(values) {
    var fin, final, founded, i, j, val, _i, _j, _len, _len2;
    final = [];
    i = 0;
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      val = values[_i];
      j = 0;
      founded = false;
      for (_j = 0, _len2 = final.length; _j < _len2; _j++) {
        fin = final[_j];
        if (val[0] < fin[0]) {
          final.splice(j, 0, val);
          founded = true;
          break;
        }
        j++;
      }
      if (founded === false) {
        final.push(val);
      }
      i++;
    }
    return final;
  };
  return $scope.buildChartResultAverage = function() {
    var buyValue, color, plotLines, price, series, share, startValuePrice, value, valuePrice, _i, _j, _len, _len2, _ref, _ref2;
    series = [];
    _ref = $scope.shares;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      share = _ref[_i];
      price = [];
      buyValue = fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, true).value;
      if ($scope.colorMap[share.stock.symbol] != null) {
        color = $scope.colorMap[share.stock.symbol];
      } else {
        color = Highcharts.getOptions().colors[$scope.colorMap.counter];
        $scope.colorMap.counter++;
        $scope.colorMap[share.stock.symbol] = color;
      }
      startValuePrice = (fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100;
      price.push([share.buyDate, startValuePrice / openDayService.getNbOpenDays(share.buyDate, share.buyDate)]);
      _ref2 = share.stockValues;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        value = _ref2[_j];
        if (value.date === share.sellDate) {
          valuePrice = (fortuneoPrice.convert(share.sellPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100;
        } else {
          valuePrice = (fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100;
        }
        price.push([value.date + 12 * 3600 * 1000, valuePrice / openDayService.getNbOpenDays(share.buyDate, value.date)]);
      }
      series.push({
        id: share.shareId,
        name: share.stock.symbol,
        data: price,
        type: 'area',
        step: true,
        type: 'spline',
        yAxis: 0,
        color: color,
        width: '2px',
        tooltip: {
          valueDecimals: 4
        },
        dataGrouping: {
          units: $scope.groupingUnits
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [[0, Highcharts.Color(color).setOpacity(0.5).get('rgba')], [1, Highcharts.Color(color).setOpacity(0).get('rgba')]]
        }
      });
      series.push({
        type: 'flags',
        data: [
          {
            x: Date.UTC(2011, 3, 25),
            title: 'H',
            text: 'Euro Contained by Channel Resistance'
          }
        ],
        onSeries: 'dataseries',
        shape: 'circlepin',
        width: 16
      });
    }
    plotLines = [
      {
        value: 0,
        color: 'red',
        dashStyle: 'shortdash',
        width: 2,
        label: {
          text: ''
        }
      }
    ];
    /*
    if $scope.isCompare == true
        plotLines.push
            value : $scope.averagePercentSell
            color : 'green'
            dashStyle : 'shortdash'
            width : 2
            label :
                text : 'average'
    */
    return $("#" + $scope.idChartResultAverage).highcharts("StockChart", {
      chart: {
        zoomType: 'x'
      },
      rangeSelector: {
        selected: 1,
        inputEnabled: $("#" + $scope.idChartResultAverage).width() > 480
      },
      scrollbar: {
        liveRedraw: false
      },
      plotOptions: {
        series: {
          compare: null
        }
      },
      yAxis: {
        title: {
          text: 'Percent'
        },
        plotLines: plotLines
      },
      series: series
    });
  };
});angular.module('app.controllers').controller("StockCtrl", function($scope, $http, messageFlash, modalService, generateId) {
  $http.get("stock/historic").success(function(data) {
    console.log(data);
    return $scope.historic = data;
  }).error(function(data) {
    return messageFlash.displayError(data.messages);
  });
  $scope.id = generateId.generate();
  $scope.stocks = {};
  $scope.stock = {
    fieldTitle: "Stock",
    url: "stock/autoCompletion/"
  };
  $scope.$watch('stock.field', function(n, o) {
    if (o !== n && (n != null)) {
      return $scope.loadStock($scope.stock.field);
    }
  });
  $scope.loadStock = function(stock) {
    return $http.get("stock/values/" + stock).success(function(data) {
      $scope.stocks[data.stock.symbol] = data;
      return $scope.buildChart();
    }).error(function(data) {
      return messageFlash.displayError(data.messages);
    });
  };
  $scope.isCompare = false;
  $scope.$watch('isCompare', function(o, n) {
    if (o !== n) {
      console.log($scope.isCompare === true ? 'percent' : null);
      return $scope.buildChart();
    }
  });
  $scope.groupingUnits = [['week', [1]], ['month', [1, 2, 3, 4, 6]]];
  $scope.yAxis = [
    {
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'truc'
      },
      height: $scope.isCompare === true ? '100%' : '70%',
      lineWidth: 2
    }
  ];
  $scope.removeStock = function(symbol) {
    delete $scope.stocks[symbol];
    return $scope.buildChart();
  };
  $scope.buildChart = function() {
    var key, price, series, stock, value, _i, _j, _len, _len2, _ref, _ref2;
    if ($scope.stocks != null) {
      series = [];
      _ref = Object.keys($scope.stocks);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key !== '$$hashKey') {
          stock = $scope.stocks[key];
          price = [];
          _ref2 = stock.values;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            value = _ref2[_j];
            price.push([value.date + 12 * 3600 * 1000, value.valueClose, value.valueMax, value.valueMin, value.valueOpen]);
          }
          series.push({
            name: stock.stock.symbol,
            data: price,
            yAxis: 0,
            type: 'area',
            tooltip: {
              valueDecimals: 4
            },
            dataGrouping: {
              units: $scope.groupingUnits
            },
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [[0, Highcharts.getOptions().colors[0]], [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]]
            }
          });
        }
      }
      return $("#" + $scope.id).highcharts("StockChart", {
        chart: {
          zoomType: 'x'
        },
        rangeSelector: {
          selected: 1,
          inputEnabled: $("#" + $scope.id).width() > 480
        },
        scrollbar: {
          liveRedraw: false
        },
        plotOptions: {
          series: {
            compare: $scope.isCompare === true ? 'percent' : null
          }
        },
        yAxis: $scope.yAxis,
        series: series
      });
    }
  };
  return $scope.loadStocks = function() {
    return $http.get("stock/loading");
  };
});angular.module('app.controllers').controller("MainCtrl", function($scope) {
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
});angular.module('app.directives').run(function($templateCache) {$templateCache.put('$/angular/views/currency.html', "<div><h1>Currency</h1><span>Reference</span><select ng-options=\"c as c.name for c in currencies\" ng-model=\"reference\"></select><span>Currency</span><select ng-options=\"c as c.name for c in currencies\" ng-model=\"currency\"></select><br><mm-chart-area ng-data=\"chartData\"></mm-chart-area></div>");$templateCache.put('$/angular/views/my-share.html', "<div><h1>My share</h1><div><button ng-click=\"createMyShare()\">Add a new share</button><button ng-click=\"sellSimulation()\">Sell somulation</button></div><div><div><a ng-click=\"showAll()\">show all</a><span>/</span><a ng-click=\"hideAll()\">hide all</a></div><div class=\"my-share-table\" loading-container=\"tableParams.settings().$loading\"><table class=\"admin-table-import-bad\" ng-table=\"tableParams\"><tr ng-repeat=\"share in $data\"><td data-title=\"''\"><input ng-click=\"setVisibleChart(share)\" ng-model=\"share.visible\" type=\"checkbox\"></td><td sortable=\"'stock.code'\" data-title=\"'Stock'\">{{share.stock.symbol}}</td><td sortable=\"'buyDate'\" data-title=\"'Date'\">{{share.buyDate | date}}</td><td style=\"text-align:right\" data-title=\"'Value'\">{{share.buyPrice | numberToI18N}}</td><td style=\"text-align:right\" data-title=\"'Number'\">{{share.nbShare | numberToI18N}}</td><td style=\"text-align:right;border-right: 3px double #bbb;\" sortable=\"'totalEur'\" data-title=\"'Total (&euro;)'\">{{share.totalEur | numberToI18N}}<div class=\"question_info\"><div class=\"question_info_popup\"><div ng-repeat=\"(key, value) in share.totalEurDetails\"><div style=\"display:inline-block;width:50%\">{{key}}</div><div style=\"display:inline-block;width:50%;text-align:right\">{{value | numberToI18N: 4 }}</div></div></div></div></td><td sortable=\"'sellDate'\" data-title=\"'Sell Date'\">{{share.sellDate | date}}</td><td style=\"text-align:right\" data-title=\"'Sell Value'\">{{share.sellPrice | numberToI18N}}</td><td style=\"text-align:right;border-right: 3px double #bbb;\" sortable=\"'sellTotalEur'\" data-title=\"'Sell Total (&euro;)'\">{{share.sellTotalEur | numberToI18N}}<div class=\"question_info\"><div class=\"question_info_popup\"><div ng-repeat=\"(key, value) in share.totalSellEurDetails\"><div style=\"display:inline-block;width:50%\">{{key}}</div><div style=\"display:inline-block;width:50%;text-align:right\">{{value | numberToI18N: 4 }}</div></div></div></div></td><td style=\"text-align:right\" sortable=\"'differenceEur'\" data-title=\"'Difference (&euro;)'\">{{share.differenceEur | numberToI18N}}</td><td style=\"text-align:right\" sortable=\"'differencePercentEur'\" data-title=\"'Difference % (&euro;)'\">{{share.differencePercentEur | numberToI18N}} %</td><td style=\"text-align:right\" sortable=\"'differencePercentEurAverageByDay'\" data-title=\"'Average % (&euro;)'\">{{share.differencePercentEurAverageByDay | numberToI18N}} %</td><td style=\"text-align:left\" data-title=\"'Opts'\"><button ng-click=\"sellSimulation(share)\" class=\"glyphicon glyphicon-file\"></button><button ng-click=\"editShare(share)\" class=\"glyphicon glyphicon-pencil\"></button><button ng-click=\"sellShare(share)\" class=\"glyphicon glyphicon-ok-sign\" ng-show=\"share.sellPrice == null\"></button><button ng-click=\"remove(share)\" class=\"glyphicon glyphicon-remove\"></button></td></tr></table></div><div class=\"my-share-table\"><table><tr><th colspan=\"2\">Summary</th></tr><tr><td>Total</td><td>{{summary.value | numberToI18N}}</td></tr><tr><td>average %</td><td>{{averagePercentSell| numberToI18N}} %</td></tr></table></div></div><div><input ng-model=\"isCompare\" type=\"checkbox\"><div>Percentage ?</div></div><tabSet><tab><tab-heading><span>stock value</span></tab-heading><div><div id=\"{{idChartStock}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab><tab><tab-heading><span>shares value</span></tab-heading><div><div id=\"{{idChartShare}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab><tab><tab-heading><span>Results</span></tab-heading><div><div id=\"{{idChartResult}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab><tab><tab-heading><span>Results average by day</span></tab-heading><div><div id=\"{{idChartResultAverage}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab></tabSet></div>");$templateCache.put('$/angular/views/stock.html', "<div><h1>Stock</h1><button ng-click=\"loadStocks()\">LOAD STOCK</button><table><tr><td><div class=\"field_form\" style=\"width:400px\"><mm-field-auto-completion ng-info=\"stock\"></mm-field-auto-completion></div></td><td><table><tr ng-repeat=\"stock in stocks\"><td>{{stock.stock.symbol}}</td><td><button ng-click=\"removeStock(stock.stock.symbol)\">remove</button></td></tr></table></td></tr></table><div>Percentage ?<input ng-model=\"isCompare\" type=\"checkbox\"></div><div style=\"100%\"><div style=\"display:inline-block; width: calc(100% - 200px); vertical-align : top\"><div id=\"{{id}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div><div style=\"display:inline-block;width:200px;vertical-align : top\"><table class=\"table\"><tr><th colspan=\"2\">Historic visit</th></tr><tr><th>Name</th><th>last visit</th></tr><tr ng-click=\"loadStock(stock.stockDTO.symbol)\" ng-repeat=\"stock in historic.list\"><td>{{stock.stockDTO.symbol}}</td><td>{{stock.lastVisit | date}}</td></tr></table></div></div></div>");$templateCache.put('$/angular/templates/mm-table.html', "<div>je suis la directive table<button class=\"btn btn-default\" ng-click=\"tableParams.reload()\">Reload</button><button class=\"btn btn-default\" ng-click=\"tableParams.sorting({})\">Clear sorting<div class=\"clearfix\"></div><div loading-container=\"tableParams.settings().$loading\"><table class=\"table\" show-filter=\"true\" ng-table=\"tableParams\"><tbody><tr ng-repeat=\"stock in $data\"><td sortable=\"name\" data-title=\"'Name'\" filter=\"{ 'name': 'text' }\">{{stock.name}}{{$loading}}</td><td sortable=\"code\" data-title=\"'Code'\">{{stock.code}}</td></tr></tbody></table></div></button></div>");$templateCache.put('$/angular/templates/mm-field-date.html', "<div class=\"field_row\" ng-hide=\"getInfo().hidden === true\"><div ng-click=\"logField()\">{{getInfo().fieldTitle}}</div><div><div class=\"dropdown\"></div><a class=\"dropdown-toggle\" data-target=\"#\" id=\"{{id}}\" role=\"button\" data-toggle=\"dropdown\" href=\"\"><div class=\"input-group\"><input class=\"form-control\" ng-model=\"resultFormated\" type=\"text\"><span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-calendar\"></i></span></div><ul class=\"dropdown-menu date_input\" aria-labelledby=\"dLabel\" role=\"menu\"><datetimepicker data-ng-model=\"result\" data-datetimepicker-config=\"{ dropdownSelector: '{{idHtag}}',minView:'day' }\"></datetimepicker></ul></a></div><div><img src=\"/assets/images/field_valid.png\" ng-if=\"!hideIsValidIcon\" ng-show=\"getInfo().isValid\"><div class=\"error_message\" ng-hide=\"getInfo().isValid\"><img src=\"/assets/images/field_invalid.png\"><div>{{getInfo().validationMessage}}</div></div><div ng-transclude></div></div></div>");$templateCache.put('$/angular/templates/mm-field-text.html', "<div class=\"field_row\" ng-hide=\"getInfo().hidden === true\"><div ng-click=\"logField()\">{{getInfo().fieldTitle}}</div><div><div class=\"field_error_message_flash\" ng-show=\"errorMessage.length&gt;0\"><div>{{errorMessage}}</div><img src=\"/assets/images/question_field_error_message_icon_arrow.png\"></div><input ng-disabled=\"getInfo().disabled\" placeholder=\"{{getInfo().placeholder}}\" numbers-only=\"{{getInfo().numbersOnly}}\" focus-me=\"getInfo().focus()\" ng-class=\"{input_number: getInfo().numbersOnly === 'integer' || getInfo().numbersOnly === 'double'}\" ng-model=\"getInfo().field\" type=\"{{fieldType}}\"></div><div><div ng-if=\"isValidationDefined\"><img src=\"/assets/images/field_valid.png\" ng-if=\"!hideIsValidIcon\" ng-show=\"getInfo().isValid\"><div class=\"error_message\" ng-hide=\"getInfo().isValid\"><img src=\"/assets/images/field_invalid.png\"><div>{{getInfo().validationMessage}}</div></div></div><div ng-transclude></div></div></div>");$templateCache.put('$/angular/templates/mm-field-auto-completion.html', "<div class=\"field_row\" ng-hide=\"getInfo().hidden === true\"><div ng-click=\"logField()\">{{getInfo().fieldTitle}}</div><div><angucomplete minlength=\"1\" pause=\"400\" ng-disabled=\"getInfo().disabled\" id=\"members\" titlefield=\"content\" inputclass=\"form-control form-control-small\" placeholder=\"{{getInfo().placeholder}}\" selectedobject=\"result\" datafield=\"values\" url=\"{{getInfo().url}}\"></angucomplete></div><div><img src=\"/assets/images/field_valid.png\" ng-if=\"!hideIsValidIcon\" ng-show=\"getInfo().isValid\"><div class=\"error_message\" ng-hide=\"getInfo().isValid\"><img src=\"/assets/images/field_invalid.png\"><div>{{getInfo().validationMessage}}</div></div><div ng-transclude></div></div></div>");$templateCache.put('$/angular/templates/mm-welcome.html', "<div><nav class=\"navbar navbar-default\" role=\"navigation\"><div class=\"container-fluid\"><div class=\"navbar-header\"><button class=\"navbar-toggle collapsed\" data-target=\"#bs-example-navbar-collapse-1\" data-toggle=\"collapse\" type=\"button\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button><a class=\"navbar-brand\" href=\"#\">Money Maker</a></div><div id=\"bs-example-navbar-collapse-1\" class=\"collapse navbar-collapse\"><ul class=\"nav navbar-nav\"><li ng-class=\"{'active' : $root.isMenuCurrentlySelected('/currency') == true}\"><a ng-click=\"nav('/currency')\">Currency</a></li><li ng-class=\"{'active' : $root.isMenuCurrentlySelected('/stock') == true}\"><a ng-click=\"nav('/stock')\">Stock</a></li><li ng-class=\"{'active' : $root.isMenuCurrentlySelected('/myShare') == true}\"><a ng-click=\"nav('/myShare')\">My share</a></li></ul></div></div></nav><div ng-view></div></div>");$templateCache.put('$/angular/templates/mm-chart-area.html', "<div><div id=\"{{id}}\" style=\"height: 400px; min-width: 310px\" class=\"chart\"></div></div>");$templateCache.put('$/angular/templates/mm-modal-create-currency.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"save()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Create share</h4></div><div class=\"modal-body\"><div class=\"field_form\"><mm-field-text ng-info=\"fields.name\"></mm-field-text><mm-field-text ng-info=\"fields.symbol\"></mm-field-text></div></div><div class=\"modal-footer\"><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"save();\" type=\"button\">Save</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");$templateCache.put('$/angular/templates/mm-modal-sell-share.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"save()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Sell share {{getParams().share.stock.symbol}}</h4></div><div class=\"modal-body\"><div class=\"field_form\"><mm-field-date ng-info=\"fields.date\"></mm-field-date><mm-field-text ng-info=\"fields.price\"></mm-field-text></div><div class=\"modal-footer\"></div><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"save();\" type=\"button\">Save</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");$templateCache.put('$/angular/templates/mm-modal-manager.html', "<div></div>");$templateCache.put('$/angular/templates/mm-modal-create-share.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"save()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Create share</h4></div><div class=\"modal-body\"><div class=\"field_form\"><mm-field-auto-completion ng-info=\"fields.stock\"></mm-field-auto-completion><mm-field-text ng-info=\"fields.stockEdit\"></mm-field-text><mm-field-date ng-info=\"fields.date\"></mm-field-date><mm-field-text ng-info=\"fields.nb\"></mm-field-text><mm-field-text ng-info=\"fields.price\"></mm-field-text><mm-field-date ng-info=\"fields.sellDate\"></mm-field-date><mm-field-text ng-info=\"fields.sellPrice\"></mm-field-text></div><div class=\"modal-footer\"></div><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"save();\" type=\"button\">Save</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");$templateCache.put('$/angular/templates/mm-modal-sell-simulation.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"simulation()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Create share</h4></div><div class=\"modal-body\"><div class=\"field_form\"><div class=\"field_row\"><div>Buy</div><div><input ng-model=\"buy\" type=\"checkbox\"></div></div><mm-field-auto-completion ng-info=\"fields.stock\"></mm-field-auto-completion><mm-field-date ng-info=\"fields.date\"></mm-field-date><mm-field-text ng-info=\"fields.nb\"></mm-field-text><mm-field-text ng-info=\"fields.buyPrice\"></mm-field-text><mm-field-text ng-info=\"fields.sellPrice\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.totalCurrency\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.exchangeRate\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.price\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.tax\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.value\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.percentCost\"></mm-field-text></div><div class=\"modal-footer\"></div><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"simulation();\" type=\"button\">Simulate</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");});