import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { useStore } from './hooks/useStore';
import PrideDie from './components/PrideDie';
import Auth from './components/Auth';
import CharacterCreator from './components/CharacterCreator';
import CharacterSheet from './components/CharacterSheet';
import InitiativeTracker from './components/InitiativeTracker';
import MapsVTT from './components/MapsVTT';
import CampaignManager from './components/CampaignManager';
import HomebrewForge from './components/HomebrewForge';
import DiceRoller from './components/DiceRoller';
import { Modal, Btn, EmptyState } from './components/UI';

// ── THEME CONFIG ──────────────────────────────────────────────────────────────
const THEMES = [
  { id: 'crimson-light', label: 'Crimson Light', swatches: ['#8b1a1a', '#f5eeee'] },
  { id: 'crimson-dark',  label: 'Crimson Dark',  swatches: ['#e74c3c', '#160808'] },
  { id: 'silver-light',  label: 'Silver Light',  swatches: ['#1a2a5a', '#eef1f6'] },
  { id: 'silver-dark',   label: 'Silver Dark',   swatches: ['#7ec8e3', '#080e1a'] },
  { id: 'teal-light',    label: 'Teal Light',    swatches: ['#0a5a48', '#e8f5f0'] },
  { id: 'teal-dark',     label: 'Teal Dark',     swatches: ['#1abc9c', '#040e0c'] },
  { id: 'violet-light',  label: 'Violet Light',  swatches: ['#3a1a7a', '#f0eef8'] },
  { id: 'violet-dark',   label: 'Violet Dark',   swatches: ['#b67dd9', '#0a0614'] },
  { id: 'amber-light',   label: 'Amber Light',   swatches: ['#7a5010', '#fdf6e8'] },
  { id: 'amber-dark',    label: 'Amber Dark',    swatches: ['#e8a830', '#120c04'] },
];

const BG_OPTIONS = [
  { id: 'dragon',  label: 'Dragon Silhouette', icon: '🐉' },
  { id: 'runes',   label: 'Subtle Rune Grid',  icon: '✦'  },
  { id: 'stars',   label: 'Parallax Stars',    icon: '★'  },
  { id: 'arcane',  label: 'Arcane Circles',    icon: '◎'  },
  { id: 'stone',   label: 'Stone Texture',     icon: '▦'  },
  { id: 'scales',  label: 'Dragon Scales',     icon: '◈'  },
  { id: 'none',    label: 'None',              icon: '○'  },
];

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV_DROPDOWNS = {
  characters: {
    cols: [
      {
        title: 'My Characters',
        items: [], // filled dynamically
        cta: { label: '+ New Character', action: 'newCharacter' },
      },
      {
        title: 'Character Tools',
        items: [
          { icon: '🧙', label: 'Character Creator', action: 'newCharacter' },
          { icon: '⬆️', label: 'Level Up', badge: 'SOON' },
          { icon: '🎒', label: 'Equipment', badge: 'SOON' },
          { icon: '✨', label: 'Spells', badge: 'SOON' },
          { icon: '📄', label: 'Export PDF', badge: 'SOON' },
        ],
      },
    ],
  },
  campaigns: {
    cols: [
      { title: 'My Campaigns', items: [], cta: { label: '+ New Campaign', action: 'newCampaign' } },
      { title: 'Actions', items: [{ icon: '🔗', label: 'Join Campaign (Enter Code)', action: 'joinCampaign' }] },
    ],
  },
  tools: {
    cols: [
      { title: 'Combat', items: [{ icon: '🎯', label: 'Initiative Tracker', action: 'initiative' }] },
      { title: 'Maps', items: [{ icon: '🗺️', label: 'Maps VTT', action: 'maps' }] },
      { title: 'Dice', items: [{ icon: '🎲', label: 'Dice Roller' }, { icon: '📋', label: 'Roll Log' }] },
    ],
  },
  forge: {
    cols: [
      { title: 'Races', items: [{ icon: '🧬', label: 'Races', action: 'homebrew' }, { icon: '🔀', label: 'Subraces', action: 'homebrew' }] },
      { title: 'Classes', items: [{ icon: '⚔️', label: 'Classes', action: 'homebrew' }, { icon: '🎯', label: 'Subclasses', action: 'homebrew' }] },
      { title: 'Magic & Lore', items: [{ icon: '✨', label: 'Spells', action: 'homebrew' }, { icon: '📖', label: 'Backgrounds', action: 'homebrew' }, { icon: '🌟', label: 'Feats', action: 'homebrew' }] },
      { title: 'Items & Creatures', items: [{ icon: '⚗️', label: 'Items', action: 'homebrew' }, { icon: '👹', label: 'Monsters', action: 'homebrew' }] },
      { title: '', items: [], cta: { label: '→ View All Homebrew', action: 'homebrew' } },
    ],
  },
  sources: {
    cols: [
      { title: 'Core Rules', items: [{ icon: '📖', label: "Player's Handbook" }, { icon: '📗', label: "Dungeon Master's Guide" }, { icon: '👁️', label: 'Monster Manual' }, { icon: '📘', label: '2024 Player\'s Handbook' }] },
      { title: 'Supplements', items: [{ icon: '📙', label: "Xanathar's Guide" }, { icon: '📕', label: "Tasha's Cauldron" }, { icon: '📓', label: "Mordenkainen's Tome" }, { icon: '📔', label: "Volo's Guide" }] },
      { title: '', items: [], cta: { label: '+ All Sources' } },
    ],
  },
  basics: {
    cols: [
      { title: 'Getting Started', items: [{ icon: '📖', label: 'Basic Rules' }, { icon: '🎲', label: 'How to Play' }, { icon: '⚔️', label: 'Combat Rules' }] },
      { title: 'Characters', items: [{ icon: '🧬', label: 'Races Overview' }, { icon: '⚔️', label: 'Classes Overview' }, { icon: '📜', label: 'Backgrounds' }, { icon: '🌟', label: 'Feats Overview' }] },
      { title: 'Magic & Rules', items: [{ icon: '✨', label: 'Spellcasting Rules' }, { icon: '📚', label: 'Spell Slots' }, { icon: '🎯', label: 'Conditions Reference' }, { icon: '⚙️', label: 'Action Types' }] },
    ],
  },
};

