"use strict";
class App {
    constructor() {
        this.position = { row: 0, col: 0 };
        this.menu = [];
        this.page = 0;
        this.numpages = 1;
        this.allowSound = true;
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
        this.menu.push(document.querySelector("#credits-menu").children);
        this.menu[4][0].innerHTML = (this.allowSound) ? "SOUND:ON" : "SOUND:OFF";
        this.joystick = new Joystick(2);
        document.addEventListener("cursorX", (e) => {
            this.selectColumn(e.detail);
        });
        document.addEventListener("cursorY", (e) => {
            this.selectRow(e.detail);
        });
        document.addEventListener("button0", () => this.buttonPressed());
        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        this.grid.addEventListener("animationend", () => {
            this.grid.classList.remove("leftAnimation", "rightAnimation");
        });
        this.allowSound = Boolean(localStorage.getItem('sound'));
        this.audio = new Audio();
        this.updateAudio();
        this.update();
    }
    cartBgNotLoaded(div, data) {
        console.log(data.name);
        console.log(div);
        div.innerHTML = "NOT LOADED";
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
            div.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(0.6)`;
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
        if (this.position.row != 4) {
            this.clearRow(4);
        }
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
        let c = document.querySelector(".cursor");
        if (c)
            c.classList.remove("cursor");
        this.getSelectedElement().classList.add("selected", "cursor");
    }
    clearRow(row) {
        let buttons = this.menu[row];
        let arr = Array.from(buttons);
        for (let b of arr) {
            b.classList.remove("selected");
        }
    }
    getSelectedElement() {
        return this.menu[this.position.row][this.position.col];
    }
    onKeyDown(e) {
        let charCode = e.which;
        if (charCode == 39 || charCode == 68) {
            this.selectColumn(1);
        }
        if (charCode == 37 || charCode == 65) {
            this.selectColumn(-1);
        }
        if (charCode == 40 || charCode == 83) {
            this.selectRow(1);
        }
        if (charCode == 38 || charCode == 87) {
            this.selectRow(-1);
        }
        if (charCode == 69 || charCode == 75 || charCode == 32) {
            this.buttonPressed();
        }
    }
    buttonPressed() {
        if (this.position.row == 2) {
            this.gotoGame(this.position.col);
        }
        if (this.position.row == 4 && this.position.col == 0) {
            this.toggleSound();
        }
    }
    toggleSound() {
        this.allowSound = !this.allowSound;
        localStorage.setItem('sound', String(this.allowSound));
        this.menu[4][0].innerHTML = (this.allowSound) ? "SOUND:ON" : "SOUND:OFF";
        this.updateAudio();
    }
    updateAudio() {
        if (this.allowSound) {
            this.audio.src = "./sound/bgmusic.mp3";
            let promise = this.audio.play();
            if (promise !== undefined) {
                promise.then(_ => {
                    console.log("Playing audio");
                }).catch(error => {
                    console.log("Foutje! " + error);
                    this.toggleSound();
                });
            }
        }
        else {
            this.audio.pause();
        }
    }
    gotoGame(index) {
        window.location.href = this.data[index].url;
    }
    update() {
        this.joystick.update();
        requestAnimationFrame(() => this.update());
    }
}
window.addEventListener("load", () => new App());
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