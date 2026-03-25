

// export default BookingCalendar;
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

const BookingCalendar = ({ rentedDates, onDateSelect }) => {
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Determine the CSS class for each calendar tile
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isRented = rentedDates.some((rentedDate) =>
        dayjs(date).isSame(dayjs(rentedDate), 'day')
      );
      const isBeforeToday = dayjs(date).isBefore(dayjs(), 'day');
      return isRented ? 'rented' : (isBeforeToday ? 'before-today' : null);
    }
    return null;
  };

  // Disable specific rented dates
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return rentedDates.some((rentedDate) =>
        dayjs(date).isSame(dayjs(rentedDate), 'day')
      ) || dayjs(date).isBefore(dayjs(), 'day');
    }
    return false;
  };

  // Handle date range selection
  const handleChange = (selectedDates) => {
    if (Array.isArray(selectedDates) && selectedDates.length === 2) {
      const startDate = dayjs(selectedDates[0]).startOf('day').toDate();
      const endDate = dayjs(selectedDates[1]).endOf('day').toDate();

      // Check if the selected range includes any rented dates
      const rangeConflicts = rentedDates.some((rentedDate) =>
        dayjs(rentedDate).isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]')
      );

      if (rangeConflicts) {
        alert('The selected range includes rented dates. Please select a different range.');
        return; // Prevent selection
      }

      setSelectedDateRange([startDate, endDate]);

      onDateSelect({
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      });
    }
  };

  // Handle mouse hover to show potential range preview
  const handleMouseHover = (date) => {
    setHoveredDate(date);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  // Set the minimum selectable date to today and a maximum limit (e.g., 2 years from today)
  const minDate = new Date();
  const maxDate = dayjs().add(2, 'months').toDate();

  return (
    <div className="booking-calendar">
      <Calendar
        onChange={handleChange}
        value={selectedDateRange}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
        minDate={minDate}
        maxDate={maxDate}
        selectRange={true}
        onMouseOver={({ activeStartDate }) => handleMouseHover(activeStartDate)}
        onMouseOut={handleMouseLeave}
      />
      {selectedDateRange.length === 2 && (
        <p>
          Selected Date Range: {dayjs(selectedDateRange[0]).format('YYYY-MM-DD')} -{' '}
          {dayjs(selectedDateRange[1]).format('YYYY-MM-DD')}
        </p>
      )}
      {/* Custom styles */}
      <style>{`
        .booking-calendar {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          border-radius: 10px;
        }
        .react-calendar__tile {
          background-color:rgb(255, 255, 255) !important; /* Green background */
          color: black !important; /* Black font color for visibility */
        }
        .rented {
          background-color:rgb(139, 56, 56) !important; /* Red background for rented dates */
          color: white !important; /* Red font color for rented dates */
        }
        .before-today {
          background-color: #d3d3d3 !important; /* Gray background for dates before today */
          color: gray !important; /* Gray font color for dates before today */
          pointer-events: none; /* Disable click events for these tiles */
        }
        // .react-calendar__tile--now {
        //   background:rgb(227, 248, 227) !important;
        //   color: black !important; /* Ensure now date is visible */
        // }
        .react-calendar__tile--active {
          background:rgb(0, 64, 132) !important;
          color: white !important;
        }
        .react-calendar__navigation button {
          color: #007bff;
        }
        .react-calendar__tile--hover {
          background-color:rgb(127, 180, 249) !important;
        }
        .before-today {
          background-color: #d3d3d3 !important; /* Gray background for dates before today */
          color: gray !important; /* Gray font color for dates before today */
          pointer-events: none; /* Disable click events for these tiles */
        }
      `}</style>
    </div>
  );
};

export default BookingCalendar;