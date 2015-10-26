angular.module('app.controllers').controller("MyShareCtrl", function($scope, $http, messageFlash, modalService, ngTableParams, $filter, fortuneoPrice, generateId, openDayService) {
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
});