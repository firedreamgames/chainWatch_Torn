import React, { useState } from 'react';
import SignupTable from './SignupTable';
import Modal from './Modal';
import axios from 'axios';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal is open by default

  const handleLogin = async (apiKey) => {
    if (!apiKey) {
      alert('Please enter an API key');
      return;
    }

    try {
      // Fetch user data with the provided API key
      const response = await axios.get(`https://api.torn.com/user/?selections=basic&key=${apiKey}`);

      // Check if the API returned an error
      if (response.data.error) {
        alert('API key is not correct. Please try again.');
        return;
      }

      // Get the user's name from the response
      const userName = response.data.name;

      // Save API key and set the logged-in user's name
      setApiKey(apiKey);
      setLoggedInUser(userName);

      // Close the modal after login
      setIsModalOpen(false);

      // Show a welcome alert with the user's name
      alert(`Welcome ${userName}`);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to fetch user data. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal manually if needed
  };

  return (
    <div>
      {isModalOpen && <Modal closeModal={closeModal} handleLogin={handleLogin} />} {/* Show modal if not logged in */}
      {apiKey && <SignupTable loggedInUser={loggedInUser} apiKey={apiKey} />} {/* Pass apiKey and loggedInUser */}
    </div>
  );
};

export default App;


