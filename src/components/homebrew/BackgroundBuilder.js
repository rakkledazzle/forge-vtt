import React, { useState } from 'react';
import { Btn, FormField, Grid, Section } from '../UI';
import {
  SKILLS, LANGUAGES, TOOLS_ARTISAN, TOOLS_MUSICAL, TOOLS_OTHER,
  CheckboxList, FeatureBuilder
} from './SharedComponents';

const CLOTHING = ['Common Clothes','Costume','Fine Clothes',"Traveler's Clothes"];

const HOLY_SYMBOLS = ['Amulet','Emblem','Reliquary'];

const OTHER_EQUIPMENT = [
  'Abacus','Acid',"Alchemist's Fire",'Alms Box','Antitoxin','Backpack','Bag of Sand',
  'Ball Bearings','Barrel','Basket','Bedroll','Bell','Blanket','Block and Tackle','Book',
  'Glass Bottle','Bucket','Caltrops','Candle','Crossbow Bolt Case','Case (Map or Scroll)',
  'Censer','Chain','Chalk','Chest',"Climber's Kit",'Component Pouch','Crowbar',
  'Fishing Tackle','Flask or Tankard','Grappling Hook','Hammer','Sledge Hammer',
  "Healer's Kit",'Holy Water','Holy Symbol','Hourglass','Hunting Trap','Ink','Ink Pen',
  'Incense','Jug or Pitcher','Small Knife','Ladder (10-foot)','Lamp','Bullseye Lantern',
  'Hooded Lantern','Lock','Magnifying Glass','Manacles','Mess Kit','Steel Mirror','Oil',
  'Paper','Parchment','Perfume',"Miner's Pick",'Piton','Basic Poison','Pole (10-foot)',
  'Iron Pot','Potion of Healing','Pouch','Prayer Book','Prayer Wheel','Purse','Quiver',
  'Portable Ram','Rations (1 day)','Robes','Hempen Rope','Silk Rope','Sack','Scale',
  'Sealing Wax','Shovel','Signal Whistle','Signet Ring','Soap','Spellbook','Iron Spikes',
  'Spyglass','String','Two Person Tent','Tinderbox','Torch','Vial','Vestments',
  'Waterskin','Whetstone','Wooden Stake',
];

