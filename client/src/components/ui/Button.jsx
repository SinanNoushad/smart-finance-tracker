import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme, rounded }) => 
    rounded === 'pill' ? theme.borderRadius.pill : theme.borderRadius.md};
  font-weight: 500;
  font-size: 0.9375rem;
  line-height: 1.5;
  cursor: pointer;
  transition: ${theme.transition};
  border: 1px solid transparent;
  white-space: nowrap;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${theme.colors.secondary};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border-color: ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover {
            background-color: rgba(67, 97, 238, 0.1);
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          &:hover {
            background-color: rgba(67, 97, 238, 0.1);
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.danger};
          color: white;
          &:hover {
            background-color: #d32f2f;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.grayLight};
          color: ${theme.colors.dark};
          &:hover {
            background-color: #d1d5db;
          }
        `;
    }
  }}

  ${({ size }) =>
    size === 'sm' &&
    css`
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    `}

  ${({ size }) =>
    size === 'lg' &&
    css`
      padding: 0.75rem 1.5rem;
      font-size: 1.0625rem;
    `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  rounded = false,
  disabled = false,
  startIcon,
  endIcon,
  className = '',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      rounded={rounded ? 'pill' : undefined}
      disabled={disabled}
      className={`${className} ${disabled ? 'opacity-60' : ''}`}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
