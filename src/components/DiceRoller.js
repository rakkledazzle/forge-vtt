import React, { useState, useRef, useEffect } from 'react';

const DICE = [
  { label: 'd4',   sides: 4,   shape: 'triangle' },
  { label: 'd6',   sides: 6,   shape: 'square'   },
  { label: 'd8',   sides: 8,   shape: 'diamond'  },
  { label: 'd10',  sides: 10,  shape: 'pentagon' },
  { label: 'd12',  sides: 12,  shape: 'hex'      },
  { label: 'd20',  sides: 20,  shape: 'hex'      },
  { label: 'd100', sides: 100, shape: 'circle'   },
  { label: '2d6',  sides: 6,   shape: 'square', count: 2 },
  { label: '2d8',  sides: 8,   shape: 'diamond', count: 2 },
  { label: '4d6',  sides: 6,   shape: 'square', count: 4 },
];

const DIE_COLORS = {
  d4:   '#e74c3c',
  d6:   '#e67e22',
  d8:   '#f1c40f',
  d10:  '#2ecc71',
  d12:  '#3498db',
  d20:  '#9b59b6',
  d100: '#1abc9c',
  '2d6':'#e67e22',
  '2d8':'#f1c40f',
  '4d6':'#e74c3c',
};

function DieFace({ shape, value, color, size = 56 }) {
  const s = size;
  const shapes = {
    triangle: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <polygon points="50,8 96,88 4,88" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
        <text x="50" y="68" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="'Cinzel',serif" fill="white">{value}</text>
      </svg>
    ),
    square: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <rect x="8" y="8" width="84" height="84" rx="12" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
        <text x="50" y="60" textAnchor="middle" fontSize="32" fontWeight="900" fontFamily="'Cinzel',serif" fill="white">{value}</text>
      </svg>
    ),
    diamond: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <polygon points="50,6 94,50 50,94 6,50" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
        <text x="50" y="58" textAnchor="middle" fontSize="26" fontWeight="900" fontFamily="'Cinzel',serif" fill="white">{value}</text>
      </svg>
    ),
    pentagon: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <polygon points="50,6 97,40 79,95 21,95 3,40" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
        <text x="50" y="62" textAnchor="middle" fontSize="26" fontWeight="900" fontFamily="'Cinzel',serif" fill="white">{value}</text>
      </svg>
    ),
    hex: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <polygon points="50,4 93,27 93,73 50,96 7,73 7,27" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
        <text x="50" y="58" textAnchor="middle" fontSize="26" fontWeight="900" fontFamily="'Cinzel',serif" fill="white">{value}</text>
      </svg>
    ),
    circle: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
        <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="900" fontFamily="'Cinzel',serif" fill="white">{value}</text>
      </svg>
    ),
  };
  return shapes[shape] || shapes.circle;
}

function RollingDie({ die, result, onDone }) {
  const [frame, setFrame] = useState(0);
  const [done, setDone] = useState(false);
  const [pos, setPos] = useState({ x: Math.random() * 60 + 20, y: Math.random() * 30 + 10 });
  const frameRef = useRef(null);
  const totalFrames = 18;

  useEffect(() => {
    let count = 0;
    frameRef.current = setInterval(() => {
      count++;
      setFrame(Math.floor(Math.random() * die.sides) + 1);
      setPos(p => ({
        x: p.x + (Math.random() - 0.5) * 8,
        y: p.y + (Math.random() - 0.5) * 8,
      }));
      if (count >= totalFrames) {
        clearInterval(frameRef.current);
        setFrame(result);
        setDone(true);
        setTimeout(onDone, 1800);
      }
    }, 60);
    return () => clearInterval(frameRef.current);
  }, []);

  const color = DIE_COLORS[die.label] || '#9a6f28';
  const isCrit = die.sides === 20 && die.count !== 2 && result === 20;
  const isFumble = die.sides === 20 && die.count !== 2 && result === 1;

  return (
    <div style={{
      position: 'fixed',
      left: `${Math.max(5, Math.min(80, pos.x))}%`,
      top: `${Math.max(10, Math.min(70, pos.y))}%`,
      zIndex: 1000,
      transform: `rotate(${done ? 0 : (Math.random() * 40 - 20)}deg)`,
      transition: done ? 'all 0.3s ease' : 'none',
      filter: done && isCrit ? 'drop-shadow(0 0 16px gold)' : done && isFumble ? 'drop-shadow(0 0 16px red)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
      animation: done ? 'dieSettle 0.3s ease' : undefined,
      pointerEvents: 'none',
    }}>
      <DieFace shape={die.shape} value={frame} color={color} size={72} />
      {done && (isCrit || isFumble) && (
        <div style={{
          position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Cinzel',serif", fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap',
          color: isCrit ? '#f1c40f' : '#e74c3c',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          {isCrit ? '✨ Critical!' : '💀 Fumble!'}
        </div>
      )}
    </div>
  );
}

function RollLogEntry({ entry }) {
  const isCrit = entry.dice[0]?.sides === 20 && entry.total === 20 && entry.dice.length === 1;
  const isFumble = entry.dice[0]?.sides === 20 && entry.total === 1 && entry.dice.length === 1;
  const color = DIE_COLORS[entry.label] || '#9a6f28';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.4rem 0', borderBottom: '1px solid #e8e0d0',
      animation: 'fadeInLog 0.3s ease',
    }}>
      <DieFace shape={entry.shape} value={entry.total} color={color} size={32} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: '0.8rem', color: '#6b5c45' }}>{entry.label}</span>
          {entry.rolls.length > 1 && (
            <span style={{ fontSize: '0.72rem', color: '#a08c72' }}>({entry.rolls.join(' + ')})</span>
          )}
          {isCrit && <span style={{ fontSize: '0.72rem', color: '#d97706' }}>✨ Crit!</span>}
          {isFumble && <span style={{ fontSize: '0.72rem', color: '#dc2626' }}>💀 Fumble!</span>}
        </div>
        <div style={{ fontSize: '0.68rem', color: '#a08c72' }}>{entry.time}</div>
      </div>
      <div style={{
        fontFamily: "'Cinzel Decorative',serif", fontSize: '1.1rem', fontWeight: 700,
        color: isCrit ? '#d97706' : isFumble ? '#dc2626' : '#2a2118',
      }}>
        {entry.total}
      </div>
    </div>
  );
}

