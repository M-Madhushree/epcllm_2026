import { ArrowRight, CheckCircle2 } from 'lucide-react';
import './CTASection.css';

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  const benefits = [
    'No credit card required',
    'Start using immediately',
    'Full access to all features',
    'Unlimited queries'
  ];

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-card">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Experience
              <br />
              <span className="cta-title-gradient">Transparent AI Reasoning?</span>
            </h2>
            <p className="cta-description">
              Join thousands of users who trust our EPC framework for critical decision-making and analysis.
            </p>
            
            <div className="cta-benefits">
              {benefits.map((benefit, index) => (
                <div key={index} className="cta-benefit">
                  <CheckCircle2 className="cta-benefit-icon" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <button className="cta-button" onClick={onGetStarted}>
              <span>Get Started Now</span>
              <ArrowRight className="cta-button-icon" />
            </button>

            <p className="cta-note">
              Free to use. No installation required.
            </p>
          </div>

          <div className="cta-visual">
            <div className="cta-visual-glow"></div>
            <div className="cta-visual-card cta-visual-card-1">
              <div className="cta-visual-stat">
                <div className="cta-visual-stat-value">95%</div>
                <div className="cta-visual-stat-label">Accuracy</div>
              </div>
            </div>
            <div className="cta-visual-card cta-visual-card-2">
              <div className="cta-visual-stat">
                <div className="cta-visual-stat-value">100%</div>
                <div className="cta-visual-stat-label">Explainable</div>
              </div>
            </div>
            <div className="cta-visual-card cta-visual-card-3">
              <div className="cta-visual-stat">
                <div className="cta-visual-stat-value">&lt;1s</div>
                <div className="cta-visual-stat-label">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
