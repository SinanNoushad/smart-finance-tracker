import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { useForm, validateEmail, validatePassword, validateConfirmPassword } from '../hooks/useForm';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const SignupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 76px);
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.light};
`;

const SignupCard = styled(Card)`
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

const SigninText = styled.p`
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

// Validation function for signup form
const validateSignupForm = (values) => {
  const errors = {};
  
  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(values.password, values.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return errors;
};

const Signup = () => {
  const { signup, error: authError, setError: setAuthError } = useContext(AuthContext);
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
    { 
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validateSignupForm
  );
  
  // Handle form submission
  const handleSubmit = async () => {
    const { success, error } = await signup(
      values.name, 
      values.email, 
      values.password
    );
    
    if (success) {
      // Successfully signed up, redirect to home or previous location
      const from = location.state?.from?.pathname || '/';
      navigate(from, { 
        replace: true,
        state: { fromSignup: true }
      });
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
    
    // Check for redirect message from login
    if (location.state?.fromLogin) {
      setFormError('form', 'Please create an account to continue.');
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [authError, setAuthError, location.state, setFormError]);

  return (
    <SignupContainer>
      <SignupCard>
        <Title>Create an Account</Title>
        <Subtitle>Join us to take control of your finances</Subtitle>
        
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
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            required
            autoComplete="name"
          />
          
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />
          
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="new-password"
          />
          
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
          
          <Button 
            type="submit" 
            fullWidth 
            size="lg"
            disabled={isSubmitting}
            style={{ marginTop: '0.5rem' }}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </StyledForm>
        
        <SigninText>
          Already have an account?{' '}
          <Link to="/login" state={{ fromSignup: true }}>Sign in</Link>
        </SigninText>
      </SignupCard>
    </SignupContainer>
  );
};

export default Signup;
