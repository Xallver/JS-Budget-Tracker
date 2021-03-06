// array of files to link and cache
const FILE_TO_CACHE = [
    "/",
    "./index.html",
    "/favicon.ico",
    "/js/idb.js",
    "./css/styles.css",
    "./js/index.js",
    "/manifest.json",
    "/icons/icon-96x96.png",
    "/icons/icon-72x72.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png",

]

// Budget tracker app prefixes/variables
const APP_PREFIX = "BudgetTracker-"
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// log the cache that is installing
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILE_TO_CACHE)
        })
    )
});

// activate and delete cache
self.addEventListener('activate', function (evt) {
    evt.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })

            cacheKeeplist.push(CACHE_NAME);

            // delete cache
            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                }));

        })
    )
});

// retrieve needed cache 
self.addEventListener('fetch', function (evt) {
    console.log('fetch request : ' + evt.request.url)
    evt.respondWith(
        caches.match(evt.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + evt.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + evt.request.url)
                return fetch(evt.request)
            }
        })

    )
})


// confirm that the service worker was registered in the console
console.log('Service worker registered!') 