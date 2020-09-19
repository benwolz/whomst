function enterLobby() {
    //get username and gameId from URL
    const paramsString = window.location.search;
    var searchParams = new URLSearchParams(paramsString);

    const username = searchParams.get("username");
    const gameId = searchParams.get("gameId");
    const isHost = searchParams.get("isHost");
    const facts = [document.getElementById("fact1"), document.getElementById("fact2"), document.getElementById("fact3")];

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
        var http = new XMLHttpRequest();
        var params = requestJson;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.send(params);
    }
    catch (error) {
        console.error(error);
    }

    // window.location.href = endOfURL;
}



