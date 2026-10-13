"use client";
import dynamic from "next/dynamic";

const Team = dynamic(() => import("@features/landing/components/Team"), { ssr: false });

export default Team;
