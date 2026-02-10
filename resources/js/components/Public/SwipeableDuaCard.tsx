import React, { useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import DuaCard from './DuaCard';
import { Dua } from '@/types/public';

interface SwipeableDuaCardProps {
    dua: Dua;
    categoryName: string;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    direction: number; // 1 for right (next), -1 for left (prev)
}

const SwipeableDuaCard: React.FC<SwipeableDuaCardProps> = ({
    dua,
    categoryName,
    onSwipeLeft,
    onSwipeRight,
    direction
}) => {
    const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onSwipeRight();
        } else if (info.offset.x < -threshold) {
            onSwipeLeft();
        }
    };

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
            drag="x"
            dragConstraints={constraints}
            dragDirectionLock
            onDragEnd={handleDragEnd}
            style={{ x, rotate, opacity, touchAction: 'pan-y' }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        >
            <div className="w-full h-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 relative pointer-events-auto">
                {/* Visual feedback for swipe direction could go here (e.g., Like/Nope overlays) */}
                <DuaCard dua={dua} categoryName={categoryName} />
            </div>
        </motion.div>
    );
};

export default SwipeableDuaCard;
