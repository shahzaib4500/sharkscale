"use client";
import dynamic from "next/dynamic";

const Reviews = dynamic(() => import("@features/landing/components/Reviews"), { ssr: false });

export default Reviews;
