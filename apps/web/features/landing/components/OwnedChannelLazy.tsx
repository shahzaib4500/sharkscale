"use client";
import dynamic from "next/dynamic";

const OwnedChannel = dynamic(() => import("@features/landing/components/OwnedChannel"), { ssr: false });

export default OwnedChannel;
