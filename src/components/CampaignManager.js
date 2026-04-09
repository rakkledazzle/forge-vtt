import React, { useState } from 'react';
import { Card, Btn, Modal, FormField, Grid, Badge, Section, EmptyState, Tabs } from './UI';
import MapsVTT from './MapsVTT';
import InitiativeTracker from './InitiativeTracker';
import { PartyRoster } from './CharacterVisibility';

function CampaignForm({ campaign, onSave, onClose }) {
  const [f, setF] = useState(campaign || {
    name:'', setting:'', description:'', dmName:'', players:[],
    status:'Active', tone:'', themes:'', worldNotes:'', sessionNotes:'',
    npcs:[], quests:[], locations:[], sessions:[],
  });

  return (
    <div>
      <Grid cols={2}>
        <FormField label="Campaign Name"><input value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} placeholder="The Lost Mines of Phandelver…" /></FormField>
        <FormField label="Status">
          <select value={f.status} onChange={e=>setF(x=>({...x,status:e.target.value}))}>
            {['Active','On Hiatus','Completed','Planning'].map(s=><option key={s}>{s}</option>)}
          </select>
        </FormField>
      </Grid>
      <Grid cols={2}>
        <FormField label="Setting"><input value={f.setting} onChange={e=>setF(x=>({...x,setting:e.target.value}))} placeholder="Forgotten Realms, Homebrew…" /></FormField>
        <FormField label="DM Name"><input value={f.dmName} onChange={e=>setF(x=>({...x,dmName:e.target.value}))} /></FormField>
      </Grid>
      <FormField label="Description"><textarea value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))} rows={3} placeholder="The premise of your campaign…" /></FormField>
      <Grid cols={2}>
        <FormField label="Tone"><input value={f.tone||''} onChange={e=>setF(x=>({...x,tone:e.target.value}))} placeholder="Dark, comedic, epic…" /></FormField>
        <FormField label="Themes"><input value={f.themes||''} onChange={e=>setF(x=>({...x,themes:e.target.value}))} placeholder="Redemption, war, exploration…" /></FormField>
      </Grid>
      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={()=>onSave(f)} disabled={!f.name}>Save Campaign</Btn>
      </div>
    </div>
  );
}

function JoinCampaignModal({ onJoin, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!code.trim()) return;
    setError('');
    setLoading(true);
    try {
      await onJoin(code.trim());
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <p style={{ color:'var(--text-secondary)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
        Enter the invite code your DM shared with you to join their campaign.
      </p>
      <FormField label="Invite Code">
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. AB3F9C2D"
          style={{ fontFamily:"'Cinzel',serif", letterSpacing:'0.15em', fontSize:'1.1rem', textAlign:'center' }}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
        />
      </FormField>
      {error && (
        <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'6px', padding:'0.6rem 0.9rem', color:'#b91c1c', fontSize:'0.9rem', marginBottom:'0.75rem' }}>
          {error}
        </div>
      )}
      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
        <Btn variant='primary' onClick={handleJoin} disabled={!code.trim() || loading}>
          {loading ? 'Joining...' : 'Join Campaign'}
        </Btn>
      </div>
    </div>
  );
}

function InviteCodeDisplay({ code }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'#f9f6f1', border:'1px solid #d8cfc0', borderRadius:'8px', padding:'0.6rem 1rem' }}>
      <div>
        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.15rem' }}>Invite Code</div>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:'1.1rem', letterSpacing:'0.15em', color:'var(--gold)' }}>{code}</div>
      </div>
      <Btn variant='ghost' size='sm' onClick={copy} style={{ marginLeft:'auto' }}>
        {copied ? '✓ Copied!' : 'Copy'}
      </Btn>
    </div>
  );
}

