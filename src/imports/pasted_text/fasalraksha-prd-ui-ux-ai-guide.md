
FASALRAKSHA
AI-Powered Non-Invasive Stray & Grazing Animal Deterrent System
Product Requirements Document — UI/UX Plan & AI Build Agent Guide

Track B — AgriTech · Problem Statement 2
Smart Non-Invasive Stray & Grazing Animal Deterrent System for Crop Protection
Table of Contents
Table of Contents	2
1. Executive Summary	4
1.1 What This Document Covers	4
2. Problem Statement (Track B — Problem Statement 2)	4
2.1 Background	4
2.2 The Problem to Solve	4
2.3 Scope Elements Driving This Build	4
2.4 Expected Outcomes	5
3. Solution Overview — FasalRaksha	5
3.1 Core Pipeline	5
3.2 Product Pillars	5
4. Goals, Success Metrics & Personas	5
4.1 Product Goals	5
4.2 Success Metrics (for demo / prototype)	5
4.3 Personas	6
5. Information Architecture (Site Map)	7
5.1 Full Site Tree	7
5.2 Navigation Model	7
6. Design System	7
6.1 Colour Palette	7
6.2 Typography	8
6.3 Spacing, Grid & Elevation	8
6.4 Core Components & States	8
6.5 Accessibility & Responsiveness	8
7. Landing Page — UI/UX Specification	9
7.1 Hero Section	9
7.2 Problem Statement Section	9
7.3 Solution Overview Section	9
7.4 Key Features Section	9
7.5 How It Works Section	9
7.6 System Architecture Section	10
7.7 Demo Credentials Section	10
7.8 Team Section & Footer	10
8. Demo Login — UI/UX Specification	11
9. Dashboard Shell — UI/UX Specification	11
9.1 Left Sidebar	11
9.2 Top Bar	11
10. Overview Page — UI/UX Specification	11
11. Live Monitoring — Unified Control-Room View	12
11.1 Layout	12
11.2 Behaviour & Interaction Rules	12
11.3 Reference Layout	12
11.4 Components used	12
12. Detection History — UI/UX Specification	13
13. Alerts — UI/UX Specification	13
14. Settings — UI/UX Specification	13
15. Component Library & Folder Structure	14
15.1 React Component Inventory	14
15.2 Folder Structure	14
16. Technology Stack	14
17. AI Agent Build Guide	16
Phase 0 — Setup	16
Phase 1 — Landing Page	16
Phase 2 — Auth	16
Phase 3 — Dashboard Shell	16
Phase 4 — Live Monitoring (priority feature)	16
Phase 5 — History & Alerts	16
Phase 6 — Settings & Polish	17
Build Guardrails for the AI Agent	17
18. Live Demo Script (for Judging)	18
19. Acceptance Criteria	18
20. Appendix — Demo Credentials	18

 
1. Executive Summary
FasalRaksha (फसल रक्षा — “crop protection”) is an AI-powered, non-invasive animal intrusion detection and deterrent platform built for Track B, Problem Statement 2 of the. It replaces dangerous “Zatka” electric fences and flimsy saree fencing with an edge-AI vision system that detects approaching livestock and stray animals, classifies risk, and triggers safe, automated deterrents (light, sound, and water) before the animal crosses the field boundary.
This document defines the complete UI/UX plan for the FasalRaksha web application — landing site, authentication, and the live monitoring dashboard — and provides a structured, step-by-step build guide intended to be handed directly to an AI development agent (e.g. Figma Make AI, Bolt, Cursor, or a code-generation LLM) so it can construct the site with minimal ambiguity.
1.1 What This Document Covers
•	Problem framing and product positioning for FasalRaksha.
•	Complete information architecture (site map) with every screen accounted for.
•	A design system: colour palette, typography, spacing, and component states.
•	Page-by-page UI/UX specifications — purpose, layout, components, data, and interaction states.
•	A consolidated “Live Monitoring” control-room layout that merges camera feed, detection panel, and device controls.
•	A component library mapped to a React folder structure.
•	A phase-by-phase AI Agent Build Guide with explicit prompts/instructions per phase.
•	Non-functional requirements, demo flow, and acceptance criteria for judging.
2. Problem Statement (Track B — Problem Statement 2)
2.1 Background
In agricultural regions across Gujarat, farmers face severe crop destruction caused by grazing livestock — cows, buffaloes, goats, and wild pigs. Crops recently sprayed with pesticides pose a lethal chemical-poisoning risk to milch and domestic animals that graze on them. Farmers currently rely on low-cost, ineffective fixes such as saree fencing, or high-voltage “Zatka” electric fences, which are easily breached or pose severe safety hazards to wildlife, livestock, and farm labourers.
2.2 The Problem to Solve
Develop a low-cost, smart, non-invasive animal intrusion detection and deterrent system for small and medium-scale farmland that:
•	Uses affordable sensors, edge computing, or vision-based AI to detect approaching livestock and stray animals early.
•	Deploys non-lethal, dynamic deterrents (targeted acoustics, visual strobes, automated sprayers) to safely turn animals away before boundary crossing.
•	Sends real-time alerts to farmers so they can intervene or verify system action.
•	Operates reliably off-grid, on solar power, in outdoor field conditions.
2.3 Scope Elements Driving This Build
Detection	Low-cost edge AI (lightweight computer vision) identifying animal movement near field perimeters.
Deterrents	Automated, species-aware triggering of high-frequency sound, dynamic LED strobes, and motion-activated sprayers.
Alerts	Real-time mobile / dashboard alerts and solar-powered audio notification for the farmer.
Field Feasibility	Designed for off-grid, solar-powered, weather-durable operation.
2.4 Expected Outcomes
•	Elimination of hazardous electric “Zatka” fences and protection of livestock from pesticide-poisoning risk.
•	Reduced crop damage and financial loss from stray grazing.
•	A prototype substantially cheaper and more reliable than permanent physical fencing.
3. Solution Overview — FasalRaksha
FasalRaksha reframes the submission from “an AI detector” into a complete Farm Monitoring & Animal Deterrence Platform, where AI detection is one module inside a larger decision-and-response system.
3.1 Core Pipeline
Step 1	Camera / sensor array continuously monitors the farm perimeter.
Step 2	FasalRaksha AI (vision model) detects an animal in frame.
Step 3	The animal is classified by species (cow, buffalo, goat, pig, stray dog, etc.).
Step 4	The Decision Engine calculates a risk level from species, proximity, and boundary zone.
Step 5	A safe, non-lethal deterrent combination is triggered or recommended (LED / sound / water).
Step 6	The farmer is notified in real time via dashboard and simulated push alert.
Step 7	The incident (animal, confidence, risk, action, time) is logged to Detection History.
3.2 Product Pillars
•	Protect Crops — early detection before boundary crossing.
•	Protect Animals — non-lethal deterrents replace electric fencing.
•	Protect Farmers — real-time visibility and control without manual patrolling.
4. Goals, Success Metrics & Personas
4.1 Product Goals
•	Demonstrate an end-to-end detect → decide → deter → notify → log workflow live, on a single screen, for judges.
•	Make the AI's reasoning visible (confidence, risk, recommended action) rather than a black box.
•	Give the farmer persona full manual override at all times (Automatic vs Manual protection mode).
4.2 Success Metrics (for demo / prototype)
Metric	Target for Demo	Notes
Detection-to-alert latency	< 3 seconds	From bounding box appearing to alert card rendering
Bounding-box overlay accuracy (visual)	Clearly aligned to animal	Cosmetic correctness on the live feed
Manual override responsiveness	< 300 ms UI feedback	Toggle state changes instantly, device “confirmed” shortly after
Screens fully functional in demo	100% of core flow	Landing → Login → Live Monitoring → Alerts → History
4.3 Personas
Demo Farmer	Primary dashboard user. Small/medium landholder. Needs simple, glanceable status and one-tap control, not technical detail.
Judge / Evaluator	Views the landing page narrative and then the live control-room demo. Needs the AI reasoning and impact to be self-evident within 2–3 minutes.
Field Technician (future)	Installs and maintains cameras/sensors. Out of scope for this UI phase; noted for Settings extensibility.
 
