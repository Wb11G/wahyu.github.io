'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "54620dbdc0c15ebe760531257911779b",
"version.json": "c84d9e835dbba97b78b658659a8c46a1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/fonts/MaterialIcons-Regular.ttf": "a37b0c01c0baf1888ca812cc0508f6e2",
"assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/NOTICES": "f8114129d095f456d77aafc69321708f",
"assets/FontManifest.json": "56a6be909b7a2d8103740792f4ede9ff",
"assets/icons/briefcase.png": "12e9358e8dbae5cb406a7abeec84d4f5",
"assets/icons/call.png": "9e299bb392428812cffbdadaf9272b15",
"assets/icons/coding.png": "c8150fc2000e8674220bcd485b30e68f",
"assets/icons/coffee.png": "19e4f65ea926133b771bf82daa35f5d4",
"assets/icons/design.png": "c59f68c8be347d0a5231b2b714421b24",
"assets/icons/double-up-arrow.png": "d758827b82d3262d54d19f7482c36b63",
"assets/icons/email.png": "ecf609bb48c645251a898c5527f7c781",
"assets/icons/facebook.png": "d03d1cb8afb8da75756264994a9ce4d4",
"assets/icons/github.png": "0918d78648457def080137b179fc5608",
"assets/icons/happy.png": "3837c30afeb5b40886a787810f553fc3",
"assets/icons/linkedin.png": "3c963b14a58df80613b15c7e9e4e9c57",
"assets/icons/list.png": "4e63ee6122b58866f4a2d2408c02f9ef",
"assets/icons/menu.png": "3ca1d45f78b3acb1d2a89a53271a21db",
"assets/icons/pencil.png": "4566fb93d2196b9b2b74be9cfe23d0c8",
"assets/icons/pin.png": "c40700870fa15459e94f3ffd6eccfcfd",
"assets/icons/twitter.png": "cadd7c4e3a3a29ddfa395393e652012a",
"assets/images/1.jpg": "89854092bb97804d86ead9984c9a4351",
"assets/images/1.png": "a513b89d29ae82b3f7b8150b9265165f",
"assets/images/4.png": "26f9671fc0c08dae4649a0d099966b2a",
"assets/images/9.png": "9ec0b6b84023c369e5a71da4a11cd34a",
"assets/images/a.jpg": "91dbd27c619d12a16c6961e908fc7d86",
"assets/images/background.jpg": "346c1daab54715d3701cddb8b2ee0999",
"assets/images/c.jpg": "32c1ba66298e98ee120bc620089b4cd2",
"assets/images/debug.log": "a48bc64c9101f70421c5bb41081508e1",
"assets/images/frame.jpg": "e38060e5d532f14905f5aea5ca432607",
"assets/images/projects/juda.png": "47dd713dafca0915de28fee247372661",
"assets/images/projects/K.png": "c606cec24355dcbddac24b33a4c0e751",
"assets/images/projects/nataloe.png": "f2e32e0341fcde78352c4fb7fd364d7b",
"assets/images/projects/omran.png": "ca5fe45e4998ba2cd53c795537419014",
"assets/images/projects/topfood.png": "2e85bf80bf3965f6b85fb19fe1c6d3af",
"assets/images/projects/toptaxi.png": "25fc761abc220c62a31a61a41542872f",
"assets/images/projects/Ujian_Online.png": "cf079ccde011e121ecdbc96cefb02f17",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "15389494c2e82f829369ca5028d618c7",
"/": "15389494c2e82f829369ca5028d618c7",
"manifest.json": "ae50197133a94b602cc4399a7c5cd1d9"
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
