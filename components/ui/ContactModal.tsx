export default function ContactModal() {
  return (
    <div className="ov" id="cmOv" role="dialog" aria-modal="true" aria-label="Contact">
      <div className="ov-panel cm-panel">
        <button type="button" className="ov-close" data-close>
          ×
        </button>
        <p className="label">Get in touch</p>
        <div className="cm-email mono">shreyanshkumarsingh208@gmail.com</div>
        <div className="cm-actions">
          <button type="button" className="btn btn-gold cut-sm" id="cmCopy">
            <span>Copy email</span>
          </button>
          <a className="btn btn-ghost" href="mailto:shreyanshkumarsingh208@gmail.com">
            Open in mail app
          </a>
        </div>
      </div>
    </div>
  );
}
