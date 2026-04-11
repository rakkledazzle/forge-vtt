import React, { useState } from 'react';
import { Card, Btn, Modal, FormField, Badge, SearchInput, EmptyState, Section } from './UI';
import { DAMAGE_TYPES, SPELL_SCHOOLS, ITEM_TYPES, RARITY, SRD_CLASSES } from '../data/srd';
import { ABILITY_SCORES } from '../utils/dnd';
import RaceBuilder from './Homebrew/RaceBuilder';
import SubraceBuilder from './Homebrew/SubraceBuilder';
import ClassBuilder from './Homebrew/ClassBuilder';
import SubclassBuilder from './Homebrew/SubclassBuilder';
import BackgroundBuilder from './Homebrew/BackgroundBuilder';
import FeatBuilder from './Homebrew/FeatBuilder';

const CATEGORIES = [
  { id:'races',      label:'Races',      icon:'🧬' },
  { id:'subraces',   label:'Subraces',   icon:'🔀' },
  { id:'classes',    label:'Classes',    icon:'⚔️' },
  { id:'subclasses', label:'Subclasses', icon:'🎯' },
  { id:'backgrounds',label:'Backgrounds',icon:'📖' },
  { id:'spells',     label:'Spells',     icon:'✨' },
  { id:'items',      label:'Items',      icon:'⚗️' },
  { id:'monsters',   label:'Monsters',   icon:'👹' },
  { id:'feats',      label:'Feats',      icon:'🌟' },
];

const MODAL_TITLES = {
  races:'Homebrew Race', subraces:'Homebrew Subrace',
  classes:'Homebrew Class', subclasses:'Homebrew Subclass',
  backgrounds:'Homebrew Background', spells:'Homebrew Spell',
  items:'Homebrew Item', monsters:'Homebrew Monster', feats:'Homebrew Feat',
};

