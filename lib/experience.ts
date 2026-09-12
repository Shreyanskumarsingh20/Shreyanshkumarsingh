// EXPERIENCE — four years at RamanByte, told through six case studies. Prose
// blocks (`html` fields) are stored as static HTML strings (ported verbatim
// from experience.html, including their inline <b>/<i>/<span class="mono">
// markup) and rendered via dangerouslySetInnerHTML — this is the site
// owner's own authored copy, not user input, so it's safe and avoids
// hand-rebuilding dozens of inline-formatted paragraphs as JSX.

export type ShotItem = {
  img: string;
  alt: string;
  /** shown in the chrome bar / URL readout when this shot is active */
  label: string;
  /** short thumbnail caption */
  thumb: string;
};

export type PhoneItem = {
  img: string;
  alt: string;
  cap: string;
};

export type Gallery =
  | { kind: "shots"; items: ShotItem[]; caption: string }
  | {
      kind: "phones";
      blocks: { label: string; count: string; items: PhoneItem[] }[];
      caption: string;
    };

export type Badge = { text: string; variant?: "live" | "dev" };

export type BuiltItem = { title: string; bodyHtml: string };

export type StackGroup = { label: string; tags: string[] };

export type Num = { vHtml: string; kHtml: string };

export type ExperienceCase = {
  id: string;
  no: string;
  domain: string;
  ref: string;
  title: string;
  line: string;
  badges: Badge[];
  gallery: Gallery;
  aboutHtml: string[];
  built: BuiltItem[];
  stackGroups: StackGroup[];
  nums: Num[];
  sideLabel: string;
  sideHtml: string;
  sideLink?: { text: string; href: string };
};

