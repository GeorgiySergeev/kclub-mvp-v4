import React from 'react';

/**
 * Stat block — large red number with a small descriptor label below.
 * Used in the About section to showcase company scale.
 */
export function Stat({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        fontFamily: "'Barlow Condensed','Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontSize: '44px',
        fontWeight: 700,
        color: '#E8192C',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontSize: '12px',
        fontWeight: 400,
        color: '#888888',
        letterSpacing: '0.04em',
        lineHeight: 1.3,
      }}>
        {label}
      </div>
    </div>
  );
}
