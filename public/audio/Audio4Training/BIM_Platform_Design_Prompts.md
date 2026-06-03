# BIM Training Platform — Layout Brief & Design Prompts

This document contains three things:
1. **The Layout Brief** — the shared vision (use this so both tools design the same product)
2. **Prompt A — for Claude Design** (richer, narrative style)
3. **Prompt B — for Google Stitch** (structured, screen-by-screen style)
4. **How to compare the two results** (a simple scoring rubric)

---

## 1. THE LAYOUT BRIEF (shared vision)

**What it is:** A self-paced online learning platform for a BIM (Building Information Modeling) training course aimed at construction trade partners, drafters, and field teams. The course teaches BIM coordination workflows through short, audio-narrated lessons paired with reference documents and videos.

**The core experience:** Each lesson combines up to four content types — a primary **audio narration**, a **reference PDF document**, an optional **video**, and a **downloadable resources** list (new material types will be added over time). Students should be able to keep the audio playing while reading the reference document.

**Information architecture:**
- **Course Home / Dashboard** — resume-where-you-left-off card, overall progress bar, and the course broken into Units shown as cards. Global search.
- **Units** (5 of them): "Getting Set Up," "Coordinating the Model," "Reviewing & Clash Detection," "Why It Matters," and "Finishing & Closeout." Each Unit contains several Lessons.
- **Lesson page** — the heart of the product (described below).
- Persistent **left sidebar** with the full course outline (Units → Lessons), each item showing a status indicator (not started / in progress / complete).
- Persistent **mini audio player** docked at the bottom that keeps playing across page navigation.

**The Lesson page (modular template):** stacked, optional content blocks:
1. Breadcrumb (Unit › Lesson) + lesson title + estimated time + complete/incomplete status.
2. **Audio block (primary, prominent):** large play/pause, scrubber with time, skip back/forward 15s, playback speed (1x / 1.25x / 1.5x), and a waveform or progress bar. This is the focal point of the page.
3. **Reference Document block:** embedded PDF viewer with page controls, fullscreen, and a download button.
4. **Video block (optional):** embedded video player; hidden when a lesson has no video.
5. **Transcript block (collapsible):** the lesson script, expandable.
6. **Resources / Downloads block:** a clean list of attached files (PDFs, and future material types) with file-type icons and download buttons.
7. **Footer nav:** "Mark Complete" button + Previous / Next Lesson buttons.

**Design principles:** Clean, professional, and calm — this is for working construction/engineering professionals, not a flashy consumer app. Generous whitespace, strong typographic hierarchy, distraction-free reading, fully responsive (many students will listen on phones). Subtle technical/blueprint character is welcome but must not clutter. The progress and navigation should make it effortless to find any lesson and pick up where you left off.

**Extensibility:** The lesson template must gracefully handle lessons that have only some of the content blocks (e.g., audio + document but no video), and must accommodate new content-block types added later without breaking the layout.

---

## 2. PROMPT A — FOR CLAUDE DESIGN

> Paste everything below into Claude Design.

Design a clean, professional self-paced learning platform for a BIM (Building Information Modeling) training course. The audience is construction trade partners, drafters, and field teams — working professionals, so the tone should be calm, credible, and uncluttered, not a flashy consumer app. Think "well-organized technical academy," with generous whitespace, strong typographic hierarchy, and a subtle engineering/blueprint character (fine grid lines, restrained accent color) that never gets in the way of reading.

The course is built from short, audio-narrated lessons. Each lesson combines up to four content types: a primary audio narration, a reference PDF document, an optional video, and a list of downloadable resources. A key requirement: students must be able to keep the audio playing while they read the reference document and navigate between pages, so include a persistent mini audio player docked at the bottom of the screen that continues across navigation.

Please design these screens:

**1. Course Home / Dashboard.** A welcoming header with the course title. A prominent "Continue where you left off" card showing the last lesson and a resume button. An overall course progress bar (e.g., "7 of 18 lessons complete"). Below that, the course's five Units shown as cards — "Getting Set Up," "Coordinating the Model," "Reviewing & Clash Detection," "Why It Matters," and "Finishing & Closeout" — each card showing its lesson count and a small progress indicator. Include a global search bar in the top navigation.

**2. The Lesson page** (the most important screen). Use a two-region layout: a persistent left sidebar with the full collapsible course outline (Units expanding to Lessons), each lesson showing a status dot for not-started / in-progress / complete; and a main content area built as a stack of modular blocks:
- Breadcrumb (Unit › Lesson), the lesson title, estimated listening time, and completion status.
- A large, prominent AUDIO PLAYER as the visual focal point: big play/pause, a scrubber with elapsed/total time, skip-back and skip-forward 15-second buttons, a playback-speed control (1x / 1.25x / 1.5x), and a waveform or progress bar.
- An embedded REFERENCE DOCUMENT (PDF) viewer with page navigation, a fullscreen toggle, and a download button.
- An optional VIDEO player block.
- A collapsible TRANSCRIPT block containing the lesson script.
- A RESOURCES / DOWNLOADS block: a tidy list of attached files with file-type icons and download buttons.
- A footer with a "Mark Complete" button and Previous / Next Lesson navigation.
Important: the lesson template must look good even when some blocks are absent (for example, a lesson with audio and a document but no video), and it should be easy to add new content-block types later.

