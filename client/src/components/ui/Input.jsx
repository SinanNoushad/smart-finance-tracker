import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

const InputWrapper = styled.div`
  margin-bottom: 1.25rem;
  width: 100%;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9375rem;
  color: ${({ theme, $error }) => 
    $error ? theme.colors.danger : theme.colors.dark};
  transition: color 0.2s ease;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.dark};
  background-color: ${({ theme }) => theme.colors.light};
  background-clip: padding-box;
  border: 1px solid ${({ theme, $error }) => 
    $error ? theme.colors.danger : theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  appearance: none;
  
  &:focus {
    color: ${({ theme }) => theme.colors.dark};
    background-color: #fff;
    border-color: ${({ theme, $error }) => 
      $error ? theme.colors.danger : theme.colors.primary};
    outline: 0;
    box-shadow: 0 0 0 3px ${({ theme, $error }) => 
      $error ? `${theme.colors.danger}33` : `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
    opacity: 1;
  }
  
  &:disabled,
  &[readonly] {
    background-color: ${({ theme }) => theme.colors.grayLight};
    opacity: 1;
  }
  
  ${({ $hasIcon }) => $hasIcon && 'padding-left: 2.5rem;'}
  
  ${({ $size }) => 
    $size === 'sm' && 
    css`
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    `}
    
  ${({ $size }) => 
    $size === 'lg' && 
    css`
      padding: 1rem 1.25rem;
      font-size: 1.125rem;
    `}
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray};
  pointer-events: none;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.danger};
  animation: ${({ theme }) => theme.animations.fadeIn} 0.2s ease-out;
`;

const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  icon,
  size = 'md',
  className = '',
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <InputWrapper className={className}>
      {label && (
        <Label htmlFor={inputId} $error={!!error}>
          {label}
          {required && <span style={{ color: theme.colors.danger }}> *</span>}
        </Label>
      )}
      <InputContainer>
        {icon && <InputIcon>{icon}</InputIcon>}
        <StyledInput
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          $error={!!error}
          $hasIcon={!!icon}
          $size={size}
          {...props}
        />
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Input;
