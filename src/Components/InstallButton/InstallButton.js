import CustomElement from '@modnes/custom-element'
import I18n from '../../Internationalization.js'

const i18n = new I18n()

class InstallButton extends CustomElement {
    installPrompt
    installButton

    constructor () {
        super()
        this.template = () => `
            <button class="primary" title="${i18n.t('InstallButton.label')}" hidden>
                <vector-icon class="install-button__button-icon" name="download"></vector-icon>
                <span class="install-button__button-label">${i18n.t('InstallButton.label')}</span>
            </button>
        `

        window.addEventListener("beforeinstallprompt", (event) => {
            this.installPrompt = event;
            this.installButton.removeAttribute("hidden")
        })

        window.addEventListener("appinstalled", () => {
            this.disableInAppInstallPrompt()
        });
    }

    init () {
        this.installButton = this.querySelector('button')

        this.addEventListener('click', async () => {
            if (!this.installPrompt) {
                return;
            }
            
            await this.installPrompt.prompt();
            
            this.disableInAppInstallPrompt();
        })
    }

    disableInAppInstallPrompt() {
        this.installPrompt = null;
        this.installButton.setAttribute("hidden", "");
    }
}

customElements.define('install-button', InstallButton)

export default InstallButton