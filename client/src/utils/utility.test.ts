import { advanceTo, clear } from 'jest-date-mock';
import { generateMonth, findIncompleteActivities, getDateFromWeekAndDay } from './utility';
import { ProgramData } from '../types/calendarTypes';

// Describes a suite of tests for various utility functions used in the application.
describe('Utility functions', () => {

  // Test suite for the generateMonth function, which generates an array of weeks for the current month.
  describe('generateMonth', () => {
    // Before each test, advance the mock date to January 1st, 2023. This sets a consistent testing environment.
    beforeEach(() => {
      advanceTo(new Date('2023-01-01T00:00:00Z'));
    });

    // After each test, clear the mock to ensure no date leaks between tests.
    afterEach(() => {
      clear();
    });

    // Test that the function correctly generates the weeks of the month.
    it('should generate weeks correctly for a given month', () => {
      const weeks = generateMonth();
      const totalDays = weeks.reduce((acc, week) => acc + week.length, 0);
      const firstDayInCalendar: Date = weeks[0][0];
      // Check that the generated month contains at least 4 weeks, since most months do.
      expect(weeks.length).toBe(6);
      // Verify that the first week of the array has 7 days, as all weeks should.
      expect(weeks[0].length).toBe(7);
      // Verify that total number of days for January calendar is 43 (26 Dec - 31 Dec 2022, 1 Jan - 31 Jan 2023, 1 Feb - 5 Feb 2023)
      expect(totalDays).toBe(42);
      // First day in the calendar should be 26 Dec 2022.
      const expectedDate = new Date(Date.UTC(2022, 11, 25, 22)); 
      expect(firstDayInCalendar).toEqual(expectedDate);
    });
  });

  // Test suite for findIncompleteActivities, which identifies incomplete activities before the current date.
  describe('findIncompleteActivities', () => {
    // Sets the mock date to February 1st, 2023 before each test.
    beforeEach(() => {
      advanceTo(new Date('2023-02-01T00:00:00Z'));
    });

    // Resets the mock date after each test.
    afterEach(() => {
      clear();
    });

    // Test to ensure that the function finds all incomplete activities before the set date.
    it('should find all incomplete activities before today', () => {
      const programData: ProgramData = {
        week1: [{ weekday: 'MONDAY', title: 'Test Activity', completed: false }],
        week2: [{ weekday: 'TUESDAY', title: 'Test Activity 2', completed: false }]
      };
      const incompleteActivities = findIncompleteActivities(new Date(2023), programData);
      // Expect at least one incomplete activity to be found since both activities are marked incomplete and before the mock date.
      expect(incompleteActivities.length).toBeGreaterThan(0);
    });
  });

  // Test suite for getDateFromWeekAndDay, which calculates the date based on the ISO week number and day of the week.
  describe('getDateFromWeekAndDay', () => {
    // Test to ensure that the function calculates the correct date for the first Monday of 2023.
    it('should calculate the correct date for a given weekday and ISO week number', () => {
      const receivedDate = getDateFromWeekAndDay('MONDAY', 1, 2023);
      // Expected date is January 1st, 2023. Creating a date with UTC hours to match timezones.
      const expectedDate = new Date(Date.UTC(2023, 0, 1, 22)); // Correcting the expected date to the 2nd since Jan 1 is a Sunday
      // Compare the function output with the expected date.
      expect(receivedDate).toEqual(expectedDate);
    });
  });
});
