import 'alimento/Components/AlimentoApp/AlimentoApp.js'
import { XMLParser } from 'fast-xml-parser'

window.XMLParser = XMLParser

if ('serviceWorker' in navigator) {
  (async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.module.js', {
        type: 'module'
      })
    } catch {
      await navigator.serviceWorker.register('./service-worker.js')
    }
  })()
}
