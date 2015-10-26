angular.module('app.controllers').controller("CurrencyCtrl", function($scope, $http, messageFlash, modalService) {
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
});