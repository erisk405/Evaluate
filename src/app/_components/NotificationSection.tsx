import React, { useCallback, useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { apiUrl } from "../data/data-option";
import axios from "axios";
import { Bell } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useStore from "../store/store";
import { toast } from "sonner";
import moment from "moment-timezone";
import { Notification, Role } from "@/types/interface";

const TIMEZONE = 'Asia/Bangkok';
const PAGE_LIMIT = 4;


const NotificationSection: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const [slideOut, setSlideOut] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const { ProfileDetail,updateProfileDetail } = useStore();
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleRequest = async (requestId: string, status: string, userId: string) => {
    try {
      const response = await axios.patch(`${apiUrl}/resolveRole`, { requestId, status, userId });
      const SendRes = response.data;
      console.log(ProfileDetail);
      const {name ,image} = ProfileDetail;
      
      socket.emit("roleRequestHandled", {userId,SendRes,AdminName:name,AdminImage:image});

      setSlideOut(requestId);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== requestId));
        setQuantity((prev) => prev - 1);
        setSlideOut(null);

      }, 300);
    } catch (error) {
      console.error("Error handling request:", error);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.wav');
    audio.play();
  };

  const loadMore = useCallback(() => {
    const skip = page * PAGE_LIMIT;
    // console.log("skip:" ,skip);
    // console.log("quantity:",quantity);
    if(skip >= quantity){
      setPage(0);
    }
    setPage((prevPage) => prevPage + 1);
  }, [quantity]);

  const fetchRoleRequest = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roleRequestPending`, {
        params: { page, limit: PAGE_LIMIT },
        withCredentials: true,
      });
      console.log(response);
      
      setQuantity(response.data.count);
      setNotifications((prevNotifications) => {
        const existingIds = new Set(prevNotifications.map((item) => item.id));
        const newNotifications = response.data.data.filter((item: { id: string }) => !existingIds.has(item.id));
        return [...prevNotifications, ...newNotifications];
      });
    } catch (error) {
      console.error("Error fetching role requests:", error);
    }
  };

  useEffect(() => {
    if (ProfileDetail.role?.role_name === "admin") {
      fetchRoleRequest();
      socket.on("adminNotification", (receive) => {
        playNotificationSound();
        setQuantity((prev) => prev + 1);
        setNotifications((prev) => [...prev, receive.data.data]);
        
        const { user, role, createdAt } = receive.data.data;
        console.log("receive",receive.data.data);
        
        toast(
          <div className="w-full">
            <div className="flex gap-3 justify-start items-start">
              <Image
                src={user.image ? user.image.url : "/profiletest.jpg"}
                width={100}
                height={100}
                alt="Notification"
                className="w-[40px] h-[40px] object-cover rounded-full"
              />
              <div className="text-lg">
                <span className="font-bold">{user.name}</span>
                <h1 className="text-md">
                  has requested the role{" "}
                  <span className="font-semibold text-blue-500">{role.role_name}</span>
                </h1>
                <h1 className="text-sm text-gray-500">
                  {moment.utc(createdAt).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}
                </h1>
              </div>
            </div>
          </div>
        );
      });

      return () => {
        socket.off("adminNotification");
      };
    }
    else{
      socket.on("userNotification", (receive) => {
        if(receive.userId === ProfileDetail.id){
          playNotificationSound();
          console.log("receive....",receive);
          const SenderImage = receive.AdminImage
          const SenderName = receive.AdminName
          const SenderStatus = receive.SendRes.status
          const updateAt = receive.updatedAt
          const {id,role_name,description}= receive.SendRes.role
          console.log(SenderStatus);
          const role = ProfileDetail?.role; // role ดั้งเดิมของ user คนนั้น
          
          SenderStatus === 'APPROVED' ? (
            updateProfileDetail({
              role:{
                id,
                role_name,
                description
              }, // ส่ง role เข้าไปอัพเดทUser คนนั้น
              roleRequests:[]
            })
          ):
          (
            updateProfileDetail({
              roleRequests:[]
            })
          )
          toast(
            <div className="w-full">
              <div className="flex gap-3 justify-start items-start">
                <Image
                  src={SenderImage? SenderImage : "/profiletest.jpg"}
                  width={100}
                  height={100}
                  alt="Notification"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <div className="text-lg">
                  <span className="font-bold">{SenderName}</span>
                  <h1 className="text-md">
                    Action your request to {" "}
                    <span className="font-semibold text-blue-500">{SenderStatus}</span>
                  </h1>
                  <h1 className="text-sm text-gray-500">
                    {moment.utc(updateAt).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}
                  </h1>
                </div>
              </div>
            </div>
          );
          
        }
      });
      console.log(ProfileDetail);
      return () => {
        socket.off("userNotification");
      };
    }
  }, [ProfileDetail]);

  useEffect(() => {
    if (ProfileDetail.role?.role_name === "admin") {
      fetchRoleRequest();
    }

  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log(entry.isIntersecting);
          
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef, loadMore]);

  return (
    <div className="relative">
      <div
        className={`relative hover:bg-neutral-200 ${
          showNotifications ? "bg-neutral-100" : "bg-blue-100"
        } p-2 rounded-full`}
      >
        <Bell
          onClick={() => setShowNotifications(!showNotifications)}
          className={showNotifications ? "" : "text-blue-500"}
        />
        {quantity > 0 && (
          <div
            className="absolute min-w-[20px] max-w-[40px] h-[20px] bg-blue-500 top-0 right-0
              flex justify-center items-center rounded-full text-white text-sm translate-x-1/3 -translate-y-1/3"
          >
            <span>{quantity}</span>
          </div>
        )}
      </div>
      <div
        className={`fixed lg:absolute h-auto block 
        ${showNotifications ? "opacity-0 scale-95" : "opacity-1 scale-100"} 
        lg:w-[400px] lg:-inset-x-96 lg:translate-y-0 lg:top-full 
        w-full left-0 top-1/2 -translate-y-1/2 z-[50]
        rounded-2xl p-1 transition-all `}
      >
        <div className="px-5 py-4 shadow-lg bg-white rounded-2xl lg:w-full lg:mx-10 sm:mx-28 transition-all">
          <h1 className="text-2xl font-bold mb-3">Notifications</h1>
          <hr />
          <div className="scrollbar-gemini overflow-y-scroll overflow-x-hidden max-h-[500px]">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  className={`mt-3 transition-all duration-300 ${
                    slideOut === item.id ? "translate-x-full opacity-0" : ""
                  }`}
                  key={item.id}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <Image
                        src={item.user.image ? item.user.image.url : "/profiletest.jpg"}
                        width={100}
                        height={100}
                        alt="Notification"
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                      <div>
                        <h1 className="text-sm">{item.user.email}</h1>
                        <h1 className="text-md font-bold">
                          {item.user.name} Request Role {item.role.role_name}
                        </h1>
                        <h1 className="text-sm text-gray-600">
                          {moment.utc(item.createdAt).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}
                        </h1>
                        <div className="flex gap-2 mt-2">
                          <Button onClick={() => handleRequest(item.id, "APPROVED", item.user.id)}>
                            Approve
                          </Button>
                          <Button onClick={() => handleRequest(item.id, "REJECTED", item.user.id)}>
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
                <h1 className="text-xl text-center text-gray-500">No notifications</h1>
              </div>
            )}
            <div ref={loaderRef} className="h-2 w-full bg-transparent"></div>
          </div>
        </div>
      </div>
      <div
        onClick={() => setShowNotifications(!showNotifications)}
        className={`${
          showNotifications ? "hidden" : "fixed"
        } bg-black lg:bg-transparent opacity-70 inset-0`}
      ></div>
    </div>
  );
};

export default NotificationSection;
