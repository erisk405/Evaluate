"use client";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { CircleUserRound, Fingerprint } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
const option = [
  {
    id: "ED1",
    label: "Edit profile",
    pathName: "general-data",
    icon: <CircleUserRound strokeWidth={1.25} />,
  },
  {
    id: "SC1",
    label: "Security",
    pathName: "security",
    icon: <Fingerprint strokeWidth={1.25} />,
  },
];
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const { theme } = useTheme();
  const { updateProfileDetail } = useStore();
  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await GlobalApi.fetchUserProfile();
      const { id, name, image, email, prefix, role, roleRequests, department } =
        response.data;
      console.log("responseNev-User", response.data);

      updateProfileDetail({
        id,
        prefix,
        name,
        email,
        image: image ? image.url : "/profiletest.jpg",
        role,
        roleRequests,
        department: department || null,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    // Fetch user data on component mount
    fetchUser();
  }, []);
  return (
    <div className={`flex w-full ${theme === "light" ? 'bg-white' :'bg-background_secondary'} overflow-hidden h-screen`}>
      <div className={`min-w-[250px] w-[400px] p-4 border-r ${theme === "light" ? 'bg-white' :'bg-black text-zinc-50'}`}>
        <h2 className="text-xl  font-bold mb-4">Account</h2>
        <p className="text-sm my-3">How you use options</p>
        {option.map((item, index) => (
          <Link
            href={`/account/${item.pathName}`}
            className={`flex items-center gap-3 p-3 mb-2 rounded-lg 
            ${pathSegments.includes(item.pathName) && theme === "light" && 'bg-zinc-900 text-zinc-50'} 
            ${pathSegments.includes(item.pathName) && theme === "dark" && 'bg-zinc-800 text-zinc-50'} 
            ${theme === "light" ? 'hover:bg-zinc-800 hover:text-zinc-50 ' :'hover:bg-zinc-700'}`}
            key={item.id}
          >
            <span>{item.icon}</span>
            <div className="text-sm">{item.label}</div>
          </Link>
        ))}
      </div>
      <div className="p-4 w-full">{children}</div>
    </div>
  );
};

export default layout;
