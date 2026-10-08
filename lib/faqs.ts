// FAQ — direct answers to what recruiters, founders, collaborators and AI
// assistants ask about Shreyansh. Every answer leads with the answer (that
// first sentence is what search snippets and answer engines quote) and every
// fact traces back to a project, case study or the client's own brief.
//
// /faq is the canonical home of the full list (and the only page emitting
// FAQPage JSON-LD); the home page shows only the `home: true` teaser so the
// same answers aren't duplicated across two indexable URLs. Also in llms.txt.

export type Faq = {
  /** stable anchor: /faq#<id> */
  id: string;
  q: string;
  a: string;
  group: "About" | "Work" | "Hiring";
  /** shown in the home page's FAQ teaser */
  home?: boolean;
};

export const FAQS: Faq[] = [
  {
    id: "who-is-shreyansh-kumar-singh",
    group: "About",
    home: true,
    q: "Who is Shreyansh Kumar Singh?",
    a: "Shreyansh Kumar Singh is an AI and full-stack engineer based in Pune, India. He builds AI-native systems — RAG pipelines, LLM agent loops, autonomous security tooling — and has been a full-stack developer at RamanByte since January 2023, shipping production .NET, SQL Server and Angular software. This site, THE RANGE, is nine of his repositories stacked into one scroll.",
  },
  {
    id: "where-is-shreyansh-based",
    group: "About",
    q: "Where is Shreyansh Kumar Singh based?",
    a: "Pune, Maharashtra, India, where he works at RamanByte. He's open to full-time or hybrid roles.",
  },
  {
    id: "education",
    group: "About",
    q: "What is Shreyansh's educational background?",
    a: "He holds a Bachelor of Technology (B.Tech) in Computer Science from Dr. A.P.J. Abdul Kalam Technical University, completed in 2021.",
  },
  {
    id: "ai-systems",
    group: "Work",
    home: true,
    q: "What AI systems has Shreyansh built?",
    a: "Four AI systems where the model is load-bearing, not decorative: Sarthi, Nythera, HallogenAI and BookVerse AI. Sarthi is an AI relationship-manager copilot for banking — RAG and document intelligence — followed by a written audit of its own P0 holes. Nythera is an autonomous penetration-testing platform that validates every finding before it reports it. HallogenAI uses eight specialized agents to re-verify reported bugs against live application behavior. BookVerse AI turns any book into summaries, timelines, mind maps and a grounded tutor — with zero API keys required.",
  },
  {
    id: "what-is-sarthi",
    group: "Work",
    q: "What is Sarthi?",
    a: "Sarthi is an AI relationship-manager copilot for banking that Shreyansh built independently: a Customer 360 dashboard backed by RAG and document intelligence, built in Next.js and TypeScript with Prisma, Supabase, Groq and Gemini. Its pipeline is split into four modules — embeddings, vector storage, retrieval and generation — so each stage can be tested and replaced on its own, and it ships with a published P0–P3 security self-audit.",
  },
  {
    id: "ramanbyte",
    group: "Work",
    q: "What does Shreyansh do at RamanByte?",
    a: "He's a full-stack developer on Classroom+, RamanByte's learning-management platform, and owns the whole vertical slice: ASP.NET Web API design, the SQL Server schema, and the Angular or Flutter client that consumes it. Six of those builds are written up on the Experience page: PIBM's A Journal of Management (live, ISSN 2455-8796), the Classroom+ admin, student and faculty apps, the Dada Udyogini Flutter marketplace apps, and the Vidur Industry Connect admin console.",
  },
  {
    id: "tech-stack",
    group: "Work",
    q: "What is Shreyansh's tech stack?",
    a: "His stack spans AI-native products (Next.js, TypeScript, Python, LLM APIs) and enterprise software (C#, .NET 8, SQL Server, Angular). For AI-native products: Next.js, React, TypeScript and Tailwind; Python and FastAPI for agents; Groq, Gemini and Ollama for models; Prisma or Drizzle on Supabase and Neon for data. For enterprise work: C# and ASP.NET Core 8, EF Core and SQL Server behind Angular 16–18 with RxJS and Signals. Around both: Three.js and React Three Fiber for 3D, Flutter for mobile, and Azure, AWS S3, Redis, SignalR and k6 load testing. The full list, with evidence for each skill, is on the Skills page.",
  },
  {
    id: "production-software",
    group: "Work",
    q: "Has Shreyansh shipped production software?",
    a: "Yes — production software at RamanByte since January 2023, alongside independent AI systems like Sarthi. At RamanByte his code runs for real institutions: PIBM's journal portal is live on the institution's own domain, the Classroom+ student and faculty apps are live, and the Dada Udyogini marketplace apps launched on a fixed public date. The personal repositories are where he pushes into newer ground: agents, security tooling, 3D and simulation.",
  },
  {
    id: "approach",
    group: "Work",
    q: "How does Shreyansh approach building software?",
    a: "He writes the specification before the code, then tries to break what he built. Before any code exists he writes down what the thing is, what it looks like, and what \"done\" means — every repository on this site ships one. Once it's built, it gets attacked like an outsider, run without its safety nets. Sarthi's self-published P0 audit and Nythera's validated-only findings are that discipline in practice, not a slide about it.",
  },
  {
    id: "not-a-chatbot-wrapper",
    group: "Work",
    q: "How is Shreyansh's AI work different from a chatbot wrapper?",
    a: "The model is infrastructure, not a plugin bolted onto a finished product. He designs the system assuming a model sits inside the loop from day one — Sarthi's four-stage RAG pipeline keeps every stage independently inspectable and replaceable, and Nythera checks its own findings through an agent loop before reporting them. The model's output is then reviewed and audited like any other engineer's code.",
  },
  {
    id: "why-the-range",
    group: "Work",
    q: "Why is the portfolio called THE RANGE?",
    a: "THE RANGE is named for its spread: nine repositories across nine domains, built on one discipline. The domains are editorial, security, applied AI, 3D, product, simulation, enterprise platform, QA verification and motion. It's a scroll-driven stack of running work, each project with its real stack and source link, instead of a grid of screenshots.",
  },
  {
    id: "open-to-roles",
    group: "Hiring",
    home: true,
    q: "Is Shreyansh Kumar Singh open to new roles?",
    a: "Yes — full-time or hybrid roles, based in Pune. His first choice is applied AI engineering (RAG, LLM agents); he's also a strong fit for full-stack engineering on AI products, AI security tooling, and senior .NET and Angular work, in that order of how strongly his shipped work supports them.",
  },
  {
    id: "years-of-experience",
    group: "Hiring",
    q: "How much experience does Shreyansh have?",
    a: "Nearly four years of production software development, as a full-stack developer at RamanByte since January 2023 — ASP.NET Core, SQL Server, Angular and Flutter shipped to paying institutions — plus nine independent projects across AI, security, 3D and simulation.",
  },
  {
    id: "good-fit",
    group: "Hiring",
    q: "What kind of projects is Shreyansh a good fit for?",
    a: "Work where AI is load-bearing and correctness matters: security you want proven rather than assumed (Nythera); AI that has to understand documents, not just keyword-search them (Sarthi, BookVerse AI); 3D experiences on the web that are actually walkable (Antarang); enterprise systems in Clean Architecture built to survive a second client (VaultIQ); and QA where \"fixed\" is verified against live behavior, not a closed ticket (HallogenAI).",
  },
  {
    id: "contact",
    group: "Hiring",
    home: true,
    q: "How can I contact Shreyansh Kumar Singh?",
    a: "Email shreyanshkumarsingh208@gmail.com, or use the Contact page, which has one-tap call and WhatsApp buttons. The most useful first message covers three things: what's actually broken, what you've already tried, and what \"done\" looks like. Source code for the public projects is on GitHub at github.com/Shreyanskumarsingh20.",
  },
];

export const FAQ_GROUPS: Faq["group"][] = ["About", "Work", "Hiring"];

/** Section headings for each group on /faq and in its markdown view. */
export const FAQ_GROUP_LABELS: Record<Faq["group"], string> = {
  About: "About Shreyansh Kumar Singh",
  Work: "His AI and full-stack work",
  Hiring: "Hiring and availability",
};
