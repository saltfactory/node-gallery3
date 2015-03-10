/**
 * @filename : promise.js
 * @author : SungKwang Song <saltfactory@gmail.com>
 * @updated : 3/10/15
 */

var Q = require('q');

var Promise = function(){};

Promise.prototype.create = function(deferred) {
  var promise = deferred.promise;
  promise.success = function(fn){
    promise.then(fn);
    return promise;
  };

  promise.error = function(fn){
    //promise.then(null, fn);
    promise.catch(fn);
    return promise;
  };

  return promise;
};

module.exports = new Promise();