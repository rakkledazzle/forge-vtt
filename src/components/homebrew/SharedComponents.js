import React, { useState } from 'react';
import { Btn, FormField, Card, Section } from '../UI';

// ── Data Constants ────────────────────────────────────────────────────────────

export const LANGUAGES = ['Abyssal','Celestial','Common','Deep Speech','Draconic','Dwarvish','Elvish','Giant','Gnomish','Goblin','Halfling','Infernal','Orc','Primordial','Sylvan','Undercommon'];

export const SKILLS = ['Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight','Intimidation','Investigation','Medicine','Nature','Perception','Performance','Persuasion','Religion','Sleight of Hand','Stealth','Survival'];

export const WEAPONS_SIMPLE = ['Club','Dagger','Greatclub','Handaxe','Javelin','Light Hammer','Mace','Quarterstaff','Sickle','Spear','Light Crossbow','Dart','Shortbow','Sling'];
export const WEAPONS_MARTIAL = ['Battleaxe','Flail','Glaive','Greataxe','Greatsword','Halberd','Lance','Longsword','Maul','Morningstar','Pike','Rapier','Scimitar','Shortsword','Trident','War Pick','Warhammer','Whip','Hand Crossbow','Heavy Crossbow','Longbow','Net'];
export const WEAPONS_ALL = ['All Simple Weapons','All Martial Weapons',...WEAPONS_SIMPLE,...WEAPONS_MARTIAL];

export const ARMOR_TYPES = ['Light Armor','Medium Armor','Heavy Armor','Shields'];

export const TOOLS_MUSICAL = ['Bagpipes','Drum','Dulcimer','Flute','Lute','Lyre','Horn','Pan Flute','Shawm','Viol'];
export const TOOLS_ARTISAN = ["Alchemist's Supplies","Brewer's Supplies","Calligrapher's Supplies","Carpenter's Tools","Cartographer's Tools","Cobbler's Tools","Cook's Utensils","Glassblower's Tools","Jeweler's Tools","Leatherworker's Tools","Mason's Tools","Painter's Supplies","Potter's Tools","Smith's Tools","Tinker's Tools","Weaver's Tools","Woodcarver's Tools"];
export const TOOLS_OTHER = ['Disguise Kit','Forgery Kit','Herbalism Kit',"Navigator's Tools","Poisoner's Kit","Thieves' Tools",'Dice Set','Dragonchess Set','Playing Card Set','Three-Dragon Ante Set','Water Vehicles','Land Vehicles'];
export const TOOLS_ALL = [...TOOLS_MUSICAL,...TOOLS_ARTISAN,...TOOLS_OTHER];

export const DAMAGE_TYPES = ['Acid','Bludgeoning','Cold','Fire','Force','Lightning','Necrotic','Piercing','Poison','Psychic','Radiant','Slashing','Thunder','Damage from Traps'];

export const CONDITIONS = ['Blinded','Charmed','Deafened','Exhausted','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious'];

export const ABILITY_SCORES = ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];

export const SAVING_THROWS = ABILITY_SCORES;

export const USE_OPTIONS = ['Once per long rest','Twice per long rest','Once per short/long rest','Set number per short/long rest','Set number per campaign'];

// ── Reusable Pickers ──────────────────────────────────────────────────────────

