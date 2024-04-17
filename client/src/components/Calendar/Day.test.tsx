import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Day from './Day';
import { format } from 'date-fns';
import { ProgramDay } from '../../types/calendarTypes';
import { advanceTo, clear } from 'jest-date-mock';

// Describe block defines a suite of tests for the Day component
describe('Day component', () => {

  // Set up a consistent test environment by mocking the current date
  beforeEach(() => {
    // Mock the current date to April 15, 2024, before each test
    advanceTo(new Date(2024, 3, 15)); // April 15, 2024, Monday
  });

  // Clean up after each test by clearing the mocked date
  afterEach(() => {
    clear();
  });

  // currentDate now will always be April 15, 2024, in the context of these tests
  const currentDate = new Date();

  // Test to check if the correct day number is rendered
  it('renders the correct day number', () => {
    const testDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 10);
    render(
      <table>
        <tbody>
          <tr><Day day={testDay} currentDate={currentDate} /></tr>
        </tbody>
      </table>
    );
    // Check if the rendered component includes the text '10' which is the day number
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  // Test to verify if today's date is highlighted
  it('highlights today\'s date', () => {
    render(
      <table>
        <tbody>
          <tr><Day day={currentDate} currentDate={currentDate} /></tr>
        </tbody>
      </table>
    );

    // Find the div containing the day number and navigate up to find the nearest <td>
    const dayNumberDiv = screen.getByText(format(currentDate, 'd'));
    const parentTd = dayNumberDiv.closest('td');
    // Expect the <td> element to have class 'selected'
    expect(parentTd).toHaveClass('selected');
  });

  // Test to ensure that days not in the current month have the 'disabled' style
  it('applies disabled style for days not in the current month', () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);    
    render(
      <table>
          <tbody>
              <tr>
                  <Day day={nextMonth} currentDate={currentDate} />
              </tr>
          </tbody>
      </table>
    );
    const dayNumberDiv = screen.getByText(format(nextMonth, 'd'));
    const parentTd = dayNumberDiv.closest('td');
    // Expect the <td> element to have class 'disabled'
    expect(parentTd).toHaveClass('disabled');
  });

  // Test to check if an activity title is displayed when provided
  it('displays the activity title if provided', () => {
    const testDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 10);
    const activity: ProgramDay = { weekday: 'MONDAY', title: 'Meeting', completed: false };
    render(
      <table>
        <tbody>
          <tr><Day day={testDay} currentDate={currentDate} dayActivity={activity} /></tr>
        </tbody>
      </table>
    );
    // Check if the rendered component includes the text 'MEETING'
    expect(screen.getByText('MEETING')).toBeInTheDocument();
  });

  // Test to ensure that the 'activity' class is not applied to today's date, even if there's an activity
  it('does not apply activity class to today\'s date, even if there\'s an activity', () => {
    const activity: ProgramDay = { weekday: 'MONDAY', title: 'Meeting', completed: false };
    render(
      <table>
        <tbody>
          <tr><Day day={currentDate} currentDate={currentDate} dayActivity={activity} /></tr>
        </tbody>
      </table>
    );

    // Find the div containing the day number and navigate up to find the nearest <td>
    const dayNumberDiv = screen.getByText(format(currentDate, 'd'));
    const parentTd = dayNumberDiv.closest('td');
    // Check that the 'selected' class is applied but 'activity' class is not
    expect(parentTd).toHaveClass('selected');
    expect(parentTd).not.toHaveClass('activity');
  });
});