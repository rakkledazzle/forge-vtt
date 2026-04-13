import React, { useState } from 'react';

const SECTIONS = [
  { id:'start', title:'Getting Started', icon:'📖', items:[
    { title:'Basic Rules', icon:'📖', desc:'The core rules of D&D 5e in plain language — how to play, what dice to roll, and how to resolve actions.' },
    { title:'How to Play', icon:'🎲', desc:'A step-by-step overview of a session: exploration, social interaction, and combat.' },
    { title:'Combat Rules', icon:'⚔️', desc:'Initiative, turns, attacks, hit points, conditions, and how to resolve a fight.' },
  ]},
  { id:'characters', title:'Characters', icon:'🧬', items:[
    { title:'Races Overview',      icon:'🧬', desc:'A summary of all available races and their traits, ability score bonuses, and special features.' },
    { title:'Classes Overview',    icon:'⚔️', desc:'All 12 classes at a glance — hit dice, primary abilities, and what makes each one unique.' },
    { title:'Backgrounds',         icon:'📜', desc:'Character backgrounds provide skills, tools, languages, and flavor for your character\'s history.' },
    { title:'Feats Overview',      icon:'🌟', desc:'Optional character customization: powerful talents you can take instead of an ability score increase.' },
  ]},
  { id:'magic', title:'Magic & Rules', icon:'✨', items:[
    { title:'Spellcasting Rules',  icon:'✨', desc:'How spell slots work, concentration, ritual casting, and how to cast spells.' },
    { title:'Spell Slots',         icon:'📚', desc:'A breakdown of spell slot levels per class and how they recover on a short or long rest.' },
    { title:'Conditions Reference',icon:'🎯', desc:'All conditions explained: Blinded, Charmed, Frightened, Paralyzed, Prone, and more.' },
    { title:'Action Types',        icon:'⚙️', desc:'Actions, Bonus Actions, Reactions, and Free Actions — what you can do on your turn.' },
  ]},
];

function RuleCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{padding:'1rem', cursor:'pointer'}} onClick={() => setOpen(o => !o)}>
      <div style={{display:'flex', alignItems:'center', gap:'10px', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <span style={{fontSize:'1.3rem'}}>{item.icon}</span>
          <div style={{fontFamily:"'Cinzel',serif", fontSize:'0.9rem', fontWeight:700, color:'var(--text)'}}>{item.title}</div>
        </div>
        <span style={{color:'var(--text3)', fontSize:'12px'}}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{marginTop:'0.75rem', fontSize:'0.85rem', color:'var(--text2)', lineHeight:1.6, borderTop:'1px solid var(--border)', paddingTop:'0.75rem'}}>
          {item.desc}
          <div style={{marginTop:'0.75rem', fontSize:'0.78rem', color:'var(--text3)', fontStyle:'italic'}}>
            Full rules content will be integrated here in a future update.
          </div>
        </div>
      )}
    </div>
  );
}

export default function BasicsPage() {
  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 The Basics</h1>
          <p className="page-subtitle">Quick reference for D&D 5e rules and concepts</p>
        </div>
      </div>

      {SECTIONS.map(section => (
        <div key={section.id} style={{marginBottom:'2rem'}}>
          <div className="section-header" style={{marginBottom:'1rem'}}>
            <div className="section-title">{section.icon} {section.title}</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'10px'}}>
            {section.items.map(item => <RuleCard key={item.title} item={item} />)}
          </div>
        </div>
      ))}

      <div style={{padding:'2rem', background:'var(--card)', border:'1px dashed var(--border)', borderRadius:'10px', textAlign:'center', color:'var(--text3)'}}>
        <div style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>⚙️</div>
        <div style={{fontFamily:"'Cinzel',serif", fontSize:'0.9rem', marginBottom:'0.4rem', color:'var(--text2)'}}>Full rules integration coming soon</div>
        <div style={{fontSize:'0.82rem'}}>Searchable rules, condition cards, and spell lookup will be added here.</div>
      </div>
    </div>
  );
}