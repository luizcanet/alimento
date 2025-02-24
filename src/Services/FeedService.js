import FeedRepository from 'alimento/Repositories/FeedRepository.js'
import CategoryRepository from 'alimento/Repositories/CategoryRepository.js'
import FeedItemRepository from 'alimento/Repositories/FeedItemRepository.js'
import FeedParseService from 'alimento/Services/FeedParseService.js'

class FeedService {
    #repository
    #categoryRepository
    #feedItemRepository

    constructor (feedRepository, categoryRepository, feedItemRepository) {
        if (!(feedRepository instanceof FeedRepository)) {
            throw new TypeError('Must use a FeedRepository as parameter')
        }

        if (!(categoryRepository instanceof CategoryRepository)) {
            throw new TypeError('Must use a CategoryRepository as parameter')
        }

        if (!(feedItemRepository instanceof FeedItemRepository)) {
            throw new TypeError('Must use a FeedItemRepository as parameter')
        }

        this.#repository = feedRepository
        this.#categoryRepository = categoryRepository
        this.#feedItemRepository = feedItemRepository
    }

    async subscribe (url) {
        try {
            new URL(url)
        } catch {
            throw new TypeError('URL must be a valid URL')
        }

        const response = await fetch('/proxy?url=' + url, { method: 'GET' })

        const feed = FeedParseService.parseFeed(await response.text(), url)

        feed.categories.forEach(async category => {
            try {
                await this.#categoryRepository.add(category)
            } catch {
                return
            }
        })

        try {
            return await this.#repository.add(feed)
        } catch {
            return false
        }
    }

    async unsubscribe (feed) {
        const feedItems = await this.#feedItemRepository.getAllByFeedUrl(feed.url)

        feedItems.forEach(async feedItem => {
            await this.#feedItemRepository.remove(feedItem)
        })

        await this.#repository.remove(feed)

        return true
    }

    async update (url) {
        try {
            new URL(url)
        } catch {
            throw new TypeError('URL must be a valid URL')
        }

        const response = await fetch('/proxy?url=' + url, { method: 'GET' })

        const feedItems = FeedParseService.parseFeedItems(await response.text(), url)

        feedItems.forEach(async feedItem => {
            feedItem.categories.forEach(async category => {
                try {
                    await this.#categoryRepository.add(category)
                } catch {
                    return
                }
            })

            try {
                await this.#feedItemRepository.update(feedItem)
            } catch {
                await this.#feedItemRepository.add(feedItem)
            }
        })

        return true
    }

    async getFeedItems () {
        const feedItems = await this.#feedItemRepository.getAll()

        feedItems.sort((a, b) => b.pubDate - a.pubDate)

        return feedItems
    }

    async updateAll () {
        const feeds = await this.#repository.getAll()

        feeds.forEach(async feed => {
            await this.update(feed.url)
        })

        return true
    }
}

export default FeedService