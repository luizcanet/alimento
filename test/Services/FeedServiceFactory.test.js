import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import FeedServiceFactory from '../../src/Services/FeedServiceFactory.js'
import FeedService from '../../src/Services/FeedService.js'

// eslint-disable-next-line no-undef
global.indexedDB = new IDBFactory()

describe('Feed Service Factory', function () {
    it('Should build a Feed Service', function () {
        const feedService = FeedServiceFactory.build()

        expect(feedService).to.be.instanceOf(FeedService)
    })
})