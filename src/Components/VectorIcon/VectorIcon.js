import CustomElement from '@modnes/custom-element'

class VectorIcon extends CustomElement {
    name

    static observedAttributes = ['name']

    constructor () {
        super()
        this.template = () => `
            <svg class="icon">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Components/VectorIcon/icon.svg#${this.name}">
                </use>
            </svg>
        `
    }

    connectedCallback () {
        this.name = this.getAttribute('name')

        this.render()
    }

    attributeChangedCallback (attributeName, oldValue, newValue) {
        if (attributeName === 'name') {
            this.name = newValue

            this.render()
        }
    }
}

customElements.define('vector-icon', VectorIcon)

export default VectorIcon