import Link from 'next/link';
import type { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: FC<LogoProps> = ({ size = 'md', className }) => {
  const textSizeClass = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const svgSizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={`${svgSizeClass} fill-primary`}
        aria-label="Feiwu Studio Logo"
      >
        <path d="M4 4h16v2H4zM4 9h16v2H4zM4 14h10v2H4zM19 14h1v6h-1zM16 18h3v2h-3z"/>
      </svg>
      <span className={`${textSizeClass} font-bold text-foreground whitespace-nowrap`}>
        Feiwu<span className="text-primary">.studio</span>
      </span>
    </Link>
  );
};

export default Logo;