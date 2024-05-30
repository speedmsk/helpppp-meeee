import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WrongPath = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
    
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, [navigate]);

  return (
    <div>
      <h2>Page Not Found</h2>
      <p>You will be redirected to the login page shortly.</p>
    </div>
  );
};

export default WrongPath;
