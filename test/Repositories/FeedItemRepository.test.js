import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import IDBHandler from 'alimento/IDBHandler.js'
import FeedRepository from 'alimento/Repositories/FeedRepository.js'
import FeedItem from 'alimento/Models/FeedItem.js'
import FeedItemRepository from 'alimento/Repositories/FeedItemRepository.js'
import Feed from 'alimento/Models/Feed.js'

var indexedDB = new IDBFactory()

describe('Feed Item Repository', function () {

    before(async function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        await iDBHandler.init('teste_db', 1)
        feedRepository.add(new Feed('https://test/items/url', 'Test Feed Item Repository', 'https://test/items/url', 'Test Feed Item Repository Description'))
    })

    describe('Add Feed Item Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedItemRepository = new FeedItemRepository(iDBHandler)

        it('Should throw a Type Error when the feed item parameter is not a Feed Item', async function () {
            try {
                await feedItemRepository.add()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Feed Item as parameter')
            }
        })

        it('Should return true when adding a new Feed Item', async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.title = 'Test Feed Item Title'

            const result = await feedItemRepository.add(feedItem)

            expect(result).to.be.true
        })
    })

    describe('Get All Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedItemRepository = new FeedItemRepository(iDBHandler)

        it('Should get the complete list of Feed Items', async function () {
            const results = await feedItemRepository.getAll()

            expect(results[0]).to.be.instanceOf(FeedItem)
            expect(results.length).to.be.greaterThanOrEqual(1)
        })
    })

    describe('Get All By Feed URL Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedItemRepository = new FeedItemRepository(iDBHandler)

        it('Should get the complete list of Feed Items by Feed', async function () {
            const results = await feedItemRepository.getAllByFeedUrl('https://test/items/url')

            expect(results[0]).to.be.instanceOf(FeedItem)
            expect(results.length).to.be.greaterThanOrEqual(1)
        })
    })

    describe('Get By Feed Item Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedItemRepository = new FeedItemRepository(iDBHandler)

        before(async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.description = 'Test Feed Item Description'

            await feedItemRepository.add(feedItem)
        })

        it('Should throw a Type Error when the feed item parameter is not a Feed Item', async function () {
            try {
                await feedItemRepository.getByFeedItem()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Feed Item as parameter')
            }
        })

        it('Should throw a Not Found Error with a Feed Link that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')

            try {
                await feedItemRepository.getByFeedItem(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should throw a Not Found Error with a Title that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')
            feedItem.title = 'Test Feed Item Title Not Found'

            try {
                await feedItemRepository.getByFeedItem(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should throw a Not Found Error with a Description that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')
            feedItem.description = 'Test Feed Item Description Not Found'

            try {
                await feedItemRepository.getByFeedItem(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should get a Feed Item By Feed Item Title', async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.title = 'Test Feed Item Title'

            const result = await feedItemRepository.getByFeedItem(feedItem)

            expect(result).to.be.instanceOf(FeedItem)
            expect(result.feedUrl).to.be.equal('https://test/items/url')
            expect(result.title).to.be.equal('Test Feed Item Title')
        })

        it('Should get a Feed Item By Feed Item Description', async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.description = 'Test Feed Item Description'

            const result = await feedItemRepository.getByFeedItem(feedItem)

            expect(result).to.be.instanceOf(FeedItem)
            expect(result.feedUrl).to.be.equal('https://test/items/url')
            expect(result.description).to.be.equal('Test Feed Item Description')
        })
    })

    describe('Update Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedItemRepository = new FeedItemRepository(iDBHandler)

        it('Should throw a Type Error when the feed item parameter is not a Feed Item', async function () {
            try {
                await feedItemRepository.update()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Feed Item as parameter')
            }
        })

        it('Should throw a Not Found Error with a Feed Link that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')

            try {
                await feedItemRepository.update(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should throw a Not Found Error with a Title that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')
            feedItem.title = 'Test Feed Item Title Not Found'

            try {
                await feedItemRepository.update(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should throw a Not Found Error with a Description that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')
            feedItem.description = 'Test Feed Item Description Not Found'

            try {
                await feedItemRepository.update(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Item Updated using Title', async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.title = 'Test Feed Item Title'
            feedItem.author = 'Test Author'

            const result = await feedItemRepository.update(feedItem)
            const feedItemUpdated = await feedItemRepository.getByFeedItem(feedItem)

            expect(result).to.be.true
            expect(feedItemUpdated.title).to.be.equal('Test Feed Item Title')
            expect(feedItemUpdated.feedUrl).to.be.equal('https://test/items/url')
            expect(feedItemUpdated.author).to.be.equal('Test Author')
        })

        it('Should return true e get Feed Item Updated using Description', async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.description = 'Test Feed Item Description'
            feedItem.title = 'Test Title Updated'

            const result = await feedItemRepository.update(feedItem)
            const feedItemUpdated = await feedItemRepository.getByFeedItem(feedItem)

            expect(result).to.be.true
            expect(feedItemUpdated.description).to.be.equal('Test Feed Item Description')
            expect(feedItemUpdated.feedUrl).to.be.equal('https://test/items/url')
            expect(feedItemUpdated.title).to.be.equal('Test Title Updated')
        })
    })

    describe('Remove Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedItemRepository = new FeedItemRepository(iDBHandler)

        it('Should throw a Type Error when the feed item parameter is not a Feed Item', async function () {
            try {
                await feedItemRepository.remove()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Feed Item as parameter')
            }
        })

        it('Should throw a Not Found Error with a Feed Link that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')

            try {
                await feedItemRepository.remove(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should throw a Not Found Error with a Title that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')
            feedItem.title = 'Test Feed Item Title Not Found'

            try {
                await feedItemRepository.remove(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should throw a Not Found Error with a Description that don\'t exists in Indexed DB', async function () {
            const feedItem = new FeedItem('https://test/url/not-found')
            feedItem.description = 'Test Feed Item Description Not Found'

            try {
                await feedItemRepository.remove(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Item Not Found using Title', async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.title = 'Test Feed Item Title'

            const result = await feedItemRepository.remove(feedItem)
            expect(result).to.be.true

            try {
                await feedItemRepository.getByFeedItem(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Item Not Found using Description', async function () {
            const feedItem = new FeedItem('https://test/items/url')
            feedItem.description = 'Test Feed Item Description'

            const result = await feedItemRepository.remove(feedItem)
            expect(result).to.be.true

            try {
                await feedItemRepository.getByFeedItem(feedItem)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })
    })
})