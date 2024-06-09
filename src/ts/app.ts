import '../css/style.css'
import '../css/animations.css'
import { GameData, clamp } from './utils.ts'
import { Joystick } from './joystick.ts'
import { GameMenu } from './gamemenu.ts'
import { Paging } from './paging.ts'
import { CreditsMenu } from './creditsmenu.ts'
// import { createAnimatedLogo } from './utils.ts'
import { AnimatedLogo } from './animatedlogo.ts'

export class App extends HTMLElement {

    private selectedRow: number = 0
    private joystick: Joystick
    private menus : [GameMenu, Paging, CreditsMenu]
    private animatedLogo: AnimatedLogo

    constructor() {
        super()

        fetch("./data/games.json")
            .then(res => res.json())
            .then(data => this.initApp(data))
            .catch(error => console.log(error))
    }

    private initApp(data: GameData[]) {
        // joystick, keyboard events
        this.joystick = new Joystick(2)
        document.addEventListener("cursorX", (e: Event) => this.userSelectedColumn((e as CustomEvent).detail))
        document.addEventListener("cursorY", (e: Event) => this.userSelectedRow((e as CustomEvent).detail))
        document.addEventListener("button0", () => this.getSelectedMenu().buttonPressed())
        document.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))

        // create the three menus
        this.createNavigation(data)

        // start the gamepad listener
        this.update()

        // instead of having a css animation constantly running, sporadically add it
        setInterval(() => this.classList.add("monitorEffect"), 40000)
        this.classList.add("monitorEffect")
        this.addEventListener("animationend", () => this.classList.remove("monitorEffect"))
    }

    // row position 0    = gamemenu
    // row position 1    = paging menu
    // row position 2    = credits menu
    private createNavigation(data: GameData[]) {
        this.animatedLogo = new AnimatedLogo()
        this.append(this.animatedLogo)

        this.selectedRow = 0
        this.menus = [new GameMenu(data), new Paging(data.length), new CreditsMenu()]
        for(let menu of this.menus) {
            this.append(menu)
        }
    }

   
    //
    // user selection updated by either joystick or keyboard
    //
    private userSelectedRow(dir: number) {
        this.getSelectedMenu().clearCursor()
        // remains a bit hacky. the game menu has 3 sub rows. the game menu only allows row change when moving down from the lowest row.
        if (this.getSelectedMenu().allowRowChange(dir)) {
            this.selectedRow = clamp(this.selectedRow + dir, 0, this.menus.length - 1);
        }
        this.getSelectedMenu().updateCursor()
    }

    private userSelectedColumn(dir: number) {
        this.getSelectedMenu().clearCursor()
        this.getSelectedMenu().selectColumn(dir)
        this.getSelectedMenu().updateCursor()
    }

    private getSelectedMenu(): GameMenu | CreditsMenu | Paging {
        return this.menus[this.selectedRow]
    }

    //
    // handle keyboard
    //
    private onKeyDown(e: KeyboardEvent) {
         // Move right, left
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            this.userSelectedColumn(1);
        }
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            this.userSelectedColumn(-1);
        }
        // Move down, up
        if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
            this.userSelectedRow(1);
        }
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
            this.userSelectedRow(-1);
        }
        // confirm , hier hoeft cursor eigenlijk niet te updaten
        if (e.key === 'Enter' || e.key.toLowerCase() === 'e' || e.key.toLowerCase() === ' ') {
            this.getSelectedMenu().buttonPressed()
        }
    }

    

    private update() {
        // gamepad has no event system, we have to poll the gamepad manually // TODO is joystick class nog nodig?
        this.joystick.update()
        this.animatedLogo.update()
        requestAnimationFrame(() => this.update())
    }

}


//
// note: the app starts automatically because the "<main-application>" tag is in the index.html
//
customElements.define('main-application', App)
customElements.define('animated-logo', AnimatedLogo)
customElements.define('game-grid', GameMenu)
customElements.define('page-menu', Paging)
customElements.define('credits-menu', CreditsMenu)