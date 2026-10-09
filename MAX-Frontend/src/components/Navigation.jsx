import React from 'react';
import { Home, Shield, Bell, Mic, Settings, User } from 'lucide-react';
import ActionIcon from './ActionIcon';

/**
 * Navigation: Minimal futuristic navigation bar.
 * Responsive: Sleek bottom cyber dock for mobile & desktop with tooltip labels.
 */
export default function Navigation({
  currentView = 'home',
  onNavigate,
  taskCount = 3,
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'tasks', label: 'Task Reminder', icon: Bell, badge: taskCount },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Operator Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl glass-panel border border-cyan-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex items-center gap-2 sm:gap-3"
    >
      {/* Ambient background glow line */}
      <div className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

      {navItems.map((item) => (
        <ActionIcon
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={currentView === item.id}
          onClick={() => onNavigate(item.id)}
          badge={item.badge}
          tooltipPosition="top"
        />
      ))}
    </nav>
  );
}
