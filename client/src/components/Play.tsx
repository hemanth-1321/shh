"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Download, Link2, RotateCcw } from "lucide-react";
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
import { prompts } from "@/app/constants/prompt";
import { toPng } from "html-to-image";
import download from "downloadjs";

export const Play = () => {
  const [index, setIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [showForExport, setShowForExport] = useState(false);

  const promptRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const promptTextRef = useRef<HTMLParagraphElement>(null);

  const { loadTokenFromStorage, user } = useAuthStore() as {
    loadTokenFromStorage: () => void;
    user: string;
  };

  const username = user ?? "undefined";

  useEffect(() => {
    loadTokenFromStorage();
  }, []);

  const handleReset = () => {
    setIndex(0);
    setCustomPrompt(null);
    if (promptTextRef.current) {
      promptTextRef.current.innerText = prompts[0];
    }
  };

  const handleDiceClick = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * prompts.length);
      setIndex(newIndex);
      setCustomPrompt(null);
      if (promptTextRef.current) {
        promptTextRef.current.innerText = prompts[newIndex];
      }
      setIsRolling(false);
    }, 100);
  };

  const handleCopyLink = () => {
    const base64Prompt = btoa(customPrompt ?? "");
    const link = customPrompt
      ? `${NEXT_URL}/u/${username}?custom=true&text=${base64Prompt}`
      : `${NEXT_URL}/u/${username}?pid=${index}`;

    navigator.clipboard.writeText(link);
    toast.success("Copied!");
  };

  const handleDownloadImage = async () => {
    setShowForExport(true);
    await new Promise((res) => setTimeout(res, 100));

    if (!downloadRef.current) {
      toast.error("Download failed");
      setShowForExport(false);
      return;
    }

    try {
      const dataUrl = await toPng(downloadRef.current, {
        cacheBust: true,
        backgroundColor: "#f3f3f3",
      });
      download(dataUrl, "question-card.png");
    } catch (err) {
      console.log(err);
      toast.error("Download failed");
    } finally {
      setShowForExport(false);
    }
  };

  return (
    <div>
      {/* Prompt Card */}
      <Card
        ref={promptRef}
        className="w-full max-w-lg mx-auto mt-10 min-h-[260px] rounded-2xl bg-gradient-to-br from-[#593D3D] to-[#2C2C2C] shadow-xl flex flex-col items-center justify-center relative text-white px-6 py-8"
      >
        <Avatar className="w-16 h-16 mb-4">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-gray-700 text-white font-medium">
            ?
          </AvatarFallback>
        </Avatar>

        <motion.p
          key={index}
          ref={promptTextRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setCustomPrompt(e.currentTarget.innerText)}
          className="text-lg font-semibold text-center px-4 mb-6 focus:outline-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {prompts[index]}
        </motion.p>

        <div className="absolute bottom-4 right-4 flex space-x-4 text-white">
          <button
            onClick={handleReset}
            title="Reset"
            className="text-sm cursor-pointer"
          >
            <RotateCcw />
          </button>
          <button
            onClick={handleDiceClick}
            disabled={isRolling}
            title="Shuffle Prompt"
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

      {/* Copy Link Card */}
      <Card className="w-full max-w-xl mx-auto mt-10 min-h-[160px] rounded-2xl bg-gray-100 flex flex-col items-center justify-center relative px-6 py-8">
        <h1 className="text-center text-xl font-extrabold tracking-tight mb-2">
          Step 1: Copy your link
        </h1>
        <p className="text-muted-foreground mb-3 break-words text-center">
          {customPrompt
            ? `${NEXT_URL}/u/${username}?custom=true`
            : `${NEXT_URL}/u/${username}?pid=${index}`}
        </p>
        <Button
          onClick={handleCopyLink}
          className="rounded-3xl border-2 border-red-500 text-red-500 font-bold cursor-pointer flex items-center gap-2 px-10"
          variant="secondary"
        >
          <Link2 className="-rotate-50 w-4 h-4" />
          Copy Link
        </Button>
      </Card>

      {/* Download Card */}
      <Card className="w-full max-w-xl mx-auto mt-10 min-h-[160px] rounded-2xl bg-gray-100 flex flex-col items-center justify-center relative px-6 py-8">
        <h1 className="text-center text-xl font-extrabold tracking-tight mb-4">
          Step 2: Share or download your question
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 rounded-full text-white font-bold shadow-lg">
              <Download className="w-4 h-4 mr-2" />
              Download / Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] px-10 py-10">
            <div className="flex flex-col space-y-4 items-center justify-center text-center">
              <Button onClick={handleDownloadImage} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
              <Button onClick={handleCopyLink} className="w-full">
                <Link2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="w-full cursor-pointer">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Hidden Image Card */}
      {showForExport && (
        <div
          ref={downloadRef}
          className="fixed top-0 left-0 w-[390px] h-[700px] bg-gradient-to-b from-[#f3f3f3] to-[#a7c3d8] rounded-2xl flex flex-col items-center justify-center text-center text-black z-[9999] p-4 shadow-2xl"
        >
          <div className="text-5xl mb-4">📩</div>
          <h2 className="text-xl font-bold mb-4 max-w-[80%] break-words">
            {customPrompt ?? prompts[index]}
          </h2>
          <div className="bg-white border border-blue-400 text-blue-500 font-medium rounded-lg px-4 py-2 mb-2">
            Paste your <span className="underline">link</span> here!
          </div>
          <div className="flex space-x-4 text-2xl mb-4">
            <span>⬆️</span>
            <span>⬆️</span>
            <span>⬆️</span>
          </div>
          <div className="absolute bottom-10">
            <p className="text-xl font-black tracking-wide">SSH</p>
            <p className="text-sm text-black/60">anonymous q&a</p>
          </div>
        </div>
      )}
    </div>
  );
};
