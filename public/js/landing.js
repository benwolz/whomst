const username = document.getElementById("username");
const gameId = document.getElementById("gameId");
const joinGameButton = document.getElementById("joinGame");

var socket = io();

function joinGame() {
    var requestJson = {"username": username.value, "gameId": gameId.value};

    socket.emit('userJoinGame', requestJson, error => {
        console.log(error);
        alert("Username and/or gameId is not valid.");
    });
}

function createGame() {
    var requestJson = {"username": username.value, "gameId": gameId.value};
    console.log('Trying to create a game');
    console.log(requestJson);
    socket.emit('userCreateGame', requestJson, error => {
        console.log(error);
        alert("Username and/or gameId is not valid.");
    });
}