function NPCCard({ npc, onUpdate, onDelete }) {
  const attitudeColor = { Friendly:'var(--emerald)', Neutral:'var(--text-muted)', Hostile:'var(--crimson-light)', Unknown:'var(--sapphire)' };
  return (
    <Card style={{ padding:'0.85rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.35rem' }}>
            <input value={npc.name} onChange={e=>onUpdate({...npc,name:e.target.value})} placeholder="NPC Name"
              style={{ fontFamily:"'Cinzel',serif", fontSize:'0.9rem', background:'transparent', border:'none', borderBottom:'1px solid var(--border)', borderRadius:0, padding:'0.1rem 0.2rem', width:'150px' }} />
            <select value={npc.attitude||'Neutral'} onChange={e=>onUpdate({...npc,attitude:e.target.value})}
              style={{ fontSize:'0.75rem', padding:'0.1rem 0.3rem', color:attitudeColor[npc.attitude||'Neutral'] }}>
              {Object.keys(attitudeColor).map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
          <input value={npc.role||''} onChange={e=>onUpdate({...npc,role:e.target.value})} placeholder="Role / Occupation"
            style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.35rem' }} />
          <textarea value={npc.notes||''} onChange={e=>onUpdate({...npc,notes:e.target.value})} rows={2} placeholder="Notes about this NPC…" style={{ fontSize:'0.82rem' }} />
        </div>
        <Btn size='sm' variant='danger' onClick={onDelete} style={{ marginLeft:'0.5rem' }}>×</Btn>
      </div>
    </Card>
  );
}

function QuestCard({ quest, onUpdate, onDelete }) {
  const statusColor = { Active:'var(--emerald)', Completed:'var(--sapphire)', Failed:'var(--crimson-light)', Inactive:'var(--text-muted)' };
  return (
    <Card style={{ padding:'0.85rem', borderLeft:`3px solid ${statusColor[quest.status]||'var(--border)'}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.4rem' }}>
            <input value={quest.title} onChange={e=>onUpdate({...quest,title:e.target.value})} placeholder="Quest title"
              style={{ fontFamily:"'Cinzel',serif", background:'transparent', border:'none', borderBottom:'1px solid var(--border)', borderRadius:0, padding:'0.1rem', flex:1 }} />
            <select value={quest.status} onChange={e=>onUpdate({...quest,status:e.target.value})}
              style={{ fontSize:'0.75rem', color:statusColor[quest.status], padding:'0.15rem 0.3rem' }}>
              {['Active','Completed','Failed','Inactive'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <textarea value={quest.description||''} onChange={e=>onUpdate({...quest,description:e.target.value})} rows={2}
            placeholder="Quest description, objectives…" style={{ fontSize:'0.82rem', marginBottom:'0.3rem' }} />
          <input value={quest.reward||''} onChange={e=>onUpdate({...quest,reward:e.target.value})}
            placeholder="Reward: 500 gp, Bag of Holding…" style={{ fontSize:'0.8rem', color:'var(--gold)' }} />
        </div>
        <Btn size='sm' variant='danger' onClick={onDelete} style={{ marginLeft:'0.5rem' }}>×</Btn>
      </div>
    </Card>
  );
}

export default function CampaignManager({ campaigns, onSave, onDelete, onJoin, user, maps, onSaveMap, onDeleteMap, initiative, characters, onAddCombatant, onRemoveCombatant, onUpdateCombatant, onNextTurn, onPrevTurn, onStartCombat, onEndCombat, onSortInitiative, getCampaignCharacters, addCharacterToCampaign, removeCharacterFromCampaign }) {  const [modal, setModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState('overview');

  const campaign = campaigns.find(c => c.id === active);
  const isOwner = campaign && user && campaign.owner_id === user.id;

  function updateCampaign(changes) { onSave({ ...campaign, ...changes }); }
  function updateNPC(npc) { updateCampaign({ npcs:(campaign.npcs||[]).map(n=>n.id===npc.id?npc:n) }); }
  function updateQuest(q) { updateCampaign({ quests:(campaign.quests||[]).map(x=>x.id===q.id?q:x) }); }

  if (active && campaign) {
    return (
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          <Btn variant='ghost' onClick={() => setActive(null)}>← Campaigns</Btn>
          <h2 style={{ color:'var(--gold)', flex:1 }}>{campaign.name}</h2>
          <Badge color={campaign.status==='Active'?'emerald':campaign.status==='Completed'?'sapphire':'muted'}>{campaign.status}</Badge>
          {isOwner && <Btn variant='ghost' size='sm' onClick={() => { setEditing(campaign); setModal(true); }}>Edit</Btn>}
          {isOwner && <Btn variant='danger' size='sm' onClick={() => { if(window.confirm('Delete this campaign?')) { onDelete(campaign.id); setActive(null); } }}>Delete</Btn>}
        </div>

        {isOwner && campaign.invite_code && (
          <div style={{ marginBottom:'1.25rem' }}>
            <InviteCodeDisplay code={campaign.invite_code} />
          </div>
        )}

        <Tabs
          tabs={[
            { id:'overview', label:'Overview' },
            { id:'npcs', label:`NPCs (${(campaign.npcs||[]).length})` },
            { id:'quests', label:`Quests (${(campaign.quests||[]).length})` },
            { id:'sessions', label:'Sessions' },
            { id:'world', label:'World' },
            { id:'maps', label:'Maps' },
            { id:'initiative', label:'Initiative' },
          ]}
          active={tab} onChange={setTab}
        />

        {tab==='overview' && (
          <div>
            <Grid cols={2} gap='1.5rem'>
              <Card>
                <h4 style={{ color:'var(--gold)', marginBottom:'0.75rem' }}>Campaign Info</h4>
                <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'0.75rem' }}>{campaign.description}</p>
                {campaign.setting && <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>Setting: <strong>{campaign.setting}</strong></div>}
                {campaign.dmName && <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>DM: <strong>{campaign.dmName}</strong></div>}
                {campaign.tone && <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>Tone: <strong>{campaign.tone}</strong></div>}
                {campaign.themes && <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>Themes: <strong>{campaign.themes}</strong></div>}
              </Card>
              <Card>
                <h4 style={{ color:'var(--gold)', marginBottom:'0.75rem' }}>Active Quests</h4>
                {(campaign.quests||[]).filter(q=>q.status==='Active').length===0
                  ? <div style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>No active quests.</div>
                  : (campaign.quests||[]).filter(q=>q.status==='Active').map(q=>(
                    <div key={q.id} style={{ padding:'0.4rem 0.75rem', borderLeft:'3px solid var(--emerald)', marginBottom:'0.5rem' }}>
                      <strong style={{ fontFamily:"'Cinzel',serif", fontSize:'0.85rem' }}>{q.title}</strong>
                      {q.reward && <div style={{ fontSize:'0.75rem', color:'var(--gold)', marginTop:'0.1rem' }}>{q.reward}</div>}
                    </div>
                  ))
                }
              </Card>
            </Grid>
            <div style={{ marginTop:'1.5rem' }}>
              <PartyRoster
                campaignId={campaign.id}
                isOwner={isOwner}
                currentUserId={user?.id}
                getCampaignCharacters={getCampaignCharacters}
                onAdd={addCharacterToCampaign}
                characters={characters}
                onRemove={removeCharacterFromCampaign}
              />
            </div>
          </div>
        )}

        {tab==='npcs' && (
          <div>
            {isOwner && (
              <div style={{ marginBottom:'1rem' }}>
                <Btn variant='primary' onClick={() => updateCampaign({ npcs:[...(campaign.npcs||[]),{id:Date.now(),name:'',role:'',notes:'',attitude:'Neutral'}] })}>+ Add NPC</Btn>
              </div>
            )}
            {(campaign.npcs||[]).length===0
              ? <EmptyState icon='🧑' title='No NPCs yet' desc='Add important NPCs to track their attitudes and notes.' />
              : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'0.75rem' }}>
                  {(campaign.npcs||[]).map(n=>(
                    <NPCCard key={n.id} npc={n} onUpdate={isOwner ? updateNPC : ()=>{}} onDelete={() => updateCampaign({ npcs:(campaign.npcs||[]).filter(x=>x.id!==n.id) })} />
                  ))}
                </div>
            }
          </div>
        )}

        {tab==='quests' && (
          <div>
            {isOwner && (
              <div style={{ marginBottom:'1rem' }}>
                <Btn variant='primary' onClick={() => updateCampaign({ quests:[...(campaign.quests||[]),{id:Date.now(),title:'',status:'Active',description:'',reward:''}] })}>+ Add Quest</Btn>
              </div>
            )}
            {(campaign.quests||[]).length===0
              ? <EmptyState icon='📜' title='No quests yet' desc='Track your active and completed quests here.' />
              : <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                  {(campaign.quests||[]).map(q=>(
                    <QuestCard key={q.id} quest={q} onUpdate={isOwner ? updateQuest : ()=>{}} onDelete={() => updateCampaign({ quests:(campaign.quests||[]).filter(x=>x.id!==q.id) })} />
                  ))}
                </div>
            }
          </div>
        )}

        {tab==='sessions' && (
          <div>
            {isOwner && (
              <div style={{ marginBottom:'1rem' }}>
                <Btn variant='primary' onClick={() => updateCampaign({ sessions:[...(campaign.sessions||[]),{id:Date.now(),number:(campaign.sessions||[]).length+1,date:new Date().toLocaleDateString(),title:'',summary:'',xpAwarded:0}] })}>+ Log Session</Btn>
              </div>
            )}
            {(campaign.sessions||[]).length===0
              ? <EmptyState icon='📓' title='No sessions logged' desc='Record what happened each session.' />
              : [...(campaign.sessions||[])].reverse().map(s=>(
                <Card key={s.id} style={{ marginBottom:'0.75rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                    <div>
                      <span style={{ color:'var(--text-muted)', fontSize:'0.78rem', marginRight:'0.5rem' }}>Session {s.number}</span>
                      <input value={s.title||''} onChange={e=>updateCampaign({sessions:(campaign.sessions||[]).map(x=>x.id===s.id?{...x,title:e.target.value}:x)})}
                        placeholder="Session title" style={{ background:'transparent', border:'none', borderBottom:'1px solid var(--border)', borderRadius:0, fontFamily:"'Cinzel',serif", fontSize:'0.9rem', color:'var(--gold)' }} />
                    </div>
                    <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                      <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{s.date}</span>
                      {isOwner && <Btn size='sm' variant='danger' onClick={()=>updateCampaign({sessions:(campaign.sessions||[]).filter(x=>x.id!==s.id)})}>×</Btn>}
                    </div>
                  </div>
                  <textarea value={s.summary||''} onChange={e=>updateCampaign({sessions:(campaign.sessions||[]).map(x=>x.id===s.id?{...x,summary:e.target.value}:x)})}
                    rows={4} placeholder="What happened this session?" style={{ fontSize:'0.85rem' }} />
                  <div style={{ marginTop:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <label style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>XP Awarded:</label>
                    <input type="number" value={s.xpAwarded||0} onChange={e=>updateCampaign({sessions:(campaign.sessions||[]).map(x=>x.id===s.id?{...x,xpAwarded:parseInt(e.target.value)||0}:x)})} style={{ width:'80px' }} />
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab==='world' && (
          <div>
            <Section title="World & Setting Notes">
              <textarea value={campaign.worldNotes||''} onChange={e=>updateCampaign({worldNotes:e.target.value})} rows={8} placeholder="History, gods, factions, geography, lore…" readOnly={!isOwner} />
            </Section>
            <Section title="Locations" action={isOwner && <Btn size='sm' variant='ghost' onClick={()=>updateCampaign({locations:[...(campaign.locations||[]),{id:Date.now(),name:'',type:'',description:'',visited:false}]})}>+ Add</Btn>}>
              {(campaign.locations||[]).map(l=>(
                <div key={l.id} style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'center' }}>
                  <input type="checkbox" checked={l.visited||false} onChange={e=>updateCampaign({locations:(campaign.locations||[]).map(x=>x.id===l.id?{...x,visited:e.target.checked}:x)})} style={{width:'auto'}} />
                  <input value={l.name||''} onChange={e=>updateCampaign({locations:(campaign.locations||[]).map(x=>x.id===l.id?{...x,name:e.target.value}:x)})} placeholder="Location name" style={{ flex:1 }} readOnly={!isOwner} />
                  <input value={l.type||''} onChange={e=>updateCampaign({locations:(campaign.locations||[]).map(x=>x.id===l.id?{...x,type:e.target.value}:x)})} placeholder="Type (city, dungeon…)" style={{ flex:1 }} readOnly={!isOwner} />
                  {isOwner && <Btn size='sm' variant='danger' onClick={()=>updateCampaign({locations:(campaign.locations||[]).filter(x=>x.id!==l.id)})}>×</Btn>}
                </div>
              ))}
            </Section>
          </div>
        )}

        {tab==='maps' && (
          <div>
            <MapsVTT
              maps={(maps||[]).filter(m => m.campaign_id === campaign.id)}
              onSave={map => onSaveMap({ ...map, campaign_id: campaign.id })}
              onDelete={onDeleteMap}
            />
          </div>
        )}

        {tab==='initiative' && (
          <div>
            <InitiativeTracker
              initiative={initiative}
              characters={characters}
              onAdd={onAddCombatant}
              onRemove={onRemoveCombatant}
              onUpdate={onUpdateCombatant}
              onNext={onNextTurn}
              onPrev={onPrevTurn}
              onStart={onStartCombat}
              onEnd={onEndCombat}
              onSort={onSortInitiative}
            />
          </div>
        )}

        <Modal open={modal} onClose={()=>{setModal(false);setEditing(null);}} title='Edit Campaign' width='700px'>
          <CampaignForm campaign={editing} onSave={c=>{onSave(c);setModal(false);setEditing(null);}} onClose={()=>{setModal(false);setEditing(null);}} />
        </Modal>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h2 style={{ color:'var(--gold)', marginBottom:'0.25rem' }}>📚 Campaign Manager</h2>
          <div style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{campaigns.length} campaign{campaigns.length!==1?'s':''}</div>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <Btn variant='ghost' onClick={() => setJoinModal(true)}>🔗 Join Campaign</Btn>
          <Btn variant='primary' onClick={() => { setEditing(null); setModal(true); }}>+ New Campaign</Btn>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState icon='🗺️' title='No campaigns yet'
          desc='Create your own campaign as DM, or join one with an invite code from your DM.'
          action={
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center' }}>
              <Btn variant='ghost' onClick={() => setJoinModal(true)}>🔗 Join Campaign</Btn>
              <Btn variant='primary' onClick={() => setModal(true)}>+ New Campaign</Btn>
            </div>
          }
        />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
          {campaigns.map(c => (
            <Card key={c.id} onClick={() => { setActive(c.id); setTab('overview'); }} style={{ cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                <h3 style={{ fontFamily:"'Cinzel',serif", color:'var(--gold)', fontSize:'1rem' }}>{c.name}</h3>
                <Badge color={c.status==='Active'?'emerald':c.status==='Completed'?'sapphire':'muted'}>{c.status}</Badge>
              </div>
              {c.setting && <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.5rem' }}>{c.setting}</div>}
              {c.description && <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'0.75rem', lineHeight:1.5 }}>{c.description.slice(0,100)}{c.description.length>100?'…':''}</p>}
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', alignItems:'center' }}>
                {c.owner_id === user?.id && <Badge color='gold'>DM</Badge>}
                {(c.members||[]).length > 0 && <Badge color='muted'>{c.members.length} members</Badge>}
                {(c.quests||[]).filter(q=>q.status==='Active').length > 0 && <Badge color='emerald'>{(c.quests||[]).filter(q=>q.status==='Active').length} quests</Badge>}
                {c.invite_code && c.owner_id === user?.id && <Badge color='muted'>Code: {c.invite_code}</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? 'Edit Campaign' : 'New Campaign'} width='700px'>
        <CampaignForm campaign={editing} onSave={c => { onSave(c); setModal(false); setEditing(null); }} onClose={() => { setModal(false); setEditing(null); }} />
      </Modal>

      <Modal open={joinModal} onClose={() => setJoinModal(false)} title='Join a Campaign' width='460px'>
        <JoinCampaignModal onJoin={onJoin} onClose={() => setJoinModal(false)} />
      </Modal>
    </div>
  );
}