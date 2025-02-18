import CustomElement from '@modnes/custom-element'
import FeedServiceFactory from 'alimento/Services/FeedServiceFactory.js'

class FeedItemsList extends CustomElement {
    service

    constructor () {
        super()
        this.service = FeedServiceFactory.build()
        this.data.feeItems = []
        this.template = data => `${data.feeItems.map(feedItem => `
            <article>
                ${(feedItem.link) ? `<a href="${feedItem.link}" target="_blank">` : '' }
                    ${(feedItem.new) ? `<span>New</span>` : ''}
                    ${(feedItem.title) ? `<h1>${feedItem.title}</h1>` : ''}
                    ${(feedItem.description) ? `<p>${feedItem.description}</p>` : ''}
                ${(feedItem.link) ? `</a>` : '' }
                <footer>
                    ${(feedItem.pubDate) ? `<div>Date: ${feedItem.pubDate.toLocaleString()}</div>` : '' }
                    ${(feedItem.categories.length > 0) ? `<div>Categories: ${feedItem.categories.map(category => `
                    <span>
                        ${(category.domain) ? `<a href="${category.domain}" target="_blank">` : '' }
                            ${category.name}
                        ${(feedItem.link) ? `</a>` : '' }
                    </span>
                    `).join('')}</div>` : '' }
                    ${(feedItem.comments) ? `<div><a href="${feedItem.comments}" target="_blank">Comments</a></div>` : '' }
                </footer>
            </article>
        `).join('')}`
    }

    async connectedCallback () {
        await this.loadFeedItems()
    }

    async loadFeedItems () {
        this.data.feeItems = await this.service.getFeedItems()
        
        this.render()
    }
}

customElements.define('feed-items-list', FeedItemsList)

export default FeedItemsList