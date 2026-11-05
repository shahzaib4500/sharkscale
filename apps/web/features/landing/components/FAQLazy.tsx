"use client";

import dynamic from "next/dynamic";

const FAQ = dynamic(() => import("@features/landing/components/FAQ"), { ssr: false });

export default FAQ;
