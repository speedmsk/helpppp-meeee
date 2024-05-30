import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Social from './social-media';
import './App.css';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/actions/userActions';
import { useAuth } from '../utilities/useAuth';

export default function Log() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user}=useAuth()
  useEffect(() => {
    // Check if the page has been refreshed already
    if (!sessionStorage.getItem('refreshedOnce')) {
      sessionStorage.setItem('refreshedOnce', 'true');
      window.location.reload();
    }
  }, []);

  const handleLogin = async () => {
    if (name && password) {
      try {
        const res = await axios.post("https://localhost:7125/login", { name, password });

        const userData = res.data;

        // Dispatch user data to the Redux store
        dispatch(setUser(userData));
        
        // Set a cookie with user data, expires in 365 days
        Cookies.set('userData', JSON.stringify(userData), { expires: 365 });

        // Save user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        console.log('User data:', userData);
        console.log(res);
        let post = userData.userPost;
        console.log(post);
        console.log(user)
     
          
          if (post === 'admin' || post === 'chef') {
            navigate("/List");
          } else if (post === 'developer') {
            navigate("/DevList");
          } else {
            navigate("/");
          }

      } catch (error) {
        console.error("Login failed:", error);
        setErrorMsg("Login failed, please check your credentials and try again.");
      }
    } else {
      setErrorMsg("Please enter both username and password.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <h2 className="title">Sign in</h2>
      <div className="input-field">
        <i className="fas fa-user"></i>
        <input type="text" placeholder="Username" onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <input type="submit" value="Login" className="btni solid" />
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <p className="social-text">Or Sign in with social platforms</p>
      <Social />
      <Link to="/forget-password" className="forget">Forget Password</Link>
    </form>
  );
}
