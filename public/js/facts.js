async function enterLobby() {
    //get username and gameId from URL
    const paramsString = window.location.search;
    var searchParams = new URLSearchParams(paramsString);

    console.log("search params: " + searchParams);

    const username = searchParams.get("username");
    const gameId = searchParams.get("gameId");
    let isHost = searchParams.get("isHost");
    isHost = (isHost === 'true');
    const facts = [document.getElementById("fact1").value, document.getElementById("fact2").value, document.getElementById("fact3").value];

    var requestJson;
    if (isHost){
        requestJson = {"username": username, "facts": facts};
    } else {
        requestJson = {"username": username, "gameId": gameId, "facts": facts};
    }

    let endOfURL = '/lobby';// + '?username='+username + '&gameId='+gameId + '&isHost='+isHost;

    console.log(`Attempting to join game ${gameId}`);
    console.log(`ID: ${gameId} UserName: ${username} url: ${endOfURL} facts: ${facts} isHost: ${isHost}`);
    
    try {
        let url;
        if (isHost){
            console.log("is host");
            url = '/api/create-game';
        } else{
            url = '/api/join-game';
        }
        console.log(url);
        await post(url, requestJson); 
    }
    catch (error) {
        console.error(error);
    }

    window.location.href = endOfURL;
}



