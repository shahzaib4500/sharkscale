"use client";

import dynamic from "next/dynamic";

const ServicesShowcase = dynamic(() => import("@features/landing/components/ServicesShowcase"), { ssr: false });

export default ServicesShowcase;
