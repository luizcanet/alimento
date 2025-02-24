import CustomElement from '@modnes/custom-element'
import FeedSubscriptionsTemplate from './FeedSubscriptionsTemplate.js'
import FeedRepository from '../../Repositories/FeedRepository.js'
import IDBHandler from '../../IDBHandler.js'

class FeedSubscriptions extends CustomElement {
    #repository

    constructor () {
        super()
        this.#repository = new FeedRepository(new IDBHandler(indexedDB))
        this.template = FeedSubscriptionsTemplate
    }

    async connectedCallback () {
        this.data.feeds = await this.#repository.getAll()

        this.render()
    }
}

customElements.define('feed-subscriptions', FeedSubscriptions)

export default FeedSubscriptions