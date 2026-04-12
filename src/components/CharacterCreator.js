import React, { useState } from 'react';
import { FormField, Grid, Badge, Section } from './UI';
import { SRD_RACES, SRD_CLASSES, SRD_BACKGROUNDS, ALIGNMENTS, ABILITY_SCORES } from '../data/srd';
import { mod, modStr, profBonus, rollAbilityScore, classColor, hpAtLevel } from '../utils/dnd';

const STEPS = [
  { id: 'race',       label: 'Race',       icon: '🧬' },
  { id: 'class',      label: 'Class',      icon: '⚔️' },
  { id: 'background', label: 'Background', icon: '📖' },
  { id: 'abilities',  label: 'Abilities',  icon: '🎲' },
  { id: 'details',    label: 'Details',    icon: '📝' },
  { id: 'review',     label: 'Review',     icon: '✅' },
];

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// ── STEP HEADER ───────────────────────────────────────────────────────────────
function StepHeader({ step, total, title, subtitle }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? 'var(--accent)' : 'var(--border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'var(--accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: '700',
          flexShrink: 0,
        }}>
          {step + 1}
        </div>
        <div>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px' }}>
            Step {step + 1} of {total}
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontWeight: '700', color: 'var(--accent)', lineHeight: 1 }}>
            {title}
          </div>
        </div>
      </div>
      {subtitle && (
        <div style={{ fontSize: '13px', color: 'var(--text3)', marginLeft: '44px', fontWeight: '400' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

// ── RACE CARD ─────────────────────────────────────────────────────────────────
function RaceCard({ race, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: selected ? 'rgba(var(--accent-rgb, 139,26,26), 0.05)' : 'var(--card)',
      border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: '10px', padding: '1rem', cursor: 'pointer',
      transition: 'all 0.18s',
      transform: selected ? 'translateY(-2px)' : 'none',
      boxShadow: selected ? '0 4px 16px var(--shadow)' : '0 1px 6px var(--shadow)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '15px', fontWeight: '700', color: selected ? 'var(--accent)' : 'var(--text)' }}>
          {race.name}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {race.source === 'Homebrew' && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', border: '1px solid rgba(142,68,173,0.3)', fontWeight: '700' }}>HB</span>}
          {selected && <span style={{ fontSize: '12px' }}>✓</span>}
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '0.6rem', lineHeight: 1.5, fontWeight: '400' }}>
        {race.description?.slice(0, 90)}{race.description?.length > 90 ? '…' : ''}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: '600' }}>
        {Object.entries(race.abilityBonuses || {}).map(([k, v]) => `${k.slice(0, 3)} +${v}`).join(' · ')}
        {Object.keys(race.abilityBonuses || {}).length > 0 && ' · '}
        Spd {race.speed}ft
        {race.darkvision && ' · Darkvision'}
      </div>
    </div>
  );
}

// ── CLASS CARD ────────────────────────────────────────────────────────────────
function ClassCard({ cls, selected, onClick }) {
  const color = classColor(cls.name);
  return (
    <div onClick={onClick} style={{
      background: 'var(--card)',
      border: `2px solid ${selected ? color : 'var(--border)'}`,
      borderRadius: '10px', padding: '1rem', cursor: 'pointer',
      transition: 'all 0.18s',
      transform: selected ? 'translateY(-2px)' : 'none',
      boxShadow: selected ? `0 4px 16px var(--shadow)` : '0 1px 6px var(--shadow)',
      position: 'relative', overflow: 'hidden',
    }}>
      {selected && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '15px', fontWeight: '700', color }}>
          {cls.name}
        </div>
        {cls.source === 'Homebrew' && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', border: '1px solid rgba(142,68,173,0.3)', fontWeight: '700' }}>HB</span>}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '0.5rem', fontWeight: '600' }}>
        Hit Die: d{cls.hitDie} · {cls.primaryAbility}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.5, fontWeight: '400' }}>
        {cls.description?.slice(0, 80)}{cls.description?.length > 80 ? '…' : ''}
      </div>
    </div>
  );
}

