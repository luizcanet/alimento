class FeedItem {
    #feedLink
    title
    link
    description
    author
    categories = []
    comments
    enclosure
    guid
    pubDate

    constructor (feedLink) {
        this.feedLink = feedLink
    }

    set feedLink(feedLink) {
        try {
            new URL(feedLink)
        } catch {
            throw new TypeError('Feed Link must be a valid URL')
        }

        this.#feedLink = feedLink
    }

    get feedLink() {
        return this.#feedLink
    }
}

export default FeedItem