export const EXPERIENCE_CASES: ExperienceCase[] = [
  {
    id: "case",
    no: "01",
    domain: "Publishing · Academic",
    ref: "RamanByte · client project",
    title: "A Journal of Management",
    line: "The complete online home and submission portal for PIBM's flagship double-blind peer-reviewed journal — public site, author onboarding, and reviewer workflow, on one Angular front end.",
    badges: [
      { text: "Angular 16" },
      { text: "ASP.NET Web API" },
      { text: "SQL Server" },
      { text: "Reactive Forms" },
      { text: "AWS S3" },
      { text: "CKEditor 5" },
      { text: "● Live · ISSN 2455-8796", variant: "live" },
    ],
    gallery: {
      kind: "shots",
      items: [
        {
          img: "/shots/ramanbyte/pibm-home.jpg",
          alt: "A Journal of Management home page — introduction, an announcements column, and a live rail of research journals pulled from the API",
          label: "a journal of management — home",
          thumb: "Home",
        },
        {
          img: "/shots/ramanbyte/pibm-editorial-board.jpg",
          alt: "Editorial Board page — one of nine public pages converted from a static mock-up to live API-bound content",
          label: "about / editorial board",
          thumb: "Board",
        },
        {
          img: "/shots/ramanbyte/pibm-archives.jpg",
          alt: "Archives page listing published volumes and issues, loaded from the .NET API",
          label: "archives — published volumes",
          thumb: "Archives",
        },
        {
          img: "/shots/ramanbyte/pibm-submit.jpg",
          alt: "Submit Your Article page — the entry point into the author submission workflow",
          label: "submit your article",
          thumb: "Submit",
        },
        {
          img: "/shots/ramanbyte/pibm-author-guidelines.jpg",
          alt: "Author Guidelines page — manuscript preparation rules rendered from managed content",
          label: "author guidelines",
          thumb: "Guide",
        },
        {
          img: "/shots/ramanbyte/pibm-faqs.jpg",
          alt: "FAQs page — an accordion built from scratch; a state-loss-on-refresh bug fixed here",
          label: "faqs — accordion",
          thumb: "FAQs",
        },
        {
          img: "/shots/ramanbyte/pibm-contact.jpg",
          alt: "Contact and enquiry form with cascading country, state and city selects and full field validation",
          label: "contact / enquiry form",
          thumb: "Contact",
        },
      ],
      caption:
        "Seven of the public pages, captured off a local <span class=\"mono\">ng serve</span> against the live API. The account, submission and reviewer screens sit behind login.",
    },
    aboutHtml: [
      "<i>A Journal of Management</i> is the flagship journal of the <b>Pune Institute of Business Management</b>. It has published quarterly since March 2016, is open-access, and runs a double-blind peer review. The site is its whole public presence and the system authors and reviewers actually work in.",
      "It started as a Metronic admin template with every page hardcoded. The job was to make it real: a .NET API and SQL Server behind it, and an Angular layer that binds to them end to end.",
    ],
    built: [
      {
        title: "Author onboarding",
        bodyHtml:
          'Email-verified account creation, then a three-step registration wizard — basic details → address (with a "permanent same as communication" toggle) → credentials. Password-match and field-level validation throughout; login, forgot- and reset-password flows.',
      },
      {
        title: "Manuscript submission",
        bodyHtml:
          "The submit-a-journal form with full validation, re-submission handling for revisions, resolved-status routing, and the article list and detail views — all bound to the .NET article service.",
      },
      {
        title: "Reviewer workflow",
        bodyHtml:
          "A reviewer directory, a reviewer profile with its own validation rules, and the review detail screens that sit between a submission and an editorial decision.",
      },
      {
        title: "The public journal",
        bodyHtml:
          "Home, about, editorial board, editorial policy, authors, reviewers, archives, index and author guidelines — each converted from a static page to a live, API-driven one, plus a shared announcements component and the footer.",
      },
      {
        title: "FAQs &amp; file upload",
        bodyHtml:
          "An accordion FAQ built from scratch, including a fix for state lost on refresh. Dropzone wired to AWS S3 for manuscript and supporting-document uploads.",
      },
    ],
    stackGroups: [
      {
        label: "Front end",
        tags: [
          "Angular 16",
          "TypeScript",
          "RxJS",
          "Reactive Forms",
          "Angular Material",
          "Bootstrap 5",
          "SCSS",
          "CKEditor 5",
        ],
      },
      { label: "Back end", tags: ["ASP.NET Web API", "C#", "SQL Server", "REST"] },
      {
        label: "Platform",
        tags: ["AWS S3", "Firebase Auth", "Classroom+ infra", "Git · GitHub"],
      },
    ],
    nums: [
      { vHtml: "93", kHtml: "Commits authored" },
      { vHtml: "Oct '23<br>– Mar '24", kHtml: "Main build window" },
      { vHtml: "11", kHtml: "Public routes" },
      { vHtml: "3", kHtml: "User roles: author, reviewer, editor" },
    ],
    sideLabel: "Live",
    sideHtml: "The journal is online and accepting submissions.",
    sideLink: { text: "PIBM →", href: "https://www.pibm.in/" },
  },
  {
    id: "case-2",
    no: "02",
    domain: "Ed-tech · Platform / Internal tool",
    ref: "RamanByte · Classroom+",
    title: "Classroom+ — Admin Console",
    line: "The control panel for Classroom+ — where an institute sets up its programs, batches, timetables and faculty load before a single student or teacher logs in.",
    badges: [
      { text: "Angular" },
      { text: "TypeScript" },
      { text: "ASP.NET Web API" },
      { text: "SQL Server" },
      { text: "Metronic 8" },
      { text: "● In production · internal", variant: "live" },
    ],
    gallery: {
      kind: "shots",
      items: [
        {
          img: "/shots/classroomplus/cp-home.jpg",
          alt: "The Classroom+ admin home — module cards for timetable, programs, assessments, quiz, attendance, feedback, grievance and mentorship",
          label: "classroom+ admin — home dashboard",
          thumb: "Home",
        },
        {
          img: "/shots/classroomplus/cp-timetable.jpg",
          alt: "Daily Timetable Planning — a day-view scheduler with batch, semester and section/group filters, copy mode and Excel export",
          label: "timetable — daily planning",
          thumb: "Timetable",
        },
        {
          img: "/shots/classroomplus/cp-faculty-availability.jpg",
          alt: "Faculty Availability Chart — weekly pre-lunch and post-lunch teaching capacity for each faculty member",
          label: "timetable — faculty availability chart",
          thumb: "Faculty",
        },
        {
          img: "/shots/classroomplus/cp-programs.jpg",
          alt: "Masters, Programs — the academic-structure catalogue: programs with duration, type and pattern, in a card or list view",
          label: "masters — programs",
          thumb: "Programs",
        },
        {
          img: "/shots/classroomplus/cp-batch.jpg",
          alt: "Batch list — ongoing, upcoming and expired batches with incharge, duration and pattern, filterable by status and program",
          label: "batch — list",
          thumb: "Batch",
        },
        {
          img: "/shots/classroomplus/cp-subject.jpg",
          alt: "Subject setup — per batch, term and domain, with core / elective / major / minor typing and bulk import",
          label: "subject — setup",
          thumb: "Subject",
        },
        {
          img: "/shots/classroomplus/cp-announcements.jpg",
          alt: "Announcements — one of the Utility lists alongside syllabus and events: a searchable table with create and edit",
          label: "utility — announcements",
          thumb: "Notice",
        },
      ],
      caption:
        "Seven screens from the admin panel, crawled read-only — nothing was created or changed. The faculty and student apps run on the same back end and come next.",
    },
    aboutHtml: [
      "Classroom+ is RamanByte's learning platform; this is the console an institute's administrators use to stand it up. <b>Everything the faculty and student apps consume — programs, patterns, batches, sections, subjects, time slots, timetables — is defined here first.</b>",
      "Same foundation as the journal: an Angular front end on the Metronic 8 base, against .NET / SQL Server services on the shared Classroom+ platform, with theming and six-language i18n out of the box.",
    ],
    built: [
      {
        title: "Timetable &amp; scheduling",
        bodyHtml:
          "Daily timetable planning by batch / semester / section / group with a day grid, copy mode and Excel export; a per-faculty weekly availability chart (pre- and post-lunch sessions); and time-slot configuration.",
      },
      {
        title: "Academic structure (Masters)",
        bodyHtml:
          "Programs, sub-programs, patterns, session parameters and configuration settings — the reference data every other screen builds on.",
      },
      {
        title: "Batches &amp; subjects",
        bodyHtml:
          "Batch lifecycle (ongoing / upcoming / expired), incharge assignment, PEO/PO mapping, and per-batch subject setup — core / elective / major / minor — with bulk import.",
      },
      {
        title: "Sections, groups &amp; documents",
        bodyHtml:
          "Splitting a batch into teaching sections and student groups, and the document library that hangs off them.",
      },
      {
        title: "Engagement &amp; utility",
        bodyHtml:
          "Engagement reporting across the timetable, plus the Utility lists — announcements, program syllabus and events — each a searchable table with create and edit.",
      },
    ],
    stackGroups: [
      {
        label: "Front end",
        tags: ["Angular", "TypeScript", "RxJS", "Angular Material", "Bootstrap 5", "SCSS", "Metronic 8"],
      },
      { label: "Back end", tags: ["ASP.NET Web API", "C#", "SQL Server", "REST"] },
      {
        label: "Platform",
        tags: ["Classroom+ platform", "i18n · 6 languages", "Excel export", "Git · GitHub"],
      },
    ],
    nums: [
      { vHtml: "8", kHtml: "Admin-home modules" },
      { vHtml: "9", kHtml: "Top-level menu sections" },
      { vHtml: "Admin", kHtml: "Portal shown here" },
      { vHtml: "+2", kHtml: "Faculty &amp; student portals next" },
    ],
    sideLabel: "Access",
    sideHtml:
      "Internal tool — institute administrators. The faculty and student apps are separate front ends on the same Classroom+ back end.",
  },
  {
    id: "case-3",
    no: "03",
    domain: "Ed-tech · Platform / Student-facing",
    ref: "RamanByte · Classroom+",
    title: "Classroom+ — Student App",
    line: "The student's home on Classroom+ — a dashboard, their program and coursework, every assessment due, and a full placement and career pipeline, all bound to the same .NET back end as the admin console.",
    badges: [
      { text: "Angular" },
      { text: "TypeScript" },
      { text: "ASP.NET Web API" },
      { text: "SQL Server" },
      { text: "Metronic 8" },
      { text: "FusionCharts" },
      { text: "● Live · student-facing", variant: "live" },
    ],
    gallery: {
      kind: "shots",
      items: [
        {
          img: "/shots/classroomplus-student/cps-dashboard.jpg",
          alt: "Classroom+ student dashboard — an attendance gauge against benchmark, an assessment-submission donut chart, a connect-with-mentor card and announcements",
          label: "classroom+ student — dashboard",
          thumb: "Dashboard",
        },
        {
          img: "/shots/classroomplus-student/cps-program.jpg",
          alt: "Program page — enrolled courses filtered by year, subject completion bars, and tabs for outcomes, syllabus, announcements and documents",
          label: "program — enrolled courses, year-wise",
          thumb: "Program",
        },
        {
          img: "/shots/classroomplus-student/cps-assessments.jpg",
          alt: "Assessments page — four categories of work with a date-range filter and Upcoming / Done / Expired submission-status tabs",
          label: "assessments — assignment, presentation, case study, pre-reading",
          thumb: "Assess",
        },
        {
          img: "/shots/classroomplus-student/cps-placement-jobs.jpg",
          alt: "Placement job board — open roles with company, salary band, location and type, filterable by job type, experience, category and salary",
          label: "placement — job board",
          thumb: "Jobs",
        },
        {
          img: "/shots/classroomplus-student/cps-placement-interview.jpg",
          alt: "A nine-stage recruitment pipeline as tabs — Opened, Applied, Shortlisted, Aptitude Test, Group Discussion, three interview rounds, HR round, Selected, Rejected — here showing a scheduled interview with its meeting link",
          label: "placement — recruitment pipeline",
          thumb: "Pipeline",
        },
        {
          img: "/shots/classroomplus-student/cps-placement-profile.jpg",
          alt: "Placement profile, a seven-step wizard — personal details, communication, education, work experience, certifications, languages, KYC documents — with a completion tracker",
          label: "placement — profile wizard",
          thumb: "Profile",
        },
        {
          img: "/shots/classroomplus-student/cps-resume-upload.jpg",
          alt: "Resume upload — up to five resumes with per-file review status and a default-resume selection used across job applications",
          label: "placement — resume upload",
          thumb: "Resume",
        },
      ],
      caption:
        "Seven screens from the live student portal, crawled read-only with a test account — signed in, nothing created or changed. Dashboard, Program, Assessments and the full Placement flow, all on the same Classroom+ back end as the admin console above.",
    },
    aboutHtml: [
      "The counterpart to the admin console: <b>everything a student sees once an institute has set up its programs, batches and timetables is served from here</b> — their own dashboard, their enrolled program, the work due, and, distinctively for Classroom+, a placement office built into the same platform.",
      "Same foundation as the journal and the admin panel: Angular on Metronic 8 against .NET / SQL Server services, live at <span class=\"mono\">student.classroomplus.in</span> for real institutes and their students.",
    ],
    built: [
      {
        title: "Dashboard",
        bodyHtml:
          "An overall-attendance gauge plotted against an institute-set benchmark, an assessment-submission breakdown (on-time / late / not-submitted) as a donut chart, an upcoming-submissions panel, a connect-with-mentor card and an announcements/events feed — the first screen a student sees.",
      },
      {
        title: "Program",
        bodyHtml:
          "Enrolled courses filtered by year, each with a live subject-completion bar and a per-subject course planner; plus tabs for program outcomes, program syllabus (rendered as an inline PDF viewer), announcements, events and a documents library.",
      },
      {
        title: "Assessments",
        bodyHtml:
          "Work split into four categories — assignment, presentation, case study, pre-reading — with a date-range filter and Upcoming / Submission Done / Submission Expired status tabs, each a searchable, paginated list.",
      },
      {
        title: "Placement — profile &amp; documents",
        bodyHtml:
          "A seven-step placement-profile wizard (personal, communication, education, work experience, certifications, languages, KYC documents) with a completion tracker, plus resume management: up to five uploads, per-file review status, and one marked as the default used on applications.",
      },
      {
        title: "Placement — job board &amp; pipeline",
        bodyHtml:
          "A filterable job board (type, experience level, category, salary band, location) built as cards with company, role and package, and a nine-stage recruitment pipeline as tabs — Opened → Applied → Shortlisted → Aptitude Test → Group Discussion → Interview Rounds 1–3 → HR Round → Selected/Rejected — surfacing scheduled interviews with their date, time, mode and meeting link.",
      },
    ],
    stackGroups: [
      {
        label: "Front end",
        tags: [
          "Angular",
          "TypeScript",
          "RxJS",
          "Angular Material",
          "Bootstrap 5",
          "SCSS",
          "Metronic 8",
          "FusionCharts",
        ],
      },
      { label: "Back end", tags: ["ASP.NET Web API", "C#", "SQL Server", "REST"] },
      {
        label: "Platform",
        tags: ["Classroom+ platform", "PDF viewer", "File upload", "Git · GitHub"],
      },
    ],
    nums: [
      { vHtml: "4", kHtml: "Core modules: dashboard, program, assessments, placement" },
      { vHtml: "9", kHtml: "Recruitment-pipeline stages tracked" },
      { vHtml: "7", kHtml: "Steps in the placement profile wizard" },
      { vHtml: "Live", kHtml: "student.classroomplus.in" },
    ],
    sideLabel: "Access",
    sideHtml:
      "Student-facing — one account per learner. Screens here were captured signed in with a test account, read-only.",
  },
  {
    id: "case-4",
    no: "04",
    domain: "Ed-tech · Platform / Faculty-facing",
    ref: "RamanByte · Classroom+",
    title: "Classroom+ — Faculty App",
    line: "The teacher's side of Classroom+ — the subjects they run, a workload calendar, every assessment they set and grade, late-submission approvals, mentee tracking, and the placement profiles they sign off on.",
    badges: [
      { text: "Angular" },
      { text: "TypeScript" },
      { text: "ASP.NET Web API" },
      { text: "SQL Server" },
      { text: "Metronic 8" },
      { text: "FullCalendar" },
      { text: "● Live · faculty-facing", variant: "live" },
    ],
    gallery: {
      kind: "shots",
      items: [
        {
          img: "/shots/classroomplus-faculty/cpf-subject.jpg",
          alt: "Classroom+ faculty Subject page — batches on the left, the subjects taught in the selected batch on the right with hours and session counts",
          label: "subject — batches and subjects taught",
          thumb: "Subject",
        },
        {
          img: "/shots/classroomplus-faculty/cpf-engagement.jpg",
          alt: "Self Engagement — a day/week/month calendar of a faculty member's own sessions, with a weekly workload-capacity tracker beside it",
          label: "self engagement — workload calendar",
          thumb: "Engage",
        },
        {
          img: "/shots/classroomplus-faculty/cpf-assessment-assignment.jpg",
          alt: "Assignment list a faculty member has authored — marks, individual/group submission type, how many students it's allocated to, and who created it",
          label: "assessment — assignment list",
          thumb: "Assess",
        },
        {
          img: "/shots/classroomplus-faculty/cpf-late-submission.jpg",
          alt: "Late Submission Approval — total / pending / approved / denied counters above a searchable queue of student late-submission requests",
          label: "late submission — approval queue",
          thumb: "Late Sub",
        },
        {
          img: "/shots/classroomplus-faculty/cpf-placement-profile.jpg",
          alt: "Student Placement Profile — the faculty-side review list of submitted placement profiles with approval status, export to Excel",
          label: "placement profile — approvals",
          thumb: "Placement",
        },
        {
          img: "/shots/classroomplus-faculty/cpf-attendance.jpg",
          alt: "Attendance — session picker with a mini calendar and exempted/excluded student lists, ready to take attendance for a selected session",
          label: "attendance — session-based",
          thumb: "Attend",
        },
        {
          img: "/shots/classroomplus-faculty/cpf-mentorship.jpg",
          alt: "Mentorship — a mentor's mentee roster with attendance percentage, class participation, communication and aptitude levels, and an internship action",
          label: "mentorship — mentee roster",
          thumb: "Mentor",
        },
      ],
      caption:
        "Seven screens from the live faculty portal, crawled read-only with a real faculty account — signed in, nothing created, graded or approved. Subject, Engagement, Assessment and Placement Profile, the four asked for, plus Attendance and Mentorship on the same Classroom+ back end.",
    },
    aboutHtml: [
      "The instructor seat on Classroom+: <b>the workload a faculty member actually carries</b> — which batches and subjects, how many hours booked into their own calendar, everything they've set for grading, and the two review queues, late submissions and student placement profiles, that only faculty can act on.",
      "Same foundation as the other three: Angular on Metronic 8 against .NET / SQL Server services, live at <span class=\"mono\">faculty.classroomplus.in</span> for real institutes and their teaching staff.",
    ],
    built: [
      {
        title: "Subject",
        bodyHtml:
          "The batches a faculty member teaches into, each with its subjects, hours and session counts, and a view-detail drill-down per subject — grid or list, filterable and searchable.",
      },
      {
        title: "Self Engagement",
        bodyHtml:
          "A FullCalendar-style day/week/month scheduler of the faculty member's own sessions, paired with a weekly workload widget — total capacity vs. engaged hours, split by evaluation and session time.",
      },
      {
        title: "Assessment — authoring &amp; grading",
        bodyHtml:
          "Assignments, case studies, presentations and pre-reading, each a full CRUD list — create, marks, individual/group submission type, batch and student allocation — plus a Late Submission Approval queue with live totals (requested / pending / approved / denied) and a per-request review action.",
      },
      {
        title: "Attendance &amp; Mentorship",
        bodyHtml:
          "Session-based attendance with exempted/excluded student handling, and a class-participation tab alongside it; a mentee roster showing attendance %, communication and aptitude levels per student, exportable to Excel.",
      },
      {
        title: "Placement Profile",
        bodyHtml:
          "The faculty-side counterpart to the student placement wizard — every submitted student profile in one reviewable table (UID, batch, semester, section, submission date, approval status) with export to Excel.",
      },
    ],
    stackGroups: [
      {
        label: "Front end",
        tags: [
          "Angular",
          "TypeScript",
          "RxJS",
          "Angular Material",
          "Bootstrap 5",
          "SCSS",
          "Metronic 8",
          "FullCalendar",
        ],
      },
      { label: "Back end", tags: ["ASP.NET Web API", "C#", "SQL Server", "REST"] },
      { label: "Platform", tags: ["Classroom+ platform", "Excel export", "Git · GitHub"] },
    ],
    nums: [
      {
        vHtml: "6",
        kHtml: "Modules shown: subject, engagement, assessment, late-sub, placement, mentorship",
      },
      { vHtml: "4", kHtml: "Assessment types authored" },
      { vHtml: "185", kHtml: "Late-submission requests in this queue alone" },
      { vHtml: "Live", kHtml: "faculty.classroomplus.in" },
    ],
    sideLabel: "Access",
    sideHtml:
      "Faculty-facing — one account per instructor. Screens here were captured signed in with a real faculty account, read-only.",
  },
  {
    id: "case-5",
    no: "05",
    domain: "E-commerce · Marketplace / Flutter mobile",
    ref: "RamanByte · client project",
    title: "Dada Udyogini — Seller &amp; Buyer Apps",
    line: "Two Flutter apps — one for artisans to run a shop, one for buyers to find them — built to launch together on a hard public date in Maharashtra. My end was everything off-screen: the messaging and logistics vendors wired into the order flow, the Google-backed data layer, Azure cost tuning, and a distributed load rig built from scratch to prove the back end wouldn't fall over on launch day.",
    badges: [
      { text: "Flutter" },
      { text: "Dart" },
      { text: "ASP.NET Core" },
      { text: "PostgreSQL" },
      { text: "Firebase / Google APIs" },
      { text: "Microsoft Azure" },
      { text: "k6" },
      { text: "● Live · dual-app launch", variant: "live" },
    ],
    gallery: {
      kind: "phones",
      blocks: [
        {
          label: "Seller app",
          count: "— 5 screens",
          items: [
            {
              img: "/shots/dada-udyogini/du-seller-01-onboarding.webp",
              alt: "Dada Udyogini Seller app — 'Set up a shop in three steps', the onboarding form",
              cap: "Set up a shop in three steps",
            },
            {
              img: "/shots/dada-udyogini/du-seller-02-dashboard.webp",
              alt: "Dada Udyogini Seller app — 'Your shop, at a glance', an earnings and orders dashboard",
              cap: "Your shop, at a glance",
            },
            {
              img: "/shots/dada-udyogini/du-seller-03-add-craft.webp",
              alt: "Dada Udyogini Seller app — 'List a craft in minutes', the add-product form",
              cap: "List a craft in minutes",
            },
            {
              img: "/shots/dada-udyogini/du-seller-04-orders.webp",
              alt: "Dada Udyogini Seller app — 'Move every order in one tap', order management",
              cap: "Move every order in one tap",
            },
            {
              img: "/shots/dada-udyogini/du-seller-05-language.webp",
              alt: "Dada Udyogini Seller app — 'Sell in your language', English/Marathi language picker",
              cap: "Sell in your language — English / मराठी",
            },
          ],
        },
        {
          label: "Buyer app",
          count: "— 4 screens, Marathi",
          items: [
            {
              img: "/shots/dada-udyogini/du-buyer-01-browse.webp",
              alt: "Dada Udyogini Buyer app — product browsing grid, tagline 'Handmade, straight to you' (हातांनी बनवलेले, थेट तुमच्यापर्यंत)",
              cap: "\"Handmade, straight to you\"",
            },
            {
              img: "/shots/dada-udyogini/du-buyer-02-product-detail.webp",
              alt: "Dada Udyogini Buyer app — product detail page, tagline 'Know the artisan behind every product' (प्रत्येक वस्तूमागील कारागिराला जाणून घ्या)",
              cap: "\"Know the artisan behind every product\"",
            },
            {
              img: "/shots/dada-udyogini/du-buyer-03-checkout.webp",
              alt: "Dada Udyogini Buyer app — checkout / bill summary, tagline 'A clean bill, nothing hidden' (स्वच्छ बिल, काहीही लपवलेले नाही)",
              cap: "\"A clean bill, nothing hidden\"",
            },
            {
              img: "/shots/dada-udyogini/du-buyer-04-tracking.webp",
              alt: "Dada Udyogini Buyer app — address and order tracking, tagline 'Real-time updates at every step' (प्रत्येक टप्प्यावर रिअल टाइम अपडेट्स)",
              cap: "\"Real-time updates at every step\"",
            },
          ],
        },
      ],
      caption:
        "Nine store-listing screenshots across both apps — shown at their native resolution rather than stretched. Click any to open it larger. The buyer app ships Marathi-first; the seller app switches between English and Marathi.",
    },
    aboutHtml: [
      "Dada Udyogini is a marketplace connecting artisan sellers with buyers, built as <b>two purpose-specific Flutter apps sharing one ASP.NET Core / PostgreSQL back end</b> — a Seller app for craftspeople to set up shop, list products and fulfill orders, and a Buyer app to discover them, see the maker behind each item, and check out. Both were built to go live together, on a fixed date, at a large public launch event in Maharashtra.",
      "Where the other RamanByte case studies here are Angular over .NET, this one is Flutter over ASP.NET Core with PostgreSQL — a different client stack, same discipline: a typed API contract, real vendor integrations instead of stubs, and infrastructure proven under load before the launch date rather than after it.",
    ],
    built: [
      {
        title: "Messaging &amp; logistics vendor integration",
        bodyHtml:
          "Wired a transactional SMS/OTP messaging vendor into signup, order and shop-status notifications, and a logistics vendor into the fulfillment pipeline — rate calculation, shipment creation and tracking updates flowing back into both apps' order screens.",
      },
      {
        title: "Google-backed data layer",
        bodyHtml:
          "User accounts, seller/shop resources and stored media backed by Firebase / Google Cloud APIs — authentication, storage and backup for the data both apps depend on, plus Google Maps for buyer addresses and delivery.",
      },
      {
        title: "Azure cost optimization",
        bodyHtml:
          "Reviewed and re-tuned the Microsoft Azure hosting footprint — right-sizing provisioned resources against real traffic patterns instead of leaving launch-day headroom running at full cost year-round.",
      },
      {
        title: "DadaLoad — a distributed load-generator agent",
        bodyHtml:
          "Designed and specified a purpose-built load-testing platform from scratch: a .NET Worker Service agent running <span class=\"mono\">k6</span> on each of up to 10 Windows machines, orchestrated by an ASP.NET Core + SignalR controller that distributes RPS across agents, drives a scripted buyer journey (login → browse → product → cart → checkout → order), and rolls up live and final metrics into PDF/XLSX/JSON reports — built so the team could prove capacity against the real API before the launch, not guess at it.",
      },
      {
        title: "Launch delivery",
        bodyHtml:
          "Both apps and the back end they share went live together against a fixed public date — no slipping the schedule, no soft rollout to absorb early failures. One of the larger deliveries of the four years, and it held.",
      },
    ],
    stackGroups: [
      { label: "Front end", tags: ["Flutter", "Dart", "Firebase SDK", "Google Maps SDK"] },
      { label: "Back end", tags: ["ASP.NET Core", "C#", "PostgreSQL", "SignalR", "REST"] },
      {
        label: "Platform &amp; tooling",
        tags: [
          "Firebase / Google Cloud",
          "Microsoft Azure",
          "k6",
          "SMS/OTP vendor",
          "Logistics vendor",
          "Git · GitHub",
        ],
      },
    ],
    nums: [
      { vHtml: "2", kHtml: "Flutter apps shipped together — Seller &amp; Buyer" },
      { vHtml: "2", kHtml: "Third-party vendors integrated: messaging &amp; logistics" },
      { vHtml: "10", kHtml: "Windows PCs orchestrated by the DadaLoad agent" },
      { vHtml: "Live", kHtml: "Launched at a public Maharashtra event" },
    ],
    sideLabel: "Scale",
    sideHtml:
      "A fixed-date public launch, not a soft rollout — the load rig existed specifically to de-risk that day.",
  },
  {
    id: "case-6",
    no: "06",
    domain: "Multi-tenant SaaS · Admin console",
    ref: "RamanByte · client project",
    title: "Vidur Industry Connect — Admin Console",
    line: "A multi-tenant engagement-tracking platform — organisations and their members raise and track requests on a Flutter mobile app, and the organisation's staff work them from this admin console, with each tenant seeing only its own data. Currently in active development.",
    badges: [
      { text: "Flutter" },
      { text: "Dart" },
      { text: "flutter_bloc" },
      { text: "ASP.NET Core" },
      { text: "SQL Server" },
      { text: "Redis" },
      { text: "◐ In development · active tenant", variant: "dev" },
    ],
    gallery: {
      kind: "shots",
      items: [
        {
          img: "/shots/vidur-admin/vidur-dashboard.jpg",
          alt: "Vidur admin dashboard — total/open/in-progress/resolved engagement counts with status and type donut charts, filterable by raised-date range",
          label: "vidur admin — dashboard",
          thumb: "Dashboard",
        },
        {
          img: "/shots/vidur-admin/vidur-engagements.jpg",
          alt: "Engagements work queue — ticket number, subject, organisation, type, status, assignee and raised date",
          label: "engagements — work queue",
          thumb: "Engagements",
        },
        {
          img: "/shots/vidur-admin/vidur-users.jpg",
          alt: "Users screen listing tenant staff accounts with role and active status; emails and phone numbers blurred for privacy",
          label: "users — tenant staff accounts",
          thumb: "Users",
        },
        {
          img: "/shots/vidur-admin/vidur-branding.jpg",
          alt: "Branding editor — application name, tagline and logo URLs with a live preview of the login screen and portal sidebar",
          label: "branding — tenant identity editor",
          thumb: "Branding",
        },
      ],
      caption:
        "Four admin screens captured off the staging build, signed in as a tenant administrator. The citizen mobile app — where requests actually get raised — shares this same back end and is next to be captured.",
    },
    aboutHtml: [
      "Vidur is a <b>multi-tenant platform</b> built as one Flutter codebase that ships two portals: a <b>citizen mobile app</b> where organisations and members raise and track \"engagements\" (requests/cases), and this <b>web admin console</b> where tenant staff work the incoming queue. Every tenant — a university, an institution — sees only its own data off one shared back end.",
      "I joined the project mid-build on a dedicated branch, shipping in roughly three-week sprints alongside another engineer already on the codebase — 38 commits across 9 merged PRs, spanning both the admin console and the citizen app's core engagement lifecycle.",
    ],
    built: [
      {
        title: "Admin dashboard &amp; analytics",
        bodyHtml:
          "Built the dashboard shown here from scratch: engagement counts by status, status/type donut charts, and date filters (presets plus a real custom range) — then replaced the full-screen range dialog with compact inline date pickers, removed a non-functional manual Refresh button, and fixed a refresh flicker.",
      },
      {
        title: "Engagement lifecycle (citizen + admin)",
        bodyHtml:
          "Search/filter/rating end-to-end, an engagement-creation confirmation dialog (\"Request ENG-2026-000123 raised\"), citizen-side cancel and reopen with a reason, and a near-duplicate guard that warns before a citizen re-raises something ~85% similar to a request from the last week.",
      },
      {
        title: "Citizen profile suite",
        bodyHtml:
          "A Profile tab with live open/in-progress/resolved counts (the three reads load concurrently), editable name, verified mobile-number change with re-verification, and deactivate-account — blocked automatically while an engagement is still open.",
      },
      {
        title: "QA pass &amp; store compliance",
        bodyHtml:
          "Field-length/character validation on name inputs, locked verified phone/email fields, the dashboard's real signed-in administrator name and initials in place of a placeholder, an assigned-officer display fix, and a rewrite of the Play/App Store listing copy to add the public-entity non-affiliation disclaimer both stores required.",
      },
      {
        title: "CI &amp; project hygiene",
        bodyHtml:
          "Fixed analyzer errors that were silently blocking the staging deploy gate on <span class=\"mono\">main</span>, and authored/keep <span class=\"mono\">DEVELOPMENT.md</span> — the project's living architecture and status doc — current after every major change.",
      },
    ],
    stackGroups: [
      {
        label: "Front end",
        tags: ["Flutter", "Dart", "flutter_bloc", "go_router", "dio", "Material 3"],
      },
      { label: "Back end", tags: ["ASP.NET Core", "C#", "SQL Server", "Redis", "REST"] },
      {
        label: "Platform",
        tags: [
          "Azure Static Web Apps",
          "Azure App Service",
          "GitHub Actions CI",
          "Git · GitHub",
        ],
      },
    ],
    nums: [
      { vHtml: "38", kHtml: "Commits authored" },
      { vHtml: "9", kHtml: "PRs merged" },
      { vHtml: "Aug–Sep '26", kHtml: "Active build window" },
      { vHtml: "2", kHtml: "Portals, one shared Flutter codebase" },
    ],
    sideLabel: "Status",
    sideHtml:
      "In active development — an internal client project, not yet publicly launched. Screens here are from the staging admin console; the citizen mobile app is next to be captured.",
  },
];

