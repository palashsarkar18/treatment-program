import React from "react";
import { format, startOfWeek, addDays } from "date-fns";

const Weekdays: React.FC = () => {
  console.log("Calendar render");
  // Get the start of the week (Monday)
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Generate the weekdays using a loop to add days
  // TODO: Could this statement be combined into one?
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(start, i);
    weekdays.push(format(day, "eee").toUpperCase()); // 'eee' for three-letter abbreviation, and make it uppercase
  }

  return (
    <thead>
      <tr className="row header">
        {weekdays.map((day, index) => (
          <th className="col header-cell" key={index}>
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Weekdays;
