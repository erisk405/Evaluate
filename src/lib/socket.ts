
import { apiUrl } from '@/app/_util/GlobalApi';
import { io } from 'socket.io-client';
const socket = io(`${apiUrl}`, {
    transports: ["websocket"],
    withCredentials: true,
    // auth: {
    //     token: localStorage.getItem("token"), // ดึง token จาก localStorage
    // },
});

export default socket