class Feed {
    title
    link
    description
    language
    copyright
    managingEditor
    webMaster
    pubDate
    lastBuildDate
    category = []
    generator
    docs
    ttl
    image

    constructor (title, link, description) {
        this.#feedTitle = title
        this.#feedLink = link
        this.#feedDescription = description
    }

    set #feedTitle(title) {
        if (typeof title !== 'string') {
            throw new TypeError('Title must be a string')
        }

        this.title = title
    }

    set #feedLink(link) {
        try {
            new URL(link)
        } catch (error) {
            throw new TypeError('Link must be a valid URL')
        }

        this.link = link
    }

    set #feedDescription(description) {
        if (typeof description !== 'string') {
            throw new TypeError('Description must be a string')
        }

        this.description = description
    }
}

export default Feed
