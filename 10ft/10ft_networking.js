// Copyright 2018 James C. (https://mrjamesco.uk)
// Released under MIT License

var firebaseConfig = null;
const request = fetch("../config.json", {credentials: "same-origin"})
                .then((response)   => { return response.json();       })
                .then((configJSON) => { firebaseConfig = configJSON.firebase; initFirebase(); })
                .catch((error)     => { document.querySelector("#heading-wrapper").innerHTML = "<h1>Error</h1><h5>" + error + "</h5>"; });
var lastMessage = null;

function initFirebase()
{
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    db.settings({
        timestampsInSnapshots: true
    });

    var modalRef = db.doc('10ft/modal');

    modalRef.onSnapshot(handleMessage);
}

function handleMessage(docRef)
{
    document.querySelector("#alert-modal").innerHTML = "";

    const type = docRef.data().type;
    const data = docRef.data().data;
    const timestamp = docRef.data().timestamp;

    lastMessage = docRef;

    if (timestamp <= Date.now())
    {
        document.querySelector("#alert-modal").style.display = "none";
        return;
    }

    if (type === "tweet")
    {
        document.querySelector("#alert-modal").style.display = "flex";
        twttr.widgets.createTweet(
            data.split("/status/")[1].split("?")[0],
            document.querySelector("#alert-modal"),
            {
                width: 550,
                conversation: "none"
            }
        );
    }
    else if (type === "image")
    {
        document.querySelector("#alert-modal").style.display = "flex";
        document.querySelector("#alert-modal").innerHTML = "<img src='" + data + "'>"
    }
    else if (type === "text")
    {
        document.querySelector("#alert-modal").style.display = "flex";
        document.querySelector("#alert-modal").innerHTML = "<span style='font-size: 6em;'>" + data + "</span>";
    }
    else
    {
        document.querySelector("#alert-modal").style.display = "none";
    }

    setTimeout(function() {attemptToClearModal(docRef);}, timestamp - Date.now());
}

function attemptToClearModal(docRef)
{
    if (lastMessage === docRef)
    {
        document.querySelector("#alert-modal").style.display = "none";
        lastMessage = null;
    }
}