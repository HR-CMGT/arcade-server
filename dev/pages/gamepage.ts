class GamePage extends HTMLElement implements InputListener {
    private position: Grid = { row: 0, col: 0 }
    private menu: HTMLCollection[] = []                    // een array van htmlcollections
    private grid: Element
    private page: number = 0
    private numpages: number = 1
    private paging: Element
    private data: GameData[]

    constructor() {
        super()

        let container = document.querySelector("#content-page")! as HTMLElement
        let template: HTMLTemplateElement = document.getElementById('gamepage')! as HTMLTemplateElement

        container.appendChild(this)
        this.appendChild(template.content.cloneNode(true))  // clone, omdat anders de template zelf wordt verplaatst

        this.data = App.instance.data
        this.page = 0

        this.numpages = Math.ceil(this.data.length / 8)
        this.grid = document.querySelector("#game-grid")!
        this.paging = document.querySelector("#page-menu")!

        // generate game page with 8 thumbnails
        this.generateGamePage(this.page)
        this.generatePaging()

        // create rows of buttons - TODO just store the amount of rows and columns!
        // TODO kan allemaal THIS worden
        this.menu.push(document.querySelector("#player-menu")!.children)
        this.menu.push(document.querySelector("#genre-menu")!.children)
        this.menu.push(document.querySelector("#game-grid")!.children)
        this.menu.push(document.querySelector("#page-menu")!.children)

        this.grid.addEventListener("animationend", () => {
            this.grid.classList.remove("leftAnimation", "rightAnimation")
        })
    }

    

    private generateGamePage(p: number) {
        this.page = Math.min(Math.max(this.page + p, 0), this.numpages - 1)
        this.grid.innerHTML = ""

        let start = this.page * 8
        let num = Math.min(this.data.length - start, 8)

        for (let i = start; i < start + num; i++) {
            let div = document.createElement("div")
            let data = this.data[i]

            this.grid.appendChild(div)

            // cartridge color
            div.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(0.75)`;

            // cartridge cover image has to be in same repo. cross-domain verrry slow
            // TODO only hue rotate if there is no original cover image
            let cover = data.cover
            if (cover && cover != "") {
                div.style.backgroundImage = `url(./covers/${cover})`
            } else {
                div.style.backgroundImage = `url(./images/cart.png)`
                div.innerHTML = data.name
            }
        }

        if (p < 0) {
            this.grid.classList.add("leftAnimation")
        } else if (p > 0) {
            this.grid.classList.add("rightAnimation")
        }
    }

    private generatePaging() {
        for (let i = 0; i < this.numpages; i++) {
            let div = document.createElement("div")
            div.innerHTML = (i + 1).toString()
            this.paging.appendChild(div)
            if (i == 0) div.classList.add("selected")

            // random cartridge color
            div.style.filter = `hue-rotate(160deg);`
        }
    }
        
    public selectRow(dir: number) {
        // row 3 + down = jump to navigation
        if(this.position.row == 3 && dir == 1) {
            App.instance.focusNavigation()
        } else {
            this.calculateColumn(dir)
        }
    }

    // todo better way to navigate between game cartridge columns
    // the game row has 8 columns - but they are displayed as two rows with 4 columns. 
    // the if statements allow jumping between columns with the up/down buttons
    private calculateColumn(dir:number){
        if (this.position.row == 3 && dir == -1) {
            this.position.row = 2
            this.position.col = 4
        } else if (this.position.row == 2 && this.position.col < 4 && dir == 1) {
            this.position.col += 4
        } else if (this.position.row == 2 && this.position.col > 3 && dir == -1) {
            this.position.col -= 4
        } else {
            // selecteer nieuwe row binnen min en max aantal rows
            this.position.row = Math.min(Math.max(this.position.row + dir, 0), this.menu.length - 1)
            this.position.col = 0
        }
        
        // als we naar de paging row zijn gegaan, dan is de column de huidige page
        if (this.position.row == 3) {
            this.position.col = this.page
        }

        this.updateSelection()
    }

    public selectColumn(dir: number) {
        // TODO als we in de games row zijn, dan kan je met links/rechts ook naar een nieuwe page gaan
        //if (this.position.row == 2 && this.position.col == 0 && dir == -1) {
        //    this.generateGamePage(dir)
        //}

        let maxColumn = this.menu[this.position.row].length - 1
        this.position.col = Math.min(Math.max(this.position.col + dir, 0), maxColumn)

        // als we in de paging row zijn, dan meteen de nieuwe page tonen
        if (this.position.row == 3) {
            this.generateGamePage(dir)
        }

        this.updateSelection()
    }
    

    private updateSelection() {
        this.clearRow(this.position.row)

        // TODO cleanup - ONLY if there is a selected cartridge, the others need to be unselected
        if (this.position.row == 2) {
            for (let c of this.menu[2]) {
                c.classList.add("unselected")
            }
        } else {
            for (let c of this.menu[2]) {
                c.classList.remove("unselected")
            }
        }

        // remove cursor from wherever it is now
        let c = this.querySelector(".cursor")
        if (c) c.classList.remove("cursor")

        // add selectbox and cursor box to current position
        this.getSelectedElement().classList.add("selected", "cursor")
    }

    private clearRow(row: number) {
        let arr = Array.from(this.menu[row])
        for (let b of arr) {
            b.classList.remove("selected")
        }
    }

    private getSelectedElement() {
        return this.menu[this.position.row][this.position.col]
    }


    // button pressed may be called by spacebar and arcade stick fire button 
    public pressButton() {
        if (this.position.row == 2) {
            this.gotoGame(this.position.col)
        }
    }

    private gotoGame(index: number) {
        window.location.href = this.data[index].url
    }

    // not possible to detect unloaded css bg images
    private cartBgNotLoaded(div: HTMLElement, data: GameData) {
        div.innerHTML = "NOT LOADED"
    }

}

window.customElements.define("game-page", GamePage);