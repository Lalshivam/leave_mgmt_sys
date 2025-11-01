// import required modules
import React, { useEffect, useState } from 'react'
import { leaveService } from '../services/leaveService';


// LeaveHistory component definition
export default function LeaveHistory({ username, onAction, currentUser = {} }) {
    // State variable to hold leave application rows
    const [rows, setRows] = useState([]);
    const isAdmin = currentUser?.role === 'admin';      // Determine if the current user is an admin


    // Fetch leave applications
    useEffect(()=>{
        let mounted = true;                 //to prevent state updates on unmounted component

        //async function to fetch leave applications
        const fetchList = async () => {        
            try {                           
                const list = await (isAdmin ? leaveService.getAllLeaves() : leaveService.getLeavesByUser(username));
                if (mounted) setRows(list ?? []);
            } catch (err) {
                console.error('Failed to fetch leave history', err);
                if (mounted) setRows([]);
            }
        };
        fetchList();
        return () => { mounted = false; };
    },[username, isAdmin]);


    // Handle approve/reject actions
    const handleAction = async(id, approve) => {
        try {
            await onAction(id, approve);                      //invoke parent handler to perform action on leave application with given id for approve/reject
        } catch (err) {
            console.error('Action failed', err);
        }
        // re-fetch after action
        try {
            const list = await (isAdmin ? leaveService.getAllLeaves() : leaveService.getLeavesByUser(username));   //fetch updated list
            setRows(list ?? []);                                                                                   //update state
        } catch (err) {
            console.error('Failed to refresh list after action', err);
            setRows([]);
        }
    }

  return (
    <div className='table-wrap'>
        <table className='table'>
            <thead>
                <tr>
                    <th>User</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied At</th>
                    {isAdmin && <th>Action</th>}
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 && (
                    <tr>
                        <td colSpan={isAdmin ? 8 : 7}>No leave applications found</td>
                    </tr>
                )}

                {/* 
                        render each leave application row
                 */}
                {rows.map((r)=>(
                    <tr key={r.id}>
                        <td>{r.username}</td>
                        <td>{r.startDate}</td>
                        <td>{r.endDate}</td>
                        <td>{r.days}</td>
                        <td>{r.reason}</td>
                        <td className={`status ${r.status}`}>{r.status}</td>
                        <td>{r.appliedAt ? new Date(r.appliedAt).toLocaleString() : '-'}</td>

                        {/* 
                              this column is for admin actions for leave applications 
                        */}
                        {isAdmin && (
                            <td>
                                {r.status === 'pending' ? (
                                    <>
                                        <button onClick={() => handleAction(r.id,true)}>Approve</button>
                                        <button onClick={() => handleAction(r.id,false)}>Reject</button>
                                    </>
                                ) : (
                                    <span className='muted'>---</span>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}
