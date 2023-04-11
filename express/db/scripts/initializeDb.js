const { SqlConnection } = require("../connections/SqlConnection");

(async () => {
    try {
        const superUser = new SqlConnection("superUser");
        await superUser.initializeDatabase();
        await superUser.close();

        const jasmaAdmin = new SqlConnection("jasmaAdmin");
        jasmaAdmin.loadModels();
        await jasmaAdmin.createTables();
        await jasmaAdmin.close();
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
})();
