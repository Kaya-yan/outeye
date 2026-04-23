// public/sw.js —— 离线服务员
// 这个文件在浏览器后台运行，用户看不见，但负责"缓存网页"和"断网时提供离线内容"

const CACHE_NAME = "outeye-cache-v1"; // 缓存仓库的名字，版本号方便以后更新

// 首次安装时，把这些核心文件预先存进"仓库"
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// ==================== 安装阶段：开仓库、囤货 ====================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 把核心静态资源批量存入缓存
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // 安装完成后立即激活，不等待旧版本退出
  self.skipWaiting();
});

// ==================== 激活阶段：清理旧仓库 ====================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // 找出不是当前版本的旧缓存
          .map((name) => caches.delete(name))    // 全部删除
      );
    })
  );
  // 立即接管所有页面
  self.clients.claim();
});

// ==================== 拦截请求：优先读缓存，缓存没有再联网 ====================
self.addEventListener("fetch", (event) => {
  // 只处理 GET 请求（获取内容），不处理 POST（提交数据）
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 如果缓存里有，直接返回缓存的（快！）
      if (cachedResponse) {
        return cachedResponse;
      }
      // 缓存里没有，去网络请求（慢，但实时）
      return fetch(event.request)
        .then((networkResponse) => {
          // 顺手把新拿到的内容存进缓存，下次更快
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // 网络也失败了，返回一个极简离线页面（兜底）
          return new Response(
            "<html><body style='font-family:sans-serif;text-align:center;padding:40px;'><h1>外眼 OutEye</h1><p>当前处于离线状态，部分内容可能无法加载。</p><p>请检查网络连接后重试。</p></body></html>",
            { headers: { "Content-Type": "text/html" } }
          );
        });
    })
  );
});