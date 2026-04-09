import React, { useState, useEffect } from 'react';
import { Modal, Btn, FormField, Card, Badge } from './UI';

const VISIBLE_FIELD_OPTIONS = [
  { id: 'name', label: 'Name' },
  { id: 'race', label: 'Race' },
  { id: 'class', label: 'Class' },
  { id: 'level', label: 'Level' },
  { id: 'background', label: 'Background' },
  { id: 'alignment', label: 'Alignment' },
  { id: 'hp', label: 'HP' },
  { id: 'abilities', label: 'Ability Scores' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'personality', label: 'Personality Traits' },
  { id: 'backstory', label: 'Backstory' },
];

function AddCharacterModal({ characters, campaignId, onAdd, onClose }) {
  const [selectedChar, setSelectedChar] = useState('');
  const [visibleFields, setVisibleFields] = useState(['name', 'race', 'class', 'level']);
  const [publicInfo, setPublicInfo] = useState({ nickname:'', description:'', notes:'' });
  const [step, setStep] = useState(1);

  function toggleField(id) {
    setVisibleFields(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  }

  async function handleAdd() {
    await onAdd(campaignId, selectedChar, visibleFields, publicInfo);
    onClose();
  }

  return (
    <Modal open={true} onClose={onClose} title='Add Character to Campaign' width='520px'>
      {step === 1 && (
        <div>
          <p style={{ color:'var(--text-secondary)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            Choose which of your characters to add to this campaign.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
            {characters.length === 0 ? (
              <div style={{ color:'var(--text-muted)', textAlign:'center', padding:'2rem' }}>
                No characters yet. Create one first!
              </div>
            ) : (
              characters.map(c => (
                <div key={c.id} onClick={() => setSelectedChar(c.id)}
                  style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem', border:`2px solid ${selectedChar===c.id?'var(--gold)':'var(--border)'}`, borderRadius:'8px', cursor:'pointer', background: selectedChar===c.id?'rgba(154,111,40,0.06)':'var(--bg-card)', transition:'all 0.2s' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#9a6f28,#c9a87c)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cinzel',serif", fontWeight:700, color:'#fff' }}>
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.9rem', color:'var(--gold)' }}>{c.name}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{[c.race, c.class].filter(Boolean).join(' · ')} · Level {c.level||1}</div>
                  </div>
                  {selectedChar === c.id && <span style={{ marginLeft:'auto', color:'var(--gold)' }}>✓</span>}
                </div>
              ))
            )}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.75rem' }}>
            <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
            <Btn variant='primary' onClick={() => setStep(2)} disabled={!selectedChar}>Next →</Btn>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ color:'var(--text-secondary)', marginBottom:'1rem', fontSize:'0.95rem' }}>
            Choose what other <strong>players</strong> can see about your character. The DM can always see everything.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.5rem' }}>
            {VISIBLE_FIELD_OPTIONS.map(f => (
              <div key={f.id} onClick={() => toggleField(f.id)}
                style={{ padding:'0.4rem 0.85rem', borderRadius:'20px', border:`1.5px solid ${visibleFields.includes(f.id)?'var(--gold)':'var(--border)'}`, background: visibleFields.includes(f.id)?'rgba(154,111,40,0.1)':'transparent', cursor:'pointer', fontSize:'0.82rem', color: visibleFields.includes(f.id)?'var(--gold)':'var(--text-muted)', transition:'all 0.2s', fontFamily:"'Cinzel',serif" }}>
                {f.label}
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', gap:'0.75rem' }}>
            <Btn variant='ghost' onClick={() => setStep(1)}>← Back</Btn>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
              <Btn variant='primary' onClick={() => setStep(3)}>Next →</Btn>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p style={{ color:'var(--text-secondary)', marginBottom:'1rem', fontSize:'0.95rem' }}>
            Optionally fill out a public info card — a brief description other players will see.
          </p>
          <FormField label="Nickname / Known As">
            <input value={publicInfo.nickname} onChange={e => setPublicInfo(p => ({...p, nickname: e.target.value}))} placeholder="What do others call you?" />
          </FormField>
          <FormField label="Public Description">
            <textarea value={publicInfo.description} onChange={e => setPublicInfo(p => ({...p, description: e.target.value}))} rows={3} placeholder="What do other adventurers notice about you at first glance?" />
          </FormField>
          <FormField label="What Others Know">
            <textarea value={publicInfo.notes} onChange={e => setPublicInfo(p => ({...p, notes: e.target.value}))} rows={2} placeholder="Any info your character has shared with the party…" />
          </FormField>
          <div style={{ display:'flex', justifyContent:'space-between', gap:'0.75rem', marginTop:'0.5rem' }}>
            <Btn variant='ghost' onClick={() => setStep(2)}>← Back</Btn>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
              <Btn variant='primary' onClick={handleAdd}>Add to Campaign</Btn>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function PartyRoster({ campaignId, isOwner, currentUserId, getCampaignCharacters, onAdd, characters, onRemove }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    load();
  }, [campaignId]);

  async function load() {
    setLoading(true);
    const data = await getCampaignCharacters(campaignId);
    setRoster(data);
    setLoading(false);
  }

  async function handleAdd(campaignId, characterId, visibleFields, publicInfo) {
    await onAdd(campaignId, characterId, visibleFields, publicInfo);
    await load();
  }

  async function handleRemove(campaignId, characterId) {
    if (window.confirm('Remove this character from the campaign?')) {
      await onRemove(campaignId, characterId);
      await load();
    }
  }

  if (loading) return <div style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Loading party...</div>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
        <h4 style={{ color:'var(--gold)', fontFamily:"'Cinzel',serif" }}>Party Roster</h4>
        <Btn variant='primary' size='sm' onClick={() => setShowAdd(true)}>+ Add My Character</Btn>
      </div>

      {roster.length === 0 ? (
        <div style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center', padding:'2rem', border:'1px dashed var(--border)', borderRadius:'8px' }}>
          No characters added yet. Add your character to join the party!
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'0.75rem' }}>
          {roster.map(cc => {
            const char = cc.characters;
            const isOwnerOfChar = cc.user_id === currentUserId;
            const canSeeAll = isOwner || isOwnerOfChar;
            const visible = cc.visible_fields || [];

            return (
              <Card key={cc.id} style={{ padding:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#9a6f28,#c9a87c)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cinzel',serif", fontWeight:700, color:'#fff', fontSize:'0.85rem' }}>
                      {char?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.88rem', color:'var(--gold)' }}>
                        {canSeeAll || visible.includes('name') ? char?.name : (cc.public_info?.nickname || 'Unknown Adventurer')}
                      </div>
                      {(canSeeAll || visible.includes('class')) && (
                        <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>
                          {[canSeeAll||visible.includes('race')?char?.race:null, canSeeAll||visible.includes('class')?char?.class:null].filter(Boolean).join(' · ')}
                          {(canSeeAll||visible.includes('level')) && ` · Lv ${char?.level||1}`}
                        </div>
                      )}
                    </div>
                  </div>
                  {isOwnerOfChar && (
                    <Btn size='sm' variant='danger' onClick={() => handleRemove(campaignId, cc.character_id)}>×</Btn>
                  )}
                </div>

                {/* Public info card */}
                {cc.public_info?.description && (
                  <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontStyle:'italic', marginBottom:'0.4rem', borderLeft:'2px solid var(--gold)', paddingLeft:'0.5rem' }}>
                    "{cc.public_info.description}"
                  </p>
                )}
                {cc.public_info?.notes && (
                  <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.4rem' }}>
                    {cc.public_info.notes}
                  </p>
                )}

                {/* Visible fields badges */}
                {!canSeeAll && visible.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem', marginTop:'0.4rem' }}>
                    {visible.includes('hp') && char?.hp && (
                      <Badge color='muted'>HP: {char.hp.current}/{char.hp.max}</Badge>
                    )}
                    {visible.includes('alignment') && char?.alignment && (
                      <Badge color='muted'>{char.alignment}</Badge>
                    )}
                    {visible.includes('background') && char?.background && (
                      <Badge color='muted'>{char.background}</Badge>
                    )}
                  </div>
                )}

                {isOwner && (
                  <div style={{ marginTop:'0.5rem', fontSize:'0.72rem', color:'var(--text-muted)', fontStyle:'italic' }}>
                    DM view — full access
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {showAdd && (
        <AddCharacterModal
          characters={characters}
          campaignId={campaignId}
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}