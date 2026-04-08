// SRD 5.1 Core Data

export const ABILITY_SCORES = ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
export const ABILITY_ABBR = { Strength:'STR', Dexterity:'DEX', Constitution:'CON', Intelligence:'INT', Wisdom:'WIS', Charisma:'CHA' };

export const SKILLS = [
  { name:'Acrobatics', ability:'Dexterity' },
  { name:'Animal Handling', ability:'Wisdom' },
  { name:'Arcana', ability:'Intelligence' },
  { name:'Athletics', ability:'Strength' },
  { name:'Deception', ability:'Charisma' },
  { name:'History', ability:'Intelligence' },
  { name:'Insight', ability:'Wisdom' },
  { name:'Intimidation', ability:'Charisma' },
  { name:'Investigation', ability:'Intelligence' },
  { name:'Medicine', ability:'Wisdom' },
  { name:'Nature', ability:'Intelligence' },
  { name:'Perception', ability:'Wisdom' },
  { name:'Performance', ability:'Charisma' },
  { name:'Persuasion', ability:'Charisma' },
  { name:'Religion', ability:'Intelligence' },
  { name:'Sleight of Hand', ability:'Dexterity' },
  { name:'Stealth', ability:'Dexterity' },
  { name:'Survival', ability:'Wisdom' },
];

export const ALIGNMENTS = [
  'Lawful Good','Neutral Good','Chaotic Good',
  'Lawful Neutral','True Neutral','Chaotic Neutral',
  'Lawful Evil','Neutral Evil','Chaotic Evil','Unaligned'
];

export const SRD_RACES = [
  {
    id:'human', name:'Human', source:'SRD',
    description:'Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.',
    abilityBonuses:{ Strength:1,Dexterity:1,Constitution:1,Intelligence:1,Wisdom:1,Charisma:1 },
    speed:30, size:'Medium',
    traits:['Extra Language','Extra Skill'],
    languages:['Common','One of your choice'],
    darkvision:false,
  },
  {
    id:'elf', name:'Elf', source:'SRD',
    description:'Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.',
    abilityBonuses:{ Dexterity:2 },
    speed:30, size:'Medium',
    traits:['Darkvision','Keen Senses','Fey Ancestry','Trance'],
    languages:['Common','Elvish'],
    darkvision:true,
    subraces:[
      { id:'high-elf', name:'High Elf', abilityBonuses:{ Intelligence:1 }, traits:['Cantrip','Extra Language'] },
      { id:'wood-elf', name:'Wood Elf', abilityBonuses:{ Wisdom:1 }, traits:['Elf Weapon Training','Fleet of Foot','Mask of the Wild'] },
      { id:'dark-elf', name:'Dark Elf (Drow)', abilityBonuses:{ Charisma:1 }, traits:['Superior Darkvision','Sunlight Sensitivity','Drow Magic','Drow Weapon Training'] },
    ]
  },
  {
    id:'dwarf', name:'Dwarf', source:'SRD',
    description:'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
    abilityBonuses:{ Constitution:2 },
    speed:25, size:'Medium',
    traits:['Darkvision','Dwarven Resilience','Dwarven Combat Training','Stonecunning'],
    languages:['Common','Dwarvish'],
    darkvision:true,
    subraces:[
      { id:'hill-dwarf', name:'Hill Dwarf', abilityBonuses:{ Wisdom:1 }, traits:['Dwarven Toughness'] },
      { id:'mountain-dwarf', name:'Mountain Dwarf', abilityBonuses:{ Strength:2 }, traits:['Dwarven Armor Training'] },
    ]
  },
  {
    id:'halfling', name:'Halfling', source:'SRD',
    description:'The comforts of home are the goals of most halflings\' lives: a place to settle in peace and quiet, far from marauding monsters and clashing armies.',
    abilityBonuses:{ Dexterity:2 },
    speed:25, size:'Small',
    traits:['Lucky','Brave','Halfling Nimbleness'],
    languages:['Common','Halfling'],
    darkvision:false,
    subraces:[
      { id:'lightfoot', name:'Lightfoot', abilityBonuses:{ Charisma:1 }, traits:['Naturally Stealthy'] },
      { id:'stout', name:'Stout', abilityBonuses:{ Constitution:1 }, traits:['Stout Resilience'] },
    ]
  },
  {
    id:'dragonborn', name:'Dragonborn', source:'SRD',
    description:'Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.',
    abilityBonuses:{ Strength:2, Charisma:1 },
    speed:30, size:'Medium',
    traits:['Draconic Ancestry','Breath Weapon','Damage Resistance'],
    languages:['Common','Draconic'],
    darkvision:false,
  },
  {
    id:'gnome', name:'Gnome', source:'SRD',
    description:'A gnome\'s energy and enthusiasm for living shines through every inch of his or her tiny body.',
    abilityBonuses:{ Intelligence:2 },
    speed:25, size:'Small',
    traits:['Darkvision','Gnome Cunning'],
    languages:['Common','Gnomish'],
    darkvision:true,
    subraces:[
      { id:'forest-gnome', name:'Forest Gnome', abilityBonuses:{ Dexterity:1 }, traits:['Natural Illusionist','Speak with Small Beasts'] },
      { id:'rock-gnome', name:'Rock Gnome', abilityBonuses:{ Constitution:1 }, traits:["Artificer's Lore",'Tinker'] },
    ]
  },
  {
    id:'half-elf', name:'Half-Elf', source:'SRD',
    description:'Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents.',
    abilityBonuses:{ Charisma:2, 'Two of your choice':1 },
    speed:30, size:'Medium',
    traits:['Darkvision','Fey Ancestry','Skill Versatility'],
    languages:['Common','Elvish','One of your choice'],
    darkvision:true,
  },
  {
    id:'half-orc', name:'Half-Orc', source:'SRD',
    description:'Half-orcs\' grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.',
    abilityBonuses:{ Strength:2, Constitution:1 },
    speed:30, size:'Medium',
    traits:['Darkvision','Menacing','Relentless Endurance','Savage Attacks'],
    languages:['Common','Orc'],
    darkvision:true,
  },
  {
    id:'tiefling', name:'Tiefling', source:'SRD',
    description:'To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.',
    abilityBonuses:{ Intelligence:1, Charisma:2 },
    speed:30, size:'Medium',
    traits:['Darkvision','Hellish Resistance','Infernal Legacy'],
    languages:['Common','Infernal'],
    darkvision:true,
  },
];

