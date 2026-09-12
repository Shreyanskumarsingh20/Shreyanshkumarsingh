// PHILOSOPHY — six operational beliefs traced through the work in THE RANGE.

export type Belief = {
  no: string;
  title: string;
  body: string;
};

export const BELIEFS: Belief[] = [
  {
    no: "01",
    title: "Intelligence Is Infrastructure",
    body: "AI stopped being a feature somewhere around the second project in this range. It's the layer other systems get built on top of — the one that turns a document pile into a bank's RAG tool, or nine findings into a research board. The advantage isn't access to a model anymore. It's knowing how to architect around one.",
  },
  {
    no: "02",
    title: "Systems Compound",
    body: "A one-off build stops paying you back the day it ships. A system — modules that specify, tokens that don't drift, numbers that trace to a source — keeps paying you back every time it's reused, extended or audited. Everything in THE RANGE is built to be picked up cold, including by a future version of me.",
  },
  {
    no: "03",
    title: "Human Identity Must Survive Automation",
    body: "The parts of this work a model can't do are the parts worth protecting: deciding what a project is even for, choosing cube-root scaling over an ellipse, knowing which finding to report first. Automation raises the floor. It doesn't replace the judgment call at the top.",
  },
  {
    no: "04",
    title: "Craft Still Matters",
    body: "Execution got faster; taste didn't get automated with it. A spec that's actually legible, a design token that's actually reused, a self-audit that leads with the worst finding instead of burying it — that's the difference between work that reads as considered and work that reads as generated.",
  },
  {
    no: "05",
    title: "Speed Is A Creative Advantage",
    body: "Nine repositories, five languages, one person — because the gap between having an idea and having it running got small enough to stop being a bottleneck. Building fast isn't a shortcut around rigor; the bible and the audit still get written. It's what makes that rigor affordable at this pace.",
  },
  {
    no: "06",
    title: "The Operator Evolves",
    body: 'Nobody on this range shipped as "just a developer." Spec-writer, designer, security auditor, systems thinker, and the person deciding where the AI belongs in the loop — all the same person, on the same repository, in the same week. That convergence is the job now, not a side skill.',
  },
];
