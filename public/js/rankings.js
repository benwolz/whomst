async function getRankings() {
    const tableBody = document.getElementById("tableBody");
    const leaderboard = await get('/api/leaderboard', {}); //<- uncomment when API is complete
    // const dummyLeaderboard = [["Mike", "5000"], ["Ben", "4000"], ["Dan", "3000"]];


    leaderboard.forEach((player, idx) => {
        newTR = document.createElement("TR"); //new tr

        var rankTH = document.createElement("TH");
        rankTH.setAttribute("scope", "row")
        var rank = document.createTextNode(idx+1);
        rankTH.appendChild(rank);

        var nameTD = document.createElement("TD");
        var name = document.createTextNode(player[0]);
        nameTD.append(name);

        var scoreTD = document.createElement("TD");
        var score = document.createTextNode(player[1]);
        scoreTD.append(score);

        newTR.append(rankTH);
        newTR.append(nameTD);
        newTR.append(scoreTD);

        tableBody.append(newTR);
    });
}