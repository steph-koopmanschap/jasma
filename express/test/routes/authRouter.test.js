require("dotenv").config({ path: `${__dirname}/../../.env` });
const db = require("../../db/connections/jasmaAdmin");
const { User } = db.models;
const request = require("supertest");
const server = require("../../index");
const chai = require("chai");
const should = chai.should();

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

after(async function () {
    await User.destroy({ where: { email: "john@gmail.com" } });
});

describe("routes:register", () => {
    describe("Returns appropriate response for invalid registrations", () => {
        const data = [
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
        ];

        for (let i = 0; i < data.length; i++) {
            const { body, error } = data[i];
            it(`Returns error: ${error}`, async function () {
                const res = await request(server).post("/api/auth/register").send(body);
                res.body.should.have.property("success");
                res.body.success.should.equal(false);
                res.body.should.have.property("errors");
                res.body.errors[0].msg.should.equal(error);
            });
        }
    });

    describe("Returns appropriate response for valid registration", () => {
        it("returns success", async function () {
            const res = await request(server).post("/api/auth/register").send(testUser);
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
        });
    });

    describe("Returns appropriate response when username is already taken", () => {
        it("returns error: Username already in use", async () => {
            const res = await request(server).post("/api/auth/register").send(testUser);
            res.body.should.have.property("success");
            res.body.success.should.equal(false);
            res.body.message.should.be.a("string");
        });
    });
});

describe("routes:login", () => {
    describe("Returns appropriate response for invalid logins", () => {
        const data = [
            {
                body: { ...testUser, password: "wrongPassword" },
                error: "Email or password is incorrect"
            },
            {
                body: { ...testUser, email: "notjohn@gmail.com" },
                error: "Email or password is incorrect"
            }
        ];

        for (let i = 0; i < data.length; i++) {
            const { body, error } = data[i];
            it(`Returns error: ${error}`, async () => {
                const res = await request(server).post("/api/auth/login").send(body);
                res.body.should.have.property("success");
                res.body.success.should.equal(false);
                res.body.message.should.equal(error);
            });
        }
    });

    describe("Returns appropriate response for valid login", () => {
        it("Returns success and session cookie", async () => {
            const res = await request(server).post("/api/auth/login").send(testUser.omit("username"));
            const cookies = res.headers["set-cookie"];
            cookies[0].should.match(/connect\.sid=.+/);
        });
    });
});

describe("routes:logout", () => {
    describe("Returns appropriate response for succesful logout", () => {
        it("Returns success", async () => {
            const res = await request(server).post("/api/auth/logout");
            res.body.should.have.property("success");
            res.body.success.should.equal(true);
        });
    });
});
