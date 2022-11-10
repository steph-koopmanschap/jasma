//ONLY FOR NODEJS/SERVER!
const crypto = require('crypto');

//Generetate a random V4 UUID. 
//This can be used for creating primary keys for PostGreSQL database.
function genUUID()
{
    return crypto.randomUUID();
}

module.exports = genUUID;
