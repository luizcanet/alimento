import IDBHandler from './IDBHandler.js'
import FeedServiceFactory from './Services/FeedServiceFactory.js'
import XMLParser from './fast-xml-parser/XMLParser.js'
import './service-worker.js'


self.XMLParser = XMLParser

const service = FeedServiceFactory.build();

const initIDBHandler = async () => {
    const iDBHandler =  new IDBHandler(indexedDB)
    
    await iDBHandler.init('alimento_db', 1)
}

initIDBHandler()

const update = async (notification) => {
    await service.updateAll()
    
    if (notification) {
        checkForNewItems()
    }
}

const checkForNewItems = async () => {
    const newItems = await service.getNewItems()

    if (newItems.length > 0) {
        // eslint-disable-next-line no-undef
        showNotification('New Updates!', {
            icon: './alimento-logo.svg',
            body: newItems[0].title
        })
    }
}

self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-feed') {
      event.waitUntil(update())
    }
    if (event.tag === 'update-feed-notification') {
        event.waitUntil(update(true))
      }
})
