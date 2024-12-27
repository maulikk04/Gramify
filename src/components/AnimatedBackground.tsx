import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

const generateCircles = (count: number) => {
  return [...Array(count)].map(() => ({
    width: Math.random() * 400 + 200,
    height: Math.random() * 400 + 200,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 2,
    offsetX: Math.random() * 100 - 50,
    offsetY: Math.random() * 100 - 50,
  }));
};

const AnimatedBackground = memo(() => {
  const circles = useMemo(() => generateCircles(5), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {circles.map((circle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.2, 1],
            x: [0, circle.offsetX, 0],
            y: [0, circle.offsetY, 0],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
          style={{
            width: `${circle.width}px`,
            height: `${circle.height}px`,
            top: `${circle.top}%`,
            left: `${circle.left}%`,
          }}
        />
      ))}
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;