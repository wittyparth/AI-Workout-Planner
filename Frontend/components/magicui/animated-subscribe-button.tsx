"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

interface AnimatedSubscribeButtonProps
    extends Omit<HTMLMotionProps<"button">, "ref"> {
    subscribeStatus?: boolean;
    initialText: React.ReactNode;
    changeText: React.ReactNode;
    buttonColor?: string;
    buttonTextColor?: string;
    className?: string;
}

export const AnimatedSubscribeButton = React.forwardRef<
    HTMLButtonElement,
    AnimatedSubscribeButtonProps
>(({ subscribeStatus, initialText, changeText, buttonColor, buttonTextColor, onClick, className, ...props }, ref) => {
    const isControlled = subscribeStatus !== undefined;
    const [isSubscribed, setIsSubscribed] = useState<boolean>(
        subscribeStatus ?? false,
    );

    useEffect(() => {
        if (isControlled) {
            setIsSubscribed(subscribeStatus!);
        }
    }, [subscribeStatus, isControlled]);

    return (
        <AnimatePresence mode="wait">
            {isSubscribed ? (
                <motion.button
                    ref={ref}
                    className={cn(
                        "relative flex h-10 w-fit items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-primary-foreground",
                        className,
                    )}
                    style={{
                        backgroundColor: buttonColor,
                        color: buttonTextColor,
                    }}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (!isControlled) {
                            setIsSubscribed(false);
                        }
                        onClick?.(e);
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    {...props}
                >
                    <motion.span
                        key="action"
                        className="relative flex h-full w-full items-center justify-center font-semibold"
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                    >
                        {changeText}
                    </motion.span>
                </motion.button>
            ) : (
                <motion.button
                    ref={ref}
                    className={cn(
                        "relative flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border-none bg-primary px-6 text-primary-foreground",
                        className,
                    )}
                    style={{
                        backgroundColor: buttonColor,
                        color: buttonTextColor,
                    }}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (!isControlled) {
                            setIsSubscribed(true);
                        }
                        onClick?.(e);
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    {...props}
                >
                    <motion.span
                        key="reaction"
                        className="relative flex items-center justify-center font-semibold"
                        initial={{ x: 0 }}
                        exit={{ x: 50, transition: { duration: 0.1 } }}
                    >
                        {initialText}
                    </motion.span>
                </motion.button>
            )}
        </AnimatePresence>
    );
});

AnimatedSubscribeButton.displayName = "AnimatedSubscribeButton";