**3. A Unit overview page** listing that unit's lessons with their status, duration, and a one-line description each.

Make the whole thing fully responsive, including a mobile layout where the audio player remains easily reachable and the sidebar collapses into a menu. Show a cohesive visual system: a professional color palette (suggest a calm, trustworthy direction such as deep blue/charcoal with one warm accent), typography, buttons, cards, progress indicators, and the audio-player styling. Present it as a polished, real product a student would enjoy using to learn and easily find what they need.

---

## 3. PROMPT B — FOR GOOGLE STITCH

> Paste everything below into Stitch. (Stitch responds best to clear screen-by-screen definitions and style keywords.)

**App:** A self-paced online learning platform ("academy") for a BIM construction-coordination training course. Audience: construction trade professionals and drafters. Goal: easy navigation across ~18 short lessons and effortless access to each lesson's audio, reference document, video, and downloads.

**Style:** Clean, professional, modern, calm. Lots of whitespace, clear typographic hierarchy, card-based. Subtle technical/blueprint feel. Palette: deep navy and charcoal neutrals with a single warm accent (amber or orange) and plenty of white/light-gray space. Rounded corners, soft shadows. Fully responsive.

**Global components (persistent):**
- Top bar: logo, global search field, overall progress indicator, profile avatar.
- Left sidebar: collapsible course outline grouped into 5 Units, each expanding into Lessons; every lesson shows a status dot (empty / half / filled).
- Bottom mini audio player bar (persists across screens): track title, play/pause, scrubber, time, speed toggle.

**Screen 1 — Dashboard / Home:**
- Header with course title and short subtitle.
- Large "Continue where you left off" resume card with thumbnail, lesson name, and a Resume button.
- Course progress bar with "X of 18 lessons complete."
- Grid of 5 Unit cards: "Getting Set Up," "Coordinating the Model," "Reviewing & Clash Detection," "Why It Matters," "Finishing & Closeout." Each card shows an icon, lesson count, and a mini progress ring.

**Screen 2 — Lesson page (primary screen):**
- Breadcrumb (Unit › Lesson), lesson title, estimated time, completion badge.
- AUDIO PLAYER card (the hero of the page): large play/pause button, waveform/progress scrubber, elapsed/total time, skip ±15s buttons, playback speed control (1x/1.25x/1.5x).
- REFERENCE DOCUMENT card: embedded PDF preview with page controls, fullscreen icon, and download button.
- VIDEO card (optional): embedded video player.
- TRANSCRIPT: collapsible accordion containing the script text.
- RESOURCES card: list of downloadable files with file-type icons and download buttons.
- Sticky footer: "Mark Complete" button, Previous Lesson and Next Lesson buttons.

**Screen 3 — Unit detail:**
- Unit title and description.
- Vertical list of lessons; each row shows status dot, lesson title, duration, one-line description, and a chevron.

**Screen 4 — Mobile lesson view:**
- Same lesson content stacked single-column; sidebar collapses to a hamburger menu; the mini audio player stays pinned to the bottom.

Generate a cohesive design system (colors, type scale, buttons, cards, progress indicators, audio-player styling) and all four screens.

---

## 4. HOW TO COMPARE THE TWO RESULTS

Score each tool's output 1–5 on these, then pick the winner (or mix the best ideas from each):

| Criterion | What to look for |
|---|---|
| **Navigation clarity** | Can you find any of the 18 lessons in 2 clicks? Is the sidebar outline obvious? |
| **Audio-first handling** | Is the player prominent and usable? Does the design clearly support listening while reading? |
| **Modular lesson template** | Does the lesson page still look right with a block missing? Could a new content type be added cleanly? |
| **Document/video display** | Are PDFs and videos easy to view, fullscreen, and download? |
| **Progress & resume** | Is course progress and "continue where you left off" clear and motivating? |
| **Professional aesthetic** | Does it feel credible for working construction pros (not toy-like)? |
| **Mobile** | Is the phone layout genuinely usable, with the player reachable? |
| **Implementation-readiness** | How close is the output to something you (or a developer) could build directly? |

**Tip for a fair test:** give both tools the *same* sample lesson content (one of your actual lessons — e.g., "Newforma Konekt — Part 1: Getting Started," with its audio, the matching PDF, and a placeholder video) so you're comparing how each handles your real material, not generic filler.
