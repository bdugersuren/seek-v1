"use client";

import React, { forwardRef, useState } from "react";
import clsx from "clsx";
import { Input, InputProps } from "./Input";

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          className={clsx("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          tabIndex={-1}
          style={{
            position: "absolute",
            right: "var(--seek-space-3)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--seek-color-muted)",
            cursor: "pointer",
            fontSize: "var(--seek-font-size-xs)",
            userSelect: "none",
          }}
        >
          {show ? "Нуух" : "Харах"}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
