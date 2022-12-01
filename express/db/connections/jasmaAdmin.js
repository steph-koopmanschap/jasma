// persistent
const { SqlConnection } = require("./SqlConnection");
const connection = new SqlConnection("jasmaAdmin");
connection.loadModels();
module.exports = connection;
