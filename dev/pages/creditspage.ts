class CreditsPage extends HTMLElement implements InputListener {
    constructor() {
        super()

        let container = document.querySelector("#content-page")! as HTMLElement
        let template: HTMLTemplateElement = document.getElementById('creditspage')! as HTMLTemplateElement

        container.appendChild(this)
        this.appendChild(template.content.cloneNode(true))  // clone, omdat anders de template zelf wordt verplaatst
    }

    public selectColumn(dir: number) {
        this.classList.add("cursor")
    }

    public selectRow(dir: number) {
        if (dir == 1) {
            this.classList.remove(".cursor")
            App.instance.focusNavigation()
        }
    }
    public pressButton() {

    }
}

window.customElements.define("credits-page", CreditsPage);