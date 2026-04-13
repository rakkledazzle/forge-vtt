import React, { useState } from 'react';
import { Card, Btn, Modal, FormField, Badge, SearchInput, EmptyState, Section } from './UI';
import RaceBuilder from './homebrew/RaceBuilder';
import SubraceBuilder from './homebrew/SubraceBuilder';
import ClassBuilder from './homebrew/ClassBuilder';
import SubclassBuilder from './homebrew/SubclassBuilder';
import BackgroundBuilder from './homebrew/BackgroundBuilder';
import FeatBuilder from './homebrew/FeatBuilder';
import SpellBuilder from './homebrew/SpellBuilder';
import ItemBuilder from './homebrew/ItemBuilder';
import MonsterBuilder from './homebrew/MonsterBuilder';

const CATEGORIES = [
  { id:'races',       label:'Races',       icon:'🧬' },
  { id:'subraces',    label:'Subraces',    icon:'🔀' },
  { id:'classes',     label:'Classes',     icon:'⚔️' },
  { id:'subclasses',  label:'Subclasses',  icon:'🎯' },
  { id:'backgrounds', label:'Backgrounds', icon:'📖' },
  { id:'spells',      label:'Spells',      icon:'✨' },
  { id:'items',       label:'Items',       icon:'⚗️' },
  { id:'monsters',    label:'Monsters',    icon:'👹' },
  { id:'feats',       label:'Feats',       icon:'🌟' },
];

const MODAL_TITLES = {
  races:'Homebrew Race', subraces:'Homebrew Subrace',
  classes:'Homebrew Class', subclasses:'Homebrew Subclass',
  backgrounds:'Homebrew Background', spells:'Homebrew Spell',
  items:'Homebrew Item', monsters:'Homebrew Monster', feats:'Homebrew Feat',
};

