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
import { Notification } from "@/types/interface";
import GlobalApi from "../_util/GlobalApi";

const TIMEZONE = "Asia/Bangkok";
const PAGE_LIMIT = 4;
type notificationSectionProp = {
  showNotifications: boolean;
  setShowNotifications: (data: boolean) => void;
};
const NotificationSection = ({
  showNotifications,
  setShowNotifications,
}: notificationSectionProp) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [slideOut, setSlideOut] = useState<string | null>(null);
  const { notificationCounts, setNotificationCount } = useStore();
  const { ProfileDetail, updateProfileDetail } = useStore();
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleRequest = async (
    requestId: string,
    status: string,
    userId: string
  ) => {
    try {
      const response = await GlobalApi.resolveRole(requestId, status, userId);
      const SendRes = response?.data;
      console.log(ProfileDetail);
      const { name, image } = ProfileDetail;

      socket.emit("roleRequestHandled", {
        userId,
        SendRes,
        AdminName: name,
        AdminImage: image,
      });

      setSlideOut(requestId);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((item) => item.id !== requestId)
        );
        setNotificationCount(notificationCounts - 1);
        setSlideOut(null);
      }, 300);
    } catch (error) {
      console.error("Error handling request:", error);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.wav");
    audio.play();
  };

  // function ที่ใช้ในการทำ scroll loading
  const loadMore = useCallback(() => {
    const skip = page * PAGE_LIMIT;
    // console.log("skip:" ,skip);
    // console.log("quantity:",quantity);
    if (skip >= notificationCounts) {
      setPage(0);
    }
    setPage((prevPage) => prevPage + 1);
  }, [notificationCounts]);

  // function ที่นำRoleRequest มาSet ไว้ที่ notificate และ จำนวนของ notificate
  const fetchRoleRequest = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roleRequestPending`, {
        params: { page, limit: PAGE_LIMIT },
        withCredentials: true,
      });
      console.log(response);

      setNotificationCount(response.data.count);
      setNotifications((prevNotifications) => {
        const existingIds = new Set(prevNotifications.map((item) => item.id));
        const newNotifications = response.data.data.filter(
          (item: { id: string }) => !existingIds.has(item.id)
        );
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
        console.log("receive", receive);

        playNotificationSound();
        const newCount = notificationCounts + 1;
        setNotificationCount(newCount);
        setNotifications((prev) => [receive.data.data, ...prev]);

        const { user, role, createdAt } = receive.data.data;
        console.log("receive", receive.data.data);

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
                <span className="text-sm">{user.name}</span>
                <h1 className="text-sm">
                  has requested the role{" "}
                  <span className="font-semibold text-blue-500">
                    {role.role_name}
                  </span>
                </h1>
                <h1 className="text-sm text-gray-500">
                  {moment
                    .utc(createdAt)
                    .tz(TIMEZONE)
                    .format("YYYY-MM-DD HH:mm:ss")}
                </h1>
              </div>
            </div>
          </div>
        );
      });

      return () => {
        socket.off("adminNotification");
      };
    } else {
      socket.on("userNotification", (receive) => {
        if (receive.userId === ProfileDetail.id) {
          playNotificationSound();
          setNotificationCount(notificationCounts + 1);
          console.log("receive....", receive);
          const SenderImage = receive.AdminImage;
          const SenderName = receive.AdminName;
          const SenderStatus = receive.SendRes.status;
          const updateAt = receive.updatedAt;
          const {
            id,
            role_name,
            description,
            role_level,
            permissionsAsAssessor,
          } = receive.SendRes.role;

          const dataSender = {
            id: receive.SendRes.id,
            user: {
              image: { url: SenderImage },
              name: SenderName,
            },
            role: {
              requestRole: SenderStatus,
              role_name: role_name,
            },
            createdAt: updateAt,
          };
          setNotifications((prev) => [dataSender, ...prev]);
          SenderStatus === "APPROVED"
            ? updateProfileDetail({
                role: {
                  id,
                  role_name,
                  description,
                  role_level,
                  permissionsAsAssessor,
                }, // ส่ง role เข้าไปอัพเดทUser คนนั้น
                roleRequests: [],
              })
            : updateProfileDetail({
                roleRequests: [],
              });
          toast(
            <div className="w-full">
              <div className="flex gap-3 justify-start items-start">
                <Image
                  src={SenderImage ? SenderImage : "/profiletest.jpg"}
                  width={100}
                  height={100}
                  alt="Notification"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <div className="text-lg">
                  <span className="text-sm">{SenderName}</span>
                  <h1 className="text-sm">
                    Action your request to{" "}
                    <span className="font-semibold text-blue-500">
                      {SenderStatus}
                    </span>
                  </h1>
                  <h1 className="text-sm text-gray-500">
                    {moment
                      .utc(updateAt)
                      .tz(TIMEZONE)
                      .format("YYYY-MM-DD HH:mm:ss")}
                  </h1>
                </div>
              </div>
            </div>
          );
        }
      });
      // console.log(ProfileDetail);
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
          // console.log(entry.isIntersecting);

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
    <div className="relative p-5">
      <h1 className="text-xl font-bold text-stone-700 mb-3">Notifications</h1>
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
                    src={
                      item.user.image ? item.user.image.url : "/profiletest.jpg"
                    }
                    width={100}
                    height={100}
                    alt="Notification"
                    className="w-[50px] h-[50px] object-cover rounded-full"
                  />
                  {/* notification-box user & admin */}
                  <div>
                    <h1 className="text-sm">{item.user.email}</h1>
                    <h1 className="text-md ">
                      {ProfileDetail.role?.role_name === "admin" ? (
                        <>
                          <span className="">{item.user.name}</span>{" "}
                          <span className="font-bold">Request Role </span>
                          <span className="text-blue-500">{item.role.role_name}</span>
                          
                        </>
                      ) : (
                        <>
                          <span className="bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-800 inline-block text-transparent">
                            Admin
                          </span>{" "}
                          {item.user.name}{" "}
                          <span className="font-medium">
                            {" "}
                            active Role {item.role.role_name}{" "}
                          </span>
                          <span
                            className={`${
                              item.role.requestRole === "APPROVED"
                                ? "text-blue-500"
                                : "text-red-500"
                            }`}
                          >
                            {" "}
                            to {item.role.requestRole}
                          </span>
                        </>
                      )}
                    </h1>
                    <h1 className="text-sm text-gray-600">
                      {moment
                        .utc(item.createdAt)
                        .tz(TIMEZONE)
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </h1>
                    {/* เงื่อนไขเพื่อบอกว่าถ้าหากไม่ใช้ admin จะไม่เห็น ปุ่มในการ approve */}
                    {ProfileDetail.role?.role_name === "admin" ? (
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() =>
                            handleRequest(
                              item.id,
                              "APPROVED",
                              item.user.id ? item.user.id : ""
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() =>
                            handleRequest(
                              item.id,
                              "REJECTED",
                              item.user.id ? item.user.id : ""
                            )
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-3">
            <h1 className="text-sm text-center text-gray-500 my-20">
              No notifications
            </h1>
          </div>
        )}
        <div ref={loaderRef} className="h-2 w-full bg-transparent"></div>
      </div>
    </div>
  );
};

export default NotificationSection;
