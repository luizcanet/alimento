import IDBHandler from '../IDBHandler.js'
import Feed from '../Models/Feed.js'

class FeedRepository {
    #iDBHandler

    constructor (iDBHandler) {
        this.iDBHandler = iDBHandler
    }

    set iDBHandler (iDBHandler) {
        if (!(iDBHandler instanceof IDBHandler)) {
            throw new TypeError('Must use an IDBHandler as parameter')
        }

        this.#iDBHandler = iDBHandler
    }

    get iDBHandler () {
        return this.#iDBHandler
    }

    add (feed) {
        return new Promise((resolve, reject) => {
            if (!(feed instanceof Feed)) {
                throw new TypeError('Must use a Feed as parameter')
            }

            const transaction = this.#iDBHandler.db.transaction(['feeds'], 'readwrite')
            const feedStore = transaction.objectStore('feeds');
            const feedStoreRequest = feedStore.add({
                title: feed.title,
                link: feed.link,
                description: feed.description,
                language: feed.language,
                copyright: feed.copyright,
                managingEditor: feed.managingEditor,
                webMaster: feed.webMaster,
                pubDate: feed.pubDate,
                lastBuildDate: feed.lastBuildDate,
                categories: feed.categories.map(category => category.name),
                generator: feed.generator,
                docs: feed.docs,
                ttl: feed.ttl,
                image: feed.image
            });

            feedStoreRequest.onsuccess = () => { resolve(true) }
            feedStoreRequest.onerror = (event) => {
                reject(new Error(event.target.error.name))
            }
        })
    }

    getByLink (feedLink) {
        return new Promise((resolve, reject) => {
            if (typeof feedLink !== 'string') {
                throw new TypeError('Feed link must be a string')
            }

            const transaction = this.#iDBHandler.db.transaction(['feeds'], 'readonly')
            const feedStore = transaction.objectStore('feeds');
            const feedStoreRequest = feedStore.get(feedLink)

            feedStoreRequest.onsuccess = (event) => { 
                if (!event.target.result) {
                    reject(new Error('NotFoundError'))
                }

                resolve(event.target.result)
             }
        })
    }

    getAll () {
        return new Promise((resolve) => {
            const transaction = this.#iDBHandler.db.transaction(['feeds'], 'readonly')
            const feedStore = transaction.objectStore('feeds');
            const feedStoreRequest = feedStore.getAll()

            feedStoreRequest.onsuccess = (event) => { 
                resolve(event.target.result)
             }
        })
    }

    update (feed) {
        return new Promise((resolve, reject) => {
            if (!(feed instanceof Feed)) {
                throw new TypeError('Must use a Feed as parameter')
            }

            this.getByLink(feed.link).catch((error) => { reject(error) })

            const transaction = this.#iDBHandler.db.transaction(['feeds'], 'readwrite')
            const feedStore = transaction.objectStore('feeds');
            const feedStoreRequest = feedStore.put({
                title: feed.title,
                link: feed.link,
                description: feed.description,
                language: feed.language,
                copyright: feed.copyright,
                managingEditor: feed.managingEditor,
                webMaster: feed.webMaster,
                pubDate: feed.pubDate,
                lastBuildDate: feed.lastBuildDate,
                categories: feed.categories.map(category => category.name),
                generator: feed.generator,
                docs: feed.docs,
                ttl: feed.ttl,
                image: feed.image
            });

            feedStoreRequest.onsuccess = () => { resolve(true) }
        })
    }

    remove (feed) {
        return new Promise((resolve, reject) => {
            if (!(feed instanceof Feed)) {
                throw new TypeError('Must use a Feed as parameter')
            }

            this.getByLink(feed.link).catch((error) => { reject(error) })

            const transaction = this.#iDBHandler.db.transaction(['feeds'], 'readwrite')
            const feedStore = transaction.objectStore('feeds');
            const feedStoreRequest = feedStore.delete(feed.link);

            feedStoreRequest.onsuccess = () => { resolve(true) }
        })
    }
}

export default FeedRepository