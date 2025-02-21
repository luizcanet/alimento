class Filters {
    feed = ''

    constructor () {
        if (!Filters.instance) {
            Filters.instance = this
        }

        return Filters.instance
    }

    filterByFeed (feedItems) {
        if (typeof this.feed !== 'undefined' && this.feed.length > 0) {
            return feedItems.filter(feedItem => feedItem.feedUrl === this.feed)
        }

        return feedItems
    }
}

export default Filters