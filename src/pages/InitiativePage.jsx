// src/pages/InitiativePage.jsx
import React from 'react';
import InitiativeTracker from '../components/InitiativeTracker';

export default function InitiativePage({ store }) {
  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Initiative Tracker</h1>
          <p className="page-subtitle">
            {store.initiative.active
              ? `⚔️ Combat active — Round ${store.initiative.round}`
              : 'Add combatants and start combat'}
          </p>
        </div>
      </div>
      <InitiativeTracker
        initiative={store.initiative}
        characters={store.characters}
        onAdd={store.addCombatant}
        onRemove={store.removeCombatant}
        onUpdate={store.updateCombatant}
        onNext={store.nextTurn}
        onPrev={store.prevTurn}
        onStart={store.startCombat}
        onEnd={store.endCombat}
        onSort={store.sortByInitiative}
      />
    </div>
  );
}