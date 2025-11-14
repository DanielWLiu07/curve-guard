import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`relative flex w-full touch-none select-none items-center ${className}`}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-700">
      <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-slate-600 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export const SettingsSlider = ({ label, value, onChange, min, max, step, displayValue, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-white text-xs font-medium">
      {label}
    </label>
    <Slider
      value={[value]}
      onValueChange={([newValue]) => onChange(newValue)}
      max={max}
      min={min}
      step={step}
      className="w-full"
    />
    <div className="text-center text-slate-400 text-xs">
      {displayValue}
    </div>
  </div>
);