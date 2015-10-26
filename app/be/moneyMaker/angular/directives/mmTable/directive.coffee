angular
.module('app.directives')
.directive "mmTable", (directiveService, $timeout,ngTableParams,$http) ->
    restrict: "E"
    scope: directiveService.autoScope
        ### DATA
        .data = []
        .start_date = data
        .frequency = servicePeriod
        ###
        ngData: '='
    templateUrl: "$/angular/templates/mm-table.html"
    replace: true
    transclude: true
    link:(scope)->
        #Api = $resource("/data")
        scope.tableParams = new ngTableParams(
            page: 1 # show first page
            count: 100 # count per page
            sorting:
                name: "asc" # initial sorting
        ,
            total: 50 # length of data
            getData: ($defer, params) ->

                console.log "GET DATA !! : "
                console.log params

                $http.get("stock/page/NASDAQ/"+params.page()+"/"+params.count())
                .success (data,status) ->
                    console.log data
                    params.total data.total
                    $defer.resolve data.stockList
                return
        )
        return