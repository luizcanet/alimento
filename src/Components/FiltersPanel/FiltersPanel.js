import CustomElement from '@modnes/custom-element'
import DataController from '@modnes/data-controller'
import Filters from '../../Filters.js'
import FiltersPanelTemplate from './FiltersPanelTemplate.js'
import FeedRepository from '../../Repositories/FeedRepository.js'
import IDBHandler from '../../IDBHandler.js'

class FiltersPanel extends CustomElement {
    #feedRepository
    feeds

    constructor () {
        super()
        this.#feedRepository = new FeedRepository(new IDBHandler(indexedDB))
        this.dataController = new DataController(this)
        this.data = new Filters()
        this.template = FiltersPanelTemplate
        
        this.addEventListener('dataUpdated', event => {
            this.dispatchEvent(new CustomEvent('filtersChanged', {
                bubbles: true,
                detail: {
                    filter: event.detail.property
                }
            }))
        })
        window.addEventListener('feedAdded', async () => {
            this.feeds = await this.#feedRepository.getAll()

            this.render()
        })
    }

    async connectedCallback () {
        this.feeds = await this.#feedRepository.getAll()

        super.connectedCallback()
    }

    init () {
        const backButton = this.querySelector('.filters-panel__back-button')

        this.dataController.bindForm(this.querySelector('.filters-panel__form'))

        backButton.addEventListener('click', () => { history.back() })
    }

    render () {
        while (this.firstChild) {
          this.removeChild(this.firstChild)
        }
    
        this.insertAdjacentHTML('beforeEnd', this.template(this))
    
        this.dispatchEvent(new CustomEvent('elementRendered'))
      }
}

customElements.define('filters-panel', FiltersPanel)

export default FiltersPanel
