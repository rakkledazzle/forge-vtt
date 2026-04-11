import React, { useState } from 'react';
import { Btn, FormField, Grid, Section } from '../UI';
import {
  LANGUAGES, SKILLS, WEAPONS_ALL, ARMOR_TYPES, TOOLS_ALL,
  DAMAGE_TYPES, CONDITIONS, ABILITY_SCORES, CheckboxList,
  CustomAddInput, NumberDropdown, FeatureBuilder
} from './SharedComponents';

function SpellEntry({ spell, onChange, onRemove }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'0.5rem', alignItems:'end', marginBottom:'0.4rem' }}>
      <FormField label="Unlock at Level">
        <select value={spell.unlockLevel||1} onChange={e=>onChange({...spell,unlockLevel:parseInt(e.target.value)})}>
          {Array.from({length:20},(_,i)=>i+1).map(l=><option key={l} value={l}>Level {l}</option>)}
        </select>
      </FormField>
      <FormField label="Spell Level">
        <select value={spell.spellLevel||0} onChange={e=>onChange({...spell,spellLevel:parseInt(e.target.value)})}>
          <option value={0}>Cantrip</option>
          {[1,2,3,4,5,6,7,8,9].map(l=><option key={l} value={l}>Level {l}</option>)}
        </select>
      </FormField>
      <FormField label="Spellcasting Ability">
        <select value={spell.ability||'Intelligence'} onChange={e=>onChange({...spell,ability:e.target.value})}>
          {ABILITY_SCORES.map(a=><option key={a}>{a}</option>)}
        </select>
      </FormField>
      <Btn size='sm' variant='danger' onClick={onRemove} style={{marginBottom:'0.1rem'}}>×</Btn>
    </div>
  );
}

