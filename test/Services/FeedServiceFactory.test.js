import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import FeedServiceFactory from 'alimento/Services/FeedServiceFactory.js'
import FeedService from 'alimento/Services/FeedService.js'

// eslint-disable-next-line no-undef
global.indexedDB = new IDBFactory()

describe('Feed Service Factory', function () {
    it('Should build a Feed Service', function () {
        const feedService = FeedServiceFactory.build()

        expect(feedService).to.be.instanceOf(FeedService)
    })
})