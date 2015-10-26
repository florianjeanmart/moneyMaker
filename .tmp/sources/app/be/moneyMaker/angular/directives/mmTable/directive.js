angular.module('app.directives').directive("mmTable", function(directiveService, $timeout, ngTableParams, $http) {
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
});