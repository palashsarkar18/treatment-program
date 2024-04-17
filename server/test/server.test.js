"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing necessary libraries and modules.
const supertest_1 = __importDefault(require("supertest")); // supertest is used to simulate HTTP requests.
const server_1 = __importDefault(require("../src/server")); // Importing the Express app from the server module for testing.
// Define a suite of tests for the API Treatment Endpoints.
describe('API Treatment Endpoint Tests', () => {
    // Test case to check if the API correctly rejects an invalid treatment program structure.
    it('should reject invalid treatment program structure', () => __awaiter(void 0, void 0, void 0, function* () {
        // Define an invalid treatment program data structure.
        const invalidProgram = { week1: [{ weekday: 'MONDAYS', title: 'Activity', completed: true }] };
        // Make a POST request to the '/api/treatment' endpoint with invalid data.
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/api/treatment')
            .send(invalidProgram)
            .expect(400); // We expect a 400 Bad Request response for invalid input.
        // Check if the response text matches the expected error message.
        expect(response.text).toEqual("Program must contain exactly three weeks.");
    }));
    // Test case to verify that the API accepts a valid treatment program structure.
    it('should accept valid treatment program structure', () => __awaiter(void 0, void 0, void 0, function* () {
        // Define a valid treatment program data structure.
        const validProgram = {
            week1: [{ weekday: 'MONDAY', title: 'Valid Activity', completed: false }],
            week2: [{ weekday: 'WEDNESDAY', title: 'Valid Activity', completed: true }],
            week3: [{ weekday: 'FRIDAY', title: 'Valid Activity', completed: false }],
        };
        // Make a POST request to the '/api/treatment' endpoint with valid data.
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/api/treatment')
            .send(validProgram)
            .expect(200); // We expect a 200 OK response for valid input.
        // Check if the response text confirms that the treatment program was successfully received and stored.
        expect(response.text).toEqual("Treatment program received and stored successfully");
    }));
});
