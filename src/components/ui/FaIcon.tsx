// src/components/ui/FaIcon.tsx
import React from 'react';
import styled from 'styled-components';

export type IconName = 
  | 'upload' | 'download' | 'play' | 'pause' | 'stop' | 'volume-up' | 'volume-mute'
  | 'microphone' | 'headphones' | 'waveform' | 'chart-line' | 'user' | 'users'
  | 'message' | 'paper-plane' | 'robot' | 'brain' | 'heart' | 'star' | 'check'
  | 'times' | 'spinner' | 'cog' | 'home' | 'file-audio' | 'cloud-upload'
  | 'magic' | 'comments' | 'user-friends' | 'phone' | 'briefcase'
  | 'smile' | 'meh' | 'frown' | 'arrow-right' | 'arrow-left' | 'chevron-down'
  | 'chevron-up' | 'chevron-right' | 'chevron-left' | 'bars' | 'close' | 'refresh'
  | 'search' | 'filter' | 'copy' | 'share' | 'info' | 'warning' | 'error'
  | 'success' | 'loading' | 'dots' | 'analytics' | 'settings';

const iconMapping: Record<IconName, string> = {
  // Media controls
  upload: 'fas fa-upload',
  download: 'fas fa-download',
  play: 'fas fa-play',
  pause: 'fas fa-pause',
  stop: 'fas fa-stop',
  'volume-up': 'fas fa-volume-up',
  'volume-mute': 'fas fa-volume-mute',
  
  // Audio & Communication
  microphone: 'fas fa-microphone',
  headphones: 'fas fa-headphones',
  waveform: 'fas fa-wave-square',
  phone: 'fas fa-phone',
  'file-audio': 'fas fa-file-audio',
  
  // User & Social
  user: 'fas fa-user',
  users: 'fas fa-users',
  'user-friends': 'fas fa-user-friends',
  message: 'fas fa-comment',
  comments: 'fas fa-comments',
  'paper-plane': 'fas fa-paper-plane',
  
  // AI & Technology
  robot: 'fas fa-robot',
  brain: 'fas fa-brain',
  magic: 'fas fa-magic',
  'cloud-upload': 'fas fa-cloud-upload-alt',
  
  // Charts & Analytics
  'chart-line': 'fas fa-chart-line',
  analytics: 'fas fa-chart-bar',
  
  // Emotions & Feedback
  heart: 'fas fa-heart',
  star: 'fas fa-star',
  smile: 'fas fa-smile',
  meh: 'fas fa-meh',
  frown: 'fas fa-frown',
  
  // Actions & States
  check: 'fas fa-check',
  times: 'fas fa-times',
  close: 'fas fa-times',
  refresh: 'fas fa-sync-alt',
  spinner: 'fas fa-spinner',
  loading: 'fas fa-circle-notch',
  
  // Navigation
  home: 'fas fa-home',
  'arrow-right': 'fas fa-arrow-right',
  'arrow-left': 'fas fa-arrow-left',
  'chevron-down': 'fas fa-chevron-down',
  'chevron-up': 'fas fa-chevron-up',
  'chevron-right': 'fas fa-chevron-right',
  'chevron-left': 'fas fa-chevron-left',
  
  // Interface
  bars: 'fas fa-bars',
  cog: 'fas fa-cog',
  settings: 'fas fa-cog',
  search: 'fas fa-search',
  filter: 'fas fa-filter',
  copy: 'fas fa-copy',
  share: 'fas fa-share-alt',
  dots: 'fas fa-ellipsis-h',
  
  // Status & Alerts
  info: 'fas fa-info-circle',
  warning: 'fas fa-exclamation-triangle',
  error: 'fas fa-exclamation-circle',
  success: 'fas fa-check-circle',
  
  // Business
  briefcase: 'fas fa-briefcase',
};

interface FaIconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x' | '3x';
  color?: string;
  spin?: boolean;
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
}

const IconWrapper = styled.i<{
  $color?: string;
  $clickable?: boolean;
  $spin?: boolean;
  $pulse?: boolean;
}>`
  color: ${({ $color, theme }) => $color || 'inherit'};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'inherit'};
  transition: all 0.2s ease;
  
  ${({ $clickable, theme }) => $clickable && `
    &:hover {
      color: ${theme.colors.primary};
      transform: scale(1.1);
    }
  `}
  
  ${({ $spin }) => $spin && `
    animation: spin 1s linear infinite;
  `}
  
  ${({ $pulse }) => $pulse && `
    animation: pulse 2s infinite;
  `}
`;

export const FaIcon: React.FC<FaIconProps> = ({
  name,
  size = 'md',
  color,
  spin = false,
  pulse = false,
  className = '',
  onClick,
}) => {
  const iconClass = iconMapping[name];
  
  if (!iconClass) {
    console.warn(`Icon "${name}" not found in iconMapping`);
    return null;
  }
  
  const sizeClass = size === 'md' ? '' : `fa-${size}`;
  const classes = [iconClass, sizeClass, className].filter(Boolean).join(' ');
  
  return (
    <IconWrapper
      className={classes}
      $color={color}
      $clickable={!!onClick}
      $spin={spin}
      $pulse={pulse}
      onClick={onClick}
    />
  );
};

export default FaIcon;