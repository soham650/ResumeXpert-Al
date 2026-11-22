import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUp, 
  ArrowDown, 
  Trash2 
} from 'lucide-react';

const RepeatableItemCard = ({
  icon: Icon,
  badge,
  title,
  subtitle,
  children,
  isExpanded = true,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  onRemove,
  showReorder = true,
  showDelete = true,
  className = '',
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
    if (onRemove) onRemove();
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div className={`bg-white rounded-2xl border border-border-subtle shadow-card overflow-hidden transition-all duration-200 ${className}`}>
      {/* Header Bar */}
      <div 
        onClick={onToggleExpand}
        className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-surface-50/60 hover:bg-surface-50 border-b border-border-light cursor-pointer select-none transition-colors"
      >
        {/* Left: Icon, Badge, Title & Subtitle */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {badge && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase bg-primary-100/80 text-primary-700 shrink-0">
                  {badge}
                </span>
              )}
              <h3 className="text-sm sm:text-base font-bold text-heading truncate">
                {title || 'Untitled Entry'}
              </h3>
            </div>
            {subtitle && (
              <p className="text-xs text-body truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions (Reorder Up/Down, Delete confirmation, Expand/Collapse) */}
        <div 
          className="flex items-center gap-1 shrink-0" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Move Up */}
          {showReorder && onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              aria-label="Move entry up"
              title="Move entry up"
              className="p-1.5 rounded-lg text-body hover:text-heading hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}

          {/* Move Down */}
          {showReorder && onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              aria-label="Move entry down"
              title="Move entry down"
              className="p-1.5 rounded-lg text-body hover:text-heading hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}

          {/* Delete / Inline Confirm Deletion */}
          {showDelete && onRemove && (
            <>
              {showConfirm ? (
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl animate-fade-in">
                  <span className="text-[11px] font-medium text-rose-700 hidden sm:inline">Delete?</span>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-2 py-0.5 rounded-md text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium text-body hover:bg-surface-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  aria-label="Delete entry"
                  title="Delete entry"
                  className="p-1.5 rounded-lg text-body hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Toggle Expand/Collapse */}
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={isExpanded ? 'Collapse entry' : 'Expand entry'}
              title={isExpanded ? 'Collapse' : 'Expand'}
              className="p-1.5 rounded-lg text-body hover:text-heading hover:bg-surface-100 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      {isExpanded && (
        <div className="p-6 sm:p-7">
          {children}
        </div>
      )}
    </div>
  );
};

export default RepeatableItemCard;

