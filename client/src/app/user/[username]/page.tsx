"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { username } = useParams(); // /user/[username]
  const searchParams = useSearchParams(); // ?prompt=...
  const prompt = searchParams.get("prompt");

  const [message, setMessage] = useState("");

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

          {/* "Send" Button - only shows when typing */}
          {message.trim() && (
            <div className="mt-4 flex justify-end">
              <Button className="bg-black text-white rounded-full px-6">
                Send
              </Button>
            </div>
          )}

          {/* Footer Text */}
          <div className="mt-2 text-center text-xs text-gray-600">
            🔒 anonymous q&a
          </div>
        </div>
      </div>

      {/* Bottom "Get your messages" Button */}
      <div className="flex justify-center items-center py-6">
        <Button className="bg-black text-white text-base px-8 py-3 rounded-full">
          Get your own messages!
        </Button>
      </div>
    </div>
  );
};

export default Page;
