class Navigation extends HTMLElement implements InputListener {

    private allowSound: boolean = false
    private audio: HTMLAudioElement
    private page: number = 0
    private buttons : NodeListOf<HTMLDivElement>

    constructor() {
        super()
    }

    connectedCallback(){
        this.buttons = this.querySelectorAll("div")

        // audio check
        this.allowSound = (localStorage.getItem('sound') == "true") ? true : false
        this.audio = new Audio()
        this.updateAudio()
    }

    public selectColumn(dir:number){
        this.page = Math.min(Math.max(this.page + dir, 0), 4)
        this.updateCursor()
    }

    public selectRow(dir: number) {
        if (dir == -1) {
            this.clearCursor()
            
            // OPTIONAL selecteer meteen deze page
            // this.pressButton()

            App.instance.focusPage()
        }
    }

    private clearCursor() {
        let c = document.querySelector(".cursor")
        if (c) c.classList.remove("cursor")

        let s = this.querySelector(".selected")
        if (s) s.classList.remove("selected")
    }

    private updateCursor() {
        this.clearCursor()
        this.buttons[this.page].classList.add("selected", "cursor")
    }



    public pressButton() {
  
        if (this.page == 4) {
            this.toggleSound()
        } else {
            // this.clearCursor()
            switch (this.page) {
            case 0:
                App.instance.buildTemplate(new GamePage())
                break;
            case 1:
                App.instance.buildTemplate(new InstructionsPage())
                break;
            case 2:
                App.instance.buildTemplate(new CreditsPage())
                break;
            case 3:
                App.instance.buildTemplate(new AboutPage())
                break;
            }
        }
    }

    private toggleSound() {
        this.allowSound = !this.allowSound
        localStorage.setItem('sound', String(this.allowSound))
        this.updateAudio()
    }

    private updateAudio() {
        if (this.allowSound) {
            this.audio.src = "./sound/bgmusic.mp3";

            let promise = this.audio.play()
            if (promise !== undefined) {
                promise.then(_ => {
                    // Autoplay started!
                }).catch(error => {
                    // Autoplay was prevented.
                    // User interaction with audio button will allow playback, set it to off
                    console.log("Foutje! " + error)
                    this.toggleSound()
                });
            }
        } else {
            this.audio.pause()
        }

        this.buttons[4].innerHTML = (this.allowSound) ? "SOUND:ON" : "SOUND:OFF"
    }

}

window.customElements.define("navigation-page", Navigation);