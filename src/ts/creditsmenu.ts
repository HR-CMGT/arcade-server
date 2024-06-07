import { clamp } from './interface.ts'
import { App } from './app'

export class CreditsMenu {

    private selection = 0
    private container: Element

    constructor() {
        const menutexts = [
            "SOUND: ON",
            "Credits",
            "Instructions",
            "About CMGT"
        ]
        this.container = document.querySelector("credits-menu")!
        for (let text of menutexts) {
            const div = document.createElement("div")
            div.innerHTML = text
            this.container.append(div)
        }
    }

    public selectPosition(dir: number) {
        this.selection = clamp(this.selection + dir, 0, this.container.children.length - 1)
    }

    public updateCursor() {
        this.container.children[this.selection].classList.add("cursor")
    }

    public clearCursor() {
        this.container.children[this.selection].classList.remove("cursor")
    }

    // button pressed may be called by spacebar and arcade stick fire button 
    public buttonPressed() {
        if (this.selection == 0) {
            App.instance.toggleSound()
        }
        // 1 = credits
        // 2 = instructions
        // 3 = about CMGT
    }
    public updateSound(b: Boolean) {
        this.container.children[0].innerHTML = (b) ? "SOUND:ON" : "SOUND:OFF"
    }
}