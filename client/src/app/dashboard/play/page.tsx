"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "@/components/Play";
import { Inbox } from "@/components/Inbox";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // back arrow icon

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-100">
      {/* Back Arrow Button */}
      <div className="w-full max-w-xl flex items-center mt-4 mb-2">
        <button
          onClick={() => router.push("/")}
          className="text-black flex items-center gap-2 text-lg font-medium hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>

      {/* Tabs Section */}
      <div className="flex w-full max-w-xl flex-col gap-6">
        <Tabs defaultValue="play">
          <TabsList className="w-full mt-4">
            <TabsTrigger
              value="play"
              className="font-bold text-lg px-4 py-2 cursor-pointer"
            >
              Play
            </TabsTrigger>
            <TabsTrigger
              value="inbox"
              className="font-bold text-lg px-4 py-2 cursor-pointer"
            >
              Inbox
            </TabsTrigger>
          </TabsList>
          <TabsContent value="play">
            <Play />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
