import { GameData, Vector } from './interface.ts'
import { App } from './app'

export class GameMenu extends HTMLElement { 

    private selection: Vector = { x: 0, y: 0 }
    //private carts: Element
    private page: number = 0
    private numpages: number = 1
    private data: GameData[]
    private cartsPerPage: number = 12
    private gameloading = false

    constructor(data: GameData[]) {
        super()

        this.page = 0
        this.data = data
        this.cartsPerPage = 12

        this.numpages = Math.ceil(this.data.length / this.cartsPerPage)
        
        // generate cart thumbnails
        this.generateGamePage(0)

        this.addEventListener("animationend", () => this.classList.remove("leftAnimation", "rightAnimation"))


        // TODO REMOVE respond to paging events
        document.addEventListener("pagingSelected", (e: Event) => {
            let newPage = (e as CustomEvent).detail
            let direction = (newPage > this.page) ? 1 : -1

            // als van 0 naar 3 of van 3 naar 1 dan andersom
            if (newPage == 0 && this.page == this.numpages - 1) direction = 1
            if (newPage == this.numpages - 1 && this.page == 0) direction = -1

            this.page = newPage
            this.generateGamePage(direction)
        })

        this.classList.add("leftAnimation")
        this.updateCursor()
    }

    //
    // show 12 cartridges
    // on left and right, show previous and next page
    //
    private generateGamePage(direction: number) {


        // flip around to the other side
        if (this.page < 0) this.page = this.numpages - 1
        if (this.page >= this.numpages) this.page = 0

        // just double checking
        this.page = Math.min(Math.max(this.page, 0), this.numpages - 1)

        this.innerHTML = ""
        let start = this.page * this.cartsPerPage
        let num = Math.min(this.data.length - start, this.cartsPerPage)

        for (let i = start; i < start + num; i++) {
            this.generateCoverImage(this.data[i])
        }

        if (direction < 0) {
            this.classList.add("leftAnimation")
        } else if (direction > 0) {
            this.classList.add("rightAnimation")
        }

        document.dispatchEvent(new CustomEvent('gamePageSelected', { detail: this.page }))
    }

    //
    // user pressed left or right
    //
    public selectPosition(direction: number) {
        this.selection.x += direction
        this.selection.y = App.instance.selectedRow

        // go to the next or previous page
        // reset the cursor to the first or the last available cartridge
        if (this.selection.x < 0) {
            this.page--
            this.generateGamePage(-1)
            this.selection = this.getLastCartPosition()
            App.instance.selectedRow = this.selection.y
        }
        if (this.selection.x > 3) {
            this.page++
            this.generateGamePage(1)
            this.selection.x = 0
            this.selection.y = 0
            App.instance.selectedRow = 0
        }


    }

    //
    // after switching pages, the selected cart is either the first or the last cartridge
    //
    private getLastCartPosition() {
        let isLastPage = (this.page + 1) * this.cartsPerPage >= this.data.length;
        let cartsOnCurrentPage = isLastPage ? this.data.length % this.cartsPerPage : this.cartsPerPage;
        let lastRow = Math.floor((cartsOnCurrentPage - 1) / 4);
        let lastColumn = (cartsOnCurrentPage - 1) % 4;
        return { x: lastColumn, y: lastRow };
    }

    //
    // highlight current selected cartridge
    //
    public updateCursor() {
        this.selection.y = App.instance.selectedRow
        let newSelection = this.getSelectedElement()
        if (newSelection) newSelection.classList.add("cursor")
        //
        // todo als dit niet bestaat dan de oude selectie vast houden
        // alleen voor de laatste pagina
        //
    }

    public clearCursor() {
        let previousSelection = this.getSelectedElement()
        if (previousSelection) {
            previousSelection.classList.remove("cursor")
        }
    }

    private getSelectedElement() {
        let index = this.selection.x + (this.selection.y * 4)
        return this.children[index]
    }

    public buttonPressed() {
        if(this.gameloading) return

        let myselection = this.getSelectedElement()
        if (myselection) myselection.classList.add("chosengame") // you were the chosen one!

        myselection.addEventListener("animationend", () => {
            let index = this.selection.x + (this.selection.y * 4) + (this.page * this.cartsPerPage)
            window.location.href = this.data[index].url
        })
        this.gameloading = true
    }

    //
    // create the cover image
    // todo use DIVS for images so we can have a drop shadow
    //
    private generateCoverImage(mydata: GameData) {
        let div = document.createElement("div")
        this.append(div)

        // cartridge cover image has to be in same repo. cross-domain not working. 
        let cover = mydata.cover
        if (cover && cover != "") {
            // custom cover image
            div.style.backgroundImage = `url(./covers/${cover})`
            div.style.filter = `saturate(0.8)`;
        } else {
            // generic cover for cartdrige or makecode
            div.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(0.8)`;
            div.style.backgroundImage = (mydata.makecode) ? `url(./images/cart-makecode.png)` : `url(./images/cart.png)`
            div.innerHTML = mydata.name
            if (mydata.makecode) {
                div.classList.add("makecode")
            } else {
                div.classList.add("cartridge")
            }
        }
    }

}