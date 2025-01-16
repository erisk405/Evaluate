
import { io } from 'socket.io-client';
// แก้ไขการสร้าง socket client ให้เป็นแบบนี้
const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_SOCKET_API_URL : "http://localhost:8000"
const socket = io(`${apiUrl}`, {
    transports: ["websocket", "polling"], // เพิ่ม polling เป็น fallback
    reconnection: true, // เพิ่มการ reconnect อัตโนมัติ
});

// เพิ่ม error handling
socket.on("connect_error", (error) => {
    console.error("Connection Error:", error);
});

socket.on("connect", () => {
    console.log("Connected to server!");
});


export default socket