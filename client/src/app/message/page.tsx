import { Suspense } from "react";
import MessagePage from "@/components/MessagePage"; // move logic to a component

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <MessagePage />
    </Suspense>
  );
}
