angular.module('app.directives').directive("mmModalSellSimulation", function(directiveService, messageFlash, $http) {
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
});