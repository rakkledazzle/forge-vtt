export const mod = (score) => Math.floor((score - 10) / 2);
export const modStr = (score) => { const m = mod(score); return m >= 0 ? `+${m}` : `${m}`; };
export const profBonus = (level) => Math.ceil(level / 4) + 1;

export function rollDice(sides, count = 1) {
  let total = 0;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * sides) + 1;
    rolls.push(r);
    total += r;
  }
  return { total, rolls };
}

export function rollAbilityScore() {
  const rolls = [1,2,3,4].map(() => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return { total: rolls.slice(1).reduce((s, r) => s + r, 0), rolls, dropped: rolls[0] };
}

export function roll4d6dropLowest() {
  return ABILITY_SCORES.map(() => rollAbilityScore());
}

export const ABILITY_SCORES = ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];

export function calcAC(char) {
  const dexMod = mod(char.dexterity || 10);
  if (char.unarmoredDefense === 'barbarian') {
    return 10 + dexMod + mod(char.constitution || 10);
  }
  if (char.unarmoredDefense === 'monk') {
    return 10 + dexMod + mod(char.wisdom || 10);
  }
  if (char.armorEquipped === 'none' || !char.armorEquipped) return 10 + dexMod;
  const armorAC = char.armorAC || 10;
  return armorAC + (char.dexCap !== undefined ? Math.min(dexMod, char.dexCap) : dexMod) + (char.shieldEquipped ? 2 : 0);
}

export function hpAtLevel(hitDie, level, conMod) {
  return hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
}

export function spellSaveDC(spellMod, profBon) {
  return 8 + spellMod + profBon;
}

export function spellAttackBonus(spellMod, profBon) {
  return spellMod + profBon;
}

export function passivePerception(wisdomScore, perceptionProf, profBon) {
  return 10 + mod(wisdomScore) + (perceptionProf ? profBon : 0);
}

export function parseDiceNotation(notation) {
  const match = notation.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  return { count: parseInt(match[1]), sides: parseInt(match[2]), modifier: parseInt(match[3] || '0') };
}

export function rollNotation(notation) {
  const parsed = parseDiceNotation(notation);
  if (!parsed) return null;
  const { total, rolls } = rollDice(parsed.sides, parsed.count);
  return { total: total + parsed.modifier, rolls, modifier: parsed.modifier, notation };
}

export function xpForLevel(level) {
  const table = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
  return table[Math.min(level, 20)] || 0;
}

export function levelFromXP(xp) {
  const table = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
  let level = 1;
  for (let i = 1; i < table.length; i++) {
    if (xp >= table[i]) level = i + 1; else break;
  }
  return Math.min(level, 20);
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function classColor(className) {
  const colors = {
    Barbarian: '#c0392b', Bard: '#8e44ad', Cleric: '#f39c12',
    Druid: '#27ae60', Fighter: '#7f8c8d', Monk: '#16a085',
    Paladin: '#2980b9', Ranger: '#2ecc71', Rogue: '#95a5a6',
    Sorcerer: '#e74c3c', Warlock: '#6c3483', Wizard: '#3498db',
  };
  return colors[className] || '#c9a84c';
}
