const { SqlConnection } = require("../connections/SqlConnection");
(async () => {
    const jasmaAdmin = new SqlConnection("jasmaAdmin");
    jasmaAdmin.loadModels();
    await jasmaAdmin.drop();
    await jasmaAdmin.sync();
    await jasmaAdmin.close();
})();
