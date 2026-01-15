import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import './AuthForm.css';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '' };

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-subtitle">Join EPC Reasoning Engine today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          {/* Full Name Field */}
          <div className="auth-form-group">
            <label htmlFor="signup-fullname" className="auth-form-label">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" />
              <input
                id="signup-fullname"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`auth-input ${errors.fullName ? 'auth-input-error' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.fullName && <span className="auth-error-message">{errors.fullName}</span>}
          </div>

          {/* Email Field */}
          <div className="auth-form-group">
            <label htmlFor="signup-email" className="auth-form-label">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" />
              <input
                id="signup-email"
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
            <label htmlFor="signup-password" className="auth-form-label">
              Password
            </label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div className="auth-form-group">
            <label htmlFor="signup-confirm-password" className="auth-form-label">
              Confirm Password
            </label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="auth-password-toggle"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && <span className="auth-error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="auth-button-spinner" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Switch to Sign In */}
          <div className="auth-form-footer">
            <span className="auth-form-footer-text">Already have an account?</span>
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="auth-switch-button"
              disabled={isLoading}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
