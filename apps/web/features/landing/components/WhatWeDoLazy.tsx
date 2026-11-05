"use client";
import dynamic from "next/dynamic";

const WhatWeDo = dynamic(() => import("@features/landing/components/WhatWeDo"), { ssr: false });

export default WhatWeDo;
