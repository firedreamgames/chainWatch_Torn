import React, { useState, useEffect } from 'react';
import './SignupTable.css';
import './AdminMenu.css'; // CSS for the admin menu
import './Modal.css'; // Existing CSS for the login modal
import './DateDurationModal.css'; // New CSS for the date & duration modal
import axios from 'axios';

const generateDates = (startDate, duration) => {
  const start = new Date(startDate);
  return Array.from({ length: duration }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date.toLocaleDateString('en-GB');
  });
};

const generateTimes = () => Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);

const adminUsers = ['HtwoO']; // Admin users

const SignupTable = ({ loggedInUser, apiKey }) => {
  const [members, setMembers] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [tableReady, setTableReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility for date & duration
  const [startDate, setStartDate] = useState(new Date().toISOString().substr(0, 10)); // Today's date
  const [duration, setDuration] = useState(7); // Default duration is 7 days
  const [unlockAll, setUnlockAll] = useState(false); // Track the unlock state

  const dates = generateDates(startDate, duration);
  const times = generateTimes();

  // Fetch members from the Torn API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`https://api.torn.com/faction/?selections=basic&key=${apiKey}`);
        if (response.data.members) {
          setMembers(response.data.members);
          setTableReady(true);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    if (apiKey) {
      fetchMembers();
    }
  }, [apiKey]);

  // Scroll to the user's row once the table is fully populated and loggedInUser is set
  useEffect(() => {
    if (loggedInUser && tableReady) {
      setActiveUser(loggedInUser);
      scrollToUser(loggedInUser);
      
      // Check if the logged-in user is an admin
      if (adminUsers.includes(loggedInUser)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [loggedInUser, tableReady]);

  // Scroll to the specific user's row in the table
  const scrollToUser = (username) => {
    const userRow = document.getElementById(username);
    if (userRow) {
      userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Toggle the visibility of the admin dropdown menu
  const toggleAdminMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Open the modal for changing the date and duration
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission from the modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  // Handle date and duration changes inside the modal
  const handleDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value);
    if (newDuration > 0) {
      setDuration(newDuration);
    }
  };

  // Handle the "Unlock All" function, enabling all checkboxes
  const handleUnlockAll = () => {
    setUnlockAll(true); // Set state to unlock all checkboxes
  };

  return (
    <div className="table-page">
      {isAdmin && (
        <div className="admin-menu-container">
          <button onClick={toggleAdminMenu} className="admin-menu-button">
            Admin Menu
          </button>
          {isMenuOpen && (
            <div className="admin-menu-dropdown">
              <ul>
                <li onClick={openModal}>Change Date & Duration</li>
                <li onClick={handleUnlockAll}>Unlock All</li> {/* Unlock all checkboxes */}
                <li>Admin Function 3</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Modal for date and duration */}
      {isModalOpen && (
        <div className="date-duration-modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Change Start Date and Duration</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Start Date:
                <input type="date" value={startDate} onChange={handleDateChange} />
              </label>
              <label>
                Duration (days):
                <input type="number" value={duration} onChange={handleDurationChange} />
              </label>
              <button type="submit" className="submit-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table style={{ minWidth: `${1000 * duration}px` }}>
          <thead>
            <tr>
              <th className="sticky-col">Name</th>
              {dates.map((date, idx) => (
                <th key={idx} colSpan="24" className="sticky-date">{date}</th>
              ))}
            </tr>
            <tr>
              <td className="sticky-col"></td>
              {dates.map(() =>
                times.map((time, idx) => (
                  <th key={idx} className="time-header">{time}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {Object.keys(members).map((memberId) => {
              const isActiveUser = members[memberId].name === activeUser;
              const rowClass = isActiveUser ? 'highlight-row' : ''; // Apply highlight class to logged-in user
              return (
                <tr key={memberId} id={members[memberId].name} className={rowClass}>
                  <td className="sticky-col">{members[memberId].name}</td>
                  {dates.map(() =>
                    times.map((_, idx) => (
                      <td key={idx}>
                        <input
                          type="checkbox"
                          disabled={unlockAll ? false : !isActiveUser} /* Unlock all checkboxes if "Unlock All" is clicked */
                        />
                      </td>
                    ))
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SignupTable;















