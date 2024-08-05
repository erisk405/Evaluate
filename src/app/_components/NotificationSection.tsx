import React, { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { apiUrl } from "../data/data-option";
import axios from "axios";
import { Bell } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useStore from "../store/store";
import { toast } from "sonner";

const NotificationSection = () => {
  const [notifications, setNotification]: any = useState([]);
  const [showNotificate, setShowNotificate] = useState(true);
  const [slideOut, setSlideOut] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const { ProfileDetail } = useStore();

  const handleRequest = async (requestId: any, status: any) => {
    console.log(requestId, status);

    await axios.patch(`${apiUrl}/adminSendRole`, { requestId, status });
    socket.emit("roleRequestHandled", { requestId, status });

    setSlideOut(requestId);

    setTimeout(() => {
      setNotification((prev: any) =>
        prev.filter((item: any) => item.id !== requestId)
      );
      console.log(notifications);
      setQuantity((prev: number) => prev - 1);
      setSlideOut(null);
    }, 300);
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.wav'); 
    audio.play();
  };

  const fetchRoleRequest = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roleRequestPending`, {
        withCredentials: true,
      });
      setQuantity(response.data.count);
      setNotification(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (ProfileDetail.role?.role_name === "admin") {
      fetchRoleRequest();
      socket.on("adminNotification", (receive) => {
        setQuantity(receive.data.count + 1);
        setNotification((prev: any): any => [...prev, receive.data.data]);
        const name = receive.data.data.user.name;
        const requestRole = receive.data.data.role.role_name;
        const dateTime = receive.data.data.createdAt;
        const image = receive.data.data.user.image;
        toast(
          <div className="w-full">
            <div className="flex gap-3 justify-start items-start">
              <Image
                src={image ? image.url : "/profiletest.jpg"}
                width={100}
                height={100}
                alt="NotificateImageSonner"
                className="w-[40px] h-[40px] object-cover rounded-full"
              />

              <div className="text-lg">
                <span className="font-bold">{name}</span>
                <h1 className="text-md">
                  {" "}
                  has request role{" "}
                  <span className="font-semibold text-blue-500">
                    {requestRole}
                  </span>
                </h1>
                <h1 className="text-sm text-gray-500">{dateTime}</h1>
              </div>
            </div>
          </div>
        );
        playNotificationSound();
      });
      return () => {
        socket.off("adminNotification");
      };
    }
  }, [ProfileDetail]);

  return (
    <div className={`relative `}>
      <div
        className={`relative hover:bg-neutral-200 ${
          showNotificate ? "bg-neutral-100 " : "bg-blue-100"
        } p-2 rounded-full`}
      >
        <Bell
          onClick={() => setShowNotificate(!showNotificate)}
          className={`${showNotificate ? "" : "text-blue-500"}`}
        />
        {quantity > 0 ? (
          <div
            className="absolute min-w-[20px] max-w-[40px] h-[20px] bg-blue-500 top-0 right-0
              flex justify-center items-center rounded-full text-white text-sm translate-x-1/3 -translate-y-1/3
          "
          >
            <span>{quantity}</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div
        className={`fixed lg:absolute ${
          showNotificate ? "opacity-0 scale-95" : "opacity-1 scale-100"
        } lg:w-[400px] lg:-inset-x-96 lg:translate-y-0 lg:top-full 
        sm:mx-28 inset-0 top-1/2 -translate-y-1/2 z-[50]
        rounded-2xl p-1 transition-all ease-in-out `}
      >
        <div className={`px-5 py-4 shadow-lg bg-white rounded-2xl `}>
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
                          <Button
                            onClick={() => handleRequest(items.id, "APPROVED")}
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRequest(items.id, "REJECTED")}
                          >
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
