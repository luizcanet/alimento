import Feed from '../Models/Feed.js'
import Category from '../Models/Category.js'
import BaseRepository from './BaseRepository.js'

class FeedRepository extends BaseRepository {
    add (feed) {
        return new Promise((resolve, reject) => {
            if (!(feed instanceof Feed)) {
                throw new TypeError('Must use a Feed as parameter')
            }

            const transaction = this.iDBHandler.db.transaction(['feeds'], 'readwrite')
            const feedStore = transaction.objectStore('feeds')
            const feedStoreRequest = feedStore.add(this.#buildDBFeed(feed))

            feedStoreRequest.onsuccess = () => { resolve(true) }
            feedStoreRequest.onerror = (event) => {
                reject(new Error(event.target.error.name))
            }
        })
    }

    getByUrl (url) {
        return new Promise((resolve, reject) => {
            try {
                new URL(url)
            } catch {
                throw new TypeError('URL must be a valid URL')
            }

            const transaction = this.iDBHandler.db.transaction(['feeds'], 'readonly')
            const feedStore = transaction.objectStore('feeds');
            const feedStoreRequest = feedStore.get(url)

            feedStoreRequest.onsuccess = (event) => { 
                if (!event.target.result) {
                    reject(new Error('NotFoundError'))
                } else {
                    resolve(this.#buildFeed(event.target.result))
                }
             }
        })
    }

    getAll () {
        return new Promise((resolve) => {
            const transaction = this.iDBHandler.db.transaction(['feeds'], 'readonly')
            const feedStore = transaction.objectStore('feeds')
            const feedStoreRequest = feedStore.getAll()

            feedStoreRequest.onsuccess = (event) => { 
                resolve(event.target.result.map(dbFeed => this.#buildFeed(dbFeed)))
             }
        })
    }

    update (feed) {
        return new Promise((resolve, reject) => {
            if (!(feed instanceof Feed)) {
                throw new TypeError('Must use a Feed as parameter')
            }

            this.getByUrl(feed.url).catch((error) => { reject(error) })

            const transaction = this.iDBHandler.db.transaction(['feeds'], 'readwrite')
            const feedStore = transaction.objectStore('feeds');
            const feedStoreRequest = feedStore.put(this.#buildDBFeed(feed))

            feedStoreRequest.onsuccess = () => { resolve(true) }
        })
    }

    remove (feed) {
        return new Promise((resolve, reject) => {
            if (!(feed instanceof Feed)) {
                throw new TypeError('Must use a Feed as parameter')
            }

            this.getByUrl(feed.url).catch((error) => { reject(error) })

            const transaction = this.iDBHandler.db.transaction(['feeds'], 'readwrite')
            const feedStore = transaction.objectStore('feeds')
            const feedStoreRequest = feedStore.delete(feed.url)

            feedStoreRequest.onsuccess = () => { resolve(true) }
        })
    }

    #buildFeed (dbFeed) {
        const feed = new Feed(dbFeed.url, dbFeed.title, dbFeed.link, dbFeed.description)

        feed.language = dbFeed.language
        feed.copyright = dbFeed.copyright
        feed.managingEditor = dbFeed.managingEditor
        feed.webMaster = dbFeed.webMaster
        feed.pubDate = new Date(dbFeed.pubDate)
        feed.lastBuildDate = new Date(dbFeed.lastBuildDate)
        feed.categories = dbFeed.categories.map(category => new Category(category))
        feed.generator = dbFeed.generator
        feed.docs = dbFeed.docs
        feed.ttl = dbFeed.ttl
        feed.image = dbFeed.image

        return feed
    }

    #buildDBFeed (feed) {
        return {
            url: feed.url,
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
        }
    }
}

export default FeedRepository