import BaseRepository from 'alimento/Repositories/BaseRepository'
import Category from 'alimento/Models/Category'

class CategoryRepository extends BaseRepository {
    add (category) {
        return new Promise((resolve, reject) => {
            if (!(category instanceof Category)) {
                throw new TypeError('Must use a Category as parameter')
            }

            const transaction = this.iDBHandler.db.transaction(['categories'], 'readwrite')
            const categoryStore = transaction.objectStore('categories')
            const categoryStoreRequest = categoryStore.add(this.#buildDBCategory(category))

            categoryStoreRequest.onsuccess = () => { resolve(true) }
            categoryStoreRequest.onerror = (event) => {
                reject(new Error(event.target.error.name))
            }
        })
    }

    getByName (name) {
        return new Promise((resolve, reject) => {
            if (typeof name !== 'string') {
                throw new TypeError('Category Name must be a string')
            }

            const transaction = this.iDBHandler.db.transaction(['categories'], 'readonly')
            const categoryStore = transaction.objectStore('categories');
            const categoryStoreRequest = categoryStore.get(name)

            categoryStoreRequest.onsuccess = (event) => { 
                if (!event.target.result) {
                    reject(new Error('NotFoundError'))
                } else {
                    resolve(this.#buildCategory(event.target.result))
                }
             }
        })
    }

    getAll () {
        return new Promise((resolve) => {
            const transaction = this.iDBHandler.db.transaction(['categories'], 'readonly')
            const categoryStore = transaction.objectStore('categories')
            const categoryStoreRequest = categoryStore.getAll()

            categoryStoreRequest.onsuccess = (event) => { 
                resolve(event.target.result.map(dbCategory => this.#buildCategory(dbCategory)))
             }
        })
    }

    remove (category) {
        return new Promise((resolve, reject) => {
            if (!(category instanceof Category)) {
                throw new TypeError('Must use a Category as parameter')
            }

            this.getByName(category.name).catch((error) => { reject(error) })

            const transaction = this.iDBHandler.db.transaction(['categories'], 'readwrite')
            const categoryStore = transaction.objectStore('categories')
            const categoryStoreRequest = categoryStore.delete(category.name)

            categoryStoreRequest.onsuccess = () => { resolve(true) }
        })
    }

    #buildCategory (dbCategory) {
        return new Category(dbCategory.name)
    }

    #buildDBCategory (category) {
        return {
            name: category.name
        }
    }
}

export default CategoryRepository