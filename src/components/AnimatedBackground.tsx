import './AnimatedBackground.css';

export function AnimatedBackground() {
  return (
    <div className="animated-background">
      {/* Floating geometric shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>
      <div className="shape shape-5"></div>
      <div className="shape shape-6"></div>
      
      {/* Blueprint lines */}
      <svg className="blueprint-lines" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.3)" />
          </linearGradient>
        </defs>
        <line className="blueprint-line line-1" x1="0" y1="0" x2="100%" y2="100%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line className="blueprint-line line-2" x1="100%" y1="0" x2="0" y2="100%" stroke="url(#lineGradient)" strokeWidth="2" />
        <circle className="blueprint-circle circle-1" cx="20%" cy="30%" r="100" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
        <circle className="blueprint-circle circle-2" cx="80%" cy="70%" r="150" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}
