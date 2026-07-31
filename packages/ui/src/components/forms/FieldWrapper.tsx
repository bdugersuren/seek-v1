import React from "react";
import clsx from "clsx";
import { Label } from "../typography/Label";
import { Caption } from "../typography/Caption";

interface FieldWrapperProps {
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  id,
  label,
  required,
  error,
  helperText,
  className,
  children,
}: FieldWrapperProps) {
  const descId = helperText ? `${id}-desc` : undefined;
  const errId = error ? `${id}-error` : undefined;

  return (
    <div className={clsx("flex flex-col gap-seek-1.5 w-full", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      {/* Target input/textarea/select element child should have id/describedby set */}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            id,
            "aria-invalid": !!error,
            "aria-describedby": clsx(descId, errId) || undefined,
          })
        : children}

      {error && (
        <Caption id={errId} error>
          {error}
        </Caption>
      )}
      {!error && helperText && <Caption id={descId}>{helperText}</Caption>}
    </div>
  );
}
