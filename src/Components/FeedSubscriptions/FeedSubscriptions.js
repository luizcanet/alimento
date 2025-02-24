import CustomElement from '@modnes/custom-element'
import FeedSubscriptionsTemplate from './FeedSubscriptionsTemplate.js'
import FeedRepository from '../../Repositories/FeedRepository.js'
import IDBHandler from '../../IDBHandler.js'
import FeedServiceFactory from '../../Services/FeedServiceFactory.js'

class FeedSubscriptions extends CustomElement {
    #repository
    service

    constructor () {
        super()
        this.#repository = new FeedRepository(new IDBHandler(indexedDB))
        this.service = FeedServiceFactory.build()
        this.template = FeedSubscriptionsTemplate
    }

    connectedCallback () {
        this.loadFeeds()
    }

    init () {
        window.addEventListener('feedUpdated', () => {
            this.loadFeeds()
        })

        this.querySelectorAll('.feed-actions__unsubscribe').forEach((button, key) => {
            button.addEventListener('click', async () => {
                await this.service.unsubscribe(this.data.feeds[key])

                this.loadFeeds()
            })
        })
    }

    async loadFeeds () {
        this.data.feeds = await this.#repository.getAll()

        this.render()
    }
}

customElements.define('feed-subscriptions', FeedSubscriptions)

export default FeedSubscriptions