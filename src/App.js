import React, { useState, useRef } from 'react';
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
import { Modal, Btn, EmptyState } from './components/UI';

const NAV_ITEMS = [
  { id: 'characters', label: 'Characters', icon: '⚔️' },
  { id: 'initiative', label: 'Initiative',  icon: '🎯' },
  { id: 'maps',       label: 'Maps',        icon: '🗺️' },
  { id: 'campaigns',  label: 'Campaigns',   icon: '📜' },
  { id: 'homebrew',   label: 'The Forge',   icon: '🔥' },
];

const DICE = [
  { label: 'd4',   sides: 4   },
  { label: 'd6',   sides: 6   },
  { label: 'd8',   sides: 8   },
  { label: 'd10',  sides: 10  },
  { label: 'd12',  sides: 12  },
  { label: 'd20',  sides: 20  },
  { label: 'd100', sides: 100 },
  { label: '2d6',  sides: 6, count: 2 },
];

function classColor(cls) {
  const map = {
    Barbarian:'#c0392b', Bard:'#8e44ad', Cleric:'#f39c12', Druid:'#27ae60',
    Fighter:'#7f8c8d', Monk:'#16a085', Paladin:'#2980b9', Ranger:'#2ecc71',
    Rogue:'#34495e', Sorcerer:'#e74c3c', Warlock:'#9b59b6', Wizard:'#3498db',
  };
  return map[cls] || '#9a6f28';
}

function CharacterCard({ character, onClick, onDelete }) {
  const hp = character.hp || { current: 0, max: 0 };
  const hpPct = hp.max > 0 ? Math.max(0, Math.min(100, (hp.current / hp.max) * 100)) : 100;
  const hpColor = hpPct > 60 ? '#16a34a' : hpPct > 30 ? '#d97706' : '#dc2626';
  return (
    <div className="char-card" onClick={onClick}>
      <div className="char-card-header">
        <div className="char-avatar" style={{ background: `linear-gradient(135deg, ${classColor(character.class)}, #c9a87c)` }}>
          {(character.name || '?')[0].toUpperCase()}
        </div>
        <div className="char-card-info">
          <div className="char-name">{character.name || 'Unnamed'}</div>
          <div className="char-meta">{[character.race, character.class, character.subclass].filter(Boolean).join(' · ')}</div>
          <div className="char-level">Level {character.level || 1}</div>
        </div>
        <button className="char-delete-btn" onClick={e => { e.stopPropagation(); onDelete(); }}>×</button>
      </div>
      <div className="hp-track">
        <div className="hp-bar-bg"><div className="hp-bar-fill" style={{ width:`${hpPct}%`, background: hpColor }}/></div>
        <span className="hp-label" style={{ color: hpColor }}>{hp.current}/{hp.max} HP</span>
      </div>
      {character.background && <div className="char-bg-tag">{character.background}</div>}
    </div>
  );
}

function FloatingDiceRoller() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(null);
  const ref = useRef(null);

  function roll(sides, count = 1, label) {
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);
    setResult({
      total, rolls, label,
      critical: sides === 20 && count === 1 && total === 20,
      fumble: sides === 20 && count === 1 && total === 1,
    });
  }

  return (
    <div ref={ref} style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:200 }}>
      {open && (
        <div className="dice-popup">
          <div className="dice-popup-title">🎲 Roll Dice</div>
          <div className="dice-grid">
            {DICE.map(d => (
              <button key={d.label} className="dice-btn" onClick={() => roll(d.sides, d.count||1, d.label)}>
                {d.label}
              </button>
            ))}
          </div>
          {result && (
            <div className="dice-result">
              <div className={`dice-result-num ${result.critical ? 'dice-result-critical' : result.fumble ? 'dice-result-fail' : 'dice-result-normal'}`}>
                {result.total}
              </div>
              <div className="dice-result-label">
                {result.label}
                {result.rolls.length > 1 && ` (${result.rolls.join(' + ')})`}
                {result.critical && ' ✨ Critical!'}
                {result.fumble && ' 💀 Fumble!'}
              </div>
            </div>
          )}
        </div>
      )}
      <button className="dice-fab" onClick={() => setOpen(o => !o)}>🎲</button>
    </div>
  );
}

function Toast({ message, show }) {
  return <div className={`toast ${show ? 'show' : ''}`}>{message}</div>;
}

function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:'#f4f1eb', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
      <PrideDie size={64} animated />
      <div style={{ fontFamily:"'Cinzel', serif", color:'#9a6f28', fontSize:'0.85rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
        Loading your adventure...
      </div>
    </div>
  );
}

