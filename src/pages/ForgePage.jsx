import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id:'races',       label:'Races',       icon:'🧬', desc:'Custom species and peoples' },
  { id:'subraces',    label:'Subraces',    icon:'🔀', desc:'Variants and bloodlines' },
  { id:'classes',     label:'Classes',     icon:'⚔️', desc:'New adventuring paths' },
  { id:'subclasses',  label:'Subclasses',  icon:'🎯', desc:'Archetypes and specializations' },
  { id:'backgrounds', label:'Backgrounds', icon:'📖', desc:'Origins and histories' },
  { id:'spells',      label:'Spells',      icon:'✨', desc:'Arcane and divine magic' },
  { id:'items',       label:'Items',       icon:'⚗️', desc:'Weapons, armor, and wonders' },
  { id:'monsters',    label:'Monsters',    icon:'👹', desc:'Creatures and beasts' },
  { id:'feats',       label:'Feats',       icon:'🌟', desc:'Talents and special abilities' },
];

export default function ForgePage({ store }) {
  const navigate = useNavigate();
  const safeHomebrew = {
    races:[], subraces:[], classes:[], subclasses:[],
    backgrounds:[], spells:[], items:[], monsters:[], feats:[],
    ...store.homebrew,
  };
  const total = Object.values(safeHomebrew).reduce((s,a) => s + (a?.length||0), 0);

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">The Forge 🔥</h1>
          <p className="page-subtitle">
            {total > 0
              ? `${total} homebrew creation${total!==1?'s':''} in your catalog`
              : 'Create custom races, classes, spells, items, monsters & more'}
          </p>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'14px'}}>
        {CATEGORIES.map(cat => {
          const count = (safeHomebrew[cat.id]||[]).length;
          return (
            <div key={cat.id}
              className="tool-card"
              style={{cursor:'pointer', textAlign:'left', alignItems:'flex-start', padding:'20px'}}
              onClick={() => navigate(`/forge/${cat.id}`)}
            >
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom:'8px'}}>
                <div className="tool-icon" style={{margin:0}}>{cat.icon}</div>
                {count > 0 && (
                  <span style={{background:'var(--accent)', color:'#fff', fontSize:'11px', fontWeight:700, padding:'2px 8px', borderRadius:'10px'}}>
                    {count}
                  </span>
                )}
              </div>
              <div className="tool-name" style={{textAlign:'left', marginBottom:'4px'}}>{cat.label}</div>
              <div className="tool-desc" style={{textAlign:'left'}}>{cat.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}