import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Character, Enemy } from './types';
import { CHARACTER_DB } from './data';
import * as Icons from 'lucide-react';
import { Skull } from 'lucide-react';

interface BattleScreenProps {
    team: [string | null, string | null, string | null];
    onWin: () => void;
    onLose: () => void;
}

// Mock Enemy for Demo
const MOCK_ENEMIES: Enemy[] = [
    {
        id: 'e_001', name: 'Trojan.exe', element: 'GREEN',
        stats: { hp: 2000, maxHp: 2000, atk: 80, def: 20, spd: 90 },
        skills: []
    },
    {
        id: 'e_002', name: 'Malware.bat', element: 'RED',
        stats: { hp: 1500, maxHp: 1500, atk: 120, def: 10, spd: 110 },
        skills: []
    }
];

const BattleScreen: React.FC<BattleScreenProps> = ({ team, onWin, onLose }) => {
    const [enemies, setEnemies] = useState<Enemy[]>(JSON.parse(JSON.stringify(MOCK_ENEMIES)));

    // Convert team IDs to Battle Objects (add currentHP)
    const [allies, setAllies] = useState(() => {
        return team
            .filter(id => id !== null)
            .map(id => {
                const char = CHARACTER_DB[id!];
                return { ...char, currentHp: char.stats.hp, maxHp: char.stats.hp, sp: 0 };
            });
    });

    const [turnQueue, setTurnQueue] = useState<('ALLY' | 'ENEMY')[]>(['ALLY']);
    const [activeCharIndex, setActiveCharIndex] = useState(0); // Index in allies array
    const [log, setLog] = useState<string[]>(['Battle Started!']);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    // Turn Logic
    useEffect(() => {
        if (allies.every(a => a.currentHp <= 0)) {
            setTimeout(onLose, 1000);
            return;
        }
        if (enemies.every(e => e.stats.hp <= 0)) {
            setTimeout(onWin, 1000);
            return;
        }

        const currentTurn = turnQueue[0];
        if (currentTurn === 'ENEMY') {
            // AI Turn
            setTimeout(executeEnemyTurn, 1000);
        }
    }, [turnQueue, allies, enemies]);

    const executeEnemyTurn = () => {
        // Simple AI: Random living enemy attacks random living ally
        const livingEnemies = enemies.filter(e => e.stats.hp > 0);
        const livingAllies = allies.filter(a => a.currentHp > 0);

        if (livingEnemies.length === 0 || livingAllies.length === 0) return;

        const attacker = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
        const targetIdx = Math.floor(Math.random() * livingAllies.length);
        const target = livingAllies[targetIdx];

        // Damage Calc
        const damage = Math.max(10, attacker.stats.atk - (target.stats.def / 2));

        // Update State
        setAllies(prev => {
            const next = [...prev];
            const actualTargetIndex = prev.findIndex(a => a.id === target.id); // Find original index
            if (actualTargetIndex >= 0) {
                next[actualTargetIndex].currentHp -= damage;
            }
            return next;
        });

        addLog(`${attacker.name} attacked ${target.name} for ${Math.floor(damage)} DMG!`);
        nextTurn();
    };

    const handlePlayerAction = (skillId: string | 'BASIC', targetEnemyIndex: number) => {
        const attacker = allies[activeCharIndex];
        const target = enemies[targetEnemyIndex];

        if (target.stats.hp <= 0) return;

        let skill = skillId === 'BASIC' ? attacker.skills.basic : (skillId === 'SPECIAL' ? attacker.skills.special : attacker.skills.ultimate);

        // Cost check
        if (skill.cost > attacker.sp) {
            addLog("Not enough SP!");
            return;
        }

        // Execute Attack
        const damage = Math.floor(attacker.stats.atk * skill.power * (100 / (100 + target.stats.def)));

        setEnemies(prev => {
            const next = [...prev];
            next[targetEnemyIndex].stats.hp -= damage;
            return next;
        });

        // SP Cost & Gain logic (Simplified)
        setAllies(prev => {
            const next = [...prev];
            next[activeCharIndex].sp -= skill.cost;
            if (skillId === 'BASIC') next[activeCharIndex].sp = Math.min(100, next[activeCharIndex].sp + 20); // Regain SP on basic
            return next;
        });

        addLog(`${attacker.name} used ${skill.name} on ${target.name} for ${damage} DMG!`);
        setSelectedSkill(null);

        // Rotate to next ally or end user turn
        if (activeCharIndex < allies.length - 1) {
            setActiveCharIndex(prev => prev + 1);
        } else {
            setActiveCharIndex(0);
            nextTurn();
        }
    };

    const nextTurn = () => {
        setTurnQueue(prev => {
            const next = [...prev];
            next.shift(); // Remove current
            if (next.length === 0) return ['ALLY', 'ENEMY']; // Simple alternating rounds
            return next;
        });
    };

    const addLog = (msg: string) => {
        setLog(prev => [msg, ...prev].slice(0, 3));
    };

    const activeChar = allies[activeCharIndex];
    const isPlayerTurn = turnQueue[0] === 'ALLY';

    return (
        <div className="absolute inset-0 bg-gray-900 flex flex-col font-sans overflow-hidden">
            {/* Environment */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black" />

            {/* Top Bar: Enemies */}
            <div className="flex-1 flex items-center justify-center gap-8 relative z-10">
                {enemies.map((enemy, idx) => (
                    enemy.stats.hp > 0 ? (
                        <motion.div
                            key={enemy.id}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="relative group cursor-pointer"
                            onClick={() => selectedSkill && handlePlayerAction(selectedSkill, idx)}
                        >
                            {/* Health Bar */}
                            <div className="absolute -top-6 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 transition-all duration-300"
                                    style={{ width: `${(enemy.stats.hp / enemy.stats.maxHp) * 100}%` }}
                                />
                            </div>

                            {/* Sprite */}
                            <div className="w-24 h-24 bg-red-900/20 border-2 border-red-500/50 rounded-lg flex items-center justify-center animate-pulse relative hover:bg-red-500/30 transition-colors">
                                <Skull className="w-12 h-12 text-red-500" />
                                {selectedSkill && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-bold text-red-400">
                                        CLICK TO ATTACK
                                    </div>
                                )}
                            </div>

                            <div className="text-center mt-2 text-red-400 font-mono text-xs font-bold">{enemy.name}</div>
                        </motion.div>
                    ) : null
                ))}
            </div>

            {/* Combat Log */}
            <div className="h-20 bg-black/50 border-y border-gray-800 p-2 overflow-hidden flex flex-col-reverse items-center z-10">
                {log.map((line, i) => (
                    <div key={i} className={`text-xs font-mono ${i === 0 ? 'text-white font-bold' : 'text-gray-500'}`}>{line}</div>
                ))}
            </div>

            {/* Bottom Bar: Allies & Controls */}
            <div className="h-64 bg-gray-900/90 border-t border-gray-800 p-4 flex gap-4 z-10">
                {/* Ally Cards */}
                <div className="flex-1 flex gap-2">
                    {allies.map((ally, idx) => {
                        if (ally.currentHp <= 0) return (
                            <div key={idx} className="w-32 bg-gray-800/50 rounded-lg flex items-center justify-center grayscale opacity-50">
                                <Skull className="w-8 h-8 text-gray-500" />
                            </div>
                        );

                        const Icon = (Icons as any)[ally.icon];
                        const isActive = isPlayerTurn && idx === activeCharIndex;

                        return (
                            <div
                                key={idx}
                                className={`w-36 p-3 rounded-lg border-2 transition-all flex flex-col gap-2 ${isActive ? 'border-cyan-400 bg-cyan-900/20 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-gray-700 bg-gray-800'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="w-6 h-6 text-gray-400" />
                                    <div className="truncate font-bold text-xs">{ally.name}</div>
                                </div>

                                {/* Bars */}
                                <div className="space-y-1">
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: `${(ally.currentHp / ally.maxHp) * 100}%` }} />
                                    </div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, ally.sp)}%` }} />
                                    </div>
                                </div>

                                <div className="mt-auto text-[10px] text-gray-400 font-mono">
                                    HP: {Math.floor(ally.currentHp)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Panel */}
                <div className="w-64 border-l border-gray-700 pl-4 flex flex-col gap-2">
                    {isPlayerTurn ? (
                        <>
                            <div className="text-xs text-cyan-400 font-mono mb-2 uppercase tracking-wider">
                                Command Protocol: {activeChar.name}
                            </div>

                            <button
                                onClick={() => setSelectedSkill('BASIC')}
                                className={`p-2 rounded border border-gray-600 hover:bg-gray-700 text-left text-xs transition-colors ${selectedSkill === 'BASIC' ? 'bg-cyan-900 border-cyan-500 text-cyan-400' : ''}`}
                            >
                                <div className="font-bold flex justify-between">
                                    {activeChar.skills.basic.name} <span>SP +20</span>
                                </div>
                            </button>

                            <button
                                onClick={() => activeChar.sp >= activeChar.skills.special.cost && setSelectedSkill('SPECIAL')}
                                disabled={activeChar.sp < activeChar.skills.special.cost}
                                className={`p-2 rounded border border-gray-600 hover:bg-gray-700 text-left text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${selectedSkill === 'SPECIAL' ? 'bg-cyan-900 border-cyan-500 text-cyan-400' : ''}`}
                            >
                                <div className="font-bold flex justify-between">
                                    {activeChar.skills.special.name} <span>SP {activeChar.skills.special.cost}</span>
                                </div>
                            </button>

                            <button
                                onClick={() => activeChar.sp >= activeChar.skills.ultimate.cost && setSelectedSkill('ULTIMATE')}
                                disabled={activeChar.sp < activeChar.skills.ultimate.cost}
                                className={`p-2 rounded border border-purple-600 hover:bg-purple-900/30 text-left text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${selectedSkill === 'ULTIMATE' ? 'bg-purple-900 border-purple-500 text-purple-400' : ''}`}
                            >
                                <div className="font-bold flex justify-between">
                                    {activeChar.skills.ultimate.name} <span>SP {activeChar.skills.ultimate.cost}</span>
                                </div>
                            </button>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-red-500 font-mono animate-pulse">
                            ENEMY_TURN_IN_PROGRESS...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BattleScreen;
