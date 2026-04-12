import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { useStore } from './hooks/useStore';
import ForgeLogo, { PrideDie } from './components/PrideDie';
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
    <svg className="dragon-bg" viewBox="0 0 900 700" preserveAspectRatio="xMaxYMid meet">
      <defs>
        <radialGradient id="dfade" cx="60%" cy="40%" r="55%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="1"/>
          <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g fill="url(#dfade)">
        <path d="M800,50 C760,30 710,35 670,60 C640,78 620,105 600,130 C575,105 545,88 510,92 C485,95 464,110 450,130 C428,105 398,90 364,96 C340,100 320,115 308,134 C285,110 255,98 222,106 C198,112 180,128 171,148 C148,125 118,115 88,124 C65,131 48,148 42,168 C20,148 0,145 0,145 L0,260 C25,255 52,248 75,234 C98,250 128,258 160,252 C188,246 210,231 222,211 C246,230 278,238 312,231 C340,225 363,209 374,189 C400,210 433,218 468,210 C496,203 517,187 526,167 C553,188 587,195 622,186 C649,178 669,161 676,140 C702,162 736,168 769,158 C793,150 810,134 816,115 C838,132 862,136 884,126 L900,120 L900,50 Z"/>
        <path d="M350,200 C320,170 285,158 250,165 C225,170 205,185 198,203 C178,182 152,172 126,180 C104,187 88,203 85,222 C65,205 42,200 20,210 L0,218 L0,320 C28,312 58,306 85,295 C108,312 138,320 170,312 C197,305 218,288 226,268 C250,286 280,292 312,283 C338,275 357,258 362,238 C382,255 408,261 435,251 C458,242 473,224 474,204 C455,210 432,210 411,202 C393,196 378,184 370,169 Z"/>
        <path d="M820,80 C800,55 775,45 750,52 C730,58 715,72 710,90 C695,72 672,62 648,70 C628,77 614,94 613,113 C600,96 580,86 558,94 C540,101 528,118 528,137 C545,128 565,124 584,128 C600,131 614,140 622,153 C638,136 660,126 684,130 C704,134 720,146 726,162 C742,146 764,137 788,142 C807,146 821,158 824,173 C838,158 852,148 865,152 L880,158 L900,150 L900,80 Z"/>
        <path d="M560,280 C535,255 505,248 476,258 C452,267 434,287 432,310 C412,292 386,285 360,295 C338,304 324,323 324,344 C344,334 367,330 389,336 C408,341 424,353 430,369 C448,350 472,341 498,347 C520,352 537,366 541,384 C559,363 583,352 608,358 C629,363 645,378 647,395 C663,376 684,366 706,372 L720,376 L740,360 C718,345 692,340 668,348 C648,355 632,370 628,388 C610,370 585,362 560,370 C538,377 522,393 520,412 C500,394 473,387 448,395 C426,402 410,419 409,439 C390,420 364,413 340,421 C318,428 303,446 303,467 C320,456 340,451 360,455 C377,459 391,469 397,482 C415,460 440,450 467,454 C491,458 509,473 513,492 C532,468 560,457 589,461 C614,465 633,480 637,500 L900,500 L900,280 Z"/>
      </g>
      <circle cx="748" cy="95" r="8" fill="var(--accent)" opacity="0.9"/>
      <circle cx="752" cy="92" r="3" fill="var(--bg)" opacity="0.8"/>
      <g stroke="var(--bg)" strokeWidth="0.8" fill="none" opacity="0.15">
        <path d="M640,120 Q650,112 660,120 Q650,128 640,120"/>
        <path d="M660,140 Q670,132 680,140 Q670,148 660,140"/>
        <path d="M700,130 Q710,122 720,130 Q710,138 700,130"/>
        <path d="M740,120 Q750,112 760,120 Q750,128 740,120"/>
        <path d="M760,145 Q770,137 780,145 Q770,153 760,145"/>
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
          <ForgeLogo height={48} />
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

      {/* Main content */}
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

      {/* Character Creator Modal */}
      {showCreator && (
        <Modal title={editingCharacter ? 'Edit Character' : 'Create Character'} open={showCreator} onClose={() => { setShowCreator(false); setEditingCharacter(null); }}>
          <CharacterCreator
            onSave={handleSaveCharacter}
            onClose={() => { setShowCreator(false); setEditingCharacter(null); }}
            character={editingCharacter}
            homebrew={store.homebrew}
          />
        </Modal>
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