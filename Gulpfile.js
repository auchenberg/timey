'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var express = require('express');
var fs = require('fs');
var packageJson = require('./package.json');
var path = require('path');
var swPrecache = require('sw-precache');

function generateServiceWorkerFileContents(rootDir, handleFetch, callback) {
  var config = {
    cacheId: packageJson.name,
    handleFetch: handleFetch,
    logger: console.log,
    dynamicUrlToDependencies: {
      './': [path.join(rootDir, 'views', 'index.ejs')],
    },
    staticFileGlobs: [
      rootDir + '/stylesheets/**.css',
      rootDir + '/views/**.html',
      rootDir + '/images/**.*',
      rootDir + '/bower_components/**/**.js',
      rootDir + '/libs/.js',
      rootDir + '/**.js'
    ],
    stripPrefix: path.join(rootDir, path.sep)
  };

  swPrecache(config, callback);
}

gulp.task('build', function(callback) {
  generateServiceWorkerFileContents('./app', true, function(error, serviceWorkerFileContents) {
    if (error) {
      return callback(error);
    }
    fs.writeFile(path.join('service-worker.js'), serviceWorkerFileContents, callback);
  });
});
