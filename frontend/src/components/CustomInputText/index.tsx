import React from "react";
import { Lock } from "lucide-react";

import "./index.css";

export interface CustomInputTextProps {
  id?: string;
  name: string;
  title?: string;
  value?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  required?: boolean;
  textAlign?: "left" | "center" | "right";
  type?: "text" | "textArea" | "url";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  error?: React.ReactNode;
  errorId?: string;
  hint?: string;
  "data-testid"?: boolean | string;
  titleStrong?: boolean;
  noTitle?: boolean;
  capitalStyle?: boolean;
  dash?: boolean;
  textBold?: boolean;
}

const CustomInputText: React.FC<CustomInputTextProps> = ({
  id,
  name,
  title,
  value = "",
  readOnly = false,
  disabled = false,
  onChange,
  required = false,
  textAlign = "left",
  type = "text",
  placeholder,
  rows = 3,
  maxLength,
  autoComplete,
  className = "",
  inputClassName = "",
  error,
  errorId,
  hint,
  "data-testid": dataTestId = true,
  titleStrong = false,
  noTitle = false,
  capitalStyle = false,
  dash = false,
  textBold = false,
}) => {
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
        ? `${type === "textArea" ? "input-textarea" : "input-text"}-${controlId}`
        : undefined;

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    onChange?.(event);
  };

  const classes = [
    "custom-input-text__control",
    `custom-input-text__control--${textAlign}`,
    readOnly && "custom-input-text__control--readonly",
    disabled && "custom-input-text__control--disabled",
    capitalStyle && "custom-input-text__control--capital",
    dash && "custom-input-text__control--dash",
    textBold && "custom-input-text__control--bold",
    hasError && "custom-input-text__control--error",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const commonProps = {
    id: controlId,
    name,
    value: value ?? "",
    onChange: handleChange,
    readOnly,
    disabled,
    required,
    maxLength,
    placeholder,
    autoComplete,
    "aria-invalid": hasError || undefined,
    "aria-describedby": describedBy,
    "data-testid": testId,
    className: classes,
  };

  return (
    <div className={`custom-input-text ${className}`}>
      {!noTitle && title && (
        <label
          htmlFor={controlId}
          className={[
            "custom-input-text__label",
            (required || titleStrong) && "custom-input-text__label--strong",
          ]
            .filter(Boolean)
            .join(" ")}
          data-testid={testId ? `${testId}-label` : undefined}
        >
          <span>{title}</span>

          {required && (
            <span className="custom-input-text__required" aria-hidden="true">
              *
            </span>
          )}

          {readOnly && (
            <Lock
              size={12}
              className="custom-input-text__lock"
              aria-label="Somente leitura"
            />
          )}
        </label>
      )}

      {type === "textArea" ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input {...commonProps} type={type} />
      )}

      {hint && (
        <small id={hintId} className="custom-input-text__hint">
          {hint}
        </small>
      )}

      {hasError && (
        <div id={messageId} className="custom-input-text__error">
          {error}
        </div>
      )}
    </div>
  );
};

export default CustomInputText;
