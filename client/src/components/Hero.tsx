"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const Hero = () => {
  const router = useRouter();
  const xImage1 = useMotionValue(0);
  const yImage1 = useMotionValue(0);
  const xImage2 = useMotionValue(0);
  const yImage2 = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);

  const { loadTokenFromStorage, isAuthenticated } = useAuthStore() as {
    loadTokenFromStorage: () => void;
    isAuthenticated: boolean;
  };

  useEffect(() => {
    loadTokenFromStorage();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const factor = 0.05;

    xImage1.set(offsetX * factor);
    yImage1.set(offsetY * factor);
    xImage2.set(-offsetX * factor);
    yImage2.set(-offsetY * factor);
  };

  const handleGetStarted = () => {
    router.push(isAuthenticated ? "/dashboard/play" : "/auth");
  };

  return (
    <div className="w-full min-h-screen p-5">
      {/* Desktop */}
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className="hidden md:block w-full h-full bg-gradient-to-b from-[#ef2476] to-[#ff9900] opacity-100 rounded-4xl relative overflow-hidden"
      >
        <div className="px-5 text-white text-4xl font-bold">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 px-3 py-1 font-sans">
              <Image
                src="/logo.png"
                width={120}
                height={130}
                alt="logo"
                className="-rotate-4"
              />
              <span>🤫</span>
            </div>
            <ul className="flex text-xl gap-4">
              <li>About</li>
              <li>Safety</li>
              <li>Blog</li>
              <li>Contact us</li>
            </ul>
            <Button className="p-6 rounded-4xl">Get started</Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-white font-black text-center text-[150px] leading-[0.8] mt-30 font-sans">
          <div>real</div>
          <div>friends</div>
          <div>real fun</div>
        </div>

        <div className="flex justify-center items-center p-4">
          <Button
            onClick={handleGetStarted}
            className="p-8 rounded-full bg-white hover:bg-white text-orange-400 hover:text-black transition-colors duration-300 ease-in-out text-xl font-bold cursor-pointer mt-20"
          >
            Get Started
          </Button>
        </div>

        {/* Floating images */}
        <motion.img
          src="/hand.png"
          alt="Decor 1"
          className="w-44 h-44 absolute top-[10%] left-[25%] pointer-events-none"
          style={{ x: xImage1, y: yImage1 }}
        />
        <motion.img
          src="/paw.png"
          alt="Decor 2"
          className="w-60 h-60 absolute top-[5%] right-[25%] pointer-events-none"
          style={{ x: xImage2, y: yImage2 }}
        />
        <motion.img
          src="/drink.png"
          alt="Decor 3"
          className="w-30 h-60 absolute bottom-[10%] left-[30%] pointer-events-none"
          style={{ x: xImage2, y: yImage2 }}
        />
        <motion.img
          src="/boy.jpg"
          alt="Boy Decor"
          className="w-54 h-70 absolute top-[30%] left-[20%] pointer-events-none rounded-4xl border-[2px] border-amber-300 -rotate-8"
          animate={{ y: [0, -10, 0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src="/girl.jpg"
          alt="Girl Decor"
          className="w-70 h-84 absolute bottom-[20%] right-[20%] pointer-events-none rounded-4xl border-[2px] border-amber-300 rotate-10"
          animate={{ y: [0, 10, 0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mobile */}
      <div className="flex flex-col md:hidden w-full min-h-screen bg-gradient-to-b from-[#ef2476] to-[#ff9900] rounded-4xl text-white">
        <div className="flex justify-between items-center px-4 pt-6">
          <div className="text-3xl font-bold flex items-center gap-1">
            <Image src="/logo.png" width={50} height={50} alt="logo" />
            🤫
          </div>
          <Button className="text-sm px-4 py-2 rounded-full">
            Get started
          </Button>
        </div>

        <div className="text-center mt-20 text-5xl font-black leading-[1.1]">
          <div>real</div>
          <div>friends</div>
          <div>real fun</div>
        </div>

        <div className="flex justify-center mt-12 px-6">
          <Button
            onClick={handleGetStarted}
            className="w-full p-5 rounded-full bg-white text-orange-500 text-lg font-bold"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
