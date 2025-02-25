const VERSION = '1.0.0'

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(VERSION)
    await cache.addAll(resources)
}
  
const putInCache = async (request, response) => {
    const cache = await caches.open(VERSION)
    await cache.put(request, response)
}

const cacheFirst = async ({ request, preloadResponsePromise }) => {
    const responseFromCache = await caches.match(request)
    
    if (responseFromCache) {
        return responseFromCache
    }

    const preloadResponse = await preloadResponsePromise

    if (preloadResponse) {
        putInCache(request, preloadResponse.clone())
        
        return preloadResponse;
    }

    try {
        const responseFromNetwork = await fetch(request.clone())
        putInCache(request, responseFromNetwork.clone())
        
        return responseFromNetwork
    } catch {
        return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        })
    }
}

const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable()
    }
}

self.addEventListener('activate', (event) => {
    event.waitUntil(enableNavigationPreload())
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (VERSION.indexOf(key) === -1) {
                    return caches.delete(key)
                }
            }))
        })
    )
})

self.addEventListener('install', (event) => {
    event.waitUntil(
        addResourcesToCache([
            './',
            './index.html',
            './index.css',
            './index.js',
            './alimento-logo-svg'
        ])
    )
})

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url)

    if (url.pathname === '/proxy') {
        event.respondWith(fetch(event.request.clone()))
    } else {
        event.respondWith(
            cacheFirst({
                request: event.request,
                preloadResponsePromise: event.preloadResponse
            })
        )
    }
})
