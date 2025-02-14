class FeedItem {
    #feedUrl
    title
    link
    description
    author
    categories = []
    comments
    enclosure
    guid
    pubDate
    new = true

    constructor (feedUrl) {
        this.feedUrl = feedUrl
    }

    set feedUrl(feedUrl) {
        try {
            new URL(feedUrl)
        } catch {
            throw new TypeError('Feed URL must be a valid URL')
        }

        this.#feedUrl = feedUrl
    }

    get feedUrl() {
        return this.#feedUrl
    }
}

export default FeedItem