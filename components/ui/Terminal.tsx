/**
 * The hidden terminal easter egg (backtick to open). Command output is
 * appended imperatively by HomeInteractions.tsx's runTermCommand(), same
 * pattern as the original — a real scrolling log, not React state, since
 * new lines only ever append.
 */
export default function Terminal() {
  return (
    <div className="ov" id="termOv" role="dialog" aria-modal="true" aria-label="Terminal">
      <div className="ov-panel term-panel">
        <div className="term-bar">
          <i></i>
          <i></i>
          <i></i>
          <span>ansh@the-range — zsh</span>
        </div>
        <div className="term-log" id="termLog">
          <div className="out">
            Welcome. Type <b>help</b> to see what&apos;s here — or <b>exit</b> to close.
          </div>
        </div>
        <div className="term-input-row">
          <span className="prompt">$</span>
          <input
            type="text"
            className="term-input"
            id="termInput"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
}
