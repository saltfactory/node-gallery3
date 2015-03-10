/**
 * @filename : gallery3-test.js
 * @author : SungKwang Song <saltfactory@gmail.com>
 * @updated : 3/10/15
 */

var assert = require('assert');
var Gallery3 = require('../lib/gallery3');


describe('Gallery3 login Test', function(){
  var gallery3 = new Gallery3();

  //before(function(){
  //
  //});

  describe('read config', function(){
    it('read config file', function(){
      console.log(gallery3)
    });
  });

  describe('login', function(){
    it('login user/password', function(done){
      var user = 'user';
      var password = 'password'

      gallery3.login(user, password)
        .success(function(result){
          console.log(result);
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });
  });

  describe.only('findItem', function(){
    var itemId = 2;


    var url = gallery3.options.host + gallery3.options.base + '/rest/item/' + itemId;

    it('find item by url', function(done){
      console.log(gallery3);
      gallery3.findItem(url)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('find item by item number', function(done){
      gallery3.findItem(itemId)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });
  });

  describe('getImageUrlPublic', function(){
    var itemId = 14;
    var url = gallery3.options.host + gallery3.options.base +'/rest/item/'+itemId;

    it('get public image url by url', function(done){
      gallery3.getImageUrlPublic(url)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('get public image url by itemId', function(done){
      gallery3.getImageUrlPublic(itemId)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

  });

  describe('create Item', function(){
    var itemId = 2;
    var url = gallery3.options.host + gallery3.options.base + '/rest/item/' + itemId;
    var entity = {
      type: 'album',
      name: 'Sample Album',
      title: 'This is my Sample Album'
    };

    it('create Item without parentItem, default', function(done){
      gallery3.createItem(entity)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('create Item in parent item by url', function(done){
      gallery3.createItem(entity, url)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('create Item in parent item by itemId', function(done){
      gallery3.createItem(entity, itemId)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });
  });

  describe('upload file', function(){
    var itemId = 2;
    var url = gallery3.options.host + gallery3.options.base + '/rest/item/' + itemId;
    var filePath = '/Users/saltfactory/Downloads/bh6hug.jpg';
    var entity = {
      title: 'title',
      description: 'description'
    };

    it('upload file without parent identifier', function(done){
      //gallery3 = new Gallery3({rootItemId:58});

      gallery3.uploadFile(filePath)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('upload file without entity in parent album by url', function(done){

      gallery3.uploadFile(filePath, url)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it.only('upload file without entity in parent album by id', function(done){
      gallery3.uploadFile(filePath, itemId)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('upload file with entity', function(done){
      gallery3.uploadFile(filePath, entity)
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('upload file with entity and url', function(done){
      gallery3.uploadFile(filePath, entity, url )
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

    it('upload file with entity and itemId', function(done){
      gallery3.uploadFile(filePath, entity, itemId )
        .success(function(result){
          console.log(result)
        })
        .error(function(err){
          console.log(err);
        })
        .finally(done);
    });

  });


});