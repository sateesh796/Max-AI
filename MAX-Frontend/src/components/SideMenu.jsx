import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, ClipboardList, Settings, ChevronRight } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function SideMenu({ onSelect, taskCount = 3 }) {
  const menuItems = [
    {
      id: 'chat',
      title: 'Chat',
      subtitle: 'Ask anything',
      icon: MessageSquare,
      badge: null,
    },
    {
      id: 'search',
      title: 'Search',
      subtitle: 'Find information',
      icon: Search,
      badge: null,
    },
    {
      id: 'tasks',
      title: 'Tasks',
      subtitle: 'Get things done',
      icon: ClipboardList,
      badge: taskCount,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Customize your AI',
      icon: Settings,
      badge: null,
    },
  ];

  const handleClick = (id) => {
    playSound('click');
    onSelect(id);
  };

  return (
    <aside className="flex flex-col gap-3 sm:gap-3.5 w-full max-w-[260px] sm:max-w-[280px] z-20">
      {menuItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * idx }}
            whileHover={{ scale: 1.03, x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleClick(item.id)}
            className="group relative w-full px-4 py-3 sm:py-3.5 rounded-2xl glass-panel-interactive border border-cyan-400/35 hover:border-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:shadow-[0_0_30px_rgba(0,243,255,0.35)] flex items-center justify-between transition-all duration-300 overflow-hidden text-left side-card"
          >
            {/* Top specular highlight edge */}
            <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

            {/* Left Content */}
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Circular Icon Container */}
              <div className="side-icon-box relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 group-hover:border-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,243,255,0.3)]">
                <Icon className="side-icon w-5 h-5 text-cyan-300 group-hover:text-white transition-colors" />
                {item.badge !== null && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950 flex items-center justify-center shadow-[0_0_8px_#00f3ff]">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0">
                <span className="side-title font-cyber font-bold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors tracking-wide">
                  {item.title}
                </span>
                <span className="side-subtitle font-tech text-xs text-cyan-200/80 group-hover:text-cyan-100 transition-colors truncate">
                  {item.subtitle}
                </span>
              </div>
            </div>

            {/* Right Chevron */}
            <ChevronRight className="side-icon w-5 h-5 text-cyan-400/70 group-hover:text-cyan-200 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </motion.button>
        );
      })}
    </aside>
  );
}
