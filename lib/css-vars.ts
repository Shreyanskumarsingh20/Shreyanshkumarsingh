import type { CSSProperties } from "react";

/**
 * The original CSS relies heavily on inline custom properties (--i for
 * stagger delay, --k for the Range stack offset, --accent for per-project
 * color, --rot for pin-note tilt). React's CSSProperties type doesn't allow
 * arbitrary `--foo` keys, so call sites cast an object literal through this
 * type instead of `as any` everywhere.
 */
export type CSSVarStyle = CSSProperties & Record<`--${string}`, string | number>;
