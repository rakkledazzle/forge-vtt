import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import RaceBuilder       from '../../components/homebrew/RaceBuilder';
import SubraceBuilder    from '../../components/homebrew/SubraceBuilder';
import ClassBuilder      from '../../components/homebrew/ClassBuilder';
import SubclassBuilder   from '../../components/homebrew/SubclassBuilder';
import BackgroundBuilder from '../../components/homebrew/BackgroundBuilder';
import FeatBuilder       from '../../components/homebrew/FeatBuilder';
import SpellBuilder      from '../../components/homebrew/SpellBuilder';
import ItemBuilder       from '../../components/homebrew/ItemBuilder';
import MonsterBuilder    from '../../components/homebrew/MonsterBuilder';

const CATEGORY_META = {
  races:       { label:'Race',       icon:'🧬' },
  subraces:    { label:'Subrace',    icon:'🔀' },
  classes:     { label:'Class',      icon:'⚔️' },
  subclasses:  { label:'Subclass',   icon:'🎯' },
  backgrounds: { label:'Background', icon:'📖' },
  spells:      { label:'Spell',      icon:'✨' },
  items:       { label:'Item',       icon:'⚗️' },
  monsters:    { label:'Monster',    icon:'👹' },
  feats:       { label:'Feat',       icon:'🌟' },
};

export default function ForgeEditPage({ store, auth, showToast }) {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState('');

  const meta = CATEGORY_META[category] || { label: category, icon:'📜' };
  const isNew = !id || id === 'new';

  const safeHomebrew = {
    races:[], subraces:[], classes:[], subclasses:[],
    backgrounds:[], spells:[], items:[], monsters:[], feats:[],
    ...store.homebrew,
  };

  const editingItem = isNew ? null : (safeHomebrew[category]||[]).find(i => i.id === id) || null;

  async function handleSave(data) {
    const toSave = editingItem ? { ...data, id: editingItem.id } : data;
    await store.saveHomebrew(category, toSave, selectedCampaign || null);
    showToast(isNew ? `${data.name} created!` : `${data.name} saved!`);
    navigate(`/forge/${category}`);
  }

  function handleClose() {
    navigate(`/forge/${category}`);
  }

  const commonProps = {
    item: editingItem,
    onSave: handleSave,
    onClose: handleClose,
  };

  function renderBuilder() {
    switch (category) {
      case 'races':       return <RaceBuilder       {...commonProps} />;
      case 'subraces':    return <SubraceBuilder    {...commonProps} parentRaces={safeHomebrew.races} />;
      case 'classes':     return <ClassBuilder      {...commonProps} />;
      case 'subclasses':  return <SubclassBuilder   {...commonProps} parentClasses={safeHomebrew.classes} />;
      case 'backgrounds': return <BackgroundBuilder {...commonProps} />;
      case 'spells':      return <SpellBuilder      {...commonProps} />;
      case 'items':       return <ItemBuilder       {...commonProps} />;
      case 'monsters':    return <MonsterBuilder    {...commonProps} />;
      case 'feats':       return <FeatBuilder       {...commonProps} homebrew={safeHomebrew} />;
      default:
        return (
          <div className="empty-state">
            <div className="empty-state-title">Unknown category: {category}</div>
          </div>
        );
    }
  }

  return (
    <div className="content-area">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button className="breadcrumb-btn" onClick={() => navigate('/forge')}>← The Forge</button>
        <span className="breadcrumb-sep">/</span>
        <button className="breadcrumb-btn" onClick={() => navigate(`/forge/${category}`)}>
          {meta.icon} {CATEGORY_META[category]?.label + 's' || category}
        </button>
        <span className="breadcrumb-sep">/</span>
        <span>{isNew ? `New ${meta.label}` : (editingItem?.name || 'Edit')}</span>
      </div>

      <div className="page-header" style={{marginBottom:'1.5rem'}}>
        <div>
          <h1 className="page-title">{meta.icon} {isNew ? `New ${meta.label}` : `Edit ${meta.label}`}</h1>
          {!isNew && editingItem && (
            <p className="page-subtitle">Editing: {editingItem.name}</p>
          )}
        </div>
        <button className="btn-secondary" onClick={handleClose}>✕ Cancel</button>
      </div>

      {/* Campaign sharing */}
      {store.campaigns?.length > 0 && (
        <div style={{marginBottom:'1.5rem', padding:'1rem', background:'var(--card)', border:'1px solid var(--border)', borderRadius:'10px'}}>
          <label style={{fontSize:'0.78rem', color:'var(--text3)', fontFamily:"'Cinzel',serif", letterSpacing:'0.05em', textTransform:'uppercase', display:'block', marginBottom:'0.4rem'}}>
            Share with Campaign (optional)
          </label>
          <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} style={{width:'100%', maxWidth:'400px'}}>
            <option value=''>Personal only</option>
            {store.campaigns.filter(c => c.owner_id === auth.user?.id).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Builder — rendered directly on the page, no modal */}
      <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 16px var(--shadow)'}}>
        {renderBuilder()}
      </div>
    </div>
  );
}