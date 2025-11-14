// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import LeaveForm from '../components/LeaveForm';
import LeaveHistory from '../components/LeaveHistory';
import { leaveService } from '../services/leaveService';
import ds_img from '../assets/ds_img.jpg';


// Dashboard component to display user info, leave balance, and manage leaves
const Dashboard = ({ user, onLogout }) => {
    const [balance, setBalance] = useState(0);        //state variable for the balance of leaves
    const [refreshKey, setRefreshKey] = useState(0);  //state variable to trigger refresh

    // Calculate leave balance whenever refreshKey or user.username changes
    useEffect(() => {
        // const bal = leaveService.getLeaveBalance(user.username);
        // setBalance(bal);

        leaveService.resetIfFirstJanuary(user.username);
        const bal = leaveService.getLeaveBalance(user.username);
        setBalance(bal);
    }, [refreshKey, user.username]);

    // Handler for when a leave application is submitted
    const onSubmitted = async () => {
        setRefreshKey((k) => k + 1);
    };

    // Handler for approving or rejecting leave applications
    const handleApprove = async (id, approve) => {
        await leaveService.adminSetStatus(id, approve ? 'approved' : 'rejected');               // Update leave status
        setRefreshKey((k) => k + 1);
    };

    return (
        <div
            style={{
                backgroundImage: `url(${ds_img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>

            <div className='Page'>
                <header className='topbar'>
                    <h2>Welcome, {user.username}</h2>
                    <div>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                </header>

                <main className='content'>

                    {/* <section className="card">
                <h3>Your Leave Balance</h3>
                <p className='big'>{balance} days</p>
                </section> */}

                    {/* conditionally render the LeaveForm for users with leave balance but not for the admin */}
                    {!(user.username == 'admin') && (<section className='card'>
                        <h2>Apply for Leave</h2>
                        <LeaveForm onSubmitted={onSubmitted} username={user.username} />
                    </section>)
                    }
                    <section className='card'>
                        <h2 >Leave Applications</h2>
                        <LeaveHistory username={user.username} onAction={handleApprove} currentUser={user} />
                    </section>
                </main>

                <footer className='footer'>Leave Management System</footer>
            </div>
        </div>
    );
}

export default Dashboard