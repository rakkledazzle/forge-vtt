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
      <div className="char-card-banner" style={{background:`linear-gradient(135deg, ${classColor(character.class)}, var(--bg3))`}} />
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

export default function HomePage({ store, auth, showToast }) {
  const navigate = useNavigate();
  const { characters, campaigns, initiative } = store;
  const displayName = auth.user?.user_metadata?.full_name || auth.user?.email?.split('@')[0] || 'Adventurer';

  async function handleDeleteCharacter(id) {
    const char = characters.find(c => c.id === id);
    if (window.confirm(`Delete ${char?.name||'this character'}? This cannot be undone.`)) {
      await store.deleteCharacter(id);
      showToast('Character deleted.');
    }
  }

  return (
    <>
      <div className="hero">
        <div>
          <div className="hero-eyebrow">D&D 5e Companion</div>
          <div className="hero-title">Welcome back,<br />{displayName}</div>
          <div className="hero-subtitle">
            {characters.length} character{characters.length!==1?'s':''} · {campaigns.length} campaign{campaigns.length!==1?'s':''} · Ready to adventure
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/characters/new')}>+ New Character</button>
            <button className="btn-primary" onClick={() => navigate('/campaigns')}>🔗 Join Campaign</button>
            <button className="btn-secondary" onClick={() => navigate('/forge')}>📖 The Forge</button>
          </div>
        </div>
        <div className="activity-card">
          <div className="activity-title">Recent Activity</div>
          {characters.slice(0,2).map(c => (
            <div key={c.id} className="activity-item" onClick={() => navigate(`/characters/${c.id}`)}>
              <div className="activity-dot" style={{background:classColor(c.class)}}/>
              <div className="activity-text"><strong>{c.name}</strong> — Lv {c.level||1} {c.class}</div>
              <div className="activity-time">Character</div>
            </div>
          ))}
          {campaigns.slice(0,2).map(c => (
            <div key={c.id} className="activity-item" onClick={() => navigate('/campaigns')}>
              <div className="activity-dot" style={{background:'var(--gold)'}}/>
              <div className="activity-text"><strong>{c.name}</strong></div>
              <div className="activity-time">Campaign</div>
            </div>
          ))}
          {initiative?.active && (
            <div className="activity-item" onClick={() => navigate('/initiative')}>
              <div className="activity-dot" style={{background:'#e74c3c'}}/>
              <div className="activity-text"><strong>Combat active</strong> — Round {initiative.round}</div>
              <div className="activity-time">Live</div>
            </div>
          )}
          {characters.length===0 && campaigns.length===0 && !initiative?.active && (
            <div style={{color:'var(--text3)',fontSize:'13px',textAlign:'center',padding:'1.5rem 0'}}>
              No recent activity yet.<br/>Create your first character to begin!
            </div>
          )}
        </div>
      </div>

      <div className="content-area">
        {initiative?.active && (
          <div className="combat-banner" onClick={() => navigate('/initiative')}>
            <div className="combat-pulse"/>
            <div className="combat-label">⚔️ Combat Active</div>
            <div className="combat-detail">Round {initiative.round} · {initiative.combatants?.length||0} combatants</div>
            <button className="btn-primary" style={{padding:'7px 16px',fontSize:'11px'}}>Resume →</button>
          </div>
        )}

        <div className="section-header">
          <div className="section-title">⚔️ My Characters</div>
          <div className="section-link" onClick={() => navigate('/characters')}>View All →</div>
        </div>
        {characters.length===0 ? (
          <div className="empty-state" style={{padding:'2rem 0'}}>
            <div className="empty-state-icon">⚔️</div>
            <div className="empty-state-title">No Characters Yet</div>
            <div className="empty-state-desc">Create your first character to begin your adventure!</div>
            <button className="btn-primary" onClick={() => navigate('/characters/new')}>Create First Character</button>
          </div>
        ) : (
          <div className="char-grid">
            {characters.slice(0,4).map(char => (
              <CharacterCard key={char.id} character={char}
                onClick={() => navigate(`/characters/${char.id}`)}
                onDelete={() => handleDeleteCharacter(char.id)}
              />
            ))}
            <div className="char-card-new" onClick={() => navigate('/characters/new')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              New Character
            </div>
          </div>
        )}

        <div className="section-divider"/>

        <div className="section-header">
          <div className="section-title">📜 My Campaigns</div>
          <div className="section-link" onClick={() => navigate('/campaigns')}>View All →</div>
        </div>
        <div className="campaign-grid">
          {campaigns.slice(0,3).map(c => (
            <div key={c.id} className="campaign-card" onClick={() => navigate('/campaigns')}>
              <div className="campaign-name">{c.name}</div>
              <div className="campaign-meta">{c.setting||'No setting'} · {(c.members||[]).length} members</div>
              <div className="campaign-tags">
                {c.owner_id===auth.user?.id && <span className="tag tag-dm">DM</span>}
                <span className="tag tag-active">{c.status||'Active'}</span>
                {c.invite_code && <span className="tag tag-neutral">Code: {c.invite_code}</span>}
              </div>
            </div>
          ))}
          <div className="campaign-card"
            style={{border:'1px dashed var(--border)',background:'transparent',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:7,color:'var(--text3)',minHeight:100}}
            onClick={() => navigate('/campaigns')}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.color='var(--accent)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text3)';}}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="14"/><line x1="6" y1="10" x2="14" y2="10"/></svg>
            <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em'}}>New / Join Campaign</div>
          </div>
        </div>

        <div className="section-divider"/>

        <div className="section-header"><div className="section-title">🛠️ Quick Tools</div></div>
        <div className="tool-grid">
          {[
            {icon:'🎯',name:'Initiative',desc:'Start or resume combat',path:'/initiative'},
            {icon:'🗺️',name:'Maps VTT',desc:'Open battle maps',path:'/maps'},
            {icon:'🎲',name:'Dice Roller',desc:'Roll any combination',path:null},
            {icon:'🔥',name:'The Forge',desc:'Create homebrew content',path:'/forge'},
          ].map(tool => (
            <div key={tool.name} className="tool-card" onClick={() => tool.path && navigate(tool.path)}>
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