// src/components/ui/StyledComponents.tsx
import styled, { css } from 'styled-components';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const buttonVariants = {
  primary: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.border};
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    border: none;
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.text.primary};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.error};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-1px);
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    font-weight: 500;
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: 1rem;
    font-weight: 600;
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    font-size: 1.125rem;
    font-weight: 600;
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  ${({ size = 'md' }) => buttonSizes[size]}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ loading }) => loading && css`
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `}
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

// Card component
interface CardProps {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'sm' | 'md' | 'lg';
}

const cardVariants = {
  default: css`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
  elevated: css`
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border: none;
  `,
  bordered: css`
    background: transparent;
    border: 2px solid ${({ theme }) => theme.colors.border};
  `,
};

const cardPadding = {
  sm: css`padding: ${({ theme }) => theme.spacing.md};`,
  md: css`padding: ${({ theme }) => theme.spacing.lg};`,
  lg: css`padding: ${({ theme }) => theme.spacing.xl};`,
};

export const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  
  ${({ variant = 'default' }) => cardVariants[variant]}
  ${({ padding = 'md' }) => cardPadding[padding]}
`;

// Input components
export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.primary};
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Container components
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

// Typography
export const Heading1 = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const Heading2 = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`;

export const Heading3 = styled.h3`
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.5rem;
  }
`;

export const Text = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &.large {
    font-size: 1.125rem;
  }
  
  &.small {
    font-size: 0.875rem;
  }
  
  &.accent {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`;

// Layout helpers
export const Flex = styled.div<{
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'stretch' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  gap: ${({ gap = '0' }) => gap};
  flex-wrap: ${({ wrap }) => wrap ? 'wrap' : 'nowrap'};
`;

export const Grid = styled.div<{
  columns?: number;
  gap?: string;
  minWidth?: string;
}>`
  display: grid;
  grid-template-columns: repeat(${({ columns = 1 }) => columns}, 1fr);
  gap: ${({ gap = '1rem' }) => gap};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
  
  ${({ minWidth }) => minWidth && css`
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
  `}
`;

// Progress components
export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    border-radius: inherit;
    transition: width 0.3s ease;
  }
`;

// Badge component
export const Badge = styled.span<{ variant?: 'default' | 'success' | 'error' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${({ variant = 'default', theme }) => {
    switch (variant) {
      case 'success':
        return css`
          background: rgba(16, 185, 129, 0.1);
          color: ${theme.colors.success};
          border: 1px solid rgba(16, 185, 129, 0.2);
        `;
      case 'error':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: ${theme.colors.error};
          border: 1px solid rgba(239, 68, 68, 0.2);
        `;
      case 'warning':
        return css`
          background: rgba(245, 158, 11, 0.1);
          color: ${theme.colors.warning};
          border: 1px solid rgba(245, 158, 11, 0.2);
        `;
      default:
        return css`
          background: rgba(99, 102, 241, 0.1);
          color: ${theme.colors.primary};
          border: 1px solid rgba(99, 102, 241, 0.2);
        `;
    }
  }}
`;

// Loading spinner
export const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ size = 'md' }) => size === 'sm' ? '16px' : size === 'lg' ? '32px' : '24px'};
  height: ${({ size = 'md' }) => size === 'sm' ? '16px' : size === 'lg' ? '32px' : '24px'};
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

// Divider
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;