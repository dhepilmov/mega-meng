import React, { useEffect, useRef, useState } from 'react';

// Animation utility types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Default animation configurations
export const ANIMATION_CONFIGS = {
  fadeIn: {
    duration: 300,
    easing: 'ease-in-out',
    fillMode: 'forwards' as const,
  },
  slideUp: {
    duration: 300,
    easing: 'ease-out',
    fillMode: 'forwards' as const,
  },
  slideDown: {
    duration: 300,
    easing: 'ease-out',
    fillMode: 'forwards' as const,
  },
  scaleIn: {
    duration: 200,
    easing: 'ease-out',
    fillMode: 'forwards' as const,
  },
} as const;

// Animation hook
export const useAnimation = (
  trigger: boolean,
  config: AnimationConfig = ANIMATION_CONFIGS.fadeIn
) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!elementRef.current || !trigger) return;

    setIsAnimating(true);
    
    const element = elementRef.current;
    const animation = element.animate(
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: config.duration,
        easing: config.easing,
        delay: config.delay || 0,
        fill: config.fillMode || 'forwards',
      }
    );

    animation.onfinish = () => {
      setIsAnimating(false);
    };

    return () => {
      animation.cancel();
      setIsAnimating(false);
    };
  }, [trigger, config]);

  return { elementRef, isAnimating };
};

// Stagger animation hook for multiple elements
export const useStaggerAnimation = (
  items: any[],
  baseDelay: number = 100,
  config: AnimationConfig = ANIMATION_CONFIGS.fadeIn
) => {
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (items.length === 0) return;

    const timeouts: NodeJS.Timeout[] = [];
    
    items.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setAnimatedItems(prev => new Set([...prev, index]));
      }, index * baseDelay);
      
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [items, baseDelay]);

  const isItemAnimated = (index: number) => animatedItems.has(index);

  return { isItemAnimated };
};

// Component wrapper for animated elements
interface AnimatedElementProps {
  children: React.ReactNode;
  animation: keyof typeof ANIMATION_CONFIGS;
  trigger?: boolean;
  delay?: number;
  className?: string;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  trigger = true,
  delay = 0,
  className = '',
}) => {
  const config = { ...ANIMATION_CONFIGS[animation], delay };
  const { elementRef, isAnimating } = useAnimation(trigger, config);

  return (
    <div 
      ref={elementRef as any}
      className={`${className} ${isAnimating ? 'animating' : ''}`}
      style={{ opacity: trigger ? 1 : 0 }}
    >
      {children}
    </div>
  );
};