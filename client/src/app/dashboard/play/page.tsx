"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "@/components/Play";
import { Inbox } from "@/components/Inbox";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 ">
      <div className="flex w-full max-w-xl  flex-col gap-6">
        <Tabs defaultValue="play">
          <TabsList className="w-full mt-10">
            <TabsTrigger
              value="play"
              className="font-bold text-lg px-4 py-2 cursor-pointer
            "
            >
              play
            </TabsTrigger>
            <TabsTrigger
              value="inbox"
              className="font-bold text-lg px-4 py-2 cursor-pointer"
            >
              inbox
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
