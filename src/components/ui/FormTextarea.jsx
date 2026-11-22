import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const FormTextarea = forwardRef(({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  maxLength,
  rows = 5,
  helper,
  error,
  required,
  className = '',
  ...rest
}, ref) => {
  const textareaId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const errorId = textareaId ? `${textareaId}-error` : undefined;
  const helperId = textareaId ? `${textareaId}-helper` : undefined;

  const charCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.85;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-semibold text-heading mb-1.5"
        >
          {label}
          {required && <span className="text-primary-600 ml-1 font-bold" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={Boolean(error || isOverLimit)}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        aria-required={required}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-heading placeholder:text-[#A09EB0] 
          transition-all duration-200 resize-none leading-relaxed
          focus:outline-none focus:ring-2 
          ${
            error || isOverLimit
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-border-light hover:border-primary-300 focus:ring-primary-500/20 focus:border-primary-600'
          }`}
        {...rest}
      />

      <div className="flex items-center justify-between mt-1.5 gap-2">
        {error ? (
          <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        ) : helper ? (
          <p id={helperId} className="text-xs text-body">{helper}</p>
        ) : (
          <div />
        )}

        {maxLength && (
          <p
            className={`text-xs font-semibold ml-auto whitespace-nowrap ${
              isOverLimit
                ? 'text-rose-500'
                : isNearLimit
                ? 'text-amber-500'
                : 'text-body'
            }`}
          >
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
