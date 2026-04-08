import React, { useState } from 'react';
import { Btn, Card, Modal, FormField, Grid, StatBox, Badge, Section, NumberInput } from './UI';
import { SRD_RACES, SRD_CLASSES, SRD_BACKGROUNDS, ALIGNMENTS, SKILLS, ABILITY_SCORES } from '../data/srd';
import { mod, modStr, profBonus, rollAbilityScore, classColor, hpAtLevel } from '../utils/dnd';

const STEPS = ['Race','Class','Background','Abilities','Details','Review'];
const STANDARD_ARRAY = [15,14,13,12,10,8];

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
  }

  return (
    <div>
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
        {['standard','roll','manual'].map(m => (
          <Btn key={m} variant={method===m?'primary':'ghost'} size='sm' onClick={() => { setMethod(m); if(m==='standard')applyStandard(); if(m==='roll')rollAll(); }}>
            {m==='standard'?'Standard Array':m==='roll'?'Roll 4d6dl':'Manual'}
          </Btn>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem' }}>
        {ABILITY_SCORES.map(ab => (
          <div key={ab} style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'0.75rem', textAlign:'center' }}>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:'0.4rem', fontFamily:"'Cinzel',serif" }}>{ab.slice(0,3).toUpperCase()}</div>
            {method === 'manual' ? (
              <input type='number' min={1} max={30} value={abilities[ab]||10}
                onChange={e => onChange({ ...abilities, [ab]: Number(e.target.value) })}
                style={{ width:'60px', textAlign:'center', fontSize:'1.3rem', padding:'0.2rem' }} />
            ) : (
              <div style={{ fontSize:'1.8rem', fontFamily:"'Cinzel',serif", color:'var(--gold)' }}>{abilities[ab]||10}</div>
            )}
            <div style={{ fontSize:'0.85rem', color: mod(abilities[ab]||10)>=0?'var(--emerald)':'var(--crimson-light)' }}>{modStr(abilities[ab]||10)}</div>
            {rollResults[ab] && (
              <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>
                [{rollResults[ab].rolls.join(', ')}] drop {rollResults[ab].dropped}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CharacterCreator({ onSave, onClose, character, homebrew }) {
  const isEdit = !!character?.id;
  const [step, setStep] = useState(0);
  const [char, setChar] = useState(character || {
    name:'', race:'', subrace:'', class:'', subclass:'', background:'',
    level:1, alignment:'True Neutral', xp:0,
    abilities:{ Strength:10,Dexterity:10,Constitution:10,Intelligence:10,Wisdom:10,Charisma:10 },
    proficiencies:[], languages:[], equipment:'',
    personalityTraits:'', ideals:'', bonds:'', flaws:'',
    backstory:'', appearance:'', notes:'',
    maxHp:0, currentHp:0, tempHp:0,
    armorAC:0, shieldEquipped:false, armorEquipped:'none',
    speed:30, inspiration:false,
  });

  const allRaces = [...SRD_RACES, ...(homebrew?.races||[])];
  const allClasses = [...SRD_CLASSES, ...(homebrew?.classes||[])];
  const allBackgrounds = [...SRD_BACKGROUNDS, ...(homebrew?.backgrounds||[])];

  const selectedRace = allRaces.find(r => r.id === char.race);
  const selectedClass = allClasses.find(c => c.id === char.class);
  const selectedBackground = allBackgrounds.find(b => b.id === char.background);

  function setField(k, v) { setChar(c => ({ ...c, [k]: v })); }

  function applyRaceBonuses(race, subraceId) {
    const bonuses = { ...(race.abilityBonuses||{}) };
    if (subraceId) {
      const sub = race.subraces?.find(s => s.id === subraceId);
      if (sub) Object.entries(sub.abilityBonuses||{}).forEach(([k,v]) => { bonuses[k] = (bonuses[k]||0)+v; });
    }
    const newAbs = { ...char.abilities };
    Object.entries(bonuses).forEach(([k,v]) => { if(ABILITY_SCORES.includes(k)) newAbs[k] = (newAbs[k]||10)+v; });
    setChar(c => ({ ...c, abilities:newAbs, speed:race.speed||30 }));
  }

  function calcHP() {
    const cls = selectedClass;
    if (!cls) return 0;
    const conMod = mod(char.abilities.Constitution||10);
    return hpAtLevel(cls.hitDie, char.level||1, conMod);
  }

  function handleSave() {
    const hp = calcHP();
    onSave({ ...char, maxHp:hp, currentHp:isEdit?char.currentHp:hp });
  }

  const pb = profBonus(char.level||1);

  return (
    <div style={{ maxWidth:'700px', margin:'0 auto' }}>
      {/* Progress */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {STEPS.map((s,i) => (
          <button key={s} onClick={() => setStep(i)}
            style={{ padding:'0.4rem 0.9rem', borderRadius:'20px', fontSize:'0.78rem',
              fontFamily:"'Cinzel',serif", border:'none',
              background: i===step?'var(--gold)':i<step?'var(--bg-raised)':'transparent',
              color: i===step?'#0a0a0f':i<step?'var(--gold)':'var(--text-muted)',
              borderColor: i<step?'var(--gold-dark)':'transparent',
              borderWidth:'1px', borderStyle:'solid',
              cursor:'pointer' }}>
            {i < step && '✓ '}{s}
          </button>
        ))}
      </div>

      {/* Step 0: Race */}
      {step===0 && (
        <div className="animate-in">
          <h3 style={{ color:'var(--gold)', marginBottom:'1rem' }}>Choose Your Race</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.75rem', marginBottom:'1rem' }}>
            {allRaces.map(r => (
              <Card key={r.id} onClick={() => { setField('race',r.id); setField('subrace',''); applyRaceBonuses(r,''); }}
                style={{ padding:'0.85rem', border:`2px solid ${char.race===r.id?'var(--gold)':'var(--border)'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
                  <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.9rem' }}>{r.name}</strong>
                  {r.source==='Homebrew' && <Badge color='violet'>HB</Badge>}
                </div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.5rem', lineHeight:1.4 }}>{r.description?.slice(0,80)}…</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>
                  {Object.entries(r.abilityBonuses||{}).map(([k,v]) => `${k.slice(0,3)} +${v}`).join(', ')} · Spd {r.speed}
                </div>
              </Card>
            ))}
          </div>
          {selectedRace?.subraces?.length > 0 && (
            <Section title="Subrace">
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                {selectedRace.subraces.map(s => (
                  <Btn key={s.id} variant={char.subrace===s.id?'primary':'ghost'} onClick={() => { setField('subrace',s.id); applyRaceBonuses(selectedRace,s.id); }}>{s.name}</Btn>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* Step 1: Class */}
      {step===1 && (
        <div className="animate-in">
          <h3 style={{ color:'var(--gold)', marginBottom:'1rem' }}>Choose Your Class</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.75rem', marginBottom:'1rem' }}>
            {allClasses.map(c => (
              <Card key={c.id} onClick={() => setField('class',c.id)}
                style={{ padding:'0.85rem', border:`2px solid ${char.class===c.id?classColor(c.name):'var(--border)'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.3rem' }}>
                  <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.9rem', color:classColor(c.name) }}>{c.name}</strong>
                  {c.source==='Homebrew' && <Badge color='violet'>HB</Badge>}
                </div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-secondary)', marginBottom:'0.4rem' }}>Hit Die: d{c.hitDie} · {c.primaryAbility}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', lineHeight:1.4 }}>{c.description?.slice(0,80)}…</div>
              </Card>
            ))}
          </div>
          {selectedClass && (
            <div style={{ marginTop:'1rem' }}>
              <FormField label="Level">
                <input type='number' min={1} max={20} value={char.level} onChange={e => setField('level',Math.max(1,Math.min(20,parseInt(e.target.value)||1)))} style={{ width:'100px' }} />
              </FormField>
              {selectedClass.subclasses?.length > 0 && char.level >= selectedClass.subclassLevel && (
                <Section title={selectedClass.subclassTitle}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'0.5rem' }}>
                    {selectedClass.subclasses.map(sc => (
                      <Card key={sc.id} onClick={() => setField('subclass',sc.id)}
                        style={{ padding:'0.65rem', border:`2px solid ${char.subclass===sc.id?'var(--gold)':'var(--border)'}` }}>
                        <div style={{ fontSize:'0.85rem', fontFamily:"'Cinzel',serif" }}>{sc.name}</div>
                      </Card>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Background */}
      {step===2 && (
        <div className="animate-in">
          <h3 style={{ color:'var(--gold)', marginBottom:'1rem' }}>Choose Your Background</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.75rem' }}>
            {allBackgrounds.map(b => (
              <Card key={b.id} onClick={() => setField('background',b.id)}
                style={{ padding:'0.85rem', border:`2px solid ${char.background===b.id?'var(--gold)':'var(--border)'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.3rem' }}>
                  <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.9rem' }}>{b.name}</strong>
                  {b.source==='Homebrew' && <Badge color='violet'>HB</Badge>}
                </div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.5rem', lineHeight:1.4 }}>{b.description?.slice(0,80)}…</div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-secondary)' }}>Skills: {b.skills?.join(', ')}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Abilities */}
      {step===3 && (
        <div className="animate-in">
          <h3 style={{ color:'var(--gold)', marginBottom:'1rem' }}>Set Ability Scores</h3>
          <AbilityRoller abilities={char.abilities} onChange={v => setField('abilities',v)} />
          <div style={{ marginTop:'1rem', padding:'0.75rem', background:'var(--bg-raised)', borderRadius:'var(--radius-sm)', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
            <strong style={{ color:'var(--gold)' }}>Proficiency Bonus:</strong> +{pb} · <strong style={{ color:'var(--gold)' }}>Passive Perception:</strong> {10+mod(char.abilities.Wisdom||10)+pb}
            {selectedRace && Object.keys(selectedRace.abilityBonuses||{}).length > 0 && (
              <span style={{ marginLeft:'1rem' }}><strong style={{ color:'var(--gold)' }}>Racial Bonuses:</strong> {Object.entries(selectedRace.abilityBonuses).map(([k,v])=>`${k.slice(0,3)} +${v}`).join(', ')}</span>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Details */}
      {step===4 && (
        <div className="animate-in">
          <h3 style={{ color:'var(--gold)', marginBottom:'1rem' }}>Character Details</h3>
          <Grid cols={2}>
            <FormField label="Character Name">
              <input value={char.name} onChange={e => setField('name',e.target.value)} placeholder="Name your hero…" />
            </FormField>
            <FormField label="Alignment">
              <select value={char.alignment} onChange={e => setField('alignment',e.target.value)}>
                {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </FormField>
          </Grid>
          <Grid cols={2}>
            <FormField label="Age"><input value={char.age||''} onChange={e => setField('age',e.target.value)} placeholder="Age" /></FormField>
            <FormField label="Pronouns"><input value={char.pronouns||''} onChange={e => setField('pronouns',e.target.value)} placeholder="they/them" /></FormField>
          </Grid>
          <FormField label="Appearance">
            <textarea value={char.appearance||''} onChange={e => setField('appearance',e.target.value)} rows={2} placeholder="Physical description, distinctive features…" />
          </FormField>
          <Grid cols={2}>
            <FormField label="Personality Traits">
              <textarea value={char.personalityTraits||''} onChange={e => setField('personalityTraits',e.target.value)} rows={3} />
            </FormField>
            <FormField label="Ideals">
              <textarea value={char.ideals||''} onChange={e => setField('ideals',e.target.value)} rows={3} />
            </FormField>
          </Grid>
          <Grid cols={2}>
            <FormField label="Bonds">
              <textarea value={char.bonds||''} onChange={e => setField('bonds',e.target.value)} rows={3} />
            </FormField>
            <FormField label="Flaws">
              <textarea value={char.flaws||''} onChange={e => setField('flaws',e.target.value)} rows={3} />
            </FormField>
          </Grid>
          <FormField label="Backstory">
            <textarea value={char.backstory||''} onChange={e => setField('backstory',e.target.value)} rows={4} placeholder="Your character's history and motivations…" />
          </FormField>
        </div>
      )}

      {/* Step 5: Review */}
      {step===5 && (
        <div className="animate-in">
          <h3 style={{ color:'var(--gold)', marginBottom:'1rem' }}>Review Character</h3>
          <Card style={{ marginBottom:'1rem', borderColor:'var(--border-bright)' }}>
            <h2 style={{ color:'var(--gold-light)', marginBottom:'0.5rem' }}>{char.name||'Unnamed Hero'}</h2>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1rem' }}>
              {selectedRace && <Badge color='emerald'>{selectedRace.name}{char.subrace?' ('+selectedRace.subraces?.find(s=>s.id===char.subrace)?.name+')':''}</Badge>}
              {selectedClass && <Badge color='sapphire'>Lvl {char.level} {selectedClass.name}</Badge>}
              {selectedBackground && <Badge color='gold'>{selectedBackground.name}</Badge>}
              <Badge color='muted'>{char.alignment}</Badge>
            </div>
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1rem' }}>
              {ABILITY_SCORES.map(ab => (
                <StatBox key={ab} label={ab.slice(0,3)} value={char.abilities[ab]||10} sub={modStr(char.abilities[ab]||10)} />
              ))}
            </div>
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              <StatBox label="HP" value={calcHP()} color='var(--crimson-light)' />
              <StatBox label="AC" value="10+" color='var(--sapphire)' />
              <StatBox label="Speed" value={`${char.speed||30}ft`} />
              <StatBox label="Prof Bonus" value={`+${pb}`} color='var(--gold)' />
            </div>
          </Card>
          {selectedClass?.features?.[1] && (
            <Section title={`Level 1 Features`}>
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                {selectedClass.features[1].map(f => <Badge key={f} color='gold'>{f}</Badge>)}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'2rem', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
        <Btn variant='ghost' onClick={step===0?onClose:()=>setStep(s=>s-1)}>{step===0?'Cancel':'← Back'}</Btn>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          {step===5 ? (
            <Btn variant='primary' onClick={handleSave} disabled={!char.name}>
              {isEdit?'Save Changes':'Create Character'}
            </Btn>
          ) : (
            <Btn variant='primary' onClick={() => setStep(s=>s+1)}>Next →</Btn>
          )}
        </div>
      </div>
    </div>
  );
}
