const { format } = require("date-fns");

//Filename wil be 45 characters in length
//Based on id (UUID), timestamp, and a random number
function generateFileName(id) {
    const timestamp = format(new Date(), "T") //miliseconds
    const digits = "0123456789";
    //Remove "-" chars from UUID
    id = id.replace(/[^a-z0-9 ]/g, ''); 
    //Generate a random number that is 15 chars in length
    let randNum = "";
    for (let i = 0; i < 15; i++) 
    {
        randNum += digits[Math.floor(Math.random() * digits.length)];
    }

    const randomStr = "" + timestamp + id + randNum;
    let result = "";

    //Generate the random filename with random chars from timestamp, userid, and randnum
    for (let i = 0; i < 45; i++) 
    {
        result += randomStr[Math.floor(Math.random() * randomStr.length)];
    }
    
    return result;
}

module.exports = {generateFileName};
