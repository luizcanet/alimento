import 'alimento/Components/AlimentoApp/AlimentoApp.js'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
}
