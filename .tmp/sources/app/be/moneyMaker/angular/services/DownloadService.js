angular.module('app.services').service("downloadService", function($http, $q) {
  this.downloadsInProgress = 0;
  this.getDownloadsInProgress = function() {
    return this.downloadsInProgress;
  };
  this.getJson = function(url, callback) {
    var deferred, promise;
    console.log("GET URL TO " + url);
    deferred = $q.defer();
    this.downloadsInProgress++;
    promise = $http({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json"
      }
    });
    promise.success(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: true
      }));
    });
    promise.error(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: false
      }));
    });
    return deferred.promise;
  };
  this.postJson = function(url, data, callback) {
    var deferred, promise;
    console.log("POST URL TO " + url);
    deferred = $q.defer();
    if (data === null) {
      data = {};
    }
    this.downloadsInProgress++;
    promise = $http({
      method: "POST",
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
    promise.success(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: true
      }));
    });
    promise.error(function(data, status, headers, config) {
      this.downloadsInProgress--;
      return deferred.resolve(callback({
        data: data,
        status: status,
        headers: headers,
        config: config,
        success: false
      }));
    });
    return deferred.promise;
  };
  return;
});