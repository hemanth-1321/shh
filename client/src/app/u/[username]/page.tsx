"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { prompts } from "@/app/constants/prompt";
import axios from "axios";
import { BACKEND_URL } from "@/config/Api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const Page = () => {
  const { username } = useParams();
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");
  const prompt = pid && !isNaN(Number(pid)) ? prompts[parseInt(pid)] : null;
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const { loadTokenFromStorage, token } = useAuthStore() as {
    loadTokenFromStorage: () => void;
    token: string;
  };

  useEffect(() => {
    loadTokenFromStorage();
  }, []);
  console.log(loadTokenFromStorage);
  const handleSend = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/message/${username}`,
        {
          question: prompt,
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      toast.success("send a message");
    } catch (error) {
      console.log("error sending message", error);
      toast.error("error sending message");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-r from-[#ef2476] to-[#ff9900]">
      {/* Message Card */}
      <div className="flex justify-center items-start px-4 pt-24">
        <div className="w-full max-w-2xl rounded-[30px] bg-gradient-to-br from-[#f8a6c2]/80 to-[#f5c08b]/80 shadow-xl p-6 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/placeholder-user.jpg"
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-sm font-medium text-gray-800">@{username}</h2>
              <p className="tex t-sm text-black font-semibold">{prompt}</p>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            className="w-full min-h-[120px] bg-transparent text-black placeholder:text-gray-600 text-base p-4 rounded-2xl resize-none focus:outline-none"
            placeholder="Type your anonymous message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Footer Text */}
          <div className="mt-2 text-center text-xs text-gray-600">
            🔒 anonymous q&a
          </div>
        </div>
      </div>
      {message.trim() && (
        <div className="mb-10 flex w-full justify-center items-center py-6">
          <Button
            onClick={handleSend}
            className="bg-black text-white text-lg px-12 py-4 rounded-full font-bold shadow-lg"
          >
            {loading ? "sending" : "send"}
          </Button>
        </div>
      )}

      <div className="flex justify-center items-center py-6">
        <Button className="bg-black text-white text-lg px-12 py-4 rounded-full font-bold shadow-lg">
          Get your own messages!
        </Button>
      </div>
    </div>
  );
};

export default Page;
