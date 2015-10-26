angular.module('app.services').service("messageFlash", function(flash) {
  this.display = function(type, message, opts) {
    var options;
    options = {
      message: message,
      type: type,
      hideAfter: 5,
      showCloseButton: true
    };
    return Messenger().post(angular.extend(options, angular.copy(opts)));
  };
  this.displaySuccess = function(message, opts) {
    return this.display('success', message, opts);
  };
  this.displayInfo = function(message, opts) {
    return this.display('info', message, opts);
  };
  this.displayError = function(message, opts) {
    return this.display('error', message, opts);
  };
  return;
});