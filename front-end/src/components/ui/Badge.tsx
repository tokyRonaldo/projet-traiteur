interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'featured';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const styles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    featured: 'bg-white/90 backdrop-blur-md text-primary border border-primary/10',
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}