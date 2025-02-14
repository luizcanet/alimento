import Category from 'alimento/Models/Category.js';
import FeedItem from 'alimento/Models/FeedItem.js';
import BaseRepository from 'alimento/Repositories/BaseRepository.js'

class FeedItemRepository extends BaseRepository {
    add (feedItem) {
        return new Promise((resolve) => {
            if (!(feedItem instanceof FeedItem)) {
                throw new TypeError('Must use a Feed Item as parameter')
            }

            const transaction = this.iDBHandler.db.transaction(['feedItems'], 'readwrite')
            const feedItemStore = transaction.objectStore('feedItems')
            const feedItemStoreRequest = feedItemStore.add(this.#buildDBFeedItem(feedItem))

            feedItemStoreRequest.onsuccess = () => { resolve(true) }
        })
    }

    getAllByFeedUrl (feedUrl) {
        return new Promise((resolve) => {
            const transaction = this.iDBHandler.db.transaction(['feedItems'], 'readonly')
            const feedItemStore = transaction.objectStore('feedItems')
            const feedItemStoreRequest = feedItemStore.getAll()

            feedItemStoreRequest.onsuccess = (event) => { 
                resolve(
                    event.target.result
                    .filter(dbFeedItem => dbFeedItem.feedUrl === feedUrl)
                    .map(dbFeedItem => this.#buildFeedItem(dbFeedItem))
                )
             }
        })
    }

    getByFeedItem (feedItem) {
        return new Promise((resolve, reject) => {
            if (!(feedItem instanceof FeedItem)) {
                throw new TypeError('Must use a Feed Item as parameter')
            }

            const transaction = this.iDBHandler.db.transaction(['feedItems'], 'readonly')
            const feedItemStore = transaction.objectStore('feedItems');
            const feedItemStoreRequest = feedItemStore.getAll()

            feedItemStoreRequest.onsuccess = (event) => { 
                const result = event.target.result
                    .filter(dbFeedItem => {
                        return dbFeedItem.feedLink === feedItem.feedLink && (
                            dbFeedItem.title === feedItem.title ||
                            dbFeedItem.description === feedItem.description
                        )
                    })

                if (result.length === 0) {
                    reject(new Error('NotFoundError'))
                } else {
                    resolve(this.#buildFeedItem(result[0]))
                }
            }
        })
    }

    update (feedItem) {
        return new Promise((resolve, reject) => {
            if (!(feedItem instanceof FeedItem)) {
                throw new TypeError('Must use a Feed Item as parameter')
            }

            const transaction = this.iDBHandler.db.transaction(['feedItems'], 'readwrite')
            const feedItemStore = transaction.objectStore('feedItems')
            const feedItemStoreGetAllKeysRequest = feedItemStore.getAllKeys()
            
            feedItemStoreGetAllKeysRequest.onsuccess = (event) => { 
                const keys = event.target.result
                const feedItemStoreGetAllRequest = feedItemStore.getAll()

                feedItemStoreGetAllRequest.onsuccess = (event) => {
                    const dbFeedItems = event.target.result
                    const result = keys.map((value, index) => {
                        return {
                            key: value,
                            dbFeedItem: dbFeedItems[index]
                        }
                    })
                    .filter(value => {
                        return value.dbFeedItem.feedUrl === feedItem.feedUrl && (
                            value.dbFeedItem.title === feedItem.title ||
                            value.dbFeedItem.description === feedItem.description
                        )
                    })

                    if (result.length === 0) {
                        reject(new Error('NotFoundError'))
                    } else {
                        const dbFeedItem = result[0].dbFeedItem
                        
                        dbFeedItem.feedUrl = feedItem.feedUrl
                        dbFeedItem.title = feedItem.title
                        dbFeedItem.link = feedItem.link
                        dbFeedItem.description = feedItem.description
                        dbFeedItem.author = feedItem.author
                        dbFeedItem.categories = feedItem.categories.map(category => category.name)
                        dbFeedItem.comments = feedItem.comments
                        dbFeedItem.enclosure = feedItem.enclosure
                        dbFeedItem.guid = feedItem.guid
                        dbFeedItem.pubDate = feedItem.pubDate
                        
                        const feedItemStorePutRequest = feedItemStore.put(dbFeedItem, result[0].key)
    
                        feedItemStorePutRequest.onsuccess = () => { resolve(true) }
                    }
                }
            }
        })
    }

    remove (feedItem) {
        return new Promise((resolve, reject) => {
            if (!(feedItem instanceof FeedItem)) {
                throw new TypeError('Must use a Feed Item as parameter')
            }

            const transaction = this.iDBHandler.db.transaction(['feedItems'], 'readwrite')
            const feedItemStore = transaction.objectStore('feedItems')
            const feedItemStoreGetAllKeysRequest = feedItemStore.getAllKeys()
            
            feedItemStoreGetAllKeysRequest.onsuccess = (event) => { 
                const keys = event.target.result
                const feedItemStoreGetAllRequest = feedItemStore.getAll()

                feedItemStoreGetAllRequest.onsuccess = (event) => {
                    const dbFeedItems = event.target.result
                    const result = keys.map((value, index) => {
                        return {
                            key: value,
                            dbFeedItem: dbFeedItems[index]
                        }
                    })
                    .filter(value => {
                        return value.dbFeedItem.feedUrl === feedItem.feedUrl && (
                            value.dbFeedItem.title === feedItem.title ||
                            value.dbFeedItem.description === feedItem.description
                        )
                    })

                    if (result.length === 0) {
                        reject(new Error('NotFoundError'))
                    } else {
                        const feedItemStorePutRequest = feedItemStore.delete(result[0].key)
    
                        feedItemStorePutRequest.onsuccess = () => { resolve(true) }
                    }
                }
            }
        })
    }

    #buildFeedItem (dbFeedItem) {
        const feedItem = new FeedItem(dbFeedItem.feedUrl)

        feedItem.title = dbFeedItem.title
        feedItem.link = dbFeedItem.link
        feedItem.description = dbFeedItem.description
        feedItem.author = dbFeedItem.author
        feedItem.categories = dbFeedItem.categories.map(category => new Category(category.name))
        feedItem.comments = dbFeedItem.comments
        feedItem.enclosure = dbFeedItem.enclosure
        feedItem.guid = dbFeedItem.guid
        feedItem.pubDate = new Date(dbFeedItem.pubDate)
        feedItem.new = dbFeedItem.new

        return feedItem
    }

    #buildDBFeedItem (feedItem) {
        return {
            feedUrl: feedItem.feedUrl,
            title: feedItem.title,
            link: feedItem.link,
            description: feedItem.description,
            author: feedItem.author,
            categories: feedItem.categories.map(category => category.name),
            comments: feedItem.comments,
            enclosure: feedItem.enclosure,
            guid: feedItem.guid,
            pubDate: feedItem.pubDate,
            new: feedItem.new
        }
    }
}

export default FeedItemRepository
