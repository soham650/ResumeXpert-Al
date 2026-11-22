import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const FormInput = forwardRef(({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  icon: Icon,
  helper,
  error,
  required,
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;
  const helperId = inputId ? `${inputId}-helper` : undefined;

  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold text-heading mb-1.5"
        >
          {label}
          {required && <span className="text-primary-600 ml-1 font-bold" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A09EB0] pointer-events-none" />
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helper ? helperId : undefined}
          aria-required={required}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-heading placeholder:text-[#A09EB0] 
            transition-all duration-200 
            focus:outline-none focus:ring-2 
            disabled:bg-surface-100 disabled:text-body/60 disabled:border-border-subtle disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-border-light hover:border-primary-300 focus:ring-primary-500/20 focus:border-primary-600'
            }`}
          {...rest}
        />
      </div>

      {/* Accessible Error Message */}
      {error && (
        <p 
          id={errorId} 
          role="alert" 
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 mt-1.5 animate-fade-in"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Helper text when no error */}
      {!error && helper && (
        <p id={helperId} className="text-xs text-body mt-1.5">
          {helper}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
