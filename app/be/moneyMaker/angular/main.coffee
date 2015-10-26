#
# Modules
#

angular.module 'app.directives', []

angular.module 'app.filters', []

angular.module 'app.services', []

angular.module 'app.controllers', ['app.services', 'ngRoute', 'ngTable',
                                   'angular-flash.service', 'angular-flash.flash-alert-directive', 'angucomplete',
                                   'ui.bootstrap', 'ui.bootstrap.datetimepicker']

angular.module 'app', [
    'app.directives',
    'app.filters',
    'app.services',
    'app.controllers'
]


angular
.module('app.controllers')
.config ($routeProvider) ->
    $routeProvider
    .when('/currency', {
            templateUrl: '$/angular/views/currency.html'
            controller: 'CurrencyCtrl'
        }
    )
    .when('/myShare', {
            templateUrl: '$/angular/views/my-share.html'
            controller: 'MyShareCtrl'
        }
    )
    .when('/stock', {
            templateUrl: '$/angular/views/stock.html'
            controller: 'StockCtrl'
        }
    )
    .otherwise({ redirectTo: '/' })
    return

