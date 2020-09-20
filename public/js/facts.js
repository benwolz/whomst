async function enterLobby() {
    //get username and gameId from URL
    const paramsString = window.location.search;
    var searchParams = new URLSearchParams(paramsString);

    const username = searchParams.get("username");
    const gameId = searchParams.get("gameId");
    const isHost = searchParams.get("isHost");
    const facts = [document.getElementById("fact1").value, document.getElementById("fact2").value, document.getElementById("fact3").value];

    var requestJson;
    if (isHost){
        requestJson = {"username": username, "facts": facts};
    } else {
        requestJson = {"username": username, "gameId": gameId, "facts": facts};
    }

    let endOfURL = '/lobby';// + '?username='+username + '&gameId='+gameId + '&isHost='+isHost;

    console.log(`Attempting to join game ${gameId}`);
    console.log(`ID: ${gameId} UserName: ${username} url: ${endOfURL} facts: ${facts}`);
    
    try {
        let url;
        if (isHost){
            url = '/api/create-game';
        } else{
            url = '/api/create-game';
        }
        await post(url, requestJson); 
    }
    catch (error) {
        console.error(error);
    }

    window.location.href = endOfURL;
}