// ── DRAGON SVG BACKGROUND ─────────────────────────────────────────────────────
function DragonBackground() {
  return (
    <svg
      className="dragon-bg"
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="dglow" cx="55%" cy="45%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </radialGradient>
        <filter id="dblur">
          <feGaussianBlur stdDeviation="2.5"/>
        </filter>
      </defs>

      {/* Atmospheric glow behind dragon */}
      <ellipse cx="650" cy="420" rx="480" ry="340" fill="url(#dglow)"/>

      {/* Dragon silhouette — a proper wyvern-style dragon viewed from the side */}
      <g fill="var(--accent)" opacity="var(--dragon-op, 0.13)">

        {/* Main body */}
        <path d="M420,480 C380,460 340,430 310,390 C285,358 275,320 280,285 C285,255 300,232 325,218 C345,207 368,205 390,212 C408,218 422,230 430,246 C445,228 468,216 494,214 C522,212 548,224 564,244 C575,230 592,220 612,218 C638,215 662,226 676,246 C688,232 706,222 726,220 C752,217 776,230 788,252 C800,238 818,228 838,228 C864,227 886,242 896,264 C910,248 928,238 948,238 C970,237 990,248 1000,266 L1010,270 C1010,270 980,310 960,340 C940,368 928,400 930,432 C932,460 944,484 960,504 C940,498 918,488 900,474 C880,460 864,442 858,422 C840,448 812,466 782,472 C758,477 734,472 714,460 C698,480 674,494 648,498 C624,502 600,496 580,482 C562,498 536,508 508,508 C482,508 458,498 440,482 Z"/>

        {/* Neck */}
        <path d="M310,390 C295,370 282,346 278,320 C274,296 278,272 290,252 C300,236 316,224 334,218 C316,230 302,250 298,274 C294,298 300,324 314,346 C324,362 338,374 354,382 Z"/>

        {/* Head */}
        <path d="M278,320 C268,305 256,288 248,268 C240,250 236,230 240,212 C244,196 254,183 268,175 C255,188 248,206 248,225 C248,242 254,258 264,272 C274,286 288,296 304,302 Z"/>
        <path d="M240,212 C234,198 228,182 228,165 C228,150 234,136 244,126 C238,138 236,152 238,166 C240,178 246,190 255,200 Z"/>

        {/* Snout / jaw */}
        <path d="M228,165 C218,155 205,148 192,148 C178,148 165,155 158,166 C170,158 184,154 198,156 C210,158 220,164 228,173 Z"/>
        <path d="M158,166 C148,172 138,182 132,195 C126,208 124,222 128,235 C124,222 124,208 130,196 C136,184 146,174 158,166 Z"/>

        {/* Horn */}
        <path d="M244,126 C248,110 255,95 260,78 C256,94 254,112 256,128 Z"/>
        <path d="M244,126 C234,114 222,104 212,92 C224,102 236,114 244,128 Z"/>

        {/* Eye */}
        <circle cx="220" cy="178" r="6"/>
        <circle cx="222" cy="176" r="2" fill="var(--bg)" opacity="0.6"/>

        {/* Upper wing — large, swept back */}
        <path d="M480,260 C460,220 430,185 390,160 C350,135 302,120 258,118 C310,118 362,132 406,158 C448,183 480,220 498,264 C510,240 528,220 550,204 C530,222 514,244 506,268 Z"/>
        <path d="M480,260 C500,230 528,205 560,190 C592,175 628,170 664,174 C628,172 592,178 560,196 C530,213 506,240 492,272 Z"/>
        <path d="M480,260 C510,245 544,238 578,240 C610,242 640,252 664,268 C640,254 610,244 578,242 C546,240 514,248 488,264 Z"/>

        {/* Wing membrane fingers */}
        <path d="M258,118 C240,100 215,86 188,80 C215,84 240,96 262,114 Z"/>
        <path d="M258,118 C248,95 230,76 208,64 C230,74 250,92 262,114 Z"/>
        <path d="M258,118 C255,92 248,68 234,48 C248,66 256,90 260,116 Z"/>

        {/* Lower wing / arm */}
        <path d="M550,340 C530,310 504,286 474,270 C500,284 526,308 546,336 C540,360 528,382 512,400 C528,384 542,362 550,338 Z"/>

        {/* Tail — long sweeping */}
        <path d="M960,504 C980,520 1002,534 1026,542 C1050,550 1076,552 1100,546 C1076,554 1050,554 1024,548 C998,542 974,528 954,510 Z"/>
        <path d="M1026,542 C1052,556 1078,564 1104,560 C1128,556 1148,542 1158,522 C1150,540 1132,556 1108,562 C1082,568 1054,560 1030,546 Z"/>
        <path d="M1104,560 C1124,566 1142,564 1156,552 C1168,540 1172,522 1166,506 C1170,522 1168,540 1158,554 C1146,566 1128,568 1110,562 Z"/>
        <path d="M1156,552 C1168,556 1178,550 1184,538 C1188,526 1184,512 1176,502 C1182,512 1184,526 1180,538 C1174,550 1164,556 1154,554 Z"/>

        {/* Legs / claws */}
        <path d="M700,472 C710,492 714,514 710,534 C718,514 716,492 706,472 Z"/>
        <path d="M710,534 C706,548 698,560 686,568 C674,576 660,578 648,574 C660,578 674,578 686,570 C698,562 708,550 712,536 Z"/>
        <path d="M648,574 C638,578 626,578 616,572 C606,566 600,556 600,546 C600,558 606,568 616,574 C626,580 638,580 650,576 Z"/>
        <path d="M686,568 L680,588 L684,568 Z"/>
        <path d="M670,572 L664,594 L668,572 Z"/>
        <path d="M654,574 L650,596 L654,574 Z"/>

        {/* Front leg */}
        <path d="M420,460 C424,480 422,502 414,520 C420,502 422,480 418,460 Z"/>
        <path d="M414,520 C410,536 400,548 386,554 C372,560 358,558 348,550 C358,558 372,560 386,556 C400,550 410,538 414,522 Z"/>
        <path d="M386,554 L380,574 L384,554 Z"/>
        <path d="M370,556 L364,578 L368,556 Z"/>
        <path d="M354,550 L348,572 L352,550 Z"/>

        {/* Belly scales hint */}
        <path d="M440,482 C460,490 482,494 506,494 C528,494 550,490 570,482 C548,490 526,494 504,494 C482,494 460,490 440,484 Z" opacity="0.5"/>
        <path d="M580,482 C600,488 622,492 646,492 C668,492 690,488 710,482 C688,488 666,492 644,492 C622,492 600,488 580,484 Z" opacity="0.5"/>

      </g>

      {/* Soft glow outline version for depth */}
      <g fill="none" stroke="var(--accent)" strokeWidth="1" opacity="calc(var(--dragon-op, 0.13) * 0.4)" filter="url(#dblur)">
        <path d="M420,480 C380,460 340,430 310,390 C285,358 275,320 280,285 C285,255 300,232 325,218 C345,207 368,205 390,212 C408,218 422,230 430,246 C445,228 468,216 494,214 C522,212 548,224 564,244 C575,230 592,220 612,218 C638,215 662,226 676,246 C688,232 706,222 726,220 C752,217 776,230 788,252 C800,238 818,228 838,228 C864,227 886,242 896,264 C910,248 928,238 948,238 C970,237 990,248 1000,266 L1010,270 C1010,270 980,310 960,340 C940,368 928,400 930,432 C932,460 944,484 960,504 C940,498 918,488 900,474 C880,460 864,442 858,422 C840,448 812,466 782,472 C758,477 734,472 714,460 C698,480 674,494 648,498 C624,502 600,496 580,482 C562,498 536,508 508,508 C482,508 458,498 440,482 Z"/>
      </g>
    </svg>
  );
}

