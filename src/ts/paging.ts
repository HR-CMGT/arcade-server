export class Paging {

    private selection = 0
    private container: Element

    constructor(maxPages: number) {
        this.container = document.querySelector("page-menu")!

        let pages = Math.ceil(maxPages / 12)

        for (let i = 0; i < pages; i++) {
            const div = document.createElement("div")
            div.innerHTML = (i+1).toString()
            this.container.append(div)
        }

        this.showPageNumber()

        document.addEventListener("gamePageSelected", (e: Event) => {
            this.selection = (e as CustomEvent).detail
            this.showPageNumber()
        })
    }

    public selectPosition(dir: number) {
        this.selection += dir
        if (this.selection < 0) this.selection = this.container.children.length - 1
        if (this.selection >= this.container.children.length) this.selection = 0
        document.dispatchEvent(new CustomEvent('pagingSelected', { detail: this.selection }))
    }

    public updateCursor() {
        this.container.children[this.selection].classList.add("cursor")
    }

    public clearCursor() {
        this.container.children[this.selection].classList.remove("cursor")
    }

    private showPageNumber() {
        for (let child of this.container.children) {
            child.classList.remove("selected")
        }
        this.container.children[this.selection].classList.add("selected")
    }

    public buttonPressed() {
        // not needed
    }
}