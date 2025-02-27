import CustomElement from '@modnes/custom-element'
import FeedServiceFactory from '../../Services/FeedServiceFactory.js'
import I18n from '../../Internationalization.js'

const i18n = new I18n()

class AddSubscription extends CustomElement {
    service

    constructor () {
        super()
        this.service = FeedServiceFactory.build()
        this.template = () => `
            <form class="add-subscription">
                <label for="feedUrl" class="add-subscription__label">
                    ${i18n.t('AddSubscription.label')}
                </label>
                <input
                    type="url"
                    name="feedUrl"
                    id="feedUrl"
                    placeholder="Ex.: https://cyber.harvard.edu/rss/examples/rss2sample.xml"
                    pattern="https?://.*"
                    required
                    class="add-subscription__input"
                />
                <button type="submit" class="add-subscription__button" title="${i18n.t('AddSubscription.Subscribe')}">
                    <vector-icon class="add-subscription__button-icon" name="check"></vector-icon>
                    <span class="add-subscription__button-label">${i18n.t('AddSubscription.Subscribe')}</span>
                </button>
            </form>
        `
    }

    async subscribe () {
        const urlInput =  this.querySelector('input')

        if (await this.service.subscribe(urlInput.value)) {
            this.dispatchEvent(new CustomEvent('feedAdded', {
                bubbles: true,
                detail: {
                  url: urlInput.value
                }
            }))
        }

        urlInput.value = ''
    }

    init () {
        this.querySelector('form').addEventListener('submit', event => {
            event.preventDefault()
            this.subscribe()
        })
    }
}

customElements.define('add-subscription', AddSubscription)

export default AddSubscription
