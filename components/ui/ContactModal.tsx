import Link from "next/link";
import ContactLinks from "@/components/site/ContactLinks";
import { PERSON } from "@/lib/site";

export default function ContactModal() {
  return (
    <div className="ov" id="cmOv" role="dialog" aria-modal="true" aria-label="Contact">
      <div className="ov-panel cm-panel">
        <button type="button" className="ov-close" data-close aria-label="Close">
          ×
        </button>
        <p className="label">Get in touch</p>
        <div className="cm-email mono">{PERSON.email}</div>
        <ContactLinks variant="stack" />
        <div className="cm-actions">
          <button type="button" className="btn btn-gold cut-sm" id="cmCopy">
            <span>Copy email</span>
          </button>
          <Link className="btn btn-ghost" href="/contact">
            Contact page →
          </Link>
        </div>
      </div>
    </div>
  );
}
