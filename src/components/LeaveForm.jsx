// src/components/LeaveForm.jsx
import React, { useState, useEffect } from 'react'
import { leaveService } from '../services/leaveService';

export default function LeaveForm({ onSubmitted, username }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [leaveBalance, setLeaveBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [daysRequested, setDaysRequested] = useState(0);

    // Fetch leave balance on component mount
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const balance = await leaveService.getLeaveBalance(username);
                setLeaveBalance(balance ?? 0);
            } catch (err) {
                console.error('Failed to fetch leave balance', err);
                setLeaveBalance(0);
            }
        };
        fetchBalance();
    }, [username]);

    // Calculate days when dates change
    useEffect(() => {
        if (startDate && endDate) {
            const days = leaveService.calculateDays(startDate, endDate);
            setDaysRequested(days);
        }
    }, [startDate, endDate]);

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate: Start date cannot be in past
        const today = new Date();
        const selectedStartDate = new Date(startDate);
        if (selectedStartDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            return alert('Start date cannot be in the past');
        }

        // Validate: Both dates required
        if (!startDate || !endDate) {
            return alert('Please choose start and end dates');
        }

        // Validate: End date after start date
        if (new Date(endDate) < new Date(startDate)) {
            return alert('End date cannot be before start date');
        }

        const days = leaveService.calculateDays(startDate, endDate);

        //  CORRECT - Check actual balance value
        if (leaveBalance <= 0) {
            return alert('All leave balance exhausted');
        }

        //  CORRECT - Check if days exceed balance
        if (days > leaveBalance) {
            return alert(`Insufficient leave balance. Requested: ${days} days, Available: ${leaveBalance} days`);
        }

        const existingLeaves = leaveService.getLeavesByUser(username);
        const overlaps = existingLeaves.some(l => 
        l.status !== "rejected" &&  
        (new Date(startDate) <= new Date(l.endDate)) &&
        (new Date(endDate) >= new Date(l.startDate))
    );
    if (overlaps) return alert('You already have a leave overlapping with this period.');

        const form = {
            username,
            startDate,
            endDate,
            reason,
            days,
            status: 'pending',
            appliedAt: new Date().toISOString()
        };

        setLoading(true);
        try {
            await leaveService.applyLeave(form);
            alert('Leave applied successfully');
            
            // Reset form
            setStartDate('');
            setEndDate('');
            setReason('');
            setDaysRequested(0);

            // Refresh balance
            const newBalance = await leaveService.getLeaveBalance(username);
            setLeaveBalance(newBalance ?? 0);

            onSubmitted && onSubmitted();
        } catch (err) {
            alert(`Error applying leave: ${err.message}`);
            console.error('Leave application failed', err);
        } finally {
            setLoading(false);
        }
    };

    // Disable submit if insufficient balance or no dates selected
    const isSubmitDisabled = !startDate || !endDate || daysRequested > leaveBalance || leaveBalance <= 0 || loading;

    return (
        <form className='form' onSubmit={handleSubmit}>
            {/* Display current leave balance */}
            <div className='balance-info'>
                <p><strong>Leave Balance: {leaveBalance} days</strong></p>
                {daysRequested > 0 && (
                    <p>Days Requested: {daysRequested} days {daysRequested > leaveBalance ? '❌ (Exceeds balance)' : '✅'}</p>
                )}
            </div>

            <div style={{display:'flex'}}>
            <label>
                Start Date
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={getTodayDate()}
                    required
                    style={{width:'150px', marginRight: '20px'}}
                    />
            </label>

            <label>
                End Date
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || getTodayDate()}
                    required
                    style={{width:'150px'}}
                    />
            </label>

            </div>
            <label htmlFor="reason">
                Reason
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    name="reason"
                    id="reason"
                    placeholder="Reason for leave (optional)"
                    style={{height:'120px'}}
                ></textarea>
            </label>

            <div className="form-action">
                <button type='submit' disabled={isSubmitDisabled}>
                    {loading ? 'Submitting...' : 'Apply'}
                </button>
                {leaveBalance <= 0 && <p style={{ color: 'red' }}>No leave balance available</p>}
            </div>
        </form>
    );
}

























// // importing libraries
// import React, { useState } from 'react'
// // importing leave service
// import { leaveService } from '../services/leaveService';


// // LeaveForm component to apply for leave
// export default function LeaveForm( { onSubmitted, username }){

//     //state variables like start date, end date and reason for the leave application
//     const [startDate,setStartDate ] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [reason, setReason] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();                                                                                    //prevent default form submission behavior
//         // dont let user submit the start date from past
//         const today = new Date();
//         const selectedStartDate = new Date(startDate);
//         if (selectedStartDate < today.setHours(0,0,0,0)) {
//             return alert('Start date cannot be in the past');
//         }
        
//         if(!startDate || !endDate) return alert("please choose start and end dates");                              //validate dates

//         if(new Date(endDate) < new Date(startDate)) return alert('End date cannot be before start date');          //validate date range
//         const days = leaveService.calculateDays(startDate,endDate);     

//         const form = {username, startDate, endDate, reason, days, status: 'pending', appliedAt: new Date().toISOString() };    //create form object
        
//         await leaveService.applyLeave(form);                                                                       //call leave service to apply for leave
//         alert('Leave applied');                                                                                     //notify user
//         setStartDate('');                                                                                          //reset form fields
//         setEndDate('');
//         setReason('');
//         onSubmitted && onSubmitted();                                                                              //call onSubmitted callback if provided
//     };

//   return (
//     <form className='form' onSubmit={handleSubmit}>

//         <label>
//             Start Date 
//             <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value)}} />
//         </label>

//         <label>
//             End Date 
//             <input type="date" value={endDate} onChange={(e)=>{setEndDate(e.target.value)}} />
//         </label>

//         <label htmlFor="">
//             Reason 
//             <textarea value={reason} onChange={(e)=>setReason(e.target.value)} name="reason" id="reason" placeholder="Reason for leave (optional)"></textarea>
//         </label>
//         <div className="form-action">
//             <button type='submit'>Apply</button>
//         </div>
//     </form>
//   )
// }
