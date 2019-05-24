class App {

    public static instance : App
    public data : GameData[]

    private joystick : Joystick
    private activePage: HTMLElement & InputListener       // the element that should receive events (either the bottom navigation or the active element)
    private visiblePage: HTMLElement & InputListener      // the web component that is displayed in the page slot
    private navigation: Navigation

    // TODO CONVERT GIF TO MP4 FOR PERFORMANCE !!!

    constructor(){
        App.instance = this
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
        
        this.navigation = document.querySelector("navigation-page")! as Navigation
        this.joystick = new Joystick(2)

        // app receives all events and passes them to the active element -  the bottom nav bar or the game page
        document.addEventListener("cursorX", (e: Event) => this.activePage.selectColumn((e as CustomEvent).detail))
        document.addEventListener("cursorY", (e: Event) => this.activePage.selectRow((e as CustomEvent).detail))

        document.addEventListener("button0", () => this.activePage.pressButton())
        document.addEventListener("keydown", (e:KeyboardEvent)=>this.onKeyDown(e))
      
        // start with a page and set it as the active page
        this.buildTemplate(new GamePage())
        this.focusPage()

        this.update()
    }

    // usage: buildTemplate(new InstructionsPage())
    // the type should be an HTMLelement with the InputListener
    public buildTemplate(page:HTMLElement & InputListener) {
        if (this.visiblePage) this.visiblePage.remove()
        this.visiblePage = page    
    }

    // when you press down in a visible page, the main navigation becomes active
    public focusNavigation() {
        this.activePage = this.navigation
        this.navigation.selectColumn(0)
    }
    // for now, only the game page needs cursor navigation
    public focusPage() {
        this.activePage = this.visiblePage
        this.activePage.selectColumn(0)
    }
    
    private onKeyDown(e:KeyboardEvent) {
        let charCode = e.which

        // Move right
        if (charCode == 39 || charCode == 68) {
            this.activePage.selectColumn(1)
        }

        // Move left
        if (charCode == 37 || charCode == 65) {
            this.activePage.selectColumn(-1)
        }

        // Move down
        if (charCode == 40 || charCode == 83) {
            this.activePage.selectRow(1)
        }

        // Move up
        if (charCode == 38 || charCode == 87) {
            this.activePage.selectRow(-1)
        }

        // confirm selection, only needed for games
        if (charCode == 69 || charCode == 75 || charCode == 32) {
            this.activePage.pressButton()
        }
    }


    private update() {
        // the joystick needs a gameloop because gamepad has no event system
        this.joystick.update()
        
        requestAnimationFrame(() => this.update())
    }

}

window.addEventListener("load", ()=> new App())