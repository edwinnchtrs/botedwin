import React from 'react';
import { X, Gamepad2, Info, Settings, LayoutGrid } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenGame: (gameId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenGame }) => {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-dark-lighter border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <LayoutGrid className="w-6 h-6 text-primary" />
                            Menu
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Mini Games Section */}
                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Gamepad2 className="w-4 h-4" />
                            Mini Games
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => onOpenGame('tictactoe')}
                                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-all group"
                            >
                                <div className="font-medium text-gray-200 group-hover:text-primary">Tic-Tac-Toe</div>
                                <div className="text-xs text-gray-500">Classic X vs O strategy</div>
                            </button>

                            <button
                                onClick={() => onOpenGame('rps')}
                                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-secondary/50 transition-all group"
                            >
                                <div className="font-medium text-gray-200 group-hover:text-secondary">Rock Paper Scissors</div>
                                <div className="text-xs text-gray-500">Test your luck against AI</div>
                            </button>

                            <button
                                onClick={() => onOpenGame('minibattles')}
                                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/50 transition-all group"
                            >
                                <div className="font-medium text-gray-200 group-hover:text-accent">12 MiniBattles</div>
                                <div className="text-xs text-gray-500">Crazy multiplayer fun!</div>
                            </button>

                            <button
                                onClick={() => onOpenGame('novel_horror')}
                                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/50 transition-all group"
                            >
                                <div className="font-medium text-gray-200 group-hover:text-red-500">The Basement</div>
                                <div className="text-xs text-gray-500">Interactive Horror Novel</div>
                            </button>
                        </div>
                    </div>

                    {/* Other Features (Placeholders) */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            System
                        </h3>
                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                <Info className="w-4 h-4" />
                                About Edwin_Chtr's
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
