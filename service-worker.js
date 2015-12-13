/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/jeffposnick/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

'use strict';



var PrecacheConfig = [["./","6b28f48df7df145b43e09ec3924ad5ab"],["Gulpfile.js","5b6470ccf459695ad82110e2296925dd"],["app.js","f01918e5652c9d709cd02be754482af8"],["bower_components/angular-animate/angular-animate.js","a70cc430e9e6fa4affcb90190170c95e"],["bower_components/angular-animate/angular-animate.min.js","9991bc26aa173e6aae8b7e6fb9362c6e"],["bower_components/angular-animate/index.js","eca59ea32960ae595dd18ad9480185b1"],["bower_components/angular-route/angular-route.js","7d69bc2800f318041151bd3d97e57d19"],["bower_components/angular-route/angular-route.min.js","28ef7d7b4349ae0dce602748185ef32a"],["bower_components/angular-route/index.js","a3320f99fcd749cc422bb5add3888b34"],["bower_components/angular/angular.js","6784b49d63c0d252facd81f81f33d744"],["bower_components/angular/angular.min.js","b1137641dbb512a60e83d673f7e2d98f"],["bower_components/angular/index.js","0d848853205d22ab8be985876aec948a"],["bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js","8c8dc8e2b78a4388f70a3703e253e20b"],["bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js","76afac459c9c59b84c011accd93d23d5"],["bower_components/moment-timezone/builds/moment-timezone-with-data.js","c3ef7032760a000e252b7d22370d575a"],["bower_components/moment-timezone/builds/moment-timezone-with-data.min.js","948e76a4b1dd7c116b8aa290a80588af"],["bower_components/moment-timezone/builds/moment-timezone.min.js","0c54a81f2abd7f8e96c0fc7e5b30f20d"],["bower_components/moment-timezone/moment-timezone-utils.js","0d968966b9d1d893a10dd4cbec3c7a95"],["bower_components/moment-timezone/moment-timezone.js","b0feb27fe3282f04f0263e4a8c27b63d"],["bower_components/moment/benchmarks/clone.js","980a57c4d0842789befa330d447e529d"],["bower_components/moment/locale/af.js","bcf5a1525fda12de0a5f2358310fe5b9"],["bower_components/moment/locale/ar-ma.js","da7b4a176e11ad87fe0fa6bc17e920e1"],["bower_components/moment/locale/ar-sa.js","64635a731154c6d312bd356914a60854"],["bower_components/moment/locale/ar-tn.js","9c8be0ea83be4419f8992fdd40cc1c02"],["bower_components/moment/locale/ar.js","88392c3f21946838520544a4f43d25eb"],["bower_components/moment/locale/az.js","26ada46e91ef2b53de231ed05ce07cbc"],["bower_components/moment/locale/be.js","2b4035f9ae94d76f68cca7e6f3cd5871"],["bower_components/moment/locale/bg.js","38885b3d8a7aa6196e072e2253b5ced9"],["bower_components/moment/locale/bn.js","b35fe59f7d44c083e816678ca5297f7e"],["bower_components/moment/locale/bo.js","f953c7c728db2a6cf1b88b9d43512440"],["bower_components/moment/locale/br.js","cb78c182df3bd6dba83c46ca2f059902"],["bower_components/moment/locale/bs.js","0ce0f49767a6c9607286130ae74bcfd8"],["bower_components/moment/locale/ca.js","1f04fcaab23e66429cbcd36de63f635d"],["bower_components/moment/locale/cs.js","65c787bf87b66be50dc3c112a0d3dff5"],["bower_components/moment/locale/cv.js","1ebe0821989418fe465c9996b04afe03"],["bower_components/moment/locale/cy.js","367cbd028f9ab1e7c30e79d87344fc17"],["bower_components/moment/locale/da.js","00557c3eb7956e4d5f09c48baf4c2767"],["bower_components/moment/locale/de-at.js","e33f0bf54f8e36486db4852b92b54c7c"],["bower_components/moment/locale/de.js","c710c25a3213b98c56cbb86735d3df43"],["bower_components/moment/locale/el.js","81f05e5dd7a14fe02794c2ab6df1ff93"],["bower_components/moment/locale/en-au.js","1af209d61a5595ba9d7de4e50045e248"],["bower_components/moment/locale/en-ca.js","1fc51d4dab04fe2a635346253066d07a"],["bower_components/moment/locale/en-gb.js","5fafabdb505f8eedef591d1a4d20359c"],["bower_components/moment/locale/eo.js","be33e73e3bc1a23d678a89c7804b1742"],["bower_components/moment/locale/es.js","975626569d3da50165033d12dd5af4e9"],["bower_components/moment/locale/et.js","1b91e7ea71cbf442edc836fa172d3b13"],["bower_components/moment/locale/eu.js","6937f7ef82580259fd203abf6b910e3c"],["bower_components/moment/locale/fa.js","3eb4ba9dcfeccea6605130c241479b5b"],["bower_components/moment/locale/fi.js","20005e64bfcc20feffec42139acb03ef"],["bower_components/moment/locale/fo.js","b577ecabe85a73f8b6c3ce3997c05543"],["bower_components/moment/locale/fr-ca.js","45201f5303010801ce24ae4119e00e8e"],["bower_components/moment/locale/fr.js","5a80c63f6f4d541e418c1c1d6a76e6bc"],["bower_components/moment/locale/fy.js","d64cd772493a0bd13be354b291838a6b"],["bower_components/moment/locale/gl.js","04281557b2b6e8c28a802e7a3f59c478"],["bower_components/moment/locale/he.js","44b0e3b9cb818ec16e030c6da97b73e3"],["bower_components/moment/locale/hi.js","2d3a056ab290d72d88aa2cca01209cf4"],["bower_components/moment/locale/hr.js","0d489c8b45d45f0e299a1c0460079883"],["bower_components/moment/locale/hu.js","5024af8b218eb30fc7f5ea62f9983c0c"],["bower_components/moment/locale/hy-am.js","91dafb1670e29340e6da19cbf9e67d38"],["bower_components/moment/locale/id.js","446309db554107d0e9015458f82d6421"],["bower_components/moment/locale/is.js","6b9140d9676af103e3dc638ba7a5c741"],["bower_components/moment/locale/it.js","9ee52f3a2eadba6da4dfcbde48be8424"],["bower_components/moment/locale/ja.js","2ee173e8d6c5fdd1d3bc1dd875caa380"],["bower_components/moment/locale/ka.js","d57c34877b01ee3aeb5eb3c56f464615"],["bower_components/moment/locale/km.js","aaa11edae600f6b5bdaaa8de8ebb8136"],["bower_components/moment/locale/ko.js","e51c1a895a4c47f67b5d0ccb102ca260"],["bower_components/moment/locale/lb.js","e8a022e6d9c3d7d8b86926116a593d77"],["bower_components/moment/locale/lt.js","1df4f6c73eb8991257b048a193eadead"],["bower_components/moment/locale/lv.js","3bb25a833b1e81a7fafb604f01449cc6"],["bower_components/moment/locale/mk.js","08ebe5bdd77f9d363928a105d04f3c41"],["bower_components/moment/locale/ml.js","0ac9bea69476b2b698c7c71909b5bd51"],["bower_components/moment/locale/mr.js","5046e7ccd59805a043093d8d00a01bda"],["bower_components/moment/locale/ms-my.js","36f32fda02594413dfb1ff9a74c293cc"],["bower_components/moment/locale/my.js","86344ac370c7b26a73838720e8f25c4b"],["bower_components/moment/locale/nb.js","a89cbd034f21414c3ff66970c2c9efbf"],["bower_components/moment/locale/ne.js","094400a0b60e160042e609650e9f516e"],["bower_components/moment/locale/nl.js","8ff9ae42d304680c03828c5750cc49fc"],["bower_components/moment/locale/nn.js","8d4681fdc19019018f227cded86d854a"],["bower_components/moment/locale/pl.js","4fc6163acb89289d046b5f2956018d0e"],["bower_components/moment/locale/pt-br.js","ef4e127b2212408d3d0f5c2be8ff0364"],["bower_components/moment/locale/pt.js","06696317e9b42f35e234d2145cf7be1f"],["bower_components/moment/locale/ro.js","bc40c531a8e94a9e69a7821407140a50"],["bower_components/moment/locale/ru.js","9bbfa493b3cf5757709d721152a281f6"],["bower_components/moment/locale/sk.js","e31f180d7ad0f10f6006484139422d7f"],["bower_components/moment/locale/sl.js","070087146aaf333c43f698a2610ea7ee"],["bower_components/moment/locale/sq.js","981aa11b41d68f625825b4d7a2e1d934"],["bower_components/moment/locale/sr-cyrl.js","c92cd97ad2114f37ad99c6339715bab2"],["bower_components/moment/locale/sr.js","98e87387b7abd596f728a506c8ba8fd3"],["bower_components/moment/locale/sv.js","df08e0e58e32316396b14bc8a9780673"],["bower_components/moment/locale/ta.js","2ed64224618540ecf08677eea6fccf52"],["bower_components/moment/locale/th.js","529fb2db41c51df725f5acd6d6f9f00f"],["bower_components/moment/locale/tl-ph.js","b5fb6b6fc0a064352c3236e06a54eb96"],["bower_components/moment/locale/tr.js","f65ded660bed73f48325f198d939ca40"],["bower_components/moment/locale/tzm-latn.js","c516f6b158fc1257bf79c82f77f40538"],["bower_components/moment/locale/tzm.js","682d7aa3640102f9c96bca61d219e35c"],["bower_components/moment/locale/uk.js","6f932dbb02b79496a37b2d1b0b6fa141"],["bower_components/moment/locale/uz.js","6a6607f67b08ec7b673b818d844906d2"],["bower_components/moment/locale/vi.js","fd98b5603648801fd3252afa140eed52"],["bower_components/moment/locale/zh-cn.js","1c162bae94c989fd5f4d15eafaf6c385"],["bower_components/moment/locale/zh-tw.js","b2e7d454c9da0e21edd30ca9e45d13f7"],["bower_components/moment/meteor/export.js","6f7059eb689f1723fb85fdfa8f8977c2"],["bower_components/moment/meteor/test.js","b9855709f54c9e728324d4ca5dcd4566"],["bower_components/moment/min/locales.js","09211d2afb1c133c572321e544a3f5d2"],["bower_components/moment/min/locales.min.js","957fa64c0c7c50aec3fff10595313a0c"],["bower_components/moment/min/moment-with-locales.js","671617f4a6aaaf075b783f645d53c0f4"],["bower_components/moment/min/moment-with-locales.min.js","135520cbe797c6273813b949e0af67cd"],["bower_components/moment/min/moment.min.js","85e5d41eb9c451c16d4e784aec13d948"],["bower_components/moment/moment.js","15bc84f89593b12b043a282b88bb32db"],["images/big_icon.png","89d40f205b343ab33e6b58b06705cf7e"],["images/favicon.ico","a2186b6e07f263f8e3eb2237036f094c"],["images/icon.png","084944ead65014b02ec0a991dec002f9"],["images/logo.svg","4fe68385a7383b72a9abe7510dce868f"],["images/trash.svg","2e111b2cc330994faa1ed16277542557"],["server.js","70a8aac2d2fcc8ecd9cdd147b5260bc4"],["service-worker.js","b76f8d7c99bfe92fe291fb2dca132a03"],["stylesheets/app.css","cbbec14ef0f61cd4028f941382a9ed6c"],["views/home.html","0a279f34e5f0d2b776b1b3265cabcfa9"]];
var CacheNamePrefix = 'sw-precache-v1-timey-' + (self.registration ? self.registration.scope : '') + '-';


