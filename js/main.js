var id = 0;
var gameStarted=false;
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
    myFirebaseRef.child("resetGame").on("value", function (snapshot) {
        if (snapshot.val() === true) {
            if (gameStarted) {id = 0;gameStarted=false}
            console.log('out of the game');
        }
        else {
            gameStarted=true;
        }
    });
}

function initFirebaseData() {
    var MAX_PLAYERS = 2;
    console.log("reset in firebase");
    myFirebaseRef.set({
        resetGame: true,
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
                startWatchersOnClient();
                myFirebaseRef.child("playersAllowed").set(playersAllowed - 1);
                console.log("yes, there is a free place");
                id = playersAllowed;
                document.getElementById("userid").innerHTML = id;

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
        var counter = 0;
        var score1 = 0;
        var score2 = 0;
        var testBase = [["what language can be used for writing backend?", "java", "html", "chinese", 1],
            ["Каким образом определяется тип переменной в языках с динамической типизацией?", "у переменных нет типов",
                "По типу хранимых в переменной данных", "Тип определяется пользователем", 2],
            ["Чем отличаются функции от процедуры?", "Код функций более строго проверяется компилятором",
                "В функцию можно передавать параметры", "Функция может возвращать значение", 3],
            ["Кто является отцом системы GNU/Linux?", "Билл Гейтс", "Линус Торвальдс", "Антон Попов", 2],
            ["Для чего нужен бубен?", "Для настройки серверов", "Для улучшения приема wi-fi", "Для игры в ансамблях", 3],
            ["What program can be used to surf Internet?", "firefox", "notepad", "disk defragmemnator", 1],
            ["Which of items is an operation system?", "Minisoft Clismows", "Microsoft Windows", "RedCab Lanux", 2],
            ["Игра закончена. довольны ли Вы результатом","Да, все отличнно","Нет, все отлично","Мне все нравится",1]];
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
                console.log(score1, score2, "question # ", counter);
                myFirebaseRef.child("score").set([score1, score2]);
                if (counter < testBase.length - 1) {
                    counter += 1;
                    nextQuestion();
                }
                else {
                    console.log('out of questions');
                    initFirebaseData();
                    myFirebaseRef.child("players").off();
                }
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
                answer3: testBase[counter][3],
                questionId: counter
            });
        }
    }
}

function sendAnswer(num) {
    console.log("user pressed " + num + " for id:" + id);
    myFirebaseRef.child("players").child("turn" + id).set(num);
}

