import React, { useState } from 'react';
import { Card, Btn, Modal, FormField, Grid, Badge, SearchInput, EmptyState, Section, Tabs } from './UI';
import { DAMAGE_TYPES, SPELL_SCHOOLS, ITEM_TYPES, WEAPON_PROPERTIES, RARITY, SRD_CLASSES } from '../data/srd';
import { ABILITY_SCORES } from '../utils/dnd';

const CATEGORIES = [
  { id:'races', label:'Races', icon:'🧬' },
  { id:'classes', label:'Classes', icon:'⚔️' },
  { id:'backgrounds', label:'Backgrounds', icon:'📖' },
  { id:'spells', label:'Spells', icon:'✨' },
  { id:'items', label:'Items', icon:'⚗️' },
  { id:'monsters', label:'Monsters', icon:'👹' },
  { id:'feats', label:'Feats', icon:'🌟' },
];

// ── Race Builder ──────────────────────────────────────────────────────────────
function RaceForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', description:'', size:'Medium', speed:30,
    abilityBonuses:{}, traits:[], languages:['Common'],
    darkvision:false, darkvisionRange:60, flavorText:'',
    subraces:[],
  });

  function setBonus(ab, v) { setF(x => ({...x, abilityBonuses:{...x.abilityBonuses,[ab]:parseInt(v)||0}})); }
  function addTrait() { const t=prompt('Trait name:'); if(t) setF(x=>({...x,traits:[...x.traits,t]})); }
  function addSubrace() { setF(x=>({...x,subraces:[...x.subraces,{id:`sr_${Date.now()}`,name:'New Subrace',abilityBonuses:{},traits:[]}]})); }

  return (
    <div>
      <Grid cols={2}>
        <FormField label="Race Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} placeholder="e.g. Starborn" /></FormField>
        <FormField label="Size">
          <select value={f.size} onChange={e=>setF(x=>({...x,size:e.target.value}))}>
            {['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
      </Grid>
      <FormField label="Description"><textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={3} placeholder="Lore and background…" /></FormField>
      <FormField label="Speed (ft)"><input type="number" value={f.speed} onChange={e=>setF(x=>({...x,speed:parseInt(e.target.value)||30}))} style={{width:'100px'}} /></FormField>

      <Section title="Ability Score Bonuses">
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
          {ABILITY_SCORES.map(ab=>(
            <div key={ab} style={{textAlign:'center'}}>
              <div style={{fontSize:'0.7rem',color:'var(--text-muted)',marginBottom:'0.25rem'}}>{ab.slice(0,3)}</div>
              <input type="number" value={f.abilityBonuses[ab]||0} onChange={e=>setBonus(ab,e.target.value)} style={{width:'55px',textAlign:'center'}} min={0} max={6} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Racial Traits" action={<Btn size='sm' variant='ghost' onClick={addTrait}>+ Add</Btn>}>
        <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
          {f.traits.map((t,i)=>(
            <span key={i} style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',background:'rgba(201,168,76,0.1)',border:'1px solid var(--gold-dark)',color:'var(--gold)',padding:'0.2rem 0.6rem',borderRadius:'12px',fontSize:'0.8rem'}}>
              {t}<button onClick={()=>setF(x=>({...x,traits:x.traits.filter((_,j)=>j!==i)}))} style={{background:'none',color:'var(--text-muted)',lineHeight:1}}>×</button>
            </span>
          ))}
        </div>
      </Section>

      <Grid cols={2}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem'}}>
          <input type="checkbox" id="darkvision" checked={f.darkvision} onChange={e=>setF(x=>({...x,darkvision:e.target.checked}))} style={{width:'auto'}}/>
          <label htmlFor="darkvision" style={{color:'var(--text-secondary)',fontFamily:"'Cinzel',serif",fontSize:'0.85rem',cursor:'pointer'}}>Darkvision</label>
          {f.darkvision && <input type="number" value={f.darkvisionRange} onChange={e=>setF(x=>({...x,darkvisionRange:parseInt(e.target.value)||60}))} style={{width:'70px'}} />}
        </div>
      </Grid>

      <Section title="Languages">
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'0.5rem'}}>
          {f.languages.map((l,i)=>(
            <span key={i} style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',background:'rgba(41,128,185,0.15)',color:'var(--sapphire)',padding:'0.2rem 0.6rem',borderRadius:'12px',fontSize:'0.8rem'}}>
              {l}<button onClick={()=>setF(x=>({...x,languages:x.languages.filter((_,j)=>j!==i)}))} style={{background:'none',color:'var(--text-muted)',lineHeight:1}}>×</button>
            </span>
          ))}
        </div>
        <Btn size='sm' variant='ghost' onClick={()=>{const l=prompt('Language:');if(l)setF(x=>({...x,languages:[...x.languages,l]}));}}>+ Add Language</Btn>
      </Section>

      <Section title="Subraces" action={<Btn size='sm' variant='ghost' onClick={addSubrace}>+ Add Subrace</Btn>}>
        {f.subraces.map((sr,i)=>(
          <div key={sr.id} style={{background:'var(--bg-raised)',borderRadius:'var(--radius-sm)',padding:'0.75rem',marginBottom:'0.5rem'}}>
            <Grid cols={2}>
              <input value={sr.name} onChange={e=>setF(x=>({...x,subraces:x.subraces.map((s,j)=>j===i?{...s,name:e.target.value}:s)}))} placeholder="Subrace name" />
              <Btn size='sm' variant='danger' onClick={()=>setF(x=>({...x,subraces:x.subraces.filter((_,j)=>j!==i)}))}>Remove</Btn>
            </Grid>
          </div>
        ))}
      </Section>

      <FormField label="Flavor Text / Quote">
        <textarea value={f.flavorText||''} onChange={e=>setF(x=>({...x,flavorText:e.target.value}))} rows={2} placeholder='"A quote from lore…"' />
      </FormField>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Race</Btn>
      </div>
    </div>
  );
}

// ── Spell Builder ─────────────────────────────────────────────────────────────
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
      <Grid cols={2}>
        <FormField label="Spell Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
        <FormField label="Level">
          <select value={f.level} onChange={e=>setF(x=>({...x,level:parseInt(e.target.value)}))}>
            <option value={0}>Cantrip</option>
            {[1,2,3,4,5,6,7,8,9].map(l=><option key={l} value={l}>Level {l}</option>)}
          </select>
        </FormField>
      </Grid>
      <Grid cols={2}>
        <FormField label="School">
          <select value={f.school} onChange={e=>setF(x=>({...x,school:e.target.value}))}>
            {SPELL_SCHOOLS.map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Casting Time"><input value={f.castingTime} onChange={e=>setF(x=>({...x,castingTime:e.target.value}))} /></FormField>
      </Grid>
      <Grid cols={2}>
        <FormField label="Range"><input value={f.range} onChange={e=>setF(x=>({...x,range:e.target.value}))} /></FormField>
        <FormField label="Duration"><input value={f.duration} onChange={e=>setF(x=>({...x,duration:e.target.value}))} /></FormField>
      </Grid>
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
        {f.components.includes('M') && <input style={{marginTop:'0.5rem'}} value={f.materialComponent||''} onChange={e=>setF(x=>({...x,materialComponent:e.target.value}))} placeholder="Material component (e.g. a pinch of sand)" />}
      </Section>
      <Grid cols={2}>
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
      </Grid>
      <FormField label="Description">
        <textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={5} placeholder="Full spell description…" />
      </FormField>
      <FormField label="At Higher Levels">
        <textarea value={f.atHigherLevels||''} onChange={e=>setF(x=>({...x,atHigherLevels:e.target.value}))} rows={2} placeholder="When cast using a higher-level slot…" />
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

// ── Item Builder ──────────────────────────────────────────────────────────────
function ItemForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', type:'Wondrous Item', rarity:'Common', attunement:false,
    description:'', properties:[], damage:'', damageType:'',
    acBonus:0, weight:0, cost:'', flavorText:'',
    requiresAttunement:'', chargesMax:0, chargesReset:'',
  });

  return (
    <div>
      <Grid cols={2}>
        <FormField label="Item Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
        <FormField label="Type">
          <select value={f.type} onChange={e=>setF(x=>({...x,type:e.target.value}))}>
            {ITEM_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </FormField>
      </Grid>
      <Grid cols={2}>
        <FormField label="Rarity">
          <select value={f.rarity} onChange={e=>setF(x=>({...x,rarity:e.target.value}))}>
            {RARITY.map(r=><option key={r}>{r}</option>)}
          </select>
        </FormField>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',paddingTop:'1.5rem'}}>
          <input type="checkbox" id="attunement" checked={f.attunement} onChange={e=>setF(x=>({...x,attunement:e.target.checked}))} style={{width:'auto'}}/>
          <label htmlFor="attunement" style={{color:'var(--text-secondary)',fontFamily:"'Cinzel',serif",fontSize:'0.85rem',cursor:'pointer'}}>Requires Attunement</label>
        </div>
      </Grid>
      {f.attunement && (
        <FormField label="Attunement Requirements">
          <input value={f.requiresAttunement||''} onChange={e=>setF(x=>({...x,requiresAttunement:e.target.value}))} placeholder="e.g. by a spellcaster" />
        </FormField>
      )}
      {(f.type==='Weapon') && (
        <Grid cols={2}>
          <FormField label="Damage Dice"><input value={f.damage||''} onChange={e=>setF(x=>({...x,damage:e.target.value}))} placeholder="e.g. 1d8" /></FormField>
          <FormField label="Damage Type">
            <select value={f.damageType||''} onChange={e=>setF(x=>({...x,damageType:e.target.value}))}>
              <option value=''>—</option>
              {DAMAGE_TYPES.map(d=><option key={d}>{d}</option>)}
            </select>
          </FormField>
        </Grid>
      )}
      <Grid cols={3}>
        <FormField label="Weight (lbs)"><input type="number" value={f.weight||0} onChange={e=>setF(x=>({...x,weight:parseFloat(e.target.value)||0}))} /></FormField>
        <FormField label="Cost"><input value={f.cost||''} onChange={e=>setF(x=>({...x,cost:e.target.value}))} placeholder="50 gp" /></FormField>
        <FormField label="Charges">
          <input type="number" value={f.chargesMax||0} onChange={e=>setF(x=>({...x,chargesMax:parseInt(e.target.value)||0}))} />
        </FormField>
      </Grid>
      <FormField label="Description">
        <textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={5} placeholder="What does this item do? Be specific about mechanics." />
      </FormField>
      <FormField label="Flavor Text">
        <textarea value={f.flavorText||''} onChange={e=>setF(x=>({...x,flavorText:e.target.value}))} rows={2} placeholder='"An inscription in Dwarvish reads…"' />
      </FormField>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Item</Btn>
      </div>
    </div>
  );
}

// ── Monster Builder ───────────────────────────────────────────────────────────
function MonsterForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', type:'Humanoid', alignment:'Unaligned', size:'Medium',
    ac:13, hp:'3d8+3', speed:'30 ft.', cr:'1',
    abilities:{Strength:10,Dexterity:10,Constitution:10,Intelligence:10,Wisdom:10,Charisma:10},
    skills:'', senses:'Darkvision 60 ft.', languages:'Common',
    immunities:'', resistances:'', vulnerabilities:'',
    traits:'', actions:'', legendaryActions:'', reactions:'',
    description:'',
  });

  function setAb(ab,v) { setF(x=>({...x,abilities:{...x.abilities,[ab]:parseInt(v)||10}})); }

  return (
    <div>
      <Grid cols={2}>
        <FormField label="Monster Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
        <FormField label="Type">
          <input value={f.type} onChange={e=>setF(x=>({...x,type:e.target.value}))} placeholder="Humanoid, Beast, Undead…" />
        </FormField>
      </Grid>
      <Grid cols={3}>
        <FormField label="Size">
          <select value={f.size} onChange={e=>setF(x=>({...x,size:e.target.value}))}>
            {['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="CR"><input value={f.cr} onChange={e=>setF(x=>({...x,cr:e.target.value}))} placeholder="1/4, 1, 5…" /></FormField>
        <FormField label="Alignment"><input value={f.alignment} onChange={e=>setF(x=>({...x,alignment:e.target.value}))} /></FormField>
      </Grid>
      <Grid cols={3}>
        <FormField label="AC"><input type="number" value={f.ac} onChange={e=>setF(x=>({...x,ac:parseInt(e.target.value)||10}))} /></FormField>
        <FormField label="HP"><input value={f.hp} onChange={e=>setF(x=>({...x,hp:e.target.value}))} placeholder="3d8+3" /></FormField>
        <FormField label="Speed"><input value={f.speed} onChange={e=>setF(x=>({...x,speed:e.target.value}))} /></FormField>
      </Grid>
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
      <Grid cols={2}>
        <FormField label="Senses"><input value={f.senses} onChange={e=>setF(x=>({...x,senses:e.target.value}))} /></FormField>
        <FormField label="Languages"><input value={f.languages} onChange={e=>setF(x=>({...x,languages:e.target.value}))} /></FormField>
      </Grid>
      <Grid cols={3}>
        <FormField label="Immunities"><input value={f.immunities||''} onChange={e=>setF(x=>({...x,immunities:e.target.value}))} placeholder="fire, poison…" /></FormField>
        <FormField label="Resistances"><input value={f.resistances||''} onChange={e=>setF(x=>({...x,resistances:e.target.value}))} /></FormField>
        <FormField label="Vulnerabilities"><input value={f.vulnerabilities||''} onChange={e=>setF(x=>({...x,vulnerabilities:e.target.value}))} /></FormField>
      </Grid>
      <FormField label="Traits">
        <textarea value={f.traits||''} onChange={e=>setF(x=>({...x,traits:e.target.value}))} rows={3} placeholder="Multiattack. Pack Tactics. Magic Resistance…" />
      </FormField>
      <FormField label="Actions">
        <textarea value={f.actions||''} onChange={e=>setF(x=>({...x,actions:e.target.value}))} rows={4} placeholder="Longsword. +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage…" />
      </FormField>
      <FormField label="Legendary Actions">
        <textarea value={f.legendaryActions||''} onChange={e=>setF(x=>({...x,legendaryActions:e.target.value}))} rows={3} placeholder="Optional: legendary actions…" />
      </FormField>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Monster</Btn>
      </div>
    </div>
  );
}

// ── Background Builder ────────────────────────────────────────────────────────
function BackgroundForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || { name:'', description:'', skills:[], tools:[], languages:0, equipment:'', feature:'', featureDesc:'' });
  function toggleSkill(s) { setF(x=>({...x,skills:x.skills.includes(s)?x.skills.filter(k=>k!==s):[...x.skills,s]})); }
  const allSkills = ['Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight','Intimidation','Investigation','Medicine','Nature','Perception','Performance','Persuasion','Religion','Sleight of Hand','Stealth','Survival'];
  return (
    <div>
      <FormField label="Background Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
      <FormField label="Description"><textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={3} /></FormField>
      <Section title="Skill Proficiencies">
        <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
          {allSkills.map(s=>(
            <button key={s} onClick={()=>toggleSkill(s)}
              style={{padding:'0.2rem 0.6rem',borderRadius:'12px',border:'1px solid var(--border)',
                background:f.skills.includes(s)?'rgba(39,174,96,0.2)':'transparent',
                color:f.skills.includes(s)?'var(--emerald)':'var(--text-muted)',
                fontSize:'0.75rem',cursor:'pointer'}}>
              {s}
            </button>
          ))}
        </div>
      </Section>
      <Grid cols={2}>
        <FormField label="Tool Proficiencies"><input value={f.tools.join(', ')} onChange={e=>setF(x=>({...x,tools:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)}))} placeholder="Thieves' tools, Gaming set…" /></FormField>
        <FormField label="Bonus Languages"><input type="number" value={f.languages} onChange={e=>setF(x=>({...x,languages:parseInt(e.target.value)||0}))} /></FormField>
      </Grid>
      <FormField label="Starting Equipment"><textarea value={f.equipment} onChange={e=>setF(x=>({...x,equipment:e.target.value}))} rows={2} /></FormField>
      <FormField label="Feature Name"><input value={f.feature} onChange={e=>setF(x=>({...x,feature:e.target.value}))} placeholder="e.g. Criminal Contact" /></FormField>
      <FormField label="Feature Description"><textarea value={f.featureDesc||''} onChange={e=>setF(x=>({...x,featureDesc:e.target.value}))} rows={3} /></FormField>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Background</Btn>
      </div>
    </div>
  );
}

