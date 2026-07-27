import MessagesPage from "@/customComponents/pages/MessagesPage";
import { Suspense } from "react";

export default function Messages() {
  return (
    <Suspense fallback={null}>
      <MessagesPage />
    </Suspense>
  );
}