function EquipmentPicker({ label, options, selected, onChange, allowAny, anyOptions }) {
  return (
    <div style={{ marginBottom:'0.75rem' }}>
      <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>{label}</div>
      {allowAny && (
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.4rem', flexWrap:'wrap' }}>
          {anyOptions.map(opt => (
            <label key={opt} style={{ display:'flex', alignItems:'center', gap:'0.3rem', cursor:'pointer', fontSize:'0.8rem', padding:'0.2rem 0.5rem', borderRadius:'6px', border:`1px solid ${selected.includes(opt)?'var(--gold)':'var(--border)'}`, color: selected.includes(opt)?'var(--gold)':'var(--text-muted)', background: selected.includes(opt)?'rgba(154,111,40,0.08)':'transparent' }}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={()=>onChange(selected.includes(opt)?selected.filter(x=>x!==opt):[...selected,opt])} style={{width:'auto',accentColor:'var(--gold)'}} />
              {opt}
            </label>
          ))}
        </div>
      )}
      <div style={{ maxHeight:'120px', overflowY:'auto', border:'1px solid var(--border)', borderRadius:'6px', padding:'0.4rem', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.2rem' }}>
        {options.map(opt => (
          <label key={opt} style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.75rem', cursor:'pointer', color: selected.includes(opt)?'var(--gold)':'var(--text-secondary)' }}>
            <input type="checkbox" checked={selected.includes(opt)} onChange={()=>onChange(selected.includes(opt)?selected.filter(x=>x!==opt):[...selected,opt])} style={{width:'auto',accentColor:'var(--gold)'}} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function BackgroundBuilder({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name:'', description:'',
    skillProficiencies:[],
    languageChoice:0,
    toolProficiencies:{
      artisan:[], musical:[], gaming:[], vehicles:[], other:[],
    },
    startingEquipment:{
      gold:0, clothing:[], artisan:[], musical:[], other:[],
      holySymbols:[], otherEquipment:[],
    },
    features:[],
  });

  function set(key, val) { setF(x => ({...x, [key]:val})); }
  function setTools(key, val) { setF(x => ({...x, toolProficiencies:{...x.toolProficiencies,[key]:val}})); }
  function setEquip(key, val) { setF(x => ({...x, startingEquipment:{...x.startingEquipment,[key]:val}})); }

  return (
    <div>
      {/* Basic Info */}
      <FormField label="Background Name *">
        <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Haunted Wanderer" />
      </FormField>
      <FormField label="Description *">
        <textarea value={f.description} onChange={e=>set('description',e.target.value)} rows={3} placeholder="What is the story of this background?" />
      </FormField>

      {/* Skill Proficiencies */}
      <Section title="Skill Proficiencies">
        <CheckboxList options={SKILLS} selected={f.skillProficiencies} onChange={v=>set('skillProficiencies',v)} columns={3} />
      </Section>

      {/* Languages */}
      <Section title="Language Proficiencies">
        <FormField label="Number of Languages (player's choice)">
          <select value={f.languageChoice||0} onChange={e=>set('languageChoice',parseInt(e.target.value))} style={{width:'120px'}}>
            {[0,1,2,3].map(n=><option key={n} value={n}>{n===0?'None':`Any ${n}`}</option>)}
          </select>
        </FormField>
      </Section>

      {/* Tool Proficiencies */}
      <Section title="Tool Proficiencies">
        <EquipmentPicker
          label="Artisan's Tools"
          options={TOOLS_ARTISAN}
          selected={f.toolProficiencies.artisan}
          onChange={v=>setTools('artisan',v)}
          allowAny
          anyOptions={["Any 1 Artisan's Tool","Any 2 Artisan's Tools","Any 3 Artisan's Tools"]}
        />
        <EquipmentPicker
          label="Musical Instruments"
          options={TOOLS_MUSICAL}
          selected={f.toolProficiencies.musical}
          onChange={v=>setTools('musical',v)}
          allowAny
          anyOptions={['Any 1 Instrument','Any 2 Instruments','Any 3 Instruments']}
        />
        <div style={{ marginBottom:'0.75rem' }}>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Gaming Sets</div>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            {['Any 1 Gaming Set','Any 2 Gaming Sets','Any 3 Gaming Sets'].map(opt=>(
              <label key={opt} style={{ display:'flex', alignItems:'center', gap:'0.3rem', cursor:'pointer', fontSize:'0.8rem', padding:'0.2rem 0.5rem', borderRadius:'6px', border:`1px solid ${f.toolProficiencies.gaming?.includes(opt)?'var(--gold)':'var(--border)'}`, color: f.toolProficiencies.gaming?.includes(opt)?'var(--gold)':'var(--text-muted)' }}>
                <input type="checkbox" checked={f.toolProficiencies.gaming?.includes(opt)||false} onChange={()=>setTools('gaming', f.toolProficiencies.gaming?.includes(opt) ? f.toolProficiencies.gaming.filter(x=>x!==opt) : [...(f.toolProficiencies.gaming||[]),opt])} style={{width:'auto',accentColor:'var(--gold)'}} />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:'0.75rem' }}>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:"'Cinzel',serif", marginBottom:'0.4rem' }}>Vehicles</div>
          <CheckboxList options={['Water Vehicles','Land Vehicles']} selected={f.toolProficiencies.vehicles||[]} onChange={v=>setTools('vehicles',v)} columns={2} />
        </div>
        <EquipmentPicker
          label="Other Tools"
          options={TOOLS_OTHER}
          selected={f.toolProficiencies.other}
          onChange={v=>setTools('other',v)}
        />
      </Section>

      {/* Starting Equipment */}
      <Section title="Starting Equipment">
        <FormField label="Starting Gold (gp)">
          <input type="number" value={f.startingEquipment.gold||0} onChange={e=>setEquip('gold',parseInt(e.target.value)||0)} style={{width:'100px'}} min={0} />
        </FormField>

        <EquipmentPicker
          label="Clothing"
          options={CLOTHING}
          selected={f.startingEquipment.clothing}
          onChange={v=>setEquip('clothing',v)}
        />

        <EquipmentPicker
          label="Artisan's Tools"
          options={TOOLS_ARTISAN}
          selected={f.startingEquipment.artisan}
          onChange={v=>setEquip('artisan',v)}
          allowAny
          anyOptions={["Any 1 Artisan's Tool"]}
        />

        <EquipmentPicker
          label="Musical Instruments"
          options={TOOLS_MUSICAL}
          selected={f.startingEquipment.musical}
          onChange={v=>setEquip('musical',v)}
          allowAny
          anyOptions={['Any 1 Instrument']}
        />

        <EquipmentPicker
          label="Holy Symbols"
          options={HOLY_SYMBOLS}
          selected={f.startingEquipment.holySymbols}
          onChange={v=>setEquip('holySymbols',v)}
        />

        <EquipmentPicker
          label="Other Tools"
          options={TOOLS_OTHER}
          selected={f.startingEquipment.other}
          onChange={v=>setEquip('other',v)}
        />

        <EquipmentPicker
          label="Other Equipment"
          options={OTHER_EQUIPMENT}
          selected={f.startingEquipment.otherEquipment}
          onChange={v=>setEquip('otherEquipment',v)}
        />
      </Section>

      {/* Features */}
      <FeatureBuilder features={f.features||[]} onChange={v=>set('features',v)} />

      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name||!f.description}>Save Background</Btn>
      </div>
    </div>
  );
}