const CACHE_NAME = "todo-notes-v1";
// الملفات اللي عايزين نخزنها عشان تشتغل وأنت أوفلاين
const ASSETS = ["./", "./index.html", "./style.css", "./app.js"];

// 1. مرحلة التثبيت: تخزين الملفات في الكاش أول ما الموقع يفتح بجود نت
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }),
  );
});

// 2. مرحلة جلب البيانات: لو مفيش نت، هات الملفات من الكاش
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    }),
  );
});
