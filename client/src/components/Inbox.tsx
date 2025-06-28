"use client";
import { BACKEND_URL } from "@/config/Api";
import useWebSocket from "@/hooks/useWebSocket";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Message = {
  id: string;
  content: string;
};

export const Inbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { loadTokenFromStorage, token, userId } = useAuthStore() as {
    loadTokenFromStorage: () => void;
    token: string;
    userId: string;
  };

  useEffect(() => {
    loadTokenFromStorage();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${BACKEND_URL}/message/bulk`, {
          headers: {
            Authorization: token,
          },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [token]);

  // Register WebSocket only when userId is available
  useWebSocket(userId, (msg: string) => {
    const newMessage: Message = JSON.parse(msg);
    setMessages((prev) => [newMessage, ...prev]);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📥 Inbox</h2>
      {messages.length === 0 && <p>No messages yet.</p>}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="border p-3 rounded mb-2 bg-gray-50 shadow-sm"
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};
