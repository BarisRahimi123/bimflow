# The BIM Execution Plan (CPEP) — Part 2: The Coordination Lifecycle
## Course Orientation — Script for ElevenLabs

> Bracketed headers are screen cues only — for syncing the slides. Paste ONLY the narration text underneath into ElevenLabs.

---

### [INTRO — Friendly, Welcoming Tone]

Welcome back! This is part two of our orientation to the BIM Execution Plan.

In part one, we covered the foundations — the documents, the team, the setup, and the files. Now we put it all in motion. This lesson is the lifecycle: how a piece of work travels from a spot on the schedule, through coordination, into an approved fabrication release, out to the field, and finally into the project record at closeout.

Each of these stages has its own detailed lesson elsewhere in the course. Today I'm giving you the map of the whole journey, so when you dive into those, you'll know exactly where you are. Let's go.

---

### [SECTION 1 — The Schedule and "Routing Priority"]

Everything starts with the schedule. The Contractor lays out a schedule of BIM coordination and IFF activities, and it's tied into the master project schedule — the C-P-M schedule, tracked in P6.

For you, the first responsibility is simple but real: be adequately staffed and give the coordination the time it needs. This isn't a side task you squeeze in.

Now here's the single most motivating concept in this whole section — routing priority. Listen closely, because it directly affects how hard your job is. Routing priority is granted to subs who submit their IFF on time. What does that buy you? The good routes. If you're on time, you get to claim your space first. If you miss your IFF date, you may be forced to route your systems around everyone who was already approved — snaking your pipe around their committed work. On time, you lead. Late, you follow. That's the incentive, and it's a powerful one.

There's one exception that overrides even timing: monumental scope. Big, inflexible things — large-bore ductwork, structural steel, big modular assemblies, multi-discipline racks — get priority because they simply can't move. So even if your small, flexible conduit was approved first, you might be asked to revise and resubmit if a monumental scope needs that space. Think of it like traffic: the loaded freight truck gets the right of way over the bicycle, because the bike can maneuver and the truck can't.

---

### [SECTION 2 — Coordination, Deviations, and the A-9 Tolerances]

Now the coordination itself. The golden rule: follow the design model routing whenever you possibly can. The design is the plan — start there.

But reality intervenes. Sometimes you can't follow the design exactly. When that happens, you have a ladder of options before you escalate: re-route proactively, coordinate directly with the other subs, or use an allowable deviation from the design. And this is where a key document comes in — the engineer of record's A-9 document. The A-9 defines the allowable tolerances — how far your construction model is permitted to drift from the design before you need formal design approval. Within A-9 tolerance, you can adjust. Outside it, you have to write an R-F-I and get the design team's answer.

A few hard requirements here. You must actively clash your scope against the federated model and document every clash with a Newforma Konekt issue ticket — including clashes that might be someone else's responsibility. And here's the etiquette rule that keeps meetings short: resolve issues among yourselves first. The only issues that should reach a coordination meeting are the ones the trades genuinely couldn't solve on their own. Meetings are for the hard stuff, not the easy stuff you could've handled with a phone call.

---

### [SECTION 3 — IFF: The Heart of the Whole Process]

Now we reach the center of everything — the IFF, Issued For Fabrication. If you understand nothing else, understand this.

What is an IFF, really? Two things: a reservation of space, and a mitigation of risk. When your scope is IFF'd, it means it's been coordinated against the latest design and it's cleared for fabrication and field installation. That space is now reserved for you. And it's a prerequisite — you don't make shop drawings or fabricate material until you have it. Every system submits for IFF — yes, even architectural and structural, not just MEP.

Here's a consequence that creates real accountability: if your scope is incomplete or unapproved and it ends up conflicting with someone else's already-approved IFF work — that's on you. The trade whose model wasn't ready owns the problem. So being late isn't just your risk; it can become your bill.

Let me walk you through how an IFF actually gets reviewed, because it's a two-stage gate. You initiate the submittal on Procore, using the latest files from your uploads folder. First comes the conceptual review — the MEP construction managers and subs look at the big picture: is the package complete, is it constructible, are issues resolved? If it passes that, then the BIM Coordinators do the technical review — the detailed check against the latest federated model. Two gates: big-picture first, technical detail second.

Three outcomes. If it's acceptable, it's approved — done. If it's not, it's returned to you to revise and resubmit. And if there are only minor issues, the coordinator may grant a CONDITIONAL status — meaning it can move forward, but you have to resolve those conditional items within 14 days. Conditional is a "yes, but fix these soon," not a free pass.

A couple of practical limits and details: you're capped at two IFF submissions per day unless the BIM Manager approves more. Your IFF metadata tags need to be on the geometry itself — best to populate those while you're detailing, not scrambling at the end. Approved IFF files get archived on BIM 360, and the IFF log lives in Procore so everyone can see status. And approved IFF files get sent to the design team to inform design changes and RFI responses — which leads to a critical warning: if you make undocumented model changes, or the field changes without being recorded, the design team will not incorporate them, and fixing the resulting mess may be on your dime. Document everything.

One more thing to know exists: a re-IFF. You re-submit when a design bulletin or an RFI significantly changes scope you'd already IFF'd, or when an approved field route needs to be made official in the model.

---

### [SECTION 4 — Model to Field: Where Pixels Become Pipe]

An approved IFF is a promise, and the field has to keep it. So every sub builds a Model-to-Field plan — a defined way to communicate the IFF'd design to the field crew and verify that what gets installed actually matches.

Here are the tolerances, and they're worth memorizing. The standard accuracy for the field to match the IFF routing is plus-or-minus one inch. But in areas of critical coordination — lateral racks, points of connection, tool install — it tightens way down to a quarter inch. So: an inch normally, a quarter inch where it's tight.

And the rule that ties the field back to the model: if a field condition forces a change, that change has to flow back to your BIM team so the construction model gets updated and re-IFF'd. The field and the model can never silently disagree — if the field moves, the model moves with it. Because remember from the IFF section: undocumented changes are your risk.

---

### [SECTION 5 — Closeout: Crossing the Finish Line]

Finally, closeout — and there's a detailed lesson on this, so here's the orientation version.

At the end, you submit Record Models — your final, official models. They have to be clash-free and compliant with the project's layer and naming standards. Before you submit, all your significant Newforma Konekt issues must be resolved, and anything that changed significantly after its IFF has to be re-IFF'd first. Your record models also have to reflect the actual field-routed conditions, within those same tolerances from the model-to-field section.

Files go in via BIM 360 for audit, and they're tracked per building for percent-complete. And here's the line that gets everyone's attention — the same one from the closeout lesson: final payment is withheld until your record models are compliant and approved. Closeout isn't optional housekeeping; it's the last gate between you and your final check.

---

### [OUTRO]

And that completes your orientation to the entire BIM Execution Plan.

Let me give you the whole lifecycle in one breath: you claim your space by hitting your schedule and earning routing priority; you coordinate, staying within the A-9 tolerances and RFI-ing what you can't resolve; you get your scope IFF'd through the conceptual and technical reviews; you install it in the field within tolerance, feeding any changes back to the model; and you finish by submitting clean record models at closeout to release final payment.

Every other lesson in this course lives somewhere on that path. Now that you can see the whole map, go explore the detailed stops along it. Great work — this is the backbone of everything, and you've got it.

---

*End of script.*
