"use client";

import React, { forwardRef } from "react";
import { Input, InputProps } from "./Input";

export interface DatePickerProps extends Omit<InputProps, "type"> {
  // Future extension properties can be declared here
  minDate?: string;
  maxDate?: string;
}

/**
 * DatePicker Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - Keyboard navigation for calendar dates
 * - ARIA live regions for date changes
 * - Focus traps inside popover calendar grid
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, minDate, maxDate, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        min={minDate}
        max={maxDate}
        className={className}
        placeholder="Огноо сонгох..."
        {...props}
      />
    );
  },
);

DatePicker.displayName = "DatePicker";
