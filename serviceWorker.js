const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/Bird.png',
  '/img/blue.png',
  '/img/dish.png',
  '/img/snitch.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  '/pages/fallback.html'
];

// listening for install event
self.addEventListener('install', evt => {
	// console.log('service worker installed');
	evt.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			console.log('caching shell assets');
			cache.addAll(assets); // dasdada
			// cache.adderall(
			// 	assets.map(url => new Request(url, { credentials: 'include' }))
			// );
		})
	);
});

// activate event
self.addEventListener('activate', evt => {
	// console.log('service worker activated');
	evt.waitUntil(
		caches.keys().then(keys => {
		  //console.log(keys);
		  return Promise.all(keys
			.filter(key => key !== staticCacheName && key !== dynamicCacheName)
			.map(key => caches.delete(key))
		  );
		})
	);
});

// fetch event
self.addEventListener('fetch', evt => {
	// console.log('fetch event', evt);
	if(evt.request.url.indexOf('firestore.googleapis.com') === -1 && evt.request.url.indexOf('firebasestorage.googleapis.com') === -1) {
		evt.respondWith(
			caches.match(evt.request).then(cacheRes => {
				if (cacheRes) {
					console.log(cacheRes);
					return cacheRes;
				}
				console.log('fetching from network');
				return fetch(evt.request).then(fetchRes => {
					return caches.open(dynamicCacheName).then(cache => {
						cache.put(evt.request.url, fetchRes.clone());
						limitCacheSize(dynamicCacheName, 15); // check cache size
						return fetchRes;
					})
				});
				// return cacheRes || fetch(evt.request);
				// return cacheRes || fetch(evt.request).then(function(response) {
				// 	cacheRes.put(evt.request, response.clone());
				// 	return response;
				// });
			}).catch(() => {
				if (evt.request.url.includes('.html')) {
					caches.match('/pages/fallback.html')
				}
			})
		);
	}
});

// cache size limit function
const limitCacheSize = (name, size) => {
	caches.open(name).then(cache => {
	  cache.keys().then(keys => {
		if(keys.length > size){
		  cache.delete(keys[0]).then(limitCacheSize(name, size));
		}
	  });
	});
  };