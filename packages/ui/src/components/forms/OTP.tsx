"use client";

import React, { forwardRef } from "react";
import { Input, InputProps } from "./Input";

export interface OTPProps extends Omit<InputProps, "type"> {
  length?: number;
}

/**
 * OTP Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - Direct arrow key navigation between inputs
 * - Automatic focus movement on input
 * - Clipboard paste support with split behavior
 */
export const OTP = forwardRef<HTMLInputElement, OTPProps>(
  ({ className, length = 6, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        maxLength={length}
        pattern="[0-9]*"
        inputMode="numeric"
        autoComplete="one-time-code"
        className={className}
        placeholder="Нэг удаагийн код..."
        {...props}
      />
    );
  },
);

OTP.displayName = "OTP";
