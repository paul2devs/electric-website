"use client";

import Image from "next/image";

import { getWhatsAppChatUrl } from "@/lib/constants/whatsapp";

const DEFAULT_MESSAGE =
  "Hi, I'd like to inquire about your services";

export function WhatsAppFloat() {
  const href = getWhatsAppChatUrl(DEFAULT_MESSAGE);
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[70] flex h-[3.75rem] w-[3.75rem] items-center justify-center transition-transform duration-200 hover:scale-105 sm:bottom-8 sm:right-8"
      aria-label="Chat on WhatsApp"
    >
      <span className="relative inline-flex drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
        <Image
          src="/icons/whatsapp.svg"
          alt=""
          width={44}
          height={44}
          className="h-11 w-11"
          priority
        />
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#e53935] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
          +99
        </span>
      </span>
    </a>
  );
}
