"use strict";
class App {
    constructor() {
        App.instance = this;
        this.loadGames();
    }
    loadGames() {
        fetch("./data/games.json")
            .then(res => res.json())
            .then(data => this.initMenus(data))
            .catch(error => console.log(error));
    }
    initMenus(data) {
        this.data = data;
        this.navigation = document.querySelector("navigation-page");
        this.joystick = new Joystick(2);
        document.addEventListener("cursorX", (e) => this.activePage.selectColumn(e.detail));
        document.addEventListener("cursorY", (e) => this.activePage.selectRow(e.detail));
        document.addEventListener("button0", () => this.activePage.pressButton());
        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        this.buildTemplate(new GamePage());
        this.focusPage();
        this.update();
    }
    buildTemplate(page) {
        if (this.visiblePage)
            this.visiblePage.remove();
        this.visiblePage = page;
    }
    focusNavigation() {
        this.activePage = this.navigation;
        this.navigation.selectColumn(0);
    }
    focusPage() {
        this.activePage = this.visiblePage;
        this.activePage.selectColumn(0);
    }
    onKeyDown(e) {
        let charCode = e.which;
        if (charCode == 39 || charCode == 68) {
            this.activePage.selectColumn(1);
        }
        if (charCode == 37 || charCode == 65) {
            this.activePage.selectColumn(-1);
        }
        if (charCode == 40 || charCode == 83) {
            this.activePage.selectRow(1);
        }
        if (charCode == 38 || charCode == 87) {
            this.activePage.selectRow(-1);
        }
        if (charCode == 69 || charCode == 75 || charCode == 32) {
            this.activePage.pressButton();
        }
    }
    update() {
        this.joystick.update();
        requestAnimationFrame(() => this.update());
    }
}
window.addEventListener("load", () => new App());
class AboutPage extends HTMLElement {
    constructor() {
        super();
        let container = document.querySelector("#content-page");
        let template = document.getElementById('aboutpage');
        container.appendChild(this);
        this.appendChild(template.content.cloneNode(true));
    }
    selectColumn(dir) {
        this.classList.add("cursor");
    }
    selectRow(dir) {
        if (dir == 1) {
            this.classList.remove(".cursor");
            App.instance.focusNavigation();
        }
    }
    pressButton() {
    }
}
window.customElements.define("about-page", AboutPage);
class CreditsPage extends HTMLElement {
    constructor() {
        super();
        let container = document.querySelector("#content-page");
        let template = document.getElementById('creditspage');
        container.appendChild(this);
        this.appendChild(template.content.cloneNode(true));
    }
    selectColumn(dir) {
        this.classList.add("cursor");
    }
    selectRow(dir) {
        if (dir == 1) {
            this.classList.remove(".cursor");
            App.instance.focusNavigation();
        }
    }
    pressButton() {
    }
}
window.customElements.define("credits-page", CreditsPage);
class GamePage extends HTMLElement {
    constructor() {
        super();
        this.position = { row: 0, col: 0 };
        this.menu = [];
        this.page = 0;
        this.numpages = 1;
        let container = document.querySelector("#content-page");
        let template = document.getElementById('gamepage');
        container.appendChild(this);
        this.appendChild(template.content.cloneNode(true));
        this.data = App.instance.data;
        this.page = 0;
        this.numpages = Math.ceil(this.data.length / 8);
        this.grid = document.querySelector("#game-grid");
        this.paging = document.querySelector("#page-menu");
        this.generateGamePage(this.page);
        this.generatePaging();
        this.menu.push(document.querySelector("#player-menu").children);
        this.menu.push(document.querySelector("#genre-menu").children);
        this.menu.push(document.querySelector("#game-grid").children);
        this.menu.push(document.querySelector("#page-menu").children);
        this.grid.addEventListener("animationend", () => {
            this.grid.classList.remove("leftAnimation", "rightAnimation");
        });
    }
    generateGamePage(p) {
        this.page = Math.min(Math.max(this.page + p, 0), this.numpages - 1);
        this.grid.innerHTML = "";
        let start = this.page * 8;
        let num = Math.min(this.data.length - start, 8);
        for (let i = start; i < start + num; i++) {
            let div = document.createElement("div");
            let data = this.data[i];
            this.grid.appendChild(div);
            div.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(0.75)`;
            let cover = data.cover;
            if (cover && cover != "") {
                div.style.backgroundImage = `url(./covers/${cover})`;
            }
            else {
                div.style.backgroundImage = `url(./images/cart.png)`;
                div.innerHTML = data.name;
            }
        }
        if (p < 0) {
            this.grid.classList.add("leftAnimation");
        }
        else if (p > 0) {
            this.grid.classList.add("rightAnimation");
        }
    }
    generatePaging() {
        for (let i = 0; i < this.numpages; i++) {
            let div = document.createElement("div");
            div.innerHTML = (i + 1).toString();
            this.paging.appendChild(div);
            if (i == 0)
                div.classList.add("selected");
            div.style.filter = `hue-rotate(160deg);`;
        }
    }
    selectRow(dir) {
        if (this.position.row == 3 && dir == 1) {
            App.instance.focusNavigation();
        }
        else {
            this.calculateColumn(dir);
        }
    }
    calculateColumn(dir) {
        if (this.position.row == 3 && dir == -1) {
            this.position.row = 2;
            this.position.col = 4;
        }
        else if (this.position.row == 2 && this.position.col < 4 && dir == 1) {
            this.position.col += 4;
        }
        else if (this.position.row == 2 && this.position.col > 3 && dir == -1) {
            this.position.col -= 4;
        }
        else {
            this.position.row = Math.min(Math.max(this.position.row + dir, 0), this.menu.length - 1);
            this.position.col = 0;
        }
        if (this.position.row == 3) {
            this.position.col = this.page;
        }
        this.updateSelection();
    }
    selectColumn(dir) {
        let maxColumn = this.menu[this.position.row].length - 1;
        this.position.col = Math.min(Math.max(this.position.col + dir, 0), maxColumn);
        if (this.position.row == 3) {
            this.generateGamePage(dir);
        }
        this.updateSelection();
    }
    updateSelection() {
        this.clearRow(this.position.row);
        if (this.position.row == 2) {
            for (let c of this.menu[2]) {
                c.classList.add("unselected");
            }
        }
        else {
            for (let c of this.menu[2]) {
                c.classList.remove("unselected");
            }
        }
        let c = this.querySelector(".cursor");
        if (c)
            c.classList.remove("cursor");
        this.getSelectedElement().classList.add("selected", "cursor");
    }
    clearRow(row) {
        let arr = Array.from(this.menu[row]);
        for (let b of arr) {
            b.classList.remove("selected");
        }
    }
    getSelectedElement() {
        return this.menu[this.position.row][this.position.col];
    }
    pressButton() {
        if (this.position.row == 2) {
            this.gotoGame(this.position.col);
        }
    }
    gotoGame(index) {
        window.location.href = this.data[index].url;
    }
    cartBgNotLoaded(div, data) {
        div.innerHTML = "NOT LOADED";
    }
}
window.customElements.define("game-page", GamePage);
class InstructionsPage extends HTMLElement {
    constructor() {
        super();
        let container = document.querySelector("#content-page");
        let template = document.getElementById('instructionspage');
        container.appendChild(this);
        this.appendChild(template.content.cloneNode(true));
    }
    selectColumn(dir) {
        this.classList.add("cursor");
    }
    selectRow(dir) {
        if (dir == 1) {
            this.classList.remove(".cursor");
            App.instance.focusNavigation();
        }
    }
    pressButton() {
    }
}
window.customElements.define("instructions-page", InstructionsPage);
class Navigation extends HTMLElement {
    constructor() {
        super();
        this.allowSound = false;
        this.page = 0;
    }
    connectedCallback() {
        this.buttons = this.querySelectorAll("div");
        this.allowSound = (localStorage.getItem('sound') == "true") ? true : false;
        this.audio = new Audio();
        this.updateAudio();
    }
    selectColumn(dir) {
        this.page = Math.min(Math.max(this.page + dir, 0), 4);
        this.updateCursor();
    }
    selectRow(dir) {
        if (dir == -1) {
            this.clearCursor();
            App.instance.focusPage();
        }
    }
    clearCursor() {
        let c = document.querySelector(".cursor");
        if (c)
            c.classList.remove("cursor");
        let s = this.querySelector(".selected");
        if (s)
            s.classList.remove("selected");
    }
    updateCursor() {
        this.clearCursor();
        this.buttons[this.page].classList.add("selected", "cursor");
    }
    pressButton() {
        if (this.page == 4) {
            this.toggleSound();
        }
        else {
            switch (this.page) {
                case 0:
                    App.instance.buildTemplate(new GamePage());
                    break;
                case 1:
                    App.instance.buildTemplate(new InstructionsPage());
                    break;
                case 2:
                    App.instance.buildTemplate(new CreditsPage());
                    break;
                case 3:
                    App.instance.buildTemplate(new AboutPage());
                    break;
            }
        }
    }
    toggleSound() {
        this.allowSound = !this.allowSound;
        localStorage.setItem('sound', String(this.allowSound));
        this.updateAudio();
    }
    updateAudio() {
        if (this.allowSound) {
            this.audio.src = "./sound/bgmusic.mp3";
            let promise = this.audio.play();
            if (promise !== undefined) {
                promise.then(_ => {
                }).catch(error => {
                    console.log("Foutje! " + error);
                    this.toggleSound();
                });
            }
        }
        else {
            this.audio.pause();
        }
        this.buttons[4].innerHTML = (this.allowSound) ? "SOUND:ON" : "SOUND:OFF";
    }
}
window.customElements.define("navigation-page", Navigation);
class Joystick {
    constructor(numOfButtons) {
        this.DEBUG = true;
        this.numberOfBUttons = 0;
        this.axes = [];
        this.isConnected = false;
        this.numberOfBUttons = numOfButtons;
        this.axes.push(0, 0);
        window.addEventListener("gamepadconnected", (e) => this.onGamePadConnected(e));
        window.addEventListener("gamepaddisconnected", () => this.onGamePadDisConnected());
        this.update();
    }
    get Left() {
        return (this.axes[0] == -1);
    }
    get Right() {
        return (this.axes[0] == 1);
    }
    get Up() {
        return (this.axes[1] == -1);
    }
    get Down() {
        return (this.axes[1] == 1);
    }
    onGamePadConnected(e) {
        if (this.DEBUG) {
            console.log('Game pad connected');
        }
        this.previousGamepad = e.gamepad;
        this.isConnected = true;
    }
    onGamePadDisConnected() {
        if (this.DEBUG) {
            console.log('Game pad disconnected');
        }
        this.isConnected = false;
    }
    update() {
        if (this.isConnected) {
            let gamepads = navigator.getGamepads();
            if (!gamepads) {
                return;
            }
            let gamepad = gamepads[0];
            if (gamepad) {
                for (let index = 0; index < this.numberOfBUttons; index++) {
                    if (this.buttonPressed(gamepad.buttons[index]) &&
                        !this.buttonPressed(this.previousGamepad.buttons[index])) {
                        document.dispatchEvent(new Event('button' + index));
                    }
                    if (Math.abs(gamepad.axes[0]) > 0.9 && Math.abs(this.previousGamepad.axes[0]) < 0.9) {
                        this.previousGamepad = gamepad;
                        document.dispatchEvent(new CustomEvent('cursorX', { detail: Math.round(gamepad.axes[0]) }));
                    }
                    if (Math.abs(gamepad.axes[1]) > 0.9 && Math.abs(this.previousGamepad.axes[1]) < 0.9) {
                        this.previousGamepad = gamepad;
                        document.dispatchEvent(new CustomEvent('cursorY', { detail: Math.round(gamepad.axes[1]) }));
                    }
                }
                this.axes = [Math.round(gamepad.axes[0]), Math.round(gamepad.axes[1])];
                this.previousGamepad = gamepad;
            }
        }
    }
    buttonPressed(b) {
        if (typeof (b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    }
}
//# sourceMappingURL=main.js.map