import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Weekdays from './Weekdays';
import { format, startOfWeek, addDays } from 'date-fns';

describe('Weekdays Component', () => {
  // Define a fixed date to ensure consistent test results
  const fixedDate = new Date(2024, 3, 15); // April 15, 2024, Monday.

  it('renders without crashing', () => {
    render(
      <table>
        <Weekdays currentDate={fixedDate} />
      </table>
    );
    const mondayHeader = screen.getByText('MON');
    expect(mondayHeader).toBeInTheDocument();
  });

  it('displays all weekdays starting from Monday', () => {
    render(
      <table>
        <Weekdays currentDate={fixedDate} />
      </table>
    );
    const start = startOfWeek(fixedDate, { weekStartsOn: 1 });
    const expectedDays = [];
    for (let i = 0; i < 7; i++) {
      expectedDays.push(format(addDays(start, i), 'eee').toUpperCase());
    }

    expectedDays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('correctly formats weekdays to three-letter uppercase', () => {
    render(
      <table>
        <Weekdays currentDate={fixedDate} />
      </table>
    );
    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      expect(header.textContent).toMatch(/^[A-Z]{3}$/); // Matches exactly three uppercase letters
    });
  });
});
