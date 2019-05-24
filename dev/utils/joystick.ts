class Joystick {

    private readonly DEBUG: boolean = true;

    // FIELDS
    // Buttons
    private numberOfBUttons = 0
    private axes: number[] = []
    private previousGamepad: Gamepad
    private isConnected: boolean = false

    // PROPERTIES
    // Axes
    public get Left(): boolean {
        return (this.axes[0] == -1)
    }
    public get Right(): boolean {
        return (this.axes[0] == 1)
    }
    public get Up(): boolean {
        return (this.axes[1] == -1)
    }
    public get Down(): boolean {
        return (this.axes[1] == 1)
    }

    /**
     * Creates a joystick object for one player
     * @param numOfButtons The number of buttons needed by your game
     */
    constructor(numOfButtons: number) {
        this.numberOfBUttons = numOfButtons
        // add all axes (x:number, y:number) to an array
        this.axes.push(0,0)

        window.addEventListener("gamepadconnected", (e: Event) => this.onGamePadConnected(e as GamepadEvent))
        window.addEventListener("gamepaddisconnected", () => this.onGamePadDisConnected())

        this.update()
    }

    private onGamePadConnected(e: GamepadEvent): void {
        if (this.DEBUG) { console.log('Game pad connected') }
        this.previousGamepad = e.gamepad
        this.isConnected = true
    }

    private onGamePadDisConnected(): void {
        if (this.DEBUG) { console.log('Game pad disconnected') }
        this.isConnected = false
    }

    public update(): void {
        if (this.isConnected) {
            let gamepads = navigator.getGamepads()

            if (!gamepads) {
                return;
            }

            let gamepad: Gamepad | null = gamepads[0]

            if(gamepad) {

                for (let index = 0; index < this.numberOfBUttons; index++) {
                    if (this.buttonPressed(gamepad.buttons[index]) &&
                        !this.buttonPressed(this.previousGamepad.buttons[index])) {
                        document.dispatchEvent(new Event('button' + index))
                    }
                    // in the menu we need events for the x y axes too
                    if (Math.abs(gamepad.axes[0]) > 0.9 && Math.abs(this.previousGamepad.axes[0]) < 0.9) {
                        this.previousGamepad = gamepad
                        document.dispatchEvent(new CustomEvent('cursorX', { detail: Math.round(gamepad.axes[0])}))
                    } 
                    if (Math.abs(gamepad.axes[1]) > 0.9 && Math.abs(this.previousGamepad.axes[1]) < 0.9) {
                        this.previousGamepad = gamepad
                        document.dispatchEvent(new CustomEvent('cursorY', { detail: Math.round(gamepad.axes[1])}))
                    } 
                }

                // can be used to check left right up down at any time
                this.axes = [Math.round(gamepad.axes[0]), Math.round(gamepad.axes[1])]

                this.previousGamepad = gamepad
            }
        }
    }

    /**
     * Helper function to filter some bad input
     * @param b 
     */
    private buttonPressed(b: any): any {
        if (typeof (b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    }
}