import { expect } from 'chai';
import Feed from '../../src/Models/Feed.js';

describe('Feed Model', function() {
    it('Should throw a TypeError when the title parameter is not a string', function () {
        const feed = () => { new Feed() }

        expect(feed).to.throw(TypeError, 'Title must be a string')
    })

    it('Should throw a TypeError when the link parameter is not a URL', function () {
        const feed = () => { new Feed('Test Title') }

        expect(feed).to.throw(TypeError, 'Link must be a valid URL')
    })

    it('Should throw a TypeError when the description parameter is not a string', function () {
        const feed = () => { new Feed('Test Title', 'https://test/url') }

        expect(feed).to.throw(TypeError, 'Description must be a string')
    })

    it('Should construct a Feed', function () {
        const feed = new Feed('Test Title', 'https://test/url', 'Test Description')

        expect(feed).to.be.an.instanceOf(Feed)
        expect(feed.title).to.be.equal('Test Title')
        expect(feed.link).to.be.equal('https://test/url')
        expect(feed.description).to.be.equal('Test Description')
    })

    it('Should build a complete Feed', function () {
        const feed = new Feed('Test Title', 'https://test/url', 'Test Description')

        feed.language = 'en-us'
        feed.copyright = 'Copyright 2002, Spartanburg Herald-Journal'
        feed.managingEditor = 'geo@herald.com (George Matesky)'
        feed.webMaster = 'betty@herald.com (Betty Guernsey)'
        feed.pubDate = 'Sat, 07 Sep 2002 00:00:01 GMT'
        feed.lastBuildDate = 'Sat, 07 Sep 2002 09:42:31 GMT'
        feed.category.push('Newspapers')
        feed.category.push('Blog')
        feed.category.push('Technology')
        feed.generator = 'MightyInHouse Content System v2.3'
        feed.docs = 'http://blogs.law.harvard.edu/tech/rss'
        feed.ttl = '60'
        feed.image = {
            url: 'http://blogs.law.harvard.edu/tech/image.jpg',
            title: "describes the image, it's used in the ALT attribute of the HTML",
            link: 'https://test/url',
            description: 'Test Title'
        }

        expect(feed).to.be.an.instanceOf(Feed)
        expect(feed).to.be.eql({
            language: 'en-us',
            copyright: 'Copyright 2002, Spartanburg Herald-Journal',
            managingEditor: 'geo@herald.com (George Matesky)',
            webMaster: 'betty@herald.com (Betty Guernsey)',
            pubDate: 'Sat, 07 Sep 2002 00:00:01 GMT',
            lastBuildDate: 'Sat, 07 Sep 2002 09:42:31 GMT',
            category: ['Newspapers', 'Blog', 'Technology'],
            generator: 'MightyInHouse Content System v2.3',
            docs: 'http://blogs.law.harvard.edu/tech/rss',
            ttl: '60',
            image: {
                url: 'http://blogs.law.harvard.edu/tech/image.jpg',
                title: "describes the image, it's used in the ALT attribute of the HTML",
                link: 'https://test/url',
                description: 'Test Title'
            }
        })
    })
})