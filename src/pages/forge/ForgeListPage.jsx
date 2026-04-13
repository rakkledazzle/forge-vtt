import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CATEGORY_META = {
  races:       { label:'Races',       icon:'🧬', singular:'Race'       },
  subraces:    { label:'Subraces',    icon:'🔀', singular:'Subrace'    },
  classes:     { label:'Classes',     icon:'⚔️', singular:'Class'      },
  subclasses:  { label:'Subclasses',  icon:'🎯', singular:'Subclass'   },
  backgrounds: { label:'Backgrounds', icon:'📖', singular:'Background' },
  spells:      { label:'Spells',      icon:'✨', singular:'Spell'      },
  items:       { label:'Items',       icon:'⚗️', singular:'Item'       },
  monsters:    { label:'Monsters',    icon:'👹', singular:'Monster'    },
  feats:       { label:'Feats',       icon:'🌟', singular:'Feat'       },
};

const rarityColors = {
  Common:'var(--text3)', Uncommon:'#27ae60', Rare:'#2980b9',
  'Very Rare':'#8e44ad', Legendary:'var(--gold)', Artifact:'#ff8c00',
};

function getSummary(item, category) {
  switch (category) {
    case 'races':       return `${item.size||''} · Speed ${item.speed||30}ft`;
    case 'subraces':    return `Subrace of ${item.parentRace||'Unknown'}`;
    case 'classes':     return `d${item.hitDie||8} · ${item.savingThrows?.join(', ')||''}`;
    case 'subclasses':  return `Subclass of ${item.parentClass||'Unknown'}`;
    case 'backgrounds': return `Skills: ${item.skillProficiencies?.slice(0,2).join(', ')||'None'}`;
    case 'feats':       return item.prerequisites?.spellcasting ? 'Req: Spellcasting' : 'No prerequisites';
    case 'spells': {
      const lvl = item.level === 0 ? 'Cantrip' : `Level ${item.level}`;
      return [lvl, item.school, item.ritual?'Ritual':null, item.concentration?'Concentration':null].filter(Boolean).join(' · ');
    }
    case 'items':    return `${item.rarity||''} ${item.type||''}${item.attunement?' · Requires Attunement':''}`;
    case 'monsters': return `CR ${item.cr||'?'} · ${item.size||''} ${item.type||''} · AC ${item.ac||10}`;
    default: return '';
  }
}

export default function ForgeListPage({ store, auth, showToast }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  const meta = CATEGORY_META[category] || { label: category, icon:'📜', singular: category };
  const safeHomebrew = { races:[], subraces:[], classes:[], subclasses:[], backgrounds:[], spells:[], items:[], monsters:[], feats:[], ...store.homebrew };
  const items = safeHomebrew[category] || [];
  const filtered = items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(id) {
    if (window.confirm('Delete this item? This cannot be undone.')) {
      await store.deleteHomebrew(category, id);
      showToast('Deleted.');
    }
  }

  return (
    <div className="content-area">
      <div className="breadcrumb">
        <button className="breadcrumb-btn" onClick={() => navigate('/forge')}>← The Forge</button>
        <span className="breadcrumb-sep">/</span>
        <span>{meta.icon} {meta.label}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{meta.icon} {meta.label}</h1>
          <p className="page-subtitle">
            {items.length === 0
              ? `No homebrew ${meta.label.toLowerCase()} yet`
              : `${items.length} homebrew ${items.length===1?meta.singular.toLowerCase():meta.label.toLowerCase()}`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate(`/forge/${category}/new`)}>
          + New {meta.singular}
        </button>
      </div>

      {/* Search */}
      <div style={{display:'flex', gap:'0.75rem', marginBottom:'1.5rem'}}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${meta.label.toLowerCase()}…`}
          style={{flex:1}}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{meta.icon}</div>
          <div className="empty-state-title">No {meta.label} Yet</div>
          <div className="empty-state-desc">Create your first homebrew {meta.singular.toLowerCase()} to add it to your catalog.</div>
          <button className="btn-primary" onClick={() => navigate(`/forge/${category}/new`)}>Create Now</button>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'0.6rem'}}>
          {filtered.map(item => (
            <div key={item.id} className="card" style={{padding:'0.85rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem'}}>
              <div style={{flex:1}}>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem', flexWrap:'wrap'}}>
                  <strong style={{fontFamily:"'Cinzel',serif", fontSize:'0.95rem'}}>{item.name}</strong>
                  <span style={{fontSize:'10px', padding:'1px 6px', borderRadius:'8px', background:'rgba(182,125,217,0.15)', color:'#b67dd9', border:'1px solid rgba(182,125,217,0.3)', fontWeight:700}}>HB</span>
                  {item.campaign_id && <span style={{fontSize:'10px', padding:'1px 6px', borderRadius:'8px', background:'rgba(26,188,156,0.15)', color:'#1abc9c', border:'1px solid rgba(26,188,156,0.3)', fontWeight:700}}>Shared</span>}
                  {item.level !== undefined && category==='spells' && (
                    <span style={{fontSize:'10px', padding:'1px 6px', borderRadius:'8px', background:'rgba(41,128,185,0.15)', color:'#2980b9', border:'1px solid rgba(41,128,185,0.3)', fontWeight:700}}>
                      {item.level===0?'Cantrip':`Lvl ${item.level}`}
                    </span>
                  )}
                  {item.rarity && <span style={{fontSize:'0.75rem', color:rarityColors[item.rarity]||'var(--text3)'}}>{item.rarity}</span>}
                  {item.cr && category==='monsters' && (
                    <span style={{fontSize:'10px', padding:'1px 6px', borderRadius:'8px', background:'rgba(192,57,43,0.15)', color:'#c0392b', border:'1px solid rgba(192,57,43,0.3)', fontWeight:700}}>CR {item.cr}</span>
                  )}
                </div>
                <div style={{fontSize:'0.78rem', color:'var(--text3)', marginBottom: item.description ? '0.25rem' : 0}}>
                  {getSummary(item, category)}
                </div>
                {item.description && (
                  <div style={{fontSize:'0.8rem', color:'var(--text2)', lineHeight:1.4}}>
                    {item.description.slice(0,150)}{item.description.length>150?'…':''}
                  </div>
                )}
              </div>
              <div style={{display:'flex', gap:'0.35rem', flexShrink:0}}>
                <button className="btn-ghost" style={{padding:'5px 12px', fontSize:'12px'}}
                  onClick={() => navigate(`/forge/${category}/${item.id}`)}>
                  Edit
                </button>
                <button style={{padding:'5px 10px', fontSize:'12px', borderRadius:'6px', background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.3)', color:'#c0392b', cursor:'pointer'}}
                  onClick={() => handleDelete(item.id)}>
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}