import CustomElement from '@modnes/custom-element'
import IDBHandler from 'alimento/IDBHandler.js'
import FeedServiceFactory from 'alimento/Services/FeedServiceFactory.js'

import 'alimento/Components/AddSubscription/AddSubscription.js'
import 'alimento/Components/FeedItemsList/FeedItemsList.js'

class AlimentoApp extends CustomElement {
    service

    constructor () {
        super()
        this.service = FeedServiceFactory.build()
        this.template = `
            <header>
                <h1>
                    Alimento
                </h1>
                <add-subscription />
            </header>
            <feed-items-list></feed-items-list>
        `
    }

    async connectedCallback () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('alimento_db', 1)
    
        super.connectedCallback()
    }

    init () {
        const addSubscription = this.querySelector('add-subscription')
        
        addSubscription.addEventListener('feedAdded', async event => {
            if (await this.service.update(event.detail.url)) {
                this.dispatchEvent(new CustomEvent('feedUpdated', {
                    detail: {
                        url: event.detail.url
                    }
                }))
            }
        })

        this.addEventListener('feedUpdated', () => {
            const feedItemsList = this.querySelector('feed-items-list')
            
            feedItemsList.loadFeedItems()
        })
    }
}

customElements.define('alimento-app', AlimentoApp)

export default AlimentoApp