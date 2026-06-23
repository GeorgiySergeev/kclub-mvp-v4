import React from 'react';

/**
 * Primary CTA button. Three variants: primary (red fill),
 * secondary (dark outline), ghost (white outline for dark bgs).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  arrow = true,
  disabled = false,
  children,
  onClick,
  href,
  style: extraStyle = {},
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
    fontWeight: 600,
    letterSpacing: '0.01em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    textDecoration: 'none',
    borderRadius: 0,
    transition: 'background 0.12s ease, color 0.12s ease, opacity 0.12s ease',
    opacity: disabled ? 0.38 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    userSelect: 'none',
  };

  const sizes = {
    sm: { fontSize: '13px', padding: '9px 16px' },
    md: { fontSize: '14px', padding: '12px 20px' },
    lg: { fontSize: '15px', padding: '15px 26px' },
  };

  const variants = {
    primary: {
      background: '#E8192C',
      color: '#FFFFFF',
    },
    secondary: {
      background: 'transparent',
      color: '#1A1A1A',
      outline: '1px solid rgba(0,0,0,0.28)',
    },
    ghost: {
      background: 'transparent',
      color: '#FFFFFF',
      outline: '1px solid rgba(255,255,255,0.30)',
    },
    link: {
      background: 'transparent',
      color: '#E8192C',
      padding: '0',
      gap: '6px',
    },
  };

  const combinedStyle = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...extraStyle,
  };

  const arrowEl = arrow ? (
    <span style={{ fontSize: variant === 'link' ? '13px' : '14px', lineHeight: 1 }}>
      →
    </span>
  ) : null;

  if (href) {
    return (
      <a href={href} style={combinedStyle}>
        {children}{arrowEl}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} style={combinedStyle}>
      {children}{arrowEl}
    </button>
  );
}
