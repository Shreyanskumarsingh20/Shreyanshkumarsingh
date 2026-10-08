"use client";

import { useEffect } from "react";
import { PROJECTS } from "@/lib/projects";
import { RESEARCH_CASES } from "@/lib/research";
import { BELIEFS } from "@/lib/beliefs";
import { scrollToElement } from "@/lib/smooth-scroll";
import { GITHUB_URL } from "@/lib/site";

/**
 * Every imperative, DOM-driven behavior from index.html's original inline
 * <script> that isn't pure CSS: the Range sticky-stack HUD/dimming pass, the
 * command palette, the hidden terminal, project/sim/contact modals, the
 * research domain filters, the FAQ switches + continuous tilt, THE BUILD's
 * spine fill, the shared reveal-on-scroll IntersectionObserver, the GitHub
 * ticker, and the particle field + SURVIVE minigame.
 *
 * This is one big client component (rather than one per feature) on
 * purpose: the original script is a single cohesive unit where features
 * share state (closeAllOverlays, the rAF-gated scroll tick, PROJECTS/
 * RESEARCH_CASES lookups) — splitting it into isolated components would
 * mean re-deriving those shared bindings, which is exactly the kind of
 * "improvement" the migration plan says not to make to the Range mechanic,
 * and the same logic applies to the rest of this script. Element ids/classes
 * are unchanged from the original, so this ports almost verbatim: it
 * attaches behavior to markup the section components already rendered,
 * rather than re-creating that markup via innerHTML the way the original
 * script did (now redundant since JSX renders it directly from lib/*.ts).
 */
