import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

const useWebSocket = (url, onMessageReceived) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnected(true);
      toast.success("WebSocket connected!");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket error. Check the console.");
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed with code: ${event.code}`);
      setIsConnected(false);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [url]);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onMessageReceived) {
        onMessageReceived(data);
      }
    };
  }, [onMessageReceived]);

  const sendMessage = useCallback(
    (message) => {
      if (socketRef.current && isConnected) {
        socketRef.current.send(JSON.stringify(message));
      } else {
        toast.error("WebSocket is not connected!");
      }
    },
    [isConnected]
  );

  return { isConnected, sendMessage };
};

export default useWebSocket;
