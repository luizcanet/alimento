class Feed {
    #url
    #title
    #link
    #description
    language
    copyright
    managingEditor
    webMaster
    pubDate
    lastBuildDate
    categories = []
    generator
    docs
    ttl
    image

    constructor (url, title, link, description) {
        this.url = url
        this.title = title
        this.link = link
        this.description = description
    }

    set url(url) {
        this.#url = url
    }

    get url() {
        return this.#url
    }

    set title(title) {
        if (typeof title !== 'string') {
            throw new TypeError('Title must be a string')
        }

        this.#title = title
    }

    get title() {
        return this.#title
    }

    set link(link) {
        this.#link = link
    }

    get link() {
        return this.#link
    }

    set description(description) {
        if (typeof description !== 'string') {
            throw new TypeError('Description must be a string')
        }

        this.#description = description
    }

    get description() {
        return this.#description
    }
}

export default Feed
