// useSocket.ts — Frontend Socket.io hook
// Connects to the backend Socket.io server with the current user's ID.
// Returns the socket instance for use in components.

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "@hooks/useAuth";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gloxard-backend.onrender.com";

let socketInstance: Socket | null = null;

export const getSocket = (): Socket | null => socketInstance;

export const useSocket = () => {
  const { authenticatedUser } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!authenticatedUser?._id) return;

    // Reuse existing connection if same user
    if (socketInstance && socketInstance.connected) {
      socketRef.current = socketInstance;
      return;
    }

    const socket = io(SOCKET_URL, {
      // The server authenticates the handshake with the JWT and joins room user:<userId>
      auth: { token: localStorage.getItem("token") },
      query: { userId: authenticatedUser._id },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("[Socket.io] Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("[Socket.io] Disconnected");
    });

    socketInstance = socket;
    socketRef.current = socket;

    return () => {
      // Don't disconnect on component unmount — keep alive for the session
      // Only disconnect on logout (handled separately)
    };
  }, [authenticatedUser?._id]);

  return socketRef.current;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
