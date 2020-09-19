//const joinGameButton = document.getElementById("joinGame");

var socket = io();

function joinGame() {
    const username = document.getElementById("joinGameUsername");
    const gameId = document.getElementById("gameId");
    const requestJson = {"username": username.value, "gameId": gameId.value};

    console.log(`Attempting to join game ${gameId.value}`);
    socket.emit('userJoinGame', requestJson, error => {
        console.log(error);
        alert("Username and/or gameId is not valid.");
    });

    let endOfURL = '/facts' + '?username='+username.value + '?gameId=' +gameId.value;
    window.location.href = endOfURL;
}

function createGame() {
    const createGameUsername = document.getElementById("createGameUsername");
    // hypothetically should create a new game ID for us
    const requestJson = {"username": createGameUsername.value, "gameId": gameId.value};

    console.log('Trying to create a game');
    console.log(requestJson);

    socket.emit('userCreateGame', requestJson, error => {
        console.log(error);
        alert("Username and/or gameId is not valid.");
    });

    
    let endOfURL = '/facts?username=' + createGameUsername.value;
    window.location.href = endOfURL;
}