5. Information Architecture (Site Map)
The IA below consolidates the original three-page split (Live Farm / Animal Detection / Control Panel) into one unified “Live Monitoring” control-room screen, per the recommended improvement, so a single detection event is visible, explained, and actionable without switching screens.
5.1 Full Site Tree
•	Landing Page
–	Hero Section
–	Problem Statement
–	Solution Overview
–	How It Works
–	Key Features
–	Technology Stack
–	System Architecture Diagram
–	Demo Credentials
–	Team
–	Footer
•	Demo Login
•	Dashboard (authenticated shell)
–	Overview
–	Live Monitoring  (merged: Detection + Camera + Control Panel)
–	Detection History
–	Alerts
–	Settings
–	Logout
5.2 Navigation Model
Public site (Landing) uses a top nav with in-page anchor links and a persistent “Try Live Demo” CTA. After login, the app switches to a fixed left sidebar + top bar shell (“security control-room” feel) used across all dashboard pages.
6. Design System
6.1 Colour Palette
Token	Hex	Usage
Background	#FFFFFF	Page background, cards on dashboard
Sidebar / Surface	#1E293B (Dark Slate)	Sidebar, top bar on dashboard, footer on landing
Primary	#0F5E3C (Emerald Green)	Primary buttons, active states, brand accents
Primary Dark	#0A3D28	Headings, hover states, pressed buttons
Danger / High Risk	#B3261E (Red)	High-risk badges, emergency stop, delete actions
Warning / Medium Risk	#B7791F (Amber)	Medium-risk badges, caution banners
Success	#1F9D55 (Green)	Low risk, “Online” / “Active” states, confirmations
Muted text	#5B6B63	Secondary text, captions, timestamps
Rationale: avoid saturating the interface in bright green. Emerald is reserved for brand/primary actions; slate anchors the control-room chrome; white keeps data-dense dashboard screens legible. This produces an “AgriTech meets Security Console” feel.
6.2 Typography
Display / Hero	Bold, large scale (48–64px) for the Landing hero headline only.
Headings (H1–H3)	Semi-bold, tightened letter-spacing; emerald or slate depending on surface.
Body	Regular weight, 15–16px equivalent, high contrast on white or dark slate.
Data / Monospace accents	Optional monospace or tabular-figure font for confidence %, timestamps, and sensor readouts to reinforce the “telemetry” feel.
6.3 Spacing, Grid & Elevation
•	12-column responsive grid on Landing; fixed 3-column control-room grid on Live Monitoring (Detection | Camera | Control) on desktop, stacking to a single column on mobile.
•	Base spacing unit of 8px; card padding 16–24px; section padding 64–96px on Landing.
•	Cards use a soft elevation (subtle shadow + 1px border in the line colour), rounded corners (12–16px radius) throughout.
6.4 Core Components & States
Component	States to design
DeviceSwitch (toggle)	Off / On / Pending (optimistic) / Auto-recommended (highlighted outline)
AlertCard / NotificationCard	New (unread, left accent bar) / Acknowledged / Archived
Risk Badge	Low (green) / Medium (amber) / High (red), always paired with a text label, never colour alone
Bounding Box overlay	Idle (no detection) / Detecting (pulsing) / Confirmed (solid box + label + %)
Buttons	Primary / Secondary / Danger (Emergency Stop) / Disabled
Connection Status pill	Online (green dot) / Offline (grey) / Reconnecting (amber, animated)
6.5 Accessibility & Responsiveness
•	Minimum text contrast ratio 4.5:1 against both white and slate backgrounds.
•	Risk and status are always conveyed by icon + text label + colour, never colour alone (colour-blind safe).
•	Dashboard reflows to a single-column stacked layout under 768px; sidebar collapses to a bottom or hamburger nav on mobile.
•	All interactive controls (toggles, buttons) have a visible focus ring for keyboard navigation.
 
