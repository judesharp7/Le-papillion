export const ButterflyLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bfly-wing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="oklch(0.62 0.22 290)" />
        <stop offset="50%" stopColor="oklch(0.78 0.15 220)" />
        <stop offset="100%" stopColor="oklch(0.7 0.22 340)" />
      </linearGradient>
    </defs>
    <path d="M32 32 C16 12 4 18 8 32 C4 46 16 52 32 32 Z" fill="url(#bfly-wing)" opacity="0.95" />
    <path d="M32 32 C48 12 60 18 56 32 C60 46 48 52 32 32 Z" fill="url(#bfly-wing)" opacity="0.95" />
    <ellipse cx="32" cy="32" rx="2" ry="14" fill="oklch(0.13 0.04 280)" />
    <circle cx="32" cy="18" r="2.5" fill="oklch(0.13 0.04 280)" />
  </svg>
);
