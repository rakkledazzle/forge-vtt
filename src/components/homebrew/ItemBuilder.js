import React, { useState } from 'react';
import { Btn, FormField, Grid, Section } from '../UI';
import { CheckboxList, CustomAddInput, TagList } from './SharedComponents';

const ITEM_TYPES = [
  'Wondrous Item', 'Weapon', 'Armor', 'Ring',
  'Wand', 'Rod', 'Scroll', 'Potion', 'Other',
];

const RARITY = [
  'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Varies',
];

const ABILITY_SCORES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const ABILITY_FULL = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma',
};

const DAMAGE_TYPES = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning',
  'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder',
];

const CONDITION_IMMUNITIES = [
  'Blinded', 'Charmed', 'Deafened', 'Exhausted', 'Frightened',
  'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
];

const SPEED_TYPES = ['Speed', 'Flying Speed', 'Swimming Speed', 'Climbing Speed'];

const ABILITY_MODIFY_OPTIONS = ['Becomes at Least', 'Increase by'];

function AbilityBonusRow({ ab, data, onChange }) {
  const d = data || { mode: 'Increase by', value: 0 };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px', gap: '0.4rem', alignItems: 'end', marginBottom: '0.4rem' }}>
      <div style={{ fontSize: '0.82rem', fontFamily: "'Cinzel', serif", color: 'var(--text2)', paddingBottom: '6px', fontWeight: 700 }}>{ab}</div>
      <select value={d.mode} onChange={e => onChange({ ...d, mode: e.target.value })} style={{ fontSize: '0.78rem' }}>
        {ABILITY_MODIFY_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
      <input
        type="number"
        value={d.value || 0}
        onChange={e => onChange({ ...d, value: parseInt(e.target.value) || 0 })}
        min={0} max={30}
        style={{ textAlign: 'center' }}
      />
    </div>
  );
}

function SpeedBonusRow({ speed, data, onChange }) {
  const d = data || { mode: 'Increase by', value: 0 };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px', gap: '0.4rem', alignItems: 'end', marginBottom: '0.4rem' }}>
      <div style={{ fontSize: '0.78rem', fontFamily: "'Cinzel', serif", color: 'var(--text2)', paddingBottom: '6px' }}>{speed}</div>
      <select value={d.mode} onChange={e => onChange({ ...d, mode: e.target.value })} style={{ fontSize: '0.78rem' }}>
        {ABILITY_MODIFY_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
      <input
        type="number"
        value={d.value || 0}
        onChange={e => onChange({ ...d, value: parseInt(e.target.value) || 0 })}
        min={0} step={5}
        style={{ textAlign: 'center' }}
      />
    </div>
  );
}

