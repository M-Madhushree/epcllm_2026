import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import './AuthForm.css';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    // Navigate to app on success
    navigate('/app');
  };

  return (
    <div className="auth-form">
      <div className="auth-form-content">
        <div className="auth-form-header">
          <h2 className="auth-form-title">Welcome Back</h2>
          <p className="auth-form-subtitle">Sign in to continue to EPC Reasoning Engine</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          {/* Email Field */}
          <div className="auth-form-group">
            <label htmlFor="signin-email" className="auth-form-label">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" />
              <input
                id="signin-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className="auth-error-message">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="auth-form-group">
            <label htmlFor="signin-password" className="auth-form-label">
              Password
            </label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" />
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <span className="auth-error-message">{errors.password}</span>}
          </div>

          {/* Forgot Password */}
          <div className="auth-form-options">
            <button type="button" className="auth-forgot-password">
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="auth-button-spinner" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Switch to Sign Up */}
          <div className="auth-form-footer">
            <span className="auth-form-footer-text">Don't have an account?</span>
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="auth-switch-button"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