// ── Spell Builder (kept from before) ─────────────────────────────────────────
function SpellForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', level:0, school:'Evocation', castingTime:'1 action', range:'60 feet',
    components:['V','S'], duration:'Instantaneous', concentration:false,
    ritual:false, description:'', atHigherLevels:'',
    classes:[], damageType:'', savingThrow:'', attackType:'',
  });
  const compList = ['V','S','M'];
  function toggleComp(c) { setF(x=>({...x,components:x.components.includes(c)?x.components.filter(x=>x!==c):[...x.components,c]})); }
  function toggleClass(cl) { setF(x=>({...x,classes:x.classes.includes(cl)?x.classes.filter(c=>c!==cl):[...x.classes,cl]})); }
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Spell Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
        <FormField label="Level">
          <select value={f.level} onChange={e=>setF(x=>({...x,level:parseInt(e.target.value)}))}>
            <option value={0}>Cantrip</option>
            {[1,2,3,4,5,6,7,8,9].map(l=><option key={l} value={l}>Level {l}</option>)}
          </select>
        </FormField>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="School">
          <select value={f.school} onChange={e=>setF(x=>({...x,school:e.target.value}))}>
            {SPELL_SCHOOLS.map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Casting Time"><input value={f.castingTime} onChange={e=>setF(x=>({...x,castingTime:e.target.value}))} /></FormField>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Range"><input value={f.range} onChange={e=>setF(x=>({...x,range:e.target.value}))} /></FormField>
        <FormField label="Duration"><input value={f.duration} onChange={e=>setF(x=>({...x,duration:e.target.value}))} /></FormField>
      </div>
      <Section title="Components">
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center',flexWrap:'wrap'}}>
          {compList.map(c=>(
            <label key={c} style={{display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer',color:'var(--text-secondary)'}}>
              <input type="checkbox" checked={f.components.includes(c)} onChange={()=>toggleComp(c)} style={{width:'auto'}} /> {c}
            </label>
          ))}
          <label style={{display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer',color:'var(--text-secondary)'}}>
            <input type="checkbox" checked={f.concentration} onChange={e=>setF(x=>({...x,concentration:e.target.checked}))} style={{width:'auto'}} /> Concentration
          </label>
          <label style={{display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer',color:'var(--text-secondary)'}}>
            <input type="checkbox" checked={f.ritual} onChange={e=>setF(x=>({...x,ritual:e.target.checked}))} style={{width:'auto'}} /> Ritual
          </label>
        </div>
        {f.components.includes('M') && <input style={{marginTop:'0.5rem'}} value={f.materialComponent||''} onChange={e=>setF(x=>({...x,materialComponent:e.target.value}))} placeholder="Material component" />}
      </Section>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Damage Type">
          <select value={f.damageType} onChange={e=>setF(x=>({...x,damageType:e.target.value}))}>
            <option value=''>None</option>
            {DAMAGE_TYPES.map(d=><option key={d}>{d}</option>)}
          </select>
        </FormField>
        <FormField label="Saving Throw">
          <select value={f.savingThrow||''} onChange={e=>setF(x=>({...x,savingThrow:e.target.value}))}>
            <option value=''>None</option>
            {ABILITY_SCORES.map(a=><option key={a}>{a}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="Description">
        <textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={5} placeholder="Full spell description…" />
      </FormField>
      <FormField label="At Higher Levels">
        <textarea value={f.atHigherLevels||''} onChange={e=>setF(x=>({...x,atHigherLevels:e.target.value}))} rows={2} />
      </FormField>
      <Section title="Available To">
        <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
          {SRD_CLASSES.map(cl=>(
            <button key={cl.id} onClick={()=>toggleClass(cl.name)}
              style={{padding:'0.25rem 0.65rem',borderRadius:'12px',border:'1px solid var(--border)',
                background:f.classes.includes(cl.name)?'rgba(201,168,76,0.2)':'transparent',
                color:f.classes.includes(cl.name)?'var(--gold)':'var(--text-muted)',
                fontFamily:"'Cinzel',serif",fontSize:'0.75rem',cursor:'pointer'}}>
              {cl.name}
            </button>
          ))}
        </div>
      </Section>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Spell</Btn>
      </div>
    </div>
  );
}

// ── Item Builder (kept from before) ──────────────────────────────────────────
function ItemForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', type:'Wondrous Item', rarity:'Common', attunement:false,
    description:'', damage:'', damageType:'', acBonus:0,
    weight:0, cost:'', flavorText:'', requiresAttunement:'',
    chargesMax:0,
  });
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Item Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
        <FormField label="Type">
          <select value={f.type} onChange={e=>setF(x=>({...x,type:e.target.value}))}>
            {ITEM_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </FormField>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Rarity">
          <select value={f.rarity} onChange={e=>setF(x=>({...x,rarity:e.target.value}))}>
            {RARITY.map(r=><option key={r}>{r}</option>)}
          </select>
        </FormField>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',paddingTop:'1.5rem'}}>
          <input type="checkbox" id="att" checked={f.attunement} onChange={e=>setF(x=>({...x,attunement:e.target.checked}))} style={{width:'auto'}}/>
          <label htmlFor="att" style={{color:'var(--text-secondary)',fontFamily:"'Cinzel',serif",fontSize:'0.85rem',cursor:'pointer'}}>Requires Attunement</label>
        </div>
      </div>
      {f.attunement && <FormField label="Attunement Requirements"><input value={f.requiresAttunement||''} onChange={e=>setF(x=>({...x,requiresAttunement:e.target.value}))} placeholder="e.g. by a spellcaster" /></FormField>}
      {f.type==='Weapon' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
          <FormField label="Damage Dice"><input value={f.damage||''} onChange={e=>setF(x=>({...x,damage:e.target.value}))} placeholder="e.g. 1d8" /></FormField>
          <FormField label="Damage Type">
            <select value={f.damageType||''} onChange={e=>setF(x=>({...x,damageType:e.target.value}))}>
              <option value=''>—</option>
              {DAMAGE_TYPES.map(d=><option key={d}>{d}</option>)}
            </select>
          </FormField>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Weight (lbs)"><input type="number" value={f.weight||0} onChange={e=>setF(x=>({...x,weight:parseFloat(e.target.value)||0}))} /></FormField>
        <FormField label="Cost"><input value={f.cost||''} onChange={e=>setF(x=>({...x,cost:e.target.value}))} placeholder="50 gp" /></FormField>
        <FormField label="Charges"><input type="number" value={f.chargesMax||0} onChange={e=>setF(x=>({...x,chargesMax:parseInt(e.target.value)||0}))} /></FormField>
      </div>
      <FormField label="Description"><textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={5} /></FormField>
      <FormField label="Flavor Text"><textarea value={f.flavorText||''} onChange={e=>setF(x=>({...x,flavorText:e.target.value}))} rows={2} /></FormField>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Item</Btn>
      </div>
    </div>
  );
}

// ── Monster Builder (kept from before) ───────────────────────────────────────
function MonsterForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', type:'Humanoid', alignment:'Unaligned', size:'Medium',
    ac:13, hp:'3d8+3', speed:'30 ft.', cr:'1',
    abilities:{Strength:10,Dexterity:10,Constitution:10,Intelligence:10,Wisdom:10,Charisma:10},
    skills:'', senses:'Darkvision 60 ft.', languages:'Common',
    immunities:'', resistances:'', vulnerabilities:'',
    traits:'', actions:'', legendaryActions:'', description:'',
  });
  function setAb(ab,v) { setF(x=>({...x,abilities:{...x.abilities,[ab]:parseInt(v)||10}})); }
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Monster Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
        <FormField label="Type"><input value={f.type} onChange={e=>setF(x=>({...x,type:e.target.value}))} placeholder="Humanoid, Beast, Undead…" /></FormField>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Size">
          <select value={f.size} onChange={e=>setF(x=>({...x,size:e.target.value}))}>
            {['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="CR"><input value={f.cr} onChange={e=>setF(x=>({...x,cr:e.target.value}))} placeholder="1/4, 1, 5…" /></FormField>
        <FormField label="Alignment"><input value={f.alignment} onChange={e=>setF(x=>({...x,alignment:e.target.value}))} /></FormField>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem'}}>
        <FormField label="AC"><input type="number" value={f.ac} onChange={e=>setF(x=>({...x,ac:parseInt(e.target.value)||10}))} /></FormField>
        <FormField label="HP"><input value={f.hp} onChange={e=>setF(x=>({...x,hp:e.target.value}))} placeholder="3d8+3" /></FormField>
        <FormField label="Speed"><input value={f.speed} onChange={e=>setF(x=>({...x,speed:e.target.value}))} /></FormField>
      </div>
      <Section title="Ability Scores">
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
          {ABILITY_SCORES.map(ab=>(
            <div key={ab} style={{textAlign:'center'}}>
              <div style={{fontSize:'0.7rem',color:'var(--text-muted)',marginBottom:'0.25rem'}}>{ab.slice(0,3)}</div>
              <input type="number" value={f.abilities[ab]||10} onChange={e=>setAb(ab,e.target.value)} style={{width:'55px',textAlign:'center'}} min={1} max={30} />
            </div>
          ))}
        </div>
      </Section>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Senses"><input value={f.senses} onChange={e=>setF(x=>({...x,senses:e.target.value}))} /></FormField>
        <FormField label="Languages"><input value={f.languages} onChange={e=>setF(x=>({...x,languages:e.target.value}))} /></FormField>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem'}}>
        <FormField label="Immunities"><input value={f.immunities||''} onChange={e=>setF(x=>({...x,immunities:e.target.value}))} /></FormField>
        <FormField label="Resistances"><input value={f.resistances||''} onChange={e=>setF(x=>({...x,resistances:e.target.value}))} /></FormField>
        <FormField label="Vulnerabilities"><input value={f.vulnerabilities||''} onChange={e=>setF(x=>({...x,vulnerabilities:e.target.value}))} /></FormField>
      </div>
      <FormField label="Traits"><textarea value={f.traits||''} onChange={e=>setF(x=>({...x,traits:e.target.value}))} rows={3} /></FormField>
      <FormField label="Actions"><textarea value={f.actions||''} onChange={e=>setF(x=>({...x,actions:e.target.value}))} rows={4} /></FormField>
      <FormField label="Legendary Actions"><textarea value={f.legendaryActions||''} onChange={e=>setF(x=>({...x,legendaryActions:e.target.value}))} rows={3} /></FormField>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Monster</Btn>
      </div>
    </div>
  );
}

// ── Catalog Card ──────────────────────────────────────────────────────────────
function HomebrewCard({ item, category, onEdit, onDelete }) {
  const [expand, setExpand] = useState(false);
  const rarityColors = { Common:'var(--text-secondary)', Uncommon:'var(--emerald)', Rare:'var(--sapphire)', 'Very Rare':'var(--violet)', Legendary:'var(--gold)', Artifact:'#ff8c00' };

  function getSummary() {
    switch(category) {
      case 'races': return `${item.size||''} · Speed ${item.speed||30}ft${item.darkvision?` · Darkvision ${item.darkvisionRange}ft`:''}`;
      case 'subraces': return `Subrace of ${item.parentRace||'Unknown'}`;
      case 'classes': return `d${item.hitDie||8} · ${item.savingThrows?.join(', ')||''}`;
      case 'subclasses': return `Subclass of ${item.parentClass||'Unknown'}`;
      case 'backgrounds': return `Skills: ${item.skillProficiencies?.slice(0,2).join(', ')||'None'}`;
      case 'feats': return item.prerequisites?.spellcasting ? 'Req: Spellcasting' : 'No prerequisites';
      case 'spells': return `${item.level===0?'Cantrip':`Level ${item.level}`} ${item.school||''}`;
      case 'items': return `${item.rarity||''} ${item.type||''}`;
      case 'monsters': return `CR ${item.cr||'?'} · AC ${item.ac||10} · ${item.hp||'?'} HP`;
      default: return '';
    }
  }

  return (
    <Card style={{ padding:'0.85rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1, cursor:'pointer' }} onClick={() => setExpand(e=>!e)}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
            <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.95rem' }}>{item.name}</strong>
            <Badge color='violet'>HB</Badge>
            {item.campaign_id && <Badge color='emerald'>Shared</Badge>}
            {item.level !== undefined && category==='spells' && <Badge color='sapphire'>{item.level===0?'Cantrip':`Lvl ${item.level}`}</Badge>}
            {item.rarity && <span style={{ fontSize:'0.75rem', color:rarityColors[item.rarity]||'var(--text-muted)' }}>{item.rarity}</span>}
            {item.cr && category==='monsters' && <Badge color='crimson'>CR {item.cr}</Badge>}
          </div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{getSummary()}</div>
          {item.description && (
            <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:'0.25rem', lineHeight:1.4 }}>
              {expand ? item.description : `${item.description.slice(0,100)}${item.description.length>100?'…':''}`}
            </div>
          )}
          {expand && item.features?.length > 0 && (
            <div style={{ marginTop:'0.5rem' }}>
              {item.features.map((feat,i) => (
                <div key={i} style={{ padding:'0.4rem 0.6rem', borderLeft:'2px solid var(--gold)', marginBottom:'0.3rem' }}>
                  <strong style={{ fontSize:'0.82rem', color:'var(--gold)', fontFamily:"'Cinzel',serif" }}>{feat.name}</strong>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginLeft:'0.4rem' }}>{feat.featureType}</span>
                  <p style={{ fontSize:'0.78rem', color:'var(--text-secondary)', margin:'0.2rem 0 0' }}>{feat.description}</p>
                </div>
              ))}
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
  const [category, setCategory] = useState('races');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  // Make sure homebrew has entries for new categories
  const safeHomebrew = {
    races:[], subraces:[], classes:[], subclasses:[],
    backgrounds:[], spells:[], items:[], monsters:[], feats:[],
    ...homebrew,
  };

  const items = safeHomebrew[category] || [];
  const filtered = items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));

  function openNew() { setEditing(null); setModal(category); }
  function openEdit(item) { setEditing(item); setModal(category); }
  function handleSave(data) {
    onSave(category, editing ? {...data, id:editing.id} : data, selectedCampaign || null);
    setModal(null);
    setEditing(null);
    setSelectedCampaign('');
  }

  const totalItems = Object.values(safeHomebrew).reduce((s,a)=>s+(a?.length||0),0);

  function renderForm() {
    const props = { item: editing, onSave: handleSave, onClose: () => { setModal(null); setEditing(null); } };
    switch(modal) {
      case 'races':       return <RaceBuilder {...props} />;
      case 'subraces':    return <SubraceBuilder {...props} parentRaces={safeHomebrew.races} />;
      case 'classes':     return <ClassBuilder {...props} />;
      case 'subclasses':  return <SubclassBuilder {...props} parentClasses={safeHomebrew.classes} />;
      case 'backgrounds': return <BackgroundBuilder {...props} />;
      case 'spells':      return <SpellForm {...props} />;
      case 'items':       return <ItemForm {...props} />;
      case 'monsters':    return <MonsterForm {...props} />;
      case 'feats':       return <FeatBuilder {...props} homebrew={safeHomebrew} />;
      default: return null;
    }
  }

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ color:'var(--gold)', marginBottom:'0.25rem' }}>🔨 The Homebrew Forge</h2>
          <div style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{totalItems} homebrew creation{totalItems!==1?'s':''} in your catalog</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:'1.5rem' }}>
        {/* Sidebar */}
        <div>
          {CATEGORIES.map(cat => {
            const count = (safeHomebrew[cat.id]||[]).length;
            return (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.5rem',
                  width:'100%', padding:'0.65rem 0.85rem', marginBottom:'0.3rem',
                  background:category===cat.id?'var(--bg-raised)':'transparent',
                  border:`1px solid ${category===cat.id?'var(--border-bright)':'transparent'}`,
                  borderRadius:'var(--radius-sm)', color:category===cat.id?'var(--gold)':'var(--text-muted)',
                  fontFamily:"'Cinzel',serif", fontSize:'0.82rem', cursor:'pointer', textAlign:'left',
                  transition:'all 0.15s' }}
                onMouseEnter={e => { if(category!==cat.id) e.currentTarget.style.color='var(--text-secondary)'; }}
                onMouseLeave={e => { if(category!==cat.id) e.currentTarget.style.color='var(--text-muted)'; }}
              >
                <span>{cat.icon} {cat.label}</span>
                {count>0 && <span style={{ background:'var(--bg-void)', color:'var(--text-muted)', padding:'0.1rem 0.4rem', borderRadius:'10px', fontSize:'0.7rem' }}>{count}</span>}
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
            <Btn variant='primary' onClick={openNew}>+ New {CATEGORIES.find(c=>c.id===category)?.label.slice(0,-1)}</Btn>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={CATEGORIES.find(c=>c.id===category)?.icon||'📜'} title={`No homebrew ${category} yet`}
              desc={`Create your first homebrew ${category.slice(0,-1)} to add it to your catalog.`}
              action={<Btn variant='primary' onClick={openNew}>Create Now</Btn>} />
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {filtered.map(item => (
                <HomebrewCard key={item.id} item={item} category={category} onEdit={openEdit} onDelete={id => onDelete(category,id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Builder Modal */}
      <Modal open={!!modal} onClose={() => { setModal(null); setEditing(null); }}
        title={`${editing?'Edit':'Create'} ${MODAL_TITLES[modal]||''}`} width='750px'>
        {/* Campaign sharing */}
        {campaigns?.length > 0 && (
          <div style={{ marginBottom:'1rem', padding:'0 0 1rem', borderBottom:'1px solid var(--border)' }}>
            <label style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", letterSpacing:'0.05em', textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>
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