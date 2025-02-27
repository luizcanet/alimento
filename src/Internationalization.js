import en from './Translations/en.js'
import ptBR from './Translations/ptBR.js'
import Settings from './Settings.js'

class Internationalization {
    constructor () {
        if (!Internationalization.instance) {
            const settings = new Settings()
            // eslint-disable-next-line no-undef
            const i18n = new I18n.I18n({
                ...ptBR,
                ...en
            })

            i18n.locale = settings.language
            i18n.enableFallback = true
            i18n.locales.register('pt', ['pt-BR'])

            Internationalization.instance = i18n
        }

        return Internationalization.instance
    }
}

export default Internationalization