/**
 * @filename : gallery3.js
 * @author : SungKwang Song <saltfactory@gmail.com>
 * @updated : 3/10/15
 */

var request = require('request');
//request.debug = true;
var Q = require('q');
var Promise = require('./promise.js');
var fs = require('fs');
var extend = require('util')._extend;
var path = require('path');

function checkUrl(identifier){
  var pattern = /^((http|https|ftp):\/\/)/;
  return pattern.test(identifier);
}

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function Gallery3(options){
  //if(checkUrl(host)){
  //  this.options = {
  //    host:host,
  //    base: base || '/gallery3',
  //    rootItemId: rootItemId || 1,
  //    requestKey: requestKey
  //  };
  //} else {
    var configPath = getUserHome() + '/.gallery3.json';
    var data = fs.readFileSync(configPath);
    this.options = JSON.parse(data);
  //}

  this.options = extend(this.options, options);


}


Gallery3.prototype.login = function(user, password) {

  var deferred = Q.defer();
  var promise = Promise.create(deferred);
  var self = this;

  var headers = {
    'X-Gallery-Request-Method': 'POST',
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  var formData = {
    user : user,
    password: password
  };

  function callback(err, response, body){
    if(err){
      console.log(err);
      deferred.reject(err);
    } else {
      self.options.requestKey = body;
      deferred.resolve(JSON.parse(body));
    }
  };

  request({url:this.options.host + this.options.base +'/rest', headers:headers, method:'POST', form:formData}, callback);

  return promise;
};

Gallery3.prototype.findItem = function(identifier){
  var deferred = Q.defer();
  var promise = Promise.create(deferred);

  var headers = {
    'X-Gallery-Request-Method': 'GET',
    'X-Gallery-Request-Key': this.options.requestKey
  };


  function callback(err, response, body){
    if(err){
      deferred.reject(err);
    } else {
      deferred.resolve(JSON.parse(body));
    }
  };

  var url = checkUrl(identifier) ? identifier :  this.options.host + this.options.base +'/rest/item/' + identifier;
  request({url:url, headers:headers, method:'GET'}, callback);

  return promise;
};

Gallery3.prototype.getImageUrlPublic = function(identifier){
  var deferred = Q.defer();
  var promise = Promise.create(deferred);
  var url = checkUrl(identifier) ? identifier : this.options.host + this.options.base +'/rest/item/' + identifier;


  this.findItem(url)
    .success(function(result){
      deferred.resolve(result.entity['file_url_public']);
    })
    .error(function(err){
      deferred.reject(err)
    });

  return promise;
};

Gallery3.prototype.createItem = function(entity, parentIdentifier ){
  var deferred = Q.defer();
  var promise = Promise.create(deferred);

  var headers = {
    'X-Gallery-Request-Method': 'POST',
    'X-Gallery-Request-Key': this.options.requestKey
  };

  var url;

  if (parentIdentifier) {
    url = checkUrl(parentIdentifier) ? parentIdentifier : this.options.host + this.options.base +'/rest/item/' + parentIdentifier;
  } else {
    url = this.options.host + this.options.base +'/rest/item/'+ this.options.rootItemId;
  }


  var formData = {
    entity: JSON.stringify(entity)
  };

  function callback(err, response, body){
    if(err){
      //console.log(err);
      deferred.reject(err);
    } else {
      //console.log(body);
      deferred.resolve(JSON.parse(body));
    }
    //console.log(response);
  };

  request({url:url, headers:headers, method:'POST', form:formData}, callback);

  return promise;
};

Gallery3.prototype.uploadFile = function(filePath, fileEntity, parentIdentifier){

  var deferred = Q.defer();
  var promise = Promise.create(deferred);
  var url = parentIdentifier;
  var headers = {
    'X-Gallery-Request-Method': 'POST',
    'X-Gallery-Request-Key': this.options.requestKey
  };

  var entity = {
    title: path.basename(filePath),
    type:'photo'
  };

  if((typeof fileEntity === 'string') ||(typeof fileEntity == 'number')){
    url = checkUrl(fileEntity) ? fileEntity : this.options.host + this.options.base +'/rest/item/' + fileEntity;
  } else {
    entity = extend(entity, fileEntity);

    if (parentIdentifier) {
      url = checkUrl(parentIdentifier) ? parentIdentifier : this.options.host + this.options.base +'/rest/item/' + parentIdentifier;
    } else {
      url = this.options.host + this.options.base +'/rest/item/' + this.options.rootItemId;
    }
  }


  function callback(err, response, body){
    if(err){
      deferred.reject(err);
    } else {
      deferred.resolve(JSON.parse(body));
    }
  };

  var r = request({url:url, headers:headers, method:'POST'}, callback);

  var form = r.form();
  form.append('entity', JSON.stringify(entity))

  if(filePath){
    form.append('file', fs.createReadStream(filePath))
  }

  return promise;
};


module.exports = Gallery3;

