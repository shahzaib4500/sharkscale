"use client";
import dynamic from "next/dynamic";

const Tools = dynamic(() => import("@features/landing/components/Tools"), { ssr: false });

export default Tools;
