angular.module('app.directives').directive("mmModalManager", function(directiveService, $compile) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngCondition: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-manager.html",
    replace: true,
    link: function(scope, element) {
      scope.$on('SHOW_MODAL', function(event, args) {
        if (args.show === true) {
          scope.displayModal(args.target, args.params);
        } else {
          scope.removeModal(args.target);
        }
        return;
      });
      scope.displayModal = function(target, params) {
        var directive, paramName;
        paramName = 'params_' + target.replace(/-/g, "_");
        scope[paramName] = params;
        console.log("display mode");
        console.log(params);
        console.log("<mm-modal-" + target + " ng-params=\"" + paramName + "\" ></mm-modal-" + target + ">");
        directive = $compile("<mm-modal-" + target + " ng-params=\"" + paramName + "\" ></mm-modal-" + target + ">")(scope);
        element.append(directive);
        return;
      };
      return scope.removeModal = function(target) {
        var child, _i, _len, _ref;
        _ref = element.children();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (child.tagName.toLowerCase() === 'mm-modal-' + target.toLowerCase()) {
            angular.element(child).remove();
          }
        }
        return;
      };
    }
  };
});