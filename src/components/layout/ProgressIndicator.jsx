import React from 'react';
import { Check } from 'lucide-react';
import { stepsList } from '../../data/sampleData';

const ProgressIndicator = ({ currentStep, onStepClick }) => {
  return (
    <div className="bg-white border-b border-border-subtle py-4 shadow-subtle">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop / Tablet Horizontal Stepper (Screens 2–8 in design reference) */}
        <div className="hidden sm:flex items-center justify-between relative max-w-4xl mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-border-light -z-0" />
          
          {/* Active Progress Connecting Line */}
          <div 
            className="absolute top-4 left-6 h-0.5 bg-primary-600 transition-all duration-500 ease-out -z-0"
            style={{
              width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%`,
              maxWidth: 'calc(100% - 48px)',
            }}
          />

          {stepsList.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => onStepClick && onStepClick(step.number)}
                className="flex flex-col items-center group relative z-10 focus:outline-none"
              >
                {/* Step Circle Indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-glow scale-110'
                      : isCompleted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-white text-body border-2 border-border-light group-hover:border-primary-300 group-hover:text-primary-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step Title Label */}
                <span
                  className={`text-xs mt-2 font-medium tracking-tight whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-600 font-bold'
                      : isCompleted
                      ? 'text-heading font-semibold'
                      : 'text-body group-hover:text-heading'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Stepper (Matching Mobile View in Screenshot) */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-heading">
              Step {currentStep} of {stepsList.length}
            </span>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {stepsList[currentStep - 1]?.title}
            </span>
          </div>

          {/* Connected number circles on mobile */}
          <div className="flex items-center justify-between gap-1 relative px-2">
            <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-border-light -z-0" />
            <div 
              className="absolute top-3.5 left-4 h-0.5 bg-primary-600 transition-all duration-300 -z-0"
              style={{
                width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%`,
                maxWidth: 'calc(100% - 32px)',
              }}
            />

            {stepsList.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => onStepClick && onStepClick(step.number)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold z-10 transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white ring-2 ring-primary-100 shadow-glow'
                      : isCompleted
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-body border border-border-light'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : step.number}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
