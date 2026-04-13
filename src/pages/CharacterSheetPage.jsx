// src/pages/CharacterSheetPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CharacterSheet from '../components/CharacterSheet';

export default function CharacterSheetPage({ store, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const character = store.characters.find(c => c.id === id);

  if (!character) {
    return (
      <div className="content-area">
        <div className="empty-state">
          <div className="empty-state-icon">⚔️</div>
          <div className="empty-state-title">Character Not Found</div>
          <button className="btn-primary" onClick={() => navigate('/characters')}>← Back to Characters</button>
        </div>
      </div>
    );
  }

  async function handleUpdate(updatedChar) {
    await store.saveCharacter(updatedChar);
    showToast(`${updatedChar.name} saved!`);
  }

  async function handleDelete() {
    if (window.confirm(`Delete ${character.name}? This cannot be undone.`)) {
      await store.deleteCharacter(id);
      showToast('Character deleted.');
      navigate('/characters');
    }
  }

  return (
    <div className="content-area">
      <div className="breadcrumb">
        <button className="breadcrumb-btn" onClick={() => navigate('/characters')}>← All Characters</button>
        <span className="breadcrumb-sep">/</span>
        <span>{character.name}</span>
      </div>
      <CharacterSheet
        character={character}
        onUpdate={handleUpdate}
        onEdit={() => navigate(`/characters/${id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}