import React, { useState, useEffect, useRef } from 'react';

export function Btn({ children, variant='primary', size='md', onClick, disabled, style, className='' }) {
  const variants = {
    primary: { background:'linear-gradient(135deg,#c9a84c,#a07830)', color:'#0a0a0f', border:'none' },
    danger:  { background:'linear-gradient(135deg,#c0392b,#922b21)', color:'#fff', border:'none' },
    ghost:   { background:'transparent', color:'var(--gold)', border:'1px solid var(--border-bright)' },
    dark:    { background:'var(--bg-raised)', color:'var(--text-primary)', border:'1px solid var(--border)' },
    success: { background:'linear-gradient(135deg,#27ae60,#1e8449)', color:'#fff', border:'none' },
  };
  const sizes = { sm:'0.4rem 0.8rem', md:'0.55rem 1.1rem', lg:'0.75rem 1.6rem' };
  const fontSize = { sm:'0.78rem', md:'0.88rem', lg:'1rem' };
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={className}
      style={{
        ...variants[variant],
        padding: sizes[size],
        fontSize: fontSize[size],
        borderRadius:'var(--radius-sm)',
        fontFamily:"'Cinzel', serif",
        letterSpacing:'0.04em',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition:'all 0.2s',
        ...style
      }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.filter='brightness(1.15)'; }}
      onMouseLeave={e => e.currentTarget.style.filter=''}
    >{children}</button>
  );
}

export function Card({ children, style, onClick, glow }) {
  return (
    <div onClick={onClick}
      style={{
        background:'var(--bg-card)',
        border:`1px solid var(--border)`,
        borderRadius:'var(--radius)',
        padding:'1.25rem',
        boxShadow: glow ? 'var(--shadow-glow)' : 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : 'default',
        transition:'all 0.2s',
        ...style
      }}
      onMouseEnter={e => { if(onClick) { e.currentTarget.style.borderColor='var(--gold-dark)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
      onMouseLeave={e => { if(onClick) { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; }}}
    >{children}</div>
  );
}

export function Modal({ open, onClose, title, children, width='600px' }) {
  useEffect(() => {
    const handler = (e) => { if(e.key === 'Escape') onClose(); };
    if(open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000,
      display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
      backdropFilter:'blur(4px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:'var(--bg-deep)', border:'1px solid var(--border-bright)',
        borderRadius:'var(--radius-lg)', width:'100%', maxWidth:width,
        maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.8)',
        animation:'fadeIn 0.25s ease',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ color:'var(--gold)', margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', color:'var(--text-muted)',
            fontSize:'1.4rem', lineHeight:1, padding:'0.2rem 0.4rem', borderRadius:'4px' }}
            onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
          >×</button>
        </div>
        <div style={{ padding:'1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

export function Badge({ children, color='gold' }) {
  const colors = { gold:'rgba(201,168,76,0.15)', crimson:'rgba(192,57,43,0.15)', emerald:'rgba(39,174,96,0.15)', sapphire:'rgba(41,128,185,0.15)', violet:'rgba(142,68,173,0.15)', muted:'rgba(90,84,112,0.2)' };
  const textColors = { gold:'var(--gold)', crimson:'var(--crimson-light)', emerald:'var(--emerald)', sapphire:'var(--sapphire)', violet:'var(--violet)', muted:'var(--text-muted)' };
  return <span style={{ background:colors[color]||colors.muted, color:textColors[color]||textColors.muted, padding:'0.15rem 0.55rem', borderRadius:'20px', fontSize:'0.78rem', fontFamily:"'Cinzel',serif", letterSpacing:'0.03em' }}>{children}</span>;
}

export function StatBox({ label, value, sub, color }) {
  return (
    <div style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)',
      padding:'0.6rem 0.5rem', textAlign:'center', minWidth:'70px' }}>
      <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'Cinzel',serif", marginBottom:'0.2rem' }}>{label}</div>
      <div style={{ fontSize:'1.5rem', fontFamily:"'Cinzel',serif", color:color||'var(--text-primary)', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'0.7rem', color:'var(--text-secondary)' }}>{sub}</div>}
    </div>
  );
}

export function FormField({ label, children, hint }) {
  return (
    <div style={{ marginBottom:'1rem' }}>
      <label style={{ display:'block', fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'0.35rem', fontFamily:"'Cinzel',serif", letterSpacing:'0.04em' }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{hint}</div>}
    </div>
  );
}

export function Grid({ children, cols=2, gap='1rem' }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap }}>{children}</div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:'0.25rem', borderBottom:'1px solid var(--border)', marginBottom:'1.5rem', overflowX:'auto' }}>
      {tabs.map(t => (
        <button key={t.id || t} onClick={() => onChange(t.id || t)}
          style={{ padding:'0.6rem 1.1rem', background:'none', color: (t.id||t)===active ? 'var(--gold)' : 'var(--text-muted)',
            borderBottom: (t.id||t)===active ? '2px solid var(--gold)' : '2px solid transparent',
            fontFamily:"'Cinzel',serif", fontSize:'0.82rem', letterSpacing:'0.06em',
            whiteSpace:'nowrap', transition:'all 0.2s' }}
          onMouseEnter={e => { if((t.id||t)!==active) e.currentTarget.style.color='var(--text-secondary)'; }}
          onMouseLeave={e => { if((t.id||t)!==active) e.currentTarget.style.color='var(--text-muted)'; }}
        >{t.label || t}</button>
      ))}
    </div>
  );
}