// ── Feat Builder ──────────────────────────────────────────────────────────────
function FeatForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || { name:'', prerequisite:'', description:'', abilityBonuses:{}, benefits:[] });
  function addBenefit() { const b=prompt('Benefit:'); if(b) setF(x=>({...x,benefits:[...x.benefits,b]})); }
  return (
    <div>
      <FormField label="Feat Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} /></FormField>
      <FormField label="Prerequisite"><input value={f.prerequisite||''} onChange={e=>setF(x=>({...x,prerequisite:e.target.value}))} placeholder="None, or e.g. Strength 13+" /></FormField>
      <FormField label="Description"><textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={4} /></FormField>
      <Section title="Benefits" action={<Btn size='sm' variant='ghost' onClick={addBenefit}>+ Add</Btn>}>
        {f.benefits.map((b,i)=>(
          <div key={i} style={{display:'flex',gap:'0.5rem',marginBottom:'0.3rem'}}>
            <span style={{flex:1,fontSize:'0.85rem',color:'var(--text-secondary)'}}>• {b}</span>
            <Btn size='sm' variant='danger' onClick={()=>setF(x=>({...x,benefits:x.benefits.filter((_,j)=>j!==i)}))}>×</Btn>
          </div>
        ))}
      </Section>
      <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Feat</Btn>
      </div>
    </div>
  );
}

