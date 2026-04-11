import React, { useState } from 'react';
import { Btn, FormField, Grid, Section, Card } from '../UI';
import {
  LANGUAGES, SKILLS, WEAPONS_ALL, ARMOR_TYPES, TOOLS_ALL,
  DAMAGE_TYPES, ABILITY_SCORES, CheckboxList, TagList,
  CustomAddInput, NumberDropdown, FeatureBuilder
} from './SharedComponents';

const SIZES = ['Tiny','Small','Medium','Large','Huge','Gargantuan'];

const AC_UPGRADE_OPTIONS = [
  { id:'none', label:'None' },
  { id:'unarmored_dex', label:'Without armor AC becomes 13 + Dex' },
  { id:'flat17', label:'AC = 17 regardless of DEX or armor' },
  { id:'custom', label:'Custom' },
];

function SpellEntry({ spell, onChange, onRemove }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'0.5rem', alignItems:'end', marginBottom:'0.4rem' }}>
      <FormField label="Unlock at Level">
        <select value={spell.unlockLevel||1} onChange={e => onChange({...spell, unlockLevel:parseInt(e.target.value)})}>
          {Array.from({length:20},(_,i)=>i+1).map(l=><option key={l} value={l}>Level {l}</option>)}
        </select>
      </FormField>
      <FormField label="Spell Level">
        <select value={spell.spellLevel||0} onChange={e => onChange({...spell, spellLevel:parseInt(e.target.value)})}>
          <option value={0}>Cantrip</option>
          {[1,2,3,4,5,6,7,8,9].map(l=><option key={l} value={l}>Level {l}</option>)}
        </select>
      </FormField>
      <FormField label="Spellcasting Ability">
        <select value={spell.ability||'Intelligence'} onChange={e => onChange({...spell, ability:e.target.value})}>
          {ABILITY_SCORES.map(a=><option key={a}>{a}</option>)}
        </select>
      </FormField>
      <Btn size='sm' variant='danger' onClick={onRemove} style={{marginBottom:'0.1rem'}}>×</Btn>
    </div>
  );
}

