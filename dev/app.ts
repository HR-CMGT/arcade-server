class App {
    private joystick : Joystick
    private position : Grid = {row:0, col:0}
    private menu : HTMLCollection[] = []                    // een array van htmlcollections
    private data : GameData[]
    private grid : Element
    private page : number = 0
    private numpages : number = 1
    private paging : Element

    constructor(){
        this.loadGames()
    }

    private loadGames(){
        fetch("./data/games.json")
            .then(res => res.json())
            .then(data => this.initMenus(data))
            .catch(error => console.log(error))
    }

    private initMenus(data:GameData[]){
        this.data = data
        this.page = 0
        this.numpages = Math.ceil(this.data.length/8)
        this.grid = document.querySelector("#game-grid")!
        this.paging = document.querySelector("#page-menu")!

        // generate game page with 8 thumbnails
        this.generateGamePage(this.page)
        this.generatePaging()

        // create rows of buttons - TODO just store the amount of rows and columns!
        this.menu.push(document.querySelector("#player-menu")!.children)
        this.menu.push(document.querySelector("#genre-menu")!.children)
        this.menu.push(document.querySelector("#game-grid")!.children)
        this.menu.push(document.querySelector("#page-menu")!.children)
        this.menu.push(document.querySelector("#credits-menu")!.children)
    
        this.joystick = new Joystick(2)

        document.addEventListener("cursorX", (e:Event)=> {
            //console.log("X GAMEPAD " + (e as CustomEvent).detail)
            this.selectColumn((e as CustomEvent).detail)
        })
        document.addEventListener("cursorY", (e: Event) => {
            //console.log("Y GAMEPAD " + (e as CustomEvent).detail)
            this.selectRow((e as CustomEvent).detail)
        })

        document.addEventListener("button0", () => this.selectGame())
        document.addEventListener("keydown", (e:KeyboardEvent)=>this.onKeyDown(e))

        this.grid.addEventListener("animationend", () => {
            this.grid.classList.remove("leftAnimation", "rightAnimation")
        })

        this.update()
    }

    private generateGamePage(p:number) {
        this.page = Math.min(Math.max(this.page + p, 0), this.numpages - 1)
        this.grid.innerHTML = ""
        
        let start = this.page * 8
        let num = Math.min(this.data.length - start, 8)
        
        for (let i = start; i < start+num; i++) {
            let div = document.createElement("div")
            this.grid.appendChild(div)
            div.innerHTML = this.data[i].name
        }

        if(p < 0) {
            this.grid.classList.add("leftAnimation")
        } else if (p > 0) {
            this.grid.classList.add("rightAnimation")
        }
    }

    private generatePaging(){
        for(let i = 0; i<this.numpages; i++) {
            let div = document.createElement("div")
            div.innerHTML = (i+1).toString()
            this.paging.appendChild(div)
            if(i == 0) div.classList.add("selected")
        }
    }

    private selectRow(dir:number){
        // the game grid really has 8 columns - but they are displayed as two rows with 4 columns in a grid
        // this if statement adds the ability to switch vertically between columns
        if (this.position.row == 2 && this.position.col < 4 && dir == 1) {
            this.position.col += 4
        } else if (this.position.row == 2 && this.position.col > 3 && dir == -1) {
            this.position.col -= 4
        } else {
            // selecteer nieuwe row binnen min en max aantal rows
            this.position.row = Math.min(Math.max(this.position.row + dir, 0), this.menu.length - 1)
            this.position.col = 0
        }

        // als we naar de page row zijn gegaan, dan is de column de huidige page
        if(this.position.row == 3) {
            this.position.col = this.page
        }

        this.updateSelection()
    }

    private selectColumn(dir:number){
        // TODO als we in de games row zijn, dan kan je met links/rechts ook naar een nieuwe page gaan
        //if (this.position.row == 2 && this.position.col == 0 && dir == -1) {
        //    this.generateGamePage(dir)
        //}

        let maxColumn = this.menu[this.position.row].length - 1
        this.position.col = Math.min(Math.max(this.position.col + dir, 0), maxColumn)      

        // als we in de paging row zijn, dan meteen de nieuwe page tonen
        if(this.position.row == 3) {
            this.generateGamePage(dir)
        }
        
        this.updateSelection()
    }

    private updateSelection(){
        this.clearRow(this.position.row)
                
        // bottom row altijd clear als we daar niet zijn
        if (this.position.row != 4) {
            this.clearRow(4)
        }

        let c = document.querySelector(".cursor")
        if(c) c.classList.remove("cursor")

        this.getSelectedElement().classList.add("selected", "cursor")
    }

    private clearRow(row:number){
        let buttons: HTMLCollection = this.menu[row]
        let arr = Array.from(buttons)
        for (let b of arr) {
            b.classList.remove("selected")
        }
    }

    private getSelectedElement(){
        return this.menu[this.position.row][this.position.col]
    }

    private onKeyDown(e:KeyboardEvent) {
        let charCode = e.which

        // Move right
        if (charCode == 39 || charCode == 68) {
            this.selectColumn(1)
        }

        // Move left
        if (charCode == 37 || charCode == 65) {
            this.selectColumn(-1)
        }

        // Move down
        if (charCode == 40 || charCode == 83) {
            this.selectRow(1)
        }

        // Move up
        if (charCode == 38 || charCode == 87) {
            this.selectRow(-1)
        }

        // confirm selection, only needed for games
        if (charCode == 69 || charCode == 75 || charCode == 32) {
            this.selectGame()
        }
    }

    private selectGame(){
        // TODO niet handig
        if (this.position.row == 2) {
            this.gotoGame(this.position.col)
        }
        if (this.position.row == 3) {
            this.gotoGame(this.position.col + 4)
        }
    }

    private gotoGame(index:number){
        console.log(this.data[index])
        window.location.href = this.data[index].url
    }

    private update() {
        if(Math.random() > 0.99) {
            document.body.classList.add("zoom")
        } else if (Math.random() > 0.9) {
            document.body.classList.remove("zoom")
        }

        // gamepad has no event system, we have to poll the gamepad manually
        this.joystick.update()
        
        requestAnimationFrame(() => this.update())
    }

}

window.addEventListener("load", ()=> new App())