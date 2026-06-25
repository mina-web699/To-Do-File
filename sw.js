const CACHE_NAME = "todo-notes-v2"; // رفعنا الإصدار لـ v2 عشان نجدد الكاش
const ASSETS = ["./", "./index.html", "./style.css", "./app.js"];

// 1. مرحلة التثبيت: نجبره يشتغل فوراً بدون انتظار skipWaiting
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()), // 🔥 السر هنا: تفعيل فوري
  );
});

// 2. مرحلة التفعيل: تنظيف أي كاش قديم تلقائياً
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("Removing old cache:", key);
              return caches.delete(key); // مسح الكاش القديم
            }
          }),
        );
      })
      .then(() => self.clients.claim()), // يخلي الـ SW يتحكم في الصفحة فوراً
  );
});

// 3. مرحلة جلب البيانات (كما هي)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    }),
  );
});
