import CustomElement from '@modnes/custom-element'
import FeedServiceFactory from 'alimento/Services/FeedServiceFactory.js';

class AddSubscription extends CustomElement {
    service

    constructor () {
        super()
        this.service = FeedServiceFactory.build()
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
        const urlInput =  this.querySelector('input')

        if (await this.service.subscribe(urlInput.value)) {
            this.dispatchEvent(new CustomEvent('feedAdded', {
                detail: {
                  url: urlInput.value
                }
            }))
        }

        urlInput.value = ''
    }

    init () {
        this.querySelector('button').addEventListener('click', () => {
            this.subscribe()
        })
    }
}

customElements.define('add-subscription', AddSubscription);

export default AddSubscription