7. Landing Page — UI/UX Specification
7.1 Hero Section
Purpose	Establish brand and one-line value proposition within the first viewport.
Layout	Full-bleed dark slate/green gradient background, centered content column, max-width ~720px.
Content	Wordmark “FasalRaksha”; tagline “AI-Powered Crop Protection System”; sub-line “Protect Crops. Protect Animals. Protect Farmers.”; two CTAs — “Try Live Demo” (primary, emerald) and “GitHub” (secondary, outline).
Background motion	Subtle looping animation: farmland silhouette, a scanning camera sweep line, and a soft cow outline graphic — decorative only, must not obstruct text contrast.
Components used	Navbar, Hero
7.2 Problem Statement Section
Purpose	Make the four core pain points scannable in under 5 seconds.
Layout	4-card responsive grid (4 → 2 → 1 columns as viewport narrows).
Cards	🐄 Crop Damage · ⚡ Dangerous Electric Fences · 🌱 Farmer Losses · 🐐 Animal Safety — each with icon, 3–5 word title, 1-sentence caption.
Components used	FeatureCard
7.3 Solution Overview Section
Purpose	Visualise the detect-to-notify pipeline as a single glance illustration.
Layout	Vertical (mobile) or horizontal (desktop) flow diagram: Camera → FasalRaksha AI → Animal Detection → Decision Engine → Safe Deterrent → Farmer Notification.
Components used	Timeline / custom flow SVG
7.4 Key Features Section
Purpose	Enumerate concrete capabilities for judges skimming the page.
Layout	3-column card grid.
Cards	📷 Live AI Detection · 🎥 Camera Monitoring · 📱 Instant Alerts · 🚨 Risk Analysis · 💡 LED Control · 🔊 Sound Control · 💧 Water Sprayer · 📊 Farm Dashboard · 📜 Detection History
Components used	FeatureCard
7.5 How It Works Section
Purpose	Narrate the 7-step operational flow in plain language.
Layout	Vertical connected timeline with numbered nodes 1–7.
Steps	(1) Camera monitors farm → (2) FasalRaksha AI detects animal → (3) Animal classified → (4) Risk calculated → (5) Deterrent recommended → (6) Farmer receives alert → (7) Incident stored.
Components used	Timeline
7.6 System Architecture Section
Purpose	Give technical credibility for the hackathon judges.
Layout	Single diagram: Edge camera/sensor → On-device inference (vision model) → Decision Engine → Actuator layer (LED / speaker / sprayer) → Cloud sync → Web dashboard → Farmer's phone.
Components used	Static SVG diagram
7.7 Demo Credentials Section
Purpose	Let judges self-serve into the live dashboard.
Layout	Centered card with copy-to-clipboard fields.
Content	Email: demo@fasalraksha.ai · Password: fasalraksha123 · Button: “Login”
7.8 Team Section & Footer
Purpose	Attribution and hackathon metadata.
Layout	Simple row of member cards (name, role, avatar placeholder); footer with links (GitHub, docs), problem-statement tag, and copyright line.
 
