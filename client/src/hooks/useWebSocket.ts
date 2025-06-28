// hooks/useWebSocket.ts
import { useEffect, useRef } from "react";

const WS_URL = "ws://localhost:8080"; // ✅ Change this to your actual backend WebSocket URL

const useWebSocket = (userId: string, onMessage: (message: string) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("✅ Connected to WS from test");
      ws.send(JSON.stringify({ type: "register", userId }));
    };
    ws.onmessage = (e) => {
      console.log("Message:", e.data);
    };
    ws.onerror = (err) => console.error("WS error:", err);
    ws.onclose = () => console.log("WS closed");

    return () => ws.close();
  }, []);
};

export default useWebSocket;