export const SRD_CLASSES = [
  {
    id:'barbarian', name:'Barbarian', hitDie:12,
    description:'A fierce warrior of primitive background who can enter a battle rage.',
    primaryAbility:'Strength',
    savingThrows:['Strength','Constitution'],
    armorProf:['Light','Medium','Shields'],
    weaponProf:['Simple','Martial'],
    skillChoices:{ count:2, from:['Animal Handling','Athletics','Intimidation','Nature','Perception','Survival'] },
    features:{ 1:['Rage','Unarmored Defense'], 2:['Reckless Attack','Danger Sense'], 3:['Primal Path'], 4:['Ability Score Improvement'], 5:['Extra Attack','Fast Movement'] },
    subclassLevel:3, subclassTitle:'Primal Path',
    subclasses:[
      { id:'berserker', name:'Path of the Berserker', features:{ 3:['Frenzy'], 6:['Mindless Rage'], 10:['Intimidating Presence'], 14:['Retaliation'] } },
      { id:'totem-warrior', name:'Path of the Totem Warrior', features:{ 3:['Spirit Seeker','Totem Spirit'], 6:['Aspect of the Beast'], 10:['Spirit Walker'], 14:['Totemic Attunement'] } },
    ]
  },
  {
    id:'bard', name:'Bard', hitDie:8,
    description:'An inspiring magician whose power echoes the music of creation.',
    primaryAbility:'Charisma',
    savingThrows:['Dexterity','Charisma'],
    armorProf:['Light'],
    weaponProf:['Simple','Hand crossbows','Longswords','Rapiers','Shortswords'],
    skillChoices:{ count:3, from:'Any' },
    features:{ 1:['Spellcasting','Bardic Inspiration'], 2:['Jack of All Trades','Song of Rest'], 3:['Bard College','Expertise'], 4:['Ability Score Improvement'], 5:['Bardic Inspiration (d8)','Font of Inspiration'] },
    subclassLevel:3, subclassTitle:'Bard College',
    subclasses:[
      { id:'lore', name:'College of Lore', features:{ 3:['Bonus Proficiencies','Cutting Words'], 6:['Additional Magical Secrets'], 14:['Peerless Skill'] } },
      { id:'valor', name:'College of Valor', features:{ 3:['Bonus Proficiencies','Combat Inspiration'], 6:['Extra Attack'], 14:['Battle Magic'] } },
    ]
  },
  {
    id:'cleric', name:'Cleric', hitDie:8,
    description:'A priestly champion who wields divine magic in service of a higher power.',
    primaryAbility:'Wisdom',
    savingThrows:['Wisdom','Charisma'],
    armorProf:['Light','Medium','Shields'],
    weaponProf:['Simple'],
    skillChoices:{ count:2, from:['History','Insight','Medicine','Persuasion','Religion'] },
    features:{ 1:['Spellcasting','Divine Domain'], 2:['Channel Divinity','Turn Undead'], 3:['Divine Domain Feature'], 4:['Ability Score Improvement'], 5:['Destroy Undead (CR 1/2)'] },
    subclassLevel:1, subclassTitle:'Divine Domain',
    subclasses:[
      { id:'life', name:'Life Domain', features:{ 1:['Bonus Proficiency','Disciple of Life'], 2:['Channel Divinity: Preserve Life'], 6:['Blessed Healer'], 8:['Divine Strike'], 17:['Supreme Healing'] } },
      { id:'light', name:'Light Domain', features:{ 1:['Bonus Cantrip','Warding Flare'], 2:['Channel Divinity: Radiance of the Dawn'], 6:['Improved Flare'], 8:['Potent Spellcasting'], 17:['Corona of Light'] } },
      { id:'trickery', name:'Trickery Domain', features:{ 1:['Blessing of the Trickster'], 2:['Channel Divinity: Invoke Duplicity'], 6:['Channel Divinity: Cloak of Shadows'], 8:['Divine Strike'], 17:['Improved Duplicity'] } },
    ]
  },
  {
    id:'druid', name:'Druid', hitDie:8,
    description:'A priest of the Old Faith, wielding the powers of nature — moonlight and plant growth, fire and lightning.',
    primaryAbility:'Wisdom',
    savingThrows:['Intelligence','Wisdom'],
    armorProf:['Light','Medium','Shields (non-metal)'],
    weaponProf:['Clubs','Daggers','Darts','Javelins','Maces','Quarterstaffs','Scimitars','Sickles','Slings','Spears'],
    skillChoices:{ count:2, from:['Arcana','Animal Handling','Insight','Medicine','Nature','Perception','Religion','Survival'] },
    features:{ 1:['Druidic','Spellcasting'], 2:['Wild Shape','Wild Shape Improvement'], 3:['Druid Circle'], 4:['Wild Shape Improvement','Ability Score Improvement'], 5:['Wild Shape (CR 1)'] },
    subclassLevel:2, subclassTitle:'Druid Circle',
    subclasses:[
      { id:'land', name:'Circle of the Land', features:{ 2:["Natural Recovery"], 6:["Land's Stride"], 10:["Nature's Ward"], 14:["Nature's Sanctuary"] } },
      { id:'moon', name:'Circle of the Moon', features:{ 2:['Combat Wild Shape','Circle Forms'], 6:['Primal Strike'], 10:['Elemental Wild Shape'], 14:['Thousand Forms'] } },
    ]
  },
  {
    id:'fighter', name:'Fighter', hitDie:10,
    description:'A master of martial combat, skilled with a variety of weapons and armor.',
    primaryAbility:'Strength or Dexterity',
    savingThrows:['Strength','Constitution'],
    armorProf:['All armor','Shields'],
    weaponProf:['Simple','Martial'],
    skillChoices:{ count:2, from:['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Perception','Survival'] },
    features:{ 1:['Fighting Style','Second Wind'], 2:['Action Surge'], 3:['Martial Archetype'], 4:['Ability Score Improvement'], 5:['Extra Attack'] },
    subclassLevel:3, subclassTitle:'Martial Archetype',
    subclasses:[
      { id:'champion', name:'Champion', features:{ 3:['Improved Critical'], 7:['Remarkable Athlete'], 10:['Additional Fighting Style'], 15:['Superior Critical'], 18:['Survivor'] } },
      { id:'battle-master', name:'Battle Master', features:{ 3:['Combat Superiority','Student of War'], 7:['Know Your Enemy'], 10:['Improved Combat Superiority'], 15:['Relentless'] } },
      { id:'eldritch-knight', name:'Eldritch Knight', features:{ 3:['Spellcasting','Weapon Bond'], 7:['War Magic'], 10:['Eldritch Strike'], 15:['Arcane Charge'], 18:['Improved War Magic'] } },
    ]
  },
  {
    id:'monk', name:'Monk', hitDie:8,
    description:'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
    primaryAbility:'Dexterity & Wisdom',
    savingThrows:['Strength','Dexterity'],
    armorProf:[],
    weaponProf:['Simple','Shortswords'],
    skillChoices:{ count:2, from:['Acrobatics','Athletics','History','Insight','Religion','Stealth'] },
    features:{ 1:['Unarmored Defense','Martial Arts'], 2:['Ki','Unarmored Movement'], 3:['Monastic Tradition','Deflect Missiles'], 4:['Ability Score Improvement','Slow Fall'], 5:['Extra Attack','Stunning Strike'] },
    subclassLevel:3, subclassTitle:'Monastic Tradition',
    subclasses:[
      { id:'open-hand', name:'Way of the Open Hand', features:{ 3:['Open Hand Technique'], 6:['Wholeness of Body'], 11:['Tranquility'], 17:['Quivering Palm'] } },
      { id:'shadow', name:'Way of Shadow', features:{ 3:['Shadow Arts'], 6:['Shadow Step'], 11:['Cloak of Shadows'], 17:['Opportunist'] } },
      { id:'four-elements', name:'Way of the Four Elements', features:{ 3:['Disciple of the Elements'], 6:['Additional Elemental Disciplines'], 11:['More Elemental Disciplines'], 17:['Even More Elemental Disciplines'] } },
    ]
  },
  {
    id:'paladin', name:'Paladin', hitDie:10,
    description:'A holy warrior bound to a sacred oath.',
    primaryAbility:'Strength & Charisma',
    savingThrows:['Wisdom','Charisma'],
    armorProf:['All armor','Shields'],
    weaponProf:['Simple','Martial'],
    skillChoices:{ count:2, from:['Athletics','Insight','Intimidation','Medicine','Persuasion','Religion'] },
    features:{ 1:['Divine Sense','Lay on Hands'], 2:['Fighting Style','Spellcasting','Divine Smite'], 3:['Divine Health','Sacred Oath'], 4:['Ability Score Improvement'], 5:['Extra Attack'] },
    subclassLevel:3, subclassTitle:'Sacred Oath',
    subclasses:[
      { id:'devotion', name:'Oath of Devotion', features:{ 3:['Sacred Weapon','Turn the Unholy'], 7:['Aura of Devotion'], 15:['Purity of Spirit'], 20:['Holy Nimbus'] } },
      { id:'ancients', name:'Oath of the Ancients', features:{ 3:['Nature\'s Wrath','Turn the Faithless'], 7:['Aura of Warding'], 15:['Undying Sentinel'], 20:['Elder Champion'] } },
      { id:'vengeance', name:'Oath of Vengeance', features:{ 3:['Abjure Enemy','Vow of Enmity'], 7:['Relentless Avenger'], 15:['Soul of Vengeance'], 20:['Avenging Angel'] } },
    ]
  },
  {
    id:'ranger', name:'Ranger', hitDie:10,
    description:'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',
    primaryAbility:'Dexterity & Wisdom',
    savingThrows:['Strength','Dexterity'],
    armorProf:['Light','Medium','Shields'],
    weaponProf:['Simple','Martial'],
    skillChoices:{ count:3, from:['Animal Handling','Athletics','Insight','Investigation','Nature','Perception','Stealth','Survival'] },
    features:{ 1:['Favored Enemy','Natural Explorer'], 2:['Fighting Style','Spellcasting'], 3:['Ranger Archetype','Primeval Awareness'], 4:['Ability Score Improvement'], 5:['Extra Attack'] },
    subclassLevel:3, subclassTitle:'Ranger Archetype',
    subclasses:[
      { id:'hunter', name:'Hunter', features:{ 3:["Hunter's Prey"], 7:['Defensive Tactics'], 11:['Multiattack'], 15:["Superior Hunter's Defense"] } },
      { id:'beast-master', name:'Beast Master', features:{ 3:["Ranger's Companion"], 7:['Exceptional Training'], 11:['Bestial Fury'], 15:['Share Spells'] } },
    ]
  },
  {
    id:'rogue', name:'Rogue', hitDie:8,
    description:'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
    primaryAbility:'Dexterity',
    savingThrows:['Dexterity','Intelligence'],
    armorProf:['Light'],
    weaponProf:['Simple','Hand crossbows','Longswords','Rapiers','Shortswords'],
    skillChoices:{ count:4, from:['Acrobatics','Athletics','Deception','Insight','Intimidation','Investigation','Perception','Performance','Persuasion','Sleight of Hand','Stealth'] },
    features:{ 1:['Expertise','Sneak Attack','Thieves\' Cant'], 2:['Cunning Action'], 3:['Roguish Archetype'], 4:['Ability Score Improvement'], 5:['Uncanny Dodge'] },
    subclassLevel:3, subclassTitle:'Roguish Archetype',
    subclasses:[
      { id:'thief', name:'Thief', features:{ 3:['Fast Hands','Second-Story Work'], 9:['Supreme Sneak'], 13:["Use Magic Device"], 17:["Thief's Reflexes"] } },
      { id:'assassin', name:'Assassin', features:{ 3:['Bonus Proficiencies','Assassinate'], 9:['Infiltration Expertise'], 13:['Impostor'], 17:['Death Strike'] } },
      { id:'arcane-trickster', name:'Arcane Trickster', features:{ 3:['Spellcasting','Mage Hand Legerdemain'], 9:['Magical Ambush'], 13:['Versatile Trickster'], 17:['Spell Thief'] } },
    ]
  },
  {
    id:'sorcerer', name:'Sorcerer', hitDie:6,
    description:'A spellcaster who draws on inherent magic from a gift or bloodline.',
    primaryAbility:'Charisma',
    savingThrows:['Constitution','Charisma'],
    armorProf:[],
    weaponProf:['Daggers','Darts','Slings','Quarterstaffs','Light crossbows'],
    skillChoices:{ count:2, from:['Arcana','Deception','Insight','Intimidation','Persuasion','Religion'] },
    features:{ 1:['Spellcasting','Sorcerous Origin'], 2:['Font of Magic'], 3:['Metamagic'], 4:['Ability Score Improvement'], 5:['Sorcerous Origin Feature'] },
    subclassLevel:1, subclassTitle:'Sorcerous Origin',
    subclasses:[
      { id:'draconic', name:'Draconic Bloodline', features:{ 1:['Dragon Ancestor','Draconic Resilience'], 6:['Elemental Affinity'], 14:['Dragon Wings'], 18:['Draconic Presence'] } },
      { id:'wild-magic', name:'Wild Magic', features:{ 1:['Wild Magic Surge','Tides of Chaos'], 6:['Bend Luck'], 14:['Controlled Chaos'], 18:['Spell Bombardment'] } },
    ]
  },
  {
    id:'warlock', name:'Warlock', hitDie:8,
    description:'A wielder of magic that is derived from a bargain with an extraplanar entity.',
    primaryAbility:'Charisma',
    savingThrows:['Wisdom','Charisma'],
    armorProf:['Light'],
    weaponProf:['Simple'],
    skillChoices:{ count:2, from:['Arcana','Deception','History','Intimidation','Investigation','Nature','Religion'] },
    features:{ 1:['Otherworldly Patron','Pact Magic'], 2:['Eldritch Invocations'], 3:['Pact Boon'], 4:['Ability Score Improvement'], 5:['Eldritch Invocations','Otherworldly Patron Feature'] },
    subclassLevel:1, subclassTitle:'Otherworldly Patron',
    subclasses:[
      { id:'archfey', name:'The Archfey', features:{ 1:['Fey Presence'], 6:['Misty Escape'], 10:['Beguiling Defenses'], 14:['Dark Delirium'] } },
      { id:'fiend', name:'The Fiend', features:{ 1:["Dark One's Blessing"], 6:["Dark One's Own Luck"], 10:['Fiendish Resilience'], 14:['Hurl Through Hell'] } },
      { id:'great-old-one', name:'The Great Old One', features:{ 1:['Awakened Mind'], 6:['Entropic Ward'], 10:['Thought Shield'], 14:['Create Thrall'] } },
    ]
  },
  {
    id:'wizard', name:'Wizard', hitDie:6,
    description:'A scholarly magic-user capable of manipulating the structures of reality.',
    primaryAbility:'Intelligence',
    savingThrows:['Intelligence','Wisdom'],
    armorProf:[],
    weaponProf:['Daggers','Darts','Slings','Quarterstaffs','Light crossbows'],
    skillChoices:{ count:2, from:['Arcana','History','Insight','Investigation','Medicine','Religion'] },
    features:{ 1:['Spellcasting','Arcane Recovery'], 2:['Arcane Tradition'], 3:['Arcane Tradition Feature'], 4:['Ability Score Improvement'], 5:['Arcane Tradition Feature'] },
    subclassLevel:2, subclassTitle:'Arcane Tradition',
    subclasses:[
      { id:'abjuration', name:'School of Abjuration', features:{ 2:['Abjuration Savant','Arcane Ward'], 6:['Projected Ward'], 10:['Improved Abjuration'], 14:['Spell Resistance'] } },
      { id:'conjuration', name:'School of Conjuration', features:{ 2:['Conjuration Savant','Minor Conjuration'], 6:['Benign Transposition'], 10:['Focused Conjuration'], 14:['Durable Summons'] } },
      { id:'divination', name:'School of Divination', features:{ 2:['Divination Savant','Portent'], 6:['Expert Divination'], 10:['The Third Eye'], 14:['Greater Portent'] } },
      { id:'enchantment', name:'School of Enchantment', features:{ 2:['Enchantment Savant','Hypnotic Gaze'], 6:['Instinctive Charm'], 10:['Split Enchantment'], 14:['Alter Memories'] } },
      { id:'evocation', name:'School of Evocation', features:{ 2:['Evocation Savant','Sculpt Spells'], 6:['Potent Cantrip'], 10:['Empowered Evocation'], 14:['Overchannel'] } },
      { id:'illusion', name:'School of Illusion', features:{ 2:['Illusion Savant','Improved Minor Illusion'], 6:['Malleable Illusions'], 10:['Illusory Self'], 14:['Illusory Reality'] } },
      { id:'necromancy', name:'School of Necromancy', features:{ 2:['Necromancy Savant','Grim Harvest'], 6:['Undead Thralls'], 10:['Inured to Undeath'], 14:['Command Undead'] } },
      { id:'transmutation', name:'School of Transmutation', features:{ 2:['Transmutation Savant','Minor Alchemy'], 6:["Transmuter's Stone"], 10:['Shapechanger'], 14:['Master Transmuter'] } },
    ]
  },
];

