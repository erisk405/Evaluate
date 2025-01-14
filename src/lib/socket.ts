
import { apiUrl } from '@/app/_util/GlobalApi';
import { io } from 'socket.io-client';
const socket = io(`${apiUrl}`);

export default socket