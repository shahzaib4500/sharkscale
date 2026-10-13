"use client";
import { Toaster, type ToasterProps } from "react-hot-toast";

export default function ToastProvider(props: ToasterProps) {
  return <Toaster {...props} />;
}
