import React, { useRef, useState, useEffect } from 'react';
import { Card, Btn, Modal, FormField, EmptyState } from './UI';
import { supabase } from '../supabase';

const GRID = 40;
const COLORS = ['#c9a84c','#e74c3c','#2ecc71','#3498db','#9b59b6','#f39c12','#1abc9c','#e67e22','#ecf0f1','#95a5a6'];

function TokenColorPicker({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
      {COLORS.map(c => (
        <div key={c} onClick={() => onChange(c)}
          style={{ width:'24px', height:'24px', borderRadius:'50%', background:c, cursor:'pointer',
            border:`2px solid ${value===c?'#2a2118':'transparent'}` }} />
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
  const bgImageRef = useRef(null);

  const cols = map.cols || 20;
  const rows = map.rows || 15;
  const W = cols * GRID;
  const H = rows * GRID;

  // Load background image if present
  useEffect(() => {
    if (map.image_url) {
      const img = new Image();
      img.onload = () => { bgImageRef.current = img; };
      img.src = map.image_url;
    } else {
      bgImageRef.current = null;
    }
  }, [map.image_url]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    draw(c.getContext('2d'));
  });

  function draw(ctx) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    // Background image or color
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, W, H);
    } else {
      ctx.fillStyle = map.bgColor || '#e8e0d0';
      ctx.fillRect(0, 0, W, H);
    }
    // Grid
    ctx.strokeStyle = bgImageRef.current ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) { ctx.beginPath(); ctx.moveTo(x*GRID,0); ctx.lineTo(x*GRID,H); ctx.stroke(); }
    for (let y = 0; y <= rows; y++) { ctx.beginPath(); ctx.moveTo(0,y*GRID); ctx.lineTo(W,y*GRID); ctx.stroke(); }
    // Tokens
    tokens.forEach(token => {
      const x = token.gx * GRID;
      const y = token.gy * GRID;
      const r = (token.size || 1) * GRID / 2 - 3;
      ctx.shadowColor = token.color || '#c9a84c';
      ctx.shadowBlur = selected === token.id ? 12 : 4;
      ctx.fillStyle = token.color || '#c9a84c';
      ctx.beginPath();
      ctx.arc(x + GRID/2, y + GRID/2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = selected === token.id ? '#2a2118' : 'rgba(0,0,0,0.3)';
      ctx.lineWidth = selected === token.id ? 2.5 : 1.5;
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.font = `bold ${Math.max(10,r*0.8)}px 'Cinzel', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(token.name?.slice(0,2).toUpperCase() || '?', x + GRID/2, y + GRID/2);
      if (token.hp !== undefined && token.maxHp > 0) {
        const pct = Math.max(0, Math.min(1, token.hp / token.maxHp));
        const barW = GRID * (token.size||1) - 8;
        const barY = y + GRID*(token.size||1) - 8;
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 4, barY, barW, 4);
        ctx.fillStyle = pct > 0.5 ? '#16a34a' : pct > 0.25 ? '#d97706' : '#dc2626';
        ctx.fillRect(x + 4, barY, barW * pct, 4);
      }
    });
  }

  function getCell(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { gx: Math.floor((e.clientX - rect.left) / GRID), gy: Math.floor((e.clientY - rect.top) / GRID) };
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
    if (dragging) { onUpdate({ ...map, tokens }); setDragging(null); }
  }

  function addToken(form) {
    const newTokens = [...tokens, {
      id: `tok_${Date.now()}`, name: form.name, color: form.color,
      gx: addForm.gx, gy: addForm.gy, size: form.size||1,
      hp: form.hp||undefined, maxHp: form.maxHp||undefined, type: form.type||'player'
    }];
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
            {t==='select'?'🖱 Select':t==='add'?'+ Token':'🗑 Delete'}
          </Btn>
        ))}
        {selectedToken && (
          <div style={{ marginLeft:'1rem', display:'flex', gap:'0.5rem', alignItems:'center', fontSize:'0.82rem' }}>
            <strong style={{ color:'var(--gold)' }}>{selectedToken.name}</strong>
            {selectedToken.hp !== undefined && (
              <>
                <span>HP:</span>
                <input type="number" value={selectedToken.hp||0}
                  onChange={e => { const nt=tokens.map(t=>t.id===selected?{...t,hp:parseInt(e.target.value)||0}:t); setTokens(nt); onUpdate({...map,tokens:nt}); }}
                  style={{ width:'55px', padding:'0.15rem' }} />
                <span>/{selectedToken.maxHp}</span>
              </>
            )}
            <Btn size='sm' variant='danger' onClick={() => { const nt=tokens.filter(t=>t.id!==selected); setTokens(nt); setSelected(null); onUpdate({...map,tokens:nt}); }}>Remove</Btn>
          </div>
        )}
      </div>
      <div style={{ overflow:'auto', border:'1px solid var(--border)', borderRadius:'var(--radius)', maxHeight:'65vh' }}>
        <canvas ref={canvasRef} width={W} height={H}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
          style={{ display:'block', cursor: tool==='add'?'crosshair':tool==='delete'?'not-allowed':'default' }} />
      </div>
      <div style={{ marginTop:'0.5rem', fontSize:'0.75rem', color:'var(--text-muted)' }}>
        {cols}×{rows} grid · {tokens.length} token{tokens.length!==1?'s':''} · Tool: {tool}
      </div>
      {addForm && <AddTokenModal onAdd={addToken} onClose={() => setAddForm(null)} />}
    </div>
  );
}

function AddTokenModal({ onAdd, onClose }) {
  const [f, setF] = useState({ name:'', color:'#c9a84c', size:1, type:'player', hp:'', maxHp:'' });
  return (
    <Modal open={true} onClose={onClose} title='Place Token' width='380px'>
      <FormField label="Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} placeholder="Character or monster name" /></FormField>
      <FormField label="Color"><TokenColorPicker value={f.color} onChange={c=>setF(x=>({...x,color:c}))} /></FormField>
      <FormField label="Size">
        <select value={f.size} onChange={e=>setF(x=>({...x,size:parseInt(e.target.value)}))}>
          <option value={1}>1 — Small/Medium</option>
          <option value={2}>2 — Large</option>
          <option value={3}>3 — Huge</option>
          <option value={4}>4 — Gargantuan</option>
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
  const [f, setF] = useState({ name:'', cols:20, rows:15, bgColor:'#e8e0d0' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  function handleImagePick(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setUploading(true);
    let image_url = null;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `maps/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('maps').upload(path, imageFile);
      if (!error) {
        const { data } = supabase.storage.from('maps').getPublicUrl(path);
        image_url = data.publicUrl;
      }
    }
    onSave({ ...f, tokens:[], image_url });
    setUploading(false);
  }

  return (
    <Modal open={true} onClose={onClose} title='New Map' width='440px'>
      <FormField label="Map Name">
        <input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} placeholder="Goblin Cave, Tavern Interior…" />
      </FormField>
      <div style={{ display:'flex', gap:'0.5rem' }}>
        <FormField label="Columns">
          <input type="number" value={f.cols} onChange={e=>setF(x=>({...x,cols:parseInt(e.target.value)||20}))} min={5} max={60} />
        </FormField>
        <FormField label="Rows">
          <input type="number" value={f.rows} onChange={e=>setF(x=>({...x,rows:parseInt(e.target.value)||15}))} min={5} max={60} />
        </FormField>
      </div>

      <FormField label="Map Image (optional)">
        <input type="file" accept="image/*" onChange={handleImagePick}
          style={{ padding:'0.4rem', fontSize:'0.85rem' }} />
        {preview && (
          <img src={preview} alt="preview"
            style={{ marginTop:'0.5rem', width:'100%', maxHeight:'140px', objectFit:'cover', borderRadius:'6px', border:'1px solid var(--border)' }} />
        )}
      </FormField>

      {!imageFile && (
        <FormField label="Background Color">
          <input type="color" value={f.bgColor} onChange={e=>setF(x=>({...x,bgColor:e.target.value}))}
            style={{ height:'40px', padding:'0.25rem', width:'100%' }} />
        </FormField>
      )}

      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={handleSave} disabled={!f.name || uploading}>
          {uploading ? 'Uploading...' : 'Create Map'}
        </Btn>
      </div>
    </Modal>
  );
}

