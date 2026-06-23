import React from 'react';

/**
 * Text input and Checkbox for forms on light backgrounds.
 */
export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  style: extra = {},
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...extra }}>
      {label && (
        <label style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#888888',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
          fontSize: '15px',
          fontWeight: 400,
          color: '#1A1A1A',
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.18)',
          borderRadius: 0,
          padding: '11px 14px',
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
          letterSpacing: '0.01em',
        }}
        onFocus={e => { e.target.style.borderColor = '#E8192C'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.18)'; }}
      />
    </div>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      fontFamily: "'Barlow','Helvetica Neue',Helvetica,Arial,sans-serif",
      fontSize: '13px',
      color: '#666666',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: '16px',
          height: '16px',
          accentColor: '#E8192C',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      {label}
    </label>
  );
}
