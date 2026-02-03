# 📄 Product Requirements Document (PRD)

## Product Name

**Creator OS**
---

## 1. Overview

### 1.1 Problem Statement

Managing social media creation at scale requires tracking performance, competitors, community engagement, and creative inspiration. Today, these elements are fragmented across platforms (Instagram analytics), tools (Notion), and memory. This fragmentation causes lost insights, suboptimal posting decisions, and weak community leverage.

### 1.2 Solution

Creator OS is a centralized dashboard for creators to **understand performance, analyze competitors, structure creative insights, and strengthen community awareness**, without replacing existing tools like Notion.

### 1.3 Why Now

The creator workflow has reached a scale where:

* Manual tracking no longer works
* Platforms focus on surface-level analytics
* Community value (superfans, loyal followers) is underutilized
* Competitive analysis lacks structure and context

This product is built first for internal use, then evolved into a public SaaS.

---

## 2. Goals & Non-Goals

### 2.1 Goals (V1)

* Centralize Instagram performance insights
* Identify and understand top followers and community behavior
* Track competitors and extract creative patterns
* Create a reusable system for hooks and script structures
* Support creator decision-making (what to post, when, and why)

### 2.2 Non-Goals (V1)

* Multi-user support
* Authentication system
* Posting or commenting from the app
* Full content production (editing, publishing)
* Replacing Notion or external writing tools

---

## 3. Target User

* Primary: **Single creator (Me)**
* Secondary (V2): Content creators, indie creators, tech creators, influencers

---

## 4. Platforms & Scope

* Platform: **Web app (V1)**
* Mobile app: Planned for V2
* Supported social platforms (V1):
  * Instagram only
---

## 5. Core Product Pillars

### 5.1 Performance Insights (My Account)

**Key Features (V1):**

* Best posting time analysis:
  * Based on historical post performance
  * Suggest unexplored posting times for experimentation
  
* Top-performing posts (reference-level, not competing with IG native analytics)
  
**Explicitly Deprioritized:**

* Followers growth graph
* Engagement rate overview
* Likes/comments raw stats (already available on Instagram)

---

### 5.2 Community & Followers Intelligence

**Key Features (V1):**

* Top likers:
  * Frequency-based ranking
  
* Top commenters
  * List of comments per user:
  
* Most loyal followers:
  * Weighted score (likes + comments + story replies)
  
* New vs old followers
* Silent followers (low priority, informational only)

**Community Insights:**

* Identify **why** a user is considered a top fan
* Examples:
  * “Liked [X] posts”
  * “Commented [X] times (see comments)”

**Lists & Segmentation:**

* VIP followers
* Superfans
* Custom lists (manual curation)

**Actions (Limited):**

* Open Instagram profile
* No messaging or commenting from the app

---

### 5.3 Competitor Tracking

**Scope:**

* Unlimited competitors (manual addition)
* Optional AI-suggested competitors (opt-in)

**Competitor Insights (V1):**

* Posting frequency
  * Calendar view (last 1–2 months)
  
* Engagement trends
* Viral posts detection
* Hook analysis
* Script structure patterns

**Competitor Content Analysis:**

* Video transcription (AI)
* Extracted hooks
* Structural patterns (intro → body → ending)
* Notes on:

  * Editing style
  * Cinematics
  * Visual or narrative techniques

---

### 5.4 Hooks & Script Knowledge Base

**Hooks System:**

* Store hooks (text-based)
* Categorize by:

  * Hook type
  * Topic
  * Emotion
  * Format
* Track:

  * When hook was used
  * Performance when reused
  * Relevance decay over time

**Script Structures:**

* Store reusable script templates
* Link structures to:

  * Competitor posts
  * Your own posts
  * Hooks

**Linking & Traceability:**

* Hook ← inspired by competitor post
* Hook ← reused in your post
* Hook ← performance outcome

---

### 5.5 Challenges (Gamification)

**Key Features (V1.5):**

* **Content Challenges**: 
  * "7-Day Reel Sprint"
  * "Community Engagement Surge"
* **Progress Tracking**:
  * Streak counting
  * Milestone badges
* **Rewards (Self-Managed)**:
  * Define personal rewards for completing challenges.

---

### 5.6 Insight → Content Workflow

**Flexible Entry Points:**
A content workflow can start from:

* Competitor video
* Hook
* Script structure
* Old post

**Context-Aware Flow:**

* Starting from competitor video:
  * Choose inspiration type (hook / idea / structure)
  
* Starting from script structure:
  * Auto-load structure into draft
  
* Starting from hook:
  * Suggest compatible structures

This system assists thinking, not full automation.

---

## 6. AI Usage (V1)

**Included:**

* Video transcription
* Hook extraction
* Structural pattern detection
* Trend detection (emerging formats, hooks, pacing)

**Excluded (V1):**

* Full script generation
* Auto-posting
* Heavy automation

**Philosophy:**
Manual-first, AI-assisted. Automation added later when workflows stabilize.

---

## 7. Data & Refresh Strategy

* Data sources:
  * Official APIs when available
  * Scraping where required
  
* Refresh rate:
  * Daily sync
  
* Near real-time not required

---

## 8. UX & Design Principles

* Clean, minimal UI
* Inspired by Instagram’s design philosophy
* Dashboard-first
* Insight-heavy, not cluttered
* Designed to complement Notion, not replace it

---

## 9. Success Criteria (V1)

Qualitative success:

* Clear visibility on what works and why
* Faster decision-making before posting
* Strong awareness of community dynamics
* Less cognitive load when creating content

Quantitative metrics (later):

* Frequency of use (daily / weekly)
* Number of saved hooks
* Reuse rate of hooks and structures
* Community segmentation completeness

---

## 10. Future Roadmap (V2+)

* Authentication & multi-user support
* Public SaaS launch
* Mobile app
* More platforms (TikTok, YouTube, Facebook)
* Automation workflows
* Community reward systems
* Content around building the product (organic growth)

---

## 11. Suggested Tech Stack (Initial Recommendation)

* Frontend: Next.js + Tailwind
* Backend: Node.js (API layer)
* Database: PostgreSQL
* Scraping & data jobs: Background workers / cron
* AI:

  * Speech-to-text
  * Text analysis (hooks, structure, trends)
* Hosting: Vercel + managed DB
