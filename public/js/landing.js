//const joinGameButton = document.getElementById("joinGame");

const { request } = require("http");

var socket = io();

function joinGame() {
    const username = document.getElementById("joinGameUsername");
    const gameId = document.getElementById("gameId");
    const requestJson = {"username": username.value, "gameId": gameId.value};

    console.log(`Attempting to join game ${gameId.value}`);
    
    let endOfURL = '/facts' + '?username='+username.value + '&gameId=' +gameId.value + '&isHost=false';
    window.location.href = endOfURL;
}

function createGame() {
    const createGameUsername = document.getElementById("createGameUsername");
    // hypothetically should create a new game ID for us
    const requestJson = {"username": createGameUsername.value, "gameId": gameId.value};

    console.log('Trying to create a game');
    
    let endOfURL = '/facts?username=' + createGameUsername.value + '&isHost=true';
    window.location.href = endOfURL;
}
