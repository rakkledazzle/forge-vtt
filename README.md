# 🎲 The Forge — D&D 5e Companion

A full-featured D&D 5e web app with:
- **Character Creator** — 6-step wizard with race, class, background, ability scores, and full character sheet
- **Initiative Tracker** — Combat management with conditions, HP tracking, and round counter
- **Maps & VTT** — Grid-based virtual tabletop with drag-and-drop tokens
- **Campaign Manager** — NPCs, quests, session logs, and world notes
- **The Forge (Homebrew)** — Create custom races, classes, backgrounds, spells, items, monsters, and feats

---

## 🚀 Getting Started (Deploy to Vercel in ~5 minutes)

### Step 1 — Download the project

You should already have this folder. Open **PowerShell** and navigate to it:

```powershell
cd C:\path\to\forge-vtt
```

### Step 2 — Install dependencies (first time only)

```powershell
npm install
```

### Step 3 — Run locally to test

```powershell
npm start
```

Open your browser to `http://localhost:3000` — you'll see The Forge!
Press `Ctrl+C` in PowerShell to stop it.

---

## 🌐 Deploy to GitHub + Vercel

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and log in
2. Click **"New"** (green button)
3. Name it `forge-vtt`, make it **Public**, click **Create repository**
4. Copy the repository URL (looks like `https://github.com/YOUR_USERNAME/forge-vtt.git`)

### Step 2 — Push your code to GitHub

In PowerShell, inside your `forge-vtt` folder:

```powershell
git init
git add .
git commit -m "Initial commit - The Forge VTT"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forge-vtt.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username!

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Find and select your `forge-vtt` repository, click **Import**
4. Vercel will auto-detect it's a React app — click **Deploy**
5. Wait ~60 seconds — your app is live! 🎉

You'll get a URL like `https://forge-vtt-abc123.vercel.app`

### Auto-deploy

After this, every time you push changes to GitHub (`git push`), Vercel automatically redeploys!

---

## 🔧 Making Changes

1. Edit files in `src/` with VS Code
2. Save and check `npm start` to preview
3. When happy:
   ```powershell
   git add .
   git commit -m "Your change description"
   git push
   ```
4. Vercel auto-deploys within a minute

---

## 📁 Project Structure

```
src/
  App.js              ← Main app shell + navigation
  App.css             ← Layout styles
  index.css           ← Global styles + theme variables
  components/
    CharacterCreator.js   ← 6-step character wizard
    CharacterSheet.js     ← Full character sheet view
    InitiativeTracker.js  ← Combat tracker
    MapsVTT.js            ← Grid maps with tokens
    CampaignManager.js    ← Campaign notes + NPCs
    HomebrewForge.js      ← Homebrew creation tool
    PrideDie.js           ← Pride flag D20 logo
    UI.js                 ← Shared UI components
  data/
    srd.js            ← D&D 5e SRD data (races, classes, etc.)
  hooks/
    useStore.js       ← App state + localStorage persistence
  utils/
    dnd.js            ← D&D math helpers
```

---

## 💾 Data Storage

All your data is saved in your **browser's localStorage** — it persists between sessions automatically. No account or server needed!

> ⚠️ Clearing browser data will erase characters/campaigns. Consider exporting important data.

---

## 🎨 Customization

The color theme is controlled by CSS variables in `src/index.css`:
- `--gold` — Primary accent color
- `--bg-void` — Main background
- `--bg-card` — Card backgrounds

Fonts are loaded from Google Fonts: **Cinzel** (headings) + **Crimson Pro** (body).
