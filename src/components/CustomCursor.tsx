import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updatePosition);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-purple-500 rounded-full pointer-events-none mix-blend-difference z-[9999]"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: isPointer ? 1.5 : 1,
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          type: "spring",
          mass: 0.3,
          stiffness: 100,
          damping: 10,
          opacity: {
            duration: 2,
            repeat: Infinity,
          },
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-purple-500 rounded-full pointer-events-none mix-blend-difference z-[9999]"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isPointer ? 1.5 : 1,
          rotate: isPointer ? 45 : 0,
        }}
        transition={{
          type: "spring",
          mass: 0.7,
          stiffness: 50,
          damping: 10,
        }}
      />
    </>
  );
};

export default CustomCursor;