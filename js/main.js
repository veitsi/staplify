var counter=0;
var myFirebaseRef = new Firebase("https://burning-fire-6341.firebaseio.com/");

myFirebaseRef.on("value", function(snapshot){
    console.log('something updated on server '+snapshot.val().question);
    main.answer.value=snapshot.val().question;
    main.b1.value=snapshot.val().answer1;
    main.b2.value=snapshot.val().answer2;
    main.b3.value=snapshot.val().answer3;
});

