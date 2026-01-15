import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { Brain, ArrowLeft } from 'lucide-react';
import './AuthPage.css';

export function AuthPage() {
  const [activeForm, setActiveForm] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const switchToSignUp = () => {
    setActiveForm('signup');
  };

  const switchToSignIn = () => {
    setActiveForm('signin');
  };

  return (
    <div className="auth-page">
      <button onClick={handleBackToHome} className="auth-back-button">
        <ArrowLeft />
        <span>Back to Home</span>
      </button>

      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <Brain />
              </div>
              <h1 className="auth-logo-text">EPC Reasoning Engine</h1>
            </div>
            
            <h2 className="auth-branding-title">
              Welcome to Transparent
              <br />
              <span className="auth-branding-gradient">AI Reasoning</span>
            </h2>
            
            <p className="auth-branding-description">
              Experience intelligent decision-making through our Event-Process-Condition framework. 
              Every answer is explainable, every step is transparent.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>
                <div>
                  <div className="auth-feature-title">100% Explainable</div>
                  <div className="auth-feature-text">See how AI thinks</div>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>
                <div>
                  <div className="auth-feature-title">Structured Reasoning</div>
                  <div className="auth-feature-text">Clear logical flow</div>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>
                <div>
                  <div className="auth-feature-title">High Accuracy</div>
                  <div className="auth-feature-text">Reliable results</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="auth-forms">
          <div className={`auth-forms-container ${activeForm === 'signup' ? 'show-signup' : 'show-signin'}`}>
            <SignInForm onSwitchToSignUp={switchToSignUp} />
            <SignUpForm onSwitchToSignIn={switchToSignIn} />
          </div>
        </div>
      </div>
    </div>
  );
}
