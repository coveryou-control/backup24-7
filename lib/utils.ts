/** Join class names, dropping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Stable, human-readable lead reference: B247-2026-AB12CD. */
export function makeLeadId(now = new Date()): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `B247-${now.getUTCFullYear()}-${rand}`;
}
