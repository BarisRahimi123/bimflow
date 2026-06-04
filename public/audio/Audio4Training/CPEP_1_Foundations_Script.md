# The BIM Execution Plan (CPEP) — Part 1: Foundations
## Course Orientation — Script for ElevenLabs

> Bracketed headers are screen cues only — for syncing the slides. Paste ONLY the narration text underneath into ElevenLabs.

---

### [INTRO — Friendly, Welcoming, "Start Here" Energy]

Hey there, and welcome! If you only watch one lesson before the others, make it this one. This is the master plan for the entire project — the document everything else is built on.

It's called the CPEP — the BIM Construction Project Execution Plan. Think of it as the rulebook and the map combined. It tells you how BIM coordination runs on this job, who does what, where the files live, and how work flows from design all the way to closeout. Almost every other lesson in this course — the workflows, clash detection, the IFF process, closeout — is really just a deep dive into one section of this plan.

This is a big document, so I've split it into two lessons. Part one, today, is foundations: the document hierarchy, the team, the project setup, and how files are managed. Part two will be the coordination lifecycle — how work actually moves through the project. Let's build your foundation.

---

### [SECTION 1 — Three Documents, Three Jobs]

First, let's clear up something that confuses a lot of people. There isn't just one document — there are three, and they each do a different job.

Document one is this CPEP — the execution plan. It's the means and methods: how coordination gets done. It's the big-picture playbook.

Document two is the BIM Requirements. This one is the contract — the binding agreement between the Contractor and you, the subcontractor. It spells out exactly what you have to model, and to what Level of Development — what we call L-O-D. So if the CPEP is the playbook, the BIM Requirements is the contract that holds you to it.

Document three is the BIM Welcome Package. This is your toolbox of guides and how-tos — the platform specifics, the file-naming guides, the step-by-step user guides. Whenever a lesson says "see the Welcome Package," it means go grab the detailed instructions there.

So remember the trio: the CPEP is the plan, the BIM Requirements is the contract, and the Welcome Package is the how-to. When you're not sure where to look, that's your map.

---

### [SECTION 2 — Who's Who on the Team]

Now, who are you actually working with? You don't need to memorize every title, but knowing who does what tells you who to call when you're stuck. Let me introduce the key players on the Contractor's BIM team.

The BIM Manager runs the whole BIM operation — sets the strategies and workflows, interfaces with Design and the Owner, organizes training, and owns the IFF process.

The BIM Coordinator is the one you'll interact with most during coordination. They manage the Navisworks coordination models, run clash detection, manage the clash reports and the Newforma Konekt issues, run the coordination meetings, and handle IFF review and approval. So if it's about a clash or getting your IFF reviewed — that's your Coordinator.

The BIM Integrator is the bridge to the schedule and the field. They run the design review meetings with the subs, the construction managers, the engineer of record, and the Owner — and they report out on IFF status to everyone.

And the BIM Technician keeps the machinery running. They publish the federated model files, process the design packages, manage the common data environment, and — importantly for you on day one — they handle subcontractor account setup for Newforma Konekt and BIM 360, and they run the help desk. So when you need access or you're stuck on the platform, the Technician is your person.

There are also cross-department players: the MEP system leads and construction managers, who attend coordination and sign off on the constructability of your IFF packages; document control, who manage package transmittals and archiving; scheduling; and the Q-A-Q-C team for field quality. The point of all this: it's a team sport, and there's always a right person to bring an issue to.

---

### [SECTION 3 — Project Setup: Speaking the Same Language]

Before anyone models anything, the project sets ground rules so everyone's files actually work together. Three big ones: software, coordinates, and units.

First, software. The project specifies exact software versions, and everyone has to use them — for one simple reason: interoperability. If you're modeling in Revit, you must use the project's specific Revit version. Here's why that matters with a concrete example: if you model in a newer Revit than everyone else, the design team can't open or integrate your detailing at closeout — your file becomes an island. Same version means everyone's models combine cleanly. And if you work in non-Autodesk software, you have to provide D-W-Gs along with N-W-Cs that line up to the project coordinate system.

Second, coordinates. Picture every model needing to share the same origin point in space, so when they're combined, they line up perfectly. The buildings use the project's campus local coordinate system. Here's the classic gotcha: civil utilities come from the design team in a different system — the civil coordinate system — so those models have to be transformed into the project system, or your underground utilities will show up in the wrong place entirely. There's a Contractor Revit template on BIM 360 to help you get this right.

