"use client";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@shared/components/layout/Footer"), { ssr: false });

export default Footer;
