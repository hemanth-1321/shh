"use client";

import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full fixed bottom-0 left-0 bg-gradient-to-r from-[#ef2476] to-[#ff9900] text-white py-4 px-6 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm md:text-base">
        {/* Left: Text */}
        <p className="text-white font-medium text-center md:text-left">
          © {new Date().getFullYear()} SSH · anonymous q&a
        </p>

        {/* Right: Links */}
        <div className="flex gap-4 justify-center text-white/90">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Blog
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