export const SRD_BACKGROUNDS = [
  { id:'acolyte', name:'Acolyte', description:'You have spent your life in the service of a temple.', skills:['Insight','Religion'], tools:[], languages:2, equipment:'Holy symbol, prayer book, 5 sticks of incense, vestments, common clothes, pouch with 15gp', feature:'Shelter of the Faithful' },
  { id:'criminal', name:'Criminal', description:'You have a history of breaking the law.', skills:['Deception','Stealth'], tools:["One type of gaming set","Thieves' tools"], languages:0, equipment:"Crowbar, dark clothes with hood, pouch with 15gp", feature:'Criminal Contact' },
  { id:'folk-hero', name:'Folk Hero', description:'You come from a humble social rank, but you are destined for so much more.', skills:['Animal Handling','Survival'], tools:["One type of artisan's tools",'Vehicles (land)'], languages:0, equipment:"Set of artisan's tools, shovel, iron pot, common clothes, pouch with 10gp", feature:'Rustic Hospitality' },
  { id:'noble', name:'Noble', description:'You understand wealth, power, and privilege.', skills:['History','Persuasion'], tools:["One type of gaming set"], languages:1, equipment:'Fine clothes, signet ring, scroll of pedigree, pouch with 25gp', feature:'Position of Privilege' },
  { id:'sage', name:'Sage', description:'You spent years learning the lore of the multiverse.', skills:['Arcana','History'], tools:[], languages:2, equipment:'Bottle of black ink, quill, small knife, letter from a dead colleague, common clothes, pouch with 10gp', feature:'Researcher' },
  { id:'soldier', name:'Soldier', description:'War has been your life for as long as you care to remember.', skills:['Athletics','Intimidation'], tools:["One type of gaming set",'Vehicles (land)'], languages:0, equipment:'Insignia of rank, trophy from fallen enemy, common clothes, pouch with 10gp', feature:'Military Rank' },
  { id:'charlatan', name:'Charlatan', description:'You have always had a way with people.', skills:['Deception','Sleight of Hand'], tools:['Disguise kit','Forgery kit'], languages:0, equipment:'Fine clothes, disguise kit, tools of the con, pouch with 15gp', feature:'False Identity' },
  { id:'entertainer', name:'Entertainer', description:'You thrive in front of an audience.', skills:['Acrobatics','Performance'], tools:['Disguise kit','One type of musical instrument'], languages:0, equipment:'Musical instrument, favor of an admirer, costume, pouch with 15gp', feature:'By Popular Demand' },
  { id:'guild-artisan', name:'Guild Artisan', description:'You are a member of an artisan\'s guild.', skills:['Insight','Persuasion'], tools:["One type of artisan's tools"], languages:1, equipment:"Artisan's tools, letter of introduction from your guild, traveler's clothes, pouch with 15gp", feature:'Guild Membership' },
  { id:'hermit', name:'Hermit', description:'You lived in seclusion for a formative part of your life.', skills:['Medicine','Religion'], tools:['Herbalism kit'], languages:1, equipment:'Scroll case with notes, winter blanket, common clothes, herbalism kit, pouch with 5gp', feature:'Discovery' },
  { id:'outlander', name:'Outlander', description:'You grew up in the wilds, far from civilization.', skills:['Athletics','Survival'], tools:["One type of musical instrument"], languages:1, equipment:"Staff, hunting trap, trophy from an animal, traveler's clothes, pouch with 10gp", feature:'Wanderer' },
  { id:'sailor', name:'Sailor', description:'You sailed on a seagoing vessel for years.', skills:['Athletics','Perception'], tools:["Navigator's tools",'Vehicles (water)'], languages:0, equipment:"Belaying pin, silk rope (50 feet), lucky charm, common clothes, pouch with 10gp", feature:"Ship's Passage" },
];

export const DAMAGE_TYPES = ['Acid','Bludgeoning','Cold','Fire','Force','Lightning','Necrotic','Piercing','Poison','Psychic','Radiant','Slashing','Thunder'];
export const SPELL_SCHOOLS = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'];
export const ITEM_TYPES = ['Weapon','Armor','Shield','Wondrous Item','Ring','Rod','Staff','Wand','Potion','Scroll','Adventuring Gear','Tool','Mount','Vehicle'];
export const WEAPON_PROPERTIES = ['Ammunition','Finesse','Heavy','Light','Loading','Range','Reach','Special','Thrown','Two-Handed','Versatile','Monk'];
export const RARITY = ['Common','Uncommon','Rare','Very Rare','Legendary','Artifact'];

export const CONDITION_COLORS = {
  Blinded:'#555', Charmed:'#ff69b4', Deafened:'#888',
  Exhaustion:'#8b0000', Frightened:'#4b0082', Grappled:'#556b2f',
  Incapacitated:'#808080', Invisible:'#e0e0e0', Paralyzed:'#ffd700',
  Petrified:'#a0a0a0', Poisoned:'#228b22', Prone:'#8b4513',
  Restrained:'#8b6914', Stunned:'#ff4500', Unconscious:'#191970'
};
