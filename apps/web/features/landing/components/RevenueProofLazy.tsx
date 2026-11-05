"use client";
import dynamic from "next/dynamic";

const RevenueProof = dynamic(() => import("@features/landing/components/RevenueProof"), { ssr: false });

export default RevenueProof;
