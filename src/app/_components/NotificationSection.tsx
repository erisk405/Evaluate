import React, { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { apiUrl } from "../data/data-option";
import axios from "axios";
import { Bell } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotificationSection = () => {
  const [notifications, setNotification]: any = useState([]);
  const [showNotificate, setShowNptificate] = useState(false);

  const handleRequest = async (requestId: any, status: any) => {
    console.log(requestId, status);

    await axios.patch(`${apiUrl}/adminSendRole`, { requestId, status });
    socket.emit("roleRequestHandled", { requestId, status });
    fetchRoleRequest();
  };
  const fetchRoleRequest = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roleRequestPending`, {
        withCredentials: true,
      });
      console.log(response.data);
      setNotification(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchRoleRequest();
    socket.on("adminNotification", (data) => {
      console.log(data);
      setNotification((prev: any): any => [...prev, data.data]);
    });
    console.log(notifications);

    return () => {
      socket.off("adminNotification");
    };
  }, []);
  return (
    <div className="relative bg-neutral-100 p-2 rounded-full hover:bg-neutral-200">
      <Bell onClick={() => setShowNptificate(!showNotificate)} />
      <div
        className={`
      absolute ${showNotificate ? "opacity-0 scale-95" : "opacity-1 scale-100"} 
      bg-white shadow-lg p-2 rounded-lg top-full px-5
      -right-full w-[400px] h-[800px] transition-all ease-in-out`}
      >
        <h1 className="text-lg font-bold mb-3">Notifications</h1>
        {notifications &&
          notifications.map((items:any) => (
            <div>
              <div className="flex flex-col gap-3 ">
                <div className="flex items-start gap-3">
                  <Image
                    src={items.image? items.image.url : '/profiletest.jpg'}
                    width={100}
                    height={100}
                    alt="NotificateImage"
                    className="w-[50px] h-[50px] object-cover rounded-full"
                  />
                  <div className="">
                    <h1 className="text-sm">{items.user.email}</h1>
                    <h1 className="text-md font-bold">
                      {items.user.name} Request Role {items.role.role_name}
                    </h1>
                    <h1 className="text-sm text-gray-600">{items.createdAt}</h1>
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() =>
           handleRequest(items.id, "APPROVED")
         }>Appove</Button>
                      <Button onClick={() =>
           handleRequest(items.id, "REJECTED")
         }>Reject</Button>
                    </div>
                  </div>
                </div>
              </div>
              <ul>
                {/* {notifications.map((notification: any) => (
     <li key={notification.id}>
       User {notification.userId} requested role {notification.roleId}
       <button
         onClick={() =>
           handleRequest(notification.requestId, "APPROVED")
         }
       >
         Approve
       </button>
       <button
         onClick={() =>
           handleRequest(notification.requestId, "REJECTED")
         }
       >
         Reject
       </button>
     </li>
   ))} */}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationSection;
