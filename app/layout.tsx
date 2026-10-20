import type { ReactNode } from "react";

// Minimal root layout — the real layout lives in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
