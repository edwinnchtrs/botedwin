import { useState, useEffect } from 'react';
import type { PlayerState, Character } from './types';
import { CHARACTER_DB, INITIAL_STATE } from './data';

const STORAGE_KEY = 'neon_protocol_save_v1';

export const useNeonGame = () => {
    const [gameState, setGameState] = useState<PlayerState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : INITIAL_STATE;
    });

    const [activeScreen, setActiveScreen] = useState<'MENU' | 'BATTLE' | 'GACHA' | 'ROSTER'>('MENU');

    // Save on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    const gachaPull = (amount: number = 1): Character[] => {
        const cost = amount * 100;
        if (gameState.inventory.currency < cost) return [];

        const results: Character[] = [];
        const newCharacters = [...gameState.inventory.characters];

        for (let i = 0; i < amount; i++) {
            // Rates: SSR 2%, SR 10%, R 88%
            const rand = Math.random() * 100;
            let pool: Character[] = [];

            if (rand < 2) { // SSR
                pool = Object.values(CHARACTER_DB).filter(c => c.rarity === 'SSR');
            } else if (rand < 12) { // SR
                pool = Object.values(CHARACTER_DB).filter(c => c.rarity === 'SR');
            } else { // R
                pool = Object.values(CHARACTER_DB).filter(c => c.rarity === 'R');
            }

            const pulled = pool[Math.floor(Math.random() * pool.length)];
            results.push(pulled);

            // Add to inventory if duplicate logic needed later (for now just add ID)
            // Ideally we'd convert dupe to shards, but let's keep simple:
            if (!newCharacters.includes(pulled.id)) {
                newCharacters.push(pulled.id);
            } else {
                // Duplicate fallback: give currency back or shards
                // For simplicity: Duplicate = 50 currency back
                gameState.inventory.currency += 50;
            }
        }

        setGameState(prev => ({
            ...prev,
            inventory: {
                ...prev.inventory,
                characters: newCharacters,
                currency: prev.inventory.currency - cost
            }
        }));

        return results;
    };

    const toggleTeamMember = (charId: string) => {
        setGameState(prev => {
            const currentTeam = [...prev.team];
            const inTeamIndex = currentTeam.indexOf(charId);

            if (inTeamIndex >= 0) {
                // Remove
                currentTeam[inTeamIndex] = null;
            } else {
                // Add to first empty slot
                const emptyIndex = currentTeam.indexOf(null);
                if (emptyIndex >= 0) {
                    currentTeam[emptyIndex] = charId;
                }
            }
            return { ...prev, team: currentTeam as [string | null, string | null, string | null] };
        });
    };

    // Cheat for demo
    const addCurrency = (amount: number) => {
        setGameState(prev => ({
            ...prev,
            inventory: {
                ...prev.inventory,
                currency: prev.inventory.currency + amount
            }
        }));
    };

    return {
        gameState,
        activeScreen,
        setActiveScreen,
        gachaPull,
        toggleTeamMember,
        addCurrency,
        resetSave: () => {
            localStorage.removeItem(STORAGE_KEY);
            setGameState(INITIAL_STATE);
        }
    };
};
