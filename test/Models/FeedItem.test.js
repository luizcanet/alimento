import { expect } from 'chai'
import FeedItem from 'alimento/Models/FeedItem.js'

describe('Feed Item Model', function () {
    it('Should throw a TypeError when the url parameter is not a URL', function () {
        const feed = () => { new FeedItem() }

        expect(feed).to.throw(TypeError, 'Feed URL must be a valid URL')
    })

    it('Should build a complete Feed Item', function () {
        const feedItem = new FeedItem('https://test/url')

        feedItem.title = 'Venice Film Festival Tries to Quit Sinking'
        feedItem.link = 'http://nytimes.com/2004/12/07FEST.html'
        feedItem.description = 'Some of the most heated chatter at the Venice Film Festival this week was about the way that the arrival of the stars at the Palazzo del Cinema was being staged.'
        feedItem.author = 'oprah@oxygen.net'
        feedItem.categories.push('Blog')
        feedItem.categories.push('Technology')
        feedItem.comments = 'http://www.myblog.org/cgi-local/mt/mt-comments.cgi?entry_id=290'
        feedItem.enclosure = {
            url: 'http://www.scripting.com/mp3s/weatherReportSuite.mp3',
            length: 12216320,
            type: 'audio/mpeg'
        }
        feedItem.guid = 'http://inessential.com/2002/09/01.php#a2'
        feedItem.pubDate = 'Sun, 19 May 2002 15:21:36 GMT'

        expect(feedItem).to.be.an.instanceOf(FeedItem)
        expect(feedItem.feedUrl).to.be.equal('https://test/url')
        expect(feedItem).to.be.eql({
            title: 'Venice Film Festival Tries to Quit Sinking',
            link: 'http://nytimes.com/2004/12/07FEST.html',
            description: 'Some of the most heated chatter at the Venice Film Festival this week was about the way that the arrival of the stars at the Palazzo del Cinema was being staged.',
            author: 'oprah@oxygen.net',
            categories: ['Blog', 'Technology'],
            comments: 'http://www.myblog.org/cgi-local/mt/mt-comments.cgi?entry_id=290',
            enclosure: {
                url: 'http://www.scripting.com/mp3s/weatherReportSuite.mp3',
                length: 12216320,
                type: 'audio/mpeg'
            },
            guid: 'http://inessential.com/2002/09/01.php#a2',
            pubDate: 'Sun, 19 May 2002 15:21:36 GMT',
            new: true
        })
    })
})