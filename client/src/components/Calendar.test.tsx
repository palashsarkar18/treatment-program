import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calendar from './Calendar';
import { advanceTo, clear } from 'jest-date-mock';
import * as utility from '../utils/utility'; // Import utility functions to mock them
import * as useSSEHook from '../hooks/useSSE'; // Import all from the hook module
import { ProgramDay, ProgramData } from '../types/calendarTypes';

// Mock the entire module that exports useSSE
jest.mock('../../hooks/useSSE');

describe('Calendar Component', () => {
    beforeEach(() => {
        // Mocking the date to control the "current" date environment
        advanceTo(new Date(2024, 3, 15)); // April 15, 2024
        // Mock utility functions to control their output
        jest.spyOn(utility, 'generateMonth').mockReturnValue([[new Date(2024, 3, 14), new Date(2024, 3, 15), new Date(2024, 3, 16)]]);
        jest.spyOn(utility, 'findIncompleteActivities').mockReturnValue([]);
        jest.spyOn(utility, 'getDayActivity').mockImplementation(
            (calendarDay: Date, currentDate: Date, incompleteActivities: ProgramDay[] | undefined, programData: ProgramData | null): ProgramDay | undefined => {
              // Assuming 'weekday' needs to be one of the specific days like 'MONDAY', 'TUESDAY', etc.
              // and your mocked 'day' parameter is supposed to be the 'date' property of a 'ProgramDay'.
              return {
                weekday: 'MONDAY', // Just an example, adjust based on actual logic or test needs
                title: 'Test Activity',
                completed: false,
                date: calendarDay.toISOString() // or any other transformation/formatting if needed
              };
            }
          );
        // Set up the default mock return value for useSSE
        (useSSEHook.useSSE as jest.Mock).mockReturnValue({ data: null, error: false });
    });

    afterEach(() => {
        clear(); // Clear the mocked date
        jest.clearAllMocks(); // Reset all mocks
    });

    it('renders without crashing', () => {
        render(<Calendar />);
        expect(screen.getByText('Weekly Program')).toBeInTheDocument();
    });

    it('shows an error message if there is an error fetching data', () => {
        // Override the default mock for this test case
        (useSSEHook.useSSE as jest.Mock).mockReturnValue({ data: null, error: true });
        render(<Calendar />);
        expect(screen.getByText('Error while fetching data!')).toBeInTheDocument();
    });

    it('renders the correct number of days and weeks when data is provided', () => {
        // Mock return value with sample program data
        (useSSEHook.useSSE as jest.Mock).mockReturnValue({ data: { "week1": [{ "weekday": "MONDAY", "title": "Meeting", "completed": false }] }, error: false });
        render(<Calendar />);
        expect(screen.getAllByRole('row').length).toBeGreaterThan(0); // Should render some rows for weeks
        expect(screen.getAllByRole('cell').length).toBeGreaterThan(0); // Should render some cells for days
    });

    it('displays the activity title if provided', () => {
        // Mocking return values or other setups as needed
    
        render(<Calendar />);
        const activities = screen.getAllByText('TEST ACTIVITY');
        expect(activities.length).toBeGreaterThan(0); // Check that there are one or more activities
        activities.forEach(activity => {
          expect(activity).toBeInTheDocument(); // Verify each is in the document
        });
    });
});
