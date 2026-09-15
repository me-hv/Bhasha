'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  headline: string;
  subline?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  headline,
  subline,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`py-16 px-4 text-center select-none ${className}`}>
      {Icon && (
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-obsidian-900 border border-obsidian-700 flex items-center justify-center text-obsidian-500">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-mono font-semibold text-obsidian-300 tracking-tight">
        {headline}
      </h3>
      {subline && (
        <p className="text-xs sm:text-sm text-obsidian-500 font-sans mt-1.5 max-w-sm mx-auto leading-relaxed">
          {subline}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <button
            onClick={onAction}
            className="px-4 py-2 rounded bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 hover:border-obsidian-600 text-xs font-mono font-medium text-obsidian-200 hover:text-white transition-fast"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
