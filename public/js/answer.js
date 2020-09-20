let correctAnswerIndex;

//need some way to randomly shuffle the names
async function displayFacts() {
    console.log("retreiving facts")
    const roundFacts = await get('/api/get-fact', {}); //<-uncomment when API is up
    console.log(roundFacts);
    const dummyFact = 'Eats Bussy and Puccy';
    const dummyNames = [['dan'], ['eli'],['grant'],['tim']];
    const dummyRound = '420';

    const factDiv = document.getElementById("factDiv");
    let factText = document.createTextNode(dummyFact);
    factDiv.append(factText);

    const roundDiv = document.getElementById("roundDiv");
    let roundText = document.createTextNode("Round " + dummyRound);
    roundDiv.append(roundText)
    

    const answerDiv = document.getElementById("answerDiv");

    dummyNames.forEach((name, idx) => {
        let newButton = document.createElement("BUTTON");
        let functionAttribute = "submitAnswer(" + idx + ")";
        let player = document.createTextNode(name);
        newButton.setAttribute("onclick", functionAttribute);
        newButton.setAttribute("class", "btn btn-primary btn-lg btn-block");

        newButton.append(player);
        answerDiv.appendChild(newButton);
    });
};

async function submitAnswer(answerId) {
    try {
        let answerSuccess = await post('/api/answer', {"answer_id": answerId});
    } catch (error) {
        console.error("call to answer failed");
    }

};