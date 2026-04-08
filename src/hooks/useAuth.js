import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  }

  async function signInWithDiscord() {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin }
    });
  }

  async function signInWithEmail(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUpWithEmail(email, password, username) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: username } }
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithDiscord,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}