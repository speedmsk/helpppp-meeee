import React, { useEffect } from 'react';
import './App.css';

import { BrowserRouter, Link, Routes,Route } from "react-router-dom";
import LogSign from './Log&sign';
import Forgetpassword from './forgetPassword';



function App() { 

 

  return (
    <>
 
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogSign />} />
        <Route path="/forget-password" element={<Forgetpassword />} />
      </Routes>
    </BrowserRouter>
   

   

    
    
 
   
      
    </>
  )
}

export default App;
