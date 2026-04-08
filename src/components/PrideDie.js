import React from 'react';

export default function PrideDie({ size = 48, animated = false }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style={animated ? { filter:'drop-shadow(0 0 8px rgba(255,180,0,0.4))', animation:'pulse 3s ease-in-out infinite' } : {}}>
      <defs>
        <clipPath id="d20clip">
          {/* D20 polygon path */}
          <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" />
        </clipPath>
        <linearGradient id="prideGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"    stopColor="#e40303"/>
          <stop offset="20%"   stopColor="#ff8c00"/>
          <stop offset="40%"   stopColor="#ffed00"/>
          <stop offset="60%"   stopColor="#008026"/>
          <stop offset="80%"   stopColor="#004dff"/>
          <stop offset="100%"  stopColor="#750787"/>
        </linearGradient>
      </defs>
      {/* Base hexagon filled with pride gradient */}
      <polygon points="50,5 95,30 95,70 50,95 5,70 5,30"
        fill="url(#prideGrad)" />
      {/* D20 face lines */}
      <g stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none">
        {/* Top triangle */}
        <polygon points="50,5 95,30 5,30" />
        {/* Middle band */}
        <line x1="5" y1="30" x2="50" y2="55"/>
        <line x1="95" y1="30" x2="50" y2="55"/>
        {/* Bottom */}
        <line x1="50" y1="55" x2="5" y2="70"/>
        <line x1="50" y1="55" x2="95" y2="70"/>
        <line x1="5" y1="70" x2="50" y2="95"/>
        <line x1="95" y1="70" x2="50" y2="95"/>
      </g>
      {/* "20" text */}
      <text x="50" y="52" textAnchor="middle" dominantBaseline="middle"
        fontSize="22" fontWeight="900" fontFamily="'Cinzel', serif"
        fill="white" style={{textShadow:'0 1px 3px rgba(0,0,0,0.8)'}}>
        20
      </text>
    </svg>
  );
}
