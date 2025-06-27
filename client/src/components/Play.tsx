"use client";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Link2, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { NEXT_URL } from "@/config/Api";
import { Instagram, MessageCircle, Share2, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { prompts } from "@/app/constants/prompt";

export const Play = () => {
  const [index, setIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const { loadTokenFromStorage } = useAuthStore() as {
    loadTokenFromStorage: () => void;
  };
  useEffect(() => {
    loadTokenFromStorage();
  }, []);

  const handleReset = () => {
    setIndex(0);
  };
  const { user } = useAuthStore() as { user: { username: string } };
  const username = user || "undefined";
  const handleDiceClick = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * prompts.length);
      setIndex(newIndex);

      setIsRolling(false);
    }, 100);
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${NEXT_URL}/u/${username}?pid=${index}`);
    toast.success("copied!");
  };
  return (
    <div>
      <Card className="w-full max-w-lg mx-auto mt-10 min-h-[260px] rounded-2xl bg-gradient-to-br from-[#593D3D] to-[#2C2C2C] shadow-xl flex flex-col items-center justify-center relative text-white px-6 py-8">
        <Avatar className="w-16 h-16 mb-4">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-gray-700 text-white font-medium">
            ?
          </AvatarFallback>
        </Avatar>

        {/* Animated prompt */}
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold text-center px-4 mb-6"
        >
          {prompts[index]}
        </motion.p>

        {/* Buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-4 text-white">
          <button
            onClick={handleReset}
            title="Reset"
            className="text-white text-sm cursor-pointer"
          >
            <RotateCcw />
          </button>

          <button
            onClick={handleDiceClick}
            title="Shuffle Prompt"
            disabled={isRolling}
            className={`text-2xl cursor-pointer ${
              isRolling
                ? "animate-bounce"
                : "hover:scale-110 transition-transform"
            }`}
          >
            🎲
          </button>
        </div>
      </Card>

      <Card className="w-full max-w-xl mx-auto mt-10 min-h-[160px] rounded-2xl bg-gray-100 flex flex-col items-center justify-center relative px-6 py-8">
        <h1 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">
          Step 1: Copy your link
        </h1>
        <p className="text-muted-foreground">
          {`${NEXT_URL}/user/${username}`}
        </p>

        <Button
          onClick={handleCopyLink}
          className="rounded-3xl border-2 border-red-500 text-red-500 font-bold cursor-pointer flex items-center gap-2 px-10"
          variant="secondary"
        >
          <Link2 className="-rotate-50 w-4 h-4" />
          copy link
        </Button>
      </Card>
      <Card className="w-full max-w-xl mx-auto mt-10 min-h-[160px] rounded-2xl bg-gray-100 flex flex-col items-center justify-center relative  px-6 py-8">
        <h1 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">
          Step 2: Share link on your story
        </h1>

        <DialogDemo />
      </Card>
    </div>
  );
};

function DialogDemo() {
  const { user } = useAuthStore() as { user: { username: string } };
  const username = user || "undefined";
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${NEXT_URL}/user/${username}`);
    toast.success("copied!");
  };

  const userLink = `${NEXT_URL}{/user/${username}`;
  const encodedText = encodeURIComponent(
    `Send me anonymous messages here: ${userLink}`
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 rounded-full text-white font-bold shadow-lg cursor-pointer"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] px-6 py-6">
        <Tabs defaultValue="whatsapp" className="relative w-full">
          {/* Floating Tab Icons */}
          <div className="flex justify-center -mt-12 mb-6 z-10 relative">
            <TabsList className="flex gap-6 bg-gray-200 p-6 rounded-full shadow-md">
              <TabsTrigger
                value="whatsapp"
                className="rounded-full p-2 data-[state=active]:bg-gray-300 transition-colors"
              >
                <MessageCircle className="w-16 h-16 text-black" />
              </TabsTrigger>

              <TabsTrigger
                value="instagram"
                className="rounded-full p-2 data-[state=active]:bg-gray-300 transition-colors"
              >
                <Instagram className="w-16 h-16 text-black" />
              </TabsTrigger>

              <TabsTrigger
                value="snapchat"
                className="rounded-full p-2 data-[state=active]:bg-gray-300 transition-colors"
              >
                <Smartphone className="w-16 h-16 text-black" />
              </TabsTrigger>
            </TabsList>
          </div>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp">
            <div className="space-y-3  ">
              {" "}
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                How to add the link to your story
              </h3>
              <div className="bg-gray-100 p-3 rounded text-sm">{userLink}</div>
              <Button onClick={handleCopyLink}>Copy & Open WhatsApp</Button>
              <a
                href={`https://wa.me/?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button>Share on watsapp</Button>
              </a>
            </div>
          </TabsContent>

          {/* Instagram Tab */}
          <TabsContent value="instagram">
            <div className="space-y-3">
              <p>Copy and paste this into your Instagram Story:</p>
              <div className="bg-gray-100 p-3 rounded text-sm">{userLink}</div>
              <Button onClick={handleCopyLink}>Copy Link</Button>
              <p className="text-xs text-muted-foreground">
                Tip: Use the "link" sticker in your Instagram story.
              </p>
            </div>
          </TabsContent>

          {/* Snapchat Tab */}
          <TabsContent value="snapchat">
            <div className="space-y-3">
              <p>Paste this link in your Snap Story or bio:</p>
              <div className="bg-gray-100 p-3 rounded text-sm">{userLink}</div>
              <Button onClick={handleCopyLink}>Copy Link</Button>
              <p className="text-xs text-muted-foreground">
                Snapchat doesn’t support direct web sharing. Paste it manually.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
