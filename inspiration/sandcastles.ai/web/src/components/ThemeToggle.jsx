import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="theme-toggle" style={{
      display: 'flex',
      gap: '2px',
      background: 'var(--surface-color)',
      padding: '2px',
      borderRadius: '99px',
      border: '1px solid var(--border-color)',
    }}>
      {themes.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '99px',
            background: theme === id ? 'var(--primary-color)' : 'transparent',
            color: theme === id ? 'var(--bg-color)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
          title={`${id.charAt(0).toUpperCase() + id.slice(1)} Mode`}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
