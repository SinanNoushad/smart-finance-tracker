import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import Button from './ui/Button';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

// Styled Components
const Nav = styled.nav`
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.75rem 0;
  transition: ${({ theme }) => theme.transition};
  
  ${({ scrolled }) => scrolled && `
    box-shadow: ${theme.shadows.md};
    padding: 0.5rem 0;
  `}
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    bottom: 0;
    width: 280px;
    background: white;
    flex-direction: column;
    padding: 5rem 1.5rem 2rem;
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease-in-out;
    z-index: 1000;
  }
`;

const NavItem = styled.li`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    
    &::after {
      display: none;
    }
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.gray};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    justify-content: center;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.grayLight};
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
  
  @media (max-width: 768px) {
    margin: 1.5rem 0 0;
    flex-direction: column;
    width: 100%;
  }
`;

const UserGreeting = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: block;
  }
  
  .hamburger {
    width: 24px;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.dark};
    position: relative;
    transition: all 0.3s ease;
    
    &::before, &::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background-color: ${({ theme }) => theme.colors.dark};
      left: 0;
      transition: all 0.3s ease;
    }
    
    &::before {
      transform: translateY(-6px);
    }
    
    &::after {
      transform: translateY(6px);
    }
    
    ${({ $isOpen }) => $isOpen && `
      background-color: transparent;
      
      &::before {
        transform: rotate(45deg);
      }
      
      &::after {
        transform: rotate(-45deg);
      }
    `}
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/transactions', label: 'Transactions', icon: '💸' },
    { to: '/budgets', label: 'Budgets', icon: '💰' },
    { to: '/goals', label: 'Goals', icon: '🎯' },
    { to: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <>
      <Nav scrolled={scrolled}>
        <NavContainer>
          <Logo to="/">
            <span>💸</span>
            <span>Smart Finance</span>
          </Logo>
          
          <MobileMenuButton 
            onClick={toggleMenu} 
            aria-label="Toggle navigation"
            $isOpen={isMenuOpen}
          >
            <div className="hamburger" />
          </MobileMenuButton>
          
          <NavLinks isOpen={isMenuOpen}>
            {user && navItems.map((item) => (
              <NavItem key={item.to}>
                <NavLink 
                  to={item.to}
                  $active={location.pathname === item.to}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </NavItem>
            ))}
            
            {user ? (
              <UserMenu>
                <UserGreeting>Hi, {user.name}</UserGreeting>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
              </UserMenu>
            ) : (
              <>
                <NavItem>
                  <NavLink to="/login" $active={location.pathname === '/login'}>
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <Button 
                    as={Link} 
                    to="/signup" 
                    variant="primary" 
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </NavItem>
              </>
            )}
          </NavLinks>
        </NavContainer>
      </Nav>
      
      <Overlay 
        $isOpen={isMenuOpen} 
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Add padding to the top of the main content to account for fixed navbar */}
      <div style={{ height: '76px' }} />
    </>
  );
};

export default NavBar;
