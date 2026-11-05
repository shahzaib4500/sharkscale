"use client";
import dynamic from "next/dynamic";

const EmailEngine = dynamic(() => import("@features/landing/components/EmailEngine"), { ssr: false });

export default EmailEngine;
