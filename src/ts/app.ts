import '../css/style.css'
import '../css/animations.css'
import { GameData } from './interface.ts'
import { Joystick } from './joystick.ts'
import { GameMenu } from './gamemenu.ts'
import { Paging } from './paging.ts'
import { CreditsMenu } from './creditsmenu.ts'



export class App {

    public static instance : App
    public selectedRow : number = 0

    private joystick : Joystick
    private allowSound : boolean = true
    private audio:HTMLAudioElement
    private container : HTMLElement
    private gameMenu : GameMenu
    private paging: Paging
    private creditsMenu : CreditsMenu

    constructor(){
        App.instance = this
        this.loadGames()
    }

    private loadGames(){
        fetch("./data/games.json")
            .then(res => res.json())
            .then(data => this.initApp(data))
            .catch(error => console.log(error))
    }

    private initApp(data:GameData[]){
        this.joystick = new Joystick(2)


        // remove animations
        this.container = document.querySelector("foreground")! as HTMLElement   // test on foreground, background, container
        this.container.addEventListener("animationend", () => {
            this.container.classList.remove("monitorEffect")
        })       

        // joystick, keyboard events
        document.addEventListener("cursorX", (e: Event) => this.joyStickX(e as CustomEvent))
        document.addEventListener("cursorY", (e: Event) => this.joyStickY(e as CustomEvent))
        document.addEventListener("button0", () => this.getSelectedMenu().buttonPressed())
        document.addEventListener("keydown", (e:KeyboardEvent)=>this.onKeyDown(e))

        // create the three menus
        this.createNavigation(data)

        // audio check
        this.allowSound = (localStorage.getItem('sound') == "true") ? true : false
        this.audio = new Audio()
        this.updateAudio()
        this.update()


        /* instead of having a css animation constantly running, sporadically add it */
        setInterval(() => {
            //console.log("adding animation effect")
            this.container.classList.add("monitorEffect")
        }, 40000)

        this.container.classList.add("monitorEffect")
        
    }


    //
    // row position 0    = gamemenu
    // row position 1    = gamemenu
    // row position 2    = gamemenu
    // row position 3    = paging menu
    // row position 4    = credits menu
    //
    private createNavigation(data:GameData[]){
        this.selectedRow = 0
        this.gameMenu = new GameMenu(data)
        this.paging = new Paging(data.length)
        this.creditsMenu = new CreditsMenu()

        this.container.append(this.gameMenu)
        this.container.append(this.paging)
        this.container.append(this.creditsMenu)
    }

    private selectRow(dir: number){
        this.selectedRow = Math.min(Math.max(this.selectedRow + dir, 0), 4)
    }
    
    // todo just ask the current active menu what to do with the CHANGE ROW command
    private getSelectedMenu() : GameMenu | CreditsMenu | Paging {
        switch(this.selectedRow){
            case 0:
            case 1:
            case 2:
                return this.gameMenu
            case 3:
                return this.paging
            case 4:
                return this.creditsMenu
            default:
                console.error("unknown row")
                return this.gameMenu
        }
    }

    

    //
    // handle joystick, todo merge with keyboard code
    //
    private joyStickX(e: CustomEvent) {
        this.getSelectedMenu().clearCursor()
        let direction = e.detail
        this.getSelectedMenu().selectPosition(direction)
        this.getSelectedMenu().updateCursor()
    }
    private joyStickY(e: CustomEvent) {
        this.getSelectedMenu().clearCursor()
        let direction = e.detail
        this.selectRow(direction)
        this.getSelectedMenu().updateCursor()
    }
    //
    // handle keyboard
    //
    private onKeyDown(e: KeyboardEvent) {
        // remove current cursor selection
        this.getSelectedMenu().clearCursor()


        // Move right
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            this.getSelectedMenu().selectPosition(1);
        }

        // Move left
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            this.getSelectedMenu().selectPosition(-1);
        }

        // Move down
        if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
            this.selectRow(1);
        }

        // Move up
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
            this.selectRow(-1);
        }

        // confirm 
        if (e.key === 'Enter' || e.key.toLowerCase() === 'e' || e.key.toLowerCase() === ' ') {
            this.getSelectedMenu().buttonPressed()
        }

        this.getSelectedMenu().updateCursor()
    }

    public toggleSound(){
        this.allowSound = !this.allowSound
        localStorage.setItem('sound', String(this.allowSound))
        this.updateAudio()
    }

    private updateAudio(){
        if (this.allowSound) {
            this.audio.src = "./sound/bgmusic.mp3";

            let promise = this.audio.play()
            if (promise !== undefined) {
                promise.then(_ => {
                    // Autoplay started!
                    // console.log("Playing audio")
                }).catch(error => {
                    // Autoplay was prevented.
                    // User interaction with audio button will allow playback, set it to off
                    console.error("AUDIO FOUT " + error)
                    this.toggleSound()
                });
            }
        } else {
            this.audio.pause()
        }
        // display sound status
        this.creditsMenu.updateSound(this.allowSound)
    }

    private update() {
        // gamepad has no event system, we have to poll the gamepad manually
        // TODO is joystick class nog nodig?
        this.joystick.update()
        requestAnimationFrame(() => this.update())
    }

}


customElements.define('game-grid', GameMenu)
customElements.define('page-menu', Paging)
customElements.define('credits-menu', CreditsMenu)


new App()