export default function RaceBuilder({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', description:'', size:'Medium', speed:30,
    flyingSpeed:0, swimmingSpeed:0,
    darkvision:false, darkvisionRange:60,
    acUpgrade:'none', customAC:'', customACMod:'',
    abilityBonuses:{ Strength:0, Dexterity:0, Constitution:0, Intelligence:0, Wisdom:0, Charisma:0 },
    languages:[], customLanguages:[],
    weaponProficiencies:[], armorProficiencies:[],
    toolProficiencies:[], damageResistances:[],
    damageImmunities:[], skillProficiencies:[],
    skillChoiceCount:0, skillChoiceOptions:[],
    languageChoiceCount:0,
    weaponChoiceCount:0, weaponChoiceOptions:[],
    spells:[], features:[],
  });

  function set(key, val) { setF(x => ({...x, [key]:val})); }
  function setBonus(ab, v) { setF(x => ({...x, abilityBonuses:{...x.abilityBonuses,[ab]:v}})); }

  return (
    <div>
      {/* Basic Info */}
      <Grid cols={2}>
        <FormField label="Race Name *">
          <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Starborn" />
        </FormField>
        <FormField label="Size *">
          <select value={f.size} onChange={e=>set('size',e.target.value)}>
            {SIZES.map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
      </Grid>

      <FormField label="Description *">
        <textarea value={f.description} onChange={e=>set('description',e.target.value)} rows={3} placeholder="Lore and background for this race…" />
      </FormField>

      {/* Speed */}
      <Grid cols={3}>
        <FormField label="Walking Speed (ft)">
          <input type="number" value={f.speed} onChange={e=>set('speed',parseInt(e.target.value)||30)} min={0} step={5} />
        </FormField>
        <FormField label="Flying Speed (ft)">
          <input type="number" value={f.flyingSpeed||0} onChange={e=>set('flyingSpeed',parseInt(e.target.value)||0)} min={0} step={5} />
        </FormField>
        <FormField label="Swimming Speed (ft)">
          <input type="number" value={f.swimmingSpeed||0} onChange={e=>set('swimmingSpeed',parseInt(e.target.value)||0)} min={0} step={5} />
        </FormField>
      </Grid>

      {/* Darkvision */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
        <label style={{ display:'flex', alignItems:'center', gap:'0.4rem', cursor:'pointer', fontFamily:"'Cinzel',serif", fontSize:'0.85rem', color:'var(--text-secondary)' }}>
          <input type="checkbox" checked={f.darkvision} onChange={e=>set('darkvision',e.target.checked)} style={{width:'auto',accentColor:'var(--gold)'}} />
          Darkvision
        </label>
        {f.darkvision && (
          <FormField label="Range (ft)" style={{margin:0}}>
            <input type="number" value={f.darkvisionRange} onChange={e=>set('darkvisionRange',parseInt(e.target.value)||60)} style={{width:'80px'}} min={0} step={10} />
          </FormField>
        )}
      </div>

      {/* AC Upgrade */}
      <Section title="Armor Class Upgrade">
        <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
          {AC_UPGRADE_OPTIONS.map(opt => (
            <label key={opt.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.85rem', color: f.acUpgrade===opt.id?'var(--gold)':'var(--text-secondary)' }}>
              <input type="radio" name="acUpgrade" checked={f.acUpgrade===opt.id} onChange={()=>set('acUpgrade',opt.id)} style={{width:'auto',accentColor:'var(--gold)'}} />
              {opt.label}
            </label>
          ))}
        </div>
        {f.acUpgrade==='custom' && (
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.75rem' }}>
            <FormField label="Base AC">
              <input type="number" value={f.customAC||10} onChange={e=>set('customAC',parseInt(e.target.value)||10)} style={{width:'70px'}} />
            </FormField>
            <FormField label="+ Modifier">
              <select value={f.customACMod||'DEX'} onChange={e=>set('customACMod',e.target.value)}>
                <option value='DEX'>DEX Modifier</option>
                {ABILITY_SCORES.map(a=><option key={a} value={a}>{a} Modifier</option>)}
                <option value='none'>None</option>
              </select>
            </FormField>
          </div>
        )}
      </Section>

      {/* Ability Score Increases */}
      <Section title="Ability Score Increases">
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {ABILITY_SCORES.map(ab => (
            <NumberDropdown key={ab} label={ab.slice(0,3)} value={f.abilityBonuses[ab]} onChange={v=>setBonus(ab,v)} min={-3} max={3} />
          ))}
        </div>
      </Section>

      {/* Languages */}
      <Section title="Languages">
        <CheckboxList options={LANGUAGES} selected={f.languages} onChange={v=>set('languages',v)} columns={4} />
        <div style={{ marginTop:'0.5rem' }}>
          <TagList items={f.customLanguages} onRemove={i=>set('customLanguages',f.customLanguages.filter((_,j)=>j!==i))} color='var(--sapphire)' />
          <CustomAddInput placeholder="Add custom language…" onAdd={l=>set('customLanguages',[...f.customLanguages,l])} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.75rem' }}>
          <label style={{ fontSize:'0.82rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif" }}>Language Choice:</label>
          <select value={f.languageChoiceCount||0} onChange={e=>set('languageChoiceCount',parseInt(e.target.value))} style={{width:'80px'}}>
            {[0,1,2,3].map(n=><option key={n} value={n}>{n === 0 ? 'None' : `Choose ${n}`}</option>)}
          </select>
        </div>
      </Section>

      {/* Weapon Proficiencies */}
      <Section title="Weapon Proficiencies">
        <CheckboxList options={WEAPONS_ALL} selected={f.weaponProficiencies} onChange={v=>set('weaponProficiencies',v)} columns={2} />
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
          <label style={{ fontSize:'0.82rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif" }}>Weapon Choice:</label>
          <select value={f.weaponChoiceCount||0} onChange={e=>set('weaponChoiceCount',parseInt(e.target.value))} style={{width:'80px'}}>
            {[0,1,2,3,4].map(n=><option key={n} value={n}>{n === 0 ? 'None' : `Choose ${n}`}</option>)}
          </select>
          {f.weaponChoiceCount > 0 && (
            <div style={{flex:1, minWidth:'200px'}}>
              <CheckboxList options={WEAPONS_ALL} selected={f.weaponChoiceOptions||[]} onChange={v=>set('weaponChoiceOptions',v)} columns={2} />
            </div>
          )}
        </div>
      </Section>

      {/* Armor Proficiencies */}
      <Section title="Armor Proficiencies">
        <CheckboxList options={ARMOR_TYPES} selected={f.armorProficiencies} onChange={v=>set('armorProficiencies',v)} columns={2} />
      </Section>

      {/* Tool Proficiencies */}
      <Section title="Tool Proficiencies">
        <CheckboxList options={TOOLS_ALL} selected={f.toolProficiencies} onChange={v=>set('toolProficiencies',v)} columns={2} />
      </Section>

      {/* Damage Resistances */}
      <Section title="Damage Resistances">
        <CheckboxList options={DAMAGE_TYPES} selected={f.damageResistances} onChange={v=>set('damageResistances',v)} columns={3} />
        <CustomAddInput placeholder="Custom resistance…" onAdd={r=>set('damageResistances',[...f.damageResistances,r])} />
      </Section>

      {/* Damage Immunities */}
      <Section title="Damage Immunities">
        <CheckboxList options={DAMAGE_TYPES} selected={f.damageImmunities} onChange={v=>set('damageImmunities',v)} columns={3} />
        <CustomAddInput placeholder="Custom immunity…" onAdd={r=>set('damageImmunities',[...f.damageImmunities,r])} />
      </Section>

      {/* Skill Proficiencies */}
      <Section title="Skill Proficiencies">
        <CheckboxList options={SKILLS} selected={f.skillProficiencies} onChange={v=>set('skillProficiencies',v)} columns={3} />
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
          <label style={{ fontSize:'0.82rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif" }}>Skill Choice:</label>
          <select value={f.skillChoiceCount||0} onChange={e=>set('skillChoiceCount',parseInt(e.target.value))} style={{width:'80px'}}>
            {[0,1,2,3,4].map(n=><option key={n} value={n}>{n === 0 ? 'None' : `Choose ${n}`}</option>)}
          </select>
          {f.skillChoiceCount > 0 && (
            <div style={{flex:1, minWidth:'200px'}}>
              <CheckboxList options={SKILLS} selected={f.skillChoiceOptions||[]} onChange={v=>set('skillChoiceOptions',v)} columns={3} />
            </div>
          )}
        </div>
      </Section>

      {/* Spells */}
      <Section title="Spells" action={<Btn size='sm' variant='ghost' onClick={()=>set('spells',[...f.spells,{unlockLevel:1,spellLevel:0,ability:'Intelligence'}])}>+ Add Spell</Btn>}>
        {f.spells.map((spell,i) => (
          <SpellEntry key={i} spell={spell}
            onChange={s=>set('spells',f.spells.map((x,j)=>j===i?s:x))}
            onRemove={()=>set('spells',f.spells.filter((_,j)=>j!==i))}
          />
        ))}
        {f.spells.length === 0 && <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>No spells added.</div>}
      </Section>

      {/* Features */}
      <FeatureBuilder features={f.features} onChange={v=>set('features',v)} />

      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name||!f.description}>Save Race</Btn>
      </div>
    </div>
  );
}