export default function App() {
  const auth = useAuth();
  const store = useStore(auth.user);
  const [activeTab, setActiveTab] = useState('characters');
  const [showCreator, setShowCreator] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [viewingCharacter, setViewingCharacter] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimer = useRef(null);

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
    if (!char.id) setTimeout(() => setViewingCharacter({ ...char, id }), 50);
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

  const totalHomebrew = Object.values(store.homebrew).reduce((n, arr) => n + arr.length, 0);

  // Show loading screen while checking auth
  if (auth.loading) return <LoadingScreen />;

  // Show auth page if not logged in
  if (!auth.user) return <Auth onAuth={auth} />;

  // Show loading screen while fetching data
  if (store.loading) return <LoadingScreen />;

  return (
    <div className="app-root">
      {/* Sidebar */}
      <nav className={`sidebar ${navOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { setActiveTab('characters'); setNavOpen(false); }}>
          <PrideDie size={44} animated />
          <div className="sidebar-brand">
            <span className="brand-main">The Forge</span>
            <span className="brand-sub">D&D 5e Companion</span>
          </div>
        </div>

        <div className="nav-divider" />

        <ul className="nav-list">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeTab === item.id ? 'nav-item-active' : ''}`}
                onClick={() => { setActiveTab(item.id); setNavOpen(false); if (item.id !== 'characters') setViewingCharacter(null); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.id === 'characters' && store.characters.length > 0 && (
                  <span className="nav-badge">{store.characters.length}</span>
                )}
                {item.id === 'homebrew' && totalHomebrew > 0 && (
                  <span className="nav-badge nav-badge-gold">{totalHomebrew}</span>
                )}
                {item.id === 'initiative' && store.initiative.active && (
                  <span className="nav-badge nav-badge-red">●</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-divider" />

        {/* User section */}
        <div style={{ padding:'0.75rem 1rem' }}>
          <div style={{ fontSize:'0.78rem', color:'#6b5c45', marginBottom:'0.5rem', fontFamily:"'Cinzel', serif", letterSpacing:'0.04em' }}>
            {auth.user.user_metadata?.full_name || auth.user.email}
          </div>
          <button className="nav-item" style={{ width:'100%', fontSize:'0.72rem', color:'#b02020' }} onClick={auth.signOut}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Sign Out</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <span className="footer-text">Made with 🎲 for adventurers</span>
        </div>
      </nav>

      {navOpen && <div className="nav-overlay" onClick={() => setNavOpen(false)} />}

      {/* Main content */}
      <div className="main-content">
        <header className="mobile-header">
          <button className="hamburger" onClick={() => setNavOpen(true)}>☰</button>
          <div className="mobile-title"><PrideDie size={28} /><span>The Forge</span></div>
        </header>

        <div className="content-area">

          {/* Characters */}
          {activeTab === 'characters' && (
            viewingCharacter ? (
              <div>
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
              </div>
            ) : (
              <div>
                <div className="page-header">
                  <div>
                    <h1 className="page-title">Characters</h1>
                    <p className="page-subtitle">{store.characters.length === 0 ? 'No adventurers yet — forge your first hero!' : `${store.characters.length} adventurer${store.characters.length !== 1 ? 's' : ''} ready`}</p>
                  </div>
                  <Btn variant="primary" onClick={() => { setEditingCharacter(null); setShowCreator(true); }}>+ New Character</Btn>
                </div>
                {store.characters.length === 0 ? (
                  <EmptyState icon="⚔️" title="No Characters Yet"
                    desc="Create your first character to begin your adventure!"
                    action={<Btn variant="primary" onClick={() => setShowCreator(true)}>Create First Character</Btn>}
                  />
                ) : (
                  <div className="char-grid">
                    {store.characters.map(char => (
                      <CharacterCard key={char.id} character={char}
                        onClick={() => setViewingCharacter(char)}
                        onDelete={() => handleDeleteCharacter(char.id)}
                      />
                    ))}
                    <div className="char-card char-card-new" onClick={() => { setEditingCharacter(null); setShowCreator(true); }}>
                      <div className="new-char-content"><span className="new-char-plus">+</span><span>New Character</span></div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* Initiative */}
          {activeTab === 'initiative' && (
            <div>
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
            <div>
              <div className="page-header">
                <div><h1 className="page-title">Maps & VTT</h1><p className="page-subtitle">Place tokens, track positions, run encounters</p></div>
              </div>
              <MapsVTT maps={store.maps} onSave={store.saveMap} onDelete={store.deleteMap} />
            </div>
          )}

          {/* Campaigns */}
          {activeTab === 'campaigns' && (
            <div>
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
            <div>
              <div className="page-header">
                <div><h1 className="page-title">The Forge 🔥</h1><p className="page-subtitle">Create custom races, classes, spells, items, monsters & more</p></div>
              </div>
              <HomebrewForge homebrew={store.homebrew} onSave={store.saveHomebrew} onDelete={store.deleteHomebrew} />
            </div>
          )}

        </div>
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

      <FloatingDiceRoller />
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}