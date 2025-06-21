"use client";

import React from "react";
import Marquee from "react-fast-marquee";

export const Marquees = () => {
  const messages = [
    "your confessions",
    "ask me anything",
    "not gonna lie",
    "send me a never have I ever",
    "describe me in 3 words",
    "what do you think of me",
    "what's your first impression",
    "your weirdest dream",
    "funniest memory with me",
    "a secret you've never told",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black text-white py-4">
      {/* Left fade */}
      <div className="absolute top-0 left-0 w-16 h-full z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      
      {/* Right fade */}
      <div className="absolute top-0 right-0 w-16 h-full z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />

      {/* Marquee content */}
      <Marquee gradient={false}>
        <div className="flex items-center gap-4 px-4">
          {messages.map((message, index) => (
            <span key={index} className="whitespace-nowrap font-bold">
              {message} <span className="mx-2">•</span>
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
};
