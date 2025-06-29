"use client";
import { BACKEND_URL } from "@/config/Api";
import useWebSocket from "@/hooks/useWebSocket";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";

type Message = {
  id: string;
  content: string;
  question: string;
  createdAt: string;
  isNew?: boolean;
};

export const Inbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/message/bulk`, {
          headers: { Authorization: token },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  useWebSocket(userId, (msg: string) => {
    const newMessage: Message = { ...JSON.parse(msg), isNew: true };
    setMessages((prev) => [newMessage, ...prev]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, isNew: false } : m))
      );
    }, 2000);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg
          className="animate-spin h-10 w-10 mb-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          ></path>
        </svg>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📥 Inbox</h2>

      {messages.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No messages yet.</p>
      )}

      {messages.map((msg) => {
        const encodedContent = Buffer.from(msg.content).toString("base64");
        const encodedQuestion = Buffer.from(msg.question).toString("base64");

        return (
          <motion.div
            key={msg.id}
            initial={msg.isNew ? { opacity: 0, y: -15 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="border p-5 rounded-2xl mb-4 bg-gray-50 shadow-sm flex justify-between items-center gap-6 hover:shadow-md"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 p-[2px] bg-gray-200 border border-gray-200 rounded-full flex items-center justify-center">
                <Image
                  src="/love.png"
                  width={40}
                  height={40}
                  alt="avatar"
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base text-gray-800">{msg.content}</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <Link
              href={`/message?content=${encodedContent}&question=${encodedQuestion}`}
            >
              <ChevronRight className="text-gray-400 cursor-pointer" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
