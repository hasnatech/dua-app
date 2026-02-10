import React from 'react';
import { motion } from 'framer-motion';
import DuaCard from './DuaCard';
import { Dua } from '@/types/public';

interface SwipeableDuaCardProps {
    dua: Dua;
    categoryName: string;
    direction: number; // 1 for right (next), -1 for left (prev)
}

const SwipeableDuaCard: React.FC<SwipeableDuaCardProps> = ({
    dua,
    categoryName,
    direction
}) => {
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95,
            zIndex: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            zIndex: 1,
            transition: { duration: 0.3 }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95,
            zIndex: 0,
            transition: { duration: 0.3 }
        })
    };

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
        >
            <div className="w-full h-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 relative pointer-events-auto">
                <DuaCard dua={dua} categoryName={categoryName} />
            </div>
        </motion.div>
    );
};

export default SwipeableDuaCard;
