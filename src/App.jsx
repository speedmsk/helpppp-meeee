import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LogSign from './sign_log_page/Log&sign';
import Forgetpassword from './sign_log_page/forgetPassword';
import Dashboard from './dashboard/dashboard';
import Project_list from './Admin/project_list/project_list';
import Users from './AdminPage/Users';
import AssignDevelopers from './All Boards/AssignDevelopers';
import DevList from './Developper/project_list/project_list_Dev'
import { useDispatch } from 'react-redux';
import { setUser } from './store/actions/userActions';

// Routes for Admin
const AdminRoutes = () => (
  <Routes>
    <Route index={11} path="/" element={<LogSign />} />
    <Route index={12} path="/forget-password" element={<Forgetpassword />} />
    <Route index={13} path="/admin/dashboard" element={<Users />} />
    <Route index={14} path="/List" element={<Project_list />} />
    <Route index={15} path="/dashboard/:boardId" element={<Dashboard />} />
    <Route index={16} path="/Allboards" element={<AssignDevelopers />} />
  </Routes>
);

// Routes for Chef
const ChefRoutes = () => (
  <Routes>
    <Route index={1} path="/" element={<LogSign />} />
    <Route index={2} path="/forget-password" element={<Forgetpassword />} />
    <Route index={3} path="/List" element={<Project_list />} />
    <Route index={4} path="/dashboard/:boardId" element={<Dashboard />} />
  </Routes>
);

// Routes for Developer
const DeveloperRoutes = () => (
  <Routes>
    <Route index={5} path="/" element={<LogSign />} />
    <Route index={6} path="/forget-password" element={<Forgetpassword />} />
    <Route index={7} path="/DevList" element={<DevList />} />
    <Route index={8} path="/dashboard/:boardId" element={<Dashboard />} />
  </Routes>
);

function App() {
  const [role, setRole] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const handleChangeStorage =()=>{
      if (userData) {
        if(email!==userData.userEmail){
          console.log("here")
          setRole(userData.userPost);
          setIsActive(userData.isActive);
          setEmail(userData.userEmail)
          // Dispatch user data to the Redux store
        dispatch(setUser(userData));
        } 
      }
    }
    window.addEventListener('storage', handleChangeStorage);
    return () => window.removeEventListener('storage', handleChangeStorage);

  }, [email]);

  // if (!isActive) {
  //   return (
  //     <BrowserRouter>
  //       <Routes>
  //         <Route index={} path="/" element={<LogSign />} />
  //         <Route index={} path="/forget-password" element={<Forgetpassword />} />
  //       </Routes>
  //     </BrowserRouter>
  //   );
  // }

  return (
    <BrowserRouter>
    {!isActive?
    <Routes>
    <Route index={9} path="/" element={<LogSign />} />
    <Route index={10} path="/forget-password" element={<Forgetpassword />} />
  </Routes>
    :
    <>
      {role === 'admin' && <AdminRoutes />}
      {role === 'chef' && <ChefRoutes />}
      {role === 'developer' && <DeveloperRoutes />}
    </>
    }
    </BrowserRouter>
  );
}

export default App;
