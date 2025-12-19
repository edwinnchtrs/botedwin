export type ElementType = 'RED' | 'GREEN' | 'BLUE';
export type RoleType = 'STRIKER' | 'GUARDIAN' | 'FIXER' | 'HACKER';
export type Rarity = 'R' | 'SR' | 'SSR';

export interface Character {
    id: string;
    name: string;
    title: string;
    element: ElementType;
    role: RoleType;
    rarity: Rarity;
    stats: {
        hp: number;
        atk: number;
        def: number;
        spd: number;
    };
    skills: {
        basic: Skill;
        special: Skill;
        ultimate: Skill;
    };
    description: string;
    icon: string; // Lucide icon name
    color: string; // Hex or tailwind class
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    cost: number; // SP cost
    cooldown: number;
    type: 'DAMAGE' | 'HEAL' | 'BUFF' | 'DEBUFF';
    target: 'SINGLE' | 'ALL' | 'SELF' | 'ALLY';
    power: number; // Multiplier
}

export interface PlayerState {
    inventory: {
        characters: string[]; // Character IDs
        currency: number; // BitCoins
        materials: Record<string, number>;
    };
    team: [string | null, string | null, string | null]; // 3 slots
    level: number;
    exp: number;
}

export interface Enemy {
    id: string;
    name: string;
    element: ElementType;
    stats: {
        hp: number;
        maxHp: number;
        atk: number;
        def: number;
        spd: number;
    };
    skills: string[]; // Skill IDs
}
