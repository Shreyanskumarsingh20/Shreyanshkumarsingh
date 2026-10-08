/**
 * ⌘K / Ctrl+K command palette shell. The list of commands is data already
 * on the page (sections, projects, sim launchers, actions) — filtering,
 * arrow-key navigation and rendering are handled imperatively by
 * HomeInteractions.tsx (renderCmdk/setCmdkActive/runCmdkActive), same as the
 * original script, since the list needs to re-render on every keystroke.
 */
export default function CommandPalette() {
  return (
    <div className="ov" id="cmdkOv" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="ov-panel">
        <div className="cmdk-input-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="cmdk-input"
            id="cmdkInput"
            placeholder="Jump to a section, a project, or run an action…"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="cmdk-esc">ESC</span>
        </div>
        <div className="cmdk-list" id="cmdkList" data-lenis-prevent></div>
      </div>
    </div>
  );
}
