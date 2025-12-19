import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Sparkles } from 'lucide-react';
import type { Character } from './types';
import * as Icons from 'lucide-react';

interface GachaScreenProps {
    onPull: (amount: number) => Character[];
    currency: number;
    onBack: () => void;
}

const GachaScreen: React.FC<GachaScreenProps> = ({ onPull, currency, onBack }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [results, setResults] = useState<Character[]>([]);

    const handlePull = (amount: number) => {
        if (currency < amount * 100) return;
        setIsAnimating(true);
        setResults([]);

        // Simulation of network/decryption delay
        setTimeout(() => {
            const pulled = onPull(amount);
            setResults(pulled);
            setIsAnimating(false);
        }, 2000);
    };

    const getRarityColor = (rarity: string) => {
        if (rarity === 'SSR') return 'text-yellow-400 border-yellow-400 shadow-yellow-500/50';
        if (rarity === 'SR') return 'text-purple-400 border-purple-400 shadow-purple-500/50';
        return 'text-blue-400 border-blue-400 shadow-blue-500/50';
    };

    return (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4">
            {/* Header / Currency */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-gray-900 border border-yellow-500/50 px-4 py-2 rounded-full">
                <Database className="w-4 h-4 text-yellow-500" />
                <span className="font-mono text-yellow-500 font-bold">{currency} BTC</span>
            </div>

            <h2 className="text-3xl font-bold font-mono text-cyan-400 mb-8 tracking-widest uppercase">
                &lt; DECRYPT_PROTOCOL /&gt;
            </h2>

            {/* Animation Stage */}
            <div className="relative w-full max-w-2xl h-64 flex items-center justify-center mb-8">
                {isAnimating ? (
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-32 h-32 border-4 border-dashed border-cyan-500 rounded-full flex items-center justify-center"
                    >
                        <Zap className="w-16 h-16 text-cyan-500 animate-pulse" />
                    </motion.div>
                ) : (
                    results.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {results.map((char, idx) => {
                                // Dynamic Icon execution
                                const IconComponent = (Icons as any)[char.icon] || Icons.HelpCircle;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.2 }}
                                        className={`w-32 h-40 bg-gray-900 border-2 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden ${getRarityColor(char.rarity)}`}
                                    >
                                        <div className={`absolute inset-0 opacity-10 bg-current`} />
                                        <IconComponent className="w-12 h-12 mb-2" />
                                        <div className="text-xs font-bold uppercase">{char.rarity}</div>
                                        <div className="text-sm font-bold text-center leading-tight">{char.name}</div>
                                        {char.rarity === 'SSR' && <Sparkles className="absolute top-1 right-1 w-4 h-4 animate-spin text-yellow-200" />}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-gray-500 font-mono text-sm animate-pulse">
                            Ready to decrypt data stream...
                        </div>
                    )
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => handlePull(1)}
                    disabled={isAnimating || currency < 100}
                    className="px-8 py-3 bg-gray-900 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold rounded group transition-all"
                >
                    <div className="text-xs text-gray-400 mb-1">SINGLE PULL</div>
                    <div className="flex items-center gap-2">
                        <span>100 BTC</span>
                    </div>
                </button>
                <button
                    onClick={() => handlePull(10)}
                    disabled={isAnimating || currency < 1000}
                    className="px-8 py-3 bg-gray-900 border border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold rounded group transition-all"
                >
                    <div className="text-xs text-gray-400 mb-1">MULTI PULL (x10)</div>
                    <div className="flex items-center gap-2">
                        <span>1000 BTC</span>
                        <span className="px-1 bg-yellow-500 text-black text-[10px] rounded">SR+ GUARANTEED</span>
                    </div>
                </button>
            </div>

            <button
                onClick={onBack}
                disabled={isAnimating}
                className="text-gray-500 hover:text-white underline text-sm"
            >
                Return to System Menu
            </button>
        </div>
    );
};

export default GachaScreen;
