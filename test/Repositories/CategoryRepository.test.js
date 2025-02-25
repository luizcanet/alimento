import { expect } from 'chai'
import { IDBFactory } from 'fake-indexeddb'
import IDBHandler from '../../src/IDBHandler.js'
import Category from '../../src/Models/Category.js'
import CategoryRepository from '../../src/Repositories/CategoryRepository.js'

var indexedDB = new IDBFactory()

describe('Category Repository', function () {

    before(async function () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('teste_db', 1)
    })

    describe('Add Category Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const categoryRepository = new CategoryRepository(iDBHandler)

        it('Should throw a Type Error when the category parameter is not a Category', async function () {
            try {
                await categoryRepository.add()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Category as parameter')
            }
        })

        it('Should return true when adding a new Category', async function () {
            const category = new Category('Test Category Name')

            const result = await categoryRepository.add(category)

            expect(result).to.be.true
        })

        it('Should throw a Constraint Error when trying to add another Category with the same name', async function () {
            const category = new Category('Test Category Name')

            try {
                await categoryRepository.add(category)
            } catch (error) {
                expect(error.message).to.be.equal('ConstraintError')
            }
        })
    })

    describe('Get By Name Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const categoryRepository = new CategoryRepository(iDBHandler)

        it('Should throw a Type Error when the category name parameter is not a string', async function () {
            try {
                await categoryRepository.getByName()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Category Name must be a string')
            }
        })

        it('Should throw a Not Found Error with a Category name that don\'t exists in Indexed DB', async function () {
            try {
                await categoryRepository.getByName('Category Not Found')
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should get a Category By Name', async function () {
            const result = await categoryRepository.getByName('Test Category Name')

            expect(result).to.be.instanceOf(Category)
            expect(result.name).to.be.equal('Test Category Name')
        })
    })

    describe('Get All Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const categoryRepository = new CategoryRepository(iDBHandler)

        it('Should get the complete list of Feeds', async function () {
            const results = await categoryRepository.getAll()

            expect(results[0]).to.be.instanceOf(Category)
            expect(results.length).to.greaterThanOrEqual(1)
        })
    })

    describe('Remove Method', function () {
        const iDBHandler =  new IDBHandler(indexedDB)
        const categoryRepository = new CategoryRepository(iDBHandler)

        it('Should throw a Type Error when the category parameter is not a Category', async function () {
            try {
                await categoryRepository.remove()
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.be.equal('Must use a Category as parameter')
            }
        })

        it('Should throw a Not Found Error with a category that don\'t exists in Indexed DB', async function () {
            const category = new Category('Category Not Found')

            try {
                await categoryRepository.remove(category)
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })

        it('Should return true e get Feed Not Found', async function () {
            const category = new Category('Test Category Name')

            const result = await categoryRepository.remove(category)
            expect(result).to.be.true
            
            try {
                await categoryRepository.getByName('Test Category Name')
            } catch (error) {
                expect(error.message).to.be.equal('NotFoundError')
            }
        })
    })
})