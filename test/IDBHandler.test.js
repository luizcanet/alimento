import 'fake-indexeddb/auto'
import { expect } from 'chai'
import { IDBFactory, IDBDatabase } from 'fake-indexeddb'
import IDBHandler from 'alimento/IDBHandler'

var indexedDB = new IDBFactory()

describe('IdexedDB Handler', function () {
    it('Should not be ready yet', function () {
        const dbHandler = new IDBHandler(indexedDB)

        expect(dbHandler.isReady).to.be.false
    })

    describe('Initialization Method', function () {
        it('Should throw a TypeError when the DB Name parameter is not a string', function () {
            const dbHandler = new IDBHandler(indexedDB)
            
            const initCall = () => { dbHandler.init() }
    
            expect(initCall).to.throw(TypeError, 'DB Name must be a string')
        })

        it('Should throw a TypeError when the version parameter is not a number', function () {
            const dbHandler = new IDBHandler(indexedDB)
            
            const initCall = () => { dbHandler.init('test_db') }
    
            expect(initCall).to.throw(TypeError, 'Version must be a number')
        })

        it('Should throw a TypeError when the version parameter is not greater than zero', async function () {
            const dbHandler = new IDBHandler(indexedDB)

            try {
                await dbHandler.init('test_db', -1)
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
            }
        })

        it('Should be ready', async function () {
            const dbHandler = new IDBHandler(indexedDB)

            await dbHandler.init('test_db', 1)

            expect(dbHandler.isReady).to.be.true
            expect(dbHandler.db).to.be.instanceOf(IDBDatabase)
        })
    })
})