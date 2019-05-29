class App {

    public static instance : App
    private joystick : Joystick
    private allowSound : boolean = true
    private audio:HTMLAudioElement
    private gridMenu : GridMenu
    private container : HTMLElement

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
        this.joystick = new Joystick(2)
        this.gridMenu = new GridMenu(data)

        this.container = document.querySelector("foreground")! as HTMLElement   // test on foreground, background, container
        this.container.addEventListener("animationend", () => {
            console.log("removing animation effect")
            this.container.classList.remove("monitorEffect")
        })       

        document.addEventListener("cursorX", (e: Event)=> this.gridMenu.selectColumn((e as CustomEvent).detail))
        document.addEventListener("cursorY", (e: Event) => this.gridMenu.selectRow((e as CustomEvent).detail))

        document.addEventListener("button0", () => this.gridMenu.buttonPressed())
        document.addEventListener("keydown", (e:KeyboardEvent)=>this.onKeyDown(e))

        // audio check
        this.allowSound = (localStorage.getItem('sound') == "true") ? true : false
        this.audio = new Audio()
        this.updateAudio()
        this.update()


        /* instead of having a css animation constantly running, sporadically add it */
        setInterval(() => {
            console.log("adding animation effect")
            this.container.classList.add("monitorEffect")
        }, 40000)

        this.container.classList.add("monitorEffect")
    }

    private onKeyDown(e:KeyboardEvent) {
        let charCode = e.which

        // Move right
        if (charCode == 39 || charCode == 68) {
            this.gridMenu.selectColumn(1)
        }

        // Move left
        if (charCode == 37 || charCode == 65) {
            this.gridMenu.selectColumn(-1)
        }

        // Move down
        if (charCode == 40 || charCode == 83) {
            this.gridMenu.selectRow(1)
        }

        // Move up
        if (charCode == 38 || charCode == 87) {
            this.gridMenu.selectRow(-1)
        }

        // confirm selection, only needed for games and for credits/instructions/about pages
        if (charCode == 69 || charCode == 75 || charCode == 32) {
            this.gridMenu.buttonPressed()
        }
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
                    console.log("Playing audio")
                }).catch(error => {
                    // Autoplay was prevented.
                    // User interaction with audio button will allow playback, set it to off
                    console.log("FOUT " + error)
                    this.toggleSound()
                });
            }
        } else {
            this.audio.pause()
        }
        // display sound status
        this.gridMenu.updateSound(this.allowSound)
    }

    private update() {
        // gamepad has no event system, we have to poll the gamepad manually
        this.joystick.update()
        
        requestAnimationFrame(() => this.update())
    }

}

window.addEventListener("load", ()=> new App())