const fs = require('fs');

function loadNamesJSON(socketID)
{
    let rawJSON = fs.readFileSync('src/data/characterList.json');  
    let characterJSON = JSON.parse(rawJSON);  
    console.log(characterJSON);  

    var namesObject = characterJSON["names"];

    if(namesObject == null)
        return;

    var nameTypeCount = Object.keys(namesObject).length;

    console.log("Name Types Found: " + nameTypeCount);

    var rand = getRandomIntEx(0, nameTypeCount);

    console.log("rand " + rand);

    var key = Object.keys(namesObject)[rand];
    var value = namesObject[key];

    console.log("Names Found: " + value);

    var firstNameCount = value.length;

    rand = getRandomIntEx(0, nameTypeCount);

    console.log("rand " + rand);

    var firstName = value[rand];

    console.log("Final Name: " + firstName + " " + key);
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomIntEx(min, max) {
    return Math.floor(Math.random() * (max- 1 - min)) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomIntInc(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  module.exports = {
    loadNamesJSON: loadNamesJSON
  }