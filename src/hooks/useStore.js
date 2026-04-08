import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

export function useStore(user) {
  const [characters, setCharacters] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [homebrew, setHomebrew] = useState({ races:[], classes:[], backgrounds:[], items:[], spells:[], monsters:[], feats:[] });
  const [maps, setMaps] = useState([]);
  const [initiative, setInitiative] = useState({ combatants:[], round:0, activeIndex:0, active:false });
  const [loading, setLoading] = useState(true);

  // Load all data on login
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function loadAll() {
      setLoading(true);
      await Promise.all([loadCharacters(), loadCampaigns(), loadHomebrew(), loadMaps()]);
      setLoading(false);
    }
    loadAll();
  }, [user]);

  // Characters
  async function loadCharacters() {
    const { data } = await supabase.from('characters').select('*').order('created_at');
    if (data) setCharacters(data.map(r => ({ ...r.data, id: r.id })));
  }

  const saveCharacter = useCallback(async (char) => {
    const { id, ...data } = char;
    if (id && characters.find(c => c.id === id)) {
      await supabase.from('characters').update({ data: { ...data, id } }).eq('id', id);
      setCharacters(cs => cs.map(c => c.id === id ? { ...data, id } : c));
      return id;
    } else {
      const { data: rows } = await supabase.from('characters')
        .insert({ user_id: user.id, data: { ...data } }).select();
      if (rows?.[0]) {
        const newChar = { ...data, id: rows[0].id };
        setCharacters(cs => [...cs, newChar]);
        return rows[0].id;
      }
    }
  }, [user, characters]);

  const deleteCharacter = useCallback(async (id) => {
    await supabase.from('characters').delete().eq('id', id);
    setCharacters(cs => cs.filter(c => c.id !== id));
  }, []);

  // Campaigns
  async function loadCampaigns() {
    const { data } = await supabase.from('campaigns').select('*, campaign_members(*)').order('created_at');
    if (data) setCampaigns(data.map(r => ({ ...r.data, id: r.id, invite_code: r.invite_code, members: r.campaign_members })));
  }

  const saveCampaign = useCallback(async (campaign) => {
    const { id, invite_code, members, ...data } = campaign;
    if (id && campaigns.find(c => c.id === id)) {
      await supabase.from('campaigns').update({ data: { ...data, id } }).eq('id', id);
      setCampaigns(cs => cs.map(c => c.id === id ? { ...data, id, invite_code, members } : c));
      return id;
    } else {
      const { data: rows } = await supabase.from('campaigns')
        .insert({ owner_id: user.id, data: { ...data } }).select();
      if (rows?.[0]) {
        // Auto-add creator as DM
        await supabase.from('campaign_members').insert({ campaign_id: rows[0].id, user_id: user.id, role: 'dm' });
        const newCampaign = { ...data, id: rows[0].id, invite_code: rows[0].invite_code, members: [] };
        setCampaigns(cs => [...cs, newCampaign]);
        return rows[0].id;
      }
    }
  }, [user, campaigns]);

  const deleteCampaign = useCallback(async (id) => {
    await supabase.from('campaigns').delete().eq('id', id);
    setCampaigns(cs => cs.filter(c => c.id !== id));
  }, []);

  const joinCampaign = useCallback(async (inviteCode) => {
    const { data: camp } = await supabase.from('campaigns').select('*').eq('invite_code', inviteCode.toUpperCase()).single();
    if (!camp) throw new Error('Campaign not found. Check your code and try again.');
    const { error } = await supabase.from('campaign_members').insert({ campaign_id: camp.id, user_id: user.id, role: 'player' });
    if (error && error.code === '23505') throw new Error('You are already in this campaign.');
    if (error) throw error;
    await loadCampaigns();
    return camp;
  }, [user]);

  // Homebrew
  async function loadHomebrew() {
    const { data } = await supabase.from('homebrew').select('*').order('created_at');
    if (data) {
      const grouped = { races:[], classes:[], backgrounds:[], items:[], spells:[], monsters:[], feats:[] };
      data.forEach(r => { if (grouped[r.type]) grouped[r.type].push({ ...r.data, id: r.id }); });
      setHomebrew(grouped);
    }
  }

  const saveHomebrew = useCallback(async (type, item) => {
    const { id, ...data } = item;
    if (id && homebrew[type]?.find(i => i.id === id)) {
      await supabase.from('homebrew').update({ data: { ...data, id } }).eq('id', id);
      setHomebrew(hb => ({ ...hb, [type]: hb[type].map(i => i.id === id ? { ...data, id } : i) }));
      return id;
    } else {
      const { data: rows } = await supabase.from('homebrew')
        .insert({ user_id: user.id, type, data: { ...data } }).select();
      if (rows?.[0]) {
        const newItem = { ...data, id: rows[0].id };
        setHomebrew(hb => ({ ...hb, [type]: [...(hb[type] || []), newItem] }));
        return rows[0].id;
      }
    }
  }, [user, homebrew]);

  const deleteHomebrew = useCallback(async (type, id) => {
    await supabase.from('homebrew').delete().eq('id', id);
    setHomebrew(hb => ({ ...hb, [type]: hb[type].filter(i => i.id !== id) }));
  }, []);

  // Maps
  async function loadMaps() {
    const { data } = await supabase.from('maps').select('*').order('created_at');
    if (data) setMaps(data.map(r => ({ ...r.data, id: r.id, image_url: r.image_url })));
  }

  const saveMap = useCallback(async (map) => {
    const { id, image_url, ...data } = map;
    if (id && maps.find(m => m.id === id)) {
      await supabase.from('maps').update({ data: { ...data, id }, image_url }).eq('id', id);
      setMaps(ms => ms.map(m => m.id === id ? { ...data, id, image_url } : m));
      return id;
    } else {
      const { data: rows } = await supabase.from('maps')
        .insert({ owner_id: user.id, data: { ...data }, image_url }).select();
      if (rows?.[0]) {
        const newMap = { ...data, id: rows[0].id, image_url };
        setMaps(ms => [...ms, newMap]);
        return rows[0].id;
      }
    }
  }, [user, maps]);

  const deleteMap = useCallback(async (id) => {
    await supabase.from('maps').delete().eq('id', id);
    setMaps(ms => ms.filter(m => m.id !== id));
  }, []);

  // Initiative (local only, not persisted)
  const addCombatant = useCallback((combatant) => {
    const id = `comb_${Date.now()}`;
    setInitiative(s => ({ ...s, combatants: [...s.combatants, { ...combatant, id, conditions:[] }].sort((a,b) => b.initiative - a.initiative) }));
  }, []);

  const removeCombatant = useCallback((id) => {
    setInitiative(s => { const list = s.combatants.filter(c => c.id !== id); return { ...s, combatants: list, activeIndex: Math.min(s.activeIndex, Math.max(0, list.length-1)) }; });
  }, []);

  const updateCombatant = useCallback((id, changes) => {
    setInitiative(s => ({ ...s, combatants: s.combatants.map(c => c.id === id ? { ...c, ...changes } : c) }));
  }, []);

  const nextTurn = useCallback(() => {
    setInitiative(s => { if (!s.combatants.length) return s; const next = (s.activeIndex+1) % s.combatants.length; return { ...s, activeIndex: next, round: next === 0 ? s.round+1 : s.round }; });
  }, []);

  const prevTurn = useCallback(() => {
    setInitiative(s => { if (!s.combatants.length) return s; return { ...s, activeIndex: (s.activeIndex-1+s.combatants.length) % s.combatants.length }; });
  }, []);

  const startCombat = useCallback(() => setInitiative(s => ({ ...s, active:true, round:1, activeIndex:0 })), []);
  const endCombat = useCallback(() => setInitiative({ combatants:[], round:0, activeIndex:0, active:false }), []);
  const sortByInitiative = useCallback(() => setInitiative(s => ({ ...s, combatants: [...s.combatants].sort((a,b) => b.initiative - a.initiative) })), []);

  return {
    loading,
    characters, saveCharacter, deleteCharacter,
    campaigns, saveCampaign, deleteCampaign, joinCampaign,
    homebrew, saveHomebrew, deleteHomebrew,
    maps, saveMap, deleteMap,
    initiative, addCombatant, removeCombatant, updateCombatant,
    nextTurn, prevTurn, startCombat, endCombat, sortByInitiative,
  };
}

export default useStore;