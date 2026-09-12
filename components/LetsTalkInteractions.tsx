"use client";

import { useEffect } from "react";

export default function LetsTalkInteractions() {
  useEffect(() => {
    function showToast(msg: string) {
      const t = document.getElementById("toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("on");
      window.clearTimeout((showToast as unknown as { _t?: number })._t);
      (showToast as unknown as { _t?: number })._t = window.setTimeout(() => t.classList.remove("on"), 2200);
    }
    const btn = document.getElementById("talkCopy");
    const onClick = () => {
      const email = "shreyanshkumarsingh208@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(email)
          .then(() => showToast("Email copied — " + email))
          .catch(() => showToast(email));
      } else {
        showToast(email);
      }
    };
    btn?.addEventListener("click", onClick);
    return () => btn?.removeEventListener("click", onClick);
  }, []);

  return null;
}
