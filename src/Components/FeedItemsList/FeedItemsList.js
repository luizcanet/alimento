import CustomElement from '@modnes/custom-element'
import FeedServiceFactory from 'alimento/Services/FeedServiceFactory.js'
import FeedItemsListTemplate from './FeedItemsListTemplate.js'
import Filters from '../../Filters.js'

class FeedItemsList extends CustomElement {
    filters
    service

    constructor () {
        super()
        this.filters = new Filters()
        this.service = FeedServiceFactory.build()
        this.data.feedItems = []
        this.template = FeedItemsListTemplate
        
        window.addEventListener('feedUpdated', () => {
                this.loadFeedItems()
        })
        window.addEventListener('filtersChanged', () => {
            this.loadFeedItems()
        })
    }

    connectedCallback () {
        this.loadFeedItems()
    }

    async loadFeedItems () {
        this.data.feedItems = await this.service.getFeedItems()

        this.data.feedItems = this.#applyFilters(this.data.feedItems)
        
        this.render()
    }

    #applyFilters (feedItems) {
        for (const key in this.filters) {
            if (Object.prototype.hasOwnProperty.call(this.filters, key)) {
                feedItems = this.filters['filterBy' + key.at(0).toUpperCase() + key.substring(1)](feedItems)
            }
        }

        return feedItems
    }
}

customElements.define('feed-items-list', FeedItemsList)

export default FeedItemsList