// Phone / WhatsApp, kept out of the server-rendered HTML as plain text.
//
// The number is stored reversed and base64-encoded, and only decoded in the
// browser when someone actually clicks Call / WhatsApp / "show number" (see
// components/site/ContactLinks.tsx). Harvesters that grep HTML for phone
// patterns find nothing; a person loses nothing. Deliberately NOT put in
// JSON-LD, llms.txt or the markdown views — any of those would publish it
// in plain text and undo this.
//
// To change the number: btoa("<digits incl. country code>".split("").reverse().join(""))

// never write the digits in a comment here: this repo is public
export const PHONE_ENC = "MjQ2NTc3NTEzOTE5";

export function decodePhone(enc: string = PHONE_ENC): string {
  return atob(enc).split("").reverse().join("");
}

/** 12 digits (country code + number) → "+CC NNNNN NNNNN" */
export function formatPhone(digits: string): string {
  return digits.length === 12 ? `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}` : `+${digits}`;
}

export const WHATSAPP_GREETING =
  "Hi Shreyansh, I found your portfolio (shreyanshkumarsingh.com) and would like to talk about ";
