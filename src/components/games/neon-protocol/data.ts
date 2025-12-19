import type { Character, Skill } from './types';
import { Sword, Shield, Activity, Zap, Cpu } from 'lucide-react';

export const SKILL_DB: Record<string, Skill> = {
    // STRIKER SKILLS
    'slash_v1': {
        id: 'slash_v1', name: 'Binary Slash', description: 'Deals 120% ATK damage to one enemy.',
        cost: 0, cooldown: 0, type: 'DAMAGE', target: 'SINGLE', power: 1.2
    },
    'overclock': {
        id: 'overclock', name: 'Overclock', description: 'Deals 250% ATK damage but takes 10% HP damage.',
        cost: 30, cooldown: 3, type: 'DAMAGE', target: 'SINGLE', power: 2.5
    },
    'format_c': {
        id: 'format_c', name: 'Format C:', description: 'Deals 400% ATK damage to all enemies.',
        cost: 60, cooldown: 5, type: 'DAMAGE', target: 'ALL', power: 4.0
    },

    // GUARDIAN SKILLS
    'firewall': {
        id: 'firewall', name: 'Firewall Up', description: 'Grants Shield equal to 20% Max HP to self.',
        cost: 20, cooldown: 2, type: 'BUFF', target: 'SELF', power: 0.2
    },
    'redirect': {
        id: 'redirect', name: 'Traffic Redirect', description: 'Taunts all enemies for 2 turns.',
        cost: 30, cooldown: 4, type: 'DEBUFF', target: 'ALL', power: 0
    },

    // FIXER SKILLS
    'patch': {
        id: 'patch', name: 'Security Patch', description: 'Heals one ally for 150% ATK.',
        cost: 25, cooldown: 2, type: 'HEAL', target: 'ALLY', power: 1.5
    },
    'sys_restore': {
        id: 'sys_restore', name: 'System Restore', description: 'Heals all allies for 100% ATK.',
        cost: 50, cooldown: 4, type: 'HEAL', target: 'ALL', power: 1.0
    }
};

export const CHARACTER_DB: Record<string, Character> = {
    'c_001': {
        id: 'c_001',
        name: 'Kaito',
        title: 'Cyber Ronin',
        element: 'RED',
        role: 'STRIKER',
        rarity: 'SSR',
        stats: { hp: 1000, atk: 120, def: 50, spd: 110 },
        skills: { basic: SKILL_DB['slash_v1'], special: SKILL_DB['overclock'], ultimate: SKILL_DB['format_c'] },
        description: 'A legendary virus hunter who uses a digital katana.',
        icon: 'Sword',
        color: '#ef4444' // red-500
    },
    'c_002': {
        id: 'c_002',
        name: 'Aegis',
        title: 'The Unbreachable',
        element: 'BLUE',
        role: 'GUARDIAN',
        rarity: 'SSR',
        stats: { hp: 1500, atk: 60, def: 100, spd: 80 },
        skills: { basic: SKILL_DB['slash_v1'], special: SKILL_DB['firewall'], ultimate: SKILL_DB['redirect'] },
        description: 'A sentient firewall program that gained consciousness.',
        icon: 'Shield',
        color: '#3b82f6' // blue-500
    },
    'c_003': {
        id: 'c_003',
        name: 'Pixel',
        title: 'Glitch Medic',
        element: 'GREEN',
        role: 'FIXER',
        rarity: 'SR',
        stats: { hp: 800, atk: 90, def: 40, spd: 100 },
        skills: { basic: SKILL_DB['slash_v1'], special: SKILL_DB['patch'], ultimate: SKILL_DB['sys_restore'] },
        description: 'Repairs corrupted data sectors with experimental code.',
        icon: 'Activity',
        color: '#22c55e' // green-500
    },
    'c_004': {
        id: 'c_004',
        name: 'Null',
        title: 'Void Walker',
        element: 'RED',
        role: 'HACKER',
        rarity: 'SR',
        stats: { hp: 900, atk: 100, def: 45, spd: 105 },
        skills: { basic: SKILL_DB['slash_v1'], special: SKILL_DB['overclock'], ultimate: SKILL_DB['format_c'] },
        description: 'Operates in the dark web regions of the server.',
        icon: 'Zap',
        color: '#a855f7' // purple-500
    },
    'c_005': {
        id: 'c_005',
        name: 'Bit',
        title: 'Data Miner',
        element: 'GREEN',
        role: 'STRIKER',
        rarity: 'R',
        stats: { hp: 700, atk: 80, def: 30, spd: 95 },
        skills: { basic: SKILL_DB['slash_v1'], special: SKILL_DB['overclock'], ultimate: SKILL_DB['format_c'] },
        description: 'A standard protocol droid modified for combat.',
        icon: 'Cpu',
        color: '#eab308' // yellow-500
    }
};

export const INITIAL_STATE = {
    inventory: {
        characters: ['c_003', 'c_005'], // Start with Pixel and Bit
        currency: 1000,
        materials: {}
    },
    team: ['c_003', 'c_005', null] as [string | null, string | null, string | null],
    level: 1,
    exp: 0
};
