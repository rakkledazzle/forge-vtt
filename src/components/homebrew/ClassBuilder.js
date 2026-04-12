import React, { useState } from 'react';
import { Btn, FormField, Grid, Section, Card } from '../UI';
import {
  SKILLS, ABILITY_SCORES, CheckboxList, FeatureBuilder, ModifierBuilder
} from './SharedComponents';

const HIT_DICE = [6, 8, 10, 12];

const SRD_SPELL_LISTS = ['Custom','Bard','Cleric','Druid','Paladin','Ranger','Sorcerer','Warlock','Wizard'];

const CANTRIPS = ['Acid Splash','Blade Ward','Chill Touch','Dancing Lights','Druidcraft','Eldritch Blast','Fire Bolt','Friends','Guidance','Light','Mage Hand','Mending','Message','Minor Illusion','Poison Spray','Prestidigitation','Produce Flame','Ray of Frost','Resistance','Sacred Flame','Shillelagh','Shocking Grasp','Spare the Dying','Thaumaturgy','True Strike','Vicious Mockery'];

const SPELLS_BY_LEVEL = {
  1: ['Alarm','Animal Friendship','Bane','Bless','Burning Hands','Charm Person','Color Spray','Command','Comprehend Languages','Create or Destroy Water','Cure Wounds','Detect Evil and Good','Detect Magic','Detect Poison and Disease','Disguise Self','Divine Favor','Entangle','Expeditious Retreat','Faerie Fire','False Life','Feather Fall','Find Familiar','Fog Cloud','Goodberry','Grease','Guiding Bolt','Healing Word','Hellish Rebuke','Heroism','Hideous Laughter',"Hunter's Mark",'Identify','Inflict Wounds','Jump','Longstrider','Mage Armor','Magic Missile','Protection from Evil and Good','Ray of Sickness','Sanctuary','Shield','Shield of Faith','Silent Image','Sleep','Speak with Animals','Thunderwave','Unseen Servant'],
  2: ['Acid Arrow','Aid','Alter Self','Animal Messenger','Arcane Lock','Augury','Barkskin','Blindness/Deafness','Blur','Branding Smite','Calm Emotions','Continual Flame','Darkness','Darkvision','Detect Thoughts','Enhance Ability','Enlarge/Reduce','Enthrall','Find Steed','Find Traps','Flame Blade','Flaming Sphere','Gentle Repose','Gust of Wind','Heat Metal','Hold Person','Invisibility','Knock','Lesser Restoration','Levitate','Locate Object','Magic Mouth','Magic Weapon','Mirror Image','Misty Step','Moonbeam','Pass without Trace','Prayer of Healing','Protection from Poison','Ray of Enfeeblement','Rope Trick','Scorching Ray','See Invisibility','Shatter','Silence','Spider Climb','Spike Growth','Spiritual Weapon','Suggestion','Web','Zone of Truth'],
  3: ['Animate Dead','Beacon of Hope','Bestow Curse','Blink','Call Lightning','Clairvoyance','Conjure Animals','Counterspell','Create Food and Water','Daylight','Dispel Magic','Fear','Fireball','Fly','Gaseous Form','Glyph of Warding','Haste','Hypnotic Pattern','Lightning Bolt','Magic Circle','Major Image','Mass Healing Word','Nondetection','Phantom Steed','Plant Growth','Protection from Energy','Remove Curse','Revivify','Sending','Sleet Storm','Slow','Speak with Dead','Spirit Guardians','Stinking Cloud','Tiny Hut','Tongues','Vampiric Touch','Water Breathing','Water Walk','Wind Wall'],
  4: ['Arcane Eye','Banishment','Black Tentacles','Blight','Compulsion','Confusion','Conjure Minor Elementals','Control Water','Death Ward','Dimension Door','Divination','Dominate Beast','Fabricate','Fire Shield','Freedom of Movement','Giant Insect','Greater Invisibility','Guardian of Faith','Hallucinatory Terrain','Ice Storm','Locate Creature','Phantasmal Killer','Polymorph','Resilient Sphere','Stone Shape','Stoneskin','Wall of Fire'],
};

