const CACHE_NAME = 'zyb_mall_v1';
const CACHE_LIST = [
    '/',
    '/images/logo.png',
    '/manifest.json',
    '/css/index.css',
    '/js/index.js',
    '/api/getGoods'
];
// 操作缓存、拦截请求 self this
self.addEventListener('install',async event => {
    let cache = await caches.open(CACHE_NAME);
    await cache.addAll(CACHE_LIST);
    await self.skipWaiting();
});
//清除掉旧的缓存
self.addEventListener('activate', async event => {
    const keys = await caches.keys();
    keys.forEach(key => {
        if (key !== CACHE_NAME) {
            caches.delete(key);
        }
    });
    await self.clients.claim();
});
self.addEventListener('fetch', event => {
    const req = event.request;
    // 给浏览器相应
    if (req.url.includes('/api')) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

// 网络优先
async function networkFirst(req) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const fresh = await fetch(req);
        // 网络优先，获取到的数据，应该再次更新到缓存
        cache.put(req, fresh.clone());
        return fresh;       
    } catch (e) {
        // 去缓存中读取
        const cached = await cache.match(req);
        return cached;
    }
}
// 缓存优先
async function cacheFirst(req) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) {
        return cached;
    } else {
        const fresh = await fetch(req);
        return fresh;
    }
}