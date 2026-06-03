# Search & Selection Sets in Navisworks — Training Script
## For ElevenLabs Voiceover

> Bracketed headers are screen cues only — for syncing visuals. Paste ONLY the narration text underneath into ElevenLabs.

---

### [INTRO — Friendly, Welcoming Tone]

Hey there, and welcome! In this lesson, we're going to talk about one of the most useful navigation tools you'll find inside the published model — Search and Selection Sets.

Here's the simplest way to think about them: sets are like bookmarks for geometry. Instead of hunting through a massive model trying to grab all the electrical, or all the chilled water piping, someone has already saved those selections for you. You click one, and boom — there it is.

By the end of this lesson, you'll know the difference between the two kinds of sets, how to use them without slowing your machine to a crawl, and which sets are safe to lean on versus which ones come with a warning label. Let's get into it.

---

### [SECTION 1 — Three Things to Know Before You Start]

Before we touch a single set, let me give you three ground rules that'll save you a lot of frustration.

Rule one, and this is the big one: be very careful clicking on folders. If you click directly on a folder, it tries to run every single search set inside it, all at once. On a project this size, with files this big, that can lock you up for a long time while it churns. So instead of clicking the folder name, click the little triangle drop-down next to it to expand it. Triangle to open, not the folder itself. Burn that into your memory.

Rule two: there's a tool called Find Items. When you open the Find Items toolbar, you can see exactly what a search set is hunting for in the model's metadata. It's how sets get built, and it's also how you peek under the hood to understand what an existing set is actually looking for.

Rule three: the sets you see will be different depending on which model you open. A federated model has one collection of sets. A Jacobs Certified Model Content model — what we call a C-M-C model — has another. So don't be surprised when the panel looks different between the two. That's expected.

---

### [SECTION 2 — Search Sets vs. Selection Sets]

Okay, this is the core concept of the whole lesson, so let's be crystal clear. There are two kinds of sets, and the difference really matters.

First — Search Sets. A search set is dynamic. It doesn't memorize specific objects; it memorizes a rule — a set of criteria — and then it goes and finds everything that matches, live, every time. So if the model updates and new matching items appear, the search set automatically catches them. Those rules are built using the Find Items toolbar we just talked about.

Second — Selection Sets. A selection set is static. It's a fixed, frozen list of specific objects that someone picked at one moment in time. And here's the catch: if the model changes, a selection set can break, because the objects it memorized may no longer exist. You can spot a broken one by an unfilled square symbol next to it.

So why does this matter to you? Because search sets are generally more reliable — they keep up with the model. That's why we use them in most situations instead of selection sets. Dynamic beats static when the model is always moving.

---

### [SECTION 3 — Jacobs CMC Model Sets]

Now let's talk about the Jacobs C-M-C model — the Certified Model Content. When a design package gets released, Jacobs includes standard sets, and you'll find three of them grouped in a folder called "z-z, Package Deliverables."

Now here is the single most important rule in this whole section, so listen closely: only use the C-M-C selection set for contract scope isolation. When you need to know precisely what's in a contracted package — that one specific selection set is your source of truth. Don't substitute something else for it.

Let me walk you through the three sets, from most official to broadest.

The first one ends in "Issued" — Package, Discipline, Issued. This is the static selection set that holds the official content of the package. It's the one referenced on the BIM model coversheet for I-F-C packages. And I want to be emphatic here: never manually edit this set. Don't add to it, don't remove from it. It's a locked record. If you find something that's wrong or missing, you don't fix it yourself — you contact Hoffman to address it.

The second one is Package, Discipline. This is the discipline-specific scope for the package, and it's what gets used to build that Issued set above it.

And the third is just the Package by itself. This is the overall search set that contains all the discipline content in the package — the wide view.

---

### [SECTION 4 — Jacobs Sets in the Federated Model]

Now let's switch over to the federated model. Inside it, you'll find a folder called "JACOBS sets" — these are built by Jacobs to help you isolate their design data. Let me give you the tour of the folders you'll use most.

Design Discipline. This searches the model by trade — Architectural, Electrical, and so on. When you just want to see one discipline, start here.

Systems. Similar idea, but more granular — it isolates individual systems, like exhaust, power and controls, sanitary, or a specific chilled water line. When you need one system instead of a whole discipline, this is the folder.

Zones and Clearances. This folder holds sets for zones and clearance spaces. Hiding these can be genuinely helpful when you want a clean look at the equipment itself. But — and this is a real warning — there's a risk. If you hide the clearances, you can miss clashes that happen inside those clearance zones. So hide them to look, but don't run your clash review with them off.

And Review. This folder contains lists of the design packages you can search. They come pre-populated, but the guide asks you to cross-reference them against the Packages folder to make sure everything's accurate.

---

### [SECTION 5 — Hoffman Sets in the Federated Model]

Alongside the Jacobs sets, Hoffman provides its own sets, built for reference and to make selecting content easier. Two things to know here.

First — the UPN slash Discipline folder. This contains folders for each discipline and system, just like the Jacobs version. The nice difference is that the Hoffman search set descriptions usually carry more reference detail, so they can be easier to interpret. You'll see example folders in there like Mechanical Wet, broken down system by system.

Second — and here's another warning-label set — there's a folder called "All Objects to Hide." It's designed to help you declutter and navigate the model more comfortably. But the same caution applies as with clearances: if you hide objects, you take on the risk of missing clashes — especially clashes involving clearances and M-E-P insulation, which disappear from view when hidden. Use it to get around, but switch things back on before you trust a coordination check.

---

### [SECTION 6 — How to Actually Use This Day to Day]

Let me leave you with the practical habits.

One — navigate with the triangle drop-downs, never by clicking folders directly. Save yourself the load times.

Two — when you're not sure what a set does, open Find Items and read its criteria. The set will tell you exactly what it's grabbing.

Three — for official contract scope, trust the C-M-C selection set, and never hand-edit the Issued set. If something's wrong, that's a call to Hoffman, not a quick fix.

And four — anytime you hide zones, clearances, or objects to get a cleaner view, remember to turn them back on before you do clash work. Hidden things can't clash on your screen, but they sure can clash in the field.

One last note — the actual set panels shown in your guide can change as the project evolves, and the criteria files are provided on BIM 360. So if something looks different from the screenshots, that's normal — and when in doubt, reach out to a Hoffman BIM Coordinator.

That's it for this lesson. You now know your search sets from your selection sets, which ones to trust, and which ones to handle with care. Nice work — I'll see you in the next one.

---

*End of script.*