const FORM_MAP = { races:RaceForm, spells:SpellForm, items:ItemForm, monsters:MonsterForm, backgrounds:BackgroundForm, feats:FeatForm };
const MODAL_TITLES = { races:'Homebrew Race', spells:'Homebrew Spell', items:'Homebrew Item', monsters:'Homebrew Monster', backgrounds:'Homebrew Background', feats:'Homebrew Feat', classes:'Homebrew Class' };

// ── Catalog Card ──────────────────────────────────────────────────────────────
function HomebrewCard({ item, category, onEdit, onDelete }) {
  const [expand, setExpand] = useState(false);
  const rarityColors = { Common:'var(--text-secondary)', Uncommon:'var(--emerald)', Rare:'var(--sapphire)', 'Very Rare':'var(--violet)', Legendary:'var(--gold)', Artifact:'#ff8c00' };

  return (
    <Card style={{ padding:'0.85rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1, cursor:'pointer' }} onClick={() => setExpand(e=>!e)}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem' }}>
            <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.95rem' }}>{item.name}</strong>
            <Badge color='violet'>HB</Badge>
            {item.campaign_id && <Badge color='emerald'>Shared</Badge>}
            {item.level !== undefined && <Badge color='sapphire'>{item.level===0?'Cantrip':`Lvl ${item.level}`}</Badge>}
            {item.rarity && <span style={{ fontSize:'0.75rem', color:rarityColors[item.rarity]||'var(--text-muted)' }}>{item.rarity}</span>}
            {item.cr && <Badge color='crimson'>CR {item.cr}</Badge>}
          </div>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.4 }}>
            {item.description?.slice(0,100)}{item.description?.length>100?'…':''}
          </div>
          {expand && (
            <div style={{ marginTop:'0.75rem', fontSize:'0.85rem', color:'var(--text-secondary)', lineHeight:1.6 }}>
              {item.description}
              {item.atHigherLevels && <p style={{ marginTop:'0.5rem', fontStyle:'italic' }}><strong>At Higher Levels:</strong> {item.atHigherLevels}</p>}
              {item.actions && <div style={{ marginTop:'0.5rem' }}><strong style={{ color:'var(--gold)' }}>Actions:</strong><br/>{item.actions}</div>}
              {item.traits && <div style={{ marginTop:'0.5rem' }}><strong style={{ color:'var(--gold)' }}>Traits:</strong><br/>{item.traits}</div>}
              {item.flavorText && <div style={{ marginTop:'0.75rem', fontStyle:'italic', color:'var(--text-muted)', borderLeft:'2px solid var(--border)', paddingLeft:'0.75rem' }}>{item.flavorText}</div>}
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

export default function HomebrewForge({ homebrew, onSave, onDelete, campaigns, user }) {  
  const [category, setCategory] = useState('races');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [search, setSearch] = useState('');

  const items = homebrew[category] || [];
  const filtered = items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));
  const FormComp = FORM_MAP[category];

  function openNew() { setEditing(null); setModal(category); }
  function openEdit(item) { setEditing(item); setModal(category); }
  function handleSave(data) { onSave(category, editing ? {...data, id:editing.id} : data, selectedCampaign || null); setModal(null); setEditing(null); setSelectedCampaign(''); }
  const totalItems = Object.values(homebrew).reduce((s,a)=>s+(a?.length||0),0);

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ color:'var(--gold)', marginBottom:'0.25rem' }}>🔨 The Homebrew Forge</h2>
          <div style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{totalItems} homebrew creation{totalItems!==1?'s':''} in your catalog</div>
        </div>
      </div>

      {/* Category Sidebar + Content */}
      <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:'1.5rem' }}>
        {/* Sidebar */}
        <div>
          {CATEGORIES.map(cat => {
            const count = (homebrew[cat.id]||[]).length;
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
            {FormComp && <Btn variant='primary' onClick={openNew}>+ New {CATEGORIES.find(c=>c.id===category)?.label.slice(0,-1)}</Btn>}
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={CATEGORIES.find(c=>c.id===category)?.icon||'📜'} title={`No homebrew ${category} yet`}
              desc={`Create your first homebrew ${category.slice(0,-1)} to add it to your catalog.`}
              action={FormComp && <Btn variant='primary' onClick={openNew}>Create Now</Btn>} />
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
        title={`${editing?'Edit':'Create'} ${MODAL_TITLES[modal]||''}`} width='700px'>
        {campaigns?.length > 0 && (
          <div style={{ marginBottom:'1rem', padding:'0 0 1rem', borderBottom:'1px solid var(--border)' }}>
            <label style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", letterSpacing:'0.05em', textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>
              Share with Campaign (optional)
            </label>
            <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}
              style={{ width:'100%' }}>
              <option value=''>Personal only</option>
              {campaigns.filter(c => c.owner_id === user?.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        {modal && FormComp && (
          <FormComp item={editing} onSave={handleSave} onClose={() => { setModal(null); setEditing(null); }} />
        )}
        {modal && !FormComp && modal==='classes' && (
          <div style={{ color:'var(--text-muted)', textAlign:'center', padding:'2rem' }}>
            <p>Full class builder coming soon! For now, use the simplified version.</p>
            <div style={{ marginTop:'1rem' }}>
              <FormField label="Class Name"><input id="hb-class-name" placeholder="Class name" /></FormField>
              <FormField label="Description"><textarea id="hb-class-desc" rows={3} placeholder="Class description…" /></FormField>
              <FormField label="Hit Die"><select id="hb-class-hd"><option>6</option><option>8</option><option>10</option><option>12</option></select></FormField>
              <Btn variant='primary' onClick={() => {
                const n=document.getElementById('hb-class-name')?.value;
                if(n) { handleSave({name:n,description:document.getElementById('hb-class-desc')?.value||'',hitDie:parseInt(document.getElementById('hb-class-hd')?.value||'8')}); }
              }}>Save Class</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
