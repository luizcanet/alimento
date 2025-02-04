import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import IDBHandler from '../../src/IDBHandler.js'
import Feed from '../../src/Models/Feed.js'
import FeedRepository from '../../src/Repositories/FeedRepository.js'

var indexedDB = new IDBFactory()

describe('Feed Repository', function () {

    before(async function () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('teste_db', 1)
    })

    it('Should not build throwing a Type Error when an IDBHandler is not used as parameter', function () {
        const testNewFeedRepository = () => { new FeedRepository() }

        expect(testNewFeedRepository).to.throw(TypeError, 'Must use an IDBHandler as parameter')
    })

    it('Shoul build a Feed Repository', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        expect(feedRepository.iDBHandler).to.be.instanceOf(IDBHandler)
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
            const feed = new Feed('Test Title', 'https://test/url', 'Test Description')

            const result = await feedRepository.add(feed)

            expect(result).to.be.true
        })

        it('Should throw a Constraint Error when trying to add another Feed with the same link', async function () {
            const feed = new Feed('Test Title', 'https://test/url', 'Test Description')

            try {
                await feedRepository.add(feed)
            } catch (error) {
                expect(error.message).to.be.equal('ConstraintError')
            }
        })
    })

    describe('Get By Link Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        it('Should throw a Type Error when the feed link parameter is not a string', async function () {
            try {
                await feedRepository.getByLink()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Feed link must be a string')
            }
        })

        it('Should throw a Not Found Error with a Feed link that don\'t exists in Indexed DB', async function () {
            try {
                await feedRepository.getByLink('https://test/url/not-found')
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should get a Feed By Link', async function () {
            const result = await feedRepository.getByLink('https://test/url')

            expect(result).to.be.instanceOf(Feed)
            expect(result.title).to.be.equal('Test Title')
            expect(result.link).to.be.equal('https://test/url')
            expect(result.description).to.be.equal('Test Description')
        })
    })

    describe('Get All Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new FeedRepository(iDBHandler)

        it('Shoul get the complete list of Feeds', async function () {
            const results = await feedRepository.getAll()

            expect(results[0]).to.be.instanceOf(Feed)
            expect(results).to.have.lengthOf(1)
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
            const feed = new Feed('Test Title', 'https://test/url/not-found', 'Test Description')

            try {
                await feedRepository.update(feed)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Updated', async function () {
            const feed = new Feed('Test Title Update', 'https://test/url', 'Test Description')

            const result = await feedRepository.update(feed)
            const feedUpdated = await feedRepository.getByLink(feed.link)

            expect(result).to.be.true
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
            const feed = new Feed('Test Title', 'https://test/url/not-found', 'Test Description')

            try {
                await feedRepository.remove(feed)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Not Found', async function () {
            const feed = new Feed('Test Title Update', 'https://test/url', 'Test Description')

            const result = await feedRepository.remove(feed)
            expect(result).to.be.true
            
            try {
                await feedRepository.getByLink('https://test/url')
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })
    })
})