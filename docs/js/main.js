"use strict";
class App {
    constructor() {
        this.allowSound = true;
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
        this.joystick = new Joystick(2);
        this.gridMenu = new GridMenu(data);
        this.container = document.querySelector("foreground");
        this.container.addEventListener("animationend", () => {
            this.container.classList.remove("monitorEffect");
        });
        document.addEventListener("cursorX", (e) => this.gridMenu.selectColumn(e.detail));
        document.addEventListener("cursorY", (e) => this.gridMenu.selectRow(e.detail));
        document.addEventListener("button0", () => this.gridMenu.buttonPressed());
        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        this.allowSound = (localStorage.getItem('sound') == "true") ? true : false;
        this.audio = new Audio();
        this.updateAudio();
        this.update();
        setInterval(() => {
            this.container.classList.add("monitorEffect");
        }, 40000);
        this.container.classList.add("monitorEffect");
    }
    onKeyDown(e) {
        let charCode = e.which;
        if (charCode == 39 || charCode == 68) {
            this.gridMenu.selectColumn(1);
        }
        if (charCode == 37 || charCode == 65) {
            this.gridMenu.selectColumn(-1);
        }
        if (charCode == 40 || charCode == 83) {
            this.gridMenu.selectRow(1);
        }
        if (charCode == 38 || charCode == 87) {
            this.gridMenu.selectRow(-1);
        }
        if (charCode == 69 || charCode == 75 || charCode == 32) {
            this.gridMenu.buttonPressed();
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
                    console.log("AUDIO FOUT " + error);
                    this.toggleSound();
                });
            }
        }
        else {
            this.audio.pause();
        }
        this.gridMenu.updateSound(this.allowSound);
    }
    update() {
        this.joystick.update();
        requestAnimationFrame(() => this.update());
    }
}
window.addEventListener("load", () => new App());
class GridMenu {
    constructor(data) {
        this.position = { x: 0, y: 0 };
        this.menu = [];
        this.page = 0;
        this.numpages = 1;
        this.page = 0;
        this.data = data;
        this.numpages = Math.ceil(this.data.length / 8);
        this.carts = document.querySelector("#game-grid");
        this.paging = document.querySelector("#page-menu");
        this.carts.addEventListener("animationend", () => this.carts.classList.remove("leftAnimation", "rightAnimation"));
        this.generateGamePage(this.page);
        this.generatePaging();
        this.menu.push(document.querySelector("#player-menu").children);
        this.menu.push(document.querySelector("#genre-menu").children);
        this.menu.push(document.querySelector("#game-grid").children);
        this.menu.push(document.querySelector("#page-menu").children);
        this.menu.push(document.querySelector("#credits-menu").children);
    }
    generateGamePage(p) {
        this.page = Math.min(Math.max(this.page + p, 0), this.numpages - 1);
        this.carts.innerHTML = "";
        let start = this.page * 8;
        let num = Math.min(this.data.length - start, 8);
        for (let i = start; i < start + num; i++) {
            let div = document.createElement("div");
            let data = this.data[i];
            this.carts.appendChild(div);
            let cover = data.cover;
            if (cover && cover != "") {
                div.style.backgroundImage = `url(./covers/${cover})`;
                div.style.filter = `saturate(0.8)`;
            }
            else {
                div.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(0.8)`;
                div.style.backgroundImage = `url(./images/cart.png)`;
                div.innerHTML = data.name;
            }
        }
        if (p < 0) {
            this.carts.classList.add("leftAnimation");
        }
        else if (p > 0) {
            this.carts.classList.add("rightAnimation");
        }
    }
    generatePaging() {
        for (let i = 0; i < this.numpages; i++) {
            let div = document.createElement("div");
            div.innerHTML = (i + 1).toString();
            this.paging.appendChild(div);
            if (i == 0)
                div.classList.add("selected");
        }
    }
    selectRow(dir) {
        if (this.position.y == 3 && dir == -1) {
            this.position.x = 4;
            this.position.y = 2;
        }
        else if (this.position.y == 2 && this.position.x < 4 && dir == 1) {
            this.position.x += 4;
        }
        else if (this.position.y == 2 && this.position.x > 3 && dir == -1) {
            this.position.x -= 4;
        }
        else {
            this.position.x = 0;
            this.position.y = Math.min(Math.max(this.position.y + dir, 0), this.menu.length - 1);
        }
        if (this.position.y == 3) {
            this.position.x = this.page;
        }
        this.updateCursor();
    }
    selectColumn(dir) {
        let maxColumn = this.menu[this.position.y].length - 1;
        this.position.x = Math.min(Math.max(this.position.x + dir, 0), maxColumn);
        if (this.position.y == 3) {
            this.generateGamePage(dir);
        }
        this.updateCursor();
    }
    updateCursor() {
        this.clearSelection(this.position.y);
        if (this.position.y != 4) {
            this.clearSelection(4);
        }
        if (this.position.y == 2) {
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
    clearSelection(row) {
        let buttons = this.menu[row];
        let arr = Array.from(buttons);
        for (let b of arr) {
            b.classList.remove("selected");
        }
    }
    getSelectedElement() {
        return this.menu[this.position.y][this.position.x];
    }
    buttonPressed() {
        if (this.position.y == 2) {
            let index = this.position.x + (this.page * 8);
            this.gotoGame(index);
        }
        if (this.position.y == 4 && this.position.x == 0) {
            App.instance.toggleSound();
        }
    }
    updateSound(b) {
        this.menu[4][0].innerHTML = (b) ? "SOUND:ON" : "SOUND:OFF";
    }
    gotoGame(index) {
        window.location.href = this.data[index].url;
    }
}
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