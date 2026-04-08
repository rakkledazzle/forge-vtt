import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'forge_vtt_data';

const defaultState = {
  characters: [],
  campaigns: [],
  homebrew: {
    races: [],
    classes: [],
    backgrounds: [],
    items: [],
    spells: [],
    monsters: [],
    feats: [],
  },
  initiative: {
    combatants: [],
    round: 0,
    activeIndex: 0,
    active: false,
  },
  maps: [],
  activeCampaign: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed, homebrew: { ...defaultState.homebrew, ...(parsed.homebrew || {}) } };
  } catch {
    return defaultState;
  }
}

export function useStore() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const update = useCallback((updater) => {
    setState(s => typeof updater === 'function' ? updater(s) : { ...s, ...updater });
  }, []);

  // Characters
  const saveCharacter = useCallback((char) => {
    const id = char.id || `char_${Date.now()}`;
    const now = new Date().toISOString();
    update(s => ({
      ...s,
      characters: char.id
        ? s.characters.map(c => c.id === char.id ? { ...char, updatedAt: now } : c)
        : [...s.characters, { ...char, id, createdAt: now, updatedAt: now }]
    }));
    return id;
  }, [update]);

  const deleteCharacter = useCallback((id) => {
    update(s => ({ ...s, characters: s.characters.filter(c => c.id !== id) }));
  }, [update]);

  // Campaigns
  const saveCampaign = useCallback((campaign) => {
    const id = campaign.id || `camp_${Date.now()}`;
    const now = new Date().toISOString();
    update(s => ({
      ...s,
      campaigns: campaign.id
        ? s.campaigns.map(c => c.id === campaign.id ? { ...campaign, updatedAt: now } : c)
        : [...s.campaigns, { ...campaign, id, createdAt: now, updatedAt: now }]
    }));
    return id;
  }, [update]);

  const deleteCampaign = useCallback((id) => {
    update(s => ({ ...s, campaigns: s.campaigns.filter(c => c.id !== id) }));
  }, [update]);

  // Homebrew
  const saveHomebrew = useCallback((type, item) => {
    const id = item.id || `hb_${type}_${Date.now()}`;
    const now = new Date().toISOString();
    update(s => ({
      ...s,
      homebrew: {
        ...s.homebrew,
        [type]: item.id
          ? s.homebrew[type].map(i => i.id === item.id ? { ...item, updatedAt: now } : i)
          : [...(s.homebrew[type] || []), { ...item, id, createdAt: now, updatedAt: now, source: 'Homebrew' }]
      }
    }));
    return id;
  }, [update]);

  const deleteHomebrew = useCallback((type, id) => {
    update(s => ({
      ...s,
      homebrew: { ...s.homebrew, [type]: s.homebrew[type].filter(i => i.id !== id) }
    }));
  }, [update]);

  // Initiative
  const addCombatant = useCallback((combatant) => {
    const id = `comb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    update(s => ({
      ...s,
      initiative: {
        ...s.initiative,
        combatants: [...s.initiative.combatants, { ...combatant, id, conditions: [] }]
          .sort((a, b) => b.initiative - a.initiative)
      }
    }));
  }, [update]);

  const removeCombatant = useCallback((id) => {
    update(s => {
      const newList = s.initiative.combatants.filter(c => c.id !== id);
      return { ...s, initiative: { ...s.initiative, combatants: newList, activeIndex: Math.min(s.initiative.activeIndex, Math.max(0, newList.length - 1)) } };
    });
  }, [update]);

  const updateCombatant = useCallback((id, changes) => {
    update(s => ({
      ...s,
      initiative: {
        ...s.initiative,
        combatants: s.initiative.combatants.map(c => c.id === id ? { ...c, ...changes } : c)
      }
    }));
  }, [update]);

  const nextTurn = useCallback(() => {
    update(s => {
      const len = s.initiative.combatants.length;
      if (len === 0) return s;
      const nextIdx = (s.initiative.activeIndex + 1) % len;
      const newRound = nextIdx === 0 ? s.initiative.round + 1 : s.initiative.round;
      return { ...s, initiative: { ...s.initiative, activeIndex: nextIdx, round: newRound } };
    });
  }, [update]);

  const prevTurn = useCallback(() => {
    update(s => {
      const len = s.initiative.combatants.length;
      if (len === 0) return s;
      const prevIdx = (s.initiative.activeIndex - 1 + len) % len;
      return { ...s, initiative: { ...s.initiative, activeIndex: prevIdx } };
    });
  }, [update]);

  const startCombat = useCallback(() => {
    update(s => ({ ...s, initiative: { ...s.initiative, active: true, round: 1, activeIndex: 0 } }));
  }, [update]);

  const endCombat = useCallback(() => {
    update(s => ({ ...s, initiative: { ...s.initiative, active: false, round: 0, activeIndex: 0, combatants: [] } }));
  }, [update]);

  const sortByInitiative = useCallback(() => {
    update(s => ({
      ...s,
      initiative: {
        ...s.initiative,
        combatants: [...s.initiative.combatants].sort((a, b) => b.initiative - a.initiative)
      }
    }));
  }, [update]);

  // Maps
  const saveMap = useCallback((map) => {
    const id = map.id || `map_${Date.now()}`;
    update(s => ({
      ...s,
      maps: map.id
        ? s.maps.map(m => m.id === map.id ? map : m)
        : [...s.maps, { ...map, id }]
    }));
    return id;
  }, [update]);

  const deleteMap = useCallback((id) => {
    update(s => ({ ...s, maps: s.maps.filter(m => m.id !== id) }));
  }, [update]);

  return {
    state,
    update,
    characters: state.characters,
    campaigns: state.campaigns,
    homebrew: state.homebrew,
    initiative: state.initiative,
    maps: state.maps,
    saveCharacter, deleteCharacter,
    saveCampaign, deleteCampaign,
    saveHomebrew, deleteHomebrew,
    addCombatant, removeCombatant, updateCombatant,
    nextTurn, prevTurn, startCombat, endCombat, sortByInitiative,
    saveMap, deleteMap,
  };
}

export default useStore;
