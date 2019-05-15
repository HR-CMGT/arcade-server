// Get menu selectables of first menu.
firstMenu = document.querySelector('.first-menu');
playerTypes = firstMenu.children;

// Get menu selectables of second menu.
secondMenu = document.querySelector('.second-menu');
gameTypes = secondMenu.children;

// Get menu selectables of thirth menu.
thirthMenu = document.querySelector('.thirth-menu');
games = thirthMenu.children;

// Used for changing the position of the selector between menu's and in-menu.
var menuCounter = 0;
var menuIndex = [playerTypes, gameTypes, games];

// Generate a cache for each menu.
var menuCache = menuIndex.map(x => {
    return 0;
})

// set activeMenu as first menu of menuIndex.
var activeMenu = menuIndex[0];
var counter = 0;
var downCounterCache = 0;
var upCounterCache = 0;

function initSelector() {
    addColorToSelection(counter)
}

function cacheDownCounter() {
    menuCache[menuCounter] = counter;

    if (counterCached('up')) {
        swapCounter('up');
    } else {
        resetCounter();
    }
}

function cacheUpCounter() {
    menuCache[menuCounter] = counter;

    if (counterCached('down')) {
        swapCounter('down');
    } else {
        resetCounter();
    }
}

function swapCounter(direction) {
    if (direction == 'up') {
        counter = menuCache[menuCounter - 1];
    }
    if (direction == 'down') {
        counter = menuCache[menuCounter + 1];
    }
}

function counterCached(direction) {

    if (direction == 'up' && upCounterCache < 0) {
        return false;
    }

    if (direction == 'down' && downCounterCache < 0) {
        return false;
    }

    return true
}

function resetCounter() {
    counter = 0;
}

initSelector(playerTypes);

function unselectElement() {
    removeColorFromSelection(counter)
}

function selectPreviousElement() {
    if (counter - 1 >= 0) {
        unselectElement();
        counter--;
        addColorToSelection(counter)
    }
}

function selectNextElement() {
    if (counter + 1 < activeMenu.length) {
        unselectElement();
        counter++
        addColorToSelection(counter)
    }
}

function setActiveMenu() {
    activeMenu = menuIndex[menuCounter]
}

function selectPreviousMenu() {
    menuCounter--;
    setActiveMenu();
    initSelector();
}

function selectNextMenu() {
    menuCounter++;
    setActiveMenu();
    initSelector();
}

function getSelectedGame() {
    selectedGameIndex = menuCache[menuCache.length - 1]

    if (menuCounter != 2) {
        return thirthMenu.children[selectedGameIndex]
    }

    return thirthMenu.children[counter]
}

function addColorToSelection(selection) {
    activeMenu[selection].classList.add("selection")
}

function removeColorFromSelection(selection) {
    activeMenu[selection].classList.remove("selection")
}

// Listening to the browser which key is pressed.
document.onkeydown = function (event) {

    var charCode = event.which;
    var charStr = String.fromCharCode(charCode);

    // Move right
    if (charCode == 39 || charCode == 68) {
        selectNextElement();
    }

    // Move left
    if (charCode == 37 || charCode == 65) {
        selectPreviousElement();
    }

    // Move down
    if (charCode == 40 || charCode == 83) {
        if (menuCounter + 1 < menuIndex.length) {
            cacheUpCounter();
            selectNextMenu();
        }
    }

    // Move up
    if (charCode == 38 || charCode == 87) {
        if (menuCounter - 1 >= 0) {
            cacheDownCounter();
            selectPreviousMenu();
        }
    }

    if (charCode == 69 || charCode == 75) {
        if (menuCounter - 1 >= 0) {
            url = getSelectedGame().href
            window.location.href = url;
        }
    }
};