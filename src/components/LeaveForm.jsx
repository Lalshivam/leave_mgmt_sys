// importing libraries
import React, { useState } from 'react'
// importing leave service
import { leaveService } from '../services/leaveService';


// LeaveForm component to apply for leave
export default function LeaveForm( { onSubmitted, username }){

    //state variables like start date, end date and reason for the leave application
    const [startDate,setStartDate ] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();                                                                                    //prevent default form submission behavior
        if(!startDate || !endDate) return alert("please choose start and end dates");                              //validate dates
        if(new Date(endDate) < new Date(startDate)) return alert('End date cannot be before start date');          //validate date range
        const days = leaveService.calculateDays(startDate,endDate);                                                //calculate number of days
        const form = {username, startDate, endDate, reason, days, status: 'pending', appliedAt: new Date().toISOString() };    //create form object
        await leaveService.applyLeave(form);                                                                       //call leave service to apply for leave
        alert('Leave applied');                                                                                     //notify user
        setStartDate('');                                                                                          //reset form fields
        setEndDate('');
        setReason('');
        onSubmitted && onSubmitted();                                                                              //call onSubmitted callback if provided
    };

  return (
    <form className='form' onSubmit={handleSubmit}>

        <label>
            Start Date 
            <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value)}} />
        </label>

        <label>
            End Date 
            <input type="date" value={endDate} onChange={(e)=>{setEndDate(e.target.value)}} />
        </label>

        <label htmlFor="">
            Reason 
            <textarea value={reason} onChange={(e)=>setReason(e.target.value)} name="reason" id="reason" placeholder="Reason for leave (optional)"></textarea>
        </label>
        <div className="form-action">
            <button type='submit'>Apply</button>
        </div>
    </form>
  )
}
