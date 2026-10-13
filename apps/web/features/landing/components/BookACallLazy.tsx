"use client";

import dynamic from "next/dynamic";

const BookACall = dynamic(() => import("@features/landing/components/BookACall"), { ssr: false });

export default BookACall;
