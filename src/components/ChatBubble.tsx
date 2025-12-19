import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, Download } from 'lucide-react';
import botAvatar from '../assets/avatar.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodePreview from './CodePreview';
import MusicCard from './MusicCard';
import MediaCard from './MediaCard';

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isBot = message.sender === 'bot';

    const handleDownloadImage = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={clsx(
                "flex w-full mb-4",
                isBot ? "justify-start" : "justify-end"
            )}
        >
            <div className={clsx(
                "flex max-w-[80%] md:max-w-[70%]",
                isBot ? "flex-row" : "flex-row-reverse"
            )}>
                {/* Avatar */}
                <div className={clsx(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-lg",
                    isBot ? "mr-3 border-primary/50 shadow-primary/20 bg-dark-lighter" : "ml-3 border-secondary/50 shadow-secondary/20 bg-dark-lighter"
                )}>
                    {isBot ? (
                        <img src={botAvatar} alt="Bot Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-secondary" />
                    )}
                </div>

                {/* Bubble */}
                <div className={twMerge(
                    "relative px-5 py-3 rounded-2xl text-sm md:text-base shadow-md backdrop-blur-sm overflow-hidden",
                    isBot
                        ? "rounded-tl-none bg-dark-lighter/80 border border-white/5 text-gray-100"
                        : "rounded-tr-none bg-gradient-to-br from-primary to-secondary text-white border border-white/10"
                )}>
                    {isBot ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                strong: ({ node, ...props }) => <span className="font-bold text-primary" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-primary mb-2" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-base font-bold text-primary mb-2" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-secondary mb-1" {...props} />,
                                code: ({ node, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match;

                                    if (isInline) {
                                        return (
                                            <code className="bg-white/10 px-1 py-0.5 rounded text-primary font-mono text-sm" {...props}>
                                                {children}
                                            </code>
                                        );
                                    }

                                    return (
                                        <CodePreview
                                            code={String(children).replace(/\n$/, '')}
                                            language={match ? match[1] : ''}
                                        />
                                    );
                                },
                            }}
                        >
                            {message.text}
                        </ReactMarkdown>
                    ) : (
                        message.text
                    )}

                    {/* Glow effect for bot */}
                    {isBot && (
                        <div className="absolute inset-0 rounded-2xl rounded-tl-none ring-1 ring-inset ring-white/10 pointer-events-none" />
                    )}
                </div>

                {/* Music Card (Legacy) */}
                {message.musicData && (
                    <div className="mt-2 w-full max-w-sm">
                        <MusicCard data={message.musicData} />
                    </div>
                )}

                {/* Enhanced Media Card */}
                {message.mediaData && (
                    <div className="mt-2 w-full">
                        <MediaCard data={message.mediaData} />
                    </div>
                )}

                {/* Generated Image */}
                {message.imageUrl && (
                    <div className="mt-2 w-full max-w-sm space-y-2">
                        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <img
                                src={message.imageUrl}
                                alt="Generated"
                                className="w-full h-auto object-cover"
                                loading="lazy"
                            />
                        </div>
                        <button
                            onClick={() => handleDownloadImage(message.imageUrl!)}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg transition-all text-xs font-medium"
                        >
                            <Download className="w-4 h-4" /> Download Image
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChatBubble;
