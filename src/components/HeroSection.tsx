import { Brain, ArrowRight, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const navigate = useNavigate();
  
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <section className="hero-section">
      {/* Navigation Header */}
      <header className="hero-header">
        <div className="hero-header-content">
          <div className="hero-logo">
            <div className="hero-logo-icon">
              <Brain />
            </div>
            <span className="hero-logo-text">EPC Reasoning Engine</span>
          </div>
          
          <nav className="hero-nav">
            <a href="#features" className="hero-nav-link" onClick={(e) => { e.preventDefault(); scrollToFeatures(); }}>
              Features
            </a>
            <a href="#how-it-works" className="hero-nav-link">How It Works</a>
            <a href="#about" className="hero-nav-link">About</a>
            <button className="hero-nav-login" onClick={handleLogin}>
              Login
            </button>
            <button className="hero-nav-btn" onClick={onGetStarted}>
              Get Started
              <ArrowRight className="hero-nav-btn-icon" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="hero-mobile-menu" aria-label="Open menu">
            <div className="hero-mobile-menu-bar"></div>
            <div className="hero-mobile-menu-bar"></div>
            <div className="hero-mobile-menu-bar"></div>
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles className="hero-badge-icon" />
          <span>Structured AI Reasoning Framework</span>
        </div>

        <h1 className="hero-title">
          Intelligent Decision-Making
          <br />
          <span className="hero-title-gradient">Through Transparent Reasoning</span>
        </h1>

        <p className="hero-description">
          Experience AI that doesn't just give answers—it shows you how it thinks. 
          Our EPC (Event-Process-Condition) framework breaks down complex reasoning 
          into clear, explainable steps you can trust.
        </p>

        <div className="hero-cta">
          <button className="hero-cta-primary" onClick={onGetStarted}>
            <span>Start Exploring</span>
            <ArrowRight className="hero-cta-icon" />
          </button>
          
          <button className="hero-cta-secondary">
            <Play className="hero-cta-play-icon" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">95%+</div>
            <div className="hero-stat-label">Accuracy Rate</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">Explainable Results</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">Real-time</div>
            <div className="hero-stat-label">Processing</div>
          </div>
        </div>
      </div>

      {/* Visual Element */}
      <div className="hero-visual">
        <div className="hero-visual-card hero-visual-card-1">
          <div className="hero-visual-badge hero-visual-badge-blue">Event</div>
          <div className="hero-visual-text">Query received</div>
        </div>
        
        <div className="hero-visual-arrow">→</div>
        
        <div className="hero-visual-card hero-visual-card-2">
          <div className="hero-visual-badge hero-visual-badge-indigo">Process</div>
          <div className="hero-visual-text">Analyzing data</div>
        </div>
        
        <div className="hero-visual-arrow">→</div>
        
        <div className="hero-visual-card hero-visual-card-3">
          <div className="hero-visual-badge hero-visual-badge-violet">Condition</div>
          <div className="hero-visual-text">Result validated</div>
        </div>
      </div>
    </section>
  );
}