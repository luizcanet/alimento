import CustomElement from '@modnes/custom-element'
import FeedServiceFactory from 'alimento/Services/FeedServiceFactory.js'
import FeedItemsListTemplate from './FeedItemsListTemplate.js'

class FeedItemsList extends CustomElement {
    service

    constructor () {
        super()
        this.service = FeedServiceFactory.build()
        this.data.feeItems = []
        this.template = FeedItemsListTemplate
    }

    async connectedCallback () {
        await this.loadFeedItems()
    }

    init () {
        window.addEventListener('feedUpdated', () => {
            this.loadFeedItems()
        })
    }

    async loadFeedItems () {
        this.data.feeItems = await this.service.getFeedItems()
        
        this.render()
    }
}

customElements.define('feed-items-list', FeedItemsList)

export default FeedItemsList