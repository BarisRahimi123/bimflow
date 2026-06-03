# BIM 360 Docs and ADC — Training Script
## For ElevenLabs Voiceover (Lab 11)

> Bracketed headers are screen cues only — for syncing visuals. Paste ONLY the narration text underneath into ElevenLabs.

---

### [INTRO — Friendly, Welcoming Tone]

Hey there, and welcome back! In this lesson, we're going to talk about where all your project files actually live.

The document in front of you is the guide to the project's Common Data Environment — or as you'll hear people call it, the C-D-E. On this project, that environment runs on a tool called BIM 360 Docs.

Now, don't let the name scare you. I'm going to break this down so it makes complete sense. By the end of this lesson, you'll know exactly what BIM 360 is, why we use it, and most importantly — how to read this document so you can find your way around the folders without getting lost.

Let's get into it.

---

### [SECTION 1 — What Is a CDE, and Why Do We Care?]

First, the big idea. What is a Common Data Environment?

Think of it like one shared filing cabinet for the entire project. Every company, every subcontractor, every designer — we all put our files in the same place, and we all pull files from the same place.

Why does that matter? Because on a big construction project, you've got dozens of teams creating models, drawings, and scans every single day. If everyone kept their files on their own computer, it would be chaos. Nobody would know which version is the latest, and things would get missed.

The CDE solves that. It's the single source of truth. If the file is in the CDE, it's official. If it's not in the CDE, it doesn't count.

On this project, that cloud filing cabinet is BIM 360 Docs. It's free for you to use — your account gets provided at no cost. And there's a link right at the top of this document that takes you straight into the project.

---

### [SECTION 2 — How You Get In]

So how do you actually get access?

Right near the top of the document, under "Account Requests," there's a simple instruction. You send an email to the Hoffman contact listed there, and they send you back an access form.

On that form, you fill in the information for every team member who needs to get in. So if you've got three people on your team who need access, all three go on the form.

Quick coaching tip — don't wait until the last minute on this. Getting accounts set up takes a little time, so request access early so you're not stuck on day one unable to open anything.

---

### [SECTION 3 — Reading the Folder Structure]

Okay, here's the heart of the document — the folder structure. This is the part you'll come back to again and again.

Now here's something important to understand before we go further. What you see in the folders depends on your permission level. Some folders you can only look at. Some you can look at and download. And some — the ones meant for your company — you can actually upload to or fully control.

So if you open a folder and you can't upload, that's not a bug. It just means that folder is "view only" for you. The document explains this right at the start of the folder section.

Everything you care about lives under one main branch: zero-two underscore Hoffman, then zero-zero underscore BIM. That "00_BIM" folder is the root — the home base — for all the BIM data on this project.

Inside it, the folders are numbered. And that numbering is your roadmap. Let me walk you through the ones that matter most to you.

---

### [SECTION 4 — The Folders You'll Use Most]

Let's go folder by folder. I'll keep it quick and tell you what each one is *for*.

**Folder zero-zero — the Welcome Package.** This is your starting point. It holds all the supplemental guides — CAD standards, file naming guides, coordinate guides, workflow documents. Here's a pro tip the document actually recommends: subscribe to this folder. Click the three dots next to the folder name, hit Subscribe, and choose "this folder and all subfolders." That way, anytime a document gets updated, you get an email. You'll never miss a change.

**Folder zero-one — Published Federated Models.** This is where the live, combined project model lives. "Federated" just means lots of individual models stitched together into one. There's a live version that always carries the latest, and there are dated archive folders if you ever need to look back at an older version.

**Folder zero-two — NWF Files.** These are the source files the federated model is built from. You'll see status codes here. C-M means Construction Model. D-M-I means Design Model Issued. And D-M-W means Design Model Work In Progress. Those three labels tell you how finished a model is.

**Folder zero-three — Subcontractor CM Uploads.** Pay close attention here, because this is where YOU upload your files for coordination. And there are two rules you cannot mess up. One: export your files at Shared Coordinates. Two: leave the "Divide by Levels" checkbox UNchecked. And make sure your file names match the project's level and sector naming — if you're not sure how, that's exactly what the File Naming Guides in the Welcome Package are for.

**Folder zero-four — Subcontractor RVT Cloudshare.** This is where live, cloud-shared Revit models are hosted, organized by subcontractor. You control your own folder; everyone else can only read it.

**Folder zero-five — Subcontractor Folders.** Your company's own workspace for general use.

**Folder zero-six — IFC and DRB Model Files.** These are the official design models issued by the designer when a package is released. This is the design intent you're modeling from.

**Folder zero-seven — IFF Sign Off Files.** Once a coordination area is approved, the BIM coordinator stores the exact files used for that sign-off here, for the record.

**Folder zero-eight — Laser Scans.** Your 3D scans of existing conditions, used for coordination and routing.

**Folder zero-nine — Close Out, and folder ten — Object Enablers.** Close Out holds end-of-project documents. Object Enablers are little helper files that let everyone view specialized software geometry — if your files need one to display correctly, upload it here.

**And folder ninety-eight — File Exchange.** This one's simple. It's for passing big batches of files back and forth. Just give your folder a short, clear name and a date.

---

### [SECTION 5 — What ADC Does For You]

Now let's talk about that second part of the title — ADC, the Autodesk Desktop Connector.

Here's the simplest way to think about it. BIM 360 lives in the cloud. ADC is the bridge that makes those cloud files show up on your computer like they're regular files in a regular folder.

Why is that powerful? Because once a model is connected through ADC, it refreshes automatically. When someone updates the live federated model in the cloud, your linked file updates too — no re-downloading, no hunting for the newest version. The document points this out: the live models keep the same filename on purpose, so they can stay connected and refresh themselves.

So ADC is what keeps you always working with the latest information, without you having to think about it.

---

### [SECTION 6 — How To Actually Use This Document]

Alright, let me leave you with the most practical part — how to use this document day to day.

Don't try to memorize it. That's not the point. This is a reference guide. Think of it like a map of a building — you don't memorize every room, you just learn how to read the map so you can find the room you need.

So here's your simple habit. Whenever you need to do something — upload a file, find the latest model, grab a laser scan — come back to this document, look at the numbered folder list, and it tells you exactly where to go.

Two things I really want you to remember from today:

Number one — subscribe to the Welcome Package folder, so you're always notified when project rules change.

Number two — when you upload, follow the rules: Shared Coordinates, Divide by Levels turned off, and correct file naming. Get those right and your files drop straight into coordination with no problems.

And anytime you're unsure where something goes — don't guess. Reach out to the Hoffman BIM team. That's what they're there for.

That's it for this lesson. You now know what the CDE is, how to get in, how to read the folders, and how ADC keeps you up to date. Nice work — I'll see you in the next one.

---

*End of script.*
