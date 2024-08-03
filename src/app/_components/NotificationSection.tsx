import React, { useEffect, useState } from 'react'
import socket from '@/lib/socket';
import { apiUrl } from '../data/data-option';
import axios from 'axios';
const NotificationSection = () => {
    const [notifications , setNotification] :any = useState([]);


    const handleRequest = async (requestId: any,status: any) =>{
        console.log(requestId,status );
        
        await axios.patch(`${apiUrl}/adminSendRole`,{requestId,status});
        socket.emit('roleRequestHandled', { requestId, status });
    };
    useEffect(()=>{
        socket.on('adminNotification',(data)=>{
            console.log(data);
            setNotification((prev :any) : any =>[...prev,data]);
        });

        return () =>{
            socket.off('adminNotification');
        }
    },[]);
  return (
    <div>
      <h1>Admin Notifications</h1>
      <ul>
        {notifications.map((notification :any) => (
          <li key={notification.id}>
            User {notification.userId} requested role {notification.roleId }
            <button onClick={() => handleRequest(notification.requestId, 'APPROVED')}>Approve</button>
            <button onClick={() => handleRequest(notification.requestId, 'REJECTED')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationSection