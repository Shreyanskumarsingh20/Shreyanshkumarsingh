"use client";

import { useState } from "react";
import { PERSON } from "@/lib/site";
import { decodePhone, formatPhone, WHATSAPP_GREETING } from "@/lib/contact";

/**
 * Call · WhatsApp · Email. The phone number never appears in the server
 * HTML — it's decoded from lib/contact.ts only when someone clicks Call,
 * WhatsApp or "Show number", so scrapers reading the page source get
 * nothing while people get one-tap actions. Email is already public across
 * the site (and machine-readable on purpose), so it's a plain mailto.
 */
export default function ContactLinks({
  variant = "row",
  showNumber = false,
}: {
  variant?: "row" | "stack";
  /** render a "Show number" control that reveals the digits as text */
  showNumber?: boolean;
}) {
  const [revealed, setRevealed] = useState<string | null>(null);

  const call = () => {
    window.location.href = `tel:+${decodePhone()}`;
  };
  const whatsapp = () => {
    const url = `https://wa.me/${decodePhone()}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className={`contact-links contact-links--${variant}`}>
      <button type="button" className="contact-link" onClick={call}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="currentColor" />
        </svg>
        <span>
          <b>Call</b>
          <small>Mobile · India</small>
        </span>
      </button>
      <button type="button" className="contact-link contact-link--wa" onClick={whatsapp}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z" fill="currentColor" />
        </svg>
        <span>
          <b>WhatsApp</b>
          <small>Message directly</small>
        </span>
      </button>
      <a className="contact-link" href={`mailto:${PERSON.email}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3a1 1 0 0 1-1-1V6c0-.6.4-1 1-1zm1 2.3V17h16V7.3l-8 5.3-8-5.3zM5.2 7 12 11.5 18.8 7H5.2z" fill="currentColor" />
        </svg>
        <span>
          <b>Email</b>
          <small>{PERSON.email}</small>
        </span>
      </a>
      {showNumber && (
        <p className="contact-reveal">
          {revealed ? (
            <span className="mono">{revealed}</span>
          ) : (
            <button type="button" onClick={() => setRevealed(formatPhone(decodePhone()))}>
              Show phone number
            </button>
          )}
        </p>
      )}
    </div>
  );
}
