import CustomElement from '@modnes/custom-element'
import DataController from '@modnes/data-controller'
import Settings from 'alimento/Settings.js'
import SettingsPanelTemplate from 'alimento/Components/SettingsPanel/SettingsPanelTemplate.js'

class SettingsPanel extends CustomElement {
    constructor () {
        super()
        this.dataController= new DataController(this)
        this.data = new Settings()
        this.template = SettingsPanelTemplate
        this.addEventListener('dataUpdated', event => {
            localStorage.setItem('settings', JSON.stringify(new Settings()))
            this.dispatchEvent(new CustomEvent('settingsChanged', {
                bubbles: true,
                detail: event.detail
            }))
        })
    }

    init () {
        const backButton = this.querySelector('.settings-panel__back-button')

        this.dataController.bindForm(this.querySelector('.settings-panel__form'))

        backButton.addEventListener('click', () => { history.back() })
    }
}

customElements.define('settings-panel', SettingsPanel)

export default SettingsPanel