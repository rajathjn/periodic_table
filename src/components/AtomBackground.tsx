import React from 'react';

interface AtomSVGProps {
  size?: number;
  color?: string;
}

const AtomSVG: React.FC<AtomSVGProps> = ({ size = 120, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="8" fill={color} opacity="0.6" />
    <ellipse cx="60" cy="60" rx="50" ry="18" stroke={color} strokeWidth="1.2" opacity="0.4" />
    <ellipse cx="60" cy="60" rx="50" ry="18" stroke={color} strokeWidth="1.2" opacity="0.4" transform="rotate(60 60 60)" />
    <ellipse cx="60" cy="60" rx="50" ry="18" stroke={color} strokeWidth="1.2" opacity="0.4" transform="rotate(120 60 60)" />
    <circle cx="110" cy="60" r="4" fill={color} opacity="0.5" />
    <circle cx="35" cy="16.7" r="4" fill={color} opacity="0.5" />
    <circle cx="35" cy="103.3" r="4" fill={color} opacity="0.5" />
  </svg>
);

const ATOM_POSITIONS = [
  { x: '5%', y: '10%', size: 80, delay: 0 },
  { x: '85%', y: '5%', size: 100, delay: -3 },
  { x: '15%', y: '70%', size: 60, delay: -7 },
  { x: '75%', y: '80%', size: 90, delay: -2 },
  { x: '50%', y: '30%', size: 70, delay: -5 },
  { x: '90%', y: '50%', size: 50, delay: -8 },
  { x: '30%', y: '90%', size: 85, delay: -4 },
  { x: '60%', y: '65%', size: 55, delay: -6 },
  { x: '10%', y: '40%', size: 75, delay: -1 },
  { x: '70%', y: '15%', size: 65, delay: -9 },
  { x: '40%', y: '50%', size: 45, delay: -3.5 },
  { x: '95%', y: '85%', size: 70, delay: -7.5 },
];

const AtomBackground: React.FC = () => {
  return (
    <div className="atom-background" aria-hidden="true">
      {ATOM_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="atom-bg-item"
          style={{
            left: pos.x,
            top: pos.y,
            animationDelay: `${pos.delay}s`,
          }}
        >
          <AtomSVG size={pos.size} color="#818cf8" />
        </div>
      ))}
    </div>
  );
};

export default AtomBackground;
