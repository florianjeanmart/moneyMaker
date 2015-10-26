angular.module('app.controllers').controller("StockCtrl", function($scope, $http, messageFlash, modalService, generateId) {
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
});