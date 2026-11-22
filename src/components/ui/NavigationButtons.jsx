import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const NavigationButtons = ({ 
  onPrevious, 
  onNext, 
  previousLabel, 
  nextLabel, 
  showPrevious = true, 
  isLastStep = false,
  isFirstStep = false,
}) => {
  const prevText = previousLabel || (isFirstStep ? 'Cancel' : 'Back');
  const nextText = nextLabel || (isLastStep ? 'Complete Resume' : 'Continue');

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-subtle">
      {showPrevious ? (
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-heading bg-white border border-border-light hover:bg-surface-50 hover:border-primary-300 transition-all duration-200 active:scale-[0.98]"
        >
          {!isFirstStep && <ArrowLeft className="w-4 h-4 text-body" />}
          <span>{prevText}</span>
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-glow active:scale-[0.98]"
      >
        <span>{nextText}</span>
        {isLastStep ? (
          <Check className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default NavigationButtons;
