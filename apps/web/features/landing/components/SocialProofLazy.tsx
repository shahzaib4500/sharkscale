"use client";
import dynamic from "next/dynamic";

const SocialProof = dynamic(() => import("@features/landing/components/SocialProof"), { ssr: false });

export default SocialProof;
