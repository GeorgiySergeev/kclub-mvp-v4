import React from 'react';

/**
 * Badge — small label / tag used for categories, industries, statuses.
 */
export function Badge({ label, variant = 'muted', style: extra = {} }) {
  const variants = {
    accent: {
      color: '#E8192C',
      background: 'transparent',
      border: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    muted: {
      color: '#888888',
      background: 'transparent',
      border: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    outline: {
      color: '#CCCCCC',
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.18)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      padding: '3px 8px',
    },
    solid: {
      color: '#FFFFFF',
      background: '#E8192C',
      border: 'none',
      textTransform: 'none',
      letterSpacing: '0.01em',
      padding: '3px 8px',
    },
  };

  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
      fontSize: '11px',
      fontWeight: 600,
      lineHeight: 1,
      ...variants[variant],
      ...extra,
    }}>
      {label}
    </span>
  );
}