function SpellSelector({ label, spells, selected, onChange }) {
  const [search, setSearch] = useState('');
  const filtered = spells.filter(s => s.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ marginBottom:'1rem' }}>
      <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>{label}</div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search spells…" style={{ marginBottom:'0.4rem', fontSize:'0.82rem' }} />
      <div style={{ maxHeight:'160px', overflowY:'auto', border:'1px solid var(--border)', borderRadius:'6px', padding:'0.5rem', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.2rem' }}>
        {filtered.map(spell => (
          <label key={spell} style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.78rem', cursor:'pointer', color: selected.includes(spell)?'var(--gold)':'var(--text-secondary)' }}>
            <input type="checkbox" checked={selected.includes(spell)} onChange={()=>onChange(selected.includes(spell)?selected.filter(s=>s!==spell):[...selected,spell])} style={{width:'auto',accentColor:'var(--gold)'}} />
            {spell}
          </label>
        ))}
      </div>
      <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'0.3rem' }}>{selected.length} selected</div>
    </div>
  );
}

function ClassSelectionBuilder({ selections, onChange }) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name:'', description:'' });
  const [editingIndex, setEditingIndex] = useState(null);

  return (
    <Section title="Class Selections" action={!adding && <Btn size='sm' variant='ghost' onClick={()=>setAdding(true)}>+ Add</Btn>}>
      <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
        Custom options players can choose from (e.g. Battle Maneuvers, Arcane Traditions).
      </p>
      {selections.map((sel, i) => (
        editingIndex === i ? (
          <div key={i} style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1rem', marginBottom:'0.5rem' }}>
            <FormField label="Name *"><input value={sel.name} onChange={e=>onChange(selections.map((x,j)=>j===i?{...x,name:e.target.value}:x))} /></FormField>
            <FormField label="Description *"><textarea value={sel.description} onChange={e=>onChange(selections.map((x,j)=>j===i?{...x,description:e.target.value}:x))} rows={3} /></FormField>
            <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
              <Btn size='sm' variant='ghost' onClick={()=>setEditingIndex(null)}>Done</Btn>
            </div>
          </div>
        ) : (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.6rem 0.85rem', marginBottom:'0.4rem' }}>
            <div>
              <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.85rem', color:'var(--gold)' }}>{sel.name}</strong>
              <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', margin:'0.1rem 0 0' }}>{sel.description?.slice(0,80)}{sel.description?.length>80?'…':''}</p>
            </div>
            <div style={{ display:'flex', gap:'0.35rem' }}>
              <Btn size='sm' variant='dark' onClick={()=>setEditingIndex(i)}>Edit</Btn>
              <Btn size='sm' variant='danger' onClick={()=>onChange(selections.filter((_,j)=>j!==i))}>×</Btn>
            </div>
          </div>
        )
      ))}
      {adding && (
        <div style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1rem', marginBottom:'0.5rem' }}>
          <FormField label="Name *"><input value={newItem.name} onChange={e=>setNewItem(x=>({...x,name:e.target.value}))} placeholder="e.g. Battle Maneuver" /></FormField>
          <FormField label="Description *"><textarea value={newItem.description} onChange={e=>setNewItem(x=>({...x,description:e.target.value}))} rows={3} placeholder="Describe this option…" /></FormField>
          <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
            <Btn size='sm' variant='ghost' onClick={()=>{ setAdding(false); setNewItem({name:'',description:''}); }}>Cancel</Btn>
            <Btn size='sm' variant='primary' onClick={()=>{ if(newItem.name&&newItem.description){ onChange([...selections,newItem]); setNewItem({name:'',description:''}); setAdding(false); } }} disabled={!newItem.name||!newItem.description}>Add</Btn>
          </div>
        </div>
      )}
    </Section>
  );
}

