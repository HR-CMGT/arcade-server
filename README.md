# Arcade Server

The Frontend for the CMGT Arcade Machine

- Resolution: 1280 x 720
- Audio: WAV or OGG files
- Games: a JSON file with links to the github Page of game repositories

## Pages

- Intro page
- Controls explanation
- Game page

## Browser

The DOCS folder of this repository will be served on the arcade machine at CMGT. The browser is
[NWJS](http://docs.nwjs.io/en/latest/For%20Users/Getting%20Started/#get-nwjs) in Kiosk Mode

## TODO

- paging for multiple games
- select by criteria (players and genre)
- credits page
- instructions page
- about page
- grid selection code

## Nice to have

Open Unity games vanuit NWJS menu
```
var exec = require('child_process').execFile;

exec('C:/asd/test.exe', function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
});
```

## Credits

Many thanks to [Tim Borowy](https://github.com/TimBorowy) and [GrunkHead Dave](https://github.com/Grunkhead) for setting up the first iteration