// ── TOP NAV ───────────────────────────────────────────────────────────────────
function TopNav({ user, characters, campaigns, initiative, onNavigate, onNewCharacter, onSettings, onSignOut }) {
  const [openDD, setOpenDD] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDD(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleDD(id) {
    setOpenDD(prev => prev === id ? null : id);
  }

  function handleAction(action) {
    setOpenDD(null);
    if (!action) return;
    if (action === 'newCharacter') { onNewCharacter(); return; }
    onNavigate(action);
  }

  const userInitials = (user?.user_metadata?.full_name || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Build dynamic dropdown data
  const ddData = {
    ...NAV_DROPDOWNS,
    characters: {
      cols: [
        {
          title: 'My Characters',
          items: characters.slice(0, 5).map(c => ({
            icon: '⚔️',
            label: c.name,
            action: 'characters',
          })),
          cta: { label: '+ New Character', action: 'newCharacter' },
        },
        NAV_DROPDOWNS.characters.cols[1],
      ],
    },
    campaigns: {
      cols: [
        {
          title: 'My Campaigns',
          items: campaigns.slice(0, 5).map(c => ({
            icon: c.owner_id === user?.id ? '👑' : '🌑',
            label: c.name,
            action: 'campaigns',
          })),
          cta: { label: '+ New Campaign', action: 'campaigns' },
        },
        NAV_DROPDOWNS.campaigns.cols[1],
      ],
    },
    tools: {
      cols: [
        {
          title: 'Combat',
          items: [
            { icon: '🎯', label: 'Initiative Tracker', action: 'initiative' },
            ...(initiative.active ? [{ icon: '●', label: `Resume Combat — Round ${initiative.round}`, action: 'initiative', danger: true }] : []),
          ],
        },
        { title: 'Maps', items: [{ icon: '🗺️', label: 'Maps VTT', action: 'maps' }], cta: { label: '+ New Map', action: 'maps' } },
        { title: 'Dice', items: [{ icon: '🎲', label: 'Dice Roller' }, { icon: '📋', label: 'Roll Log' }] },
      ],
    },
  };

  const navLinks = [
    { id: 'characters', label: 'Characters', badge: characters.length > 0 ? characters.length : null },
    { id: 'campaigns', label: 'Campaigns', badge: campaigns.length > 0 ? campaigns.length : null },
    { id: 'tools', label: 'Quick Tools', badgeRed: initiative.active },
    { id: 'forge', label: 'The Forge' },
    { id: 'sources', label: 'Official Sources' },
    { id: 'basics', label: 'The Basics' },
  ];

  return (
    <nav className="topnav" ref={navRef}>
      <div className="topnav-inner">
        {/* Logo */}
        <div className="nav-logo" onClick={() => { setOpenDD(null); onNavigate('home'); }}>
          <PrideDie size={38} />
          <div className="nav-logo-words">
            <span className="nav-logo-the">The</span>
            <span className="nav-logo-name">Forge</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="nav-links">
          {navLinks.map(link => (
            <div
              key={link.id}
              className={`nav-link ${openDD === link.id ? 'open' : ''}`}
              onClick={() => toggleDD(link.id)}
            >
              {link.label}
              {link.badge && <span className="nav-badge">{link.badge}</span>}
              {link.badgeRed && <span className="nav-badge nav-badge-red">●</span>}
              <span className="nav-link-chev">▾</span>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-right">
          <button className="nav-btn nav-btn-ghost" onClick={() => {}}>🔍</button>
          <button className="nav-btn nav-btn-primary" onClick={() => toggleDD('create')}>
            + Create ▾
          </button>
          <div className="nav-avatar" onClick={() => toggleDD('profile')}>{userInitials}</div>

          {/* Create dropdown */}
          {openDD === 'create' && (
            <div className="float-dropdown" style={{ right: '80px' }}>
              <div className="float-dropdown-header">
                <div className="float-dropdown-name">Quick Create</div>
              </div>
              {[
                { icon: '⚔️', label: 'New Character', action: 'newCharacter' },
                { icon: '📜', label: 'New Campaign', action: 'campaigns' },
              ].map(item => (
                <div key={item.label} className="float-dropdown-item" onClick={() => handleAction(item.action)}>
                  <span className="float-dropdown-item-icon">{item.icon}</span>
                  {item.label}
                </div>
              ))}
              <div className="float-dropdown-divider" />
              {[
                { icon: '🧬', label: 'Homebrew Race' },
                { icon: '⚔️', label: 'Homebrew Class' },
                { icon: '✨', label: 'Homebrew Spell' },
                { icon: '⚗️', label: 'Homebrew Item' },
                { icon: '👹', label: 'Homebrew Monster' },
              ].map(item => (
                <div key={item.label} className="float-dropdown-item" onClick={() => handleAction('homebrew')}>
                  <span className="float-dropdown-item-icon">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          )}

          {/* Profile dropdown */}
          {openDD === 'profile' && (
            <div className="float-dropdown">
              <div className="float-dropdown-header">
                <div className="float-dropdown-name">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</div>
                <div className="float-dropdown-email">{user?.email}</div>
              </div>
              {[
                { icon: '👤', label: 'Profile' },
                { icon: '⚙️', label: 'Settings', action: 'settings' },
                { icon: '🎨', label: 'Color Theme', action: 'settings' },
                { icon: '🐉', label: 'Background Style', action: 'settings' },
                { icon: '🔔', label: 'Notifications' },
              ].map(item => (
                <div key={item.label} className="float-dropdown-item" onClick={() => { setOpenDD(null); if (item.action === 'settings') onSettings(); }}>
                  <span className="float-dropdown-item-icon">{item.icon}</span>
                  {item.label}
                </div>
              ))}
              <div className="float-dropdown-divider" />
              <div className="float-dropdown-item" style={{ color: '#c0392b' }} onClick={onSignOut}>
                <span className="float-dropdown-item-icon">🚪</span>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown panel */}
      {openDD && ddData[openDD] && (
        <div className="nav-dropdown">
          <div className="nav-dropdown-inner">
            {ddData[openDD].cols.map((col, ci) => (
              <div key={ci} className="dd-col">
                {col.title && <div className="dd-col-title">{col.title}</div>}
                {col.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="dd-item"
                    style={item.danger ? { color: '#c0392b', fontWeight: 700 } : {}}
                    onClick={() => handleAction(item.action)}
                  >
                    <span className="dd-item-icon">{item.icon}</span>
                    {item.label}
                    {item.badge && <span className="dd-badge">{item.badge}</span>}
                  </div>
                ))}
                {col.cta && (
                  <>
                    {col.items.length > 0 && <div className="dd-divider" />}
                    <div className="dd-cta" onClick={() => handleAction(col.cta.action)}>
                      <span className="dd-item-icon">+</span>
                      {col.cta.label}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function SettingsPanel({ open, onClose, theme, onTheme, bgStyle, onBgStyle }) {
  return (
    <>
      <div className={`settings-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`settings-panel ${open ? 'open' : ''}`}>
        <button className="settings-close" onClick={onClose}>✕</button>
        <div className="settings-title">Settings</div>
        <div className="settings-subtitle">Customize your Forge experience</div>

        <div className="settings-section">
          <div className="settings-section-title">Color Theme</div>
          <div className="theme-grid">
            {THEMES.map(t => (
              <div
                key={t.id}
                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => onTheme(t.id)}
              >
                <div className="theme-swatches">
                  {t.swatches.map((s, i) => (
                    <div key={i} className="theme-swatch" style={{ background: s }} />
                  ))}
                </div>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Background Style</div>
          {BG_OPTIONS.map(bg => (
            <div
              key={bg.id}
              className={`bg-option ${bgStyle === bg.id ? 'active' : ''}`}
              onClick={() => onBgStyle(bg.id)}
            >
              <span style={{ fontSize: '18px' }}>{bg.icon}</span>
              {bg.label}
            </div>
          ))}
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Account</div>
          {[
            { icon: '👤', label: 'Edit Profile' },
            { icon: '🔔', label: 'Notifications' },
            { icon: '🔒', label: 'Change Password' },
          ].map(item => (
            <div key={item.label} className="bg-option">
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── CHARACTER CARD ────────────────────────────────────────────────────────────
function classColor(cls) {
  const map = {
    Barbarian:'#c0392b', Bard:'#8e44ad', Cleric:'#f39c12', Druid:'#27ae60',
    Fighter:'#7f8c8d', Monk:'#16a085', Paladin:'#2980b9', Ranger:'#2ecc71',
    Rogue:'#34495e', Sorcerer:'#e74c3c', Warlock:'#9b59b6', Wizard:'#3498db',
  };
  return map[cls] || 'var(--accent)';
}

function CharacterCard({ character, onClick, onDelete }) {
  const hp = character.hp || { current: 0, max: 0 };
  const hpPct = hp.max > 0 ? Math.max(0, Math.min(100, (hp.current / hp.max) * 100)) : 100;
  const hpColor = hpPct > 60 ? '#1abc9c' : hpPct > 30 ? '#f39c12' : '#e74c3c';
  return (
    <div className="char-card" onClick={onClick}>
      <div className="char-card-banner" style={{ background: `linear-gradient(135deg, ${classColor(character.class)}, var(--bg3))` }} />
      <div className="char-card-body">
        <div className="char-avatar" style={{ background: `linear-gradient(135deg, ${classColor(character.class)}, var(--bg2))` }}>
          {(character.name || '?')[0].toUpperCase()}
        </div>
        <div className="char-name">{character.name || 'Unnamed'}</div>
        <div className="char-meta">{[character.race, character.class, character.subclass].filter(Boolean).join(' · ')}</div>
        <div className="char-level">Level {character.level || 1}</div>
        <div className="char-hp-bar">
          <div className="char-hp-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
        </div>
      </div>
      <button
        style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.3)', border:'none', color:'#fff', width:22, height:22, borderRadius:'50%', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:0, transition:'opacity 0.2s' }}
        onClick={e => { e.stopPropagation(); onDelete(); }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0'}
      >×</button>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return <div className={`toast ${show ? 'show' : ''}`}>{message}</div>;
}

// ── LOADING SCREEN ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
      <PrideDie size={64} animated />
      <div style={{ fontFamily:"'Cinzel', serif", color:'var(--accent)', fontSize:'14px', letterSpacing:'0.15em', textTransform:'uppercase' }}>
        Loading your adventure...
      </div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ user, characters, campaigns, initiative, onNewCharacter, onViewCharacter, onDeleteCharacter, onNavigate }) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Adventurer';

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div>
          <div className="hero-eyebrow">D&D 5e Companion</div>
          <div className="hero-title">Welcome back,<br />{displayName}</div>
          <div className="hero-subtitle">
            {characters.length} character{characters.length !== 1 ? 's' : ''} · {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} · Ready to adventure
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onNewCharacter}>+ New Character</button>
            <button className="btn-primary" onClick={() => onNavigate('campaigns')}>🔗 Join Campaign</button>
            <button className="btn-secondary" onClick={() => onNavigate('homebrew')}>📖 The Forge</button>
          </div>
        </div>

        {/* Activity panel */}
        <div className="activity-card">
          <div className="activity-title">Recent Activity</div>
          {characters.slice(0, 2).map(c => (
            <div key={c.id} className="activity-item" onClick={() => onViewCharacter(c)}>
              <div className="activity-dot" style={{ background: classColor(c.class) }} />
              <div className="activity-text"><strong>{c.name}</strong> — Lv {c.level || 1} {c.class}</div>
              <div className="activity-time">Character</div>
            </div>
          ))}
          {campaigns.slice(0, 2).map(c => (
            <div key={c.id} className="activity-item" onClick={() => onNavigate('campaigns')}>
              <div className="activity-dot" style={{ background: 'var(--gold)' }} />
              <div className="activity-text"><strong>{c.name}</strong></div>
              <div className="activity-time">Campaign</div>
            </div>
          ))}
          {initiative.active && (
            <div className="activity-item" onClick={() => onNavigate('initiative')}>
              <div className="activity-dot" style={{ background: '#e74c3c' }} />
              <div className="activity-text"><strong>Combat active</strong> — Round {initiative.round}</div>
              <div className="activity-time">Live</div>
            </div>
          )}
          {characters.length === 0 && campaigns.length === 0 && !initiative.active && (
            <div style={{ color:'var(--text3)', fontSize:'13px', textAlign:'center', padding:'1.5rem 0' }}>
              No recent activity yet.<br />Create your first character to begin!
            </div>
          )}
        </div>
      </div>

      <div className="content-area">
        {/* Combat banner */}
        {initiative.active && (
          <div className="combat-banner" onClick={() => onNavigate('initiative')}>
            <div className="combat-pulse" />
            <div className="combat-label">⚔️ Combat Active</div>
            <div className="combat-detail">Round {initiative.round} · {initiative.combatants.length} combatants</div>
            <button className="btn-primary" style={{ padding:'7px 16px', fontSize:'11px' }}>Resume →</button>
          </div>
        )}

        {/* Characters */}
        <div className="section-header">
          <div className="section-title">⚔️ My Characters</div>
          <div className="section-link" onClick={() => onNavigate('characters')}>View All →</div>
        </div>
        {characters.length === 0 ? (
          <div className="empty-state" style={{ padding:'2rem 0' }}>
            <div className="empty-state-icon">⚔️</div>
            <div className="empty-state-title">No Characters Yet</div>
            <div className="empty-state-desc">Create your first character to begin your adventure!</div>
            <button className="btn-primary" onClick={onNewCharacter}>Create First Character</button>
          </div>
        ) : (
          <div className="char-grid">
            {characters.slice(0, 4).map(char => (
              <CharacterCard
                key={char.id}
                character={char}
                onClick={() => onViewCharacter(char)}
                onDelete={() => onDeleteCharacter(char.id)}
              />
            ))}
            <div className="char-card-new" onClick={onNewCharacter}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              New Character
            </div>
          </div>
        )}

        <div className="section-divider" />

        {/* Campaigns */}
        <div className="section-header">
          <div className="section-title">📜 My Campaigns</div>
          <div className="section-link" onClick={() => onNavigate('campaigns')}>View All →</div>
        </div>
        <div className="campaign-grid">
          {campaigns.slice(0, 3).map(c => (
            <div key={c.id} className="campaign-card" onClick={() => onNavigate('campaigns')}>
              <div className="campaign-name">{c.name}</div>
              <div className="campaign-meta">{c.setting || 'No setting'} · {(c.members||[]).length} members</div>
              <div className="campaign-tags">
                {c.owner_id === user?.id && <span className="tag tag-dm">DM</span>}
                <span className="tag tag-active">{c.status || 'Active'}</span>
                {c.invite_code && <span className="tag tag-neutral">Code: {c.invite_code}</span>}
              </div>
            </div>
          ))}
          <div className="campaign-card" style={{ border:'1px dashed var(--border)', background:'transparent', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:7, color:'var(--text3)', minHeight:100 }}
            onClick={() => onNavigate('campaigns')}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text3)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="14"/><line x1="6" y1="10" x2="14" y2="10"/></svg>
            <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>New / Join Campaign</div>
          </div>
        </div>

        <div className="section-divider" />

        {/* Quick Tools */}
        <div className="section-header">
          <div className="section-title">🛠️ Quick Tools</div>
        </div>
        <div className="tool-grid">
          {[
            { icon:'🎯', name:'Initiative', desc:'Start or resume combat', action:'initiative' },
            { icon:'🗺️', name:'Maps VTT', desc:'Open battle maps', action:'maps' },
            { icon:'🎲', name:'Dice Roller', desc:'Roll any combination', action:null },
            { icon:'🔥', name:'The Forge', desc:'Create homebrew content', action:'homebrew' },
          ].map(tool => (
            <div key={tool.name} className="tool-card" onClick={() => tool.action && onNavigate(tool.action)}>
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-desc">{tool.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const auth = useAuth();
  const store = useStore(auth.user);

  const [theme, setTheme] = useState(() => localStorage.getItem('forge-theme') || 'crimson-light');
  const [bgStyle, setBgStyle] = useState(() => localStorage.getItem('forge-bg') || 'dragon');
  const [activeTab, setActiveTab] = useState('home');
  const [showCreator, setShowCreator] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [viewingCharacter, setViewingCharacter] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimer = useRef(null);

  function handleTheme(t) {
    setTheme(t);
    localStorage.setItem('forge-theme', t);
  }

  function handleBgStyle(b) {
    setBgStyle(b);
    localStorage.setItem('forge-bg', b);
  }

  function showToast(message) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ show: true, message });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }

  async function handleSaveCharacter(char) {
    const id = await store.saveCharacter(char);
    setShowCreator(false);
    setEditingCharacter(null);
    showToast(char.id ? `${char.name} saved!` : `${char.name} created!`);
    if (!char.id) {
      setActiveTab('characters');
      setTimeout(() => setViewingCharacter({ ...char, id }), 50);
    }
  }

  function handleEditCharacter(char) {
    setEditingCharacter(char);
    setViewingCharacter(null);
    setShowCreator(true);
  }

  async function handleDeleteCharacter(id) {
    const char = store.characters.find(c => c.id === id);
    if (window.confirm(`Delete ${char?.name || 'this character'}? This cannot be undone.`)) {
      await store.deleteCharacter(id);
      if (viewingCharacter?.id === id) setViewingCharacter(null);
      showToast('Character deleted.');
    }
  }

  async function handleUpdateCharacter(updatedChar) {
    await store.saveCharacter(updatedChar);
    setViewingCharacter(updatedChar);
  }

  function handleNavigate(tab) {
    setActiveTab(tab);
    setViewingCharacter(null);
    setSettingsOpen(false);
  }

  if (auth.loading) return <div className={`t-${theme}`}><LoadingScreen /></div>;
  if (!auth.user) return <div className={`t-${theme}`}><Auth onAuth={auth} /></div>;
  if (store.loading) return <div className={`t-${theme}`}><LoadingScreen /></div>;

  return (
    <div className={`t-${theme} app-root`}>
      {/* Dragon background */}
      {bgStyle === 'dragon' && <DragonBackground />}

      {/* Top Nav */}
      <TopNav
        user={auth.user}
        characters={store.characters}
        campaigns={store.campaigns}
        initiative={store.initiative}
        onNavigate={handleNavigate}
        onNewCharacter={() => { setEditingCharacter(null); setShowCreator(true); }}
        onSettings={() => setSettingsOpen(true)}
        onSignOut={auth.signOut}
      />

      {/* Creator takes over full page when open, otherwise show main content */}
      {showCreator ? (
        <CharacterCreator
          onSave={handleSaveCharacter}
          onClose={() => { setShowCreator(false); setEditingCharacter(null); }}
          character={editingCharacter}
          homebrew={store.homebrew}
          campaigns={store.campaigns}
          user={auth.user}
        />
      ) : (
        <div className="main-content">

          {/* Home */}
          {activeTab === 'home' && (
            <HomePage
              user={auth.user}
              characters={store.characters}
              campaigns={store.campaigns}
              initiative={store.initiative}
              onNewCharacter={() => { setEditingCharacter(null); setShowCreator(true); }}
              onViewCharacter={char => { setActiveTab('characters'); setViewingCharacter(char); }}
              onDeleteCharacter={handleDeleteCharacter}
              onNavigate={handleNavigate}
            />
          )}

          {/* Characters */}
          {activeTab === 'characters' && (
            <div className="content-area">
              {viewingCharacter ? (
                <>
                  <div className="breadcrumb">
                    <button className="breadcrumb-btn" onClick={() => setViewingCharacter(null)}>← All Characters</button>
                    <span className="breadcrumb-sep">/</span>
                    <span>{viewingCharacter.name}</span>
                  </div>
                  <CharacterSheet
                    character={store.characters.find(c => c.id === viewingCharacter.id) || viewingCharacter}
                    onUpdate={handleUpdateCharacter}
                    onEdit={handleEditCharacter}
                    onDelete={() => handleDeleteCharacter(viewingCharacter.id)}
                  />
                </>
              ) : (
                <>
                  <div className="page-header">
                    <div>
                      <h1 className="page-title">Characters</h1>
                      <p className="page-subtitle">{store.characters.length === 0 ? 'No adventurers yet — forge your first hero!' : `${store.characters.length} adventurer${store.characters.length !== 1 ? 's' : ''} ready`}</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setEditingCharacter(null); setShowCreator(true); }}>+ New Character</button>
                  </div>
                  {store.characters.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">⚔️</div>
                      <div className="empty-state-title">No Characters Yet</div>
                      <div className="empty-state-desc">Create your first character to begin your adventure!</div>
                      <button className="btn-primary" onClick={() => setShowCreator(true)}>Create First Character</button>
                    </div>
                  ) : (
                    <div className="char-grid">
                      {store.characters.map(char => (
                        <CharacterCard key={char.id} character={char}
                          onClick={() => setViewingCharacter(char)}
                          onDelete={() => handleDeleteCharacter(char.id)}
                        />
                      ))}
                      <div className="char-card-new" onClick={() => { setEditingCharacter(null); setShowCreator(true); }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        New Character
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Initiative */}
          {activeTab === 'initiative' && (
            <div className="content-area">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Initiative Tracker</h1>
                  <p className="page-subtitle">{store.initiative.active ? `⚔️ Combat active — Round ${store.initiative.round}` : 'Add combatants and start combat'}</p>
                </div>
              </div>
              <InitiativeTracker
                initiative={store.initiative} characters={store.characters}
                onAdd={store.addCombatant} onRemove={store.removeCombatant}
                onUpdate={store.updateCombatant} onNext={store.nextTurn}
                onPrev={store.prevTurn} onStart={store.startCombat}
                onEnd={store.endCombat} onSort={store.sortByInitiative}
              />
            </div>
          )}

          {/* Maps */}
          {activeTab === 'maps' && (
            <div className="content-area">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Maps & VTT</h1>
                  <p className="page-subtitle">Place tokens, track positions, run encounters</p>
                </div>
              </div>
              <MapsVTT maps={store.maps} onSave={store.saveMap} onDelete={store.deleteMap} />
            </div>
          )}

          {/* Campaigns */}
          {activeTab === 'campaigns' && (
            <div className="content-area">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Campaigns</h1>
                  <p className="page-subtitle">{store.campaigns.length === 0 ? 'No campaigns yet — start your story!' : `${store.campaigns.length} campaign${store.campaigns.length !== 1 ? 's' : ''} in progress`}</p>
                </div>
              </div>
              <CampaignManager
                campaigns={store.campaigns}
                onSave={store.saveCampaign}
                onDelete={store.deleteCampaign}
                onJoin={store.joinCampaign}
                user={auth.user}
                maps={store.maps}
                onSaveMap={store.saveMap}
                onDeleteMap={store.deleteMap}
                initiative={store.initiative}
                characters={store.characters}
                onAddCombatant={store.addCombatant}
                onRemoveCombatant={store.removeCombatant}
                onUpdateCombatant={store.updateCombatant}
                onNextTurn={store.nextTurn}
                onPrevTurn={store.prevTurn}
                onStartCombat={store.startCombat}
                onEndCombat={store.endCombat}
                onSortInitiative={store.sortByInitiative}
                getCampaignCharacters={store.getCampaignCharacters}
                addCharacterToCampaign={store.addCharacterToCampaign}
                removeCharacterFromCampaign={store.removeCharacterFromCampaign}
              />
            </div>
          )}

          {/* Homebrew */}
          {activeTab === 'homebrew' && (
            <div className="content-area">
              <div className="page-header">
                <div>
                  <h1 className="page-title">The Forge 🔥</h1>
                  <p className="page-subtitle">Create custom races, classes, spells, items, monsters & more</p>
                </div>
              </div>
              <HomebrewForge
                homebrew={store.homebrew}
                onSave={store.saveHomebrew}
                onDelete={store.deleteHomebrew}
                campaigns={store.campaigns}
                user={auth.user}
              />
            </div>
          )}

        </div>
      )}

      {/* Settings */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onTheme={handleTheme}
        bgStyle={bgStyle}
        onBgStyle={handleBgStyle}
      />

      <DiceRoller />
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}