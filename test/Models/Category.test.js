import { expect } from 'chai';
import Category from '../../src/Models/Category.js'

describe('Category Model', function () {
    it('Should throw a TypeError when the name parameter is not a string', function () {
        let category = () => { new Category() }

        expect(category).to.throw(TypeError, 'Name must be a string')
    })

    it('Should construct a Category', function () {
        let category = new Category('Test Name')

        expect(category).to.be.an.instanceOf(Category)
        expect(category.name).to.be.equal('Test Name')
    })
})