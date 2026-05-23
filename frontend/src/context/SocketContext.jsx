import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import { SOCKET_URL, TOKEN_KEY } from '../config/constants.js';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setConnected(false);
      setOnlineUsers(new Set());
      return;
    }

    const sock = io(SOCKET_URL, {
      auth: { token: localStorage.getItem(TOKEN_KEY) },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = sock;
    setSocket(sock);

    sock.on('connect', () => setConnected(true));
    sock.on('disconnect', () => setConnected(false));

    sock.on('online_users', ({ userIds }) => {
      setOnlineUsers(new Set(userIds || []));
    });

    sock.on('user_online', ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, String(userId)]));
    });

    sock.on('user_offline', ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(String(userId));
        return next;
      });
    });

    return () => {
      sock.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [isAuthenticated, token]);

  const joinChat = useCallback(
    (otherUserId) => {
      socketRef.current?.emit('join_chat', { otherUserId });
    },
    []
  );

  const leaveChat = useCallback((otherUserId) => {
    socketRef.current?.emit('leave_chat', { otherUserId });
  }, []);

  const sendMessage = useCallback((receiverId, content) => {
    return new Promise((resolve, reject) => {
      socketRef.current?.emit(
        'send_message',
        { receiverId, content },
        (response) => {
          if (response?.success) resolve(response.message);
          else reject(new Error(response?.message || 'Failed to send'));
        }
      );
    });
  }, []);

  const emitTyping = useCallback((receiverId) => {
    socketRef.current?.emit('typing', { receiverId });
  }, []);

  const emitStopTyping = useCallback((receiverId) => {
    socketRef.current?.emit('stop_typing', { receiverId });
  }, []);

  const markMessagesRead = useCallback((otherUserId, messageIds) => {
    return new Promise((resolve) => {
      socketRef.current?.emit(
        'message_read',
        { otherUserId, messageIds },
        (res) => resolve(res)
      );
    });
  }, []);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      connected,
      onlineUsers,
      isUserOnline: (id) => onlineUsers.has(String(id)),
      joinChat,
      leaveChat,
      sendMessage,
      emitTyping,
      emitStopTyping,
      markMessagesRead,
    }),
    [
      connected,
      onlineUsers,
      joinChat,
      leaveChat,
      sendMessage,
      emitTyping,
      emitStopTyping,
      markMessagesRead,
      socket,
    ]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket requires SocketProvider');
  return ctx;
};
