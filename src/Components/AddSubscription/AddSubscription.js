import CustomElement from '@modnes/custom-element'
import FeedService from 'alimento/Services/FeedService.js';
import FeedRepository from 'alimento/Repositories/FeedRepository.js';
import IDBHandler from 'alimento/IDBHandler.js';
import CategoryRepository from 'alimento/Repositories/CategoryRepository.js';

class AddSubscription extends CustomElement {
    service

    constructor () {
        super()
        this.service = new FeedService(
            new FeedRepository(new IDBHandler(indexedDB)),
            new CategoryRepository(new IDBHandler(indexedDB))
        )
        this.template = () => `
            <input
                type="url"
                name="feedUrl"
                placeholder="https://cyber.harvard.edu/rss/examples/rss2sample.xml"
                pattern="https?://.*"
                required
            />
            <button>
                Subscribe
            </button>
        `
    }

    async subscribe () {
        const input =  this.querySelector('input')

        await this.service.subscribe(input.value)

        input.value = ''
    }

    init () {
        this.querySelector('button').addEventListener('click', () => {
            this.subscribe()
        })
    }
}

customElements.define('add-subscription', AddSubscription);

export default AddSubscription