export default function DiceRoller() {
  const [open, setOpen] = useState(false);
  const [rolling, setRolling] = useState([]);
  const [log, setLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target) && !rolling.length) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [rolling]);

  function roll(die) {
    const count = die.count || 1;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * die.sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const entry = { id: Date.now(), label: die.label, shape: die.shape, total, rolls, dice: [die], time };
    setLog(l => [entry, ...l].slice(0, 50));

    // Animate each die
    const animations = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}_${i}`,
      die,
      result: rolls[i],
    }));
    setRolling(r => [...r, ...animations]);
  }

  function removeDie(id) {
    setRolling(r => r.filter(d => d.id !== id));
  }

  return (
    <>
      {/* Rolling dice animations */}
      {rolling.map(r => (
        <RollingDie key={r.id} die={r.die} result={r.result} onDone={() => removeDie(r.id)} />
      ))}

      <div ref={ref} style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 200 }}>
        {open && (
          <div style={{
            position: 'absolute', bottom: '4rem', right: 0,
            background: '#fff', border: '1px solid #d8cfc0', borderRadius: '16px',
            padding: '1.25rem', width: '300px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.2s ease',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a08c72' }}>
                🎲 Dice Roller
              </div>
              <button onClick={() => setShowLog(l => !l)}
                style={{ background: showLog ? 'rgba(154,111,40,0.1)' : 'transparent', border: '1px solid #d8cfc0', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.72rem', color: '#9a6f28', cursor: 'pointer', fontFamily: "'Cinzel',serif" }}>
                {showLog ? 'Dice' : `Log${log.length > 0 ? ` (${log.length})` : ''}`}
              </button>
            </div>

            {!showLog ? (
              <>
                {/* Dice grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {DICE.map(d => (
                    <button key={d.label} onClick={() => roll(d)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.3rem', borderRadius: '8px', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f4f1eb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <DieFace shape={d.shape} value={d.label.replace('d', '').replace('2d6','2d6')} color={DIE_COLORS[d.label]} size={40} />
                      <span style={{ fontSize: '0.65rem', color: '#a08c72', fontFamily: "'Cinzel',serif" }}>{d.label}</span>
                    </button>
                  ))}
                </div>

                {/* Last roll result */}
                {log[0] && (
                  <div style={{ textAlign: 'center', padding: '0.6rem', background: '#f9f6f1', borderRadius: '8px', border: '1px solid #e8e0d0' }}>
                    <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '1.8rem', fontWeight: 700, color: '#2a2118', lineHeight: 1 }}>
                      {log[0].total}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#a08c72', marginTop: '0.2rem' }}>
                      {log[0].label}
                      {log[0].rolls.length > 1 && ` (${log[0].rolls.join(' + ')})`}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {log.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#a08c72', fontSize: '0.85rem', padding: '2rem 0' }}>No rolls yet!</div>
                ) : (
                  log.map(entry => <RollLogEntry key={entry.id} entry={entry} />)
                )}
              </div>
            )}
          </div>
        )}

        <button onClick={() => setOpen(o => !o)}
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #9a6f28, #7a5518)',
            border: 'none', color: '#fff', fontSize: '1.5rem',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(154,111,40,0.4)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(154,111,40,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(154,111,40,0.4)'; }}
        >
          🎲
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(12px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeInLog {
          from { opacity:0; transform:translateX(-8px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes dieSettle {
          0% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </>
  );
}