export function DiceRoller({ onRoll }) {
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const dice = [4,6,8,10,12,20,100];

  function roll(sides) {
    setRolling(true);
    setTimeout(() => {
      const r = Math.floor(Math.random() * sides) + 1;
      setResult({ sides, value: r });
      setRolling(false);
      if (onRoll) onRoll(r, sides);
    }, 300);
  }

  return (
    <div style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem' }}>
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
        {dice.map(d => (
          <Btn key={d} variant='ghost' size='sm' onClick={() => roll(d)}>d{d}</Btn>
        ))}
      </div>
      {rolling && <div style={{ color:'var(--text-muted)', fontStyle:'italic' }}>Rolling…</div>}
      {result && !rolling && (
        <div style={{ textAlign:'center', animation:'fadeIn 0.2s' }}>
          <span style={{ fontSize:'2rem', color:'var(--gold)', fontFamily:"'Cinzel',serif" }}>{result.value}</span>
          <span style={{ color:'var(--text-muted)', marginLeft:'0.5rem' }}>/ d{result.sides}</span>
          {result.value === result.sides && <div style={{ color:'#ffd700', fontSize:'0.8rem' }}>✨ Critical!</div>}
          {result.value === 1 && result.sides === 20 && <div style={{ color:'var(--crimson-light)', fontSize:'0.8rem' }}>💀 Critical Fail!</div>}
        </div>
      )}
    </div>
  );
}

export function ConditionBadge({ condition, onRemove }) {
  const colors = {
    Blinded:'#555',Charmed:'#c0649a',Deafened:'#888',Exhaustion:'#8b0000',
    Frightened:'#6a3d8b',Grappled:'#556b2f',Incapacitated:'#808080',
    Invisible:'#8898a0',Paralyzed:'#b8960c',Petrified:'#a0a0a0',
    Poisoned:'#228b22',Prone:'#8b4513',Restrained:'#8b6914',
    Stunned:'#ff5722',Unconscious:'#2c3e50',
  };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', background:colors[condition]||'#444',
      color:'#fff', padding:'0.15rem 0.5rem', borderRadius:'12px', fontSize:'0.72rem',
      fontFamily:"'Cinzel',serif", marginRight:'0.3rem', marginBottom:'0.3rem' }}>
      {condition}
      {onRemove && <button onClick={onRemove} style={{ background:'none', color:'rgba(255,255,255,0.7)', lineHeight:1, fontSize:'0.9rem', padding:'0 0.1rem' }}>×</button>}
    </span>
  );
}

export function SearchInput({ value, onChange, placeholder='Search...' }) {
  return (
    <div style={{ position:'relative' }}>
      <span style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.9rem', pointerEvents:'none' }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ paddingLeft:'2.2rem' }} />
    </div>
  );
}

export function EmptyState({ icon='📜', title, desc, action }) {
  return (
    <div style={{ textAlign:'center', padding:'4rem 2rem', color:'var(--text-muted)' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>{icon}</div>
      <h3 style={{ color:'var(--text-secondary)', marginBottom:'0.5rem' }}>{title}</h3>
      {desc && <p style={{ fontSize:'0.9rem', marginBottom:'1.5rem' }}>{desc}</p>}
      {action}
    </div>
  );
}

export function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom:'2rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem' }}>
        <h3 style={{ color:'var(--gold)', margin:0, fontSize:'1rem' }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function NumberInput({ value, onChange, min, max, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
      {label && <label style={{ fontSize:'0.8rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{label}</label>}
      <button onClick={() => onChange(Math.max(min??-Infinity, value-1))}
        style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', color:'var(--text-primary)', width:'28px', height:'28px', borderRadius:'4px', fontSize:'1rem', lineHeight:1 }}>−</button>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width:'60px', textAlign:'center' }} min={min} max={max} />
      <button onClick={() => onChange(Math.min(max??Infinity, value+1))}
        style={{ background:'var(--bg-raised)', border:'1px solid var(--border)', color:'var(--text-primary)', width:'28px', height:'28px', borderRadius:'4px', fontSize:'1rem', lineHeight:1 }}>+</button>
    </div>
  );
}

export function HPBar({ current, max, temp=0 }) {
  const pct = Math.max(0, Math.min(100, (current/max)*100));
  const color = pct > 50 ? '#27ae60' : pct > 25 ? '#f39c12' : '#c0392b';
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'0.3rem' }}>
        <span>{current}/{max} HP</span>
        {temp > 0 && <span style={{ color:'#87ceeb' }}>+{temp} temp</span>}
      </div>
      <div style={{ background:'var(--bg-void)', borderRadius:'4px', height:'8px', overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}cc)`, height:'100%', borderRadius:'4px', transition:'width 0.3s' }} />
      </div>
    </div>
  );
}

export function Confirm({ open, onConfirm, onCancel, message='Are you sure?' }) {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-bright)', borderRadius:'var(--radius)', padding:'2rem', maxWidth:'360px', width:'90%', textAlign:'center' }}>
        <p style={{ marginBottom:'1.5rem', color:'var(--text-primary)' }}>{message}</p>
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center' }}>
          <Btn variant='dark' onClick={onCancel}>Cancel</Btn>
          <Btn variant='danger' onClick={onConfirm}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}
