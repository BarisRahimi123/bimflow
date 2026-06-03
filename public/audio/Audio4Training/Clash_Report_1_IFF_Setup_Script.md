# Clash Reporting for IFF — Part 1: The Setup
## Clash Report Training, Part 1 — Training Script for ElevenLabs

> Bracketed headers are screen cues only — for syncing the software screenshots. Paste ONLY the narration text underneath into ElevenLabs.

---

### [INTRO — Friendly, Welcoming Tone]

Hey there, and welcome! This is part one of a three-part series on running clash reports for an I-F-F review.

Quick reminder of where this fits: you've already learned about search and selection sets, and you've seen the big-picture collaboration workflow. This series is the hands-on version — actually sitting down in Navisworks and running the clash review that decides whether a model is clean enough to be Issued For Fabrication.

Here's how the three parts break down. Part one — today — is all setup: getting your sets, your colors, and your clash report ready before you review a single clash. Part two is running the actual review. And part three is what to do when an I-F-F comes back for a second look.

Now, I'll be honest — part one is the least glamorous part. But if you get the setup right, the review goes smoothly. If you rush it, everything downstream gets messy. So let's do it properly.

---

### [SECTION 1 — The Color System]

Before the steps, let me give you the big idea, because this whole setup runs on a color code. Three colors, three meanings. Lock these in:

GREY is the construction model files you're putting up for I-F-F — the trade's actual work being reviewed.

YELLOW is the design model, set up for a one-to-one comparison — so you can check whether the trade actually followed the design.

And RED is the I-F-F search set — the specific I-F-F scope you're clashing against.

Grey is their work, yellow is the design to compare against, red is the I-F-F scope. Once you see the model in those colors, you instantly know what you're looking at. Let's build them.

---

### [SECTION 2 — Building Your Selection and Search Sets]

Step one. Create a selection set of the construction model files being asked to I-F-F, and color those files GREY. That's your "C-M Files for I-F-F" set.

Step two. If it applies, create a selection set of the design model version of that same content, and color it YELLOW. This is your "D-M one-to-one" — it lets you compare side by side and see whether the trade is following the design model or drifting from it.

Step three. Now create a search set of the construction model by searching the I-F-F number. And here's a time-saver: Hoffman has already built I-F-F template search sets for each company, sitting in the Sets panel under the folder "Hoffman I-F-F Search Sets." You don't build it from scratch — you grab the template and just change the value to the specific I-F-F you're clashing. Color this one RED.

So now you've got grey, yellow, and red sets defined. Good — that's the foundation.

---

### [SECTION 3 — Wiring Up the Clash Selection]

Step four. Click the RED I-F-F search set you just made. Then right-click the special set called "Clash Report Selection Set — Update and Clash Against," and choose Update. In plain terms, you're telling the clash report, "this red scope is what I want you to test."

Step five. With your grey "C-M File for I-F-F" set selected, click "Hide Unselected." Everything else disappears, and you should now be looking at just your GREY and RED objects. Clean view, only what matters.

---

### [SECTION 4 — The Tagging QA/QC Step (Don't Skip This)]

Step six. This one's easy to overlook, and skipping it will quietly break your report — so pay attention.

You need to Q-A-Q-C the tagging quality in the trade's files. As you go, create viewpoint notes anywhere items aren't properly tagged. But here's the critical part: when you find untagged objects, you have to select them and add them into that "Update and Clash Against" set, alongside the objects that are already tagged correctly.

Why does this matter so much? Because if an object isn't captured in that set, the clash report simply won't test it. Untagged and unselected means invisible to the clash — and an untested clash is a clash you'll find out about in the field, the hard way. So fold those untagged items in now.

One small comfort from the guide: once you've finished the one-to-one and the set review, you're free to reset the grey and yellow content back to their original colors. The colors are a working tool, not permanent.

---

### [SECTION 5 — Setting Up the Clash Report Itself]

Now the clash report. Good news — most of it's done for you. All the clash batches come preselected inside the Selection A and Selection B boxes. You don't have to build those pairings by hand.

There's just one exception: the very last clash batch. For that one, you need to manually select your "C-M Files for I-F-F" — the grey set you made back in step one. That last batch is the self-check, the trade's scope against its own scope.

Then you click "Update All," and the report runs. That's it — your setup is complete and the clash report is loaded and ready.

---

### [OUTRO]

So that's the full setup. You built grey, yellow, and red sets, wired the red scope into the clash selection, folded in any untagged items, and ran Update All on the report.

Take the setup seriously and the review almost runs itself. In part two, we'll actually work through the clashes — sorting the real problems from the noise. See you there.

---

*End of script.*
