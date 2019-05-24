interface GameData {
    name:string
    url:string
    genres:number[]
    players:number
    cover?:string
}

interface Grid {
    row:number
    col:number
}

interface InputListener {
    selectRow(dir:number):void
    selectColumn(dir:number):void
    pressButton():void
}