export const COMPANY_FACTS: { dt: string; dd: string }[] = [
  { dt: "Company", dd: "RamanByte Pvt. Ltd." },
  { dt: "Location", dd: "Pune, India" },
  { dt: "Product", dd: "Classroom+ LMS" },
  { dt: "My role", dd: "Full-stack developer" },
  { dt: "Stack", dd: ".NET · SQL Server · Angular" },
];

export const HOW_THE_WORK_RUNS: { n: string; title: string; bodyHtml: string }[] = [
  {
    n: "01",
    title: "API first",
    bodyHtml:
      "Design the endpoints and the SQL Server schema before the screen exists. The shape of the data drives everything downstream — so it gets settled first.",
  },
  {
    n: "02",
    title: "Type the contract",
    bodyHtml:
      "Every response gets a typed Angular model and a service method. When the API changes, the TypeScript compiler points at every screen that now breaks.",
  },
  {
    n: "03",
    title: "Bind, don't fake",
    bodyHtml:
      "Replace each static mock-up with live data — home, archives, editorial board, guidelines. Once a page is mine, nothing on it is hardcoded.",
  },
  {
    n: "04",
    title: "Validate everything",
    bodyHtml:
      "Reactive forms with field-level rules: email verification, password match, mobile and pincode formats, cascading <code>country → state → city</code>. A form can't submit until it is actually valid.",
  },
  {
    n: "05",
    title: "Ship to the client",
    bodyHtml:
      "Out to the institution's production domain on RamanByte's Classroom+ infrastructure. Real users the next morning, not a staging link.",
  },
];

