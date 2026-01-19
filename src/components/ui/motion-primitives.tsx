'use client';

import { motion } from 'framer-motion';

// --- Default Animation Settings ---
const defaultDuration = 0.5;
const defaultEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1]; // Cubic bezier for smooth motion

// --- Fade In Component ---
export const FadeIn = ({
    children,
    delay = 0,
    duration = defaultDuration,
    className = '',
    yOffset = 20,
}: {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
    yOffset?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: yOffset }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration, delay, ease: defaultEase }}
        className={className}
    >
        {children}
    </motion.div>
);

// --- Slide In Component ---
export const SlideIn = ({
    children,
    direction = 'left',
    delay = 0,
    duration = defaultDuration,
    className = '',
}: {
    children: React.ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    delay?: number;
    duration?: number;
    className?: string;
}) => {
    const variants = {
        hidden: {
            x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
            y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
            opacity: 0,
        },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={variants}
            transition={{ duration, delay, ease: defaultEase }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// --- Stagger Container ---
export const StaggerContainer = ({
    children,
    delay = 0,
    stagger = 0.1,
    className = '',
}: {
    children: React.ReactNode;
    delay?: number;
    stagger?: number;
    className?: string;
}) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
            hidden: {},
            visible: {
                transition: {
                    staggerChildren: stagger,
                    delayChildren: delay,
                },
            },
        }}
        className={className}
    >
        {children}
    </motion.div>
);

// --- Stagger Item (Use inside StaggerContainer) ---
export const StaggerItem = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: defaultDuration, ease: defaultEase }}
        className={className}
    >
        {children}
    </motion.div>
);

// --- Hover Scale Effect ---
export const HoverCard = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={className}
    >
        {children}
    </motion.div>
);
