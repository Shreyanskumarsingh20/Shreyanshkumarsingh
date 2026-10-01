// FAQ — direct answers to what recruiters, founders and collaborators ask
// about the profile itself. Every answer leads with the answer (that first
// sentence is what search snippets and AI answer engines quote) and every
// fact traces back to a project or case study elsewhere on the site.
// Also emitted as FAQPage JSON-LD (app/page.tsx) and in /llms.txt.

export type Faq = {
  q: string;
  a: string;
};

export const FAQS: Faq[] = [
  {
    q: "Who is Shreyansh Kumar Singh?",
    a: "I'm an AI and full-stack engineer based in Pune, India. I build AI-native systems — RAG pipelines, LLM agent loops, autonomous security tooling — and I've spent about four years as a full-stack developer at RamanByte shipping production .NET, SQL Server and Angular software. This site, THE RANGE, is nine of my repositories stacked into one scroll.",
  },
  {
    q: "What AI systems has Shreyansh built?",
    a: "I've built four AI systems where the model is load-bearing, not decorative: IDBI Sarthi, Nythera, HallogenAI and BookVerse AI. IDBI Sarthi is production RAG and document intelligence for a bank, followed by a written audit of its own P0 holes. Nythera is an autonomous penetration-testing platform that validates every finding before it reports it. HallogenAI uses eight specialized agents to re-verify reported bugs against live application behavior. BookVerse AI turns any book into summaries, timelines, mind maps and a grounded tutor — with zero API keys required.",
  },
  {
    q: "What does Shreyansh do at RamanByte?",
    a: "I'm a full-stack developer on Classroom+, RamanByte's learning-management platform. I design the ASP.NET Web API and its SQL Server schema, then build the Angular front end that consumes it. Six of those builds are written up on the Experience page: PIBM's A Journal of Management (live, ISSN 2455-8796), the Classroom+ admin, student and faculty apps, the Dada Udyogini Flutter marketplace apps, and the Vidur Industry Connect admin console.",
  },
  {
    q: "What is Shreyansh's tech stack?",
    a: "My stack spans AI-native products (Next.js, TypeScript, Python, LLM APIs) and enterprise software (C#, .NET 8, SQL Server, Angular). For AI-native products: Next.js, React, TypeScript and Tailwind; Python and FastAPI for agents; Groq, Gemini and Ollama for models; Prisma or Drizzle on Supabase and Neon for data. For enterprise work: C# and .NET 8, ASP.NET Web API, EF Core and SQL Server behind Angular 16–18 with RxJS and Signals. Around both: Three.js and React Three Fiber for 3D, Flutter for mobile, and AWS S3, Azure, Redis, SignalR and k6 load testing.",
  },
  {
    q: "Has Shreyansh shipped production software?",
    a: "Yes — about four years of production software at RamanByte, plus production RAG built for a bank. At RamanByte my code runs for real institutions: PIBM's journal portal is live on the institution's own domain, and the Classroom+ apps were built for the admins, faculty and students who run on them. The personal repositories are where I push into newer ground: agents, security tooling, 3D and simulation.",
  },
  {
    q: "How does Shreyansh approach building software?",
    a: "I write the specification before the code, then try to break what I built. Before any code exists I write down what the thing is, what it looks like, and what \"done\" means — every repository on this site ships one. Once it's built, it gets attacked like an outsider, run without its safety nets. IDBI Sarthi's self-published P0 audit and Nythera's validated-only findings are that discipline in practice, not a slide about it.",
  },
  {
    q: "How is Shreyansh's AI work different from a chatbot wrapper?",
    a: "The model is infrastructure, not a plugin bolted onto a finished product. I design the system assuming a model sits inside the loop from day one — IDBI Sarthi's four-stage RAG pipeline keeps every stage independently inspectable and replaceable, and Nythera checks its own findings through an agent loop before reporting them. The model's output is then reviewed and audited like any other engineer's code.",
  },
  {
    q: "What kind of projects is Shreyansh a good fit for?",
    a: "Five kinds of project, each backed by a shipped repository: security you want proven rather than assumed (Nythera); AI that has to understand documents, not just keyword-search them (IDBI Sarthi, BookVerse AI); 3D experiences on the web that are actually walkable (Antarang); enterprise systems in Clean Architecture built to survive a second client (VaultIQ); and QA where \"fixed\" is verified against live behavior, not a closed ticket (HallogenAI).",
  },
  {
    q: "Why is the portfolio called THE RANGE?",
    a: "THE RANGE is named for its spread: nine repositories across nine domains, built on one discipline. The domains are editorial, security, applied AI, 3D, product, simulation, enterprise platform, QA verification and motion. It's a scroll-driven stack of running work, each project with its real stack and source link, instead of a grid of screenshots.",
  },
  {
    q: "How can I contact Shreyansh Kumar Singh?",
    a: "Email shreyanshkumarsingh208@gmail.com, or start from the Let's Talk page. The most useful first message covers three things: what's actually broken, what you've already tried, and what \"done\" looks like. Source code for every project is on GitHub at github.com/gamersinghxx-creator.",
  },
];
