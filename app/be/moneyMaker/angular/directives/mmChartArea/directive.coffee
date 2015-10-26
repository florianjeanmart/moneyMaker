angular
.module('app.directives')
.directive "mmChartArea", (directiveService, $timeout,generateId) ->
    restrict: "E"
    scope: directiveService.autoScope
        ngData: '='
    templateUrl: "$/angular/templates/mm-chart-area.html"
    replace: true
    transclude: true
    compile:->
        pre: (scope) ->
            scope.id =generateId.generate()

        post: (scope, element) ->
            directiveService.autoScopeImpl scope

            scope.$watch ('getData()'), ->
                if scope.getData()?

                    console.log scope.getData()

                    dataToDisplay = scope.getData().values

                    $("#"+scope.id).highcharts "StockChart",
                        rangeSelector:
                            selected: 1
                            inputEnabled: $("#"+scope.id).width() > 480

                        title:
                            text: scope.getData().title

                        series: [
                            name: scope.getData().seriesTitle
                            data: dataToDisplay
                            tooltip:
                                valueDecimals: 4
                        ]
