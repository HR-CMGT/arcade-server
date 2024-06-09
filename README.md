# Arcade Server

The Frontend for the [CMGT Arcade Machine](https://hr-cmgt.github.io/arcade-server/)

![screenshot](./docs/images/screenshot.png)

## Server development

```bash
npm install
npm run dev
npm run build
git push
```

On mac you can [install Chromium with homebrew](https://dev.to/pixelrena/installing-chromium-on-mac-apple-m2-pro-tutorial-4i4i). Connect gamepad or joystick with USB.

> Update juni 2024 : vite met typescript toegevoegd. Custom components toegevoegd.

#### TODO:

- About page.
- Drop shadow on cartridges.
- Index.html cleanup duties.
- SPA, elke page is een component in plaats van een HTML file.

## NWJS

[NWJS](http://docs.nwjs.io/en/latest/For%20Users/Getting%20Started/#get-nwjs) is the kiosk app met Chromium die draait op de arcade kast. Deze staat altijd in fullscreen en springt altijd terug naar de game page als je op 🟡 🟡 drukt. The [DOCS](https://hr-cmgt.github.io/arcade-server/) folder of this repository will be automatically loaded by NWJS.

Student games are also github repositories or other urls where their game is served.

The NWJS shortcut CTRL+A (🟡 🟡 ) will always redirect from any game back to the main page. The NWJS folder of this repo contains the package.json and index.js files for NWJS. These files have to be placed on the actual arcade machine, with the Linux version of [NWJS](https://nwjs.io/downloads/).

### Updating NWJS and Chromium

Download the latest [NWJS](https://nwjs.io/downloads/) on ubuntu. Unzip and place all the files in the existing nwjs project. Do not remove/replace `index.js, app.js, bg.js`.


<br><br><br>

## Game requirements

[Check the Arcade Game repository](https://github.com/HR-CMGT/arcade-game) for exact game requirements:

- Screen aspect ratio is 16:10. Resolutions could be: 1440x900, 800x500, etc.
- Support for Gamepad

<br><br><br>

## JSON

[games.json](./docs/data/games.json) a JSON file with links to the github Page of game repositories, and genres.

Supply the game title, url, number of players, genres and *optionally* a cartridge image. Currently, cross-domain loading of cartridge images is not supported. The cartridge images will have to be added to this repository manually...😰 (loading them remotely is too slow...😴)

If you set `makecode` to `true`, an alternative cartridge image will be used.

```
{
    "name": "Ruimtegruis",
    "url": "https://kokodoko.github.io/ruimtegruis/",
    "players" : 1,
    "cover": "cover_ruimtegruis.png",
    "makecode" : false
}
```
## Cartridge image

Gebruik dit image als basis 

<img src="./docs/images/cart.png">

## Makecode Arcade

Je kan een link naar je makecode arcade game toevoegen aan games.json. Dan zet je `makecode` op true, je krijgt dan automatisch onderstaand cartridge image:

<img src="./docs/images/cart-makecode.png">

## Running this project

Aanpassingen in de typescript `dev` map moet je publiceren naar de `docs` map met `tsc` (typescript compiler). In VS Code doe je ***CMD+SHIFT+B***.

## TODO

- Vertical flex layout (of css grid)
- Rewrite the whole pagination spaghetti code

## Credits

- [Tim Borowy](https://github.com/TimBorowy) and [GrunkHead Dave](https://github.com/Grunkhead) for setting up the first iteration of the UI and the server.
- [Louis](https://github.com/KokoDoko/ruimtegruis/issues?q=is%3Apr+author%3Alouis-lau) for fixing the game scaling bug.
- Leanne, Rob, Erik, Bob voor het bestellen en timmeren van de kast
- Hamid voor het updaten van Ubuntu
- Antwan voor het boos kijken
