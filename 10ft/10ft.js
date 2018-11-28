// Copyright 2018 James C. (https://mrjamesco.uk)
// Released under MIT License

let showColon = true;

let hackathonStart  = null;
let hackathonEnd    = null;
let timerClear      = null;

let timerInterval   = null;
let eventDuration   = null;
let eventEndInfo    = null;

fetch("../config.json")
.then((response)   => { return response.json(); })
.then((configJSON) => {
    hackathonStart = new Date(configJSON.hackathonStart);
    hackathonEnd   = new Date(configJSON.hackathonEnd);
    if (hackathonEnd < hackathonStart)
    {
        throw "End of the event defined as being before the start in config.json";
    }
    else if (hackathonEnd.valueOf() == hackathonStart.valueOf())
    {
        throw "Event has 0 duration"
    }
    timerClear     = new Date(hackathonEnd.valueOf() + 60000);
    eventDuration = Math.floor((hackathonEnd - hackathonStart)/1000);
    
    document.querySelector("body").style["background-color"] = configJSON.mainBackground;
    document.querySelector("#alert-modal").style["background-color"] = configJSON.alertBackground;
    document.querySelector("#heading-wrapper").style["color"] = configJSON.mainTextColour;
    document.querySelector("#alert-modal").style["color"] = configJSON.alertTextColour;
    document.querySelector("#eventname").innerHTML = configJSON.eventName;
    eventEndInfo = configJSON.eventEndInfo;
    document.querySelector(".progressbar").style["background-color"] = configJSON.progressBarRight;
    document.querySelector(".progressbar-inner").style["background-color"] = configJSON.progressBarLeft;

    updateTime();
    timerInterval = setInterval(updateTime, 1000);
})
.catch((error) => { document.querySelector("#heading-wrapper").innerHTML = "<h1>Error</h1><h5>" + error + "</h5>"});;

function updateTime()
{
    if (document.querySelector("#currenttime") === null)
    {
        clearInterval(timerInterval);
        return;
    }

    let timeObj = new Date();

    let hours = timeObj.getHours();
    let mins = timeObj.getMinutes();

    if (hours < 10)
    {
        hours = "0" + hours;
    }
    if (mins < 10)
    {
        mins = "0" + mins;
    }

    if (showColon)
    {
        document.querySelector("#currenttime").innerHTML = hours + ":" + mins;
        showColon = false;
    }
    else
    {
        document.querySelector("#currenttime").innerHTML = hours + "<span style='visibility: hidden;'>:</span>" + mins;
        showColon = true;
    }

    if (timeObj > timerClear)
    {
        if (document.querySelector("#remainingtime"))
        {
            document.querySelector("#remaininglabel").innerHTML = "<br>" + eventEndInfo;
            document.querySelector("#remainingtime").remove();
            document.querySelector(".progressbar").remove();
        }

        return;
    }

    let target  = null;
    if (timeObj < hackathonStart)
    {
        document.querySelector("#remaininglabel").innerHTML = "Begins In:";
        target = hackathonStart;
    }
    else
    {
        document.querySelector("#remaininglabel").innerHTML = "Time Remaining:";
        target = hackathonEnd;
    }

    if (hackathonEnd < Date.now())
    {
        document.querySelector("#remainingtime").innerHTML = "00:00:00";
        document.querySelector(".progressbar-inner").style.width = "100%";
        return;
    }

    timeObj = new Date(target - timeObj);
        hours = Math.floor(timeObj/3600000);
        mins  = Math.floor((timeObj%3600000)/60000);
    let secs  = Math.floor(timeObj%60000/1000);
    
    if (hours < 10)
    {
        hours = "0" + hours;
    }
    if (mins < 10)
    {
        mins = "0" + mins;
    }
    if (secs < 10)
    {
        secs = "0" + secs;
    }

    document.querySelector("#remainingtime").innerHTML = hours + ":" + mins + ":" + secs;


    let percent = 100 * ((hours*3600) + (mins*60) + secs) / eventDuration;
    document.querySelector(".progressbar-inner").style.width = (100 - percent) + "%";
}