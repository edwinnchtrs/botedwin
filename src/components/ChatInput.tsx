import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Send, Sparkles, Paperclip, Camera, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { SpeechRecognizer } from '../services/voiceService';

interface ChatInputProps {
    onSendMessage: (text: string, file?: File) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isListening, setIsListening] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const speechRecognizer = React.useRef(new SpeechRecognizer());

    const toggleListening = () => {
        if (isListening) {
            speechRecognizer.current.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            speechRecognizer.current.start(
                (text) => {
                    setInput((prev) => prev + " " + text);
                    setIsListening(false);
                },
                (error) => {
                    console.error("Speech Error:", error);
                    setIsListening(false);
                }
            );
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !selectedFile) || isLoading) return;

        onSendMessage(input, selectedFile || undefined);
        setInput('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 glass-panel border-t border-white/10 mt-auto rounded-none md:rounded-b-3xl"
        >
            {/* File Preview Badge */}
            {selectedFile && (
                <div className="flex items-center gap-2 mb-2 bg-white/10 w-fit px-3 py-1 rounded-full text-xs text-white">
                    <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="hover:text-red-400"
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className="relative flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,image/*" // Allow PDFs and Images (Files)
                    className="hidden"
                />

                <label
                    htmlFor="camera-input"
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5 cursor-pointer"
                    title="Take Photo"
                >
                    <Camera className="w-5 h-5" />
                    <input
                        id="camera-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5"
                    title="Attach File"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-colors border border-white/5 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}`}
                    title="Voice Input"
                >
                    <Mic className="w-5 h-5" />
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={selectedFile ? "Ask about this file..." : "Type your message..."}
                    disabled={isLoading}
                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-400 transition-all"
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={(!input.trim() && !selectedFile) || isLoading}
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
