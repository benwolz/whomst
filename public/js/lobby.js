function updateLobby() {
  const gameData = httpGet('/api/game-info');
  console.log(gameData)
  document.getElementById('game-pin').innerHTML = gameData.game_id;
  // game.players
  // game.isStarted
  // game.host_id
} 

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

updateLobby();