// ── Catalog Card ──────────────────────────────────────────────────────────────
function HomebrewCard({ item, category, onEdit, onDelete }) {
  const [expand, setExpand] = useState(false);
  const rarityColors = {
    Common:'var(--text3)', Uncommon:'#27ae60', Rare:'#2980b9',
    'Very Rare':'#8e44ad', Legendary:'var(--gold)', Artifact:'#ff8c00',
  };

  function getSummary() {
    switch (category) {
      case 'races':       return `${item.size||''} · Speed ${item.speed||30}ft${item.darkvision?` · Darkvision ${item.darkvisionRange}ft`:''}`;
      case 'subraces':    return `Subrace of ${item.parentRace||'Unknown'}`;
      case 'classes':     return `d${item.hitDie||8} · ${item.savingThrows?.join(', ')||''}`;
      case 'subclasses':  return `Subclass of ${item.parentClass||'Unknown'}`;
      case 'backgrounds': return `Skills: ${item.skillProficiencies?.slice(0,2).join(', ')||'None'}`;
      case 'feats':       return item.prerequisites?.spellcasting ? 'Req: Spellcasting' : 'No prerequisites';
      case 'spells': {
        const lvl = item.level === 0 ? 'Cantrip' : `Level ${item.level}`;
        const tags = [lvl, item.school, item.ritual ? 'Ritual' : null, item.concentration ? 'Concentration' : null].filter(Boolean);
        return tags.join(' · ');
      }
      case 'items':    return `${item.rarity||''} ${item.type||''}${item.attunement ? ' · Requires Attunement' : ''}`;
      case 'monsters': return `CR ${item.cr||'?'} · ${item.size||''} ${item.type||''} · AC ${item.ac||10} · Avg HP ${Math.floor((item.hpDieCount||1) * (((item.hpDie||8)+1)/2)) + (item.hpModifier||0)}`;
      default: return '';
    }
  }

  return (
    <Card style={{ padding:'0.85rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1, cursor:'pointer' }} onClick={() => setExpand(e => !e)}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
            <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.95rem' }}>{item.name}</strong>
            <Badge color='violet'>HB</Badge>
            {item.campaign_id && <Badge color='emerald'>Shared</Badge>}
            {item.level !== undefined && category === 'spells' && (
              <Badge color='sapphire'>{item.level === 0 ? 'Cantrip' : `Lvl ${item.level}`}</Badge>
            )}
            {item.rarity && (
              <span style={{ fontSize:'0.75rem', color:rarityColors[item.rarity]||'var(--text3)' }}>{item.rarity}</span>
            )}
            {item.cr && category === 'monsters' && <Badge color='crimson'>CR {item.cr}</Badge>}
          </div>
          <div style={{ fontSize:'0.78rem', color:'var(--text3)' }}>{getSummary()}</div>
          {item.description && (
            <div style={{ fontSize:'0.8rem', color:'var(--text2)', marginTop:'0.25rem', lineHeight:1.4 }}>
              {expand ? item.description : `${item.description.slice(0,120)}${item.description.length > 120 ? '…' : ''}`}
            </div>
          )}
          {expand && item.features?.length > 0 && (
            <div style={{ marginTop:'0.5rem' }}>
              {item.features.map((feat, i) => (
                <div key={i} style={{ padding:'0.4rem 0.6rem', borderLeft:'2px solid var(--gold)', marginBottom:'0.3rem' }}>
                  <strong style={{ fontSize:'0.82rem', color:'var(--gold)', fontFamily:"'Cinzel',serif" }}>{feat.name}</strong>
                  <span style={{ fontSize:'0.75rem', color:'var(--text3)', marginLeft:'0.4rem' }}>{feat.featureType}</span>
                  <p style={{ fontSize:'0.78rem', color:'var(--text2)', margin:'0.2rem 0 0' }}>{feat.description}</p>
                </div>
              ))}
            </div>
          )}
          {/* Monster stat preview on expand */}
          {expand && category === 'monsters' && item.abilities && (
            <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem', flexWrap:'wrap' }}>
              {Object.entries(item.abilities).map(([ab, score]) => {
                const m = Math.floor((score - 10) / 2);
                return (
                  <div key={ab} style={{ textAlign:'center', background:'var(--bg2)', borderRadius:'6px', padding:'4px 8px', minWidth:'42px' }}>
                    <div style={{ fontSize:'0.65rem', color:'var(--text3)', fontFamily:"'Cinzel',serif", fontWeight:700 }}>{ab}</div>
                    <div style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--text)' }}>{score}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--accent)', fontWeight:700 }}>{m >= 0 ? `+${m}` : m}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:'0.35rem', flexShrink:0, marginLeft:'0.5rem' }}>
          <Btn size='sm' variant='dark' onClick={() => onEdit(item)}>Edit</Btn>
          <Btn size='sm' variant='danger' onClick={() => onDelete(item.id)}>×</Btn>
        </div>
      </div>
    </Card>
  );
}

// ── Main HomebrewForge ────────────────────────────────────────────────────────
export default function HomebrewForge({ homebrew, onSave, onDelete, campaigns, user }) {
  const [category,         setCategory]         = useState('races');
  const [modal,            setModal]            = useState(null);
  const [editing,          setEditing]          = useState(null);
  const [search,           setSearch]           = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  const safeHomebrew = {
    races:[], subraces:[], classes:[], subclasses:[],
    backgrounds:[], spells:[], items:[], monsters:[], feats:[],
    ...homebrew,
  };

  const items    = safeHomebrew[category] || [];
  const filtered = items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));

  function openNew()      { setEditing(null);  setModal(category); }
  function openEdit(item) { setEditing(item);  setModal(category); }
  function handleSave(data) {
    onSave(category, editing ? { ...data, id: editing.id } : data, selectedCampaign || null);
    setModal(null);
    setEditing(null);
    setSelectedCampaign('');
  }
  function handleClose() { setModal(null); setEditing(null); }

  const totalItems = Object.values(safeHomebrew).reduce((s, a) => s + (a?.length || 0), 0);

  function renderForm() {
    const props = { item: editing, onSave: handleSave, onClose: handleClose };
    switch (modal) {
      case 'races':       return <RaceBuilder       {...props} />;
      case 'subraces':    return <SubraceBuilder    {...props} parentRaces={safeHomebrew.races} />;
      case 'classes':     return <ClassBuilder      {...props} />;
      case 'subclasses':  return <SubclassBuilder   {...props} parentClasses={safeHomebrew.classes} />;
      case 'backgrounds': return <BackgroundBuilder {...props} />;
      case 'spells':      return <SpellBuilder      {...props} />;
      case 'items':       return <ItemBuilder       {...props} />;
      case 'monsters':    return <MonsterBuilder    {...props} />;
      case 'feats':       return <FeatBuilder       {...props} homebrew={safeHomebrew} />;
      default:            return null;
    }
  }

  const currentCat = CATEGORIES.find(c => c.id === category);

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ color:'var(--gold)', marginBottom:'0.25rem' }}>🔨 The Homebrew Forge</h2>
          <div style={{ color:'var(--text3)', fontSize:'0.85rem' }}>{totalItems} homebrew creation{totalItems !== 1 ? 's' : ''} in your catalog</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:'1.5rem' }}>
        {/* Sidebar */}
        <div>
          {CATEGORIES.map(cat => {
            const count = (safeHomebrew[cat.id] || []).length;
            const active = category === cat.id;
            return (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.5rem',
                  width:'100%', padding:'0.65rem 0.85rem', marginBottom:'0.3rem',
                  background: active ? 'var(--bg2)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border2)' : 'transparent'}`,
                  borderRadius:'7px',
                  color: active ? 'var(--accent)' : 'var(--text3)',
                  fontFamily:"'Cinzel',serif", fontSize:'0.82rem', cursor:'pointer', textAlign:'left',
                  transition:'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text2)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text3)'; }}
              >
                <span>{cat.icon} {cat.label}</span>
                {count > 0 && (
                  <span style={{ background:'var(--bg3)', color:'var(--text3)', padding:'0.1rem 0.4rem', borderRadius:'10px', fontSize:'0.7rem' }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem' }}>
            <div style={{ flex:1 }}>
              <SearchInput value={search} onChange={setSearch} placeholder={`Search ${category}…`} />
            </div>
            <Btn variant='primary' onClick={openNew}>
              + New {currentCat?.label.replace(/s$/, '') || ''}
            </Btn>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={currentCat?.icon || '📜'}
              title={`No homebrew ${category} yet`}
              desc={`Create your first homebrew ${category.replace(/s$/, '')} to add it to your catalog.`}
              action={<Btn variant='primary' onClick={openNew}>Create Now</Btn>}
            />
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {filtered.map(item => (
                <HomebrewCard
                  key={item.id}
                  item={item}
                  category={category}
                  onEdit={openEdit}
                  onDelete={id => onDelete(category, id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Builder Modal */}
      <Modal
        open={!!modal}
        onClose={handleClose}
        title={`${editing ? 'Edit' : 'Create'} ${MODAL_TITLES[modal] || ''}`}
        width='780px'
      >
        {/* Campaign sharing */}
        {campaigns?.length > 0 && (
          <div style={{ marginBottom:'1rem', padding:'0 0 1rem', borderBottom:'1px solid var(--border)' }}>
            <label style={{ fontSize:'0.78rem', color:'var(--text3)', fontFamily:"'Cinzel',serif", letterSpacing:'0.05em', textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>
              Share with Campaign (optional)
            </label>
            <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} style={{ width:'100%' }}>
              <option value=''>Personal only</option>
              {campaigns.filter(c => c.owner_id === user?.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        {renderForm()}
      </Modal>
    </div>
  );
}