8. Demo Login — UI/UX Specification
Purpose	Frictionless entry into the authenticated dashboard for demo purposes.
Layout	Centered single card (max-width 400px) on a muted background; no navbar clutter.
Fields	Email, Password, primary “Login” button; helper text pre-filling or displaying demo credentials.
States	Default / Focused field / Invalid credentials (inline red helper text) / Loading (button spinner).
Components used	Navbar (minimal), a simple auth form
9. Dashboard Shell — UI/UX Specification
9.1 Left Sidebar
Purpose	Persistent primary navigation across all authenticated pages.
Content	Wordmark, then: Dashboard, Live Monitoring, Detection History, Alerts, Settings, Logout.
Style	Dark slate background, emerald active-state indicator (left bar + icon fill), icon + label per item.
Components used	Sidebar
9.2 Top Bar
Purpose	Contextual greeting and farm connectivity status, always visible.
Content	“Good Afternoon, Demo Farmer”; Farm Status pill (ONLINE / OFFLINE / RECONNECTING).
Components used	Navbar (dashboard variant)
10. Overview Page — UI/UX Specification
Purpose	At-a-glance daily summary the farmer checks first.
Layout	4-card KPI row, responsive to 2x2 then stacked.
Cards	Animals Today (12) · High Risk (3) · Alerts Sent (10) · Protection Status (ACTIVE).
Interaction	Each KPI card is clickable and deep-links to the relevant filtered view (e.g. “High Risk” → Detection History filtered to High).
Components used	DashboardCards
 
