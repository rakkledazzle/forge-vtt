import React, { useState } from 'react';
import { Card, Btn, Badge, StatBox, Section, HPBar, NumberInput, ConditionBadge, Tabs, DiceRoller, FormField } from './UI';
import { SRD_RACES, SRD_CLASSES, SRD_BACKGROUNDS, SKILLS } from '../data/srd';
import { mod, modStr, profBonus, classColor } from '../utils/dnd';
import { ABILITY_SCORES } from '../utils/dnd';

const CONDITIONS = ['Blinded','Charmed','Deafened','Exhaustion','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious'];

export default function CharacterSheet({ character, onUpdate, onEdit, onDelete }) {
  const [tab, setTab] = useState('stats');
  const [showDice, setShowDice] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);

  const c = character;
  const pb = profBonus(c.level||1);
  const allClasses = SRD_CLASSES;
  const cls = allClasses.find(cl => cl.id === c.class);
  const race = SRD_RACES.find(r => r.id === c.race);

  function update(changes) { onUpdate({ ...c, ...changes }); }

  function toggleCondition(cond) {
    const current = c.conditions||[];
    update({ conditions: current.includes(cond) ? current.filter(x=>x!==cond) : [...current,cond] });
  }

  function skillProf(skill) { return (c.skillProficiencies||[]).includes(skill.name); }
  function skillExpert(skill) { return (c.skillExpertise||[]).includes(skill.name); }

  function skillMod(skill) {
    const baseMod = mod(c.abilities?.[skill.ability]||10);
    const prof = skillProf(skill) ? pb : 0;
    const expert = skillExpert(skill) ? pb : 0;
    return baseMod + prof + expert;
  }

  function saveMod(ability) {
    const baseMod = mod(c.abilities?.[ability]||10);
    const hasSave = (c.savingThrowProficiencies||cls?.savingThrows||[]).includes(ability);
    return baseMod + (hasSave ? pb : 0);
  }

  function rollCheck(label, bonus) {
    const roll = Math.floor(Math.random()*20)+1;
    const total = roll + bonus;
    setLastRoll({ label, roll, bonus, total, critical: roll===20, fail: roll===1 });
  }

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      {/* Header */}
      <Card style={{ marginBottom:'1rem', background:'linear-gradient(135deg,var(--bg-card),var(--bg-raised))' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h2 style={{ color:'var(--gold-light)', marginBottom:'0.3rem' }}>{c.name}</h2>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.5rem' }}>
              {race && <Badge color='emerald'>{race.name}</Badge>}
              {cls && <Badge color='sapphire' style={{ color:classColor(cls.name) }}>Lvl {c.level} {cls.name}</Badge>}
              {c.background && <Badge color='gold'>{SRD_BACKGROUNDS.find(b=>b.id===c.background)?.name||c.background}</Badge>}
              <Badge color='muted'>{c.alignment}</Badge>
              {c.pronouns && <Badge color='muted'>{c.pronouns}</Badge>}
            </div>
            <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
              Prof Bonus: <strong style={{ color:'var(--gold)' }}>+{pb}</strong>
              {' · '}Passive Perception: <strong style={{ color:'var(--gold)' }}>{10+skillMod({name:'Perception',ability:'Wisdom'})}</strong>
              {c.inspiration && <span style={{ color:'#ffd700', marginLeft:'0.75rem' }}>✨ Inspired</span>}
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            <Btn variant='ghost' size='sm' onClick={() => update({ inspiration:!c.inspiration })}>
              {c.inspiration?'★':'☆'} Inspiration
            </Btn>
            <Btn variant='ghost' size='sm' onClick={() => setShowDice(s=>!s)}>🎲 Dice</Btn>
            <Btn variant='ghost' size='sm' onClick={onEdit}>Edit</Btn>
            <Btn variant='danger' size='sm' onClick={onDelete}>Delete</Btn>
          </div>
        </div>

        {/* HP Section */}
        <div style={{ marginTop:'1rem', display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ flex:1, minWidth:'220px' }}>
            <HPBar current={c.currentHp||0} max={c.maxHp||0} temp={c.tempHp||0} />
            <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem', flexWrap:'wrap' }}>
              <Btn size='sm' variant='success' onClick={() => update({ currentHp:Math.min(c.maxHp, (c.currentHp||0)+1) })}>+1 HP</Btn>
              <Btn size='sm' variant='danger' onClick={() => update({ currentHp:Math.max(0, (c.currentHp||0)-1) })}>-1 HP</Btn>
              <input type="number" placeholder="+/- HP" style={{ width:'80px' }} id={`hpinput_${c.id}`} />
              <Btn size='sm' variant='dark' onClick={() => {
                const v = parseInt(document.getElementById(`hpinput_${c.id}`)?.value||'0');
                update({ currentHp:Math.max(0,Math.min(c.maxHp,(c.currentHp||0)+v)) });
              }}>Apply</Btn>
              <Btn size='sm' variant='primary' onClick={() => update({ currentHp:c.maxHp })}>Full Rest</Btn>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
            <StatBox label="AC" value={c.ac||10} color='var(--sapphire)' />
            <StatBox label="Initiative" value={modStr(c.abilities?.Dexterity||10)} color='var(--gold)' />
            <StatBox label="Speed" value={`${c.speed||30}`} sub="ft" />
            {cls && <StatBox label="Hit Die" value={`d${cls.hitDie}`} />}
          </div>
        </div>

        {/* Conditions */}
        {(c.conditions||[]).length > 0 && (
          <div style={{ marginTop:'0.75rem' }}>
            {(c.conditions||[]).map(cond => (
              <ConditionBadge key={cond} condition={cond} onRemove={() => toggleCondition(cond)} />
            ))}
          </div>
        )}
      </Card>

      {/* Dice roller popup */}
      {showDice && (
        <Card style={{ marginBottom:'1rem' }}>
          <DiceRoller onRoll={(v,s) => setLastRoll({ label:`d${s}`, roll:v, total:v, critical:v===s&&s===20, fail:v===1&&s===20 })} />
          {lastRoll && (
            <div style={{ marginTop:'0.75rem', padding:'0.75rem', background:'var(--bg-raised)', borderRadius:'var(--radius-sm)', textAlign:'center' }}>
              <span style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>{lastRoll.label}: </span>
              <span style={{ fontSize:'1.6rem', fontFamily:"'Cinzel',serif", color: lastRoll.critical?'#ffd700':lastRoll.fail?'var(--crimson-light)':'var(--gold)' }}>{lastRoll.total}</span>
              {lastRoll.bonus!==undefined && lastRoll.bonus!==0 && <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}> (roll:{lastRoll.roll} + {lastRoll.bonus})</span>}
              {lastRoll.critical && <span style={{ color:'#ffd700' }}> ✨ CRIT!</span>}
              {lastRoll.fail && lastRoll.roll===1 && <span style={{ color:'var(--crimson-light)' }}> 💀 CRIT FAIL!</span>}
            </div>
          )}
        </Card>
      )}

      <Tabs tabs={[{id:'stats',label:'Stats'},{id:'skills',label:'Skills'},{id:'features',label:'Features'},{id:'notes',label:'Notes & Story'}]} active={tab} onChange={setTab} />

      {/* Stats Tab */}
      {tab==='stats' && (
        <div className="animate-in">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'0.75rem', marginBottom:'2rem' }}>
            {ABILITY_SCORES.map(ab => {
              const score = c.abilities?.[ab]||10;
              const m = mod(score);
              return (
                <div key={ab} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem', textAlign:'center', cursor:'pointer' }}
                  onClick={() => rollCheck(ab.slice(0,3)+' Check', m)}>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:'0.5rem', fontFamily:"'Cinzel',serif" }}>{ab.toUpperCase()}</div>
                  <div style={{ fontSize:'2.2rem', fontFamily:"'Cinzel',serif", color:'var(--text-primary)', lineHeight:1 }}>{score}</div>
                  <div style={{ fontSize:'1rem', fontFamily:"'Cinzel',serif", color:m>=0?'var(--emerald)':'var(--crimson-light)', marginTop:'0.2rem' }}>
                    {m>=0?'+':''}{m}
                  </div>
                  <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginTop:'0.4rem' }}>
                    Save: {saveMod(ab)>=0?'+':''}{saveMod(ab)}
                  </div>
                </div>
              );
            })}
          </div>

          <Section title="Death Saving Throws">
            <div style={{ display:'flex', gap:'2rem' }}>
              <div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.4rem' }}>Successes</div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {[0,1,2].map(i => (
                    <div key={i} onClick={() => {
                      const s = [...(c.deathSaveSuccesses||[])];
                      if(s.includes(i)) s.splice(s.indexOf(i),1); else s.push(i);
                      update({deathSaveSuccesses:s});
                    }} style={{ width:'28px',height:'28px',borderRadius:'50%',border:'2px solid var(--emerald)',
                      background:(c.deathSaveSuccesses||[]).includes(i)?'var(--emerald)':'transparent',cursor:'pointer' }} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.4rem' }}>Failures</div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {[0,1,2].map(i => (
                    <div key={i} onClick={() => {
                      const f = [...(c.deathSaveFailures||[])];
                      if(f.includes(i)) f.splice(f.indexOf(i),1); else f.push(i);
                      update({deathSaveFailures:f});
                    }} style={{ width:'28px',height:'28px',borderRadius:'50%',border:'2px solid var(--crimson-light)',
                      background:(c.deathSaveFailures||[]).includes(i)?'var(--crimson-light)':'transparent',cursor:'pointer' }} />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Conditions">
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
              {CONDITIONS.map(cond => (
                <button key={cond} onClick={() => toggleCondition(cond)}
                  style={{ padding:'0.25rem 0.6rem', borderRadius:'12px', fontSize:'0.75rem',
                    fontFamily:"'Cinzel',serif", border:'1px solid var(--border)',
                    background:(c.conditions||[]).includes(cond)?'rgba(201,168,76,0.2)':'transparent',
                    color:(c.conditions||[]).includes(cond)?'var(--gold)':'var(--text-muted)',cursor:'pointer' }}>
                  {cond}
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Skills Tab */}
      {tab==='skills' && (
        <div className="animate-in">
          <div style={{ marginBottom:'1rem', fontSize:'0.82rem', color:'var(--text-muted)' }}>
            Click a skill to roll it. Toggle proficiency with the circles.
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'0.4rem' }}>
            {SKILLS.map(skill => {
              const m = skillMod(skill);
              const prof = skillProf(skill);
              const expert = skillExpert(skill);
              return (
                <div key={skill.name}
                  style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.5rem 0.75rem',
                    background:'var(--bg-raised)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)',
                    cursor:'pointer', transition:'all 0.15s' }}
                  onClick={() => rollCheck(skill.name, m)}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--border-bright)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                >
                  <div onClick={e => { e.stopPropagation();
                    if(expert) update({skillProficiencies:(c.skillProficiencies||[]).filter(s=>s!==skill.name),skillExpertise:(c.skillExpertise||[]).filter(s=>s!==skill.name)});
                    else if(prof) update({skillExpertise:[...(c.skillExpertise||[]),skill.name]});
                    else update({skillProficiencies:[...(c.skillProficiencies||[]),skill.name]});
                  }} style={{ width:'16px',height:'16px',borderRadius:'50%',border:`2px solid ${expert?'var(--gold)':prof?'var(--sapphire)':'var(--border)'}`,
                    background:expert?'var(--gold)':prof?'var(--sapphire)':'transparent', flexShrink:0, cursor:'pointer' }} />
                  <span style={{ flex:1, fontSize:'0.85rem' }}>{skill.name}</span>
                  <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{skill.ability.slice(0,3)}</span>
                  <span style={{ fontFamily:"'Cinzel',serif", color:m>=0?'var(--gold)':'var(--text-secondary)', fontSize:'0.9rem', minWidth:'30px', textAlign:'right' }}>{m>=0?'+':''}{m}</span>
                </div>
              );
            })}
          </div>
          {lastRoll && (
            <Card style={{ marginTop:'1.5rem', textAlign:'center' }}>
              <div style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'0.25rem' }}>{lastRoll.label}</div>
              <div style={{ fontSize:'2.5rem', fontFamily:"'Cinzel',serif", color:lastRoll.critical?'#ffd700':lastRoll.fail?'var(--crimson-light)':'var(--gold)' }}>
                {lastRoll.total}
              </div>
              <div style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>Roll: {lastRoll.roll} + {lastRoll.bonus}</div>
              {lastRoll.critical && <div style={{ color:'#ffd700' }}>✨ Natural 20!</div>}
            </Card>
          )}
        </div>
      )}

      {/* Features Tab */}
      {tab==='features' && (
        <div className="animate-in">
          {cls && (
            <Section title={`${cls.name} Features`}>
              {Object.entries(cls.features||{}).filter(([lvl])=>parseInt(lvl)<=c.level).map(([lvl,feats]) => (
                <div key={lvl} style={{ marginBottom:'0.75rem' }}>
                  <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.3rem', fontFamily:"'Cinzel',serif" }}>Level {lvl}</div>
                  <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                    {feats.map(f => <Badge key={f} color='gold'>{f}</Badge>)}
                  </div>
                </div>
              ))}
            </Section>
          )}
          <Section title="Custom Features & Traits" action={
            <Btn size='sm' variant='ghost' onClick={() => {
              const feat = prompt('Feature name:');
              if(feat) update({customFeatures:[...(c.customFeatures||[]),{name:feat,description:''}]});
            }}>+ Add</Btn>
          }>
            {(c.customFeatures||[]).length===0?<div style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>No custom features yet.</div>:
              (c.customFeatures||[]).map((f,i) => (
                <div key={i} style={{ padding:'0.75rem', background:'var(--bg-raised)', borderRadius:'var(--radius-sm)', marginBottom:'0.5rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.9rem' }}>{f.name}</strong>
                    <Btn size='sm' variant='danger' onClick={() => update({customFeatures:(c.customFeatures||[]).filter((_,j)=>j!==i)})}>×</Btn>
                  </div>
                  <textarea value={f.description||''} onChange={e => update({customFeatures:(c.customFeatures||[]).map((feat,j)=>j===i?{...feat,description:e.target.value}:feat)})}
                    style={{ marginTop:'0.5rem', fontSize:'0.85rem' }} rows={2} placeholder="Description…" />
                </div>
              ))
            }
          </Section>
        </div>
      )}

      {/* Notes Tab */}
      {tab==='notes' && (
        <div className="animate-in">
          <Section title="Backstory">
            <textarea value={c.backstory||''} onChange={e => update({backstory:e.target.value})} rows={5} placeholder="Your character's history…" />
          </Section>
          <Section title="Appearance">
            <textarea value={c.appearance||''} onChange={e => update({appearance:e.target.value})} rows={3} placeholder="Physical description…" />
          </Section>
          <Grid cols={2} gap='1rem'>
            <Section title="Personality Traits">
              <textarea value={c.personalityTraits||''} onChange={e => update({personalityTraits:e.target.value})} rows={3} />
            </Section>
            <Section title="Ideals">
              <textarea value={c.ideals||''} onChange={e => update({ideals:e.target.value})} rows={3} />
            </Section>
            <Section title="Bonds">
              <textarea value={c.bonds||''} onChange={e => update({bonds:e.target.value})} rows={3} />
            </Section>
            <Section title="Flaws">
              <textarea value={c.flaws||''} onChange={e => update({flaws:e.target.value})} rows={3} />
            </Section>
          </Grid>
          <Section title="Campaign Notes">
            <textarea value={c.notes||''} onChange={e => update({notes:e.target.value})} rows={6} placeholder="General notes, important NPCs, quest hooks…" />
          </Section>
        </div>
      )}
    </div>
  );
}

function Grid({ children, cols=2, gap='1rem' }) {
  return <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap }}>{children}</div>;
}
