import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex space-x-1.5 p-2 bg-dark-lighter/50 rounded-2xl w-fit">
            {[0, 1, 2].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                        y: [0, -5, 0],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: dot * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default TypingIndicator;
