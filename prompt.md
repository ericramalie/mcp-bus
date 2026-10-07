# Project Prompts & Conversation History

This document logs all user prompts and instructions provided during the development of the SBS Transit Modern Web Portal and API Gateway.

---

## Prompt 1: Initial Application Build & Design System

```text
Build me an app with screens that look like this. You can hotlink images from the https://www.sbstransit.com.sg/
```

### Attached Design System & Specification:
- **Theme**: SBS Transit Modern Web Portal (Modern Civic / Utility-Centric)
- **Palette**:
  - Primary: Deep Navy `#002351` / `#0C3875`
  - Secondary: Corporate Magenta `#8E1960` / `#A52E73` / `#B8256E`
  - Live / Available: Tertiary Green `#00875A`
  - Standing Room: Amber `#D96814`
  - Limited Standing: Crimson `#D32F2F`
  - Canvas / Surface: Light Slate `#F4F6F9` & `#F7F9FF`
- **Typography & Layout**:
  - Inter font family with tabular numerals (`font-feature-settings: "tnum"`)
  - Route Pill Badges (min-width 64px, height 36px, weight 800)
  - Tri-arrival forecast matrix (`1st Bus`, `2nd Bus`, `3rd Bus`)
  - Caps meta for station markers and fleet types (`DD` Double Decker, `SD` Single Decker, `WAB` Wheelchair Accessible Bus)
  - Alert banners in `#FFF3E0` with 4px `#D96814` border
- **Hotlinked SBS Transit Media Assets**:
  - Logo: `https://www.sbstransit.com.sg/Content/img/sbs-transit-logo.png`
  - Bus Fleet: `https://www.sbstransit.com.sg/uploads/homeblocks/5bus-services.jpg`
  - Rail Services: `https://www.sbstransit.com.sg/uploads/homeblocks/4train-services.jpg`
  - Travel Buddy Initiative: `https://www.sbstransit.com.sg/uploads/banner/10630Travel_Buddy_homepage_Web_Banner.jpg`
  - Formula 1 Service Extension: `https://www.sbstransit.com.sg/uploads/banner/11096FormulaOne_1148x425_notext.jpg`
  - Community Programs: `https://www.sbstransit.com.sg/uploads/homeblocks/1SBST_Grow_with_Us_Banner_070425_(1).jpg`

---

## Prompt 2: GitHub Repository Push

```text
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/ericramalie/mcp-bus.git
```

### Execution Details:
- Initialized local git repository, configured git identity (`ericramalie` / `ericramalie@gmail.com`).
- Created initial commit and set branch to `main`.
- Connected remote repository `https://github.com/ericramalie/mcp-bus.git` and pushed upstream branch.

---

## Prompt 3: API Directory & LTA DataMall Integration

```text
1) create a /api folder under project main to store all the apis
2) create a /api/health.js to monitor if the apis are working
3) integrate the LTA bus information api endpoint GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
Header:  AccountKey: 

# BusStopCode is the only required parameter.
# Add &ServiceNo=7 to ask about one service only.
# Refreshes every 20 seconds. JSON comes back by default.
i will add the LTA_ACCOUNT_KEY in vercel environment variable later
```

### Implementation Details:
- Created `/api` folder for Vercel Serverless Functions and local Express backend.
- Created `/api/health.js` returning status, uptime, timestamp, environment, and LTA key configuration check.
- Created `/api/bus-arrival.js` handling LTA DataMall v3 proxy requests with CORS and `LTA_ACCOUNT_KEY` header.
- Added `/vercel.json` and `server.ts` entry points for deployment.
- Connected the frontend Live Bus Arrival Board to query `/api/bus-arrival?BusStopCode=...` with simulated fallback and interactive API Health modal.
- Documented `LTA_ACCOUNT_KEY` in `.env.example`.
- Committed and pushed changes to GitHub repository.

---

## Prompt 4: Prompts Documentation File

```text
create a prompt.md containing all my prompts located at project main
```
