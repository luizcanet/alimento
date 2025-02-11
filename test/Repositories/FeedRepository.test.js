import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import IDBHandler from 'alimento/IDBHandler'
import Feed from 'alimento/Models/Feed'
import FeedRepository from 'alimento/Repositories/FeedRepository'

var indexedDB = new IDBFactory()

describe('Feed Repository', function () {

    before(async function () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('teste_db', 1)
    })

    describe('Add Feed Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        it('Should throw a Type Error when the feed parameter is not a Feed', async function () {
            try {
                await feedRepository.add()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Feed as parameter')
            }
        })

        it('Should return true when adding a new Feed', async function () {
            const feed = new Feed('https://test/url', 'Test Title', 'https://test/url', 'Test Description')

            const result = await feedRepository.add(feed)

            expect(result).to.be.true
        })

        it('Should throw a Constraint Error when trying to add another Feed with the same link', async function () {
            const feed = new Feed('https://test/url', 'Test Title', 'https://test/url', 'Test Description')

            try {
                await feedRepository.add(feed)
            } catch (error) {
                expect(error.message).to.be.equal('ConstraintError')
            }
        })
    })

    describe('Get By URL Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        it('Should throw a Type Error when the url parameter is not a valid URL', async function () {
            try {
                await feedRepository.getByUrl()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('URL must be a valid URL')
            }
        })

        it('Should throw a Not Found Error with a Feed link that don\'t exists in Indexed DB', async function () {
            try {
                await feedRepository.getByUrl('https://test/url/not-found')
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should get a Feed By Link', async function () {
            const result = await feedRepository.getByUrl('https://test/url')

            expect(result).to.be.instanceOf(Feed)
            expect(result.url).to.be.equal('https://test/url')
            expect(result.title).to.be.equal('Test Title')
            expect(result.link).to.be.equal('https://test/url')
            expect(result.description).to.be.equal('Test Description')
        })
    })

    describe('Get All Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        it('Should get the complete list of Feeds', async function () {
            const results = await feedRepository.getAll()

            expect(results[0]).to.be.instanceOf(Feed)
            expect(results.length).to.greaterThanOrEqual(1)
        })
    })

    describe('Update Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        it('Should throw a Type Error when the feed parameter is not a Feed', async function () {
            try {
                await feedRepository.update()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Feed as parameter')
            }
        })

        it('Should throw a Not Found Error with a Feed link that don\'t exists in Indexed DB', async function () {
            const feed = new Feed('https://test/url/not-found', 'Test Title', 'https://test/url/not-found', 'Test Description')

            try {
                await feedRepository.update(feed)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Updated', async function () {
            const feed = new Feed('https://test/url', 'Test Title Update', 'https://test/url', 'Test Description')

            const result = await feedRepository.update(feed)
            const feedUpdated = await feedRepository.getByUrl(feed.url)

            expect(result).to.be.true
            expect(feedUpdated.url).to.be.equal('https://test/url')
            expect(feedUpdated.title).to.be.equal('Test Title Update')
            expect(feedUpdated.link).to.be.equal('https://test/url')
            expect(feedUpdated.description).to.be.equal('Test Description')
        })
    })

    describe('Remove Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        it('Should throw a Type Error when the feed parameter is not a Feed', async function () {
            try {
                await feedRepository.remove()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Feed as parameter')
            }
        })

        it('Should throw a Not Found Error with a Feed link that don\'t exists in Indexed DB', async function () {
            const feed = new Feed('https://test/url/not-found', 'Test Title', 'https://test/url/not-found', 'Test Description')

            try {
                await feedRepository.remove(feed)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Not Found', async function () {
            const feed = new Feed('https://test/url', 'Test Title Update', 'https://test/url', 'Test Description')

            const result = await feedRepository.remove(feed)
            expect(result).to.be.true
            
            try {
                await feedRepository.getByUrl('https://test/url')
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })
    })
})