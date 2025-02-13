import CustomElement from '@modnes/custom-element'
import IDBHandler from 'alimento/IDBHandler.js'

import 'alimento/Components/AddSubscription/AddSubscription.js'

class MainApp extends CustomElement {
    service

    constructor () {
        super()
        this.template = '<add-subscription />'
    }

    async connectedCallback () {
        const iDBHandler =  new IDBHandler(indexedDB)

        await iDBHandler.init('teste_db', 1)
    
        super.connectedCallback()
      }
}

customElements.define('main-app', MainApp);

export default MainApp