export default function SubraceBuilder({ item, onSave, onClose, parentRaces }) {
  const [f, setF] = useState(item || {
    name:'', parentRace:'', size:'Medium', speed:30,
    darkvision:false, darkvisionRange:60,
    abilityBonuses:{ Strength:0, Dexterity:0, Constitution:0, Intelligence:0, Wisdom:0, Charisma:0 },
    hpBonus:'none',
    damageResistances:[], damageImmunities:[],
    savingThrowAdvantages:[],
    weaponProficiencies:[], armorProficiencies:[],
    toolProficiencies:[], skillProficiencies:[],
    skillChoiceCount:0, skillChoiceOptions:[],
    languages:[], customLanguages:[],
    spells:[], features:[],
  });

  function set(key, val) { setF(x => ({...x, [key]:val})); }
  function setBonus(ab, v) { setF(x => ({...x, abilityBonuses:{...x.abilityBonuses,[ab]:v}})); }

  // Get parent race bonuses if available
  const parentRace = parentRaces?.find(r => r.name === f.parentRace);
  const parentBonuses = parentRace?.abilityBonuses || {};

  return (
    <div>
      {/* Basic Info */}
      <Grid cols={2}>
        <FormField label="Subrace Name *">
          <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. High Elf" />
        </FormField>
        <FormField label="Parent Race *">
          <select value={f.parentRace} onChange={e=>set('parentRace',e.target.value)}>
            <option value=''>— Select Parent Race —</option>
            {parentRaces?.map(r => <option key={r.id||r.name} value={r.name}>{r.name}</option>)}
          </select>
        </FormField>
      </Grid>

      <Grid cols={2}>
        <FormField label="Size *">
          <select value={f.size} onChange={e=>set('size',e.target.value)}>
            {['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Speed (ft) *">
          <input type="number" value={f.speed} onChange={e=>set('speed',parseInt(e.target.value)||30)} min={0} step={5} />
        </FormField>
      </Grid>

      {/* Darkvision */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
        <label style={{ display:'flex', alignItems:'center', gap:'0.4rem', cursor:'pointer', fontFamily:"'Cinzel',serif", fontSize:'0.85rem', color:'var(--text-secondary)' }}>
          <input type="checkbox" checked={f.darkvision} onChange={e=>set('darkvision',e.target.checked)} style={{width:'auto',accentColor:'var(--gold)'}} />
          Darkvision
        </label>
        {f.darkvision && (
          <FormField label="Range (ft)">
            <input type="number" value={f.darkvisionRange} onChange={e=>set('darkvisionRange',parseInt(e.target.value)||60)} style={{width:'80px'}} min={0} step={10} />
          </FormField>
        )}
      </div>

      {/* Ability Score Increases */}
      <Section title="Ability Score Increases">
        <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
          Subrace bonuses stack with parent race bonuses. Parent race bonuses shown in grey.
        </p>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {ABILITY_SCORES.map(ab => {
            const parentBonus = parentBonuses[ab] || 0;
            const subraceBonus = f.abilityBonuses[ab] || 0;
            const total = parentBonus + subraceBonus;
            return (
              <div key={ab} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>{ab.slice(0,3)}</div>
                {parentBonus !== 0 && (
                  <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginBottom:'0.1rem' }}>
                    Race: {parentBonus > 0 ? `+${parentBonus}` : parentBonus}
                  </div>
                )}
                <NumberDropdown value={subraceBonus} onChange={v=>setBonus(ab,v)} min={-3} max={3} />
                {parentBonus !== 0 && (
                  <div style={{ fontSize:'0.72rem', color:'var(--gold)', marginTop:'0.1rem', fontWeight:700 }}>
                    = {total > 0 ? `+${total}` : total}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* HP Bonus */}
      <Section title="Hit Point Modifier">
        <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
          {[
            { id:'none', label:'No HP modifier' },
            { id:'plus1', label:'HP Max increases by 1 for each of your levels' },
            { id:'plus2', label:'HP Max increases by 2 for each of your levels' },
          ].map(opt => (
            <label key={opt.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.85rem', color: f.hpBonus===opt.id?'var(--gold)':'var(--text-secondary)' }}>
              <input type="radio" name="hpBonus" checked={f.hpBonus===opt.id} onChange={()=>set('hpBonus',opt.id)} style={{width:'auto',accentColor:'var(--gold)'}} />
              {opt.label}
            </label>
          ))}
        </div>
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

      {/* Saving Throw Advantages */}
      <Section title="Saving Throw Advantages">
        <CheckboxList options={CONDITIONS} selected={f.savingThrowAdvantages} onChange={v=>set('savingThrowAdvantages',v)} columns={3} />
      </Section>

      {/* Weapon Proficiencies */}
      <Section title="Weapon Proficiencies">
        <CheckboxList options={WEAPONS_ALL} selected={f.weaponProficiencies} onChange={v=>set('weaponProficiencies',v)} columns={2} />
      </Section>

      {/* Armor Proficiencies */}
      <Section title="Armor Proficiencies">
        <CheckboxList options={ARMOR_TYPES} selected={f.armorProficiencies} onChange={v=>set('armorProficiencies',v)} columns={2} />
      </Section>

      {/* Tool Proficiencies */}
      <Section title="Tool Proficiencies">
        <CheckboxList options={TOOLS_ALL} selected={f.toolProficiencies} onChange={v=>set('toolProficiencies',v)} columns={2} />
      </Section>

      {/* Skill Proficiencies */}
      <Section title="Skill Proficiencies">
        <CheckboxList options={SKILLS} selected={f.skillProficiencies} onChange={v=>set('skillProficiencies',v)} columns={3} />
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
          <label style={{ fontSize:'0.82rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif" }}>Skill Choice:</label>
          <select value={f.skillChoiceCount||0} onChange={e=>set('skillChoiceCount',parseInt(e.target.value))} style={{width:'80px'}}>
            {[0,1,2,3,4].map(n=><option key={n} value={n}>{n===0?'None':`Choose ${n}`}</option>)}
          </select>
          {f.skillChoiceCount > 0 && (
            <div style={{flex:1, minWidth:'200px'}}>
              <CheckboxList options={SKILLS} selected={f.skillChoiceOptions||[]} onChange={v=>set('skillChoiceOptions',v)} columns={3} />
            </div>
          )}
        </div>
      </Section>

      {/* Languages */}
      <Section title="Languages">
        <CheckboxList options={LANGUAGES} selected={f.languages} onChange={v=>set('languages',v)} columns={4} />
        <CustomAddInput placeholder="Add custom language…" onAdd={l=>set('customLanguages',[...(f.customLanguages||[]),l])} />
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
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name||!f.parentRace}>Save Subrace</Btn>
      </div>
    </div>
  );
}