11. Live Monitoring — Unified Control-Room View
This is the flagship screen of FasalRaksha and the centrepiece of the live demo. It merges what were originally three separate pages — Live Farm Monitor, Animal Detection, and Control Panel — into one synchronized, three-column layout so a judge sees the entire detect → decide → deter loop without switching screens.
11.1 Layout
Column 1 — Detection	Current Detection card: Animal, Species, Confidence %, Risk badge, Boundary/Zone, Timestamp, and an AI Recommendation list (e.g. Flash LED ✓, Directional Sound ✓, Water ✕) with the reasoning line, e.g. “Cow detected near boundary.”
Column 2 — Live Camera Feed	Live/simulated webcam or video feed with a YOLO-style bounding box overlaid on the detected animal, label + confidence badge on the box (e.g. “Cow 97%”). Feed header shows a pulsing “LIVE” indicator.
Column 3 — Control Panel	Protection Mode selector (Automatic / Manual radio), three DeviceSwitch toggles — LED Strobes, High-Frequency Sound, Water Sprayer — each showing ON/OFF; a primary “ACTIVATE ALL” button; a destructive “TURN EVERYTHING OFF” Emergency Stop button, visually separated and always reachable.
11.2 Behaviour & Interaction Rules
•	When a new detection occurs, all three columns update together within the same render cycle — detection details, bounding box, and the AI's recommended toggle states light up simultaneously.
•	In Automatic mode, recommended devices trigger on their own and the toggles animate to their new state; in Manual mode, the recommendation still appears (as a suggestion, e.g. outlined highlight) but the farmer must tap to confirm.
•	Emergency Stop is always enabled regardless of mode and immediately overrides all active deterrents.
•	On mobile / narrow viewports, the three columns stack vertically in the order Detection → Camera → Control, preserving the same synchronized-update behaviour.
11.3 Reference Layout
Detection panel (left) | Live Camera Feed with bounding boxes (centre) | Control Panel with device toggles and Automatic/Manual mode plus Emergency Stop (right). All three panels re-render together on each detection event.
11.4 Components used
•	CameraFeed, DetectionCard, DeviceSwitch, Timeline (recommendation reasoning), plus shared status pill components.
 
12. Detection History — UI/UX Specification
Purpose	Auditable log of past intrusion events for review and trust-building with judges/farmers.
Layout	Sortable/filterable data table, sticky header row.
Columns	Time | Animal | Risk | Confidence | Action Taken.
Sample rows	10:02 Cow High 97% LED+Sound  •  11:15 Goat Medium 91% Sound  •  12:30 Pig High 95% LED+Sound+Water.
Interaction	Clicking a row opens a detail drawer/modal with the full detection snapshot (thumbnail, boundary, recommendation reasoning, farmer response).
Filters	By risk level, by animal species, by date range.
Components used	a filterable DataTable + detail modal
13. Alerts — UI/UX Specification
Purpose	Surface real-time and historical notifications distinctly from the raw history log.
Layout	Reverse-chronological feed of alert cards, newest first, unread items left-accented in the risk colour.
Alert card content	🚨 label, Animal detected, Confidence %, Risk badge, Boundary, Recommendation, Time.
Simulated phone notification	A secondary mock-up panel showing how the same alert would appear as a push notification (title “FasalRaksha”, animal + boundary + risk + recommended action + “Open Dashboard” button). Explicitly labelled as a simulated notification if real push is not implemented.
Components used	AlertCard, NotificationCard
14. Settings — UI/UX Specification
Purpose	Demo-level configuration surface; establishes extensibility beyond the hackathon build.
Fields	Farm Name, Camera Status, AI Model (name/version), System Version, Notification Settings (toggle channels).
Layout	Simple stacked form sections with save confirmation toast.
 
