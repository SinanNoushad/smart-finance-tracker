import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const CardWrapper = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme, noShadow }) => 
    noShadow ? 'none' : theme.shadows.md};
  overflow: hidden;
  transition: ${theme.transition};
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.grayLight};

  &:hover {
    ${({ hoverEffect }) => 
      hoverEffect && `box-shadow: ${theme.shadows.lg}; transform: translateY(-2px);`}
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme, headerBg }) => 
    headerBg || 'transparent'};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
`;

const CardBody = styled.div`
  padding: ${({ padding }) => padding || '1.5rem'};
  flex: 1;
  ${({ centerContent }) => 
    centerContent && 'display: flex; flex-direction: column; justify-content: center; align-items: center;'}
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
  background-color: ${({ theme, footerBg }) => 
    footerBg || theme.colors.grayLight};
`;

const Card = ({
  title,
  children,
  footer,
  headerActions,
  className = '',
  noShadow = false,
  hoverEffect = true,
  headerBg,
  footerBg,
  padding,
  centerContent = false,
  ...props
}) => {
  return (
    <CardWrapper 
      className={`card ${className}`} 
      noShadow={noShadow}
      hoverEffect={hoverEffect}
      {...props}
    >
      {(title || headerActions) && (
        <CardHeader headerBg={headerBg}>
          {title && <CardTitle>{title}</CardTitle>}
          {headerActions && <div>{headerActions}</div>}
        </CardHeader>
      )}
      <CardBody padding={padding} centerContent={centerContent}>
        {children}
      </CardBody>
      {footer && <CardFooter footerBg={footerBg}>{footer}</CardFooter>}
    </CardWrapper>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  headerActions: PropTypes.node,
  className: PropTypes.string,
  noShadow: PropTypes.bool,
  hoverEffect: PropTypes.bool,
  headerBg: PropTypes.string,
  footerBg: PropTypes.string,
  padding: PropTypes.string,
  centerContent: PropTypes.bool,
};

export default Card;