export default function HomeInteractions() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const timers: number[] = [];
    const rafs: number[] = [];

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // background videos load/pause themselves — see components/BgVideo.tsx

    // ==========================================================================
    // THE RANGE — layout() computes which card is active (for the HUD + side
    // progress dots) and dims the ones it has covered via .is-behind. DO NOT
    // rewrite this math — see CHANGELOG.md 2026-08-21.
    // ==========================================================================
    const rangeSection = document.getElementById("range");
    const hud = document.getElementById("hud");
    const hudLine = document.getElementById("hudLine");
    const hudBar = document.getElementById("hudBar");
    const progressEl = document.getElementById("progress");
    const stackCardEls = rangeSection ? [...rangeSection.children] as HTMLElement[] : [];
    const dotEls = progressEl ? [...progressEl.children] as HTMLElement[] : [];
    const N = PROJECTS.length;
    const STACK_OFFSET = 92,
      STACK_STEP = 8; // must match .stack-card's top: formula in globals.css

    // Split into a measure step (layout reads only) and an apply step (writes
    // only) so one scroll frame never reads layout after another section has
    // already written to the DOM — that interleaving forced a synchronous
    // re-layout per section, per frame. The math itself is unchanged.
    type RangeMeasure = { top: number; bottom: number; height: number; cardTops: number[]; vh: number; vw: number };
    function measureRange(): RangeMeasure | null {
      if (!rangeSection) return null;
      const rect = rangeSection.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        cardTops: stackCardEls.map((card) => card.getBoundingClientRect().top),
        vh: window.innerHeight,
        vw: window.innerWidth,
      };
    }
    let lastActive = -1;
    function applyRange(m: RangeMeasure | null) {
      if (!hud || !hudLine || !hudBar || !progressEl) return;
      if (!m) {
        hud.classList.remove("on");
        progressEl.classList.remove("on");
        return;
      }
      const total = m.height - m.vh;
      const inRange = m.top < m.vh * 0.5 && m.bottom > 0;
      const wide = m.vw >= 860;
      hud.classList.toggle("on", inRange && !reduceMotion && wide);
      progressEl.classList.toggle("on", inRange && !reduceMotion && wide);

      if (reduceMotion || !wide || total <= 0) {
        stackCardEls.forEach((card) => card.classList.remove("is-behind"));
        lastActive = -1;
        return;
      }

      let active = 0;
      m.cardTops.forEach((top, i) => {
        if (top <= STACK_OFFSET + i * STACK_STEP + 1) active = i;
      });
      if (active !== lastActive) {
        dotEls.forEach((d, i) => d.classList.toggle("on", i === active));
        stackCardEls.forEach((card, i) => card.classList.toggle("is-behind", i < active));
        const p = PROJECTS[active];
        hudLine.textContent = `PROJECT ${p.n}/0${N} — ${p.name} · ${p.domain}`;
        lastActive = active;
      }
      const progress = Math.min(Math.max(-m.top, 0), total) / total;
      hudBar.style.transform = `scaleX(${progress.toFixed(3)})`;
    }

    // ==========================================================================
    // FAQ — continuous scroll-tied tilt
    // ==========================================================================
    // Browsers with CSS scroll-driven animations run this tilt on the
    // compositor (see the faq-tilt keyframes in globals.css); the JS version
    // below is only the fallback for the rest (Firefox, at time of writing).
    const faqItems = [...document.querySelectorAll<HTMLElement>("#faq .faq-item")];
    const cssFaqTilt = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    const faqTiltByJs = !reduceMotion && !cssFaqTilt && faqItems.length > 0;
    function measureFaq(): DOMRect[] | null {
      return faqTiltByJs ? faqItems.map((el) => el.getBoundingClientRect()) : null;
    }
    function applyFaq(rects: DOMRect[] | null) {
      if (!rects) return;
      const vh = window.innerHeight;
      const mid = vh / 2;
      faqItems.forEach((el, i) => {
        const r = rects[i];
        if (r.bottom < -200 || r.top > vh + 200) return;
        const delta = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / mid));
        el.style.transform = `perspective(900px) rotateX(${(delta * -6).toFixed(2)}deg)`;
      });
    }

    // ==========================================================================
    // THE BUILD — spine fill
    // ==========================================================================
    const buildStory = document.querySelector<HTMLElement>(".build-story");
    const buildSpineFill = document.getElementById("buildSpineFill");
    function measureBuild(): DOMRect | null {
      return buildStory && buildSpineFill ? buildStory.getBoundingClientRect() : null;
    }
    function applyBuild(rect: DOMRect | null) {
      if (!rect || !buildSpineFill) return;
      const total = rect.height - window.innerHeight * 0.5;
      const progress = total > 0 ? Math.min(Math.max(window.innerHeight * 0.7 - rect.top, 0), total) / total : 0;
      buildSpineFill.style.transform = `scaleY(${progress.toFixed(3)})`;
    }

    // Only sections within a viewport's distance of the screen do any work.
    const near = { range: true, faq: true, build: true };
    const nearKey = new Map<Element, keyof typeof near>();
    if (rangeSection) nearKey.set(rangeSection, "range");
    const faqSectionEl = document.getElementById("faq");
    if (faqSectionEl) nearKey.set(faqSectionEl, "faq");
    if (buildStory) nearKey.set(buildStory, "build");
    const nearIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (near[nearKey.get(e.target)!] = e.isIntersecting));
        onScroll();
      },
      { rootMargin: "100% 0px" }
    );
    nearKey.forEach((_, el) => nearIO.observe(el));
    cleanups.push(() => nearIO.disconnect());

    function tick() {
      // reads…
      const r = near.range ? measureRange() : null;
      const f = near.faq ? measureFaq() : null;
      const b = near.build ? measureBuild() : null;
      // …then writes
      applyRange(r);
      applyFaq(f);
      applyBuild(b);
    }
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        const raf = requestAnimationFrame(() => {
          tick();
          ticking = false;
        });
        rafs.push(raf);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
    cleanups.push(() => window.removeEventListener("resize", onScroll));
    tick();

    // ==========================================================================
    // REVEAL — shared IntersectionObserver. Elements already in the viewport
    // at mount (the whole hero, mainly) get `.in` synchronously rather than
    // waiting on the observer's first callback, which can arrive several
    // seconds late while the main thread is busy decoding the background
    // video and running the particle-field rAF loop — see RevealObserver.tsx
    // for the full explanation (same fix, mirrored here since the home page
    // rides its own observer instance alongside the rest of this effect).
    // ==========================================================================
    const riseEls = document.querySelectorAll<HTMLElement>(".rise");
    const riseVh = window.innerHeight;
    [...riseEls]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < riseVh && r.bottom > 0;
      })
      .forEach((el) => el.classList.add("in")); // all reads, then all writes
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.16 }
    );
    riseEls.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // ==========================================================================
    // CONSOLE EASTER EGG
    // ==========================================================================
    console.log("%cShreyansh Kumar Singh — THE RANGE", "color:#FFC000;font-size:20px;font-weight:700;font-family:monospace;");
    console.log(
      "%cNine repositories. One stack. If you're reading this, you already know how to find things that aren't obvious.",
      "color:#90e0ef;font-size:12px;font-family:monospace;"
    );
    console.log(
      "%cshreyanshkumarsingh208@gmail.com — press the backtick key to open a terminal, or ⌘K to jump anywhere.",
      "color:#969696;font-size:11px;font-family:monospace;"
    );

    // the "Last shipped" ticker is rendered on the server (lib/github.ts)

    // ==========================================================================
    // "CURRENTLY BUILDING" STATUS CHIP
    // ==========================================================================
    (function buildingDay() {
      const dayEl = document.getElementById("buildDay");
      if (!dayEl) return;
      const since = new Date("2026-08-18T00:00:00");
      const day = Math.max(1, Math.floor((Date.now() - since.getTime()) / 86400000) + 1);
      dayEl.textContent = ` · day ${day}`;
    })();

    // ==========================================================================
    // OVERLAYS — shared open/close for the palette, terminal, project modal,
    // sim modal and contact modal. Only one open at a time.
    // ==========================================================================
    let lastFocusedEl: HTMLElement | null = null;
    function closeAllOverlays() {
      document.querySelectorAll(".ov.on").forEach((ov) => ov.classList.remove("on"));
      document.body.classList.remove("modal-open");
      const simFrame = document.getElementById("simFrame") as HTMLIFrameElement | null;
      if (simFrame) simFrame.src = "about:blank"; // stop the running rAF loop, don't just hide it
      if (lastFocusedEl) {
        lastFocusedEl.focus();
        lastFocusedEl = null;
      }
    }
    function openOverlay(el: Element | null) {
      if (!el) return;
      closeAllOverlays();
      lastFocusedEl = document.activeElement as HTMLElement;
      el.classList.add("on");
      document.body.classList.add("modal-open");
    }
    document.querySelectorAll(".ov").forEach((ov) => {
      const onBackdrop = (e: Event) => {
        if (e.target === ov) closeAllOverlays();
      };
      ov.addEventListener("click", onBackdrop);
      cleanups.push(() => ov.removeEventListener("click", onBackdrop));
      ov.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", closeAllOverlays);
        cleanups.push(() => btn.removeEventListener("click", closeAllOverlays));
      });
    });

    function showToast(msg: string) {
      const t = document.getElementById("toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("on");
      window.clearTimeout((showToast as unknown as { _t?: number })._t);
      (showToast as unknown as { _t?: number })._t = window.setTimeout(() => t.classList.remove("on"), 2200);
    }
    function copyEmail() {
      const email = "shreyanshkumarsingh208@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(email)
          .then(() => showToast("Email copied — " + email))
          .catch(() => showToast(email));
      } else {
        showToast(email);
      }
    }

    // ==========================================================================
    // COMMAND PALETTE
    // ==========================================================================
    const SECTIONS_NAV = [
      { label: "Range", href: "#range" },
      { label: "Research", href: "#research" },
      { label: "Method", href: "#method" },
      { label: "Philosophy", href: "#philosophy" },
      { label: "FAQ", href: "#faq" },
      { label: "Telemetry", href: "#telemetry" },
      { label: "Contact", href: "#contact" },
    ];
    function scrollToHash(hash: string) {
      const el = document.querySelector<HTMLElement>(hash);
      if (el) scrollToElement(el);
    }
    const ALL_COMMANDS = [
      ...SECTIONS_NAV.map((s) => ({ group: "Jump to", label: s.label, key: "", action: () => scrollToHash(s.href) })),
      {
        group: "Jump to",
        label: "Experience",
        key: "↗",
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- see "What I'm building right now" below
        action: () => (window.location.href = "/experience"),
      },
      ...PROJECTS.map((p) => ({
        group: "Projects",
        label: p.name,
        key: p.domain,
        action: () => openProjectModal(p.n),
      })),
      {
        group: "Run live",
        label: "AEON — weapons-consequence sim",
        key: "▶",
        action: () => openSim("aeon", "AEON — weapons-consequence simulator"),
      },
      {
        group: "Run live",
        label: "COSMOS — orbital mechanics",
        key: "▶",
        action: () => openSim("cosmos", "COSMOS — orbital-mechanics simulator"),
      },
      {
        group: "Run live",
        label: "GENESIS — a pocket universe",
        key: "▶",
        action: () => openSim("genesis", "GENESIS — a pocket universe"),
      },
      {
        group: "Run live",
        label: "GENLIFE — artificial life",
        key: "▶",
        action: () => openSim("genlife", "GENLIFE — artificial-life simulator"),
      },
      {
        group: "Run live",
        label: "REVUELTO — scroll to assemble",
        key: "↗",
        action: () => window.open("/sims/revuelto.html", "_blank", "noopener"),
      },
      {
        group: "Run live",
        label: "SURVIVE — a blast-physics minigame",
        key: "▶",
        action: () => startFieldGame(),
      },
      {
        group: "Actions",
        label: "What I'm building right now",
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full navigation + hash scroll, outside a component's render/handler scope where useRouter is available
        action: () => (window.location.href = "/experience#case-6"),
        key: "↗",
      },
      {
        group: "Actions",
        label: "Let's talk",
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- see above
        action: () => (window.location.href = "/contact"),
        key: "↗",
      },
      { group: "Actions", label: "Copy email", key: "", action: copyEmail },
      {
        group: "Actions",
        label: "Open GitHub profile",
        key: "↗",
        action: () => window.open(GITHUB_URL, "_blank", "noopener"),
      },
      { group: "Actions", label: "Open terminal", key: "`", action: () => openTerminal() },
      { group: "Actions", label: "Save résumé as PDF", key: "", action: () => window.print() },
    ];
    const cmdkOv = document.getElementById("cmdkOv");
    const cmdkInput = document.getElementById("cmdkInput") as HTMLInputElement | null;
    const cmdkListEl = document.getElementById("cmdkList");
    let cmdkFiltered: typeof ALL_COMMANDS = [];
    let cmdkActive = 0;
    function renderCmdk(query: string) {
      if (!cmdkListEl) return;
      const q = (query || "").toLowerCase().trim();
      cmdkFiltered = !q
        ? ALL_COMMANDS
        : ALL_COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
      cmdkActive = 0;
      if (!cmdkFiltered.length) {
        cmdkListEl.innerHTML = '<div class="cmdk-empty">No matches. Try a project name or "email".</div>';
        return;
      }
      let html = "",
        prevGroup: string | null = null;
      cmdkFiltered.forEach((c, i) => {
        if (c.group !== prevGroup) {
          html += `<div class="cmdk-group-label">${c.group}</div>`;
          prevGroup = c.group;
        }
        html += `<div class="cmdk-item${i === 0 ? " active" : ""}" data-idx="${i}">${c.label}${
          c.key ? `<span class="k">${c.key}</span>` : ""
        }</div>`;
      });
      cmdkListEl.innerHTML = html;
    }
    function setCmdkActive(next: number) {
      if (!cmdkListEl) return;
      const items = cmdkListEl.querySelectorAll(".cmdk-item");
      if (!items.length) return;
      cmdkActive = (next + items.length) % items.length;
      items.forEach((it) => it.classList.remove("active"));
      items[cmdkActive].classList.add("active");
      items[cmdkActive].scrollIntoView({ block: "nearest" });
    }
    function runCmdkActive() {
      const c = cmdkFiltered[cmdkActive];
      if (!c) return;
      closeAllOverlays();
      c.action();
    }
    function openCmdk() {
      openOverlay(cmdkOv);
      if (cmdkInput) cmdkInput.value = "";
      renderCmdk("");
      const t = window.setTimeout(() => cmdkInput?.focus(), 40);
      timers.push(t);
    }
    const cmdkTrigger = document.getElementById("cmdkTrigger");
    cmdkTrigger?.addEventListener("click", openCmdk);
    cleanups.push(() => cmdkTrigger?.removeEventListener("click", openCmdk));
    const onCmdkInput = () => renderCmdk(cmdkInput?.value || "");
    cmdkInput?.addEventListener("input", onCmdkInput);
    cleanups.push(() => cmdkInput?.removeEventListener("input", onCmdkInput));
    const onCmdkKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCmdkActive(cmdkActive + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCmdkActive(cmdkActive - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        runCmdkActive();
      }
    };
    cmdkInput?.addEventListener("keydown", onCmdkKeydown);
    cleanups.push(() => cmdkInput?.removeEventListener("keydown", onCmdkKeydown));
    const onCmdkListClick = (e: Event) => {
      const item = (e.target as HTMLElement).closest(".cmdk-item") as HTMLElement | null;
      if (!item) return;
      cmdkActive = +(item.dataset.idx || 0);
      runCmdkActive();
    };
    cmdkListEl?.addEventListener("click", onCmdkListClick);
    cleanups.push(() => cmdkListEl?.removeEventListener("click", onCmdkListClick));

    // ==========================================================================
    // MOBILE NAV — the hamburger's overlay, standing in for the top bar's
    // inline nav below 980px. A tapped link closes the overlay first, so the
    // section jump / route change never runs against a scroll-locked <body>
    // (and body.modal-open can't outlive this page on a client-side nav).
    // ==========================================================================
    const navOv = document.getElementById("navOv");
    const navToggle = document.getElementById("navToggle");
    const openNav = () => {
      openOverlay(navOv);
      const t = window.setTimeout(() => navOv?.querySelector<HTMLElement>("a")?.focus(), 40);
      timers.push(t);
    };
    navToggle?.addEventListener("click", openNav);
    cleanups.push(() => navToggle?.removeEventListener("click", openNav));
    const onNavLinkClick = (e: Event) => {
      if ((e.target as HTMLElement).closest("a")) closeAllOverlays();
    };
    navOv?.addEventListener("click", onNavLinkClick);
    cleanups.push(() => navOv?.removeEventListener("click", onNavLinkClick));
    // the hamburger disappears at 980px — don't leave its menu open behind it
    const wideMq = window.matchMedia("(min-width: 980px)");
    const onWide = () => {
      if (wideMq.matches && navOv?.classList.contains("on")) closeAllOverlays();
    };
    wideMq.addEventListener("change", onWide);
    cleanups.push(() => wideMq.removeEventListener("change", onWide));

    // ==========================================================================
    // TERMINAL
    // ==========================================================================
    const termOv = document.getElementById("termOv");
    const termLog = document.getElementById("termLog");
    const termInput = document.getElementById("termInput") as HTMLInputElement | null;
    const TERM_HELP = "Commands: help, whoami, ls range, ls sims, run &lt;sim&gt;, play, cat philosophy.md, contact, blast &lt;kg&gt; &lt;m&gt;, sudo hire-me, clear, exit";
    const EVOLUTION_SIMS = ["aeon", "cosmos", "genesis", "genlife"];
    const SIMS: Record<string, string> = {
      aeon: "AEON — weapons-consequence simulator",
      cosmos: "COSMOS — orbital-mechanics simulator",
      genesis: "GENESIS — a pocket universe",
      genlife: "GENLIFE — artificial-life simulator",
      revuelto: "REVUELTO — scroll-to-assemble teardown",
    };
    function termPrint(cmd: string, out: string) {
      if (!termLog) return;
      const cmdEl = document.createElement("div");
      cmdEl.className = "cmd";
      cmdEl.textContent = cmd;
      const outEl = document.createElement("div");
      outEl.className = "out";
      outEl.innerHTML = out;
      termLog.appendChild(cmdEl);
      termLog.appendChild(outEl);
      termLog.scrollTop = termLog.scrollHeight;
    }
    function runTermCommand(raw: string) {
      const cmd = raw.trim();
      if (!cmd) return;
      const lc = cmd.toLowerCase();
      if (lc === "help") termPrint(cmd, TERM_HELP);
      else if (lc === "whoami") termPrint(cmd, "shreyansh-kumar-singh — engineer. nine repositories, one stack.");
      else if (lc === "ls" || lc === "ls range" || lc === "ls projects")
        termPrint(cmd, PROJECTS.map((p) => p.n + "  " + p.name).join("\n"));
      else if (lc === "ls sims")
        termPrint(
          cmd,
          Object.entries(SIMS)
            .map(([k, v]) => `${k}.html`.padEnd(15) + "— " + v.split("— ")[1])
            .join("\n") + "\n\nrun &lt;name&gt; to launch one live, e.g. run genesis"
        );
      else if (lc === "ls the_evolution" || lc === "ls evolution")
        termPrint(
          cmd,
          EVOLUTION_SIMS.map((k) => `${k}.html`.padEnd(15) + "— " + SIMS[k].split("— ")[1]).join("\n") +
            "\n\nrun &lt;name&gt; to launch one live, e.g. run genesis"
        );
      else if (lc.startsWith("run ")) {
        const name = lc.slice(4).trim();
        if (name === "revuelto") {
          termPrint(cmd, "revuelto is scroll-driven — opening in its own tab…");
          window.open("/sims/revuelto.html", "_blank", "noopener");
        } else if (SIMS[name]) openSim(name, SIMS[name]);
        else termPrint(cmd, `no such simulator: ${name}\ntry: ls sims`);
      } else if (lc === "cat philosophy.md") termPrint(cmd, BELIEFS.map((b) => b.no + " — " + b.title).join("\n"));
      else if (lc === "contact" || lc === "cat contact")
        termPrint(cmd, "shreyanshkumarsingh208@gmail.com — or run 'sudo hire-me'");
      else if (lc === "sudo hire-me" || lc === "sudo hire me") {
        termPrint(cmd, "permission granted. opening mail composer…");
        window.location.href = "mailto:shreyanshkumarsingh208@gmail.com";
      } else if (lc.startsWith("blast ")) {
        const [kg, meters] = cmd
          .split(/\s+/)
          .slice(1)
          .map(Number);
        if (!kg || !meters || kg <= 0 || meters <= 0) {
          termPrint(cmd, "usage: blast &lt;kg TNT-equivalent&gt; &lt;distance-m&gt;\ne.g. blast 50 20");
        } else {
          const Z = meters / Math.cbrt(kg);
          const kPa = Math.max(0, 1772 / Z ** 3 - 114 / Z ** 2 + 108 / Z);
          const psi = kPa * 0.145038;
          termPrint(
            cmd,
            `scaled distance Z = ${Z.toFixed(2)} m / kg^(1/3)\npeak overpressure ≈ ${kPa.toFixed(1)} kPa (${psi.toFixed(
              2
            )} psi)\nfree-air Kingery–Bulmash curve fit, open civil-defense literature — illustrative only, not for real-world safety design.`
          );
        }
      } else if (lc === "play") {
        termPrint(cmd, "launching SURVIVE — move your cursor, don't stand where the shockwave is…");
        closeAllOverlays();
        startFieldGame();
      } else if (lc === "clear") {
        if (termLog) termLog.innerHTML = "";
        return;
      } else if (lc === "exit") {
        closeAllOverlays();
        return;
      } else termPrint(cmd, "command not found: " + cmd + " — try 'help'");
    }
    function openTerminal() {
      openOverlay(termOv);
      const t = window.setTimeout(() => termInput?.focus(), 40);
      timers.push(t);
    }
    const onTermKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && termInput) {
        runTermCommand(termInput.value);
        termInput.value = "";
      }
    };
    termInput?.addEventListener("keydown", onTermKeydown);
    cleanups.push(() => termInput?.removeEventListener("keydown", onTermKeydown));

    // ==========================================================================
    // PROJECT CASE-STUDY MODAL
    // ==========================================================================
    const caseByProject = Object.fromEntries(RESEARCH_CASES.map((c) => [c.project, c]));
    const pmOv = document.getElementById("pmOv");
    function openProjectModal(no: string) {
      const p = PROJECTS.find((x) => x.n === no);
      if (!p) return;
      const c = caseByProject[p.name];
      const domainEl = document.getElementById("pmDomain");
      if (domainEl) {
        domainEl.textContent = `${p.domain} · ${p.ref}`;
        domainEl.style.color = p.domColor === "rosso" ? "var(--rosso-text)" : "var(--gold)";
      }
      const titleEl = document.getElementById("pmTitle");
      if (titleEl) titleEl.textContent = p.name;
      const lineEl = document.getElementById("pmLine");
      if (lineEl) lineEl.textContent = p.line;
      const findingsWrap = document.getElementById("pmFindingsWrap");
      if (findingsWrap) findingsWrap.style.display = c ? "" : "none";
      const findingsEl = document.getElementById("pmFindings");
      if (findingsEl) {
        findingsEl.innerHTML = c
          ? c.notes.map((n) => `<div class="pm-finding"><b>${n.title}</b><span>${n.finding}</span></div>`).join("")
          : "";
      }
      const stackEl = document.getElementById("pmStack");
      if (stackEl) stackEl.innerHTML = p.stack.map((s) => `<span>${s}</span>`).join("");
      const pmCase = document.getElementById("pmCase") as HTMLAnchorElement | null;
      if (pmCase) pmCase.href = `/projects/${p.slug}`;
      const pmRepo = document.getElementById("pmRepo") as HTMLAnchorElement | null;
      if (pmRepo) {
        pmRepo.style.display = p.url ? "" : "none";
        if (p.url) pmRepo.href = p.url;
      }
      openOverlay(pmOv);
    }
    const rangeClickTarget = document.getElementById("range");
    const onRangeClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("[data-open-project]") as HTMLElement | null;
      if (btn) openProjectModal(btn.dataset.openProject!);
      const simBtn = target.closest("[data-open-sim]") as HTMLElement | null;
      if (simBtn) openSim(simBtn.dataset.openSim!, simBtn.dataset.simLabel || "");
      const tabBtn = target.closest("[data-open-tab]") as HTMLElement | null;
      if (tabBtn) window.open(tabBtn.dataset.openTab!, "_blank", "noopener");
    };
    rangeClickTarget?.addEventListener("click", onRangeClick);
    cleanups.push(() => rangeClickTarget?.removeEventListener("click", onRangeClick));

    // ==========================================================================
    // LIVE SIMULATOR MODAL
    // ==========================================================================
    const simOv = document.getElementById("simOv");
    function openSim(name: string, label: string) {
      const src = `/sims/${name}.html`;
      openOverlay(simOv);
      const simTitle = document.getElementById("simTitle");
      if (simTitle) simTitle.textContent = label || name;
      const simDomain = document.getElementById("simDomain");
      if (simDomain) simDomain.textContent = "THE_EVOLUTION · running live in this tab";
      const simFrame = document.getElementById("simFrame") as HTMLIFrameElement | null;
      if (simFrame) simFrame.src = src;
      const simRepo = document.getElementById("simRepo") as HTMLAnchorElement | null;
      if (simRepo) simRepo.href = src;
    }

    // ==========================================================================
    // CONTACT MODAL
    // ==========================================================================
    const cmOv = document.getElementById("cmOv");
    const contactTrigger = document.getElementById("contactTrigger");
    const onContactTrigger = () => openOverlay(cmOv);
    contactTrigger?.addEventListener("click", onContactTrigger);
    cleanups.push(() => contactTrigger?.removeEventListener("click", onContactTrigger));
    const cmCopy = document.getElementById("cmCopy");
    cmCopy?.addEventListener("click", copyEmail);
    cleanups.push(() => cmCopy?.removeEventListener("click", copyEmail));
    const printTrigger = document.getElementById("printTrigger");
    const onPrint = () => window.print();
    printTrigger?.addEventListener("click", onPrint);
    cleanups.push(() => printTrigger?.removeEventListener("click", onPrint));

    // ==========================================================================
    // GLOBAL SHORTCUTS
    // ==========================================================================
    const onKeydown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        cmdkOv?.classList.contains("on") ? closeAllOverlays() : openCmdk();
        return;
      }
      if (e.key === "Escape") {
        closeAllOverlays();
        return;
      }
      const activeTag = document.activeElement?.tagName;
      const typingTag = activeTag === "INPUT" || activeTag === "TEXTAREA";
      if (e.key === "`" && !typingTag && !document.querySelector(".ov.on")) {
        e.preventDefault();
        openTerminal();
      }
    };
    document.addEventListener("keydown", onKeydown);
    cleanups.push(() => document.removeEventListener("keydown", onKeydown));

    // ==========================================================================
    // RESEARCH FILTERS
    // ==========================================================================
    const researchFilters = document.getElementById("researchFilters");
    const onFiltersClick = (e: Event) => {
      const pill = (e.target as HTMLElement).closest(".rf-pill") as HTMLElement | null;
      if (!pill) return;
      document.querySelectorAll(".rf-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const domain = pill.dataset.domain;
      document.querySelectorAll<HTMLElement>(".case").forEach((caseEl) => {
        caseEl.classList.toggle("filtered-out", domain !== "ALL" && caseEl.dataset.domain !== domain);
      });
    };
    researchFilters?.addEventListener("click", onFiltersClick);
    cleanups.push(() => researchFilters?.removeEventListener("click", onFiltersClick));

    // ==========================================================================
    // FAQ — independent per-item switches
    // ==========================================================================
    const faqCleanups: Array<() => void> = [];

    // Pin #faq's blurred mesh to a pixel box measured at rest (see the #faq
    // .carrd-mesh rule in globals.css) so answers opening doesn't resize it.
    const faqSection = document.getElementById("faq");
    const faqMesh = faqSection?.querySelector<HTMLElement>(".carrd-mesh");
    let meshW = -1;
    function pinFaqMesh(force = false) {
      if (!faqSection || !faqMesh) return;
      if (!force && window.innerWidth === meshW) return; // mobile URL-bar resizes
      meshW = window.innerWidth;
      const h = faqSection.offsetHeight;
      faqMesh.style.setProperty("--mesh-top", `${Math.round(h * -0.12)}px`);
      faqMesh.style.setProperty("--mesh-h", `${Math.round(h * 1.24)}px`);
    }
    pinFaqMesh(true);
    const onMeshResize = () => pinFaqMesh();
    const onMeshLoad = () => pinFaqMesh(true); // late fonts/images can shift height
    window.addEventListener("resize", onMeshResize);
    window.addEventListener("load", onMeshLoad);
    cleanups.push(() => window.removeEventListener("resize", onMeshResize));
    cleanups.push(() => window.removeEventListener("load", onMeshLoad));

    // Open/close: animate a measured pixel height with WAAPI (compositor-
    // friendly timing, interruptible mid-flight) and fade/slide the answer
    // text in, instead of revealing it behind a hard clipping edge.
    const OPEN_EASE = "cubic-bezier(.22,1,.36,1)"; // ease-out-quint: glides to rest
    const CLOSE_EASE = "cubic-bezier(.55,0,.35,1)"; // gentle in-out: no snap shut
    document.querySelectorAll<HTMLElement>(".faq-item").forEach((item) => {
      const btn = item.querySelector<HTMLButtonElement>(".faq-q");
      const wrap = item.querySelector<HTMLElement>(".faq-a-wrap");
      const inner = item.querySelector<HTMLElement>(".faq-a-inner");
      if (!btn || !wrap || !inner) return;
      let heightAnim: Animation | null = null;
      let fadeAnim: Animation | null = null;
      const onFaqClick = () => {
        // read the live height first, so reversing mid-animation starts from
        // exactly where the panel is on screen
        const from = wrap.getBoundingClientRect().height;
        heightAnim?.cancel();
        fadeAnim?.cancel();
        const open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        if (reduceMotion) return;

        const to = open ? wrap.scrollHeight : 0;
        const dist = Math.abs(to - from);
        if (dist < 1) return;
        // longer answers get a little more time, so speed feels constant
        const duration = Math.round(Math.min(560, (open ? 300 : 240) + dist * 0.55));
        heightAnim = wrap.animate([{ height: `${from}px` }, { height: `${to}px` }], {
          duration,
          easing: open ? OPEN_EASE : CLOSE_EASE,
        });
        fadeAnim = inner.animate(
          open
            ? [
                { opacity: 0, transform: "translateY(-6px)" },
                { opacity: 1, transform: "none" },
              ]
            : [
                { opacity: 1, transform: "none" },
                { opacity: 0, transform: "translateY(-4px)" },
              ],
          open
            ? { duration: duration + 60, delay: 50, easing: OPEN_EASE, fill: "backwards" }
            : { duration: Math.round(duration * 0.6), easing: "ease-out", fill: "forwards" },
        );
        heightAnim.onfinish = () => {
          heightAnim = null;
          if (!open) {
            fadeAnim?.cancel();
            fadeAnim = null;
          }
        };
      };
      btn.addEventListener("click", onFaqClick);
      faqCleanups.push(() => btn.removeEventListener("click", onFaqClick));
    });
    cleanups.push(() => faqCleanups.forEach((fn) => fn()));

    // ==========================================================================
    // THE FIELD — particle physics + SURVIVE minigame
    // ==========================================================================
    class ParticleField {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      o: {
        count: number;
        color: string;
        speed: number;
        r: [number, number];
        cursorRadius: number;
        cursorForce: number;
        damping: number;
        link: number;
        linkColor: string;
      };
      dpr: number;
      particles: { x: number; y: number; vx: number; vy: number; r: number }[];
      mouse: { x: number; y: number; active: boolean };
      w = 0;
      h = 0;
      /** canvas box cached at resize — reading getBoundingClientRect() every
       *  frame forced a layout whenever a scroll handler had written styles */
      box = { left: 0, top: 0, width: 0, height: 0 };
      private fixed: boolean;
      private resizeHandler: () => void;

      /** viewport-relative box; position:fixed canvases don't move on scroll */
      rect() {
        const dy = this.fixed ? 0 : window.scrollY;
        return {
          left: this.box.left,
          top: this.box.top - dy,
          width: this.box.width,
          height: this.box.height,
        };
      }

      constructor(canvas: HTMLCanvasElement, opts: Partial<ParticleField["o"]>, fixed = false) {
        this.fixed = fixed;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.o = Object.assign(
          {
            count: 80,
            color: "255,200,80",
            speed: 0.3,
            r: [0.6, 1.8] as [number, number],
            cursorRadius: 150,
            cursorForce: 0.9,
            damping: 0.985,
            link: 0,
            linkColor: "255,192,0",
          },
          opts
        );
        // fill cost grows with the square of DPR; above 1.5 the extra
        // sharpness on soft particles isn't visible
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        this.particles = [];
        this.mouse = { x: -9999, y: -9999, active: false };
        this.resizeHandler = () => this._resize();
        this._resize();
        window.addEventListener("resize", this.resizeHandler);
      }
      destroy() {
        window.removeEventListener("resize", this.resizeHandler);
      }
      _resize() {
        const r = this.canvas.getBoundingClientRect();
        const dy = this.fixed ? 0 : window.scrollY;
        this.box = { left: r.left, top: r.top + dy, width: r.width, height: r.height };
        this.w = this.canvas.width = Math.max(1, Math.floor(r.width * this.dpr));
        this.h = this.canvas.height = Math.max(1, Math.floor(r.height * this.dpr));
        if (!this.particles.length) this._seed();
      }
      _seed() {
        const { count, speed, r } = this.o;
        this.particles = Array.from({ length: count }, () => ({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * speed * this.dpr,
          vy: (Math.random() - 0.5) * speed * this.dpr,
          r: (r[0] + Math.random() * (r[1] - r[0])) * this.dpr,
        }));
      }
      setCursor(clientX: number | null, clientY?: number | null) {
        if (clientX == null) {
          this.mouse.active = false;
          return;
        }
        const rect = this.rect();
        this.mouse.x = (clientX - rect.left) * this.dpr;
        this.mouse.y = (clientY! - rect.top) * this.dpr;
        this.mouse.active =
          clientX >= rect.left && clientX <= rect.left + rect.width && clientY! >= rect.top && clientY! <= rect.top + rect.height;
      }
      step() {
        const { ctx, w, h, o, particles, mouse, dpr } = this;
        ctx.clearRect(0, 0, w, h);
        const cr = o.cursorRadius * dpr;
        for (const p of particles) {
          if (mouse.active) {
            const dx = p.x - mouse.x,
              dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < cr) {
              const f = o.cursorForce * (1 - dist / cr);
              p.vx += (dx / dist) * f;
              p.vy += (dy / dist) * f;
            }
          }
          p.vx *= o.damping;
          p.vy *= o.damping;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
        if (o.link) {
          // one path per opacity band instead of one stroke() per line (up
          // to ~4,000 a frame) — four bands are indistinguishable from the
          // continuous fade at 0–16% alpha
          const maxD = o.link * dpr,
            maxD2 = maxD * maxD;
          const BANDS = 4;
          const paths = Array.from({ length: BANDS }, () => new Path2D());
          for (let i = 0; i < particles.length; i++)
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x,
                dy = particles[i].y - particles[j].y;
              const d2 = dx * dx + dy * dy;
              if (d2 < maxD2) {
                const band = Math.min(BANDS - 1, Math.floor((Math.sqrt(d2) / maxD) * BANDS));
                paths[band].moveTo(particles[i].x, particles[i].y);
                paths[band].lineTo(particles[j].x, particles[j].y);
              }
            }
          ctx.lineWidth = dpr;
          paths.forEach((path, band) => {
            ctx.strokeStyle = `rgba(${o.linkColor},${((1 - (band + 0.5) / BANDS) * 0.16).toFixed(3)})`;
            ctx.stroke(path);
          });
        }
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = `rgb(${o.color})`;
        ctx.beginPath();
        for (const p of particles) {
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    let startFieldGame = () => {};
    const heroCanvas = document.getElementById("fieldHero") as HTMLCanvasElement | null;
    const bgCanvas = document.getElementById("fieldBg") as HTMLCanvasElement | null;
    const hint = document.getElementById("fieldHint");
    let heroField: ParticleField | null = null;
    let bgField: ParticleField | null = null;
    let fieldRaf = 0;

    if (heroCanvas && bgCanvas) {
      // phones get a lighter field — same look at a fraction of the cost
      const small = window.innerWidth < 768;
      heroField = new ParticleField(heroCanvas, {
        count: small ? 50 : 90,
        color: "255,205,90",
        speed: 0.32,
        r: [0.7, 2],
        cursorRadius: 160,
        cursorForce: 1.15,
        link: small ? 90 : 105,
        linkColor: "255,192,0",
      });
      bgField = new ParticleField(
        bgCanvas,
        {
          count: small ? 26 : 42,
          color: "144,224,239",
          speed: 0.14,
          r: [0.5, 1.3],
          cursorRadius: 120,
          cursorForce: 0.4,
        },
        true
      );

      // the hero field only animates while the hero is on screen
      let heroVisible = true;
      const heroIO = new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting));
      heroIO.observe(heroCanvas);
      cleanups.push(() => heroIO.disconnect());
      // the hero canvas's cached page position shifts if content above it
      // reflows (fonts, the loader releasing) — re-measure once things settle
      const remeasure = () => {
        heroField?._resize();
        bgField?._resize();
      };
      window.addEventListener("load", remeasure);
      cleanups.push(() => window.removeEventListener("load", remeasure));

      let cx: number | null = null,
        cy: number | null = null;
      const onPointer = (e: MouseEvent | TouchEvent) => {
        const t = "touches" in e ? e.touches[0] : e;
        cx = t.clientX;
        cy = t.clientY;
      };
      const onMouseLeave = () => {
        cx = null;
        cy = null;
      };
      window.addEventListener("mousemove", onPointer, { passive: true });
      window.addEventListener("touchmove", onPointer, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave);
      cleanups.push(() => window.removeEventListener("mousemove", onPointer));
      cleanups.push(() => window.removeEventListener("touchmove", onPointer));
      cleanups.push(() => document.removeEventListener("mouseleave", onMouseLeave));

      if (reduceMotion) {
        heroField.setCursor(null);
        bgField.setCursor(null);
        heroField.step();
        bgField.step();
      } else {
        // ---- SURVIVE minigame ----
        let gameActive = false,
          gameOver = false,
          blasts: { x: number; y: number; born: number; maxR: number }[] = [],
          startTime = 0,
          nextSpawn = 0,
          spawnEvery = 2200,
          kgLevel = 8;
        const fieldHud = document.getElementById("fieldHud");
        const scoreEl = document.getElementById("fieldScore");
        const overEl = document.getElementById("fieldOver");
        const overStat = document.getElementById("fieldOverStat");
        let hintTimer = window.setTimeout(() => hint?.classList.add("show"), 3200);
        timers.push(hintTimer);
        const onHintClick = () => startFieldGame();
        hint?.addEventListener("click", onHintClick);
        cleanups.push(() => hint?.removeEventListener("click", onHintClick));

        startFieldGame = function () {
          const hero = document.getElementById("top");
          if (hero) scrollToElement(hero);
          gameActive = true;
          gameOver = false;
          blasts = [];
          startTime = performance.now();
          nextSpawn = startTime + 1000;
          spawnEvery = 2200;
          kgLevel = 8;
          fieldHud?.classList.add("on");
          overEl?.classList.remove("on");
          hint?.classList.remove("show");
          clearTimeout(hintTimer);
        };
        function endGame() {
          gameActive = false;
          gameOver = true;
          const survived = ((performance.now() - startTime) / 1000).toFixed(1);
          if (overStat)
            overStat.textContent = `Survived ${survived}s — ${blasts.length} shockwave${blasts.length === 1 ? "" : "s"} launched`;
          fieldHud?.classList.remove("on");
          overEl?.classList.add("on");
        }
        const fieldRetry = document.getElementById("fieldRetry");
        const onRetry = () => startFieldGame();
        fieldRetry?.addEventListener("click", onRetry);
        cleanups.push(() => fieldRetry?.removeEventListener("click", onRetry));
        const fieldQuit = document.getElementById("fieldQuit");
        const onQuit = () => {
          overEl?.classList.remove("on");
          gameOver = false;
          hintTimer = window.setTimeout(() => hint?.classList.add("show"), 1200);
          timers.push(hintTimer);
        };
        fieldQuit?.addEventListener("click", onQuit);
        cleanups.push(() => fieldQuit?.removeEventListener("click", onQuit));
        const onGameEscape = (e: KeyboardEvent) => {
          if (e.key === "Escape" && (gameActive || gameOver)) {
            gameActive = false;
            gameOver = false;
            fieldHud?.classList.remove("on");
            overEl?.classList.remove("on");
          }
        };
        document.addEventListener("keydown", onGameEscape);
        cleanups.push(() => document.removeEventListener("keydown", onGameEscape));

        function drawGame(now: number) {
          if (!gameActive && !gameOver) return;
          const rect = heroField!.rect(),
            dpr = heroField!.dpr;
          if (gameActive) {
            if (scoreEl) scoreEl.textContent = ((now - startTime) / 1000).toFixed(1) + "s";
            if (now > nextSpawn) {
              blasts.push({
                x: 40 + Math.random() * (rect.width - 80),
                y: rect.height * 0.15 + Math.random() * rect.height * 0.6,
                born: now,
                maxR: 55 + kgLevel * 3.2,
              });
              nextSpawn = now + spawnEvery;
              spawnEvery = Math.max(950, spawnEvery - 55);
              kgLevel = Math.min(58, kgLevel + 2);
            }
          }
          const ctx = heroField!.ctx;
          blasts = blasts.filter((b) => now - b.born < 2600);
          for (const b of blasts) {
            const age = (now - b.born) / 1000;
            const grow = Math.min(1, Math.sqrt(age / 1.3));
            const R = b.maxR * grow;
            const fade = Math.max(0, 1 - Math.max(0, age - 1.3) / 1.3);
            ([
              [R * 0.32, "230,45,35"],
              [R * 0.62, "255,140,35"],
              [R, "255,220,95"],
            ] as [number, string][]).forEach(([rad, col]) => {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${col},${fade * 0.6})`;
              ctx.lineWidth = 2 * dpr;
              ctx.arc(b.x * dpr, b.y * dpr, rad * dpr, 0, Math.PI * 2);
              ctx.stroke();
            });
          }
          if (gameActive && cx != null) {
            const px = cx - rect.left,
              py = cy! - rect.top;
            for (const b of blasts) {
              const age = (now - b.born) / 1000;
              if (age > 1.75) continue;
              const grow = Math.min(1, Math.sqrt(age / 1.3));
              const lethalR = b.maxR * grow * 0.32;
              if (Math.hypot(px - b.x, py - b.y) < lethalR) {
                endGame();
                break;
              }
            }
          }
        }

        function loop(now: number) {
          if (heroVisible || gameActive || gameOver) {
            heroField!.setCursor(cx, cy);
            heroField!.step();
            drawGame(now);
          }
          bgField!.setCursor(cx, cy);
          bgField!.step();
          fieldRaf = requestAnimationFrame(loop);
        }
        // While the intro loader covers the screen the fields are invisible,
        // so don't spend the busiest seconds of page load animating them —
        // start when the loader releases <body>.
        const startLoop = () => {
          if (!fieldRaf) fieldRaf = requestAnimationFrame(loop);
        };
        if (document.body.classList.contains("loading")) {
          const bodyObs = new MutationObserver(() => {
            if (!document.body.classList.contains("loading")) {
              bodyObs.disconnect();
              startLoop();
            }
          });
          bodyObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
          cleanups.push(() => bodyObs.disconnect());
        } else {
          startLoop();
        }
      }
    }

    cleanups.push(() => {
      if (fieldRaf) cancelAnimationFrame(fieldRaf);
      heroField?.destroy();
      bgField?.destroy();
    });

    return () => {
      cleanups.forEach((fn) => fn());
      timers.forEach((t) => clearTimeout(t));
      rafs.forEach((r) => cancelAnimationFrame(r));
    };
  }, []);

  return null;
}
