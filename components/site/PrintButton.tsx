"use client";

/** "Save as PDF" — the browser's print dialog over the résumé page, which
 *  has its own print stylesheet (pages.css @media print). */
export default function PrintButton() {
  return (
    <button type="button" className="btn btn-gold cut-sm" onClick={() => window.print()}>
      <span>Save as PDF ↓</span>
    </button>
  );
}
