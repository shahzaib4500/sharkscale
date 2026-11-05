"use client";
import dynamic from "next/dynamic";

const Process = dynamic(() => import("@features/landing/components/Process"), { ssr: false });

export default Process;
