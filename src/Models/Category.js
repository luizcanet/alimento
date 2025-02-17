class Category {
    #name
    domain

    constructor (name) {
        this.name = name
    }

    set name (name) {
        if (typeof name !== 'string') {
            throw new TypeError('Name must be a string')
        }

        this.#name = name
    }

    get name() {
        return this.#name
    }
}

export default Category