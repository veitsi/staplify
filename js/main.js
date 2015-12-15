var id = 0;
var myFirebaseRef = new Firebase("https://boiling-torch-1773.firebaseio.com//");

function test() {
    console.log('test func');
    myFirebaseRef.set([9, 10, 11, 12]);
}

function startWatchersOnClient() {
    myFirebaseRef.child("questionItem").on("value", function (snapshot) {
        console.log('something updated on server ' + snapshot.val().question);
        //main.answer.value = snapshot.val().question;
        document.getElementById("question").innerHTML = snapshot.val().question;
        main.b1.value = snapshot.val().answer1;
        main.b2.value = snapshot.val().answer2;
        main.b3.value = snapshot.val().answer3;
    });
    myFirebaseRef.child("score").on("value", function (snapshot) {
        document.getElementById("score1").innerHTML = snapshot.val()[0];
        document.getElementById("score2").innerHTML = snapshot.val()[1];
    });
    myFirebaseRef.child("gameStarted").on("value", function (snapshot) {
        if (snapshot.val() === true) {
        }
    });
    myFirebaseRef.child("resetGame").on("value", function (snapshot) {
        if (snapshot.val() === false) return;
        id = 0;
        console.log('out of the game');
    });
}

function initFirebaseData() {
    var MAX_PLAYERS = 1;
    console.log("reset");
    myFirebaseRef.set({
        resetGame: true,
        gameStarted: false,
        playersAllowed: MAX_PLAYERS,
        questionItem: {
            questionId: -1,
            question: "",
            answer1: "",
            answer2: "",
            answer3: ""
        },
        score: [0, 0],
        players: {
            turn1: 0,
            turn2: 0
        },
        author: "Staplify"
    });
}

function startStapling() {
    if (id === 0) {
        console.log("are there players allowed? ");
        myFirebaseRef.child("playersAllowed").once("value", function (data) {
            var playersAllowed = data.val();
            console.log(playersAllowed);
            if (playersAllowed > 0) {
                console.log("yes, there is a free place");
                id = playersAllowed;
                playersAllowed -= 1;
                document.getElementById("userid").innerHTML = id;
                myFirebaseRef.child("playersAllowed").set(playersAllowed);
                startWatchersOnClient();
                if (id === 1) {
                    myFirebaseRef.child("resetGame").set(false);
                    startStaplifyServerWatcher();
                }
            }
            else {
                console.log("sorry, out of free places");
            }
        });
    }
    else {
        console.log('you are applied to already');
    }

    function startStaplifyServerWatcher() {
        console.log("I'm a boss!");
        var counter = 0;var score1 = 0;var score2 = 0;
        var testBase = [["what language can be used for writing backend?", "java", "html", "chinese", 1],
            ["Кого зовут на новый год?", "Дедушку мороза", "Линуса Торвальдса", "Бабу Ягу", 1],
            ["Для чего нужен бубен?", "Для настройки серверов", "Для улучшения приема wi-fi", "Для игры в ансамблях", 3],
            ["Кто отвечает за саппорт на Hack new year", "Александра Поляничко", "Анастасия Лужочко", "Алина Степочко", 1],
            ["What program can be used to surf Internet?", "firefox", "notepad", "disk defragmemnator", 1],
            ["Which of items is an operation system?", "Minisoft Clismows", "Microsoft Windows", "RedCab Lanux", 2]];
        myFirebaseRef.child("players").on("value", function (snapshot) {
            console.log("new answer received");
            var turn1 = snapshot.val().turn1;
            var turn2 = snapshot.val().turn2;
            var answer = testBase[counter][4];
            if (turn1 === answer || turn2 === answer) {
                console.log('somebody is amazing smart');
                if (turn1 === answer) {
                    console.log('player1 is amazing smart');
                    score1 += 1;
                }
                if (turn2 === answer) {
                    console.log('player2 is amazing smart');
                    score2 += 1;
                }
                myFirebaseRef.child("score").set([score1,score2]);
                if (counter < testBase.length - 1) {
                    counter += 1;
                    nextQuestion();
                }
                console.log(score1, score2);
            }
        });
        nextQuestion();
        function nextQuestion() {
            console.log("question is:" + testBase[counter][0]);

            myFirebaseRef.child("players").child("turn" + 1).set(0);
            myFirebaseRef.child("players").child("turn" + 2).set(0);
            myFirebaseRef.child("questionItem").set({
                question: testBase[counter][0],
                answer1: testBase[counter][1],
                answer2: testBase[counter][2],
                answer3: testBase[counter][3]
            });
        }
    }

}

function sendAnswer(num) {
    console.log("user pressed "+num);
    myFirebaseRef.child("players").child("turn" + id).set(num);
}

