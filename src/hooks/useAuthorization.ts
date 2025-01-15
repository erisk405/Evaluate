import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const useAuthorization = () => {
    const router = useRouter();
    const pathname = usePathname(); // ใช้ usePathname hook เพื่อรับ current path
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/sign-in");
                return;
            }
            console.log("token",token);
            

            try {
                // ส่ง token และ current path ไปยัง server
                const response = await fetch("/api/auth/check", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        currentPath: pathname
                    })
                });

                if (!response.ok) {
                    throw new Error("Authorization failed");
                }

                const data = await response.json();
                
                // ถ้า server ส่ง redirect URL กลับมา ให้ redirect ไปยัง URL นั้น
                if (data.redirect) {
                    router.push(data.redirect);
                }
            } catch (error) {
                console.error("Authorization error:", error);
                router.push("/sign-in");
            } finally {
                setLoading(false);
            }
        };

        checkAuthorization();
    }, [router, pathname]); // เพิ่ม pathname เข้าไปใน dependencies

    return loading;
};

export default useAuthorization;