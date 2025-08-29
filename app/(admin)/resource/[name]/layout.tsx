"use client";

import { ResourceProvider } from "@/resource-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ResourceProvider>
      {children}
    </ResourceProvider>
  );
}