export const EXP_HERO_STATS: { v: string; k: string }[] = [
  { v: "~4 yrs", k: "At RamanByte" },
  { v: "Full-stack", k: ".NET · SQL Server · Angular" },
  { v: "93", k: "Commits on PIBM Journal" },
  { v: "Live", k: "PIBM Journal — ISSN 2455-8796" },
];

export const EXP_TECH_GROUPS: { label: string; items: { mono: string; name: string }[] }[] = [
  {
    label: "Front end",
    items: [
      { mono: "NG", name: "Angular" },
      { mono: "TS", name: "TypeScript" },
      { mono: "Rx", name: "RxJS" },
      { mono: "{ }", name: "SCSS" },
      { mono: "B5", name: "Bootstrap" },
      { mono: "Fl", name: "Flutter / Dart" },
    ],
  },
  {
    label: "Back end",
    items: [
      { mono: ".N", name: ".NET / C#" },
      { mono: "API", name: "ASP.NET Web API" },
      { mono: "SQL", name: "SQL Server" },
      { mono: "Pg", name: "PostgreSQL" },
      { mono: "Rd", name: "Redis" },
      { mono: "Sr", name: "SignalR" },
    ],
  },
  {
    label: "Platform",
    items: [
      { mono: "S3", name: "AWS S3" },
      { mono: "FB", name: "Firebase" },
      { mono: "Az", name: "Microsoft Azure" },
      { mono: "k6", name: "k6 load testing" },
      { mono: "Git", name: "Git · GitHub" },
    ],
  },
];
