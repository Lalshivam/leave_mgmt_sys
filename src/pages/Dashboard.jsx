import React, { useEffect, useState } from 'react'
import LeaveForm from '../components/LeaveForm';
import LeaveHistory from '../components/LeaveHistory';
import { leaveService } from '../services/leaveService';


// Dashboard component to display user info, leave balance, and manage leaves
const Dashboard = ({user, onLogout}) => {
    const [balance, setBalance] = useState(0);        //state variable for the balance of leaves
    const [refreshKey, setRefreshKey] = useState(0);  //state variable to trigger refresh
 
    // Calculate leave balance whenever refreshKey or user.username changes
    useEffect(()=>{
        const bal = leaveService.getLeaveBalance(user.username);
        setBalance(bal);
    },[refreshKey,user.username]);
    
    // Handler for when a leave application is submitted
    const onSubmitted = async() => {
        setRefreshKey((k) => k+1 );
    };
  
    // Handler for approving or rejecting leave applications
    const handleApprove = async (id , approve) => {
        await leaveService.adminSetStatus(id, approve ? 'approved' : 'rejected');               // Update leave status
        setRefreshKey((k) => k+1);
    };

  return (
    <div className='Page'>
        <header className='topbar'>
            <h2>Welcome, {user.username}</h2>
            <div>
                <button onClick={onLogout}>Logout</button>
            </div>
        </header>

        <main className='content'>
            
            <section className="card">
                <h3>Your Leave Balance</h3>
                <p className='big'>{balance} days</p>
            </section>

            <section className='card'>
                <h3>Apply for Leave</h3>
                <LeaveForm onSubmitted={onSubmitted} username={user.username}/>
            </section>

            <section className='card'>
                <h3>Leave History</h3>
                <LeaveHistory username={user.username} onAction={handleApprove} currentUser={user}/>
            </section>
        </main>

        <footer className='footer'>Leave Management System</footer>
    </div>
  );
}

export default Dashboard