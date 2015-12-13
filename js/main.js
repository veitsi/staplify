var counter = 0;
var id = 0;
var maxPlayers = 1;
var score1 = 0, score2 = 0;
var myFirebaseRef = new Firebase("https://boiling-torch-1773.firebaseio.com//");
var testBase = [["what language can be used for writing backend?", "java", "html", "chinese", 1],
    ["What program can be used to surf Internet?", "firefox", "notepad", "disk defragmemnator", 1],
    ["Which of items is an operation system?", "Minisoft Clismows", "Microsoft Windows", "RedCab Lanux", 2]
];
myFirebaseRef.child("questionItem").on("value", function (snapshot) {
    console.log('something updated on server ' + snapshot.val().question);
    main.answer.value = snapshot.val().question;
    main.b1.value = snapshot.val().answer1;
    main.b2.value = snapshot.val().answer2;
    main.b3.value = snapshot.val().answer3;
});

myFirebaseRef.child("resetGame").on("value", function (snapshot) {
    if (snapshot.val() === false) return;
    id = 0;
    console.log('game ended');
});

function foo() {
    console.log("reset");
    var counter = 0;
    myFirebaseRef.set({
        resetGame: true,
        playersCounter: 0,
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
function bar() {
    console.log("are there players? ");
    myFirebaseRef.once("value", function (data) {
        var playersCounter = data.val().playersCounter;
        console.log(data.val().playersCounter);
        if (playersCounter < maxPlayers) {
            playersCounter += 1;
            id = playersCounter;
            myFirebaseRef.child("playersCounter").set(playersCounter);
            myFirebaseRef.child("resetGame").set(false);
            if (playersCounter === maxPlayers) {
                console.log("I'm a boss!");
                counter=0;
                score1=0;
                score2=0;
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
                        if (counter < testBase.length - 1) {
                            counter += 1;
                            nextQuestion();
                        }
                        console.log(score1, score2);
                    }
                });
                nextQuestion();
            }
        }
    });
}

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

function sendAnswer(num) {
    console.log(num);
    myFirebaseRef.child("players").child("turn" + id).set(num);

    //if (counter<testBase.length-1)
    //counter+=1;
    //myFirebaseRef.child("question").set(testBase[counter][0]);
    //myFirebaseRef.child("answer1").set(testBase[counter][1]);
    //myFirebaseRef.child("answer2").set(testBase[counter][2]);
    //myFirebaseRef.child("answer3").set(testBase[counter][3]);
}


function feelStaply(num) {
    alert("are there players? ");
    myFirebaseRef.once("value", function (data) {
        alert(data.val());
    });
    //if (playersCounter === 0 && id === 0) {
    //    id = 1;
    //    myFirebaseRef.child("playersCounter").set(1);
    //}
    //if (playersCounter === 1 && id === 0) {
    //    id = 2;
    //    myFirebaseRef.child("playersCounter").set(2);
    //    counter = 0;
    //    myFirebaseRef.set({
    //        playersCounter: 2,
    //        questionItem: {
    //            questionId: counter,
    //            question: testBase[counter][0],
    //            answer1: testBase[counter][1],
    //            answer2: testBase[counter][2],
    //            answer3: testBase[counter][3]
    //        },
    //        players: {
    //            player1: {
    //                turn: 0,
    //                score: 0
    //            },
    //            player2: {
    //                turn: 0,
    //                score: 0
    //            }
    //        },
    //        author: "Staplify"
    //    });
    //}
}

