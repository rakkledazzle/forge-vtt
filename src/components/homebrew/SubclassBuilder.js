import React, { useState } from 'react';
import { Btn, FormField, Grid, Section } from '../UI';
import {
  SKILLS, CheckboxList, FeatureBuilder, ModifierBuilder
} from './SharedComponents';

function ClassSelectionBuilder({ selections, onChange }) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name:'', description:'' });
  const [editingIndex, setEditingIndex] = useState(null);

  return (
    <Section title="Class Selections" action={!adding && <Btn size='sm' variant='ghost' onClick={()=>setAdding(true)}>+ Add</Btn>}>
      <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
        Custom options players can choose from for this subclass.
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
          <FormField label="Name *"><input value={newItem.name} onChange={e=>setNewItem(x=>({...x,name:e.target.value}))} placeholder="e.g. Arcane Tradition" /></FormField>
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

export default function SubclassBuilder({ item, onSave, onClose, parentClasses }) {
  const [f, setF] = useState(item || {
    name:'', parentClass:'',
    skillChoiceCount:0, skillChoiceOptions:[...SKILLS],
    expertiseChoiceCount:0, expertiseChoiceOptions:[],
    modifiers:[], classSelections:[], features:[],
  });

  function set(key, val) { setF(x => ({...x, [key]:val})); }

  return (
    <div>
      {/* Basic Info */}
      <Grid cols={2}>
        <FormField label="Subclass Name *">
          <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. School of Evocation" />
        </FormField>
        <FormField label="Parent Class *">
          <select value={f.parentClass} onChange={e=>set('parentClass',e.target.value)}>
            <option value=''>— Select Parent Class —</option>
            {/* SRD Classes */}
            {['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard'].map(c=>(
              <option key={c} value={c}>{c}</option>
            ))}
            {/* Homebrew Classes */}
            {parentClasses?.filter(c => !['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard'].includes(c.name)).map(c=>(
              <option key={c.id||c.name} value={c.name}>{c.name} (Homebrew)</option>
            ))}
          </select>
        </FormField>
      </Grid>

      {/* Skill Proficiencies */}
      <Section title="Skill Proficiency Choice">
        <Grid cols={2}>
          <FormField label="Number of Skills to Choose">
            <select value={f.skillChoiceCount||0} onChange={e=>set('skillChoiceCount',parseInt(e.target.value))}>
              {[0,1,2,3,4].map(n=><option key={n} value={n}>{n===0?'None':n}</option>)}
            </select>
          </FormField>
          <FormField label="Expertise to Choose">
            <select value={f.expertiseChoiceCount||0} onChange={e=>set('expertiseChoiceCount',parseInt(e.target.value))}>
              {[0,1,2,3,4].map(n=><option key={n} value={n}>{n===0?'None':n}</option>)}
            </select>
          </FormField>
        </Grid>
        {(f.skillChoiceCount > 0 || f.expertiseChoiceCount > 0) && (
          <div style={{ marginTop:'0.5rem' }}>
            <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.4rem' }}>Available skill options:</div>
            <CheckboxList options={SKILLS} selected={f.skillChoiceOptions||[]} onChange={v=>set('skillChoiceOptions',v)} columns={3} />
          </div>
        )}
      </Section>

      {/* Modifiers */}
      <ModifierBuilder modifiers={f.modifiers||[]} onChange={v=>set('modifiers',v)} />

      {/* Class Selections */}
      <ClassSelectionBuilder selections={f.classSelections||[]} onChange={v=>set('classSelections',v)} />

      {/* Features */}
      <FeatureBuilder features={f.features||[]} onChange={v=>set('features',v)} />

      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name||!f.parentClass}>Save Subclass</Btn>
      </div>
    </div>
  );
}