15. Component Library & Folder Structure
15.1 React Component Inventory
Component	Used on
Navbar	Landing, Dashboard top bar
Sidebar	Dashboard shell (all authenticated pages)
Hero	Landing
FeatureCard	Landing (Problem, Features sections)
CameraFeed	Live Monitoring
DetectionCard	Live Monitoring, Detection History detail
AlertCard	Alerts
DeviceSwitch	Live Monitoring (Control Panel column)
DashboardCards	Overview
NotificationCard	Alerts (simulated push mock-up)
Timeline	Landing (How It Works), Live Monitoring (recommendation reasoning)
Footer	Landing
15.2 Folder Structure
src/components/	Navbar, Sidebar, Hero, FeatureCard, CameraFeed, DetectionCard, AlertCard, DeviceSwitch, DashboardCards, NotificationCard, Timeline, Footer
src/pages/	Landing, Login, Dashboard, LiveMonitoring, DetectionHistory, Alerts, Settings
src/services/	api.js — mock/live data access layer for detections, alerts, device state
src/assets/	Icons, illustrations, background animation assets
src/hooks/	useDetectionFeed, useDeviceState, useAlerts (simulated real-time hooks)
src/utils/	Formatters (time, confidence %), risk-level helpers
src/App.jsx	Route definitions and authenticated shell wrapper
Note: the original site map listed Live Farm Monitor, Animal Detection, and Control Panel as three separate pages/routes. This PRD supersedes that with a single LiveMonitoring page (see Section 11) that renders the DetectionCard, CameraFeed, and DeviceSwitch components together in one three-column layout — reducing the page list in src/pages/ accordingly.
16. Technology Stack
Layer	Suggested Technology
Frontend	React (Vite), Tailwind CSS for styling, Framer Motion or CSS transitions for the bounding-box pulse and toggle animations
State / Realtime (demo)	Local state + simulated interval-based “detection events”, or WebSocket if a backend is available
Vision AI	Lightweight edge-capable model (e.g. YOLO-family) for animal detection and species classification
Backend (optional for hackathon)	Lightweight Node/Express or Python (FastAPI) service exposing detection, alert, and device-control endpoints
Hosting	Vercel / Netlify for the web app; edge device runs the vision model locally, syncing events to the cloud dashboard
 
