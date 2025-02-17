import Category from 'alimento/Models/Category.js'
import Feed from 'alimento/Models/Feed.js'
import FeedItem from 'alimento/Models/FeedItem.js'
import FeedRepository from 'alimento/Repositories/FeedRepository.js'
import CategoryRepository from 'alimento/Repositories/CategoryRepository.js'
import FeedItemRepository from 'alimento/Repositories/FeedItemRepository.js'

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

        const feed = this.#parseFeed(await response.text(), url)

        feed.categories.forEach(async category => {
            try {
                await this.#categoryRepository.add(category)
            } catch {
                console.info('Category already added.')
            }
        })

        try {
            return await this.#repository.add(feed)
        } catch {
            return false
        }
    }

    async update (url) {
        try {
            new URL(url)
        } catch {
            throw new TypeError('URL must be a valid URL')
        }

        const response = await fetch('/proxy?url=' + url, { method: 'GET' })

        const feedItems = this.#parseFeedItems(await response.text(), url)

        feedItems.forEach(async feedItem => {
            feedItem.categories.forEach(async category => {
                try {
                    await this.#categoryRepository.add(category)
                } catch {
                    console.info('Category already added: ' + category.name)
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

    #parseFeed (xml, url) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'application/xml')
        const feed = new Feed(
            url,
            doc.querySelector('channel > title').textContent,
            doc.querySelector('channel > link').textContent,
            doc.querySelector('channel > description').textContent
        )

        feed.language = doc.querySelector('channel > language') ? doc.querySelector('channel > language').textContent : undefined
        feed.copyright = doc.querySelector('channel > copyright') ? doc.querySelector('channel > copyright').textContent : undefined
        feed.managingEditor = doc.querySelector('channel > managingEditor') ? doc.querySelector('channel > managingEditor').textContent : undefined
        feed.webMaster = doc.querySelector('channel > webMaster') ? doc.querySelector('channel > webMaster').textContent : undefined
        feed.pubDate = doc.querySelector('channel > pubDate') ? Date(doc.querySelector('channel > pubDate').textContent) : undefined
        feed.lastBuildDate = doc.querySelector('channel > lastBuildDate') ? Date(doc.querySelector('channel > lastBuildDate').textContent) : undefined
        feed.generator = doc.querySelector('channel > generator') ? doc.querySelector('channel > generator').textContent : undefined
        feed.docs = doc.querySelector('channel > docs') ? doc.querySelector('channel > docs').textContent : undefined
        feed.ttl = doc.querySelector('channel > ttl') ? Number(doc.querySelector('channel > ttl').textContent) : undefined

        if (doc.querySelector('channel > category')) {
            doc.querySelectorAll('channel > category').forEach(element => {
                const category = new Category(element.textContent)

                category.domain = element.getAttribute('domain') ? element.getAttribute('domain') : undefined

                feed.categories.push(category)
            })
        }

        if (doc.querySelector('channel > image') && doc.querySelector('channel > image > url')) {
            feed.image = {
                url: doc.querySelector('channel > image > url').textContent,
                title: doc.querySelector('channel > image > title') ? doc.querySelector('channel > image > title').textContent : undefined,
                link: doc.querySelector('channel > image > link') ? doc.querySelector('channel > image > link').textContent : undefined,
                width: doc.querySelector('channel > image > width') ? Number(doc.querySelector('channel > image > width').textContent) : undefined,
                height: doc.querySelector('channel > image > height') ? Number(doc.querySelector('channel > image > height').textContent) : undefined,
                description: doc.querySelector('channel > image > description') ? doc.querySelector('channel > image > description').textContent : undefined
            }
        }

        return feed
    }

    #parseFeedItems (xml, url) {
        const feedItems = []
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'application/xml')

        doc.querySelectorAll('item').forEach(item => {
            const feedItem = new FeedItem(url)

            feedItem.title = item.querySelector('title') ? item.querySelector('title').textContent : undefined
            feedItem.link = item.querySelector('link') ? item.querySelector('link').textContent : undefined
            feedItem.description = item.querySelector('description') ? item.querySelector('description').textContent : undefined
            feedItem.author = item.querySelector('author') ? item.querySelector('author').textContent : undefined
            feedItem.comments = item.querySelector('comments') ? item.querySelector('comments').textContent : undefined
            feedItem.guid = item.querySelector('guid') ? item.querySelector('guid').textContent : undefined
            feedItem.pubDate = item.querySelector('pubDate') ? Date(item.querySelector('pubDate').textContent) : undefined
            
            if (item.querySelector('category')) {
                item.querySelectorAll('category').forEach(element => {
                    const category = new Category(element.textContent)
    
                    category.domain = element.getAttribute('domain') ? element.getAttribute('domain') : undefined
                    
                    feedItem.categories.push(category)
                })
            }
            
            if (item.querySelector('enclosure')) {
                feedItem.enclosure = {
                    url: item.querySelector('enclosure').getAttribute('url') ?? undefined,
                    length: item.querySelector('enclosure').getAttribute('length') ?? undefined,
                    type: item.querySelector('enclosure').getAttribute('type') ?? undefined
                }
            }
            
            if (item.querySelector('source')) {
                feedItem.source = {
                    url: item.querySelector('source').getAttribute('url') ?? undefined,
                    title: item.querySelector('source').textContent
                }
            }

            feedItems.push(feedItem)
        })

        return feedItems
    }
}

export default FeedService