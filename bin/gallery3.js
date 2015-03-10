#!/usr/bin/env node

/**
 * @filename : gallery3.js
 * @author : SungKwang Song <saltfactory@gmail.com>
 * @updated : 3/10/15
 */
var path = require('path'),
  fs = require('fs'),
  lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib'),
  util = require('util'),
  Gallery3 = require(lib + '/gallery3'),
  nopt = require("nopt");

var knownOpts = {
  "help": Boolean,
  "src": path,
  "user": String,
  "password":String,
  "title": String,
  "description":String,
  "url": String
};


var shortHands = {"-h": ["-help"], "s": ["-src"], "u": ["-user"], "p":["-password"], "t":["-title"], "desc":["-description"], "url":["-url"]};
var parsed = nopt(knownOpts, shortHands, process.argv, 1);
var options = {};

if (parsed.help) {
  console.log("" +
    "usage: gallery3 [command] -[options] [values]"
  );
  process.exit();
}


var defaultCfg = path.join(process.env.HOME, '.gallery3.json');
if (!fs.existsSync(defaultCfg)) {
  console.log('Not found global options file! node-gallery3 go on with default options');
  console.log("[Solution] You do create global options file. e.g. echo \"{'host':'http://domain', 'base':'/gallery3', 'requestKey':'abc'}\" > " + defaultCfg);
}

var command = parsed.argv.remain[1];

if(command){
  var gallery = new Gallery3();
  if(command === 'login'){
    gallery.login(parsed.user, parsed.password).success(console.log).error(console.log).finally(function(){console.log('Done.')});
  } else if(command === 'upload'){
    if (!fs.existsSync(parsed.src)){
      console.log('Not found file : ' + parsed.src);
    } else {
      var entity, url;

      if(parsed.title){
        entity = {title:parsed.title};
      }

      if(parsed.description){
        entity = util._extend(entity, {description:parsed.description});
      }

      if(parsed.url){
        url = parsed.url;
      }

      gallery.uploadFile(parsed.src, entity, url).success(console.log).error(console.log).finally(function(){console.log('Done.')});
    }

  }

} else {
  console.log("" +
    "usage: gallery3 [command] -[options] [values]"
  );
  process.exit();

}




