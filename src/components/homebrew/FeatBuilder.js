import React, { useState } from 'react';
import { Btn, FormField, Grid, Section } from '../UI';
import {
  SKILLS, ABILITY_SCORES, TOOLS_ALL, WEAPONS_ALL, ARMOR_TYPES,
  DAMAGE_TYPES, CheckboxList, FeatureBuilder
} from './SharedComponents';

const SPELLCASTING_OPTIONS = [
  'Choose a class, gain 2 cantrips and 1 lvl 1 spell from the class spell list',
  'Choose a class, gain 2 1st level ritual spells from the class spell list',
  'Choose a class, gain a cantrip requiring an attack roll from the class spell list',
];

const MISC_MODIFIERS = [
  '+1 AC while wielding two melee weapons',
  'Can use two weapon fighting with any one-handed melee weapon',
  'Advantage on saving throws against traps',
  '+5 to passive Perception',
  '+5 to passive Investigation',
];

const SPEED_BONUSES = ['+5 ft','+10 ft','+15 ft'];
const INITIATIVE_BONUSES = ['+1','+2','+3','+4','+5'];

export default function FeatBuilder({ item, onSave, onClose, homebrew }) {
  const [f, setF] = useState(item || {
    name:'', description:'',
    prerequisites:{
      spellcasting:false,
      abilityScores:{},
      armorProf:[],
      races:[],
    },
    modifiers:{
      abilityIncreases:[],
      savingThrowProf:[],
      skillProfOrExpertise:[],
      toolProfOrExpertise:[],
      languageChoice:0,
      weaponProf:[],
      armorProf:[],
      hpBonus:'none',
      damageResistances:[],
      speedBonus:'',
      initiativeBonus:'',
      miscModifiers:[],
      spellcasting:[],
    },
    features:[],
  });

  function set(key, val) { setF(x => ({...x, [key]:val})); }
  function setPrereq(key, val) { setF(x => ({...x, prerequisites:{...x.prerequisites,[key]:val}})); }
  function setPrereqAbility(ab, val) { setF(x => ({...x, prerequisites:{...x.prerequisites,abilityScores:{...x.prerequisites.abilityScores,[ab]:val}}})); }
  function setMod(key, val) { setF(x => ({...x, modifiers:{...x.modifiers,[key]:val}})); }

  // All available races (SRD + homebrew)
  const SRD_RACES = ['Dragonborn','Dwarf','Elf','Gnome','Half-Elf','Half-Orc','Halfling','Human','Tiefling'];
  const homebrewRaces = homebrew?.races?.map(r => r.name) || [];
  const allRaces = [...SRD_RACES, ...homebrewRaces];

  return (
    <div>
      {/* Basic Info */}
      <FormField label="Feat Name *">
        <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Arcane Initiate" />
      </FormField>
      <FormField label="Description *">
        <textarea value={f.description} onChange={e=>set('description',e.target.value)} rows={3} placeholder="What does this feat do overall?" />
      </FormField>

      {/* Prerequisites */}
      <Section title="Prerequisites (Optional)">
        <Grid cols={2}>
          {/* Column 1 - Spellcasting */}
          <div>
            <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.85rem', color: f.prerequisites.spellcasting?'var(--gold)':'var(--text-secondary)', marginBottom:'0.75rem' }}>
              <input type="checkbox" checked={f.prerequisites.spellcasting} onChange={e=>setPrereq('spellcasting',e.target.checked)} style={{width:'auto',accentColor:'var(--gold)'}} />
              Ability to cast at least one spell
            </label>
          </div>

          {/* Column 2 - Ability Scores */}
          <div>
            <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Ability Score Minimums</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
              {ABILITY_SCORES.map(ab => (
                <label key={ab} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.82rem', color: f.prerequisites.abilityScores[ab]?'var(--gold)':'var(--text-secondary)' }}>
                  <input type="checkbox" checked={!!f.prerequisites.abilityScores[ab]} onChange={e=>setPrereqAbility(ab, e.target.checked?13:0)} style={{width:'auto',accentColor:'var(--gold)'}} />
                  {ab.slice(0,3)} 13+
                </label>
              ))}
            </div>
          </div>
        </Grid>

        {/* Column 3 - Armor Prof */}
        <div style={{ marginTop:'0.75rem' }}>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Armor Proficiency Required</div>
          <CheckboxList options={ARMOR_TYPES} selected={f.prerequisites.armorProf||[]} onChange={v=>setPrereq('armorProf',v)} columns={2} />
        </div>

        {/* Column 4 - Race */}
        <div style={{ marginTop:'0.75rem' }}>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Race Requirement</div>
          <CheckboxList options={allRaces} selected={f.prerequisites.races||[]} onChange={v=>setPrereq('races',v)} columns={3} />
        </div>
      </Section>

      {/* Modifiers */}
      <Section title="Modifiers">

        {/* Ability Increases */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Ability Score Increases</div>
          <CheckboxList options={ABILITY_SCORES} selected={f.modifiers.abilityIncreases||[]} onChange={v=>setMod('abilityIncreases',v)} columns={3} />
          <div style={{ marginTop:'0.4rem' }}>
            <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.3rem' }}>Saving Throw Proficiency with chosen abilities:</div>
            <CheckboxList options={ABILITY_SCORES} selected={f.modifiers.savingThrowProf||[]} onChange={v=>setMod('savingThrowProf',v)} columns={3} />
          </div>
        </div>

        {/* Skill Prof or Expertise */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Skill Proficiency or Expertise</div>
          <CheckboxList options={SKILLS} selected={f.modifiers.skillProfOrExpertise||[]} onChange={v=>setMod('skillProfOrExpertise',v)} columns={3} />
        </div>

        {/* Tool Prof or Expertise */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Tool Proficiency or Expertise</div>
          <CheckboxList options={TOOLS_ALL} selected={f.modifiers.toolProfOrExpertise||[]} onChange={v=>setMod('toolProfOrExpertise',v)} columns={2} />
        </div>

        {/* Languages */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Languages</div>
          <FormField label="Languages of player's choice">
            <select value={f.modifiers.languageChoice||0} onChange={e=>setMod('languageChoice',parseInt(e.target.value))} style={{width:'120px'}}>
              {[0,1,2,3].map(n=><option key={n} value={n}>{n===0?'None':`Any ${n}`}</option>)}
            </select>
          </FormField>
        </div>

        {/* Weapon Prof */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Weapon Proficiency</div>
          <CheckboxList
            options={['Prof. w/ improvised weapons','Prof. w/ 3 weapons of choice','Prof. w/ 4 weapons of choice',...WEAPONS_ALL]}
            selected={f.modifiers.weaponProf||[]}
            onChange={v=>setMod('weaponProf',v)}
            columns={2}
          />
        </div>

        {/* Armor Prof */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Armor Proficiency</div>
          <CheckboxList
            options={[
              'Prof. w/ light armor','Prof. w/ medium armor','Prof. w/ heavy armor','Prof. w/ shields',
              "Wearing medium armor doesn't give disadvantage on stealth checks",
              'When wearing medium armor, you can add 3 to AC if DEX = 16+',
            ]}
            selected={f.modifiers.armorProf||[]}
            onChange={v=>setMod('armorProf',v)}
            columns={2}
          />
        </div>

        {/* HP Bonus */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Hit Points</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
            {[
              { id:'none', label:'No HP bonus' },
              { id:'plus1', label:'HP Max increases by 1 for each of your levels' },
              { id:'plus2', label:'HP Max increases by 2 for each of your levels' },
            ].map(opt => (
              <label key={opt.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.85rem', color: f.modifiers.hpBonus===opt.id?'var(--gold)':'var(--text-secondary)' }}>
                <input type="radio" name="hpBonus" checked={f.modifiers.hpBonus===opt.id} onChange={()=>setMod('hpBonus',opt.id)} style={{width:'auto',accentColor:'var(--gold)'}} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Damage Resistance */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Damage Resistance</div>
          <CheckboxList options={DAMAGE_TYPES} selected={f.modifiers.damageResistances||[]} onChange={v=>setMod('damageResistances',v)} columns={3} />
        </div>

        {/* Speed Bonus */}
        <Grid cols={2}>
          <div style={{ marginBottom:'1rem' }}>
            <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Speed Bonus</div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {SPEED_BONUSES.map(opt => (
                <label key={opt} style={{ display:'flex', alignItems:'center', gap:'0.3rem', cursor:'pointer', fontSize:'0.82rem', padding:'0.25rem 0.5rem', borderRadius:'6px', border:`1px solid ${f.modifiers.speedBonus===opt?'var(--gold)':'var(--border)'}`, color: f.modifiers.speedBonus===opt?'var(--gold)':'var(--text-muted)', background: f.modifiers.speedBonus===opt?'rgba(154,111,40,0.08)':'transparent' }}>
                  <input type="radio" name="speedBonus" checked={f.modifiers.speedBonus===opt} onChange={()=>setMod('speedBonus',opt)} style={{width:'auto',accentColor:'var(--gold)'}} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Initiative Bonus */}
          <div style={{ marginBottom:'1rem' }}>
            <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Initiative Bonus</div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {INITIATIVE_BONUSES.map(opt => (
                <label key={opt} style={{ display:'flex', alignItems:'center', gap:'0.3rem', cursor:'pointer', fontSize:'0.82rem', padding:'0.25rem 0.5rem', borderRadius:'6px', border:`1px solid ${f.modifiers.initiativeBonus===opt?'var(--gold)':'var(--border)'}`, color: f.modifiers.initiativeBonus===opt?'var(--gold)':'var(--text-muted)', background: f.modifiers.initiativeBonus===opt?'rgba(154,111,40,0.08)':'transparent' }}>
                  <input type="radio" name="initiativeBonus" checked={f.modifiers.initiativeBonus===opt} onChange={()=>setMod('initiativeBonus',opt)} style={{width:'auto',accentColor:'var(--gold)'}} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </Grid>

        {/* Misc Modifiers */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Miscellaneous Modifiers</div>
          <CheckboxList options={MISC_MODIFIERS} selected={f.modifiers.miscModifiers||[]} onChange={v=>setMod('miscModifiers',v)} columns={1} />
        </div>

        {/* Spellcasting */}
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.85rem', color:'var(--gold)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Spellcasting</div>
          <CheckboxList options={SPELLCASTING_OPTIONS} selected={f.modifiers.spellcasting||[]} onChange={v=>setMod('spellcasting',v)} columns={1} />
        </div>

      </Section>

      {/* Features */}
      <FeatureBuilder features={f.features||[]} onChange={v=>set('features',v)} />

      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name||!f.description}>Save Feat</Btn>
      </div>
    </div>
  );
}