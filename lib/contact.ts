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

export const PHONE_ENC = "MjQ2NTc3NTEzOTE5"; // +91 93157 75642

export function decodePhone(enc: string = PHONE_ENC): string {
  return atob(enc).split("").reverse().join("");
}

/** "919315775642" → "+91 93157 75642" */
export function formatPhone(digits: string): string {
  return digits.length === 12 ? `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}` : `+${digits}`;
}

export const WHATSAPP_GREETING =
  "Hi Shreyansh, I found your portfolio (shreyanshkumarsingh.com) and would like to talk about ";
