import React, { useState } from 'react';
import { Btn, FormField, Grid, Section } from '../UI';
import { CheckboxList, CustomAddInput, TagList, NumberDropdown } from './SharedComponents';

const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

const MONSTER_TYPES = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
  'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant',
  'Swarm of Tiny Beasts', 'Undead',
];

const ALIGNMENTS = [
  'Any Alignment', 'Any Chaotic Alignment', 'Any Evil Alignment',
  'Any Non-Good Alignment', 'Any Non-Lawful Alignment',
  'Chaotic Evil', 'Chaotic Good', 'Chaotic Neutral',
  'Lawful Evil', 'Lawful Good', 'Lawful Neutral',
  'Neutral', 'Neutral Evil', 'Neutral Good', 'Unaligned',
];

const CR_OPTIONS = [
  '0', '1/8', '1/4', '1/2',
  ...Array.from({ length: 30 }, (_, i) => String(i + 1)),
];

const HP_DICE = [4, 6, 8, 10, 12, 20, 100];
const HP_DIE_COUNTS = Array.from({ length: 35 }, (_, i) => i + 1);

const ABILITY_SCORES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const ABILITY_FULL = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma',
};

const SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
  'Sleight of Hand', 'Stealth', 'Survival',
];

const DAMAGE_TYPES = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning',
  'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder',
];

const CONDITION_IMMUNITIES = [
  'Blinded', 'Charmed', 'Deafened', 'Exhausted', 'Frightened',
  'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
];

const LANGUAGES = [
  'Abyssal', 'Celestial', 'Common', 'Deep Speech', 'Draconic', 'Dwarvish',
  'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Infernal',
  'Orc', 'Primordial', 'Sylvan', 'Undercommon',
];

const SENSES = ['Darkvision', 'Truesight', 'Blindsight', 'Tremorsense'];

function mod(score) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

// ── Feature entry for traits / actions / bonus actions / reactions ────────────
const ACTION_TYPES = ['Attack', 'Spell', 'Heal', 'Boost', 'Utility', 'Other'];

function FeatureEntry({ feature, onChange, onRemove, showActionFields }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <Grid cols={2}>
            <FormField label="Name *">
              <input value={feature.name || ''} onChange={e => onChange({ ...feature, name: e.target.value })} placeholder="Feature name" />
            </FormField>
            {showActionFields && (
              <FormField label="Type">
                <select value={feature.actionType || 'Attack'} onChange={e => onChange({ ...feature, actionType: e.target.value })}>
                  {ACTION_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </FormField>
            )}
          </Grid>
          {showActionFields && (
            <Grid cols={2}>
              <FormField label="Range">
                <input value={feature.range || ''} onChange={e => onChange({ ...feature, range: e.target.value })} placeholder="5 ft., 60 ft., etc." />
              </FormField>
              <FormField label="Save (if applicable)">
                <select value={feature.save || ''} onChange={e => onChange({ ...feature, save: e.target.value })}>
                  <option value="">None</option>
                  {ABILITY_SCORES.map(a => <option key={a}>{a} Save</option>)}
                </select>
              </FormField>
            </Grid>
          )}
          <FormField label="Description *">
            <textarea value={feature.description || ''} onChange={e => onChange({ ...feature, description: e.target.value })} rows={2} placeholder="What does this do?" />
          </FormField>
        </div>
        <button onClick={onRemove} style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', color: '#c0392b', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '14px' }}>×</button>
      </div>
    </div>
  );
}

// ── Passive ability entry ─────────────────────────────────────────────────────
function PassiveEntry({ passive, onChange, onRemove }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <Grid cols={2}>
            <FormField label="Type">
              <select value={passive.type || 'Advantage'} onChange={e => onChange({ ...passive, type: e.target.value })}>
                <option>Advantage</option>
                <option>Disadvantage</option>
              </select>
            </FormField>
            <FormField label="Specifics">
              <input value={passive.specifics || ''} onChange={e => onChange({ ...passive, specifics: e.target.value })} placeholder="e.g. on Perception checks" />
            </FormField>
          </Grid>
        </div>
        <button onClick={onRemove} style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', color: '#c0392b', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '14px', marginTop: '1.5rem' }}>×</button>
      </div>
    </div>
  );
}

// ── Legendary action entry ────────────────────────────────────────────────────
function LegendaryEntry({ action, onChange, onRemove }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <FormField label="Name *">
            <input value={action.name || ''} onChange={e => onChange({ ...action, name: e.target.value })} placeholder="Action name" />
          </FormField>
          <FormField label="Description *">
            <textarea value={action.description || ''} onChange={e => onChange({ ...action, description: e.target.value })} rows={2} />
          </FormField>
        </div>
        <button onClick={onRemove} style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', color: '#c0392b', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '14px', marginTop: '1.5rem' }}>×</button>
      </div>
    </div>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px dashed var(--border2)', background: 'transparent', color: 'var(--accent)', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      + {label}
    </button>
  );
}

