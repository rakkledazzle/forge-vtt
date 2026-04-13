import React from 'react';
import CampaignManager from '../components/CampaignManager';

export default function CampaignsPage({ store, auth, showToast }) {
  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">
            {store.campaigns.length === 0
              ? 'No campaigns yet — start your story!'
              : `${store.campaigns.length} campaign${store.campaigns.length!==1?'s':''} in progress`}
          </p>
        </div>
      </div>
      <CampaignManager
        campaigns={store.campaigns}
        onSave={store.saveCampaign}
        onDelete={store.deleteCampaign}
        onJoin={store.joinCampaign}
        user={auth.user}
        maps={store.maps}
        onSaveMap={store.saveMap}
        onDeleteMap={store.deleteMap}
        initiative={store.initiative}
        characters={store.characters}
        onAddCombatant={store.addCombatant}
        onRemoveCombatant={store.removeCombatant}
        onUpdateCombatant={store.updateCombatant}
        onNextTurn={store.nextTurn}
        onPrevTurn={store.prevTurn}
        onStartCombat={store.startCombat}
        onEndCombat={store.endCombat}
        onSortInitiative={store.sortByInitiative}
        getCampaignCharacters={store.getCampaignCharacters}
        addCharacterToCampaign={store.addCharacterToCampaign}
        removeCharacterFromCampaign={store.removeCharacterFromCampaign}
      />
    </div>
  );
}