export function CheckboxList({ options, selected, onChange, columns = 3 }) {
  function toggle(opt) {
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]);
  }
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${columns}, 1fr)`, gap:'0.3rem' }}>
      {options.map(opt => (
        <label key={opt} style={{ display:'flex', alignItems:'center', gap:'0.4rem', cursor:'pointer', fontSize:'0.82rem', color: selected.includes(opt) ? 'var(--gold)' : 'var(--text-secondary)' }}>
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} style={{ width:'auto', accentColor:'var(--gold)' }} />
          {opt}
        </label>
      ))}
    </div>
  );
}

export function TagList({ items, onRemove, color = 'var(--gold)' }) {
  if (!items?.length) return null;
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem', marginTop:'0.4rem' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', background:`${color}18`, border:`1px solid ${color}55`, color, padding:'0.2rem 0.6rem', borderRadius:'12px', fontSize:'0.78rem' }}>
          {item}
          {onRemove && <button onClick={() => onRemove(i)} style={{ background:'none', color:'var(--text-muted)', lineHeight:1, fontSize:'1rem', padding:0 }}>×</button>}
        </span>
      ))}
    </div>
  );
}

export function CustomAddInput({ placeholder, onAdd, buttonLabel = '+ Add' }) {
  const [val, setVal] = useState('');
  return (
    <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem' }}>
      <input value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder}
        onKeyDown={e => { if (e.key === 'Enter' && val.trim()) { onAdd(val.trim()); setVal(''); } }}
        style={{ flex:1 }} />
      <Btn size='sm' variant='ghost' onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); } }}>{buttonLabel}</Btn>
    </div>
  );
}

export function NumberDropdown({ value, onChange, min = -3, max = 3, label }) {
  const options = [];
  for (let i = min; i <= max; i++) options.push(i);
  return (
    <div style={{ textAlign:'center' }}>
      {label && <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'0.25rem' }}>{label}</div>}
      <select value={value || 0} onChange={e => onChange(parseInt(e.target.value))}
        style={{ width:'60px', textAlign:'center', padding:'0.3rem' }}>
        {options.map(n => <option key={n} value={n}>{n > 0 ? `+${n}` : n}</option>)}
      </select>
    </div>
  );
}

// ── Feature/Trait Builder ─────────────────────────────────────────────────────

const FEATURE_TYPES = ['Action','Bonus Action','Reaction','Passive Ability'];
const ACTION_TYPES = ['Attack','Spell','Heal','Boost','Utility','Other'];

function FeatureForm({ feature, onSave, onClose }) {
  const [f, setF] = useState(feature || {
    name:'', description:'', featureType:'Action', actionType:'',
    range:'', save:'', passiveType:'', passiveDetails:'',
    levelGranted:'', timesUsed:'Once per long rest', customUses:'',
  });

  return (
    <div style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1rem', marginBottom:'0.75rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
        <FormField label="Feature Name *">
          <input value={f.name} onChange={e => setF(x => ({...x, name: e.target.value}))} placeholder="e.g. Stone's Endurance" />
        </FormField>
        <FormField label="Feature Type *">
          <select value={f.featureType} onChange={e => setF(x => ({...x, featureType: e.target.value}))}>
            {FEATURE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
      </div>

      {(f.featureType === 'Action' || f.featureType === 'Bonus Action') && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem' }}>
          <FormField label="Type">
            <select value={f.actionType} onChange={e => setF(x => ({...x, actionType: e.target.value}))}>
              <option value=''>— Select —</option>
              {ACTION_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Range (optional)">
            <input value={f.range||''} onChange={e => setF(x => ({...x, range: e.target.value}))} placeholder="e.g. 30 ft." />
          </FormField>
          <FormField label="Save (optional)">
            <select value={f.save||''} onChange={e => setF(x => ({...x, save: e.target.value}))}>
              <option value=''>None</option>
              {ABILITY_SCORES.map(a => <option key={a}>{a}</option>)}
            </select>
          </FormField>
        </div>
      )}

      {f.featureType === 'Passive Ability' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
          <FormField label="Advantage or Disadvantage">
            <select value={f.passiveType||''} onChange={e => setF(x => ({...x, passiveType: e.target.value}))}>
              <option value=''>— Select —</option>
              <option>Advantage</option>
              <option>Disadvantage</option>
            </select>
          </FormField>
          <FormField label="Specifics">
            <input value={f.passiveDetails||''} onChange={e => setF(x => ({...x, passiveDetails: e.target.value}))} placeholder="e.g. on Perception checks" />
          </FormField>
        </div>
      )}

      <FormField label="Description *">
        <textarea value={f.description} onChange={e => setF(x => ({...x, description: e.target.value}))} rows={3} placeholder="Describe what this feature does…" />
      </FormField>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
        <FormField label="Level Granted (optional)">
          <select value={f.levelGranted||''} onChange={e => setF(x => ({...x, levelGranted: e.target.value}))}>
            <option value=''>Any Level</option>
            {Array.from({length:20},(_,i)=>i+1).map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
        </FormField>
        <FormField label="Times Used">
          <select value={f.timesUsed} onChange={e => setF(x => ({...x, timesUsed: e.target.value}))}>
            {USE_OPTIONS.map(u => <option key={u}>{u}</option>)}
          </select>
        </FormField>
      </div>

      {(f.timesUsed === 'Set number per short/long rest' || f.timesUsed === 'Set number per campaign') && (
        <FormField label="Number of Uses">
          <input type="number" value={f.customUses||''} onChange={e => setF(x => ({...x, customUses: e.target.value}))} min={1} style={{ width:'80px' }} />
        </FormField>
      )}

      <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end', marginTop:'0.5rem' }}>
        {onClose && <Btn size='sm' variant='ghost' onClick={onClose}>Cancel</Btn>}
        <Btn size='sm' variant='primary' onClick={() => onSave(f)} disabled={!f.name || !f.description}>Save Feature</Btn>
      </div>
    </div>
  );
}

export function FeatureBuilder({ features, onChange }) {
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  function addFeature(f) {
    onChange([...features, f]);
    setAdding(false);
  }

  function updateFeature(i, f) {
    onChange(features.map((x, j) => j === i ? f : x));
    setEditingIndex(null);
  }

  function removeFeature(i) {
    onChange(features.filter((_, j) => j !== i));
  }

  return (
    <Section title="Features / Traits" action={!adding && <Btn size='sm' variant='ghost' onClick={() => setAdding(true)}>+ Add Feature</Btn>}>
      {features.map((feat, i) => (
        <div key={i}>
          {editingIndex === i ? (
            <FeatureForm feature={feat} onSave={f => updateFeature(i, f)} onClose={() => setEditingIndex(null)} />
          ) : (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.75rem', marginBottom:'0.5rem' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem' }}>
                  <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.88rem', color:'var(--gold)' }}>{feat.name}</strong>
                  <span style={{ fontSize:'0.72rem', background:'rgba(154,111,40,0.12)', color:'var(--gold)', padding:'0.1rem 0.4rem', borderRadius:'8px' }}>{feat.featureType}</span>
                  {feat.levelGranted && <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Lvl {feat.levelGranted}</span>}
                  {feat.timesUsed && <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{feat.timesUsed}</span>}
                </div>
                <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', margin:0 }}>{feat.description.slice(0,120)}{feat.description.length > 120 ? '…' : ''}</p>
              </div>
              <div style={{ display:'flex', gap:'0.35rem', marginLeft:'0.75rem' }}>
                <Btn size='sm' variant='dark' onClick={() => setEditingIndex(i)}>Edit</Btn>
                <Btn size='sm' variant='danger' onClick={() => removeFeature(i)}>×</Btn>
              </div>
            </div>
          )}
        </div>
      ))}
      {adding && <FeatureForm onSave={addFeature} onClose={() => setAdding(false)} />}
      {features.length === 0 && !adding && (
        <div style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center', padding:'1rem', border:'1px dashed var(--border)', borderRadius:'8px' }}>
          No features yet. Add at least one feature or trait.
        </div>
      )}
    </Section>
  );
}

// ── Modifier Builder (for Class/Subclass) ─────────────────────────────────────

const MODIFIER_TYPES = ['Armor Proficiency','Damage Immunity','Damage Resistance','Flying Speed','Flying Speed = Walking Speed','Number of Attacks','Saving Throw Advantage','Skill Proficiency','Spell','Swimming Speed','Tool Proficiency','Weapon Proficiency'];

function ModifierForm({ modifier, onSave, onClose }) {
  const [m, setM] = useState(modifier || { type:'Armor Proficiency', level:1, value:'' });

  const renderValueField = () => {
    switch(m.type) {
      case 'Armor Proficiency':
        return <CheckboxList options={ARMOR_TYPES} selected={Array.isArray(m.value)?m.value:[]} onChange={v => setM(x=>({...x,value:v}))} columns={2} />;
      case 'Damage Immunity':
      case 'Damage Resistance':
        return <CheckboxList options={DAMAGE_TYPES} selected={Array.isArray(m.value)?m.value:[]} onChange={v => setM(x=>({...x,value:v}))} columns={2} />;
      case 'Flying Speed':
      case 'Swimming Speed':
        return (
          <select value={m.value||30} onChange={e => setM(x=>({...x,value:parseInt(e.target.value)}))}>
            {[10,20,30,40,50,60,70,80,90,100,110,120].map(n => <option key={n} value={n}>{n} ft.</option>)}
          </select>
        );
      case 'Number of Attacks':
        return (
          <select value={m.value||2} onChange={e => setM(x=>({...x,value:parseInt(e.target.value)}))}>
            {[2,3,4].map(n => <option key={n} value={n}>{n} attacks</option>)}
          </select>
        );
      case 'Saving Throw Advantage':
        return <CheckboxList options={CONDITIONS} selected={Array.isArray(m.value)?m.value:[]} onChange={v => setM(x=>({...x,value:v}))} columns={2} />;
      case 'Skill Proficiency':
        return <CheckboxList options={SKILLS} selected={Array.isArray(m.value)?m.value:[]} onChange={v => setM(x=>({...x,value:v}))} columns={3} />;
      case 'Tool Proficiency':
        return <CheckboxList options={TOOLS_ALL} selected={Array.isArray(m.value)?m.value:[]} onChange={v => setM(x=>({...x,value:v}))} columns={2} />;
      case 'Weapon Proficiency':
        return <CheckboxList options={WEAPONS_ALL} selected={Array.isArray(m.value)?m.value:[]} onChange={v => setM(x=>({...x,value:v}))} columns={2} />;
      case 'Spell':
        return (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem' }}>
            <FormField label="Spell Level">
              <select value={m.spellLevel||0} onChange={e => setM(x=>({...x,spellLevel:parseInt(e.target.value)}))}>
                <option value={0}>Cantrip</option>
                {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
              </select>
            </FormField>
            <FormField label="Spellcasting Ability">
              <select value={m.spellAbility||'Intelligence'} onChange={e => setM(x=>({...x,spellAbility:e.target.value}))}>
                {ABILITY_SCORES.map(a => <option key={a}>{a}</option>)}
              </select>
            </FormField>
            <FormField label="Spell Name">
              <input value={m.spellName||''} onChange={e => setM(x=>({...x,spellName:e.target.value}))} placeholder="Spell name" />
            </FormField>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1rem', marginBottom:'0.5rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
        <FormField label="Modifier Type">
          <select value={m.type} onChange={e => setM(x=>({...x,type:e.target.value,value:''}))}>
            {MODIFIER_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        {m.type !== 'Flying Speed = Walking Speed' && (
          <FormField label="Unlock at Level">
            <select value={m.level||1} onChange={e => setM(x=>({...x,level:parseInt(e.target.value)}))}>
              {Array.from({length:20},(_,i)=>i+1).map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </FormField>
        )}
      </div>
      {renderValueField()}
      <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end', marginTop:'0.75rem' }}>
        {onClose && <Btn size='sm' variant='ghost' onClick={onClose}>Cancel</Btn>}
        <Btn size='sm' variant='primary' onClick={() => onSave(m)}>Save Modifier</Btn>
      </div>
    </div>
  );
}

export function ModifierBuilder({ modifiers, onChange }) {
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  return (
    <Section title="Modifiers" action={!adding && <Btn size='sm' variant='ghost' onClick={() => setAdding(true)}>+ Add Modifier</Btn>}>
      {modifiers.map((mod, i) => (
        editingIndex === i ? (
          <ModifierForm key={i} modifier={mod} onSave={m => { onChange(modifiers.map((x,j)=>j===i?m:x)); setEditingIndex(null); }} onClose={() => setEditingIndex(null)} />
        ) : (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.6rem 0.85rem', marginBottom:'0.4rem' }}>
            <div>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:'0.85rem', color:'var(--gold)' }}>{mod.type}</span>
              {mod.level && <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginLeft:'0.5rem' }}>@ Level {mod.level}</span>}
              {mod.spellName && <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginLeft:'0.5rem' }}>— {mod.spellName}</span>}
            </div>
            <div style={{ display:'flex', gap:'0.35rem' }}>
              <Btn size='sm' variant='dark' onClick={() => setEditingIndex(i)}>Edit</Btn>
              <Btn size='sm' variant='danger' onClick={() => onChange(modifiers.filter((_,j)=>j!==i))}>×</Btn>
            </div>
          </div>
        )
      ))}
      {adding && <ModifierForm onSave={m => { onChange([...modifiers, m]); setAdding(false); }} onClose={() => setAdding(false)} />}
    </Section>
  );
}