class GridMenu {

    private position: Vector = { x: 0, y: 0 }
    private carts : Element
    private menu: HTMLCollection[] = []                    // een array van htmlcollections
    private page: number = 0
    private numpages: number = 1
    private paging: Element
    private data: GameData[]

    constructor(data:GameData[]){
        this.page = 0
        this.data = data   

        this.numpages = Math.ceil(this.data.length / 8)
        this.carts = document.querySelector("#game-grid")!
        this.paging = document.querySelector("#page-menu")!

        // cart
        this.carts.addEventListener("animationend", () => this.carts.classList.remove("leftAnimation", "rightAnimation"))

        // generate game page with 8 thumbnails
        this.generateGamePage(this.page)
        this.generatePaging()

        // create rows of buttons - TODO just store the amount of rows and columns!
        this.menu.push(document.querySelector("#player-menu")!.children)
        this.menu.push(document.querySelector("#game-grid")!.children)
        this.menu.push(document.querySelector("#page-menu")!.children)
        this.menu.push(document.querySelector("#credits-menu")!.children)
    }

    private generateGamePage(p: number) {
        this.page = Math.min(Math.max(this.page + p, 0), this.numpages - 1)
        this.carts.innerHTML = ""

        let start = this.page * 8
        let num = Math.min(this.data.length - start, 8)

        for (let i = start; i < start + num; i++) {
            let div = document.createElement("div")
            let data = this.data[i]

            this.carts.appendChild(div)

            // cartridge cover image has to be in same repo. cross-domain not working.
            // TODO TWO BACKGROUND IMAGES! ONE HAS TRANSPARENT CARTRIDGE, OTHER HAS SQUARE GAME IMAGE
            // TODO only hue rotate if there is no original cover image
            let cover = data.cover
            if (cover && cover != "") {
                // custom cover image
                div.style.backgroundImage = `url(./covers/${cover})`
                div.style.filter = `saturate(0.8)`;
            } else {
                // generic cover for cartdrige or makecode
                div.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(0.8)`;
                div.style.backgroundImage = (data.makecode) ? `url(./images/cart-makecode.png)` : `url(./images/cart.png)`
                div.innerHTML = data.name
                if (data.makecode) {
                    div.classList.add("makecode")
                } else {
                    div.classList.add("cartridge")
                }
            }
        }

        if (p < 0) {
            this.carts.classList.add("leftAnimation")
        } else if (p > 0) {
            this.carts.classList.add("rightAnimation")
        }

        //this.showPageNumber()
    }

    private generatePaging() {
        for (let i = 0; i < this.numpages; i++) {
            let div = document.createElement("div")
            div.innerHTML = (i + 1).toString()
            this.paging.appendChild(div)
            if (i == 0) div.classList.add("selected")
        }
    }

    public selectRow(dir: number) {
        if (this.position.y == 2 && dir == -1) {
            // als we van paging naar games gaan, dan altijd column 4 selecteren
            this.position.x = 4
            this.position.y = 1
        } else if (this.position.y == 1 && this.position.x < 4 && dir == 1) {
            // the game grid really has 8 columns - but they are displayed as two rows with 4 columns in a grid
            // this if statement adds the ability to switch vertically between columns
           this.position.x += 4
        } else if (this.position.y == 1 && this.position.x > 3 && dir == -1) {
           this.position.x -= 4
        } else {
            // selecteer nieuwe row binnen min en max aantal rows
            this.position.x = 0
            this.position.y = Math.min(Math.max(this.position.y + dir, 0), this.menu.length - 1)
        }
        // // als we naar de paging row zijn gegaan, dan is de column de huidige page
        if (this.position.y == 2) {
            this.position.x = this.page
        }

        this.updateCursor()
    }

    public selectColumn(dir: number) {
        // todo rewrite the whole paging / row selection

        // links - vorige pagina
        if (this.position.y == 1 && this.position.x == 0 && dir == -1 && this.page > 0) {
            this.generateGamePage(dir)
            this.showPageNumber()
            this.position.x = 8
        } 
        
        // rechts - volgende pagina
        if (this.position.y == 1 && this.position.x == 7 && dir == 1 && this.page < this.numpages - 1) {
            this.generateGamePage(dir)
            this.showPageNumber()
            this.position.x = -1
        }


        let maxColumn = this.menu[this.position.y].length - 1
        this.position.x = Math.min(Math.max(this.position.x + dir, 0), maxColumn)

        // als we in de paging row zijn, dan meteen de nieuwe page tonen
        if (this.position.y == 2) {
            this.generateGamePage(dir)
        }

        this.updateCursor()
    }

    public updateCursor() {
        this.clearSelection(this.position.y)

        // bottom row altijd clear als we daar niet zijn
        if (this.position.y != 3) {
            this.clearSelection(3)
        }

        // TODO cleanup - cartridges also have an UNselected class...
        if (this.position.y == 1) {
            for (let c of this.menu[1]) {
                c.classList.add("unselected")
            }
        } else {
            for (let c of this.menu[1]) {
                c.classList.remove("unselected")
            }
        }

        // remove cursor from wherever it is now
        let c = document.querySelector(".cursor")
        if (c) c.classList.remove("cursor")

        // add selectbox and cursor box to current position
        this.getSelectedElement().classList.add("selected", "cursor")
    }

    private clearSelection(row: number) {
        let buttons: HTMLCollection = this.menu[row]
        let arr = Array.from(buttons)
        for (let b of arr) {
            b.classList.remove("selected")
        }
    }

    private showPageNumber(){
        let buttons: HTMLCollection = this.menu[2]
        let arr = Array.from(buttons)
        for (let i = 0; i < this.numpages; i++) {
            if (i == this.page) {
                arr[i].classList.add("selected")
            } else {
                arr[i].classList.remove("selected")
            }
        }
    }

    private getSelectedElement() {
        return this.menu[this.position.y][this.position.x]
    }

    // button pressed may be called by spacebar and arcade stick fire button 
    public buttonPressed() {
        if(this.position.y == 0) {
            // console.log("select only single player or multiplayer games")
        }
        if (this.position.y == 1) {
            let index = this.position.x + (this.page * 8)
            this.gotoGame(index)
        }
        if (this.position.y == 3 && this.position.x == 0) {
            App.instance.toggleSound()
        }
        
    }
    public updateSound(b:Boolean){
        this.menu[3][0].innerHTML = (b) ? "SOUND:ON" : "SOUND:OFF"
    }

    private gotoGame(index: number) {
        window.location.href = this.data[index].url
    }

}