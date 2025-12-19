import React from 'react';
import type { Character, PlayerState } from './types';
import { CHARACTER_DB } from './data';
import * as Icons from 'lucide-react';
import { ArrowLeft, Sword, Heart } from 'lucide-react';

interface CharacterScreenProps {
    state: PlayerState;
    onToggleTeam: (id: string) => void;
    onBack: () => void;
}

const CharacterScreen: React.FC<CharacterScreenProps> = ({ state, onToggleTeam, onBack }) => {
    const ownedCharacters = state.inventory.characters.map(id => CHARACTER_DB[id]);

    const getRarityColor = (rarity: string) => {
        if (rarity === 'SSR') return 'text-yellow-400 border-yellow-500';
        if (rarity === 'SR') return 'text-purple-400 border-purple-500';
        return 'text-blue-400 border-blue-500';
    };

    return (
        <div className="absolute inset-0 bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/50">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="font-mono font-bold text-cyan-500">
                    DATABASE_ROSTER [{ownedCharacters.length}]
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-hidden flex">
                {/* Character List */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
                    {ownedCharacters.map(char => {
                        const Icon = (Icons as any)[char.icon] || Icons.HelpCircle;
                        const inTeam = state.team.includes(char.id);

                        return (
                            <button
                                key={char.id}
                                onClick={() => onToggleTeam(char.id)}
                                className={`relative p-3 rounded-lg border-2 bg-gray-800 transition-all text-left group ${getRarityColor(char.rarity)} ${inTeam ? 'bg-cyan-900/20 ring-2 ring-cyan-400' : 'hover:bg-gray-700'}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <Icon className={`w-8 h-8 ${getRarityColor(char.rarity).split(' ')[0]}`} />
                                    <span className="text-[10px] font-bold border border-current px-1 rounded">
                                        {char.rarity}
                                    </span>
                                </div>
                                <div className="font-bold text-sm truncate">{char.name}</div>
                                <div className="text-[10px] text-gray-400 uppercase">{char.role}</div>

                                {/* Team Indicator */}
                                {inTeam && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Team Preview Panel */}
                <div className="w-1/3 bg-black/40 border-l border-gray-800 p-4 flex flex-col gap-4">
                    <h3 className="font-mono text-sm text-gray-500 uppercase">Active Protocol Team</h3>

                    <div className="space-y-3">
                        {[0, 1, 2].map(slotIdx => {
                            const charId = state.team[slotIdx];
                            const char = charId ? CHARACTER_DB[charId] : null;

                            return (
                                <div key={slotIdx} className="h-24 border border-dashed border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden bg-gray-900/50">
                                    {char ? (
                                        <div className="w-full h-full p-2 flex items-center gap-3">
                                            {(() => {
                                                const Icon = (Icons as any)[char.icon];
                                                return <Icon className={`w-10 h-10 ${getRarityColor(char.rarity).split(' ')[0]}`} />;
                                            })()}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm truncate">{char.name}</div>
                                                <div className="flex gap-2 text-xs text-gray-400 mt-1">
                                                    <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{char.stats.hp}</span>
                                                    <span className="flex items-center gap-0.5"><Sword className="w-3 h-3" />{char.stats.atk}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => charId && onToggleTeam(charId)}
                                                className="absolute top-1 right-1 p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-600 font-mono">EMPTY_SLOT</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-auto">
                        <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                            <div className="text-xs text-cyan-400 mb-1">TEAM POWER</div>
                            <div className="text-xl font-mono font-bold">
                                {state.team.reduce((acc, id) => {
                                    if (!id) return acc;
                                    const c = CHARACTER_DB[id];
                                    return acc + c.stats.atk + c.stats.hp + c.stats.def;
                                }, 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterScreen;
