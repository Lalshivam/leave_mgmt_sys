// importing libraries
import React, { useState, useEffect } from 'react'

//importing components and services
import LoginPage from './components/LoginPage';
import Dashboard from './pages/Dashboard';
import {authService} from './services/authService';
import './App.css';

//importing routing components
import {Routes,Route,Navigate,useNavigate} from 'react-router-dom';

//main App component
const App = () => {

  //state variable for the logged in user
  const [user,setUser] = useState('');
  const navigate = useNavigate();

  //effect to monitor authentication state changes
  useEffect(()=>{
    const unsub = authService.subscribe((u)=>{
      setUser(u);
      if(u) navigate('/dashboard');
      else navigate('/login');
    });
    return () => unsub();
  },[navigate]);

  return (

    //defining routes for the application
    <Routes>
      {/* Redirecting to the appropriate page based on authentication status */}
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'}/>}/>  
      <Route path="/login" element={<LoginPage onLogin={(u)=> authService.login(u)} />} />
        {/* Login Route */}
        <Route
         path="/dashboard"
         element={
          user ? <Dashboard user={user} onLogout={()=>authService.logout()}/>
           : <Navigate to="/login" />}
        />      
    </Routes>
  );
}

export default App