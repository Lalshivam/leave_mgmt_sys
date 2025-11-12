// importing libraries
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

/*
- Mock login page - uses a username for dummy login
- Type "admin" to login as admin, else as normal user
*/


export default function LoginPage({ onLogin }) {       //onLogin is a prop function to handle login
    const [username, setUsername] = useState('');    //State variable for username
    const navigate = useNavigate();

    //function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();                                                                         //prevent default form submission behavior
        if(!username.trim()) return alert('Enter a username');                                      //validate non-empty username
        onLogin({username:username.trim(), role: username.trim() === 'admin'? 'admin' : 'user'});   //call onLogin with user details
        navigate('/dashboard');                                                                     //navigate to dashboard after login
    }
    
  return (
    <div className='center-card'>
        <h1>Leave Management System</h1>
        <form onSubmit={handleSubmit} className='form'>
            <label htmlFor="username">
                Username : 
                <input type="text" value = {username} onChange={(e)=>{setUsername(e.target.value)}} placeholder="e.g. , rahul or admin"/>    
            </label>
            <button type="submit">Login (mock)</button>
            <p className="muted">Hint: Login as <strong>admin</strong> to see admin view</p>
            {/* debug purpose log*/}
            {console.log(`${username} logged in`)}
        </form>
    </div>
  )
}

