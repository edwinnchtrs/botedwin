import React from 'react';
import { Terminal, Users, Play, Database, ArrowLeft } from 'lucide-react';
import GachaScreen from './GachaScreen';
import CharacterScreen from './CharacterScreen';
import BattleScreen from './BattleScreen';
import { useNeonGame } from './useNeonGame';

interface NeonGameProps {
    onBack?: () => void;
}

const NeonGame: React.FC<NeonGameProps> = ({ onBack }) => {
    const { gameState, activeScreen, setActiveScreen, gachaPull, toggleTeamMember, addCurrency } = useNeonGame();

    if (activeScreen === 'GACHA') {
        return <GachaScreen onPull={gachaPull} currency={gameState.inventory.currency} onBack={() => setActiveScreen('MENU')} />;
    }

    if (activeScreen === 'ROSTER') {
        return <CharacterScreen state={gameState} onToggleTeam={toggleTeamMember} onBack={() => setActiveScreen('MENU')} />;
    }

    if (activeScreen === 'BATTLE') {
        return (
            <BattleScreen
                team={gameState.team}
                onWin={() => {
                    addCurrency(200); // Reward
                    alert('MISSION COMPLETE: +200 BTC');
                    setActiveScreen('MENU');
                }}
                onLose={() => {
                    alert('MISSION FAILED');
                    setActiveScreen('MENU');
                }}
            />
        );
    }

    // Main Menu
    return (
        <div className="w-full h-[600px] bg-black text-cyan-500 font-mono relative overflow-hidden border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col">

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_4px,3px_100%] animate-scanline"></div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm z-40">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-1 hover:bg-cyan-500/20 rounded-full transition-colors mr-2 text-cyan-500"
                            title="Exit Game"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]"></div>
                    <h1 className="text-xl font-bold tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                        NEON PROTOCOL
                    </h1>
                </div>
                <div className="text-xs text-gray-500 font-mono">SYS_VER: 1.0.4 // ONLINE</div>
            </div>

            <div className="absolute top-4 right-20 z-50">
                <button
                    onClick={() => addCurrency(500)} // Debug cheat
                    className="flex items-center gap-2 bg-gray-900/80 border border-gray-700 px-3 py-1.5 rounded hover:border-yellow-500 transition-colors"
                >
                    <Database className="w-3 h-3 text-yellow-500" />
                    <span className="font-mono font-bold text-sm">{gameState.inventory.currency}</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="relative flex-1 flex flex-col items-center justify-center gap-6 z-10">
                {/* Hero / Character Display */}
                <div className="w-full max-w-sm h-48 bg-gray-900/50 border-y border-cyan-500/20 backdrop-blur-sm flex items-center justify-center relative group cursor-pointer hover:bg-cyan-900/10 transition-all">
                    <div className="text-center">
                        <div className="text-cyan-400 text-xs font-mono mb-2 uppercase tracking-[0.2em]">Current Objective</div>
                        <div className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">Defend Sector 7</div>
                        <div className="text-gray-500 text-sm mt-1">Normal Difficulty</div>
                    </div>
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-4 w-full animate-[scan_3s_linear_infinite]" />
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm px-4">
                    <button
                        onClick={() => setActiveScreen('BATTLE')}
                        className="bg-gray-800 hover:bg-cyan-900/30 border border-gray-700 hover:border-cyan-500 p-4 rounded-lg flex flex-col items-center gap-2 transition-all group"
                    >
                        <Play className="w-8 h-8 text-cyan-500 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">MISSION START</span>
                    </button>

                    <button
                        onClick={() => setActiveScreen('ROSTER')}
                        className="bg-gray-800 hover:bg-purple-900/30 border border-gray-700 hover:border-purple-500 p-4 rounded-lg flex flex-col items-center gap-2 transition-all group"
                    >
                        <Users className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">ROSTER</span>
                    </button>

                    <button
                        onClick={() => setActiveScreen('GACHA')}
                        className="col-span-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-yellow-900/30 hover:to-gray-900 border border-gray-700 hover:border-yellow-500 p-4 rounded-lg flex items-center justify-center gap-4 transition-all group"
                    >
                        <Terminal className="w-6 h-6 text-yellow-500 group-hover:animate-pulse" />
                        <div className="text-left">
                            <div className="font-bold text-sm text-yellow-500">RECRUIT AGENTS</div>
                            <div className="text-[10px] text-gray-400">Decrypt new protocols</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NeonGame;
