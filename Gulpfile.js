'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var express = require('express');
var fs = require('fs');
var packageJson = require('./package.json');
var path = require('path');
var runSequence = require('run-sequence');
var swPrecache = require('sw-precache');


function generateServiceWorkerFileContents(rootDir, handleFetch, callback) {
  var config = {
    cacheId: packageJson.name,
    handleFetch: handleFetch,
    logger: console.log,
    staticFileGlobs: [
      rootDir + '/stylesheets/**.css',
      rootDir + '/views/**.html',
      rootDir + '/images/**.*',
      rootDir + '/lib/**.js',
      rootDir + '/**.js'
    ],
    stripPrefix: path.join(rootDir, path.sep)
  };

  swPrecache(config, callback);
}

gulp.task('build', function(callback) {
  generateServiceWorkerFileContents('./', true, function(error, serviceWorkerFileContents) {
    if (error) {
      return callback(error);
    }
    fs.writeFile(path.join('service-worker.js'), serviceWorkerFileContents, callback);
  });
});