export default function ItemBuilder({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name: '',
    type: 'Wondrous Item',
    rarity: 'Common',
    description: '',
    attunement: false,
    // Properties
    magicalACBonus: 0,
    abilityBonuses: {},    // { STR: { mode, value }, ... }
    savingThrowBonuses: {}, // { STR: value, ... }
    speedBonuses: {},       // { 'Speed': { mode, value }, ... }
    // Damage/condition
    damageVulnerabilities: [],
    customDamageVulnerabilities: [],
    damageResistances: [],
    customDamageResistances: [],
    damageImmunities: [],
    customDamageImmunities: [],
    conditionImmunities: [],
  });

  function set(key, val) { setF(x => ({ ...x, [key]: val })); }
  function setAbBonus(ab, val) { setF(x => ({ ...x, abilityBonuses: { ...x.abilityBonuses, [ab]: val } })); }
  function setSavingThrow(ab, val) { setF(x => ({ ...x, savingThrowBonuses: { ...x.savingThrowBonuses, [ab]: parseInt(val) || 0 } })); }
  function setSpeedBonus(sp, val) { setF(x => ({ ...x, speedBonuses: { ...x.speedBonuses, [sp]: val } })); }

  return (
    <div>
      {/* Basic Info */}
      <FormField label="Item Name *">
        <input value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Amulet of Health" />
      </FormField>

      <Grid cols={2}>
        <FormField label="Type">
          <select value={f.type} onChange={e => set('type', e.target.value)}>
            {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Rarity">
          <select value={f.rarity} onChange={e => set('rarity', e.target.value)}>
            {RARITY.map(r => <option key={r}>{r}</option>)}
          </select>
        </FormField>
      </Grid>

      <FormField label="Description *">
        <textarea value={f.description} onChange={e => set('description', e.target.value)} rows={5} placeholder="What does this item do?" />
      </FormField>

      {/* Attunement */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: f.attunement ? 'var(--accent)' : 'var(--text2)', fontFamily: "'Cinzel', serif" }}>
          <input type="checkbox" checked={f.attunement} onChange={e => set('attunement', e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
          Requires Attunement
        </label>
      </div>

      {/* Item Properties */}
      <Section title="Item Properties">
        <Grid cols={3}>
          {/* Column 1: Ability Bonuses */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.75rem', fontFamily: "'Cinzel', serif" }}>Ability Bonuses</div>
            <FormField label="Magical AC Bonus">
              <input type="number" value={f.magicalACBonus || 0} onChange={e => set('magicalACBonus', parseInt(e.target.value) || 0)} min={0} max={10} style={{ width: '70px' }} />
            </FormField>
            {ABILITY_SCORES.map(ab => (
              <AbilityBonusRow key={ab} ab={ab} data={f.abilityBonuses[ab]} onChange={v => setAbBonus(ab, v)} />
            ))}
          </div>

          {/* Column 2: Saving Throw Bonuses */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.75rem', fontFamily: "'Cinzel', serif" }}>Saving Throw Bonuses</div>
            {ABILITY_SCORES.map(ab => (
              <div key={ab} style={{ display: 'grid', gridTemplateColumns: '60px 60px', gap: '0.4rem', alignItems: 'end', marginBottom: '0.4rem' }}>
                <div style={{ fontSize: '0.82rem', fontFamily: "'Cinzel', serif", color: 'var(--text2)', paddingBottom: '6px', fontWeight: 700 }}>{ab} Save</div>
                <input
                  type="number"
                  value={f.savingThrowBonuses[ab] || 0}
                  onChange={e => setSavingThrow(ab, e.target.value)}
                  min={-10} max={20}
                  style={{ textAlign: 'center' }}
                />
              </div>
            ))}
          </div>

          {/* Column 3: Speed Bonuses */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.75rem', fontFamily: "'Cinzel', serif" }}>Speed Bonuses</div>
            {SPEED_TYPES.map(sp => (
              <SpeedBonusRow key={sp} speed={sp} data={f.speedBonuses[sp]} onChange={v => setSpeedBonus(sp, v)} />
            ))}
          </div>
        </Grid>
      </Section>

      {/* Damage / Condition */}
      <Section title="Damage & Condition Properties">
        <Grid cols={4}>
          {/* Vulnerabilities */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Vulnerabilities</div>
            <CheckboxList options={DAMAGE_TYPES} selected={f.damageVulnerabilities} onChange={v => set('damageVulnerabilities', v)} columns={1} />
            <TagList items={f.customDamageVulnerabilities} onRemove={i => set('customDamageVulnerabilities', f.customDamageVulnerabilities.filter((_, j) => j !== i))} color="var(--accent)" />
            <CustomAddInput placeholder="Custom…" onAdd={v => set('customDamageVulnerabilities', [...f.customDamageVulnerabilities, v])} />
          </div>

          {/* Resistances */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Resistances</div>
            <CheckboxList options={DAMAGE_TYPES} selected={f.damageResistances} onChange={v => set('damageResistances', v)} columns={1} />
            <TagList items={f.customDamageResistances} onRemove={i => set('customDamageResistances', f.customDamageResistances.filter((_, j) => j !== i))} color="var(--accent)" />
            <CustomAddInput placeholder="Custom…" onAdd={v => set('customDamageResistances', [...f.customDamageResistances, v])} />
          </div>

          {/* Immunities */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Damage Immunities</div>
            <CheckboxList options={DAMAGE_TYPES} selected={f.damageImmunities} onChange={v => set('damageImmunities', v)} columns={1} />
            <TagList items={f.customDamageImmunities} onRemove={i => set('customDamageImmunities', f.customDamageImmunities.filter((_, j) => j !== i))} color="var(--accent)" />
            <CustomAddInput placeholder="Custom…" onAdd={v => set('customDamageImmunities', [...f.customDamageImmunities, v])} />
          </div>

          {/* Condition Immunities */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Condition Immunities</div>
            <CheckboxList options={CONDITION_IMMUNITIES} selected={f.conditionImmunities} onChange={v => set('conditionImmunities', v)} columns={1} />
          </div>
        </Grid>
      </Section>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => onSave(f)} disabled={!f.name || !f.description}>Save Item</Btn>
      </div>
    </div>
  );
}