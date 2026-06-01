let spent = 0;
let winnings = 0;
let defaultColor = document.getElementById("txtNetProfit").style.backgroundColor;

let button = document.getElementById("btnPlay");
button.addEventListener("click", btnPlayClick);

let chkPowerball = document.getElementById("chkPowerball");
chkPowerball.addEventListener("change", chkPowerballCheckedChanged);

function btnPlayClick() {
    let myTicket = rdoToTicket();

    let payout = 0;
    let gameOutcomeMsg = "";
    let guesses;
    try {
        guesses = document.getElementById("txtUserPicks").value.trim().split(" ");

        if (guesses.length == myTicket.pickCount) {
            if (checkPicksWithinRange(guesses, myTicket)) {
                document.getElementById("txtWinningNumbers").textContent = "";
                for (let i = 0; i < myTicket.picks.length; i++) {
                    document.getElementById("txtWinningNumbers").textContent += (myTicket.picks[i] + " ");
                }
                document.getElementById("txtWinningNumbers").textContent = document.getElementById("txtWinningNumbers").textContent.trim();

                let potentialPayout = checkPicksCorrect(guesses, myTicket) * myTicket.price;
                payout = potentialPayout;

                gameOutcomeMsg = `You got ${checkPicksCorrect(guesses, myTicket)} numbers correct.\n`;

                if (myTicket.powerBall) {
                    let pbPick = parseIntWithRegex(document.getElementById("txtPowerballPick").value);
                    if (pbPick >= 1 && pbPick <= 10) {
                        if (pbPick == myTicket.powerballPick) {
                            payout += 10;
                            gameOutcomeMsg += "You got the powerball correct too!\n";
                        }
                        else {
                            gameOutcomeMsg += "You unfortunately did not get the powerball\n";
                        }
                    }
                    else {
                        throw new Error(pbPick >= 10 ? "/Your powerball pick was too big" : "/Your powerball pick was too small");
                    }
                }

                gameOutcomeMsg += `Your final payout: ${payout}`;

                document.getElementById("txtOutcome").innerText = gameOutcomeMsg;

                winnings += payout;
                spent += (myTicket.price + (myTicket.powerBall ? 2 : 0));

                document.getElementById("txtTotalWinnings").textContent = winnings.toString();
                document.getElementById("txtTotalSpent").textContent = spent.toString();
                document.getElementById("txtNetProfit").textContent = (winnings - spent).toString();

            }
            else {
                throw new Error("/One or more of your picks are too big or too small");
            }
        }
        else {
            throw new Error(guesses.length > myTicket.pickCount ? "/You chose too many numbers" : "/You didn't choose enough numbers");
        }
    }
    catch (ex) {
        alert(ex.message[0] == "/" ? ex.message.substring(1) : ex.message);
        document.getElementById("txtUserPicks").focus();
        document.getElementById("txtUserPicks").select();
    }

    document.getElementById("txtUserPicks").value = "";
    document.getElementById("txtPowerballPick").value = "";

    chkPowerball.checked = false;
    chkPowerballCheckedChanged();
    setConditionalTextColor();
}

function setConditionalTextColor() {
    document.getElementById("txtNetProfit").style.backgroundColor = defaultColor;
    document.getElementById("txtNetProfit").style.backgroundColor = (winnings - spent > 0) ? "green" : "red";
}

function checkPicksWithinRange(guesses, ticket) {
    let intGuesses = guesses.map(parseIntWithRegex);
    let correct = 0;
    for (let i = 0; i < guesses.length; i++) {
        correct += (intGuesses[i] >= 1 && intGuesses[i] <= ticket.maxRange) ? 1 : 0;
    }

    return correct == ticket.pickCount;
}

function checkPicksCorrect(guesses, ticket) {
    let intGuesses = guesses.map(parseIntWithRegex);
    let correct = 0;
    for (let i = 0; i < guesses.length; i++) {
        if (ticket.picks.includes(intGuesses[i])) {
            correct++;
        }
    }

    return correct;
}

function rdoToTicket() {
    if (document.getElementById("rdoSmall").checked) {
        return new Ticket("Basic", 1, 3, 20, chkPowerball.checked);
    }
    else if (document.getElementById("rdoMedium").checked) {
        return new Ticket("Standard", 3, 5, 50, chkPowerball.checked);
    }
    else if (document.getElementById("rdoMega").checked) {
        return new Ticket("Mega", 5, 6, 60, chkPowerball.checked);
    }

    return null;
}

function chkPowerballCheckedChanged() {
    document.getElementById("txtPowerballPick").style.display = chkPowerball.checked ? "flex" : "none";
    if (chkPowerball.checked) {
        document.getElementById("txtPowerballPick").focus();
    }
}

function parseIntWithRegex(value) {
    value = value.toString().trim();
    if (!/^[-+]?\d+$/.test(value)) {
        throw new Error("Input string was not in a correct format.");
    }

    return parseInt(value);
}

class Ticket {
    constructor(ticketName, price, pickCount, maxRange, powerBall = false) {
        this.ticketName = ticketName;
        this.price = price;
        this.pickCount = pickCount;
        this.maxRange = maxRange;
        this.powerBall = powerBall;

        this.picks = [];

        for (let i = 0; i < pickCount; i++) {
            this.picks[i] = Math.floor(Math.random() * maxRange) + 1;
        }

        this.powerballPick = Math.floor(Math.random() * 10) + 1;
    }
}
