angular.module('app.services').service("modalService", function($rootScope) {
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
});