// ── ABILITY ROLLER ────────────────────────────────────────────────────────────
function AbilityRoller({ abilities, onChange }) {
  const [method, setMethod] = useState('standard');
  const [rollResults, setRollResults] = useState({});

  function rollAll() {
    const results = {};
    ABILITY_SCORES.forEach(a => { results[a] = rollAbilityScore(); });
    setRollResults(results);
    const vals = {};
    ABILITY_SCORES.forEach(a => { vals[a] = results[a].total; });
    onChange(vals);
  }

  function applyStandard() {
    const arr = [...STANDARD_ARRAY];
    const vals = {};
    ABILITY_SCORES.forEach((a, i) => { vals[a] = arr[i]; });
    onChange(vals);
    setRollResults({});
  }

  const methodBtnStyle = (m) => ({
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '12px', fontWeight: '700',
    padding: '8px 16px', borderRadius: '7px', cursor: 'pointer',
    border: `1px solid ${method === m ? 'var(--accent)' : 'var(--border2)'}`,
    background: method === m ? 'var(--accent)' : 'transparent',
    color: method === m ? '#fff' : 'var(--text2)',
    transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button style={methodBtnStyle('standard')} onClick={() => { setMethod('standard'); applyStandard(); }}>
          Standard Array
        </button>
        <button style={methodBtnStyle('roll')} onClick={() => { setMethod('roll'); rollAll(); }}>
          🎲 Roll 4d6
        </button>
        <button style={methodBtnStyle('manual')} onClick={() => setMethod('manual')}>
          Manual Entry
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {ABILITY_SCORES.map(ab => (
          <div key={ab} style={{
            background: 'var(--card2)',
            border: '1px solid var(--border)',
            borderRadius: '10px', padding: '1rem', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: '700', color: 'var(--text3)', letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>
              {ab.slice(0, 3)}
            </div>
            {method === 'manual' ? (
              <input type="number" min={1} max={30} value={abilities[ab] || 10}
                onChange={e => onChange({ ...abilities, [ab]: Number(e.target.value) })}
                style={{ width: '60px', textAlign: 'center', fontSize: '20px', padding: '4px', fontFamily: "'Cinzel', serif" }} />
            ) : (
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '28px', fontWeight: '700', color: 'var(--accent)', lineHeight: 1 }}>
                {abilities[ab] || 10}
              </div>
            )}
            <div style={{ fontSize: '14px', fontWeight: '700', color: mod(abilities[ab] || 10) >= 0 ? '#1abc9c' : '#e74c3c', marginTop: '4px' }}>
              {modStr(abilities[ab] || 10)}
            </div>
            {rollResults[ab] && (
              <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '4px' }}>
                [{rollResults[ab].rolls.join(', ')}] −{rollResults[ab].dropped}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN CREATOR ──────────────────────────────────────────────────────────────
export default function CharacterCreator({ onSave, onClose, character, homebrew }) {
  const isEdit = !!character?.id;
  const [step, setStep] = useState(0);
  const [char, setChar] = useState(character || {
    name: '', race: '', subrace: '', class: '', subclass: '',
    background: '', level: 1, alignment: 'True Neutral', xp: 0,
    abilities: { Strength: 10, Dexterity: 10, Constitution: 10, Intelligence: 10, Wisdom: 10, Charisma: 10 },
    proficiencies: [], languages: [], equipment: '',
    personalityTraits: '', ideals: '', bonds: '', flaws: '',
    backstory: '', appearance: '', notes: '',
    maxHp: 0, currentHp: 0, tempHp: 0,
    armorAC: 0, shieldEquipped: false, armorEquipped: 'none',
    speed: 30, inspiration: false,
  });

  const allRaces = [...SRD_RACES, ...(homebrew?.races || [])];
  const allClasses = [...SRD_CLASSES, ...(homebrew?.classes || [])];
  const allBackgrounds = [...SRD_BACKGROUNDS, ...(homebrew?.backgrounds || [])];

  const selectedRace = allRaces.find(r => r.id === char.race);
  const selectedClass = allClasses.find(c => c.id === char.class);
  const selectedBackground = allBackgrounds.find(b => b.id === char.background);

  function setField(k, v) { setChar(c => ({ ...c, [k]: v })); }

  function applyRaceBonuses(race, subraceId) {
    const bonuses = { ...(race.abilityBonuses || {}) };
    if (subraceId) {
      const sub = race.subraces?.find(s => s.id === subraceId);
      if (sub) Object.entries(sub.abilityBonuses || {}).forEach(([k, v]) => { bonuses[k] = (bonuses[k] || 0) + v; });
    }
    const newAbs = { ...char.abilities };
    Object.entries(bonuses).forEach(([k, v]) => { if (ABILITY_SCORES.includes(k)) newAbs[k] = (newAbs[k] || 10) + v; });
    setChar(c => ({ ...c, abilities: newAbs, speed: race.speed || 30 }));
  }

  function calcHP() {
    if (!selectedClass) return 0;
    return hpAtLevel(selectedClass.hitDie, char.level || 1, mod(char.abilities.Constitution || 10));
  }

  function handleSave() {
    const hp = calcHP();
    onSave({ ...char, maxHp: hp, currentHp: isEdit ? char.currentHp : hp, hp: { current: isEdit ? char.currentHp : hp, max: hp } });
  }

  const pb = profBonus(char.level || 1);

  // ── NAV BUTTONS ──
  const navStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: '2rem', paddingTop: '1.25rem',
    borderTop: '1px solid var(--border)',
  };

  const backBtn = (
    <button onClick={step === 0 ? onClose : () => setStep(s => s - 1)} style={{
      fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: '600',
      padding: '10px 20px', borderRadius: '7px', cursor: 'pointer',
      background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)',
      transition: 'all 0.15s',
    }}>
      {step === 0 ? 'Cancel' : '← Back'}
    </button>
  );

  const nextBtn = (
    <button onClick={() => setStep(s => s + 1)} style={{
      fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: '700',
      padding: '10px 24px', borderRadius: '7px', cursor: 'pointer',
      background: 'var(--accent)', border: 'none', color: '#fff',
      transition: 'all 0.15s', letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      Next →
    </button>
  );

  const saveBtn = (
    <button onClick={handleSave} disabled={!char.name} style={{
      fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: '700',
      padding: '10px 24px', borderRadius: '7px', cursor: char.name ? 'pointer' : 'not-allowed',
      background: char.name ? 'var(--accent)' : 'var(--border)', border: 'none',
      color: '#fff', transition: 'all 0.15s', letterSpacing: '0.04em', textTransform: 'uppercase',
      opacity: char.name ? 1 : 0.5,
    }}>
      {isEdit ? 'Save Changes' : 'Create Character'}
    </button>
  );

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>

      {/* ── STEP 0: RACE ── */}
      {step === 0 && (
        <div style={{ flex: 1 }}>
          <StepHeader step={0} total={6} title="Choose Your Race" subtitle="Your race determines your innate abilities, speed, and racial traits." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '1.25rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
            {allRaces.map(r => (
              <RaceCard key={r.id} race={r} selected={char.race === r.id}
                onClick={() => { setField('race', r.id); setField('subrace', ''); applyRaceBonuses(r, ''); }} />
            ))}
          </div>
          {selectedRace?.subraces?.length > 0 && (
            <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '10px' }}>
                Choose Subrace
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedRace.subraces.map(s => (
                  <button key={s.id} onClick={() => { setField('subrace', s.id); applyRaceBonuses(selectedRace, s.id); }} style={{
                    fontFamily: "'Roboto Mono', monospace", fontSize: '12px', fontWeight: '600',
                    padding: '7px 14px', borderRadius: '7px', cursor: 'pointer',
                    border: `1px solid ${char.subrace === s.id ? 'var(--accent)' : 'var(--border2)'}`,
                    background: char.subrace === s.id ? 'var(--accent)' : 'transparent',
                    color: char.subrace === s.id ? '#fff' : 'var(--text2)',
                  }}>{s.name}</button>
                ))}
              </div>
            </div>
          )}
          <div style={navStyle}>{backBtn}{nextBtn}</div>
        </div>
      )}

      {/* ── STEP 1: CLASS ── */}
      {step === 1 && (
        <div style={{ flex: 1 }}>
          <StepHeader step={1} total={6} title="Choose Your Class" subtitle="Your class defines your role, abilities, and playstyle." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '1.25rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
            {allClasses.map(c => (
              <ClassCard key={c.id} cls={c} selected={char.class === c.id} onClick={() => setField('class', c.id)} />
            ))}
          </div>
          {selectedClass && (
            <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '4px' }}>Level</div>
                  <input type="number" min={1} max={20} value={char.level}
                    onChange={e => setField('level', Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    style={{ width: '80px', textAlign: 'center', fontSize: '16px', fontFamily: "'Cinzel', serif" }} />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text3)', fontWeight: '400' }}>
                  HP at level {char.level}: <strong style={{ color: 'var(--accent)', fontFamily: "'Cinzel', serif" }}>{calcHP()}</strong>
                  {' · '}Proficiency: <strong style={{ color: 'var(--accent)' }}>+{pb}</strong>
                </div>
              </div>
              {selectedClass.subclasses?.length > 0 && char.level >= (selectedClass.subclassLevel || 3) && (
                <div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>
                    {selectedClass.subclassTitle || 'Subclass'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                    {selectedClass.subclasses.map(sc => (
                      <div key={sc.id} onClick={() => setField('subclass', sc.id)} style={{
                        padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                        border: `1px solid ${char.subclass === sc.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: char.subclass === sc.id ? 'rgba(var(--accent-rgb,139,26,26),0.08)' : 'var(--card)',
                        fontFamily: "'Cinzel', serif", fontSize: '13px',
                        color: char.subclass === sc.id ? 'var(--accent)' : 'var(--text2)',
                      }}>{sc.name}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={navStyle}>{backBtn}{nextBtn}</div>
        </div>
      )}

      {/* ── STEP 2: BACKGROUND ── */}
      {step === 2 && (
        <div style={{ flex: 1 }}>
          <StepHeader step={2} total={6} title="Choose Your Background" subtitle="Your background shapes your skills, languages, and starting equipment." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
            {allBackgrounds.map(b => (
              <div key={b.id} onClick={() => setField('background', b.id)} style={{
                background: 'var(--card)',
                border: `2px solid ${char.background === b.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '10px', padding: '1rem', cursor: 'pointer',
                transition: 'all 0.18s',
                transform: char.background === b.id ? 'translateY(-2px)' : 'none',
                boxShadow: char.background === b.id ? '0 4px 16px var(--shadow)' : '0 1px 6px var(--shadow)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '14px', fontWeight: '700', color: char.background === b.id ? 'var(--accent)' : 'var(--text)' }}>{b.name}</div>
                  {b.source === 'Homebrew' && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', border: '1px solid rgba(142,68,173,0.3)', fontWeight: '700' }}>HB</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '0.5rem', lineHeight: 1.5, fontWeight: '400' }}>
                  {b.description?.slice(0, 80)}{b.description?.length > 80 ? '…' : ''}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: '600' }}>
                  Skills: {b.skills?.slice(0, 3).join(', ')}
                </div>
              </div>
            ))}
          </div>
          <div style={navStyle}>{backBtn}{nextBtn}</div>
        </div>
      )}

      {/* ── STEP 3: ABILITIES ── */}
      {step === 3 && (
        <div style={{ flex: 1 }}>
          <StepHeader step={3} total={6} title="Set Ability Scores" subtitle="Choose how to generate your six core ability scores." />
          <AbilityRoller abilities={char.abilities} onChange={v => setField('abilities', v)} />
          {selectedRace && Object.keys(selectedRace.abilityBonuses || {}).length > 0 && (
            <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text2)' }}>
              <strong style={{ color: 'var(--accent)' }}>Racial bonuses already applied:</strong>{' '}
              {Object.entries(selectedRace.abilityBonuses).map(([k, v]) => `${k.slice(0, 3)} +${v}`).join(', ')}
            </div>
          )}
          <div style={navStyle}>{backBtn}{nextBtn}</div>
        </div>
      )}

      {/* ── STEP 4: DETAILS ── */}
      {step === 4 && (
        <div style={{ flex: 1 }}>
          <StepHeader step={4} total={6} title="Character Details" subtitle="Give your character a name, personality, and backstory." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>
                Character Name *
              </label>
              <input value={char.name} onChange={e => setField('name', e.target.value)} placeholder="Name your hero…"
                style={{ fontFamily: "'Cinzel', serif", fontSize: '16px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>
                Alignment
              </label>
              <select value={char.alignment} onChange={e => setField('alignment', e.target.value)}>
                {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Age</label>
              <input value={char.age || ''} onChange={e => setField('age', e.target.value)} placeholder="Age" />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Pronouns</label>
              <input value={char.pronouns || ''} onChange={e => setField('pronouns', e.target.value)} placeholder="they/them" />
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Appearance</label>
            <textarea value={char.appearance || ''} onChange={e => setField('appearance', e.target.value)} rows={2} placeholder="Physical description, distinctive features…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Personality Traits</label>
              <textarea value={char.personalityTraits || ''} onChange={e => setField('personalityTraits', e.target.value)} rows={3} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Ideals</label>
              <textarea value={char.ideals || ''} onChange={e => setField('ideals', e.target.value)} rows={3} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Bonds</label>
              <textarea value={char.bonds || ''} onChange={e => setField('bonds', e.target.value)} rows={3} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Flaws</label>
              <textarea value={char.flaws || ''} onChange={e => setField('flaws', e.target.value)} rows={3} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '6px' }}>Backstory</label>
            <textarea value={char.backstory || ''} onChange={e => setField('backstory', e.target.value)} rows={4} placeholder="Your character's history and motivations…" />
          </div>
          <div style={navStyle}>{backBtn}{nextBtn}</div>
        </div>
      )}

      {/* ── STEP 5: REVIEW ── */}
      {step === 5 && (
        <div style={{ flex: 1 }}>
          <StepHeader step={5} total={6} title="Review & Create" subtitle="Check your character before finalizing." />

          {/* Summary card */}
          <div style={{ background: 'var(--card2)', border: '2px solid var(--accent)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '22px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>
              {char.name || 'Unnamed Hero'}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {selectedRace && (
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(26,188,156,0.1)', color: '#0e8a6a', border: '1px solid rgba(26,188,156,0.25)', fontWeight: '700' }}>
                  {selectedRace.name}
                </span>
              )}
              {selectedClass && (
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(41,128,185,0.1)', color: '#1a5080', border: '1px solid rgba(41,128,185,0.25)', fontWeight: '700' }}>
                  Lv {char.level} {selectedClass.name}
                </span>
              )}
              {selectedBackground && (
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(154,111,40,0.1)', color: 'var(--gold)', border: '1px solid rgba(154,111,40,0.25)', fontWeight: '700' }}>
                  {selectedBackground.name}
                </span>
              )}
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'var(--bg2)', color: 'var(--text3)', border: '1px solid var(--border)', fontWeight: '600' }}>
                {char.alignment}
              </span>
            </div>

            {/* Ability scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '1rem' }}>
              {ABILITY_SCORES.map(ab => (
                <div key={ab} style={{ textAlign: 'center', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 4px' }}>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', fontWeight: '700', color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: '3px' }}>{ab.slice(0, 3).toUpperCase()}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: '700', color: 'var(--text)', lineHeight: 1 }}>{char.abilities[ab] || 10}</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: mod(char.abilities[ab] || 10) >= 0 ? '#1abc9c' : '#e74c3c' }}>{modStr(char.abilities[ab] || 10)}</div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: 'HP', value: calcHP(), color: '#e74c3c' },
                { label: 'Speed', value: `${char.speed || 30}ft`, color: 'var(--text2)' },
                { label: 'Prof Bonus', value: `+${pb}`, color: 'var(--gold)' },
                { label: 'Initiative', value: modStr(mod(char.abilities.Dexterity || 10)), color: '#1abc9c' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 14px', textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', fontWeight: '700', color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: '3px' }}>{stat.label.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {!char.name && (
            <div style={{ padding: '10px 14px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', fontSize: '13px', color: '#c0392b', fontWeight: '600', marginBottom: '1rem' }}>
              ⚠️ Please go back to Details and enter a character name before creating.
            </div>
          )}

          <div style={navStyle}>{backBtn}{saveBtn}</div>
        </div>
      )}
    </div>
  );
}