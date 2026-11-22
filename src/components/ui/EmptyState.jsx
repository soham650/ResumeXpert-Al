import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-10 text-center ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-primary-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-heading mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-body max-w-xs mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
