"use client";

/** The browser's print dialog over the résumé page, which has its own print
 *  stylesheet (pages.css @media print). The PDF itself is a separate download. */
export default function PrintButton() {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
      Print this page
    </button>
  );
}
