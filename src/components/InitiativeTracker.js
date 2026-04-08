import React, { useState } from 'react';
import { Card, Btn, Badge, ConditionBadge, Modal, FormField, EmptyState } from './UI';
import { mod, modStr } from '../utils/dnd';

const CONDITIONS = ['Blinded','Charmed','Deafened','Exhaustion','Frightened','Grappled','Incapacitated','Paralyzed','Poisoned','Prone','Restrained','Stunned','Unconscious'];

function AddCombatantForm({ onAdd, characters }) {
  const [form, setForm] = useState({ name:'', initiative:0, hp:10, maxHp:10, ac:10, type:'monster', charId:'' });

  function fromChar(charId) {
    const c = characters.find(ch => ch.id===charId);
    if(!c) return;
    const dex = c.abilities?.Dexterity||10;
    setForm({ name:c.name, initiative:mod(dex)+Math.floor(Math.random()*20)+1, hp:c.currentHp||c.maxHp||10, maxHp:c.maxHp||10, ac:c.ac||10, type:'player', charId });
  }

  function roll() { setForm(f=>({...f, initiative: f.initiativeBonus + Math.floor(Math.random()*20)+1})); }

  function submit() {
    if(!form.name) return;
    onAdd({ ...form, currentHp:form.hp });
    setForm({ name:'', initiative:0, hp:10, maxHp:10, ac:10, type:'monster', charId:'' });
  }

  return (
    <div style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem', marginBottom:'1rem' }}>
      <h4 style={{ color:'var(--gold)', marginBottom:'0.75rem', fontSize:'0.9rem' }}>Add Combatant</h4>
      {characters.length > 0 && (
        <div style={{ marginBottom:'0.75rem' }}>
          <select value={form.charId} onChange={e => fromChar(e.target.value)} style={{ marginBottom:'0' }}>
            <option value=''>— From Party —</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:'0.5rem', marginBottom:'0.5rem' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
        <div style={{ display:'flex', gap:'0.25rem' }}>
          <input type='number' placeholder="Init" value={form.initiative} onChange={e => setForm(f=>({...f,initiative:parseInt(e.target.value)||0}))} />
          <button onClick={roll} title="Roll" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--gold)', borderRadius:'4px', padding:'0 0.4rem', cursor:'pointer' }}>🎲</button>
        </div>
        <input type='number' placeholder="HP" value={form.hp} onChange={e => setForm(f=>({...f,hp:parseInt(e.target.value)||1,maxHp:parseInt(e.target.value)||1}))} />
        <input type='number' placeholder="AC" value={form.ac} onChange={e => setForm(f=>({...f,ac:parseInt(e.target.value)||10}))} />
        <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
          <option value='player'>Player</option>
          <option value='monster'>Monster</option>
          <option value='npc'>NPC</option>
        </select>
      </div>
      <Btn variant='primary' onClick={submit} disabled={!form.name}>Add to Tracker</Btn>
    </div>
  );
}

export default function InitiativeTracker({ initiative, characters, onAdd, onRemove, onUpdate, onNext, onPrev, onStart, onEnd, onSort }) {
  const [showAdd, setShowAdd] = useState(true);
  const [condModal, setCondModal] = useState(null);
  const [hpInput, setHpInput] = useState({});

  const { combatants, round, activeIndex, active } = initiative;

  function applyHpChange(id, delta) {
    const c = combatants.find(x=>x.id===id);
    if(!c) return;
    const newHp = Math.max(0, Math.min(c.maxHp||999, (c.currentHp||c.hp||0) + delta));
    onUpdate(id, { currentHp: newHp });
    setHpInput(h => ({...h,[id]:''}));
  }

  function toggleCondition(id, cond) {
    const c = combatants.find(x=>x.id===id);
    if(!c) return;
    const current = c.conditions||[];
    onUpdate(id, { conditions: current.includes(cond)?current.filter(x=>x!==cond):[...current,cond] });
  }

  return (
    <div style={{ maxWidth:'800px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
        <div>
          <h2 style={{ color:'var(--gold)', marginBottom:'0.25rem' }}>⚔️ Initiative Tracker</h2>
          {active && <div style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Round <strong style={{color:'var(--gold-light)'}}>{round}</strong></div>}
        </div>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {combatants.length > 1 && <Btn variant='ghost' size='sm' onClick={onSort}>Sort by Init</Btn>}
          {!active && combatants.length>0 && <Btn variant='success' onClick={onStart}>▶ Start Combat</Btn>}
          {active && (
            <>
              <Btn variant='ghost' onClick={onPrev}>◀ Prev</Btn>
              <Btn variant='primary' onClick={onNext}>Next ▶</Btn>
              <Btn variant='danger' onClick={onEnd}>End Combat</Btn>
            </>
          )}
        </div>
      </div>

      {/* Add combatant */}
      <button onClick={() => setShowAdd(s=>!s)}
        style={{ background:'none', border:'1px dashed var(--border)', color:'var(--text-muted)', padding:'0.4rem 1rem',
          borderRadius:'var(--radius-sm)', width:'100%', marginBottom:'0.75rem', fontSize:'0.85rem', cursor:'pointer' }}>
        {showAdd?'▲ Hide':'▼ Add Combatant'}
      </button>
      {showAdd && <AddCombatantForm onAdd={c => { onAdd(c); }} characters={characters} />}

      {/* Combatant list */}
      {combatants.length === 0 ? (
        <EmptyState icon='⚔️' title='No combatants yet' desc='Add monsters, NPCs, or players to begin tracking initiative.' />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {combatants.map((c, idx) => {
            const isActive = active && idx === activeIndex;
            const hpPct = c.maxHp ? Math.max(0,Math.min(100,(c.currentHp||c.hp||0)/c.maxHp*100)) : 100;
            const hpColor = hpPct>50?'#27ae60':hpPct>25?'#f39c12':'#c0392b';
            return (
              <div key={c.id} style={{
                background: isActive ? 'var(--bg-raised)' : 'var(--bg-card)',
                border: `2px solid ${isActive?'var(--gold)':'var(--border)'}`,
                borderRadius:'var(--radius)',
                padding:'0.85rem 1rem',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                transition:'all 0.2s',
                position:'relative',
                animation: isActive?'glow 2s ease-in-out infinite':'none',
              }}>
                {isActive && <div style={{ position:'absolute', left:'-2px', top:'50%', transform:'translateY(-50%)', width:'4px', height:'60%', background:'var(--gold)', borderRadius:'2px' }} />}
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
                  {/* Initiative badge */}
                  <div style={{ background:'var(--bg-void)', border:`1px solid ${isActive?'var(--gold)':'var(--border)'}`, borderRadius:'8px',
                    width:'46px', height:'46px', display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Cinzel',serif", fontSize:'1.1rem', color:isActive?'var(--gold)':'var(--text-primary)', flexShrink:0 }}>
                    {c.initiative}
                  </div>

                  {/* Name & type */}
                  <div style={{ flex:1, minWidth:'100px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                      <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.95rem' }}>{c.name}</strong>
                      <Badge color={c.type==='player'?'sapphire':c.type==='npc'?'emerald':'crimson'}>
                        {c.type}
                      </Badge>
                      {isActive && <span style={{ color:'var(--gold)', fontSize:'0.8rem' }}>← Active</span>}
                    </div>
                    {/* Conditions */}
                    {(c.conditions||[]).map(cond => (
                      <ConditionBadge key={cond} condition={cond} onRemove={() => toggleCondition(c.id,cond)} />
                    ))}
                  </div>

                  {/* HP */}
                  <div style={{ minWidth:'120px' }}>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>
                      HP: <strong style={{ color:hpColor }}>{c.currentHp??c.hp}</strong>/{c.maxHp}
                    </div>
                    <div style={{ background:'var(--bg-void)', borderRadius:'3px', height:'6px', overflow:'hidden' }}>
                      <div style={{ width:`${hpPct}%`, height:'100%', background:hpColor, transition:'width 0.3s' }} />
                    </div>
                    <div style={{ display:'flex', gap:'0.25rem', marginTop:'0.4rem' }}>
                      <input type='number' placeholder='±HP' value={hpInput[c.id]||''} onChange={e=>setHpInput(h=>({...h,[c.id]:e.target.value}))}
                        style={{ width:'60px', padding:'0.2rem 0.4rem', fontSize:'0.8rem' }} />
                      <button onClick={() => applyHpChange(c.id, parseInt(hpInput[c.id])||0)}
                        style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', color:'var(--gold)', padding:'0.2rem 0.4rem', borderRadius:'4px', fontSize:'0.75rem', cursor:'pointer' }}>Go</button>
                    </div>
                  </div>

                  {/* AC */}
                  <div style={{ textAlign:'center', minWidth:'40px' }}>
                    <div style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>AC</div>
                    <div style={{ fontFamily:"'Cinzel',serif", color:'var(--sapphire)' }}>{c.ac}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:'0.35rem' }}>
                    <button onClick={() => setCondModal(c.id)} title="Conditions"
                      style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', color:'var(--text-secondary)', padding:'0.3rem 0.5rem', borderRadius:'4px', fontSize:'0.8rem', cursor:'pointer' }}>🏷</button>
                    <button onClick={() => onRemove(c.id)} title="Remove"
                      style={{ background:'transparent', border:'1px solid var(--border)', color:'var(--crimson-light)', padding:'0.3rem 0.5rem', borderRadius:'4px', fontSize:'0.8rem', cursor:'pointer' }}>×</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conditions Modal */}
      <Modal open={!!condModal} onClose={() => setCondModal(null)} title="Apply Conditions" width='400px'>
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
          {CONDITIONS.map(cond => {
            const c = combatants.find(x=>x.id===condModal);
            const has = (c?.conditions||[]).includes(cond);
            return (
              <button key={cond} onClick={() => { toggleCondition(condModal, cond); }}
                style={{ padding:'0.3rem 0.7rem', borderRadius:'12px', border:'1px solid var(--border)',
                  background:has?'rgba(201,168,76,0.2)':'transparent', color:has?'var(--gold)':'var(--text-muted)',
                  fontFamily:"'Cinzel',serif", fontSize:'0.75rem', cursor:'pointer' }}>
                {cond}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop:'1rem' }}>
          <Btn variant='primary' onClick={() => setCondModal(null)}>Done</Btn>
        </div>
      </Modal>
    </div>
  );
}
