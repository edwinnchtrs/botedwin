import React, { useState, useEffect, useRef } from 'react';
import type { GameState } from './HorrorStoryData';
import { INITIAL_STATE, STORY_NODES } from './HorrorStoryData';
import { Heart, Skull, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HorrorNovel: React.FC = () => {
    const [currentNodeId, setCurrentNodeId] = useState<string>('start');
    const [state, setState] = useState<GameState>(INITIAL_STATE);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // SFX References (Visual only for now)
    const containerRef = useRef<HTMLDivElement>(null);

    const currentNode = STORY_NODES[currentNodeId];

    // Typewriter Effect
    useEffect(() => {
        setDisplayedText('');
        setIsTyping(true);
        let index = 0;
        const text = currentNode.text;

        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, 30); // Speed of typing

        return () => clearInterval(timer);
    }, [currentNodeId]);

    const handleChoice = (nextNodeId: string, effect?: (s: GameState) => Partial<GameState>) => {
        if (effect) {
            setState(prev => ({ ...prev, ...effect(prev) }));
        }
        setCurrentNodeId(nextNodeId);
    };

    const restartGame = () => {
        setState(INITIAL_STATE);
        setCurrentNodeId('start');
    };

    // Background Effects
    const getBgClass = () => {
        switch (currentNode.bgEffect) {
            case 'red-flash': return 'animate-pulse bg-red-900/20';
            case 'glitch': return 'bg-gray-900'; // Need css glitch really
            case 'heartbeat': return 'animate-pulse bg-black';
            default: return 'bg-transparent';
        }
    };

    const isEnding = currentNodeId.startsWith('ending');

    return (
        <div className={`w-full h-full min-h-[60vh] flex flex-col relative overflow-hidden font-serif ${getBgClass()} transition-colors duration-500`}>
            {/* Stats Bar */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2 text-red-500">
                    <Heart className={`w-5 h-5 ${state.sanity < 50 ? 'animate-ping' : ''}`} fill="currentColor" />
                    <span className="text-sm font-bold tracking-widest">SANITY: {state.sanity}%</span>
                </div>
                {state.hasWeapon && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Skull className="w-5 h-5" />
                        <span className="text-xs">WEAPON ACQUIRED</span>
                    </div>
                )}
            </div>

            {/* Story Text Area */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col items-center justify-center text-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentNodeId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="max-w-3xl"
                    >
                        <p className="text-lg md:text-2xl text-gray-200 leading-relaxed whitespace-pre-line tracking-wide">
                            {displayedText}
                            {isTyping && <span className="animate-pulse">|</span>}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Choices Area */}
            <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                {!isTyping && (
                    <div className="max-w-2xl mx-auto flex flex-col gap-3">
                        {currentNode.choices.length > 0 ? (
                            currentNode.choices.map((choice, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => handleChoice(choice.nextNodeId, choice.effect)}
                                    className="w-full text-left p-4 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-red-500/50 hover:text-red-100 rounded-lg transition-all duration-300 group"
                                >
                                    <span className="text-red-500 mr-2 group-hover:mr-4 transition-all opacity-50 group-hover:opacity-100">➤</span>
                                    {choice.text}
                                </motion.button>
                            ))
                        ) : (
                            // End State
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={restartGame}
                                className="w-full flex items-center justify-center gap-2 p-4 bg-red-900/30 border border-red-500/30 hover:bg-red-900/50 rounded-lg text-red-200 transition-all font-bold tracking-widest uppercase"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Replay Story
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HorrorNovel;
