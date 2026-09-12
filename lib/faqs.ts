// FAQ — direct answers to what recruiters, founders and collaborators ask
// most about the beliefs above, each grounded in a real project in THE RANGE.

export type Faq = {
  q: string;
  a: string;
};

export const FAQS: Faq[] = [
  {
    q: "What does it mean that intelligence is infrastructure?",
    a: "It means treating a model the way you'd treat a database or a queue — a layer other things get built on, not a plugin bolted onto a finished product. Nythera validates its own findings through an agent loop; IDBI Sarthi runs a four-stage RAG pipeline where each stage is independently inspectable and replaceable. In both, the AI is load-bearing, not decorative.",
  },
  {
    q: "Why do systems matter more than one-off execution?",
    a: "Because a one-off collapses the moment it needs to be extended, and almost everything real eventually needs to be extended. THE EVOLUTION's four simulators share zero dependencies but the same spec-first discipline — that's what let four separate simulators get built inside one convention instead of four disconnected ones.",
  },
  {
    q: "How does human identity survive automation?",
    a: 'By keeping the decisions that don\'t have a clean right answer in human hands — what a project is actually for, which finding gets published first, when "good enough" genuinely isn\'t. A model can flag a vulnerability; it still takes a person to decide to publish the audit before a client has to ask.',
  },
  {
    q: "Does craft still matter when AI accelerates execution?",
    a: "More than before, not less — speed just makes bad taste easier to ship at scale. A written design-system document exists so a colour is a decision made once and referenced everywhere, not fifty separate default choices left to whatever a generator happened to pick.",
  },
  {
    q: "Why is speed a creative advantage in AI-native work?",
    a: "Because the cost of testing an idea used to be the reason most ideas never got tested. Nine repositories in one range is what happens when that cost drops — not nine shortcuts, but nine full loops of spec, build and audit run back to back instead of one loop stretched across a year.",
  },
  {
    q: "What is an AI-native product builder?",
    a: "Someone who designs the system assuming a model is inside the loop from day one, rather than someone who bolts a chatbot onto a finished product afterward. The architecture, the data flow and the failure modes all get planned around that assumption from the first page of the spec.",
  },
  {
    q: "What is an AI generalist?",
    a: "Someone whose range is the point, not a lack of focus — comfortable writing a security audit, a token-based design system and a Three.js gallery in the same month, because the underlying discipline — specify it, build it, prove it — doesn't change with the domain.",
  },
  {
    q: "How does someone transition into AI-native software development?",
    a: 'The same way any of these repositories got built: by picking a real problem, writing down what "done" looks like before touching code, and treating the model as a collaborator whose output still has to be specified, reviewed and audited like anyone else\'s. Prior background matters less than the willingness to own the whole loop — spec, build, and the scrutiny after it ships.',
  },
];
