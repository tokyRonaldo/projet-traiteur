'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex justify-between mb-10 px-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-col items-center flex-1">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold transition-all
              ${
                step.number < currentStep
                  ? 'bg-primary text-white'
                  : step.number === currentStep
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-neutral-200 dark:bg-slate-700 text-neutral-text'
              }`}
          >
            {step.number}
          </div>
          <p className="text-xs font-medium mt-3 text-center text-neutral-text">
            {step.title}
          </p>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-full mt-4 transition-colors ${
                step.number < currentStep ? 'bg-primary' : 'bg-neutral-200 dark:bg-slate-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}