import { GitBranch, Eye, Shield, Zap, Target, LineChart } from 'lucide-react';
import './FeaturesSection.css';

export function FeaturesSection() {
  const features = [
    {
      icon: GitBranch,
      title: 'Structured Reasoning',
      description: 'Every decision follows a clear Event-Process-Condition flow, ensuring logical consistency and reliability.',
      color: 'blue'
    },
    {
      icon: Eye,
      title: '100% Explainable',
      description: 'See exactly how the AI reaches conclusions with step-by-step reasoning breakdowns and transparent logic.',
      color: 'indigo'
    },
    {
      icon: Shield,
      title: 'Reliable Results',
      description: 'Built-in validation at every step ensures accuracy and reduces hallucinations or unreliable outputs.',
      color: 'violet'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get instant responses without sacrificing the depth and quality of reasoning analysis.',
      color: 'cyan'
    },
    {
      icon: Target,
      title: 'Domain-Specific',
      description: 'Trained on specialized knowledge to provide contextually accurate and relevant insights.',
      color: 'purple'
    },
    {
      icon: LineChart,
      title: 'Confidence Scoring',
      description: 'Every answer includes a confidence metric based on evidence strength and reasoning quality.',
      color: 'green'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-header">
          <div className="features-badge">Features</div>
          <h2 className="features-title">
            Why Choose EPC Reasoning?
          </h2>
          <p className="features-description">
            Built on a foundation of transparency, reliability, and intelligent decision-making
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`feature-card feature-card-${feature.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`feature-icon feature-icon-${feature.color}`}>
                  <Icon />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