17. AI Agent Build Guide
The following is written to be pasted directly into an AI build agent (Figma Make AI, Bolt, Cursor, v0, or similar) as a phased instruction set. Each phase should be completed and visually verified before moving to the next.
Phase 0 — Setup
1.	Scaffold a React + Vite project. Install Tailwind CSS and configure the colour tokens from Section 6.1 as custom theme colours (fasal-emerald, fasal-slate, fasal-danger, fasal-amber, fasal-success).
2.	Set up React Router with the routes: / (Landing), /login (Login), /dashboard (Overview), /dashboard/live (Live Monitoring), /dashboard/history (Detection History), /dashboard/alerts (Alerts), /dashboard/settings (Settings).
3.	Create the folder structure exactly as defined in Section 15.2 before writing any page content.
Phase 1 — Landing Page
4.	Build Navbar and Hero first, matching Section 7.1 exactly, including both CTA buttons and the decorative animated background (can be a simple CSS/SVG loop, not literal video).
5.	Build the Problem Statement 4-card grid (Section 7.2), Solution Overview flow (Section 7.3), Key Features 3-column grid (Section 7.4), How It Works timeline (Section 7.5), Architecture diagram (Section 7.6), Demo Credentials card (Section 7.7), and Team + Footer (Section 7.8) in that order.
6.	Verify: the Landing page tells the full FasalRaksha story top to bottom without needing the dashboard, since judges may only skim this far first.
Phase 2 — Auth
7.	Build the Login page per Section 8, pre-filling or displaying the demo credentials (demo@fasalraksha.ai / fasalraksha123) so judges can log in in one click.
8.	On submit, route to /dashboard and persist a simple “logged in” flag in memory/React state (no real auth required for the hackathon build).
Phase 3 — Dashboard Shell
9.	Build Sidebar and the dashboard-variant Navbar/top bar exactly as Section 9 describes, and wrap all /dashboard/* routes in this shared shell.
10.	Build the Overview page KPI cards (Section 10) with mock numbers (12 / 3 / 10 / ACTIVE) and make each card link to its related filtered view.
Phase 4 — Live Monitoring (priority feature)
11.	Build the three-column control-room layout exactly as specified in Section 11: Detection (left), Camera Feed with bounding box overlay (centre), Control Panel (right).
12.	Implement a simulated detection event generator (e.g. a timed interval or a “Simulate Detection” demo button) that updates all three columns together — this is critical for a convincing live demo without real camera hardware.
13.	Implement Automatic vs Manual protection mode, the three DeviceSwitch toggles, the ACTIVATE ALL button, and a clearly separated, always-enabled Emergency Stop button.
14.	Verify: triggering one simulated detection updates the detection card, draws/label the bounding box on the feed, and highlights the AI-recommended toggle states in the control panel, all within the same interaction.
Phase 5 — History & Alerts
15.	Build Detection History as a sortable, filterable table (Section 12) seeded with sample rows, with a row-click detail modal.
16.	Build Alerts as a reverse-chronological AlertCard feed plus one simulated phone-notification mock-up (Section 13), clearly labelled as simulated if push notifications are not wired up.
Phase 6 — Settings & Polish
17.	Build the Settings form (Section 14) with Farm Name, Camera Status, AI Model, System Version, and Notification toggles, plus a save confirmation toast.
18.	Pass over every screen and apply the accessibility rules in Section 6.5 (contrast, icon+label+colour for risk, focus states, mobile stacking).
19.	Run a full click-through of the demo flow in Section 18 and fix any place where a screen does not match its spec table above.
Build Guardrails for the AI Agent
•	Do not introduce additional top-level pages beyond those listed in Section 5.1 / 15.2 — Live Farm Monitor, Animal Detection, and Control Panel must remain merged into Live Monitoring, not rebuilt as separate routes.
•	Keep the colour usage disciplined per Section 6.1 — do not default to bright/saturated green across large surfaces; emerald is an accent, slate and white carry the interface.
•	Every risk indicator must show text + colour, never colour alone.
•	Emergency Stop must never be disabled, hidden, or require confirmation dialogs that would slow a real emergency response.
 
18. Live Demo Script (for Judging)
20.	Open the Landing page — walk through Hero → Problem → Solution → Features → How It Works → Architecture in under 90 seconds.
21.	Click “Try Live Demo,” log in with the demo credentials shown on the Demo Credentials section.
22.	Land on Overview, glance at the four KPI cards, then navigate to Live Monitoring.
23.	Trigger a simulated detection (e.g. “Cow, North Boundary”). Narrate the Decision Engine's reasoning as it appears in the Detection column.
24.	Show the bounding box and confidence appear live on the Camera Feed column, and the recommended toggles highlight in the Control Panel column.
25.	Switch Protection Mode to Manual, confirm the recommended action manually, and demonstrate the Emergency Stop.
26.	Open Alerts to show the corresponding alert card and simulated phone notification.
27.	Open Detection History to show the event logged with full details.
19. Acceptance Criteria
•	All pages in Section 5.1 exist, are reachable via the navigation defined in Section 5.2, and match their spec tables.
•	Live Monitoring updates all three columns from a single simulated or real detection event.
•	Automatic and Manual protection modes both function, and Emergency Stop always overrides device state.
•	Detection History and Alerts both reflect any simulated detection triggered during the demo.
•	The interface passes the accessibility checks in Section 6.5 (contrast, colour+label pairing, focus states, mobile stacking of the three-column Live Monitoring layout).
20. Appendix — Demo Credentials
Email	demo@fasalraksha.ai
Password	fasalraksha123

End of document.
