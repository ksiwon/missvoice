// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Flex } from '../ui/StyledComponents';
import FaIcon from '../ui/FaIcon';

const NavbarWrapper = styled.nav`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
  
  ${({ $active, theme }) => $active && `
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
  `}
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.lg};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const MobileNavLink = styled.button<{ $active?: boolean }>`
  width: 100%;
  background: none;
  border: none;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background};
  }
  
  ${({ $active, theme }) => $active && `
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
  `}
`;

const StatusIndicator = styled.div<{ $status: 'idle' | 'processing' | 'ready' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'processing':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: ${theme.colors.warning};
          border: 1px solid rgba(245, 158, 11, 0.2);
        `;
      case 'ready':
        return `
          background: rgba(16, 185, 129, 0.1);
          color: ${theme.colors.success};
          border: 1px solid rgba(16, 185, 129, 0.2);
        `;
      default:
        return `
          background: rgba(100, 116, 139, 0.1);
          color: ${theme.colors.text.secondary};
          border: 1px solid rgba(100, 116, 139, 0.2);
        `;
    }
  }}
`;

interface NavbarProps {
  processingStatus?: 'idle' | 'processing' | 'ready';
}

const navItems = [
  { path: '/', label: 'Home', icon: 'home' as const },
  { path: '/upload', label: 'Upload', icon: 'upload' as const },
  { path: '/samples', label: 'Samples', icon: 'file-audio' as const },
  { path: '/processing', label: 'Processing', icon: 'magic' as const },
  { path: '/chat', label: 'Chat', icon: 'comments' as const },
];

export const Navbar: React.FC<NavbarProps> = ({ processingStatus = 'idle' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (processingStatus) {
      case 'processing':
        return <FaIcon name="spinner" spin />;
      case 'ready':
        return <FaIcon name="check" />;
      default:
        return <FaIcon name="robot" />;
    }
  };

  const getStatusText = () => {
    switch (processingStatus) {
      case 'processing':
        return 'Processing';
      case 'ready':
        return 'Ready';
      default:
        return 'Idle';
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <NavbarWrapper>
      <Container>
        <Flex justify="space-between" align="center">
          <Logo onClick={() => handleNavigation('/')}>
            <FaIcon name="waveform" size="lg" />
            MissVoice
          </Logo>
          
          <NavLinks>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                $active={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <Flex align="center" gap="0.5rem">
                  <FaIcon name={item.icon} />
                  {item.label}
                </Flex>
              </NavLink>
            ))}
          </NavLinks>
          
          <Flex align="center" gap="1rem">
            <StatusIndicator $status={processingStatus}>
              {getStatusIcon()}
              {getStatusText()}
            </StatusIndicator>
            
            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <FaIcon name={mobileMenuOpen ? 'times' : 'bars'} size="lg" />
            </MobileMenuButton>
          </Flex>
        </Flex>
        
        <MobileMenu $isOpen={mobileMenuOpen}>
          {navItems.map((item) => (
            <MobileNavLink
              key={item.path}
              $active={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <Flex align="center" gap="0.75rem">
                <FaIcon name={item.icon} />
                {item.label}
              </Flex>
            </MobileNavLink>
          ))}
        </MobileMenu>
      </Container>
    </NavbarWrapper>
  );
};

export default Navbar;