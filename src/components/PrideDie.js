import React from 'react';

export function PrideDie({ size = 48, animated = false }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style={animated ? { filter:'drop-shadow(0 0 8px rgba(255,180,0,0.4))', animation:'pulse 3s ease-in-out infinite' } : {}}>
      <defs>
        <linearGradient id="prideGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"    stopColor="#e40303"/>
          <stop offset="20%"   stopColor="#ff8c00"/>
          <stop offset="40%"   stopColor="#ffed00"/>
          <stop offset="60%"   stopColor="#008026"/>
          <stop offset="80%"   stopColor="#004dff"/>
          <stop offset="100%"  stopColor="#750787"/>
        </linearGradient>
      </defs>
      <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="url(#prideGrad)" />
      <g stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none">
        <polygon points="50,5 95,30 5,30" />
        <line x1="5" y1="30" x2="50" y2="55"/>
        <line x1="95" y1="30" x2="50" y2="55"/>
        <line x1="50" y1="55" x2="5" y2="70"/>
        <line x1="50" y1="55" x2="95" y2="70"/>
        <line x1="5" y1="70" x2="50" y2="95"/>
        <line x1="95" y1="70" x2="50" y2="95"/>
      </g>
      <text x="50" y="52" textAnchor="middle" dominantBaseline="middle"
        fontSize="22" fontWeight="900" fontFamily="'Cinzel', serif"
        fill="white">20</text>
    </svg>
  );
}

export default function ForgeLogo({ height = 48 }) {
  const scale = height / 48;
  return (
    <svg width={180 * scale} height={height} viewBox="0 0 180 48" xmlns="http://www.w3.org/2000/svg">
      {/* Dragon head silhouette */}
      <g fill="var(--accent)" transform={`scale(${scale})`}>
        <path d="M8,38 C8,38 4,32 5,26 C6,20 10,16 14,14 C12,12 11,9 13,7 C15,5 18,6 19,8 C21,5 25,4 28,6 C26,4 26,1 29,1 C32,1 33,4 31,6 C34,5 37,7 36,10 C39,8 42,9 41,12 C44,10 46,12 44,15 C47,14 48,17 46,19 C48,19 49,22 46,23 C48,24 47,27 44,27 C45,30 43,33 40,33 C40,36 37,38 34,37 C32,40 28,41 25,39 C22,42 17,42 14,39 C11,40 8,38 8,38 Z"/>
        {/* Eye */}
        <circle cx="35" cy="14" r="2" fill="var(--bg)"/>
        <circle cx="35.5" cy="13.5" r="0.8" fill="var(--accent)"/>
        {/* Horn */}
        <path d="M29,1 C29,1 27,-3 31,-4 C33,-3 32,1 29,1 Z" fill="var(--accent)"/>
        {/* Wing hint */}
        <path d="M15,20 C10,16 4,18 2,24 C6,22 10,23 12,27 C13,24 14,21 15,20 Z" fill="var(--accent)" opacity="0.7"/>
        {/* Flame */}
        <path d="M8,38 C6,40 3,42 5,45 C6,43 8,42 9,40 C9,43 10,46 13,46 C11,44 11,41 12,39 C13,42 15,44 17,43 C15,41 14,38 14,36 Z" fill="var(--accent2)" opacity="0.85"/>
      </g>
      {/* "THE FORGE" text */}
      <text x={58 * scale} y={16 * scale} fontFamily="'Cinzel', serif" fontSize={9 * scale} fontWeight="400" fill="var(--text3)" letterSpacing={`${3 * scale}`}>THE</text>
      <text x={56 * scale} y={34 * scale} fontFamily="'Cinzel Decorative', serif" fontSize={18 * scale} fontWeight="700" fill="var(--accent)" letterSpacing={`${1 * scale}`}>FORGE</text>
    </svg>
  );
}