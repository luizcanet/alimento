import CustomElement from '@modnes/custom-element'
import Settings from '../../Settings.js'
import IDBHandler from '../../IDBHandler.js'
import FeedServiceFactory from '../../Services/FeedServiceFactory.js'
import AlimentoAppTemplate from './AlimentoAppTemplate.js'

import '../AddSubscription/AddSubscription.js'
import '../FeedItemsList/FeedItemsList.js'
import '../SettingsPanel/SettingsPanel.js'
import '../FiltersPanel/FiltersPanel.js'

class AlimentoApp extends CustomElement {
    settings
    service
    updatesInterval

    constructor () {
        super()
        this.settings = new Settings()
        this.service = FeedServiceFactory.build()
        this.template = AlimentoAppTemplate

        this.addEventListener('feedAdded', async event => {
            if (await this.service.update(event.detail.url)) {
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('feedUpdated', {
                        bubbles: true,
                        detail: {
                            url: event.detail.url
                        }
                    }))
                }, 1)
            }
        })
        this.addEventListener('settingsChanged', event => {
            if (event.detail.property === 'updatesInterval.amount' ||
                event.detail.property === 'updatesInterval.type') {
                clearInterval(this.updatesInterval)
                this.setUpdatesInterval()
            }
        })
    }

    async connectedCallback () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('alimento_db', 1)
        this.subscribe()
        this.update()
        this.setUpdatesInterval()
    
        super.connectedCallback()
    }

    async update () {
        if (await this.service.updateAll()) {
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('feedUpdated'), { bubbles: true })
            }, 1)
        }
    }

    async subscribe () {
        const params = new URLSearchParams(document.location.search)
        const subscribe = params.get('subscribe')

        if (subscribe) {
            if (await this.service.subscribe(subscribe)) {
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('feedAdded', {
                        bubbles: true,
                        detail: {
                        url: subscribe
                        }
                    }))
                    history.pushState(document.location.pathname, '', document.location.pathname)
                }, 1)
            }
        }
    }

    setUpdatesInterval () {
        this.updatesInterval = setInterval(
            this.update.bind(this),
            this.settings.updatesInterval.amount * Settings.IntervalTypes[this.settings.updatesInterval.type]
        )
    }
}

customElements.define('alimento-app', AlimentoApp)

export default AlimentoApp