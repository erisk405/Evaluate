"use client";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";
import { CircleUserRound, Fingerprint } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
type ImageType = {
  url: string;
  alt?: string;
};
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

  const styles = useThemeStyles();
  const { getThemeClass } = useThemeClass();
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
        image,
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
    <div
      className={`flex w-full ${styles.background_secondary} overflow-hidden h-screen`}
    >
      <div
        className={`min-w-[250px] w-[400px] p-4 border-r ${styles.background} ${styles.text}`}
      >
        <h2 className="text-xl  font-bold mb-4">Account</h2>
        <p className="text-sm my-3">How you use options</p>
        {option.map((item, index) => (
          <Link
            href={`/account/${item.pathName}`}
            className={getThemeClass(
              {
                light: `hover:bg-zinc-800 hover:text-zinc-50 ${
                  pathSegments.includes(item.pathName) &&
                  "bg-zinc-900 text-zinc-50"
                } `,
                dark: `hover:bg-zinc-700 ${
                  pathSegments.includes(item.pathName) &&
                  "bg-zinc-800 text-zinc-50"
                } `,
              },
              `flex items-center gap-3 p-3 mb-2 rounded-lg`
            )}
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
