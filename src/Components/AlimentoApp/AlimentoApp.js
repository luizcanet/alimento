import CustomElement from '@modnes/custom-element'
import Router from '@modnes/router'
import Settings from '../../Settings.js'
import IDBHandler from '../../IDBHandler.js'
import FeedServiceFactory from '../../Services/FeedServiceFactory.js'
import AlimentoAppTemplate from './AlimentoAppTemplate.js'
import Routes from './Routes.js'
import I18n from '../../Internationalization.js'

import '@modnes/router/anchor/index.js'
import '../AddSubscription/AddSubscription.js'
import '../FeedItemsList/FeedItemsList.js'
import '../SettingsPanel/SettingsPanel.js'
import '../FiltersPanel/FiltersPanel.js'
import '../FeedSubscriptions/FeedSubscriptions.js'
import '../VectorIcon/VectorIcon.js'

class AlimentoApp extends CustomElement {
    settings
    service
    serviceWorker
    updatesInterval
    router
    i18n

    constructor () {
        super()
        this.settings = new Settings()
        this.service = FeedServiceFactory.build()
        this.i18n = new I18n()
        this.template = AlimentoAppTemplate

        this.addEventListener('feedAdded', async event => {
            await this.service.update(event.detail.url)
            this.dispatchEvent(new CustomEvent('feedUpdated', {
                bubbles: true,
                detail: {
                    url: event.detail.url
                }
            }))
            Router.goTo('/subscriptions')
        })
        this.addEventListener('settingsChanged', async event => {
            if (event.detail.property === 'updatesInterval.amount' ||
                event.detail.property === 'updatesInterval.type') {
                if (this.serviceWorker.periodicSync) {
                    await this.serviceWorker.periodicSync.unregister('update-feed')
                }
                clearInterval(this.updatesInterval)
                await this.setUpdatesInterval()
            }
            if (event.detail.property === 'language') {
                document.querySelector('html').setAttribute('lang', this.settings.language)
                this.i18n.locale = this.settings.language
                this.render()
            }
        })
    }

    async connectedCallback () {
        this.serviceWorker = await navigator.serviceWorker.ready
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('alimento_db', 1)
        await this.subscribe()
        await this.update()
        await this.setUpdatesInterval()
    
        super.connectedCallback()
    }

    init () {
        this.router = new Router(this.querySelector('main'), Routes)

        document.querySelector('html').setAttribute('lang', this.settings.language)
    }

    async update () {
        if (await this.service.updateAll()) {
            this.dispatchEvent(new CustomEvent('feedUpdated'), { bubbles: true })
            this.checkForNewItems()
        }
    }

    async subscribe () {
        const params = new URLSearchParams(document.location.search)
        const url = params.get('subscribe')

        if (url) {
            if (await this.service.subscribe(url)) {
                history.pushState(document.location.pathname, '', document.location.pathname)
                this.dispatchEvent(new CustomEvent('feedAdded', {
                    bubbles: true,
                    detail: {
                        url: url
                    }
                }))
            }
        }
    }

    async checkForNewItems () {
        const newItems = await this.service.getNewItems()

        if (newItems.length > 0 && this.settings.notifications) {
            new Notification(this.i18n.t('AlimentoApp.NotificationTitle'), {
                icon: './alimento-logo.svg',
                body: newItems[0].title
            })
        }
    }

    async setUpdatesInterval () {
        try {
            await this.serviceWorker.periodicSync.register('update-feed' + (Settings.notifications ? '-notification' : ''), {
                minInterval: this.settings.updatesInterval.amount * Settings.IntervalTypes[this.settings.updatesInterval.type]
            })
        } catch {
            this.updatesInterval = setInterval(
                this.update.bind(this),
                this.settings.updatesInterval.amount * Settings.IntervalTypes[this.settings.updatesInterval.type]
            )
        }
    }
}

customElements.define('alimento-app', AlimentoApp)

export default AlimentoApp