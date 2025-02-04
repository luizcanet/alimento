class IDBHandler {
    #ready = false
    #indexedDB
    #db

    constructor (indexedDB) {
        this.#indexedDB = indexedDB

        if (!IDBHandler.instance) {
            IDBHandler.instance = this
        }

        return IDBHandler.instance
    }

    get isReady () {
        return this.#ready
    }

    get db () {
        return this.#db
    }

    init (dbName, version) {
        if (typeof dbName !== 'string') {
            throw new TypeError('DB Name must be a string')
        }

        if (typeof version !== 'number') {
            throw new TypeError('Version must be a number')
        }

        return new Promise((resolve) => {
            const request = this.#indexedDB.open(dbName, version)

            request.onsuccess = (event) => {
                this.#db = event.target.result
                this.#ready = true

                resolve(this)
            }

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const feedStore = db.createObjectStore('feeds', { keyPath: 'link' })
                const categoryStore = db.createObjectStore('categories', { keyPath: 'name'} )
                
                db.createObjectStore('feedItems', { autoIncrement: true })
                feedStore.createIndex('link', 'link', { unique: true })
                categoryStore.createIndex('name', 'name', { unique: true })
            }
        })
    }
}

export default IDBHandler
