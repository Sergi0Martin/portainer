import { ping } from './ping';

angular.module('portainer.docker').factory('SystemService', [
  '$q',
  'System',
  function SystemServiceFactory($q, System) {
    'use strict';
    var service = {};

    service.plugins = function () {
      var deferred = $q.defer();
      System.info({})
        .$promise.then(function success(data) {
          var plugins = data.Plugins;
          deferred.resolve(plugins);
        })
        .catch(function error(err) {
          deferred.reject({ msg: 'Unable to retrieve plugins information from system', err: err });
        });
      return deferred.promise;
    };

    service.info = function () {
      return System.info({}).$promise;
    };

    service.ping = function (endpointId) {
      return ping(endpointId);
    };

    service.version = function () {
      return System.version({}).$promise;
    };

    service.dataUsage = function () {
      return System.dataUsage().$promise;
    };

    return service;
  },
]);
