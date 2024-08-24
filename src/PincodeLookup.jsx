import React, { useState } from 'react';
import axios from 'axios';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [postOfficesList, setPostOfficesList] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setPincode(e.target.value);
  };

  const handleLookup = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data[0];

      if (data.Status === 'Success') {
        setPostOfficesList(prevList => [...prevList, { pincode, postOffices: data.PostOffice }]);
        setError('');
      } else {
        setError('No details found for this pincode.');
      }
    } catch (err) {
      setError('An error occurred while fetching the data.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Pincode Lookup</h2>
      <input
        type="text"
        placeholder="Enter 6-digit pincode"
        value={pincode}
        onChange={handleInputChange}
        maxLength="6"
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleLookup} style={{ padding: '10px', width: '100%' }}>
        Lookup
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        {postOfficesList.map((entry, index) => (
          <div key={index} style={{ marginBottom: '40px' }}>
            <h3>Pincode: {entry.pincode}</h3>
            {entry.postOffices.map((office, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <p><strong>Post Office Name:</strong> {office.Name}</p>
                <p><strong>Branch Type:</strong> {office.BranchType}</p>
                <p><strong>Delivery Status:</strong> {office.DeliveryStatus}</p>
                <p><strong>District:</strong> {office.District}</p>
                <p><strong>State:</strong> {office.State}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PincodeLookup;
