/* eslint-disable no-undef */
import Category from '../Models/Category.js'
import Feed from '../Models/Feed.js'
import FeedItem from '../Models/FeedItem.js'

class FeedParseService {
    static parseFeed (xml, url) {
        const parser = new XMLParser({
            attributeNamePrefix : "@_",
            alwaysCreateTextNode: true
        })
        const doc = parser.parse(xml)
        const feed = new Feed(
            url,
            doc.rss.channel.title['#text'],
            doc.rss.channel.link['#text'],
            doc.rss.channel.description['#text']
        )

        feed.language = doc.rss.channel.language ? doc.rss.channel.language['#text'] : undefined
        feed.copyright = doc.rss.channel.copyright ? doc.rss.channel.copyright['#text'] : undefined
        feed.managingEditor = doc.rss.channel.managingEditor ? doc.rss.channel.managingEditor['#text'] : undefined
        feed.webMaster = doc.rss.channel.webMaster ? doc.rss.channel.webMaster['#text'] : undefined
        feed.pubDate = doc.rss.channel.pubDate ? Date.parse(doc.rss.channel.pubDate['#text']) : undefined
        feed.lastBuildDate = doc.rss.channel.lastBuildDate ? Date.parse(doc.rss.channel.lastBuildDate['#text']) : undefined
        feed.generator = doc.rss.channel.generator ? doc.rss.channel.generator['#text'] : undefined
        feed.docs = doc.rss.channel.docs ? doc.rss.channel.docs['#text'] : undefined
        feed.ttl = doc.rss.channel.ttl ? Number(doc.rss.channel.ttl['#text']) : undefined

        if (Array.isArray(doc.rss.channel.category)) {
            doc.rss.channel.category.forEach(feedCategory => {
                const category = new Category(feedCategory['#text'])

                category.domain = feedCategory['@_domain']

                feed.categories.push(category)
            })
        }

        if (doc.rss.channel.image && doc.rss.channel.image.url) {
            feed.image = {
                url: doc.rss.channel.image.url ? doc.rss.channel.image.url['#text'] : undefined,
                title: doc.rss.channel.image.title ? doc.rss.channel.image.title['#text'] : undefined,
                link: doc.rss.channel.image.link ? doc.rss.channel.image.link['#text'] : undefined,
                width: doc.rss.channel.image.width ? doc.rss.channel.image.width['#text'] : undefined,
                height: doc.rss.channel.image.height ? doc.rss.channel.image.height['#text'] : undefined,
                description: doc.rss.channel.image.description ? doc.rss.channel.image.description['#text'] : undefined
            }
        }

        return feed
    }

    static parseFeedItems (xml, url) {
        const feedItems = []
        const parser = new XMLParser({
            attributeNamePrefix : "@_",
            alwaysCreateTextNode: true
        })
        const doc = parser.parse(xml)

        if (Array.isArray(doc.rss.channel.item)) {
            doc.rss.channel.item.forEach(item => {
                const feedItem = new FeedItem(url)
    
                feedItem.title = item.title ? item.title['#text'] : undefined
                feedItem.link = item.link ? item.link['#text'] : undefined
                feedItem.description = item.description ? item.description['#text'] : undefined
                feedItem.author = item.author ? item.author['#text'] : undefined
                feedItem.comments = item.comments ? item.comments['#text'] : undefined
                feedItem.guid = item.guid ? item.guid['#text'] : undefined
                feedItem.pubDate = item.pubDate ? Date.parse(item.pubDate['#text']) : undefined
                
                if (Array.isArray(item.category)) {
                    item.category.forEach(itemCategory => {
                        const category = new Category(itemCategory['#text'])
        
                        category.domain = itemCategory['@_domain']
        
                        feedItem.categories.push(category)
                    })
                }
                
                if (item.enclosure) {
                    feedItem.enclosure = {
                        url: item.enclosure['@_url'] ?? undefined,
                        length: item.enclosure['@_length'] ?? undefined,
                        type: item.enclosure['@_type'] ?? undefined
                    }
                }
                
                if (item.source) {
                    feedItem.source = {
                        url: item.source['@_url'] ?? undefined,
                        title: item.source['#text']
                    }
                }
    
                feedItems.push(feedItem)
            })
        }

        return feedItems
    }
}

export default FeedParseService