const staticCacheName = 'site-static-v3';
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
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

// listening for install event
self.addEventListener('install', evt => {
	// console.log('service worker installed');
	evt.waitUntil(
		caches.open(staticCacheName).then((cache) => {
		  console.log('caching shell assets');
		  cache.addAll(assets); //
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
			.filter(key => key !== staticCacheName)
			.map(key => caches.delete(key))
		  );
		})
	);
});

// fetch event
self.addEventListener('fetch', evt => {
	// console.log('fetch event', evt);
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
				  return fetchRes;
				})
			});
			// return cacheRes || fetch(evt.request);
			// return cacheRes || fetch(evt.request).then(function(response) {
			// 	cacheRes.put(evt.request, response.clone());
			// 	return response;
			// });
		})
	);
});