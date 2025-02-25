import fs from 'node:fs/promises'
import fetchMock from 'fetch-mock'
import { XMLParser } from 'fast-xml-parser'
import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import IDBHandler from '../../src/IDBHandler.js'
import FeedRepository from '../../src/Repositories/FeedRepository.js'
import FeedService from '../../src/Services/FeedService.js'
import CategoryRepository from '../../src/Repositories/CategoryRepository.js'
import FeedItemRepository from '../../src/Repositories/FeedItemRepository.js'
import FeedItem from '../../src/Models/FeedItem.js'
import Feed from '../../src/Models/Feed.js'

var indexedDB = new IDBFactory()

// eslint-disable-next-line no-undef
global.XMLParser = XMLParser

fetchMock.mockGlobal()

describe('Feed Service', function () {

    before(async function () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('teste_db', 1)
    })

    it('Should not build throwing a Type Error when a Feed Repository is not used as parameter', function () {
        const testNewFeedService = () => { new FeedService() }

        expect(testNewFeedService).to.throw(TypeError, 'Must use a FeedRepository as parameter')
    })

    it('Should not build throwing a Type Error when a Category Repository is not used as parameter', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        const testNewFeedService = () => { new FeedService(feedRepository) }

        expect(testNewFeedService).to.throw(TypeError, 'Must use a CategoryRepository as parameter')
    })

    it('Should not build throwing a Type Error when a Feed Item Repository is not used as parameter', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)
        const categoryRepository = new CategoryRepository(iDBHandler)

        const testNewFeedService = () => { new FeedService(feedRepository, categoryRepository) }

        expect(testNewFeedService).to.throw(TypeError, 'Must use a FeedItemRepository as parameter')
    })

    it('Should build a Feed Service', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)
        const categoryRepository = new CategoryRepository(iDBHandler)
        const feedItemRepository = new FeedItemRepository(iDBHandler)
        const feedService = new FeedService(feedRepository, categoryRepository, feedItemRepository)

        expect(feedService).to.be.instanceOf(FeedService)
    })

    describe('Subscribe Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)
        const categoryRepository = new CategoryRepository(iDBHandler)
        const feedItemRepository = new FeedItemRepository(iDBHandler)
        const feedService = new FeedService(feedRepository, categoryRepository, feedItemRepository)

        it('Should return true', async function () {
            const url = 'https://cyber.harvard.edu/rss/examples/rss2sample.xml'
            const xml = await fs.readFile('test/rss2sample.xml', { encoding: 'utf8' })

            fetchMock.mockGlobal().get(
                'null/proxy?url=' + url,
                {
                    status: 200,
                    body: xml,
                    delay: 30,
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                }
            )
            
            const result = await feedService.subscribe(url)

            expect(result).to.be.true
        })

        it('Should return false', async function () {
            const url = 'https://cyber.harvard.edu/rss/examples/rss2sample.xml'
            const xml = await fs.readFile('test/rss2sample.xml', { encoding: 'utf8' })

            fetchMock.mockGlobal().get(
                'null/proxy?url=' + url,
                {
                    status: 200,
                    body: xml,
                    delay: 30,
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                }
            )
            
            const result = await feedService.subscribe(url)

            expect(result).to.be.false
        })

        it('Should return true with full sample', async function () {
            const url = 'https://cyber.harvard.edu/rss/examples/rss2full-sample.xml'
            const xml = await fs.readFile('test/rss2full-sample.xml', { encoding: 'utf8' })

            fetchMock.mockGlobal().get(
                'null/proxy?url=' + url,
                {
                    status: 200,
                    body: xml,
                    delay: 30,
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                }
            )
            
            const result = await feedService.subscribe(url)

            expect(result).to.be.true
        })
    })

    describe('Update Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)
        const categoryRepository = new CategoryRepository(iDBHandler)
        const feedItemRepository = new FeedItemRepository(iDBHandler)
        const feedService = new FeedService(feedRepository, categoryRepository, feedItemRepository)

        it('Should return true', async function () {
            const url = 'https://cyber.harvard.edu/rss/examples/rss2sample.xml'
            const xml = await fs.readFile('test/rss2sample.xml', { encoding: 'utf8' })

            fetchMock.mockGlobal().get(
                'null/proxy?url=' + url,
                {
                    status: 200,
                    body: xml,
                    delay: 30,
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                }
            )
            
            const result = await feedService.update(url)

            expect(result).to.be.true
        })

        it('Should return true again', async function () {
            const url = 'https://cyber.harvard.edu/rss/examples/rss2sample.xml'
            const xml = await fs.readFile('test/rss2sample.xml', { encoding: 'utf8' })

            fetchMock.mockGlobal().get(
                'null/proxy?url=' + url,
                {
                    status: 200,
                    body: xml,
                    delay: 30,
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                }
            )
            
            const result = await feedService.update(url)

            expect(result).to.be.true
        })
    })

    describe('Get Feed Items Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)
        const categoryRepository = new CategoryRepository(iDBHandler)
        const feedItemRepository = new FeedItemRepository(iDBHandler)
        const feedService = new FeedService(feedRepository, categoryRepository, feedItemRepository)

        it('Should return a Feed Items List', async function () {
            const feedItemsList = await feedService.getFeedItems()

            expect(feedItemsList[0]).to.be.instanceOf(FeedItem)
            expect(feedItemsList.length).to.be.greaterThanOrEqual(1)
        })
    })

    describe('Update All Feeds Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)
        const categoryRepository = new CategoryRepository(iDBHandler)
        const feedItemRepository = new FeedItemRepository(iDBHandler)
        const feedService = new FeedService(feedRepository, categoryRepository, feedItemRepository)

        it('Should return true', async function () {
            const url = 'https://cyber.harvard.edu/rss/examples/rss2sample.xml'
            const xml = await fs.readFile('test/rss2sample.xml', { encoding: 'utf8' })

            fetchMock.mockGlobal().get(
                'null/proxy?url=' + url,
                {
                    status: 200,
                    body: xml,
                    delay: 30,
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                }
            )
            
            const result = await feedService.updateAll()

            expect(result).to.be.true
        })
    })

    describe('Unsubscribe Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)
        const categoryRepository = new CategoryRepository(iDBHandler)
        const feedItemRepository = new FeedItemRepository(iDBHandler)
        const feedService = new FeedService(feedRepository, categoryRepository, feedItemRepository)

        it('Should return true', async function () {
            const feed = new Feed('https://cyber.harvard.edu/rss/examples/rss2sample.xml', 'Feed to Subscribe', 'https://feed/link', 'Feed Description')
            
            const result = await feedService.unsubscribe(feed)

            expect(result).to.be.true
        })
    })
})