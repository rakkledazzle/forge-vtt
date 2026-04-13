// src/pages/SourcesPage.jsx
import React from 'react';

const SOURCES = [
  { category:'Core Rules', books:[
    { icon:'📖', title:"Player's Handbook",       abbr:'PHB',  year:'2014', desc:"The essential guide to creating and playing D&D characters." },
    { icon:'📗', title:"Dungeon Master's Guide",  abbr:'DMG',  year:'2014', desc:"Tools and advice for running D&D campaigns." },
    { icon:'👁️', title:"Monster Manual",          abbr:'MM',   year:'2014', desc:"Hundreds of monsters for your adventures." },
    { icon:'📘', title:"Player's Handbook",       abbr:'PHB',  year:'2024', desc:"The 2024 revised core rulebook." },
  ]},
  { category:'Supplements', books:[
    { icon:'📙', title:"Xanathar's Guide to Everything", abbr:"XGtE", year:'2017', desc:"Expanded subclasses, spells, and DM tools." },
    { icon:'📕', title:"Tasha's Cauldron of Everything",  abbr:"TCoE", year:'2020', desc:"New subclasses, optional rules, and more." },
    { icon:'📓', title:"Mordenkainen's Tome of Foes",     abbr:"MToF", year:'2018', desc:"Lore and monsters from across the planes." },
    { icon:'📔', title:"Volo's Guide to Monsters",        abbr:"VGtM", year:'2016', desc:"In-depth monster lore and new creature types." },
  ]},
];

export default function SourcesPage() {
  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 Official Sources</h1>
          <p className="page-subtitle">Reference material from official D&D 5e publications</p>
        </div>
      </div>

      {SOURCES.map(section => (
        <div key={section.category} style={{marginBottom:'2rem'}}>
          <div className="section-header" style={{marginBottom:'1rem'}}>
            <div className="section-title">{section.category}</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'12px'}}>
            {section.books.map(book => (
              <div key={book.abbr + book.year} className="card" style={{padding:'1rem', display:'flex', gap:'12px', alignItems:'flex-start'}}>
                <div style={{fontSize:'2rem', flexShrink:0}}>{book.icon}</div>
                <div>
                  <div style={{fontFamily:"'Cinzel',serif", fontSize:'0.9rem', fontWeight:700, color:'var(--accent)', marginBottom:'3px'}}>{book.title}</div>
                  <div style={{display:'flex', gap:'6px', marginBottom:'6px'}}>
                    <span style={{fontSize:'10px', padding:'1px 6px', borderRadius:'6px', background:'var(--bg2)', color:'var(--text3)', fontWeight:700}}>{book.abbr}</span>
                    <span style={{fontSize:'10px', padding:'1px 6px', borderRadius:'6px', background:'var(--bg2)', color:'var(--text3)'}}>{book.year}</span>
                  </div>
                  <div style={{fontSize:'0.78rem', color:'var(--text3)', lineHeight:1.4}}>{book.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{padding:'2rem', background:'var(--card)', border:'1px dashed var(--border)', borderRadius:'10px', textAlign:'center', color:'var(--text3)'}}>
        <div style={{fontSize:'1.5rem', marginBottom:'0.5rem'}}>📖</div>
        <div style={{fontFamily:"'Cinzel',serif", fontSize:'0.9rem', marginBottom:'0.4rem', color:'var(--text2)'}}>More content coming soon</div>
        <div style={{fontSize:'0.82rem'}}>Integrated rule lookups, spell lists, and more will be added here.</div>
      </div>
    </div>
  );
}