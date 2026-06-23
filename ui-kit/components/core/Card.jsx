import React from 'react';

/**
 * ServiceCard — icon tile for the "areas of operation" grid.
 * CaseStudyCard — editorial card with category label, title, tag.
 * CTACard — full-width dark band with headline and button.
 */

export function ServiceCard({ icon, label, href = '#' }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        background: hovered ? '#383838' : '#2E2E2E',
        color: '#FFFFFF',
        textDecoration: 'none',
        transition: 'background 0.2s ease',
        aspectRatio: '1 / 1',
        minHeight: '120px',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: '22px', color: '#FFFFFF', lineHeight: 1 }}>
        {icon}
      </div>
      <div style={{
        fontSize: '13px',
        fontWeight: 600,
        color: '#CCCCCC',
        fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
        lineHeight: 1.3,
        letterSpacing: '0.01em',
      }}>
        {label}
      </div>
    </a>
  );
}

export function CaseStudyCard({ category, title, tag, href = '#' }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '0',
        color: '#FFFFFF',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        color: '#E8192C',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
      }}>
        {category}
      </div>
      <div style={{
        fontSize: '15px',
        fontWeight: 700,
        color: hovered ? '#FFFFFF' : '#E0E0DE',
        lineHeight: 1.4,
        fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
        transition: 'color 0.15s ease',
      }}>
        {title}
      </div>
      {tag && (
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#666',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
        }}>
          {tag}
        </div>
      )}
    </a>
  );
}

export function CTACard({ headline, buttonLabel = "Let's talk", href = '#' }) {
  return (
    <div style={{
      background: '#222222',
      padding: '64px 80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '40px',
    }}>
      <div style={{
        fontSize: '36px',
        fontWeight: 700,
        color: '#FFFFFF',
        fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
        lineHeight: 1.2,
        maxWidth: '480px',
      }}>
        {headline}
      </div>
      <a
        href={href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#E8192C',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 600,
          padding: '14px 24px',
          textDecoration: 'none',
          fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
          flexShrink: 0,
          letterSpacing: '0.01em',
          lineHeight: 1,
        }}
      >
        {buttonLabel} →
      </a>
    </div>
  );
}
