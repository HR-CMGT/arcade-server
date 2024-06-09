import { clamp } from './interface.ts'

export class CreditsMenu extends HTMLElement {

    private selection = 0
    private allowSound = true
    private audio: HTMLAudioElement

    constructor() {
        super() 

        const menutexts = [
            "🔈: ON",
            "Add your own game!",
            "About CMGT"
        ]
        for (let text of menutexts) {
            const div = document.createElement("div")
            div.innerHTML = text
            this.append(div)
        }

        // audio check
        this.allowSound = (localStorage.getItem('sound') == "true") ? true : false
        this.audio = new Audio()
        this.updateAudio()
    }

    // @ts-ignore
    public allowRowChange(dir:number) {
        return true
    }

    public selectColumn(dir: number) {
        this.selection = clamp(this.selection + dir, 0, this.children.length - 1)
    }

    public updateCursor() {
        this.children[this.selection].classList.add("cursor")
    }

    public clearCursor() {
        this.children[this.selection].classList.remove("cursor")
    }

    // button pressed may be called by spacebar and arcade stick fire button 
    public buttonPressed() {
        switch (this.selection) {
        case 0:
            this.toggleSound();
            break;
        case 1:
            window.location.href = "./pages/addgame.html"
            break;
        case 2:
            // About CMGT logic here
            break;
        }
    }
 

    public toggleSound() {
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
        this.children[0].innerHTML = (this.allowSound) ? "🔊:ON" : "🔇:OFF"
    }
}