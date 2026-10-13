"use client";

import dynamic from "next/dynamic";

const LatestWorks = dynamic(() => import("@features/landing/components/LatestWorks"), { ssr: false });

export default LatestWorks;
