import React, { useRef, useState } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  depth?: number;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  onClick,
  depth = 12,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -depth;
    const rotY = ((x - centerX) / centerX) * depth;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transition-all duration-200 cursor-pointer ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full transition-transform duration-150 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
};
