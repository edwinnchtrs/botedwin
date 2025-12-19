import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        onSendMessage(input);
        setInput('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 glass-panel border-t border-white/10 mt-auto rounded-none md:rounded-b-3xl"
        >
            <div className="relative flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="w-full bg-dark/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-400 transition-all"
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim() || isLoading}
                    type="submit"
                    className="absolute right-2 p-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                >
                    {isLoading ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </motion.button>
            </div>
        </form>
    );
};

export default ChatInput;
