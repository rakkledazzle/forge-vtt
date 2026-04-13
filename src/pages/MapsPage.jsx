import React from 'react';
import MapsVTT from '../components/MapsVTT';

export default function MapsPage({ store }) {
  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Maps & VTT</h1>
          <p className="page-subtitle">Place tokens, track positions, run encounters</p>
        </div>
      </div>
      <MapsVTT maps={store.maps} onSave={store.saveMap} onDelete={store.deleteMap} />
    </div>
  );
}