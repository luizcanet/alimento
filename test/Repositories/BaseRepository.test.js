import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import IDBHandler from '../../src/IDBHandler.js'
import BaseRepository from '../../src/Repositories/BaseRepository.js'

var indexedDB = new IDBFactory()

describe('Base Repository', function () {

    before(async function () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('teste_db', 1)
    })

    it('Should not build throwing a Type Error when an IDBHandler is not used as parameter', function () {
        const testNewBaseRepository = () => { new BaseRepository() }

        expect(testNewBaseRepository).to.throw(TypeError, 'Must use an IDBHandler as parameter')
    })

    it('Should build a Feed Repository', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const feedRepository = new BaseRepository(iDBHandler)

        expect(feedRepository.iDBHandler).to.be.instanceOf(IDBHandler)
    })
})