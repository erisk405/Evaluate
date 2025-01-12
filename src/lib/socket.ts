import { apiUrl } from '@/app/data/data-option';
import { io } from 'socket.io-client';
const socket = io(apiUrl);

export default socket