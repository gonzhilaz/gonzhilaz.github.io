'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/asset/font/Montserrat-Bold.ttf": "d14ad1035ae6da4e5a71eca362a8d696",
"assets/asset/font/Montserrat-ExtraBold.ttf": "dc2f156b60f53c591fc0d2b98cbf01bf",
"assets/asset/font/Montserrat-Regular.ttf": "34de1239b12123b85ff1a68b58835a1f",
"assets/asset/font/SecularOne-Regular.ttf": "874b0ac67f6fac73dcbfc0c10e4dff0d",
"assets/asset/img/asset_travel.png": "fe33fa6a9c16b0a27554057c48b1211c",
"assets/asset/img/asset_travel2.png": "276f3551ed0856f6a29cdd80abf1cfc6",
"assets/asset/img/borobudur.jpg": "5204681e625b3237898e5a5f484218d5",
"assets/asset/img/freepik_travel.png": "59dc7f72e843e38ec3910b5d4ec459e0",
"assets/asset/img/grid.gif": "3be8ba724e3bc3c01ab91b478eae2749",
"assets/asset/img/gunung_bromo.jpg": "cf0565c325fa22832ad1ec41b34a6729",
"assets/asset/img/Kawah-Putih.jpg": "16d0c1db723f5d0bd10d6cc1d8799775",
"assets/asset/img/map-ornament.png": "a97478edc1f60f20b8a8a6311e386db9",
"assets/asset/img/paint_splatter.png": "dd50816624e47254231e6d04e3a0c377",
"assets/asset/img/Pantai-Parangtritis.jpg": "61d6625f1343430d971ba70c4ce85dbc",
"assets/asset/img/pngaaa.com-4419847.png": "dc6a4e6d0c1e1abba0741924af1c67c9",
"assets/asset/img/smoke2.jpg": "29158511a19f970f9f9d5514345891de",
"assets/asset/img/smoke3.jpg": "fd9c17f0aa751a42f11085f397471791",
"assets/asset/img/travel1.png": "ed04a6b7f5de62345f03d5b095ff161e",
"assets/asset/img/travel2.png": "e6b35dda5f69b333e9d0289d657f8778",
"assets/asset/img/WhatsApp%2520Image%25202022-06-12%2520at%252019.48.13.jpeg": "2a69e1454c6f1da297597ce16b79a68c",
"assets/asset/img/WhatsApp%2520Image%25202022-06-12%2520at%252019.48.25.jpeg": "11bbacc48256c568de63b7894a34befa",
"assets/AssetManifest.json": "de6cd819a52a3aa69e799a1eab524bc8",
"assets/FontManifest.json": "63d6be91874f4f98af09ad00f9eeeaf0",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "2ceedb153a9ddf191c47e7cb8b46fda6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "ddf4e65fdb327f3da09e034d1449060f",
"/": "ddf4e65fdb327f3da09e034d1449060f",
"main.dart.js": "48e81db8e0810cc472c95dd145fdf688",
"manifest.json": "a4604bd84f62d92feca1e9fc2b54286c",
"version.json": "56441d45352f9d39f36efe8187e7c98e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
