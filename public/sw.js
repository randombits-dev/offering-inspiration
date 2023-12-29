const CACHE_NAME = 'cache-v1';

const precacheList = [
    {url: '/Merged/Crafts.json'},
    {url: '/Merged/Product%20Design.json'},
    {url: '/Merged/Technology.json'},
    {url: '/Merged/Gaming.json'},
    {url: '/Merged/Fashion.json'},
    {url: '/Merged/Food.json'},
    {url: '/Merged/Books.json'},
    {url: '/Merged/Photography.json'},
    {url: '/Merged/Comics%20&%20Graphic Novels.json'},
];

//Adding `install` event listener
self.addEventListener('install', (event) => {
    console.info('Event: Install');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                //[] of files to cache & if any of the file not present `addAll` will fail
                return cache.addAll(precacheList.map(item => item.url))
                    .then(() => {
                        console.info('All files are cached');
                        return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
                    })
                    .catch((error) => {
                        console.error('Failed to cache', error);
                    });
            })
    );
});

//Adding `fetch` event listener
self.addEventListener('fetch', (event) => {
    const request = event.request;
    event.respondWith(cacheFirst(request));
});

async function putInCache(request, response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log('Found in cache', request.url);
    }
    return cachedResponse || fetch(request)
    .then(res => {
        if (res.url.match(/\/Merged\/.*\.json$/)) {
            console.log('Caching the response to', request.url);
            putInCache(request, res.clone());
        }
      return res;
    });
}

//Adding `activate` event listener
self.addEventListener('activate', (event) => {
    console.info('Event: Activate');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); //Deleting the old cache (cache v1)
                    }
                })
            );
        })
            .then(function () {
                console.info("Old caches are cleared!");
                // To tell the service worker to activate current one
                // instead of waiting for the old one to finish.
                return self.clients.claim();
            })
    );
});
