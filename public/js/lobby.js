//const { post } = require("../../src/routes/api");

//const { get } = require("lodash");

async function startGame() {
  try {
    await post('/api/start-game', {});
    console.log("started successfully");
  } catch (error) {
    console.error(error)
  }
  let start = await get('/api/game-info', {});
  console.log(start);
}

async function updateLobby() {
  const gameData = await get('/api/game-info', {});
  console.log(gameData)
  document.getElementById('game-pin').innerHTML = gameData.game_id;
  // game.players
  // game.isStarted
  // game.host_id
} 

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

updateLobby();