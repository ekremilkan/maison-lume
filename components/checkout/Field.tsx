"use client";

import { useLocale } from "@/context/LocaleContext";

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  className?: string;
}

export function Field({ name, label, value, onChange, error, optional, className = "", ...input }: FieldProps) {
  const { t } = useLocale();
  const id = `field-${name}`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px]">
        {label}
        {optional && <span className="ml-1 text-taupe">({t.common.optional})</span>}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        required={!optional}
        className="field"
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}
