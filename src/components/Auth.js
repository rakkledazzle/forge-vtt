import React, { useState } from 'react';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await onAuth.signInWithEmail(email, password);
      } else {
        await onAuth.signUpWithEmail(email, password, username);
        setMessage('Check your email for a confirmation link!');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f1eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'Crimson Pro', Georgia, serif",
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #d8cfc0',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg width="64" height="64" viewBox="0 0 100 100" style={{ marginBottom: '0.75rem' }}>
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e40303"/>
                <stop offset="20%" stopColor="#ff8c00"/>
                <stop offset="40%" stopColor="#ffed00"/>
                <stop offset="60%" stopColor="#008026"/>
                <stop offset="80%" stopColor="#004dff"/>
                <stop offset="100%" stopColor="#750787"/>
              </linearGradient>
            </defs>
            <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="url(#pg)"/>
            <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5"/>
            <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none">
              <polygon points="50,5 95,30 5,30"/>
              <line x1="5" y1="30" x2="50" y2="55"/>
              <line x1="95" y1="30" x2="50" y2="55"/>
              <line x1="50" y1="55" x2="5" y2="70"/>
              <line x1="50" y1="55" x2="95" y2="70"/>
              <line x1="5" y1="70" x2="50" y2="95"/>
              <line x1="95" y1="70" x2="50" y2="95"/>
            </g>
            <text x="50" y="57" textAnchor="middle" dominantBaseline="middle"
              fontSize="22" fontWeight="900" fontFamily="'Cinzel', serif" fill="white">20</text>
          </svg>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.5rem', fontWeight: 700, color: '#9a6f28' }}>
            The Forge
          </div>
          <div style={{ fontSize: '0.8rem', color: '#a08c72', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
            D&D 5e Companion
          </div>
        </div>

        {/* Tab toggle */}
        <div style={{ display: 'flex', background: '#f4f1eb', borderRadius: '8px', padding: '3px', marginBottom: '1.5rem' }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setMessage(''); }}
              style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontFamily: "'Cinzel', serif", fontSize: '0.78rem', letterSpacing: '0.05em',
                textTransform: 'uppercase', transition: 'all 0.2s',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#9a6f28' : '#a08c72',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* OAuth buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <button onClick={onAuth.signInWithGoogle}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              padding: '0.65rem', border: '1px solid #d8cfc0', borderRadius: '8px',
              background: '#fff', cursor: 'pointer', fontFamily: "'Crimson Pro', serif",
              fontSize: '1rem', color: '#2a2118', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9f6f1'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <button onClick={onAuth.signInWithDiscord}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              padding: '0.65rem', border: '1px solid #d8cfc0', borderRadius: '8px',
              background: '#5865F2', cursor: 'pointer', fontFamily: "'Crimson Pro', serif",
              fontSize: '1rem', color: '#fff', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#4752c4'}
            onMouseLeave={e => e.currentTarget.style.background = '#5865F2'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Continue with Discord
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#d8cfc0' }}/>
          <span style={{ fontSize: '0.8rem', color: '#a08c72' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#d8cfc0' }}/>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'signup' && (
            <input
              type="text" placeholder="Username" value={username}
              onChange={e => setUsername(e.target.value)} required
              style={{ padding: '0.65rem 0.9rem', border: '1px solid #d8cfc0', borderRadius: '8px',
                fontFamily: "'Crimson Pro', serif", fontSize: '1rem', background: '#fff', color: '#2a2118',
                outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#9a6f28'}
              onBlur={e => e.target.style.borderColor = '#d8cfc0'}
            />
          )}
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{ padding: '0.65rem 0.9rem', border: '1px solid #d8cfc0', borderRadius: '8px',
              fontFamily: "'Crimson Pro', serif", fontSize: '1rem', background: '#fff', color: '#2a2118',
              outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#9a6f28'}
            onBlur={e => e.target.style.borderColor = '#d8cfc0'}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required
            style={{ padding: '0.65rem 0.9rem', border: '1px solid #d8cfc0', borderRadius: '8px',
              fontFamily: "'Crimson Pro', serif", fontSize: '1rem', background: '#fff', color: '#2a2118',
              outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#9a6f28'}
            onBlur={e => e.target.style.borderColor = '#d8cfc0'}
          />

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px',
              padding: '0.6rem 0.9rem', color: '#b91c1c', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px',
              padding: '0.6rem 0.9rem', color: '#15803d', fontSize: '0.9rem' }}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              padding: '0.7rem', background: 'linear-gradient(135deg, #9a6f28, #7a5518)',
              border: 'none', borderRadius: '8px', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: '0.85rem', letterSpacing: '0.06em',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
            }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}