Third, units. This project uses a mix of Imperial and Metric, depending on the system or area. Imperial is the primary language for coordination — that's what you'll communicate in — unless you're working a system that's natively metric. And the rule that prevents a thousand tiny clashes: model accurately, and don't rely on rounding your dimensions. A model built on rounded numbers drifts, and drift becomes conflict.

One more setup point: every piece of model geometry gets tagged with defined attributes — extra data beyond what the object naturally carries — to make coordination work. More on why that matters in a moment.

---

### [SECTION 4 — The File Alphabet]

Okay, this section is the vocabulary of the entire project. The files are labeled with two-letter type designators, and once you know them, the whole system reads like plain English. Let me teach you the alphabet.

D-M is a Design Model file — the design team's model, authored in Revit. You'll also see D-X, which is the same idea but authored in CADWorx.

C-M is a Construction Model — and that's yours. It's the model you, the trade, build.

F-M is the Federated Model — the big combined model where everyone's work comes together.

E-M is an Existing Model — existing conditions. And X-M is a model containing deleted scope — work that got removed.

Two more you'll see constantly. D-M Issued is the official, contractually-released design — the team literally calls it the "latest and greatest." And D-M W-I-P is design that's still work-in-progress — included for early context, and purged once the real design is issued.

Learn those, and a filename stops being a mystery and starts telling you exactly what you're looking at.

---

### [SECTION 5 — How Files Live on BIM 360]

So where does all this live? On the BIM 360 hub — the project's common data environment. A few rules that affect you directly.

When you upload, you upload your Construction Model N-W-Cs together with the original source file — your D-W-G, R-V-T, Tekla, or S-D-S-2 file. And here's a specific one for Revit users: you also have to export and include a D-W-G alongside your N-W-C. Why? So other trades can reference and link to your work. Your files aren't just for you — they're a resource the whole team links against.

You'll get your own permissioned folder to host your central models for your team — everyone else can see and download, but only you can edit. Published federated models live on BIM 360 too. And one practical gate: BIM 360 access requires an N-D-A, and you submit your user list on the contact form from the Welcome Package.

There's also Newforma Konekt — the issue-tracking tool. Every sub is required to install the Newforma Konekt add-on into Navisworks Manage, and it's recommended you add it to Revit, AutoCAD, and your other authoring tools too, so you can handle issues right where you work. It exists because Navisworks alone can't do back-and-forth communication — Newforma adds that two-way conversation. There's a whole separate lesson on Newforma, so I won't go deep here.

---

### [SECTION 6 — Two File Rules Worth Tattooing On Your Brain]

Within file management, two rules cause the most trouble when ignored, so let me spotlight them.

Rule one: do not re-use design model geometry. When you're awarded scope, you build your own Construction Model with accurate, real dimensions and real products. You can't just copy the designer's model and call it yours. The design model shows intent; your model shows what actually gets built. Different jobs — model your own.

Rule two: upload on a regular cadence — at least twice a week, and always the day before the next meeting. Coordination only works if everyone's looking at current work. A model you updated last week but didn't upload is invisible to everyone else, and invisible work clashes in the field. Upload early, upload often.

And for inclusion in the federated model, you'll divide your construction models by level and by coordination sector into separate files — there are sector maps in the Welcome Package to guide that.

---

### [SECTION 7 — When Documents Disagree: The Order of Precedence]

Here's a subtle but important one. Sometimes the design documents conflict with each other — the specs say one thing, a drawing shows another. So which wins? The CPEP defines an order of precedence — a tiebreaker hierarchy.

You don't need to recite the whole list, but understand the shape of it. The written specifications sit at the top. Then the P&I-D — the piping and instrumentation diagram. Then there's a careful ranking between certified 2D details and certified 3D models. And more detailed drawings beat less detailed ones — a zoomed-in detail outranks an overall plan sheet.

Here's the practical version, the part to actually remember: when the question is about space — does it physically fit, does it clash — the certified 3D model governs. When the question is about material — what is it made of, what spec does it meet — the written specifications govern. Space, trust the 3D. Material, trust the specs. That single rule of thumb resolves most real-world disagreements.

And one safety note on existing conditions: any existing-condition dimensions must be field-verified before you model, fabricate, or install. Never trust an existing model blindly — go measure.

---

### [OUTRO]

That's your foundation. You now know the three governing documents, who's on the team and who to call, the setup rules that keep everyone's models compatible, the file alphabet, and the two file habits that keep coordination honest — model your own geometry, and upload often.

In part two, we put this foundation in motion — the actual lifecycle of the work, from the coordination schedule, through clash resolution and the IFF process, out to the field, and finally to closeout. That's where it all comes together. See you there.

---

*End of script.*
