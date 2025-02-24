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
    source
    new = true

    constructor (feedUrl) {
        this.feedUrl = feedUrl
    }

    set feedUrl(feedUrl) {
        this.#feedUrl = feedUrl
    }

    get feedUrl() {
        return this.#feedUrl
    }
}

export default FeedItem