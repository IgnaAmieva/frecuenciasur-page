"use client";

import dynamic from "next/dynamic";

const IntroLoader = dynamic(() => import("@/components/IntroLoader"), { ssr: false });

export default function IntroLoaderWrapper() {
  return <IntroLoader />;
}
