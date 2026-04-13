import React from 'react';
import { useNavigate } from 'react-router-dom';

function classColor(cls) {
  const map = { Barbarian:'#c0392b', Bard:'#8e44ad', Cleric:'#f39c12', Druid:'#27ae60', Fighter:'#7f8c8d', Monk:'#16a085', Paladin:'#2980b9', Ranger:'#2ecc71', Rogue:'#34495e', Sorcerer:'#e74c3c', Warlock:'#9b59b6', Wizard:'#3498db' };
  return map[cls] || 'var(--accent)';
}

function CharacterCard({ character, onClick, onDelete }) {
  const hp = character.hp || { current:0, max:0 };
  const hpPct = hp.max > 0 ? Math.max(0, Math.min(100, (hp.current/hp.max)*100)) : 100;
  const hpColor = hpPct > 60 ? '#1abc9c' : hpPct > 30 ? '#f39c12' : '#e74c3c';
  return (
    <div className="char-card" onClick={onClick} style={{position:'relative'}}>
      <div className="char-card-banner" style={{background:`linear-gradient(135deg, ${classColor(character.class)}, var(--bg3))`}}/>
      <div className="char-card-body">
        <div className="char-avatar" style={{background:`linear-gradient(135deg, ${classColor(character.class)}, var(--bg2))`}}>
          {(character.name||'?')[0].toUpperCase()}
        </div>
        <div className="char-name">{character.name||'Unnamed'}</div>
        <div className="char-meta">{[character.race,character.class,character.subclass].filter(Boolean).join(' · ')}</div>
        <div className="char-level">Level {character.level||1}</div>
        <div className="char-hp-bar"><div className="char-hp-fill" style={{width:`${hpPct}%`,background:hpColor}}/></div>
      </div>
      <button style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.3)',border:'none',color:'#fff',width:22,height:22,borderRadius:'50%',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',opacity:0,transition:'opacity 0.2s'}}
        onClick={e=>{e.stopPropagation();onDelete();}}
        onMouseEnter={e=>e.currentTarget.style.opacity='1'}
        onMouseLeave={e=>e.currentTarget.style.opacity='0'}
      >×</button>
    </div>
  );
}

export default function CharactersPage({ store, showToast }) {
  const navigate = useNavigate();

  async function handleDelete(id) {
    const char = store.characters.find(c => c.id === id);
    if (window.confirm(`Delete ${char?.name||'this character'}? This cannot be undone.`)) {
      await store.deleteCharacter(id);
      showToast('Character deleted.');
    }
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Characters</h1>
          <p className="page-subtitle">
            {store.characters.length === 0
              ? 'No adventurers yet — forge your first hero!'
              : `${store.characters.length} adventurer${store.characters.length!==1?'s':''} ready`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/characters/new')}>+ New Character</button>
      </div>

      {store.characters.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚔️</div>
          <div className="empty-state-title">No Characters Yet</div>
          <div className="empty-state-desc">Create your first character to begin your adventure!</div>
          <button className="btn-primary" onClick={() => navigate('/characters/new')}>Create First Character</button>
        </div>
      ) : (
        <div className="char-grid">
          {store.characters.map(char => (
            <CharacterCard key={char.id} character={char}
              onClick={() => navigate(`/characters/${char.id}`)}
              onDelete={() => handleDelete(char.id)}
            />
          ))}
          <div className="char-card-new" onClick={() => navigate('/characters/new')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            New Character
          </div>
        </div>
      )}
    </div>
  );
}