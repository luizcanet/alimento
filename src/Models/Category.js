class Category {
    name

    constructor (name) {
        this.#name = name
    }

    set #name (name) {
        if (typeof name !== 'string') {
            throw new TypeError('Name must be a string')
        }

        this.name = name
    }
}

export default Category