import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { theme } from '../styles/theme';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const BankConnectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 76px);
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.light};
`;

const BankConnectCard = styled(Card)`
  width: 100%;
  max-width: 480px;
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

const ErrorMessage = styled.div`
  background-color: ${theme.colors.danger}10;
  color: ${theme.colors.danger};
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 1.5rem;
  border-left: 3px solid ${theme.colors.danger};
  animation: ${fadeIn} 0.2s ease-out;
`;

const SuccessMessage = styled.div`
  background-color: ${theme.colors.success}10;
  color: ${theme.colors.success};
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 1.5rem;
  border-left: 3px solid ${theme.colors.success};
  animation: ${fadeIn} 0.2s ease-out;
`;

const BankConnect = () => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!bankName || !accountNumber) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/bank/connect', { bankName, accountNumber });
      setSuccess(res.data.message);
      // Optionally redirect after a short delay or show a success message
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard after successful connection
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect bank account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BankConnectContainer>
      <BankConnectCard>
        <Title>Connect Your Bank</Title>
        <Subtitle>Simulate connecting your bank account to fetch transactions.</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <StyledForm onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Bank Name (e.g., Mock Bank of America)"
            placeholder="Enter bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
          />
          <Input
            type="text"
            label="Account Number (e.g., 1234567890)"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Connecting...' : 'Connect Bank Account'}
          </Button>
        </StyledForm>
      </BankConnectCard>
    </BankConnectContainer>
  );
};

export default BankConnect;