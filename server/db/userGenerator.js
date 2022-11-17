const { userGen, userInfoGen, userMetaDataGen } = require("./dataGenerator");

const user = userGen();
const userInfo = userInfoGen(user.user_id);
const userMetaData = userMetaDataGen(user.user_id, "normal");
console.log("user", user);
console.log("userInfo", userInfo);
console.log("userMetaData", userMetaData);
