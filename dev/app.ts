class App {
    private joystick : Joystick
    private position : Grid = {row:0, col:0}
    private grid : HTMLCollection[] = []                    // een array van htmlcollections
    private data : GameData[]

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
        // add eight game divs to game rows
        // TODO paging system for more than eight games
        // TODO CSS grid of flex-wrap in enkele loop
        for(let i = 0; i<4; i++) {
            let div = document.createElement("div")
            document.querySelectorAll(".game-row")[0].appendChild(div)
            div.innerHTML = this.data[i].name
        }
        for (let i = 4; i < 8; i++) {
            let div = document.createElement("div")
            document.querySelectorAll(".game-row")[1].appendChild(div)
            div.innerHTML = this.data[i].name
        }

        // create rows of buttons
        this.grid.push(document.querySelector("#player-menu")!.children)
        this.grid.push(document.querySelector("#genre-menu")!.children)
        this.grid.push(document.querySelectorAll(".game-row")[0]!.children)
        this.grid.push(document.querySelectorAll(".game-row")[1]!.children)
        this.grid.push(document.querySelector("#page-menu")!.children)
        this.grid.push(document.querySelector("#credits-menu")!.children)
    
        this.joystick = new Joystick(6)

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

        this.update()
    }

    private selectRow(dir:number){
        // selecteer nieuwe row binnen min en max aantal rows
        this.position.row = Math.min(Math.max(this.position.row + dir, 0), this.grid.length - 1)
        // pas selected column ook aan, aan max columns van deze row, want het kan gebeuren dat deze rij minder columns heeft
        this.selectColumn(0)
    }

    private selectColumn(dir:number){
        let row = this.position.row
        let maxColumn = this.grid[row].length - 1
        this.position.col = Math.min(Math.max(this.position.col + dir, 0), maxColumn)
        this.updateSelection()
    }

    private updateSelection(){
        this.clearRow(this.position.row)
        
        // als we in een game row zijn, dan ook de andere game row leeg maken
        if (this.position.row == 2) this.clearRow(3)
        if (this.position.row == 3) this.clearRow(2)
        
        // row 5 altijd clear als we daar niet zijn
        if (this.position.row != 5) {
            this.clearRow(5)
        }
        let c = document.querySelector(".cursor")
        if(c) c.classList.remove("cursor")

        this.getSelectedElement().classList.add("selected", "cursor")
    }

    private clearRow(row:number){
        let buttons: HTMLCollection = this.grid[row]
        let arr = Array.from(buttons)
        for (let b of arr) {
            b.classList.remove("selected")
        }
    }

    private getSelectedElement(){
        return this.grid[this.position.row][this.position.col]
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