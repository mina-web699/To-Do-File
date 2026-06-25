const CACHE_NAME = "todo-notes-v2"; 
const ASSETS = ["./", "./index.html", "./style.css", "./app.js"];


self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()), 
  );
});


self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("Removing old cache:", key);
              return caches.delete(key); 
            }
          }),
        );
      })
      .then(() => self.clients.claim()), 
  );
});


self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    }),
  );
});
