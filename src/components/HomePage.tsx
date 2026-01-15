import { useNavigate } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <div className="home-page">
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
}