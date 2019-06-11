# Arcade Server

The Frontend for the [CMGT Arcade Machine](https://hr-cmgt.github.io/arcade-server/)

![screenshot](./docs/images/screenshot.png)

## NWJS

The DOCS folder of this repository will be [served](https://hr-cmgt.github.io/arcade-server/) on the arcade cabinet at CMGT. The browser is [NWJS](http://docs.nwjs.io/en/latest/For%20Users/Getting%20Started/#get-nwjs) in Kiosk Mode.

Student games are also github repositories or other urls where their game is served.

The NWJS shortcut CTRL+A will always redirect from any game back to the main page. The NWJS folder of this repo contains the package.json and index.js files for NWJS. These files have to be placed on the actual arcade machine, with the Linux version of [NWJS](https://nwjs.io/downloads/).

## Game requirements

[Check the Arcade Game repository](https://github.com/HR-CMGT/arcade-game) for exact game requirements:

- Resolution: 1440 x 900 (16:10), scaling may be preferable for performance reasons
- Support for Arcade stick and buttons

## JSON

[games.json](./docs/data/games.json) a JSON file with links to the github Page of game repositories, and genres.

Supply the game title, url, number of players, genres and *optionally* a cartridge image. Currently, cross-domain loading of cartridge images is not supported. The cartridge images will have to be added to this repository manually...😰

```
{
    "name": "Ruimtegruis",
    "url": "https://kokodoko.github.io/ruimtegruis/",
    "genres" : [1,1,1,0,0,0,0,0,0],
    "players" : 1,
    "cover": "cover_ruimtegruis.png"
}
```

## TODO

- improve paging (detect left right in game menu)
- select by criteria (players and genre)
- credits page
- instructions page
- about page
- keyboard input separate
- enable touch input when touch detected

## Nice to have

- Mobile view (just for showcase purposes)
- Open Unity games from NWJS menu
```
var exec = require('child_process').execFile;

exec('C:/asd/test.exe', function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
});
```

## Credits

- [Tim Borowy](https://github.com/TimBorowy) and [GrunkHead Dave](https://github.com/Grunkhead) for setting up the first iteration of the UI and the server.
- [Louis](https://github.com/KokoDoko/ruimtegruis/issues?q=is%3Apr+author%3Alouis-lau) for fixing the game scaling bug.
