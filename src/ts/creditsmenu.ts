import { clamp } from './interface.ts'
import { App } from './app'

export class CreditsMenu extends HTMLElement {

    private selection = 0

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
    }

    public selectPosition(dir: number) {
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
            App.instance.toggleSound();
            break;
        case 1:
            window.location.href = "./src/pages/addgame.html"
            break;
        case 2:
            // About CMGT logic here
            break;
        }
        // 1 = credits
        // 2 = instructions
        // 3 = about CMGT
    }
    public updateSound(b: Boolean) {
        this.children[0].innerHTML = (b) ? "🔊:ON" : "🔇:OFF"
    }
}