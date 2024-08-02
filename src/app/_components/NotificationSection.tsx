import React, { useEffect, useState } from 'react'
import socket from '@/lib/socket';
import { apiUrl } from '../data/data-option';
import axios from 'axios';
const NotificationSection = () => {
    const [notification , setNotification] = useState([]);


    const handleRequest = async (requestId: any,status: any) =>{
        await axios.patch(`${apiUrl}/handleRoleRequest`,{requestId,status})
    }
    useEffect(()=>{
        socket.on('adminNotification',(data)=>{
            setNotification((prev) : any =>[...prev,data]);
        });

        return () =>{
            socket.off('adminNotification');
        }
    },[]);
  return (
    <div>NotificationSection</div>
  )
}

export default NotificationSection