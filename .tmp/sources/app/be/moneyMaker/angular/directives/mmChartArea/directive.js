angular.module('app.directives').directive("mmChartArea", function(directiveService, $timeout, generateId) {
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
});