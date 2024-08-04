import React, { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { apiUrl } from "../data/data-option";
import axios from "axios";
import { Bell } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotificationSection = () => {
  const [notifications, setNotification]: any = useState([]);
  const [showNotificate, setShowNotificate] = useState(true);
  const [slideOut, setSlideOut] = useState<string | null>(null);

  const handleRequest = async (requestId: any, status: any) => {
    console.log(requestId, status);

    await axios.patch(`${apiUrl}/adminSendRole`, { requestId, status });
    socket.emit("roleRequestHandled", { requestId, status });

    setSlideOut(requestId);

    setTimeout(() => {
      setNotification((prev: any) => prev.filter((item: any) => item.id !== requestId));
      console.log(notifications);
      
      setSlideOut(null);
    }, 300); 
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
      setNotification((prev: any): any => [...prev, data.data]);
    });
    return () => {
      socket.off("adminNotification");
    };
  }, []);

  return (
    <div className="relative bg-neutral-100 p-2 rounded-full hover:bg-neutral-200">
      <Bell onClick={() => setShowNotificate(!showNotificate)} />
      <div
        className={`fixed lg:absolute ${
          showNotificate ? "opacity-0 scale-95" : "opacity-1 scale-100"
        } lg:w-[400px] lg:-inset-x-96 lg:translate-y-0 lg:top-full 
        sm:mx-28 inset-0 top-1/2 -translate-y-1/2 
        rounded-2xl p-1 transition-all ease-in-out z-50`}
      >
        <div className="px-5 py-4 shadow-lg bg-white rounded-2xl">
          <h1 className="text-2xl font-bold mb-3">Notifications</h1>
          <hr />
          <div className="scrollbar-gemini overflow-y-scroll overflow-x-hidden max-h-[500px]">
            {notifications.length > 0 ? (
              notifications.map((items: any) => (
                <div
                  className={`mt-3 transition-all duration-300 ${
                    slideOut === items.id ? "translate-x-full opacity-0" : ""
                  }`}
                  key={items.id}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <Image
                        src={
                          items?.user?.image
                            ? items?.user?.image.url
                            : "/profiletest.jpg"
                        }
                        width={100}
                        height={100}
                        alt="NotificateImage"
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                      <div>
                        <h1 className="text-sm">{items.user.email}</h1>
                        <h1 className="text-md font-bold">
                          {items.user.name} Request Role {items.role.role_name}
                        </h1>
                        <h1 className="text-sm text-gray-600">
                          {items.createdAt}
                        </h1>
                        <div className="flex gap-2 mt-2">
                          <Button onClick={() => handleRequest(items.id, "APPROVED")}>
                            Approve
                          </Button>
                          <Button onClick={() => handleRequest(items.id, "REJECTED")}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-3">
                <h1 className="text-xl text-center text-gray-500">
                  No notifications
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        onClick={() => setShowNotificate(!showNotificate)}
        className={`${
          showNotificate ? "hidden" : "fixed"
        } bg-black lg:bg-transparent opacity-70 inset-0`}
      ></div>
    </div>
  );
};

export default NotificationSection;
