"use client";
import dynamic from "next/dynamic";

const PartnerBand = dynamic(() => import("@features/landing/components/PartnerBand"), { ssr: false });

export default PartnerBand;
