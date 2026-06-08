"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

const HIDDEN_HEADER_ROUTES = ["/onboarding", "/auth/signin", "/auth/signup"];

export default function ConditionalHeader() {
  const pathname = usePathname();

  const shouldHide = HIDDEN_HEADER_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (shouldHide) return null;

  return <Header />;
}