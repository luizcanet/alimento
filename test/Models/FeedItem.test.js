import { expect } from 'chai';
import FeedItem from '../../src/Models/FeedItem.js'

describe('Feed Item Model', function () {
    it('Should throw a TypeError when the link parameter is not a URL', function () {
        let feed = () => { new FeedItem() }

        expect(feed).to.throw(TypeError, 'Feed Link must be a valid URL')
    })

    it('Should build a complete Feed Item', function () {
        let feedItem = new FeedItem('https://test/url')

        feedItem.title = 'Venice Film Festival Tries to Quit Sinking'
        feedItem.link = 'http://nytimes.com/2004/12/07FEST.html'
        feedItem.description = 'Some of the most heated chatter at the Venice Film Festival this week was about the way that the arrival of the stars at the Palazzo del Cinema was being staged.'
        feedItem.author = 'oprah@oxygen.net'
        feedItem.category.push('Blog')
        feedItem.category.push('Technology')
        feedItem.comments = 'http://www.myblog.org/cgi-local/mt/mt-comments.cgi?entry_id=290'
        feedItem.enclosure = {
            url: 'http://www.scripting.com/mp3s/weatherReportSuite.mp3',
            length: 12216320,
            type: 'audio/mpeg'
        }
        feedItem.guid = 'http://inessential.com/2002/09/01.php#a2'
        feedItem.pubDate = 'Sun, 19 May 2002 15:21:36 GMT'

        expect(feedItem).to.be.an.instanceOf(FeedItem)
        expect(feedItem).to.be.eql({
            feedLink: 'https://test/url',
            title: 'Venice Film Festival Tries to Quit Sinking',
            link: 'http://nytimes.com/2004/12/07FEST.html',
            description: 'Some of the most heated chatter at the Venice Film Festival this week was about the way that the arrival of the stars at the Palazzo del Cinema was being staged.',
            author: 'oprah@oxygen.net',
            category: ['Blog', 'Technology'],
            comments: 'http://www.myblog.org/cgi-local/mt/mt-comments.cgi?entry_id=290',
            enclosure: {
                url: 'http://www.scripting.com/mp3s/weatherReportSuite.mp3',
                length: 12216320,
                type: 'audio/mpeg'
            },
            guid: 'http://inessential.com/2002/09/01.php#a2',
            pubDate: 'Sun, 19 May 2002 15:21:36 GMT'
        })
    })
})