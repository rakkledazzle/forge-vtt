import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Card, Btn, Modal, FormField, EmptyState } from './UI';

const GRID = 40;
const COLORS = ['#c9a84c','#e74c3c','#2ecc71','#3498db','#9b59b6','#f39c12','#1abc9c','#e67e22','#ecf0f1','#95a5a6'];

function TokenColorPicker({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
      {COLORS.map(c => (
        <div key={c} onClick={() => onChange(c)}
          style={{ width:'24px', height:'24px', borderRadius:'50%', background:c, cursor:'pointer',
            border:`2px solid ${value===c?'white':'transparent'}` }} />
      ))}
    </div>
  );
}

function MapCanvas({ map, onUpdate }) {
  const canvasRef = useRef(null);
  const [tokens, setTokens] = useState(map.tokens || []);
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);
  const [tool, setTool] = useState('select');
  const [addForm, setAddForm] = useState(null);
  const [ctx, setCtx] = useState(null);

  const cols = map.cols || 20;
  const rows = map.rows || 15;
  const W = cols * GRID;
  const H = rows * GRID;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const context = c.getContext('2d');
    setCtx(context);
    draw(context);
  });

  function draw(context) {
    if (!context) return;
    context.clearRect(0, 0, W, H);
    // Background
    context.fillStyle = map.bgColor || '#1a1a2e';
    context.fillRect(0, 0, W, H);
    // Grid
    context.strokeStyle = 'rgba(255,255,255,0.08)';
    context.lineWidth = 1;
    for (let x = 0; x <= cols; x++) { context.beginPath(); context.moveTo(x*GRID, 0); context.lineTo(x*GRID, H); context.stroke(); }
    for (let y = 0; y <= rows; y++) { context.beginPath(); context.moveTo(0, y*GRID); context.lineTo(W, y*GRID); context.stroke(); }
    // Tokens
    tokens.forEach(token => {
      const x = token.gx * GRID;
      const y = token.gy * GRID;
      const r = (token.size || 1) * GRID / 2 - 3;
      // Shadow
      context.shadowColor = token.color || '#c9a84c';
      context.shadowBlur = selected === token.id ? 12 : 4;
      // Circle
      context.fillStyle = token.color || '#c9a84c';
      context.beginPath();
      context.arc(x + GRID/2, y + GRID/2, r, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      // Border
      context.strokeStyle = selected === token.id ? 'white' : 'rgba(255,255,255,0.4)';
      context.lineWidth = selected === token.id ? 2.5 : 1.5;
      context.stroke();
      // Initials
      context.fillStyle = 'rgba(0,0,0,0.85)';
      context.font = `bold ${Math.max(10,r*0.8)}px 'Cinzel', serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const label = token.name?.slice(0,2).toUpperCase() || '?';
      context.fillText(label, x + GRID/2, y + GRID/2);
      // HP bar
      if (token.hp !== undefined && token.maxHp > 0) {
        const pct = Math.max(0, Math.min(1, token.hp / token.maxHp));
        const barW = GRID * (token.size||1) - 8;
        const barY = y + GRID*(token.size||1) - 8;
        context.fillStyle = '#222';
        context.fillRect(x + 4, barY, barW, 4);
        context.fillStyle = pct > 0.5 ? '#27ae60' : pct > 0.25 ? '#f39c12' : '#c0392b';
        context.fillRect(x + 4, barY, barW * pct, 4);
      }
    });
  }

  function getCell(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    return { gx: Math.floor(mx / GRID), gy: Math.floor(my / GRID) };
  }

  function getTokenAt(gx, gy) {
    return tokens.find(t => t.gx === gx && t.gy === gy);
  }

  function handleMouseDown(e) {
    const { gx, gy } = getCell(e);
    const token = getTokenAt(gx, gy);
    if (tool === 'select' && token) {
      setSelected(token.id);
      setDragging({ id: token.id, offX: gx - token.gx, offY: gy - token.gy });
    } else if (tool === 'add') {
      setAddForm({ gx, gy });
    } else if (tool === 'delete' && token) {
      const newTokens = tokens.filter(t => t.id !== token.id);
      setTokens(newTokens);
      onUpdate({ ...map, tokens: newTokens });
    }
  }

  function handleMouseMove(e) {
    if (!dragging) return;
    const { gx, gy } = getCell(e);
    setTokens(ts => ts.map(t => t.id === dragging.id ? { ...t, gx: gx - dragging.offX, gy: gy - dragging.offY } : t));
  }

  function handleMouseUp() {
    if (dragging) {
      onUpdate({ ...map, tokens });
      setDragging(null);
    }
  }

  function addToken(form) {
    const newToken = { id: `tok_${Date.now()}`, name: form.name, color: form.color, gx: addForm.gx, gy: addForm.gy, size: form.size||1, hp: form.hp||undefined, maxHp: form.maxHp||undefined, type: form.type||'player' };
    const newTokens = [...tokens, newToken];
    setTokens(newTokens);
    onUpdate({ ...map, tokens: newTokens });
    setAddForm(null);
  }

  const selectedToken = tokens.find(t => t.id === selected);

  return (
    <div>
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem', flexWrap:'wrap', alignItems:'center' }}>
        {['select','add','delete'].map(t => (
          <Btn key={t} variant={tool===t?'primary':'ghost'} size='sm' onClick={() => setTool(t)}>
            {t==='select'?'🖱 Select':t==='add'?'+ Place Token':'🗑 Delete'}
          </Btn>
        ))}
        {selectedToken && (
          <div style={{ marginLeft:'1rem', display:'flex', gap:'0.5rem', alignItems:'center', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
            <strong style={{ color:'var(--gold)' }}>{selectedToken.name}</strong>
            {selectedToken.hp !== undefined && (
              <>
                <span>HP:</span>
                <input type="number" value={selectedToken.hp||0} onChange={e => {
                  const newTokens = tokens.map(t => t.id===selected?{...t,hp:parseInt(e.target.value)||0}:t);
                  setTokens(newTokens); onUpdate({...map,tokens:newTokens});
                }} style={{ width:'55px', padding:'0.15rem' }} />
                <span>/{selectedToken.maxHp}</span>
              </>
            )}
            <Btn size='sm' variant='danger' onClick={() => { const newTokens=tokens.filter(t=>t.id!==selected); setTokens(newTokens); setSelected(null); onUpdate({...map,tokens:newTokens}); }}>Remove</Btn>
          </div>
        )}
      </div>
      <div style={{ overflow:'auto', border:'1px solid var(--border)', borderRadius:'var(--radius)', maxHeight:'65vh' }}>
        <canvas ref={canvasRef} width={W} height={H}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
          style={{ display:'block', cursor: tool==='add'?'crosshair':tool==='delete'?'not-allowed':'default' }} />
      </div>
      <div style={{ marginTop:'0.5rem', fontSize:'0.75rem', color:'var(--text-muted)' }}>
        {cols}×{rows} grid · {tokens.length} token{tokens.length!==1?'s':''} · Click to {tool}
      </div>

      {addForm && (
        <AddTokenModal onAdd={addToken} onClose={() => setAddForm(null)} />
      )}
    </div>
  );
}

function AddTokenModal({ onAdd, onClose }) {
  const [f, setF] = useState({ name:'', color:'#c9a84c', size:1, type:'player', hp:'', maxHp:'' });
  return (
    <Modal open={true} onClose={onClose} title='Place Token' width='380px'>
      <FormField label="Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} placeholder="Character or monster name" /></FormField>
      <FormField label="Color"><TokenColorPicker value={f.color} onChange={c=>setF(x=>({...x,color:c}))} /></FormField>
      <FormField label="Size (grid squares)">
        <select value={f.size} onChange={e=>setF(x=>({...x,size:parseInt(e.target.value)}))}>
          <option value={1}>1 (Small/Medium)</option>
          <option value={2}>2 (Large)</option>
          <option value={3}>3 (Huge)</option>
          <option value={4}>4 (Gargantuan)</option>
        </select>
      </FormField>
      <FormField label="Type">
        <select value={f.type} onChange={e=>setF(x=>({...x,type:e.target.value}))}>
          <option value='player'>Player</option>
          <option value='monster'>Monster</option>
          <option value='npc'>NPC</option>
        </select>
      </FormField>
      <div style={{ display:'flex', gap:'0.5rem' }}>
        <FormField label="Current HP"><input type="number" value={f.hp} onChange={e=>setF(x=>({...x,hp:e.target.value}))} placeholder="Optional" /></FormField>
        <FormField label="Max HP"><input type="number" value={f.maxHp} onChange={e=>setF(x=>({...x,maxHp:e.target.value}))} placeholder="Optional" /></FormField>
      </div>
      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={() => onAdd({...f,hp:f.hp?parseInt(f.hp):undefined,maxHp:f.maxHp?parseInt(f.maxHp):undefined})} disabled={!f.name}>Place</Btn>
      </div>
    </Modal>
  );
}

function NewMapForm({ onSave, onClose }) {
  const [f, setF] = useState({ name:'', cols:20, rows:15, bgColor:'#1a1a2e' });
  return (
    <Modal open={true} onClose={onClose} title='New Map' width='400px'>
      <FormField label="Map Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} placeholder="Goblin Cave, Tavern Interior…" /></FormField>
      <div style={{ display:'flex', gap:'0.5rem' }}>
        <FormField label="Columns"><input type="number" value={f.cols} onChange={e=>setF(x=>({...x,cols:parseInt(e.target.value)||20}))} min={5} max={50} /></FormField>
        <FormField label="Rows"><input type="number" value={f.rows} onChange={e=>setF(x=>({...x,rows:parseInt(e.target.value)||15}))} min={5} max={50} /></FormField>
      </div>
      <FormField label="Background Color">
        <input type="color" value={f.bgColor} onChange={e=>setF(x=>({...x,bgColor:e.target.value}))} style={{ height:'40px', padding:'0.25rem', width:'100%' }} />
      </FormField>
      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave({...f,tokens:[]})} disabled={!f.name}>Create Map</Btn>
      </div>
    </Modal>
  );
}

export default function MapsVTT({ maps, onSave, onDelete }) {
  const [activeMap, setActiveMap] = useState(null);
  const [showNew, setShowNew] = useState(false);

  const map = maps.find(m => m.id === activeMap);

  if (activeMap && map) {
    return (
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
          <Btn variant='ghost' onClick={() => setActiveMap(null)}>← Maps</Btn>
          <h2 style={{ color:'var(--gold)', flex:1 }}>{map.name}</h2>
          <Btn variant='danger' size='sm' onClick={() => { if(window.confirm('Delete this map?')){ onDelete(map.id); setActiveMap(null); }}}>Delete Map</Btn>
        </div>
        <MapCanvas map={map} onUpdate={onSave} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ color:'var(--gold)', marginBottom:'0.25rem' }}>🗺️ Maps VTT</h2>
          <div style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{maps.length} map{maps.length!==1?'s':''}</div>
        </div>
        <Btn variant='primary' onClick={() => setShowNew(true)}>+ New Map</Btn>
      </div>

      {maps.length === 0 ? (
        <EmptyState icon='🗺️' title='No maps yet' desc='Create a grid map to run battles and explore dungeons with token placement.' action={<Btn variant='primary' onClick={() => setShowNew(true)}>Create Map</Btn>} />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
          {maps.map(m => (
            <Card key={m.id} onClick={() => setActiveMap(m.id)} style={{ cursor:'pointer', textAlign:'center', padding:'1.5rem' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🗺️</div>
              <h3 style={{ fontFamily:"'Cinzel',serif", color:'var(--gold)', fontSize:'1rem', marginBottom:'0.4rem' }}>{m.name}</h3>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{m.cols}×{m.rows} grid · {(m.tokens||[]).length} tokens</div>
            </Card>
          ))}
        </div>
      )}

      {showNew && <NewMapForm onSave={m => { onSave(m); setShowNew(false); }} onClose={() => setShowNew(false)} />}
    </div>
  );
}
