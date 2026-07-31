"use client";

import React, { forwardRef } from "react";
import { Input, InputProps } from "./Input";

export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type="search"
          placeholder="Хайх..."
          className={className}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
