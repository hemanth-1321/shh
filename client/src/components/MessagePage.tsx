"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

const decode = (val: string | null) => (val ? atob(val) : "");

const MessagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const content = decode(searchParams.get("content"));
  const question = decode(searchParams.get("question"));

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-10 sm:px-6 lg:px-8 relative">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/play")}
        className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-200 text-sm shadow-md transition"
      >
        ← Back
      </button>

      <div className="shadow-2xl bg-white rounded-2xl overflow-hidden w-full max-w-xl flex flex-col">
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-[#ef2476] to-[#ff9900]">
          <p className="text-white text-center text-lg sm:text-2xl font-extrabold tracking-tight">
            {question}
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-gray-900 text-center text-base sm:text-xl font-extrabold tracking-tight">
            {content}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 text-gray-600 text-sm flex items-center gap-1">
        <span>Sent with love from &quot;SHH,&quot;</span>
        <span className="animate-pulse">❤️</span>
      </div>
    </div>
  );
};

export default MessagePage;
