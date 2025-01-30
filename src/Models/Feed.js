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
        this.#title = title
        this.#link = link
        this.#description = description
    }

    set #title(title) {
        if (typeof title !== 'string') {
            throw new TypeError('Title must be a string')
        }

        this.title = title
    }

    set #link(link) {
        try {
            new URL(link)
        } catch {
            throw new TypeError('Link must be a valid URL')
        }

        this.link = link
    }

    set #description(description) {
        if (typeof description !== 'string') {
            throw new TypeError('Description must be a string')
        }

        this.description = description
    }
}

export default Feed
