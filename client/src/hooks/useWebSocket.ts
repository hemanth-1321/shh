import { WS_URL } from "@/config/Api";
import { useEffect } from "react";

const useWebSocket = (userId: string, onMessage: (message: string) => void) => {
  console.log("userId", userId);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("✅ Connected to WS from test");
      ws.send(JSON.stringify({ type: "register", userId }));
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "new_message") {
        onMessage(JSON.stringify(data.message));
      }
    };

    ws.onerror = (err) => console.error("WS error:", err);
    ws.onclose = () => console.log("WS close");

    return () => ws.close();
  }, [userId]);
};

export default useWebSocket;
