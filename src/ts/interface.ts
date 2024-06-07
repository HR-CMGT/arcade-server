export interface GameData {
    name:string
    url:string
    genres:number[]
    players:number
    cover?:string
    makecode?:boolean
}

export interface Vector {
    x:number
    y:number
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}