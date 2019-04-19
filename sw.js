const cacheName = 'quiz-dynamic';
const staticAssets = [
    './',
    './css/stylesheet.css',
    './index.html',
    './images/empty-avatar.png',
    './images/favicon.png',
    './images/logo_512.png',
    './js/auth.js',
    './js/adminJs.js',
    './js/authenticated.js',
    './pages/signup.html',
    './pages/signin.html',
    './pages/home.html',
    './pages/quizdetails.html',
    './pages/quiz.html',
    './dist/js/adminlte.min.js',
    './bower_components/bootstrap/dist/css/bootstrap.min.css',
    './bower_components/font-awesome/css/font-awesome.min.css',
    './bower_components/Ionicons/css/ionicons.min.css',
    './dist/css/skins/_all-skins.min.css',
    './bower_components/jquery/dist/jquery.min.js'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
          console.log('[ServiceWorker] Caching app shell');
          return cache.addAll(staticAssets);
        })
      );
})

self.addEventListener('activate', e =>{
    console.log('sw activate');
    e.waitUntil(
        caches.keys().then(keyList =>{
            return Promise.all(keyList.map(key =>{
                if(key !== cacheName){
                    console.log('sw is removing old cache',key);
                    return caches.delete(key);
                }
            }))
        })
    )
})

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req))
    } else {
        event.respondWith(networkFirst(req))
    }
})

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res
    } catch (error) {
        return await cache.match(req)
    }
}