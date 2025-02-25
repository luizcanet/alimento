import IDBHandler from '../IDBHandler.js'

class BaseRepository {
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
}

export default BaseRepository
