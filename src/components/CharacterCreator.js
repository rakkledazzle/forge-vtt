import React, { useState } from 'react';
import { SRD_RACES, SRD_CLASSES, SRD_BACKGROUNDS, ALIGNMENTS, ABILITY_SCORES } from '../data/srd';
import { mod, modStr, profBonus, rollAbilityScore, classColor, hpAtLevel } from '../utils/dnd';

const STEPS = [
  { id: 'campaign',   label: 'Campaign',   icon: '📜' },
  { id: 'race',       label: 'Race',       icon: '🧬' },
  { id: 'class',      label: 'Class',      icon: '⚔️' },
  { id: 'background', label: 'Background', icon: '📖' },
  { id: 'abilities',  label: 'Abilities',  icon: '🎲' },
  { id: 'details',    label: 'Details',    icon: '📝' },
  { id: 'review',     label: 'Review',     icon: '✅' },
];

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// ── LIVE PREVIEW SIDEBAR ──────────────────────────────────────────────────────
function CharacterPreview({ char, selectedRace, selectedClass, selectedBackground }) {
  const pb = profBonus(char.level || 1);
  const hp = selectedClass ? hpAtLevel(selectedClass.hitDie, char.level || 1, mod(char.abilities?.Constitution || 10)) : '—';
  const ac = 10 + mod(char.abilities?.Dexterity || 10);
  const color = selectedClass ? classColor(selectedClass.name) : 'var(--accent)';

  return (
    <div className="creator-sidebar">
      <div className="creator-preview">
        <div className="creator-preview-banner" style={{ background: color }} />
        <div className="creator-preview-body">
          <div className="creator-preview-name">
            {char.name || <span style={{ color: 'var(--text3)', fontStyle: 'italic', fontSize: '14px' }}>Unnamed Hero</span>}
          </div>
          <div className="creator-preview-meta">
            {[
              selectedRace?.name,
              selectedClass ? `Lv ${char.level} ${selectedClass.name}` : null,
              selectedBackground?.name,
            ].filter(Boolean).join(' · ') || 'Choose your options to preview'}
          </div>

          {/* Tags */}
          {(selectedRace || selectedClass || selectedBackground) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
              {selectedRace && (
                <span className="creator-preview-tag" style={{ background: 'rgba(26,188,156,0.1)', color: '#0e8a6a', border: '1px solid rgba(26,188,156,0.25)' }}>
                  {selectedRace.name}
                </span>
              )}
              {selectedClass && (
                <span className="creator-preview-tag" style={{ background: 'rgba(41,128,185,0.1)', color: '#1a5080', border: '1px solid rgba(41,128,185,0.25)' }}>
                  {selectedClass.name}
                </span>
              )}
              {selectedBackground && (
                <span className="creator-preview-tag" style={{ background: 'rgba(154,111,40,0.1)', color: 'var(--gold)', border: '1px solid rgba(154,111,40,0.25)' }}>
                  {selectedBackground.name}
                </span>
              )}
              {char.alignment && (
                <span className="creator-preview-tag" style={{ background: 'var(--bg2)', color: 'var(--text3)', border: '1px solid var(--border)' }}>
                  {char.alignment}
                </span>
              )}
            </div>
          )}

          <div className="creator-preview-divider" />

          {/* Key stats */}
          <div className="creator-preview-stats">
            {[
              { label: 'HP', value: hp },
              { label: 'AC', value: ac },
              { label: 'Speed', value: `${char.speed || 30}ft` },
              { label: 'Prof', value: `+${pb}` },
              { label: 'Level', value: char.level || 1 },
              { label: 'Init', value: modStr(mod(char.abilities?.Dexterity || 10)) },
            ].map(s => (
              <div key={s.label} className="creator-preview-stat">
                <div className="creator-preview-stat-label">{s.label}</div>
                <div className="creator-preview-stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="creator-preview-divider" />

          {/* Ability scores */}
          <div className="creator-preview-abilities">
            {ABILITY_SCORES.map(ab => (
              <div key={ab} className="creator-preview-ab">
                <div className="creator-preview-ab-label">{ab.slice(0, 3)}</div>
                <div className="creator-preview-ab-val">{char.abilities?.[ab] || 10}</div>
                <div className="creator-preview-ab-mod">{modStr(mod(char.abilities?.[ab] || 10))}</div>
              </div>
            ))}
          </div>

          {/* Campaign */}
          {char.campaignName && (
            <>
              <div className="creator-preview-divider" />
              <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '400' }}>
                <span style={{ fontWeight: '700', color: 'var(--text2)' }}>Campaign:</span> {char.campaignName}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress checklist */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', marginTop: '14px' }}>
        <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '10px' }}>
          Progress
        </div>
        {STEPS.slice(0, -1).map(s => {
          const done =
            (s.id === 'campaign') ||
            (s.id === 'race' && char.race) ||
            (s.id === 'class' && char.class) ||
            (s.id === 'background' && char.background) ||
            (s.id === 'abilities' && Object.values(char.abilities || {}).some(v => v !== 10)) ||
            (s.id === 'details' && char.name);
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '12px', color: done ? '#1abc9c' : 'var(--text3)', fontWeight: done ? '600' : '400' }}>
              <span style={{ fontSize: '13px' }}>{done ? '✓' : '○'}</span>
              {s.label}
            </div>
          );
        })}
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
    const vals = {};
    ABILITY_SCORES.forEach((a, i) => { vals[a] = STANDARD_ARRAY[i]; });
    onChange(vals);
    setRollResults({});
  }

  const activeBtn = { background: 'var(--accent)', border: '1px solid var(--accent)', color: '#fff' };
  const inactiveBtn = { background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)' };

  return (
    <div>
      <div className="ability-method-btns">
        {[
          { id: 'standard', label: 'Standard Array' },
          { id: 'roll', label: '🎲 Roll 4d6' },
          { id: 'manual', label: 'Manual Entry' },
        ].map(m => (
          <button key={m.id} className="ability-method-btn"
            style={method === m.id ? activeBtn : inactiveBtn}
            onClick={() => { setMethod(m.id); if (m.id === 'standard') applyStandard(); if (m.id === 'roll') rollAll(); }}>
            {m.label}
          </button>
        ))}
        {method === 'roll' && (
          <button className="ability-method-btn" style={inactiveBtn} onClick={rollAll}>
            🔄 Reroll
          </button>
        )}
      </div>

      <div className="ability-score-grid">
        {ABILITY_SCORES.map(ab => (
          <div key={ab} className="ability-score-card">
            <div className="ability-score-label">{ab}</div>
            {method === 'manual' ? (
              <input type="number" min={1} max={30} value={abilities[ab] || 10}
                onChange={e => onChange({ ...abilities, [ab]: Number(e.target.value) })}
                style={{ width: '80px', textAlign: 'center', fontSize: '28px', fontFamily: "'Cinzel', serif", padding: '4px', margin: '4px 0' }} />
            ) : (
              <div className="ability-score-value">{abilities[ab] || 10}</div>
            )}
            <div className="ability-score-mod" style={{ color: mod(abilities[ab] || 10) >= 0 ? '#1abc9c' : '#e74c3c' }}>
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
export default function CharacterCreator({ onSave, onClose, character, homebrew, campaigns, user }) {
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
    campaignId: null, campaignName: '',
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
    onSave({
      ...char,
      maxHp: hp, currentHp: isEdit ? char.currentHp : hp,
      hp: { current: isEdit ? char.currentHp : hp, max: hp },
    });
  }

  const pb = profBonus(char.level || 1);

  // Nav buttons
  function NavButtons({ canNext = true, nextLabel = 'Next →' }) {
    return (
      <div className="creator-nav">
        <button onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
          style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '7px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)', transition: 'all 0.15s' }}>
          {step === 0 ? '✕ Cancel' : '← Back'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {step < STEPS.length - 1 && (
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
              Step {step + 1} of {STEPS.length}
            </span>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
              style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: '700', padding: '10px 24px', borderRadius: '7px', cursor: canNext ? 'pointer' : 'not-allowed', background: canNext ? 'var(--accent)' : 'var(--border)', border: 'none', color: '#fff', opacity: canNext ? 1 : 0.5, transition: 'all 0.15s', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {nextLabel}
            </button>
          ) : (
            <button onClick={handleSave} disabled={!char.name}
              style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: '700', padding: '10px 28px', borderRadius: '7px', cursor: char.name ? 'pointer' : 'not-allowed', background: char.name ? 'var(--accent)' : 'var(--border)', border: 'none', color: '#fff', opacity: char.name ? 1 : 0.5, transition: 'all 0.15s', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {isEdit ? '💾 Save Changes' : '⚔️ Create Character'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="creator-page">
      {/* Step nav bar */}
      <div className="creator-step-nav">
        <div className="creator-step-nav-inner">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.id} className={`creator-step ${active ? 'active' : ''} ${done ? 'complete' : ''}`}
                onClick={() => done && setStep(i)}>
                <div className="creator-step-num">{done ? '✓' : i + 1}</div>
                {s.icon} {s.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="creator-body">
        {/* Main content */}
        <div className="creator-main">

          {/* ── STEP 0: CAMPAIGN ── */}
          {step === 0 && (
            <div className="creator-step-content">
              <div className="creator-step-title">Select Campaign</div>
              <div className="creator-step-subtitle">
                Add this character to a campaign, or create them independently. Campaign selection determines which homebrew content is available.
              </div>

              {/* No campaign option */}
              <div className={`campaign-select-card ${!char.campaignId ? 'selected' : ''}`}
                onClick={() => setField('campaignId', null) || setField('campaignName', '')}>
                <div className="campaign-select-icon">🗡️</div>
                <div>
                  <div className="campaign-select-name">No Campaign</div>
                  <div className="campaign-select-meta">Create as a standalone character</div>
                </div>
                {!char.campaignId && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '18px' }}>✓</span>}
              </div>

              {campaigns?.length > 0 && (
                <>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text3)', margin: '16px 0 10px' }}>
                    My Campaigns
                  </div>
                  {campaigns.map(c => (
                    <div key={c.id} className={`campaign-select-card ${char.campaignId === c.id ? 'selected' : ''}`}
                      onClick={() => { setField('campaignId', c.id); setField('campaignName', c.name); }}>
                      <div className="campaign-select-icon">{c.owner_id === user?.id ? '👑' : '📜'}</div>
                      <div style={{ flex: 1 }}>
                        <div className="campaign-select-name">{c.name}</div>
                        <div className="campaign-select-meta">
                          {c.owner_id === user?.id ? 'DM' : 'Player'} · {c.setting || 'No setting'} · {(c.members || []).length} members
                        </div>
                      </div>
                      {char.campaignId === c.id && <span style={{ color: 'var(--accent)', fontSize: '18px' }}>✓</span>}
                    </div>
                  ))}
                </>
              )}

              {campaigns?.length === 0 && (
                <div style={{ padding: '16px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--text3)', marginTop: '12px' }}>
                  You're not in any campaigns yet. You can add this character to a campaign later.
                </div>
              )}

              <NavButtons />
            </div>
          )}

          {/* ── STEP 1: RACE ── */}
          {step === 1 && (
            <div className="creator-step-content">
              <div className="creator-step-title">Choose Your Race</div>
              <div className="creator-step-subtitle">Your race determines your innate abilities, speed, and racial traits.</div>

              <div className="creator-card-grid" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {allRaces.map(r => (
                  <div key={r.id} className={`creator-card ${char.race === r.id ? 'selected' : ''}`}
                    onClick={() => { setField('race', r.id); setField('subrace', ''); applyRaceBonuses(r, ''); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                      <div className="creator-card-title">{r.name}</div>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                        {r.source === 'Homebrew' && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', border: '1px solid rgba(142,68,173,0.3)', fontWeight: '700' }}>HB</span>}
                        {char.race === r.id && <span style={{ color: 'var(--accent)' }}>✓</span>}
                      </div>
                    </div>
                    <div className="creator-card-desc">{r.description?.slice(0, 85)}{r.description?.length > 85 ? '…' : ''}</div>
                    <div className="creator-card-stats">
                      {Object.entries(r.abilityBonuses || {}).map(([k, v]) => `${k.slice(0, 3)} +${v}`).join(' · ')}
                      {Object.keys(r.abilityBonuses || {}).length > 0 && ' · '}Spd {r.speed}ft
                    </div>
                  </div>
                ))}
              </div>

              {selectedRace?.subraces?.length > 0 && (
                <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', marginTop: '4px' }}>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '10px' }}>
                    Choose Subrace
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedRace.subraces.map(s => (
                      <button key={s.id} onClick={() => { setField('subrace', s.id); applyRaceBonuses(selectedRace, s.id); }}
                        style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', fontWeight: '600', padding: '7px 14px', borderRadius: '7px', cursor: 'pointer', border: `1px solid ${char.subrace === s.id ? 'var(--accent)' : 'var(--border2)'}`, background: char.subrace === s.id ? 'var(--accent)' : 'transparent', color: char.subrace === s.id ? '#fff' : 'var(--text2)', transition: 'all 0.15s' }}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <NavButtons canNext={!!char.race} />
            </div>
          )}

          {/* ── STEP 2: CLASS ── */}
          {step === 2 && (
            <div className="creator-step-content">
              <div className="creator-step-title">Choose Your Class</div>
              <div className="creator-step-subtitle">Your class defines your role, abilities, and playstyle throughout the adventure.</div>

              <div className="creator-card-grid" style={{ maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
                {allClasses.map(c => {
                  const color = classColor(c.name);
                  const sel = char.class === c.id;
                  return (
                    <div key={c.id} className={`creator-card ${sel ? 'selected' : ''}`}
                      style={{ borderColor: sel ? color : 'var(--border)', position: 'relative', overflow: 'hidden' }}
                      onClick={() => setField('class', c.id)}>
                      {sel && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div className="creator-card-title" style={{ color: sel ? color : 'var(--text)' }}>{c.name}</div>
                        {c.source === 'Homebrew' && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', border: '1px solid rgba(142,68,173,0.3)', fontWeight: '700' }}>HB</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '5px', fontWeight: '600' }}>d{c.hitDie} · {c.primaryAbility}</div>
                      <div className="creator-card-desc">{c.description?.slice(0, 75)}{c.description?.length > 75 ? '…' : ''}</div>
                    </div>
                  );
                })}
              </div>

              {selectedClass && (
                <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                      <label className="creator-label">Level</label>
                      <input type="number" min={1} max={20} value={char.level}
                        onChange={e => setField('level', Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                        style={{ width: '80px', textAlign: 'center', fontSize: '16px', fontFamily: "'Cinzel', serif" }} />
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text3)' }}>
                      HP: <strong style={{ color: 'var(--accent)', fontFamily: "'Cinzel', serif", fontSize: '16px' }}>{calcHP()}</strong>
                      {' · '}Prof Bonus: <strong style={{ color: 'var(--accent)' }}>+{pb}</strong>
                    </div>
                  </div>
                  {selectedClass.subclasses?.length > 0 && char.level >= (selectedClass.subclassLevel || 3) && (
                    <div>
                      <label className="creator-label">{selectedClass.subclassTitle || 'Subclass'}</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                        {selectedClass.subclasses.map(sc => (
                          <div key={sc.id} onClick={() => setField('subclass', sc.id)}
                            style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${char.subclass === sc.id ? 'var(--accent)' : 'var(--border)'}`, background: char.subclass === sc.id ? 'var(--bg2)' : 'var(--card)', fontFamily: "'Cinzel', serif", fontSize: '13px', color: char.subclass === sc.id ? 'var(--accent)' : 'var(--text2)', transition: 'all 0.15s' }}>
                            {sc.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <NavButtons canNext={!!char.class} />
            </div>
          )}

          {/* ── STEP 3: BACKGROUND ── */}
          {step === 3 && (
            <div className="creator-step-content">
              <div className="creator-step-title">Choose Your Background</div>
              <div className="creator-step-subtitle">Your background shapes your history, skills, and starting equipment.</div>
              <div className="creator-card-grid" style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                {allBackgrounds.map(b => (
                  <div key={b.id} className={`creator-card ${char.background === b.id ? 'selected' : ''}`}
                    onClick={() => setField('background', b.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div className="creator-card-title">{b.name}</div>
                      {b.source === 'Homebrew' && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', border: '1px solid rgba(142,68,173,0.3)', fontWeight: '700' }}>HB</span>}
                    </div>
                    <div className="creator-card-desc">{b.description?.slice(0, 80)}{b.description?.length > 80 ? '…' : ''}</div>
                    <div className="creator-card-stats">Skills: {b.skills?.slice(0, 2).join(', ')}</div>
                  </div>
                ))}
              </div>
              <NavButtons canNext={!!char.background} />
            </div>
          )}

          {/* ── STEP 4: ABILITIES ── */}
          {step === 4 && (
            <div className="creator-step-content">
              <div className="creator-step-title">Set Ability Scores</div>
              <div className="creator-step-subtitle">Choose how to generate your six core ability scores. Racial bonuses are already applied.</div>
              <AbilityRoller abilities={char.abilities} onChange={v => setField('abilities', v)} />
              {selectedRace && Object.keys(selectedRace.abilityBonuses || {}).length > 0 && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text2)' }}>
                  <strong style={{ color: 'var(--accent)' }}>Racial bonuses applied:</strong>{' '}
                  {Object.entries(selectedRace.abilityBonuses).map(([k, v]) => `${k.slice(0, 3)} +${v}`).join(', ')}
                </div>
              )}
              <NavButtons />
            </div>
          )}

          {/* ── STEP 5: DETAILS ── */}
          {step === 5 && (
            <div className="creator-step-content">
              <div className="creator-step-title">Character Details</div>
              <div className="creator-step-subtitle">Give your character a name, personality, and backstory.</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="creator-label">Character Name *</label>
                  <input value={char.name} onChange={e => setField('name', e.target.value)}
                    placeholder="Name your hero…" style={{ fontFamily: "'Cinzel', serif", fontSize: '16px' }} />
                </div>
                <div>
                  <label className="creator-label">Alignment</label>
                  <select value={char.alignment} onChange={e => setField('alignment', e.target.value)}>
                    {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="creator-label">Age</label>
                  <input value={char.age || ''} onChange={e => setField('age', e.target.value)} placeholder="Age" />
                </div>
                <div>
                  <label className="creator-label">Pronouns</label>
                  <input value={char.pronouns || ''} onChange={e => setField('pronouns', e.target.value)} placeholder="they/them" />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="creator-label">Appearance</label>
                <textarea value={char.appearance || ''} onChange={e => setField('appearance', e.target.value)} rows={2} placeholder="Physical description, distinctive features…" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="creator-label">Personality Traits</label>
                  <textarea value={char.personalityTraits || ''} onChange={e => setField('personalityTraits', e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="creator-label">Ideals</label>
                  <textarea value={char.ideals || ''} onChange={e => setField('ideals', e.target.value)} rows={3} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="creator-label">Bonds</label>
                  <textarea value={char.bonds || ''} onChange={e => setField('bonds', e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="creator-label">Flaws</label>
                  <textarea value={char.flaws || ''} onChange={e => setField('flaws', e.target.value)} rows={3} />
                </div>
              </div>

              <div>
                <label className="creator-label">Backstory</label>
                <textarea value={char.backstory || ''} onChange={e => setField('backstory', e.target.value)} rows={4} placeholder="Your character's history and motivations…" />
              </div>

              <NavButtons canNext={!!char.name} />
            </div>
          )}

          {/* ── STEP 6: REVIEW ── */}
          {step === 6 && (
            <div className="creator-step-content">
              <div className="creator-step-title">Review & Create</div>
              <div className="creator-step-subtitle">Everything look good? Click Create Character to finalize.</div>

              <div style={{ background: 'var(--card2)', border: '2px solid var(--accent)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '24px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>
                  {char.name || 'Unnamed Hero'}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {selectedRace && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(26,188,156,0.1)', color: '#0e8a6a', border: '1px solid rgba(26,188,156,0.25)', fontWeight: '700' }}>{selectedRace.name}</span>}
                  {selectedClass && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(41,128,185,0.1)', color: '#1a5080', border: '1px solid rgba(41,128,185,0.25)', fontWeight: '700' }}>Lv {char.level} {selectedClass.name}</span>}
                  {selectedBackground && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(154,111,40,0.1)', color: 'var(--gold)', border: '1px solid rgba(154,111,40,0.25)', fontWeight: '700' }}>{selectedBackground.name}</span>}
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'var(--bg2)', color: 'var(--text3)', border: '1px solid var(--border)', fontWeight: '600' }}>{char.alignment}</span>
                  {char.campaignName && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', border: '1px solid rgba(142,68,173,0.3)', fontWeight: '700' }}>📜 {char.campaignName}</span>}
                </div>

                {/* Ability scores grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  {ABILITY_SCORES.map(ab => (
                    <div key={ab} style={{ textAlign: 'center', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 4px' }}>
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', fontWeight: '700', color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: '3px' }}>{ab.slice(0, 3).toUpperCase()}</div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontWeight: '700', color: 'var(--text)', lineHeight: 1 }}>{char.abilities[ab] || 10}</div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: mod(char.abilities[ab] || 10) >= 0 ? '#1abc9c' : '#e74c3c' }}>{modStr(char.abilities[ab] || 10)}</div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Max HP', value: calcHP(), color: '#e74c3c' },
                    { label: 'Speed', value: `${char.speed || 30}ft`, color: 'var(--text2)' },
                    { label: 'Prof Bonus', value: `+${pb}`, color: 'var(--gold)' },
                    { label: 'Initiative', value: modStr(mod(char.abilities.Dexterity || 10)), color: '#1abc9c' },
                    { label: 'AC (base)', value: 10 + mod(char.abilities.Dexterity || 10), color: 'var(--text2)' },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 14px', textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', fontWeight: '700', color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: '3px' }}>{stat.label.toUpperCase()}</div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {!char.name && (
                <div style={{ padding: '10px 14px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', fontSize: '13px', color: '#c0392b', fontWeight: '600', marginBottom: '12px' }}>
                  ⚠️ Go back to Details and enter a character name first.
                </div>
              )}

              <NavButtons />
            </div>
          )}
        </div>

        {/* Live preview sidebar */}
        <CharacterPreview
          char={char}
          selectedRace={selectedRace}
          selectedClass={selectedClass}
          selectedBackground={selectedBackground}
        />
      </div>
    </div>
  );
}