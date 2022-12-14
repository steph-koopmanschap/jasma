const db = require("../../db/connections/jasmaAdmin");
const { User } = db.models;
const request = require("supertest");
const { redisClient, server } = require("../../index.js");
/* consider using mocha instead */
class TestUser {
    constructor(username, email, password) {
        (this.username = username), (this.email = email), (this.password = password);
    }

    omit(key) {
        return Object.fromEntries(Object.entries(this).filter((x) => x[0] !== key));
    }
}

const testUser = new TestUser("john", "john@gmail.com", "abcdefg");

async function tearDown() {
    await User.destroy({ where: { email: "john@gmail.com" } });
    await db.close();

    await new Promise((resolve) => {
        redisClient.quit();
        redisClient.on("end", resolve);
    });
    server.close();
}

afterAll(() => {
    return tearDown();
});

describe("routes:register", () => {
    describe("invalid registrations return appropriate errors", () => {
        test.each([
            {
                body: testUser.omit("username"),
                error: "Username must be provided"
            },
            {
                body: { ...testUser, username: "jo" },
                error: "Username must be between 3 and 25 characters"
            },
            {
                body: testUser.omit("email"),
                error: "Email must be provided"
            },
            {
                body: { ...testUser, email: "john@g" },
                error: "Email must be valid"
            },
            {
                body: testUser.omit("password"),
                error: "Password must be provided"
            },
            {
                body: { ...testUser, password: "abc" },
                error: "Password must be at least 5 characters"
            }
        ])("returns error: $error", async ({ body, error }) => {
            const res = await request(server).post("/api/auth/register").send(body);
            expect(res.body).toHaveProperty("errors");
            const { errors } = res.body;
            expect(errors[0].msg).toBe(error);
        });
    });

    describe("valid registration returns success response", () => {
        test("returns success: true", async () => {
            const res = await request(server).post("/api/auth/register").send(testUser);
            expect(res.body).toHaveProperty("success");
            expect(res.body.success).toBe(true);
        });
    });
});
