import { PROJECTS } from "@/lib/projects";

// "Last shipped" for the hero ticker, fetched on the server and cached for
// six hours (ISR) — instead of six GitHub API calls from every visitor's
// browser, which hit GitHub's 60-requests-per-hour unauthenticated limit
// and logged 403s in the console.

export type LastShipped = { repo: string; pushedAt: string } | null;

export async function getLastShipped(): Promise<LastShipped> {
  const repos = PROJECTS.filter((p) => p.url).map((p) => p.url!.replace("https://github.com/", ""));
  const results = await Promise.all(
    repos.map(async (r) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${r}`, {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 21600 },
        });
        if (!res.ok) return null;
        const j = (await res.json()) as { name?: string; pushed_at?: string };
        return j.name && j.pushed_at ? { repo: j.name, pushedAt: j.pushed_at } : null;
      } catch {
        return null;
      }
    }),
  );
  const valid = results.filter((r): r is NonNullable<typeof r> => r !== null);
  if (!valid.length) return null;
  valid.sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt));
  return valid[0];
}

export function relativeDays(iso: string, now = Date.now()) {
  const days = Math.floor((now - Date.parse(iso)) / 86_400_000);
  return days <= 0 ? "today" : days === 1 ? "1 day ago" : `${days} days ago`;
}
