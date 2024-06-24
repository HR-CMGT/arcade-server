export class AnimatedLogo extends HTMLElement {

    pre
    logoArt

    constructor() {
        super()

        this.logoArt = `
 ██████╗███╗   ███╗ ██████╗████████╗     █████╗ ██████╗  ██████╗ █████╗ ██████╗ ███████╗
██╔════╝████╗ ████║██╔════╝╚══██╔══╝    ██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝
██║     ██╔████╔██║██║  ███╗  ██║       ███████║██████╔╝██║     ███████║██║  ██║█████╗  
██║     ██║╚██╔╝██║██║   ██║  ██║       ██╔══██║██╔══██╗██║     ██╔══██║██║  ██║██╔══╝  
╚██████╗██║ ╚═╝ ██║╚██████╔╝  ██║       ██║  ██║██║  ██║╚██████╗██║  ██║██████╔╝███████╗
 ╚═════╝╚═╝     ╚═╝ ╚═════╝   ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝ ╚══════╝
 `
        
        this.pre = document.createElement("pre")
        this.pre.classList.add("rainbow")
        this.pre.innerHTML = this.logoArt
        this.appendChild(this.pre)

        this.update()
    }

    //
    // called by main app update
    //
    update(){
        // todo more fun animation  

        // const currentText = this.pre.innerText;
        // const index = Math.floor(Math.random() * currentText.length);
        // const chosenCharacter = currentText[index];

        // if (chosenCharacter !== "\n" && chosenCharacter !== "\r") {
        //     const newText = currentText.substring(0, index) + " " + currentText.substring(index + 1);
        //     this.pre.innerText = newText;
        // }

        // // but if its alrady a space put the orignal character back
        // if (chosenCharacter === " ") {
        //     const newText = currentText.substring(0, index) + this.logoArt[index] + currentText.substring(index + 1);
        //     this.pre.innerText = newText;
        // }


    }
}