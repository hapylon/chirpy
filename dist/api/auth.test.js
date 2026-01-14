import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth";
import { BadRequest } from "./errorhandler";
describe("JWT Creation", () => {
    const userid1 = "lanetheabominator";
    const userid2 = "adrianthenaysayer";
    const expIN1 = 60;
    const expIN2 = .00000001;
    const secret1 = "the quick brown fox something something";
    const secret2 = "this is another short, insecure secret";
    let jwt1;
    let jwt2;
    beforeAll(async () => {
        jwt1 = makeJWT(userid1, expIN1, secret1);
        jwt2 = makeJWT(userid2, expIN2, secret2);
    });
    it("should return true if userid comes back same", async () => {
        const result = await validateJWT(jwt1, secret1);
        expect(result).toBe(userid1);
    });
    it("should take too long for this to work", async () => {
        expect(() => validateJWT(jwt2, secret2))
            .toThrow(BadRequest);
    });
});
// describe("Password Hashing", () => {
//   const password1 = "correctPassword123!";
//   const password2 = "anotherPassword456!";
//   let hash1: string;
//   let hash2: string;
//   beforeAll(async () => {
//     hash1 = await hashPassword(password1);
//     hash2 = await hashPassword(password2);
//   });
//   it("should return true for the correct password", async () => {
//     const result = await checkPasswordHash(password1, hash1);
//     expect(result).toBe(true);
//   });
// });