var IgnoreUrlParametersMatching = [/^utm_/];



var populateCurrentCacheNames = function (precacheConfig, cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl, ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  var now = Date.now();

  event.waitUntil(
    caches.keys().then(function(allCacheNames) {
      return Promise.all(
        Object.keys(CurrentCacheNamesToAbsoluteUrl).filter(function(cacheName) {
          return allCacheNames.indexOf(cacheName) == -1;
        }).map(function(cacheName) {
          var url = new URL(CurrentCacheNamesToAbsoluteUrl[cacheName]);
          // Put in a cache-busting parameter to ensure we're caching a fresh response.
          if (url.search) {
            url.search += '&';
          }
          url.search += 'sw-precache=' + now;
          var urlWithCacheBusting = url.toString();

          console.log('Adding URL "%s" to cache named "%s"', urlWithCacheBusting, cacheName);
          return caches.open(cacheName).then(function(cache) {
            var request = new Request(urlWithCacheBusting, {credentials: 'same-origin'});
            return fetch(request.clone()).then(function(response) {
              if (response.status == 200) {
                return cache.put(request, response);
              } else {
                console.error('Request for %s returned a response with status %d, so not attempting to cache it.',
                  urlWithCacheBusting, response.status);
                // Get rid of the empty cache if we can't add a successful response to it.
                return caches.delete(cacheName);
              }
            });
          });
        })
      ).then(function() {
        return Promise.all(
          allCacheNames.filter(function(cacheName) {
            return cacheName.indexOf(CacheNamePrefix) == 0 &&
                   !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            console.log('Deleting out-of-date cache "%s"', cacheName);
            return caches.delete(cacheName);
          })
        )
      });
    }).then(function() {
      if (typeof self.skipWaiting == 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim == 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command == 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});


self.addEventListener('fetch', function(event) {
  if (event.request.method == 'GET') {
    var urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url,
      IgnoreUrlParametersMatching);

    var cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    if (cacheName) {
      event.respondWith(
        // We can't call cache.match(event.request) since the entry in the cache will contain the
        // cache-busting parameter. Instead, rely on the fact that each cache should only have one
        // entry, and return that.
        caches.open(cacheName).then(function(cache) {
          return cache.keys().then(function(keys) {
            return cache.match(keys[0]).then(function(response) {
              return response || fetch(event.request).catch(function(e) {
                console.error('Fetch for "%s" failed: %O', urlWithoutIgnoredParameters, e);
              });
            });
          });
        }).catch(function(e) {
          console.error('Couldn\'t serve response for "%s" from cache: %O', urlWithoutIgnoredParameters, e);
          return fetch(event.request);
        })
      );
    }
  }
});

