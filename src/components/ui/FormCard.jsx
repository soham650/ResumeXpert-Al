import React from 'react';

const FormCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
  headerRight,
  action,
}) => {
  const rightElement = headerRight || action;

  return (
    <div className={`bg-white rounded-2xl border border-border-subtle shadow-card p-6 sm:p-8 ${className}`}>
      {(title || subtitle || rightElement) && (
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-start gap-3.5">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-xl font-bold text-heading tracking-tight">{title}</h2>
              )}
              {subtitle && (
                <p className="text-sm text-body mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {rightElement && (
            <div className="flex-shrink-0">
              {rightElement}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default FormCard;
