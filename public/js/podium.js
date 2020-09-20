async function getPodium() {
    const tableBody = document.getElementById("tableBody");
    var leaderboard;
    try{
        leaderboard = await get('/api/leaderboard', {});
    }
    catch (error){
        console.log(error);
    }
    // const dummyLeaderboard = [{"username": "Dan", "score": "5000"}, {"username": "Ben", "score": "1000"}, {"username": "Peyton", "score": "20"}];

    console.log(leaderboard);
    leaderboard.forEach((player, idx) => {
        newTR = document.createElement("TR"); //new tr

        var rankTH = document.createElement("TH");
        rankTH.setAttribute("scope", "row")
        var rank = document.createTextNode(idx+1);
        rankTH.appendChild(rank);

        var nameTD = document.createElement("TD");
        var name = document.createTextNode(player.username);
        nameTD.append(name);

        var scoreTD = document.createElement("TD");
        var score = document.createTextNode(player.score);
        scoreTD.append(score);

        newTR.append(rankTH);
        newTR.append(nameTD);
        newTR.append(scoreTD);

        tableBody.append(newTR);
    });
}