// Importing necessary libraries and modules.
import request from 'supertest'; // supertest is used to simulate HTTP requests.
import app from '../src/server'; // Importing the Express app from the server module for testing.

// Define a suite of tests for the API Treatment Endpoints.
describe('API Treatment Endpoint Tests', () => {
    // Test case to check if the API correctly rejects an invalid treatment program structure.
    it('should reject invalid treatment program structure', async () => {
        // Define an invalid treatment program data structure.
        const invalidProgram = { week1: [{ weekday: 'MONDAYS', title: 'Activity', completed: true }] };
        
        // Make a POST request to the '/api/treatment' endpoint with invalid data.
        const response = await request(app)
            .post('/api/treatment')
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
            .send(validProgram)
            .expect(200); // We expect a 200 OK response for valid input.

        // Check if the response text confirms that the treatment program was successfully received and stored.
        expect(response.text).toEqual("Treatment program received and stored successfully");
    });
});
