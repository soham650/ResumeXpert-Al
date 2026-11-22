import React from 'react';
import { Check } from 'lucide-react';
import { stepsList } from '../../data/sampleData';

const StepNavigation = ({ currentStep, onStepClick }) => {
  return (
    <div className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-20">
        <div className="bg-white rounded-2xl border border-primary-100/50 shadow-card p-4">
          <h3 className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-4 px-2">
            Build Steps
          </h3>
          <nav className="space-y-1">
            {stepsList.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => onStepClick(step.number)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 border border-primary-200'
                      : isCompleted
                      ? 'hover:bg-primary-50/50'
                      : 'hover:bg-surface-100'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-glow'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-surface-200 text-body group-hover:bg-primary-100 group-hover:text-primary-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isActive ? 'text-primary-700' : isCompleted ? 'text-heading' : 'text-body'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
