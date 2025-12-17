import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from 'lucide-react';
import botAvatar from '../assets/avatar.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodePreview from './CodePreview';

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isBot = message.sender === 'bot';

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
            </div>
        </motion.div>
    );
};

export default ChatBubble;