export default function ClassBuilder({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', description:'', hitDie:8, subclassLevel:3,
    savingThrows:[],
    abilityIncreaseLevels:[4,8,12,16,19],
    hasSpellcasting:false,
    spellList:'Custom', spellcastingAbility:'Intelligence',
    firstSpellLevel:1, hasCantrips:false,
    cantripsAtLevel1:2, cantripGainLevels:[],
    customCantrips:[], customSpells:{ 1:[], 2:[], 3:[], 4:[] },
    skillChoiceCount:2, skillChoiceOptions:[...SKILLS],
    expertiseChoiceCount:0, expertiseChoiceOptions:[],
    modifiers:[], classSelections:[], features:[],
  });

  function set(key, val) { setF(x => ({...x, [key]:val})); }

  function toggleLevel(level, key) {
    const arr = f[key] || [];
    set(key, arr.includes(level) ? arr.filter(l=>l!==level) : [...arr,level].sort((a,b)=>a-b));
  }

  return (
    <div>
      {/* Basic Info */}
      <Grid cols={2}>
        <FormField label="Class Name *">
          <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Warden" />
        </FormField>
        <FormField label="Hit Die *">
          <select value={f.hitDie} onChange={e=>set('hitDie',parseInt(e.target.value))}>
            {HIT_DICE.map(d=><option key={d} value={d}>d{d}</option>)}
          </select>
        </FormField>
      </Grid>

      <FormField label="Description *">
        <textarea value={f.description} onChange={e=>set('description',e.target.value)} rows={3} placeholder="What is this class about?" />
      </FormField>

      <Grid cols={2}>
        <FormField label="Pick Subclass at Level *">
          <select value={f.subclassLevel} onChange={e=>set('subclassLevel',parseInt(e.target.value))}>
            {[1,2,3,4,5].map(l=><option key={l} value={l}>Level {l}</option>)}
          </select>
        </FormField>
      </Grid>

      {/* Saving Throws */}
      <Section title="Saving Throw Proficiencies *">
        <CheckboxList options={ABILITY_SCORES} selected={f.savingThrows} onChange={v=>set('savingThrows',v)} columns={3} />
      </Section>

      {/* Ability Increase Levels */}
      <Section title="Ability Score Increase Levels">
        <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.5rem' }}>Select which levels grant an Ability Score Improvement.</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
          {Array.from({length:17},(_,i)=>i+4).map(level => (
            <label key={level} style={{ display:'flex', alignItems:'center', gap:'0.3rem', cursor:'pointer', padding:'0.25rem 0.5rem', borderRadius:'6px', border:`1px solid ${f.abilityIncreaseLevels?.includes(level)?'var(--gold)':'var(--border)'}`, background: f.abilityIncreaseLevels?.includes(level)?'rgba(154,111,40,0.1)':'transparent', fontSize:'0.78rem', color: f.abilityIncreaseLevels?.includes(level)?'var(--gold)':'var(--text-muted)' }}>
              <input type="checkbox" checked={f.abilityIncreaseLevels?.includes(level)||false} onChange={()=>toggleLevel(level,'abilityIncreaseLevels')} style={{width:'auto',accentColor:'var(--gold)'}} />
              {level}
            </label>
          ))}
        </div>
      </Section>

      {/* Spellcasting */}
      <Section title="Spellcasting">
        <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontFamily:"'Cinzel',serif", fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'0.75rem' }}>
          <input type="checkbox" checked={f.hasSpellcasting} onChange={e=>set('hasSpellcasting',e.target.checked)} style={{width:'auto',accentColor:'var(--gold)'}} />
          This class has spellcasting
        </label>

        {f.hasSpellcasting && (
          <div>
            <Grid cols={3}>
              <FormField label="Spell List">
                <select value={f.spellList} onChange={e=>set('spellList',e.target.value)}>
                  {SRD_SPELL_LISTS.map(l=><option key={l}>{l}</option>)}
                </select>
              </FormField>
              <FormField label="Spellcasting Ability">
                <select value={f.spellcastingAbility} onChange={e=>set('spellcastingAbility',e.target.value)}>
                  {ABILITY_SCORES.map(a=><option key={a}>{a}</option>)}
                </select>
              </FormField>
              <FormField label="First Spell at Level">
                <select value={f.firstSpellLevel} onChange={e=>set('firstSpellLevel',parseInt(e.target.value))}>
                  {[1,2,3].map(l=><option key={l} value={l}>Level {l}</option>)}
                </select>
              </FormField>
            </Grid>

            {f.spellList === 'Custom' && (
              <div>
                <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontFamily:"'Cinzel',serif", fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'0.75rem' }}>
                  <input type="checkbox" checked={f.hasCantrips} onChange={e=>set('hasCantrips',e.target.checked)} style={{width:'auto',accentColor:'var(--gold)'}} />
                  This class has cantrips
                </label>

                {f.hasCantrips && (
                  <Grid cols={2}>
                    <FormField label="Cantrips at Level 1">
                      <select value={f.cantripsAtLevel1} onChange={e=>set('cantripsAtLevel1',parseInt(e.target.value))}>
                        {[0,1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Additional Cantrip at Levels">
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
                        {Array.from({length:19},(_,i)=>i+2).map(level => (
                          <label key={level} style={{ display:'flex', alignItems:'center', gap:'0.2rem', cursor:'pointer', fontSize:'0.75rem', color: f.cantripGainLevels?.includes(level)?'var(--gold)':'var(--text-muted)' }}>
                            <input type="checkbox" checked={f.cantripGainLevels?.includes(level)||false} onChange={()=>toggleLevel(level,'cantripGainLevels')} style={{width:'auto',accentColor:'var(--gold)'}} />
                            {level}
                          </label>
                        ))}
                      </div>
                    </FormField>
                  </Grid>
                )}

                <SpellSelector label="Available Cantrips" spells={CANTRIPS} selected={f.customCantrips||[]} onChange={v=>set('customCantrips',v)} />
                {Object.entries(SPELLS_BY_LEVEL).map(([level, spells]) => (
                  <SpellSelector key={level} label={`Level ${level} Spells`} spells={spells} selected={(f.customSpells||{})[level]||[]} onChange={v=>set('customSpells',{...f.customSpells,[level]:v})} />
                ))}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Skill Proficiencies */}
      <Section title="Skill Proficiency Choice">
        <Grid cols={2}>
          <FormField label="Number of Skills to Choose">
            <select value={f.skillChoiceCount} onChange={e=>set('skillChoiceCount',parseInt(e.target.value))}>
              {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </FormField>
          <FormField label="Expertise to Choose">
            <select value={f.expertiseChoiceCount||0} onChange={e=>set('expertiseChoiceCount',parseInt(e.target.value))}>
              {[0,1,2,3,4].map(n=><option key={n} value={n}>{n===0?'None':n}</option>)}
            </select>
          </FormField>
        </Grid>
        <div style={{ marginTop:'0.5rem' }}>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.4rem' }}>Available skill options:</div>
          <CheckboxList options={SKILLS} selected={f.skillChoiceOptions||[]} onChange={v=>set('skillChoiceOptions',v)} columns={3} />
        </div>
      </Section>

      {/* Modifiers */}
      <ModifierBuilder modifiers={f.modifiers||[]} onChange={v=>set('modifiers',v)} />

      {/* Class Selections */}
      <ClassSelectionBuilder selections={f.classSelections||[]} onChange={v=>set('classSelections',v)} />

      {/* Features */}
      <FeatureBuilder features={f.features||[]} onChange={v=>set('features',v)} />

      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name||!f.description||f.savingThrows.length===0}>Save Class</Btn>
      </div>
    </div>
  );
}