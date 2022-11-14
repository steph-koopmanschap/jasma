const { userGen, userInfoGen } = require("./dataGenerator");

const user = userGen();
const userInfo = userInfoGen(user.user_id);
console.log("user", user);
console.log("userInfo", userInfo);
