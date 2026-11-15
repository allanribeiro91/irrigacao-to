import type { ChangeEventHandler, ReactNode } from "react";

import { CalendarDays, Lock } from "lucide-react";

import "./index.css";

export interface CustomInputDateProps {
  id?: string;
  name: string;
  title?: string;

  // Valor e evento
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;

  // Tipo de data
  type?: "date" | "datetime-local";

  // Configurações
  min?: string;
  max?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;

  // Apresentação
  titleStrong?: boolean;
  noTitle?: boolean;
  placeholder?: string;
  hint?: string;
  error?: ReactNode;
  errorId?: string;

  // Personalização
  className?: string;
  inputClassName?: string;

  // Testes
  "data-testid"?: boolean | string;
}

export default function CustomInputDate({
  id,
  name,
  title,
  value = "",
  onChange,
  type = "date",
  min,
  max,
  readOnly = false,
  disabled = false,
  required = false,
  titleStrong = false,
  noTitle = false,
  hint,
  error,
  errorId,
  className = "",
  inputClassName = "",
  "data-testid": dataTestId = true,
}: CustomInputDateProps) {
  const controlId = id ?? name;

  const hasError = Boolean(error);

  const messageId = errorId ?? `${controlId}-error`;
  const hintId = `${controlId}-hint`;

  const describedBy =
    [hasError ? messageId : null, hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const testId =
    typeof dataTestId === "string"
      ? dataTestId
      : dataTestId
        ? `input-date-${controlId}`
        : undefined;

  const controlClasses = [
    "custom-input-date__control",
    readOnly && "custom-input-date__control--readonly",
    disabled && "custom-input-date__control--disabled",
    hasError && "custom-input-date__control--error",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`custom-input-date ${className}`}>
      {!noTitle && title && (
        <label
          htmlFor={controlId}
          className={[
            "custom-input-date__label",
            (required || titleStrong) && "custom-input-date__label--strong",
          ]
            .filter(Boolean)
            .join(" ")}
          data-testid={testId ? `${testId}-label` : undefined}
        >
          <span>{title}</span>

          {required && (
            <span className="custom-input-date__required" aria-hidden="true">
              *
            </span>
          )}

          {readOnly && (
            <Lock
              size={12}
              className="custom-input-date__lock"
              aria-label="Somente leitura"
            />
          )}
        </label>
      )}

      <div className="custom-input-date__wrapper">
        <input
          id={controlId}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          data-testid={testId}
          className={controlClasses}
        />

        <CalendarDays
          size={16}
          className="custom-input-date__icon"
          aria-hidden="true"
        />
      </div>

      {hint && (
        <small id={hintId} className="custom-input-date__hint">
          {hint}
        </small>
      )}

      {hasError && (
        <div id={messageId} className="custom-input-date__error">
          {error}
        </div>
      )}
    </div>
  );
}
