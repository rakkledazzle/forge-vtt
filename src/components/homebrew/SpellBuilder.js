import React, { useState } from 'react';
import { Btn, FormField, Grid, Section } from '../UI';
import { CheckboxList } from './SharedComponents';

const SPELL_LEVELS = [
  { value: 0, label: 'Cantrip' },
  ...Array.from({ length: 9 }, (_, i) => ({ value: i + 1, label: `Level ${i + 1}` })),
];

const SPELL_SCHOOLS = [
  'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
  'Evocation', 'Illusion', 'Necromancy', 'Transmutation',
];

const CLASS_LISTS = [
  'Bard', 'Cleric', 'Druid', 'Paladin',
  'Ranger', 'Sorcerer', 'Warlock', 'Wizard',
];

export default function SpellBuilder({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name: '',
    level: 0,
    school: 'Evocation',
    ritual: false,
    requiresAttackRoll: false,
    castingTime: '1 action',
    range: '60 feet',
    components: { verbal: true, somatic: true, material: false, materialText: '' },
    duration: 'Instantaneous',
    concentration: false,
    description: '',
    atHigherLevels: '',
    classes: [],
  });

  function set(key, val) { setF(x => ({ ...x, [key]: val })); }
  function setComp(key, val) { setF(x => ({ ...x, components: { ...x.components, [key]: val } })); }
  function toggleClass(cls) {
    setF(x => ({
      ...x,
      classes: x.classes.includes(cls) ? x.classes.filter(c => c !== cls) : [...x.classes, cls],
    }));
  }

  const CheckRow = ({ id, label, checked, onChange, style }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: checked ? 'var(--accent)' : 'var(--text2)', fontFamily: "'Cinzel', serif", ...style }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
      {label}
    </label>
  );

  return (
    <div>
      {/* Name */}
      <FormField label="Spell Name *">
        <input value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Arcane Bolt" />
      </FormField>

      {/* Level + School */}
      <Grid cols={2}>
        <FormField label="Level">
          <select value={f.level} onChange={e => set('level', parseInt(e.target.value))}>
            {SPELL_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </FormField>
        <FormField label="School">
          <select value={f.school} onChange={e => set('school', e.target.value)}>
            {SPELL_SCHOOLS.map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>
      </Grid>

      {/* Flags */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <CheckRow id="ritual" label="Ritual" checked={f.ritual} onChange={v => set('ritual', v)} />
        <CheckRow id="atk" label="Requires Attack Roll" checked={f.requiresAttackRoll} onChange={v => set('requiresAttackRoll', v)} />
        <CheckRow id="conc" label="Concentration" checked={f.concentration} onChange={v => set('concentration', v)} />
      </div>

      {/* Casting stats */}
      <Grid cols={2}>
        <FormField label="Casting Time">
          <input value={f.castingTime} onChange={e => set('castingTime', e.target.value)} placeholder="1 action" />
        </FormField>
        <FormField label="Range">
          <input value={f.range} onChange={e => set('range', e.target.value)} placeholder="60 feet" />
        </FormField>
      </Grid>

      <FormField label="Duration">
        <input value={f.duration} onChange={e => set('duration', e.target.value)} placeholder="Instantaneous" />
      </FormField>

      {/* Components */}
      <Section title="Components">
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <CheckRow label="Verbal (V)"   checked={f.components.verbal}   onChange={v => setComp('verbal', v)} />
          <CheckRow label="Somatic (S)"  checked={f.components.somatic}  onChange={v => setComp('somatic', v)} />
          <CheckRow label="Material (M)" checked={f.components.material} onChange={v => setComp('material', v)} />
        </div>
        {f.components.material && (
          <FormField label="Material Component Details">
            <input
              value={f.components.materialText}
              onChange={e => setComp('materialText', e.target.value)}
              placeholder="e.g. a pinch of sulfur worth 25 gp"
            />
          </FormField>
        )}
      </Section>

      {/* Description */}
      <FormField label="Description *">
        <textarea
          value={f.description}
          onChange={e => set('description', e.target.value)}
          rows={6}
          placeholder="Full spell description…"
        />
      </FormField>

      <FormField label="At Higher Levels">
        <textarea
          value={f.atHigherLevels || ''}
          onChange={e => set('atHigherLevels', e.target.value)}
          rows={2}
          placeholder="When you cast this spell using a spell slot of 2nd level or higher…"
        />
      </FormField>

      {/* Class Lists */}
      <Section title="Add to Class Spell Lists">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CLASS_LISTS.map(cls => (
            <button
              key={cls}
              onClick={() => toggleClass(cls)}
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '12px',
                border: `1px solid ${f.classes.includes(cls) ? 'var(--accent)' : 'var(--border)'}`,
                background: f.classes.includes(cls) ? 'rgba(var(--accent-rgb, 139,26,26), 0.15)' : 'transparent',
                color: f.classes.includes(cls) ? 'var(--accent)' : 'var(--text3)',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cls}
            </button>
          ))}
        </div>
      </Section>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => onSave(f)} disabled={!f.name || !f.description}>Save Spell</Btn>
      </div>
    </div>
  );
}