class Settings {
    updatesInterval = {
        amount: 1,
        type: 'h'
    }

    constructor () {
        if (!Settings.instance) {
            const settings = JSON.parse(localStorage.getItem('settings'))
            
            if (settings) {
                for (const key in settings) {
                    if (Object.prototype.hasOwnProperty.call(settings, key)) {
                        this[key] = settings[key]
                    }
                }
            } else {
                localStorage.setItem('settings', JSON.stringify(this))
            }
            
            Settings.instance = this
        }

        return Settings.instance
    }

    set (prop, value) {
        this[prop] = value

        localStorage.setItem('settings', JSON.stringify(this))
    }

    static get IntervalTypes () {
        return {
            m: 60 * 1000,
            h: 60 * 60 * 1000
        }
    }
}

export default Settings