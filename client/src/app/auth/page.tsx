"use client";
import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/config/Api";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore() as {
    login: (token: string, user: string, userId: string) => void;
  };
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        username,
      });
      console.log(response);
      const token = response.data.token;
      const user = response.data.user.username;
      const userId = response.data.user.id;
      console.log("username", user);

      login(token, user, userId);

      toast.success(`welcome ${username}`);
      router.push("/dashboard/play");
    } catch (error) {
      console.log("error while login", error);
      toast.error("error while logging you in ");
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center h-screen bg-[#1e2a36] p-5 text-wrap">
      <form
        className="w-full max-w-sm flex flex-col gap-6 "
        onSubmit={handleLogin}
      >
        <div>
          <h1 className="s text-white scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Choose a username
          </h1>
          <p className="text-center text-gray-500">
            Pick a unique username to personalize your profile.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jack"
              required
              className="p-6 rounded-3xl text-white font-black"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full rounded-4xl p-8 text-3xl font-extrabold cursor-pointer"
          variant={"secondary"}
        >
          {loading && <Loader2 className="animate-spin mr-3 h-6 w-6" />}
          {loading ? "Logging in..." : "Continue"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
