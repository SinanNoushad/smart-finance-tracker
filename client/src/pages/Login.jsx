import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { useForm, validateEmail, validatePassword } from '../hooks/useForm';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 76px);
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.light};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  margin-bottom: 2rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.grayLight};
  }
  
  &::before {
    margin-right: 1rem;
  }
  
  &::after {
    margin-left: 1rem;
  }
`;

const ForgotPasswordLink = styled(Link)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s ease, text-decoration 0.2s ease;
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SignupText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 1.5rem;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

// Validation function for login form
const validateLoginForm = (values) => {
  const errors = {};
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

const Login = () => {
  const { login, error: authError, setError: setAuthError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize form with useForm hook
  const { 
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit: handleFormSubmit,
    setError: setFormError
  } = useForm(
    { email: '', password: '' },
    validateLoginForm
  );
  
  // Handle form submission
  const handleSubmit = async () => {
    const { success, error } = await login(values.email, values.password);
    
    if (success) {
      // Successfully logged in, redirect to home or previous location
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      return { success: true };
    } else {
      // Show error message from the auth context
      setFormError('form', error);
      return { success: false, error };
    }
  };
  
  // Handle form submission with validation
  const onSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit(handleSubmit);
  };
  
  // Clear any previous auth errors when component mounts
  useEffect(() => {
    if (authError) {
      setFormError('form', authError);
      setAuthError('');
    }
    
    // Check for redirect message from signup
    if (location.state?.fromSignup) {
      setFormError('form', 'Registration successful! Please log in to continue.');
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [authError, setAuthError, location.state, setFormError]);

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account to continue</Subtitle>
        
        {errors.form && (
          <div style={{
            backgroundColor: `${theme.colors.danger}10`,
            color: theme.colors.danger,
            padding: '0.75rem 1rem',
            borderRadius: theme.borderRadius.md,
            marginBottom: '1.5rem',
            borderLeft: `3px solid ${theme.colors.danger}`,
            animation: `${fadeIn} 0.2s ease-out`
          }}>
            {errors.form}
          </div>
        )}
        
        <StyledForm onSubmit={onSubmit} noValidate>
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="username"
          />
          
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
          />
          
          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <ForgotPasswordLink to="/forgot-password">
              Forgot password?
            </ForgotPasswordLink>
          </div>
          
          <Button 
            type="submit" 
            fullWidth 
            size="lg"
            disabled={isSubmitting}
            style={{ marginTop: '0.5rem' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <Divider>or</Divider>
          
          <Button 
            type="button" 
            variant="outline" 
            fullWidth
            onClick={() => {
              // Demo login functionality
              handleChange({
                target: {
                  name: 'email',
                  value: 'demo@example.com'
                }
              });
              handleChange({
                target: {
                  name: 'password',
                  value: 'demopass123'
                }
              });
            }}
          >
            Use Demo Account
          </Button>
        </StyledForm>
        
        <SignupText>
          Don't have an account?{' '}
          <Link to="/signup" state={{ fromLogin: true }}>Sign up</Link>
        </SignupText>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