export default function MonsterBuilder({ item, onSave, onClose }) {
  const [f, setF] = useState(item || {
    name: '',
    image: null,
    size: 'Medium',
    type: 'Humanoid',
    alignment: 'Unaligned',
    ac: 13,
    armorNotes: '',
    hpDieCount: 3,
    hpDie: 8,
    hpModifier: 0,
    speed: { walk: 30, fly: 0, swim: 0 },
    abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    savingThrows: {},       // { STR: modifier, ... } — empty = not proficient
    skills: {},             // { Perception: +5, ... }
    damageVulnerabilities: [], customDamageVulnerabilities: [],
    damageResistances: [],     customDamageResistances: [],
    damageImmunities: [],      customDamageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 0, truesight: 0, blindsight: 0, tremorsense: 0, other: '' },
    languages: [], customLanguages: [],
    cr: '1',
    traits: [],         // FeatureEntry[]
    actions: [],        // FeatureEntry[] with actionFields
    bonusActions: [],   // FeatureEntry[] with actionFields
    reactions: [],      // FeatureEntry[]
    passiveAbilities: [], // PassiveEntry[]
    legendaryActionsPerRound: 3,
    legendaryActions: [], // LegendaryEntry[]
    notes: '',
  });

  function set(key, val) { setF(x => ({ ...x, [key]: val })); }
  function setAbility(ab, val) { setF(x => ({ ...x, abilities: { ...x.abilities, [ab]: parseInt(val) || 10 } })); }
  function setSave(ab, val) {
    setF(x => {
      const saves = { ...x.savingThrows };
      if (val === '') { delete saves[ab]; } else { saves[ab] = parseInt(val) || 0; }
      return { ...x, savingThrows: saves };
    });
  }
  function setSkill(sk, val) {
    setF(x => {
      const skills = { ...x.skills };
      if (val === '') { delete skills[sk]; } else { skills[sk] = parseInt(val) || 0; }
      return { ...x, skills };
    });
  }
  function setSpeed(key, val) { setF(x => ({ ...x, speed: { ...x.speed, [key]: parseInt(val) || 0 } })); }
  function setSense(key, val) { setF(x => ({ ...x, senses: { ...x.senses, [key]: val } })); }

  function addToList(key, item) { setF(x => ({ ...x, [key]: [...x[key], item] })); }
  function updateInList(key, i, val) { setF(x => ({ ...x, [key]: x[key].map((it, j) => j === i ? val : it) })); }
  function removeFromList(key, i) { setF(x => ({ ...x, [key]: x[key].filter((_, j) => j !== i) })); }

  const hpAvg = Math.floor(f.hpDieCount * ((f.hpDie + 1) / 2)) + (f.hpModifier || 0);

  return (
    <div>
      {/* Basic Info */}
      <FormField label="Monster Name *">
        <input value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Shadow Drake" />
      </FormField>

      <Grid cols={3}>
        <FormField label="Size">
          <select value={f.size} onChange={e => set('size', e.target.value)}>
            {SIZES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Type">
          <select value={f.type} onChange={e => set('type', e.target.value)}>
            {MONSTER_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Alignment">
          <select value={f.alignment} onChange={e => set('alignment', e.target.value)}>
            {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </FormField>
      </Grid>

      {/* AC + HP */}
      <Grid cols={2}>
        <div>
          <FormField label="Armor Class">
            <input type="number" value={f.ac} onChange={e => set('ac', parseInt(e.target.value) || 10)} min={1} max={30} style={{ width: '80px' }} />
          </FormField>
          <FormField label="Armor Notes">
            <input value={f.armorNotes} onChange={e => set('armorNotes', e.target.value)} placeholder="e.g. natural armor, chain mail" />
          </FormField>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.4rem', fontFamily: "'Cinzel', serif" }}>Hit Points</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <select value={f.hpDieCount} onChange={e => set('hpDieCount', parseInt(e.target.value))} style={{ width: '70px' }}>
              {HP_DIE_COUNTS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>d</span>
            <select value={f.hpDie} onChange={e => set('hpDie', parseInt(e.target.value))} style={{ width: '70px' }}>
              {HP_DICE.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>+</span>
            <input type="number" value={f.hpModifier || 0} onChange={e => set('hpModifier', parseInt(e.target.value) || 0)} style={{ width: '70px' }} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
            Average: <strong style={{ color: 'var(--accent)' }}>{hpAvg}</strong> ({f.hpDieCount}d{f.hpDie}{f.hpModifier > 0 ? `+${f.hpModifier}` : f.hpModifier < 0 ? f.hpModifier : ''})
          </div>
        </div>
      </Grid>

      {/* Speed */}
      <Section title="Speed">
        <Grid cols={3}>
          <FormField label="Walking (ft)">
            <input type="number" value={f.speed.walk} onChange={e => setSpeed('walk', e.target.value)} min={0} step={5} />
          </FormField>
          <FormField label="Flying (ft)">
            <input type="number" value={f.speed.fly} onChange={e => setSpeed('fly', e.target.value)} min={0} step={5} />
          </FormField>
          <FormField label="Swimming (ft)">
            <input type="number" value={f.speed.swim} onChange={e => setSpeed('swim', e.target.value)} min={0} step={5} />
          </FormField>
        </Grid>
      </Section>

      {/* Ability Scores */}
      <Section title="Ability Scores">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {ABILITY_SCORES.map(ab => (
            <div key={ab} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', fontFamily: "'Cinzel', serif", marginBottom: '4px', letterSpacing: '0.06em' }}>{ab}</div>
              <input type="number" value={f.abilities[ab]} onChange={e => setAbility(ab, e.target.value)} min={1} max={30} style={{ textAlign: 'center', width: '100%' }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, marginTop: '2px', fontFamily: "'Cinzel', serif" }}>{mod(f.abilities[ab])}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Saving Throws */}
      <Section title="Saving Throws (leave blank if not proficient)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
          {ABILITY_SCORES.map(ab => (
            <div key={ab} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', fontFamily: "'Cinzel', serif", marginBottom: '4px' }}>{ab}</div>
              <input
                type="number"
                value={f.savingThrows[ab] !== undefined ? f.savingThrows[ab] : ''}
                onChange={e => setSave(ab, e.target.value)}
                placeholder="—"
                min={-5} max={20}
                style={{ textAlign: 'center', width: '100%' }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills (enter modifier, leave blank if none)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
          {SKILLS.map(sk => (
            <div key={sk} style={{ display: 'grid', gridTemplateColumns: '1fr 55px', gap: '0.3rem', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{sk}</div>
              <input
                type="number"
                value={f.skills[sk] !== undefined ? f.skills[sk] : ''}
                onChange={e => setSkill(sk, e.target.value)}
                placeholder="—"
                min={-10} max={20}
                style={{ textAlign: 'center' }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Damage */}
      <Section title="Damage & Condition">
        <Grid cols={2}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Vulnerabilities</div>
            <CheckboxList options={DAMAGE_TYPES} selected={f.damageVulnerabilities} onChange={v => set('damageVulnerabilities', v)} columns={2} />
            <TagList items={f.customDamageVulnerabilities} onRemove={i => set('customDamageVulnerabilities', f.customDamageVulnerabilities.filter((_, j) => j !== i))} color="var(--accent)" />
            <CustomAddInput placeholder="Custom…" onAdd={v => set('customDamageVulnerabilities', [...f.customDamageVulnerabilities, v])} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Resistances</div>
            <CheckboxList options={DAMAGE_TYPES} selected={f.damageResistances} onChange={v => set('damageResistances', v)} columns={2} />
            <TagList items={f.customDamageResistances} onRemove={i => set('customDamageResistances', f.customDamageResistances.filter((_, j) => j !== i))} color="var(--accent)" />
            <CustomAddInput placeholder="Custom…" onAdd={v => set('customDamageResistances', [...f.customDamageResistances, v])} />
          </div>
        </Grid>
        <Grid cols={2} style={{ marginTop: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Damage Immunities</div>
            <CheckboxList options={DAMAGE_TYPES} selected={f.damageImmunities} onChange={v => set('damageImmunities', v)} columns={2} />
            <TagList items={f.customDamageImmunities} onRemove={i => set('customDamageImmunities', f.customDamageImmunities.filter((_, j) => j !== i))} color="var(--accent)" />
            <CustomAddInput placeholder="Custom…" onAdd={v => set('customDamageImmunities', [...f.customDamageImmunities, v])} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" }}>Condition Immunities</div>
            <CheckboxList options={CONDITION_IMMUNITIES} selected={f.conditionImmunities} onChange={v => set('conditionImmunities', v)} columns={2} />
          </div>
        </Grid>
      </Section>

      {/* Senses */}
      <Section title="Senses">
        <Grid cols={3}>
          {SENSES.map(s => {
            const key = s.toLowerCase();
            return (
              <FormField key={s} label={`${s} (ft)`}>
                <input type="number" value={f.senses[key] || 0} onChange={e => setSense(key, parseInt(e.target.value) || 0)} min={0} step={10} />
              </FormField>
            );
          })}
          <FormField label="Other Senses">
            <input value={f.senses.other || ''} onChange={e => setSense('other', e.target.value)} placeholder="e.g. Detect magic 30 ft." />
          </FormField>
        </Grid>
      </Section>

      {/* Languages */}
      <Section title="Languages">
        <CheckboxList options={LANGUAGES} selected={f.languages} onChange={v => set('languages', v)} columns={4} />
        <TagList items={f.customLanguages} onRemove={i => set('customLanguages', f.customLanguages.filter((_, j) => j !== i))} color="var(--accent)" />
        <CustomAddInput placeholder="Add custom language…" onAdd={l => set('customLanguages', [...f.customLanguages, l])} />
      </Section>

      {/* Challenge Rating */}
      <FormField label="Challenge Rating">
        <select value={f.cr} onChange={e => set('cr', e.target.value)} style={{ width: '120px' }}>
          {CR_OPTIONS.map(cr => <option key={cr} value={cr}>CR {cr}</option>)}
        </select>
      </FormField>

      {/* Special Traits */}
      <Section title="Special Traits" action={<AddBtn onClick={() => addToList('traits', { name: '', description: '' })} label="Add Trait" />}>
        {f.traits.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>No traits added.</div>}
        {f.traits.map((t, i) => (
          <FeatureEntry key={i} feature={t} showActionFields={false}
            onChange={v => updateInList('traits', i, v)}
            onRemove={() => removeFromList('traits', i)}
          />
        ))}
      </Section>

      {/* Actions */}
      <Section title="Actions" action={<AddBtn onClick={() => addToList('actions', { name: '', description: '', actionType: 'Attack', range: '', save: '' })} label="Add Action" />}>
        {f.actions.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>No actions added.</div>}
        {f.actions.map((a, i) => (
          <FeatureEntry key={i} feature={a} showActionFields={true}
            onChange={v => updateInList('actions', i, v)}
            onRemove={() => removeFromList('actions', i)}
          />
        ))}
      </Section>

      {/* Bonus Actions */}
      <Section title="Bonus Actions" action={<AddBtn onClick={() => addToList('bonusActions', { name: '', description: '', actionType: 'Attack', range: '', save: '' })} label="Add Bonus Action" />}>
        {f.bonusActions.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>No bonus actions added.</div>}
        {f.bonusActions.map((a, i) => (
          <FeatureEntry key={i} feature={a} showActionFields={true}
            onChange={v => updateInList('bonusActions', i, v)}
            onRemove={() => removeFromList('bonusActions', i)}
          />
        ))}
      </Section>

      {/* Reactions */}
      <Section title="Reactions" action={<AddBtn onClick={() => addToList('reactions', { name: '', description: '' })} label="Add Reaction" />}>
        {f.reactions.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>No reactions added.</div>}
        {f.reactions.map((r, i) => (
          <FeatureEntry key={i} feature={r} showActionFields={false}
            onChange={v => updateInList('reactions', i, v)}
            onRemove={() => removeFromList('reactions', i)}
          />
        ))}
      </Section>

      {/* Passive Abilities */}
      <Section title="Passive Abilities" action={<AddBtn onClick={() => addToList('passiveAbilities', { type: 'Advantage', specifics: '' })} label="Add Passive" />}>
        {f.passiveAbilities.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>No passive abilities added.</div>}
        {f.passiveAbilities.map((p, i) => (
          <PassiveEntry key={i} passive={p}
            onChange={v => updateInList('passiveAbilities', i, v)}
            onRemove={() => removeFromList('passiveAbilities', i)}
          />
        ))}
      </Section>

      {/* Legendary Actions */}
      <Section title="Legendary Actions" action={<AddBtn onClick={() => addToList('legendaryActions', { name: '', description: '' })} label="Add Legendary Action" />}>
        {f.legendaryActions.length > 0 && (
          <FormField label="Actions per Round">
            <input type="number" value={f.legendaryActionsPerRound} onChange={e => set('legendaryActionsPerRound', parseInt(e.target.value) || 3)} min={1} max={10} style={{ width: '70px' }} />
          </FormField>
        )}
        {f.legendaryActions.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>No legendary actions added.</div>}
        {f.legendaryActions.map((a, i) => (
          <LegendaryEntry key={i} action={a}
            onChange={v => updateInList('legendaryActions', i, v)}
            onRemove={() => removeFromList('legendaryActions', i)}
          />
        ))}
      </Section>

      {/* Notes */}
      <FormField label="Notes">
        <textarea value={f.notes || ''} onChange={e => set('notes', e.target.value)} rows={3} placeholder="DM notes, lore, encounter ideas…" />
      </FormField>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => onSave(f)} disabled={!f.name}>Save Monster</Btn>
      </div>
    </div>
  );
}