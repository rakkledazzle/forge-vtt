import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CharacterCreator from '../components/CharacterCreator';

export default function CharacterCreatorPage({ store, auth, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editingCharacter = id ? store.characters.find(c => c.id === id) : null;

  async function handleSave(char) {
    const savedId = await store.saveCharacter(char);
    showToast(char.id ? `${char.name} saved!` : `${char.name} created!`);
    navigate(`/characters/${char.id || savedId}`);
  }

  return (
    <CharacterCreator
      onSave={handleSave}
      onClose={() => navigate(id ? `/characters/${id}` : '/characters')}
      character={editingCharacter}
      homebrew={store.homebrew}
      campaigns={store.campaigns}
      user={auth.user}
    />
  );
}