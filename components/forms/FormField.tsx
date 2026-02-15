"use client";

import { InputHTMLAttributes, LabelHTMLAttributes } from "react";

const inputClasses =
  "w-full rounded-fc border border-fc-border bg-fc-surface py-2.5 px-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent/20 transition-colors duration-fc";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
}

export function FormField({
  label,
  id,
  error,
  required,
  children,
  ...labelProps
}: FormFieldProps & LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-fc-brand"
        {...labelProps}
      >
        {label}
        {required && <span className="text-fc-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-fc-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`${inputClasses} ${className}`}
      {...props}
    />
  );
}

export function FormTextarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${inputClasses} min-h-[80px] resize-y ${className}`}
      {...props}
    />
  );
}

export function FormSelect({
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`${inputClasses} ${className}`}
      {...props}
    />
  );
}