function UploadImageButton({ map, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `maps/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('maps').upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from('maps').getPublicUrl(path);
      onUpdate({ ...map, image_url: data.publicUrl });
    }
    setUploading(false);
    e.target.value = '';
  }

  return (
    <>
      <Btn variant='ghost' size='sm' onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? 'Uploading...' : '🖼 Change Image'}
      </Btn>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleUpload} />
    </>
  );
}

export default function MapsVTT({ maps, onSave, onDelete }) {
  const [activeMap, setActiveMap] = useState(null);
  const [showNew, setShowNew] = useState(false);

  const map = maps.find(m => m.id === activeMap);

  if (activeMap && map) {
    return (
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          <Btn variant='ghost' onClick={() => setActiveMap(null)}>← Maps</Btn>
          <h2 style={{ color:'var(--gold)', flex:1 }}>{map.name}</h2>
          <UploadImageButton map={map} onUpdate={onSave} />
          {map.image_url && (
            <Btn variant='ghost' size='sm' onClick={() => onSave({ ...map, image_url: null })}>🗑 Remove Image</Btn>
          )}
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
        <EmptyState icon='🗺️' title='No maps yet'
          desc='Create a grid map and optionally upload an image as the background.'
          action={<Btn variant='primary' onClick={() => setShowNew(true)}>Create Map</Btn>}
        />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
          {maps.map(m => (
            <Card key={m.id} onClick={() => setActiveMap(m.id)} style={{ cursor:'pointer', padding:'0' }}>
              {m.image_url ? (
                <img src={m.image_url} alt={m.name}
                  style={{ width:'100%', height:'120px', objectFit:'cover', borderRadius:'12px 12px 0 0' }} />
              ) : (
                <div style={{ width:'100%', height:'120px', background: m.bgColor||'#e8e0d0', borderRadius:'12px 12px 0 0',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>🗺️</div>
              )}
              <div style={{ padding:'0.85rem' }}>
                <h3 style={{ fontFamily:"'Cinzel',serif", color:'var(--gold)', fontSize:'0.95rem', marginBottom:'0.3rem' }}>{m.name}</h3>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{m.cols}×{m.rows} · {(m.tokens||[]).length} tokens</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showNew && <NewMapForm onSave={m => { onSave(m); setShowNew(false); }} onClose={() => setShowNew(false)} />}
    </div>
  );
}