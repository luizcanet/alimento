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

    connectedCallback () {
        if (Notification.permission !== 'granted') {
            this.data.notifications = false
        }

        this.render()
    }

    init () {
        this.querySelector('.settings-panel__back-button')
            .addEventListener('click', () => { history.back() })

        this.querySelector('input[name="notifications"]')
            .addEventListener('change', async event => {
                if (event.target.checked && (Notification.permission !== 'granted')) {
                    const permission = await Notification.requestPermission()

                    this.data.notifications = (permission === 'granted')
                    event.target.checked = (permission === 'granted')
                }

                this.render()
            })

        this.dataController.bindForm(this.querySelector('.settings-panel__form'))
    }
}

customElements.define('settings-panel', SettingsPanel)

export default SettingsPanel