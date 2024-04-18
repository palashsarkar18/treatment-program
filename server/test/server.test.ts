// Importing necessary libraries and modules.
import request from 'supertest'; // supertest is used to simulate HTTP requests.
import app from '../src/server'; // Importing the Express app from the server module for testing.
import { isValidTreatmentProgram } from '../src/validators/validateTreatmentProgram';

// Define a suite of tests for the API Treatment Endpoints.
describe('API Treatment Endpoint Tests', () => {
    let token: string; // Variable to store the token.

    // Function to login and store the authentication token
    const loginUser = async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'admin',
                password: 'admin123',
            })
            .expect(200); // Make sure your login route responds with 200 on success

        token = res.body.token; // Assuming the token is returned in the body
    }

    // Run before any tests are executed
    beforeAll(async () => {
        await loginUser(); // Log in and store the token
    });

    // Test case to check if the API correctly rejects an invalid treatment program structure.
    it('should reject invalid treatment program structure', async () => {
        // Define an invalid treatment program data structure.
        const invalidProgram = { week1: [{ weekday: 'MONDAYS', title: 'Activity', completed: true }] };
        
        // Make a POST request to the '/api/treatment' endpoint with invalid data.
        const response = await request(app)
            .post('/api/treatment')
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header with the token
            .send(invalidProgram)
            .expect(400); // We expect a 400 Bad Request response for invalid input.

        // Check if the response text matches the expected error message.
        expect(response.text).toEqual("Program must contain exactly three weeks.");
    });

    // Test case to verify that the API accepts a valid treatment program structure.
    it('should accept valid treatment program structure', async () => {
        // Define a valid treatment program data structure.
        const validProgram = {
            week1: [{ weekday: 'MONDAY', title: 'Valid Activity', completed: false }],
            week2: [{ weekday: 'WEDNESDAY', title: 'Valid Activity', completed: true }],
            week3: [{ weekday: 'FRIDAY', title: 'Valid Activity', completed: false }],
        };
        
        // Make a POST request to the '/api/treatment' endpoint with valid data.
        const response = await request(app)
            .post('/api/treatment')
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header with the token
            .send(validProgram)
            .expect(200); // We expect a 200 OK response for valid input.

        // Check if the response text confirms that the treatment program was successfully received and stored.
        expect(response.text).toEqual("Treatment program received and stored successfully");
    });

    // Test case to check wrong or missing keys.
    it('should reject treatment program structure', async () => {
        // Define a valid treatment program data structure.
        const invalidProgram = {
            week1: [{ weekday: 'MONDAY', title: 'Valid Activity' }],
            week2: [{ weekday: 'WEDNESDAY', title: 'Valid Activity', completed: true }],
            week3: [{ weekday: 'FRIDAY', title: 'Valid Activity', completed: false }],
        };
        
        // Make a POST request to the '/api/treatment' endpoint with valid data.
        const response = await request(app)
            .post('/api/treatment')
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header with the token
            .send(invalidProgram)
            .expect(400); // We expect a 200 OK response for valid input.

        // Check if the response text confirms that the activity of week1 is invalid.
        expect(response.text).toEqual("Invalid activities structure in week1.");
    });

    // Test case to invalidate those activities where future activities are set to true.
    it('should reject treatment program structure', async () => {

        const testDate: Date = new Date(2024, 3, 15) // April 15, 2024 Monday. Week 16.
        // Define a valid treatment program data structure.
        const invalidProgram = {
            week14: [{ weekday: 'MONDAY', title: 'Valid Activity', completed: true }],
            week15: [{ weekday: 'WEDNESDAY', title: 'Valid Activity', completed: true }],
            week16: [{ weekday: 'FRIDAY', title: 'Valid Activity', completed: true }], // This is a future event
        };
        
        // Call the function with the invalid program and the test date
        const result = isValidTreatmentProgram(invalidProgram, testDate);

        // Check if the function returned the expected invalid result
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toEqual("Future activity in week16 should not be marked as completed.");

    });

    // Test case to invalidate those activities where future activities are set to true.
    it('should reject treatment program structure', async () => {

        const testDate: Date = new Date(2024, 3, 15) // April 15, 2024 Monday. Week 16.
        // Define a valid treatment program data structure.
        const invalidProgram = {
            week15: [{ weekday: 'MONDAY', title: 'Valid Activity', completed: true }],
            week16: [{ weekday: 'WEDNESDAY', title: 'Valid Activity', completed: false }],
            week17: [{ weekday: 'FRIDAY', title: 'Valid Activity', completed: false }], // This is a future event
        };
        
        // Call the function with the invalid program and the test date
        const result = isValidTreatmentProgram(invalidProgram, testDate);

        // Check if the function returned the expected invalid result
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toEqual("The first week does not start on the first full week of its month.");

    });
});
