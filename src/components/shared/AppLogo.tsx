import Link from 'next/link';
import { Terminal } from 'lucide-react';

type AppLogoProps = {
  className?: string;
  iconSize?: number;
};

export function AppLogo({ className, iconSize = 28 }: AppLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity ${className}`}>
      <Terminal size={iconSize} className="text-accent" />
      <span className="text-glow-primary">Crypton Nexus</span>
    </Link>
  );
}
