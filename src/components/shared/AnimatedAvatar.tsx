import React from 'react';
import { motion } from 'motion/react';

const AvatarGrandfather = () => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    width="100%" 
    height="100%" 
    preserveAspectRatio="xMinYMid slice"
    style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }}
  >
    <circle cx="50" cy="50" r="48" fill="#FDE68A" />
    <motion.path 
      d="M30 70 Q50 90 70 70" 
      stroke="#92400E" strokeWidth="4" strokeLinecap="round"
      animate={{ d: ["M30 70 Q50 90 70 70", "M30 72 Q50 85 70 72", "M30 70 Q50 90 70 70"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#92400E" />
    <circle cx="65" cy="45" r="4" fill="#92400E" />
    {/* Glasses */}
    <rect x="25" y="40" width="20" height="10" rx="2" stroke="#D97706" strokeWidth="2" fill="none" />
    <rect x="55" y="40" width="20" height="10" rx="2" stroke="#D97706" strokeWidth="2" fill="none" />
    <line x1="45" y1="45" x2="55" y2="45" stroke="#D97706" strokeWidth="2" />
    {/* Bisht/Clothing */}
    <path d="M20 100 Q50 70 80 100" fill="#1F2937" />
    <path d="M30 100 Q50 80 70 100" fill="#F3F4F6" />
    {/* Agal & Ghutra */}
    <path d="M20 30 Q50 0 80 30 L90 60 Q50 40 10 60 Z" fill="#FFFFFF" />
    <path d="M25 25 Q50 15 75 25" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const AvatarGrandmother = () => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    width="100%" 
    height="100%" 
    preserveAspectRatio="xMinYMid slice"
    style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }}
  >
    <circle cx="50" cy="50" r="48" fill="#FECACA" />
    <motion.path 
      d="M35 65 Q50 75 65 65" 
      stroke="#991B1B" strokeWidth="3" strokeLinecap="round"
      animate={{ d: ["M35 65 Q50 75 65 65", "M35 63 Q50 70 65 63", "M35 65 Q50 75 65 65"] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#991B1B" />
    <circle cx="65" cy="45" r="4" fill="#991B1B" />
    {/* Wrinkles */}
    <path d="M30 40 Q35 38 40 40" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 40 Q65 38 70 40" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
    {/* Jalabiya/Clothing */}
    <path d="M20 100 Q50 70 80 100" fill="#065F46" />
    {/* Gold Necklace */}
    <path d="M35 85 Q50 100 65 85" stroke="#FBBF24" strokeWidth="3" fill="none" />
    <circle cx="50" cy="93" r="4" fill="#FBBF24" />
    {/* Hijab/Shayla */}
    <path d="M15 40 Q50 -10 85 40 L90 100 Q50 80 10 100 Z" fill="#111827" />
  </svg>
);

const AvatarUncle = () => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    width="100%" 
    height="100%" 
    preserveAspectRatio="xMinYMid slice"
    style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }}
  >
    <circle cx="50" cy="50" r="48" fill="#D1D5DB" />
    <motion.path 
      d="M35 65 Q50 70 65 65" 
      stroke="#374151" strokeWidth="3" strokeLinecap="round"
      animate={{ d: ["M35 65 Q50 70 65 65", "M35 67 Q50 75 65 67", "M35 65 Q50 70 65 65"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#374151" />
    <circle cx="65" cy="45" r="4" fill="#374151" />
    {/* Mustache */}
    <path d="M40 58 Q50 55 60 58" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
    {/* Clothing */}
    <path d="M20 100 Q50 70 80 100" fill="#FFFFFF" />
    <path d="M40 100 L50 80 L60 100" fill="#E5E7EB" />
    {/* Ghutra */}
    <path d="M20 30 Q50 0 80 30 L90 60 Q50 40 10 60 Z" fill="#EF4444" />
    {/* Agal */}
    <path d="M25 25 Q50 15 75 25" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const AvatarAunt = () => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    width="100%" 
    height="100%" 
    preserveAspectRatio="xMinYMid slice"
    style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }}
  >
    <circle cx="50" cy="50" r="48" fill="#FBCFE8" />
    <motion.path 
      d="M35 65 Q50 75 65 65" 
      stroke="#831843" strokeWidth="3" strokeLinecap="round"
      animate={{ d: ["M35 65 Q50 75 65 65", "M35 62 Q50 70 65 62", "M35 65 Q50 75 65 65"] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#831843" />
    <circle cx="65" cy="45" r="4" fill="#831843" />
    {/* Eyelashes */}
    <path d="M31 41 L28 38 M35 39 L35 35 M39 41 L42 38" stroke="#831843" strokeWidth="2" strokeLinecap="round" />
    <path d="M61 41 L58 38 M65 39 L65 35 M69 41 L72 38" stroke="#831843" strokeWidth="2" strokeLinecap="round" />
    {/* Clothing */}
    <path d="M20 100 Q50 70 80 100" fill="#9D174D" />
    {/* Jewelry */}
    <circle cx="25" cy="65" r="5" fill="#FBBF24" />
    <circle cx="75" cy="65" r="5" fill="#FBBF24" />
    {/* Hair/Hijab */}
    <path d="M15 40 Q50 -10 85 40 L90 100 Q50 80 10 100 Z" fill="#4C1D95" />
  </svg>
);

const AvatarMaternalUncle = () => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    width="100%" 
    height="100%" 
    preserveAspectRatio="xMinYMid slice"
    style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }}
  >
    <circle cx="50" cy="50" r="48" fill="#BBF7D0" />
    <motion.path 
      d="M30 60 Q50 80 70 60" 
      stroke="#14532D" strokeWidth="4" strokeLinecap="round"
      animate={{ d: ["M30 60 Q50 80 70 60", "M30 65 Q50 85 70 65", "M30 60 Q50 80 70 60"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#14532D" />
    <circle cx="65" cy="45" r="4" fill="#14532D" />
    {/* Winking eye animation */}
    <motion.path 
      d="M60 45 Q65 40 70 45" 
      stroke="#14532D" strokeWidth="3" strokeLinecap="round" fill="none"
      animate={{ opacity: [0, 1, 0, 0] }}
      transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2, 1] }}
    />
    {/* Clothing */}
    <path d="M20 100 Q50 70 80 100" fill="#FFFFFF" />
    {/* Ghutra */}
    <path d="M20 30 Q50 0 80 30 L90 60 Q50 40 10 60 Z" fill="#FFFFFF" />
    {/* Agal tilted */}
    <path d="M25 20 Q50 15 75 30" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export default function AnimatedAvatar({ name, className, style }) {
  let AvatarComponent = AvatarUncle;
  
  if (name?.includes('الجدة')) AvatarComponent = AvatarGrandmother;
  else if (name?.includes('الجد')) AvatarComponent = AvatarGrandfather;
  else if (name?.includes('العمة')) AvatarComponent = AvatarAunt;
  else if (name?.includes('الخال')) AvatarComponent = AvatarMaternalUncle;
  else if (name?.includes('العم')) AvatarComponent = AvatarUncle;

  return (
    <div className={`animated-avatar ${className || ''}`} style={{
      ...style,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      <AvatarComponent />
    </div>
  );
}
