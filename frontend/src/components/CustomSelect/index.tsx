import { useId } from "react";
import type { ChangeEventHandler, ReactNode } from "react";

import { ChevronDown, CircleHelp, Lock } from "lucide-react";

import { getDominioOptions, type DominioKey } from "../../config/dominios";

import "./index.css";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface CustomSelectProps {
  id?: string;
  name: string;
  title?: string;

  // Fonte das opções
  dataOptions?: SelectOption[];
  dominio?: DominioKey;

  // Valor e eventos
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;

  // Configurações
  disabled?: boolean;
  required?: boolean;
  titleStrong?: boolean;
  noTitle?: boolean;
  placeholder?: string;
  helpText?: string;
  error?: ReactNode;
  errorId?: string;

  // Personalização
  className?: string;
  selectClassName?: string;

  // Testes
  "data-testid"?: boolean | string;
}

export default function CustomSelect({
  id,
  name,
  title,
  dataOptions,
  dominio,
  value = "",
  onChange,
  disabled = false,
  required = false,
  titleStrong = false,
  noTitle = false,
  placeholder = "Selecione...",
  helpText,
  error,
  errorId,
  className = "",
  selectClassName = "",
  "data-testid": dataTestId = true,
}: CustomSelectProps) {
  const generatedId = useId();

  const controlId = id ?? name;
  const helpId = `${generatedId}-help`;
  const messageId = errorId ?? `${generatedId}-error`;

  const hasError = Boolean(error);

  // Prioridade: dataOptions > dominio
  const options: SelectOption[] =
    dataOptions !== undefined
      ? dataOptions
      : dominio
        ? getDominioOptions(dominio)
        : [];

  const testId =
    typeof dataTestId === "string"
      ? dataTestId
      : dataTestId
        ? `select-${controlId}`
        : undefined;

  const describedBy =
    [hasError ? messageId : null, helpText ? helpId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const selectClasses = [
    "custom-select__control",
    disabled && "custom-select__control--disabled",
    hasError && "custom-select__control--error",
    selectClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`custom-select ${className}`}>
      {/* Cabeçalho */}
      {(!noTitle && title) || helpText ? (
        <div className="custom-select__header">
          {!noTitle && title && (
            <label
              htmlFor={controlId}
              className={[
                "custom-select__label",
                (required || titleStrong) && "custom-select__label--strong",
              ]
                .filter(Boolean)
                .join(" ")}
              data-testid={testId ? `${testId}-label` : undefined}
            >
              <span>{title}</span>

              {required && (
                <span className="custom-select__required" aria-hidden="true">
                  *
                </span>
              )}

              {disabled && (
                <Lock
                  size={12}
                  className="custom-select__lock"
                  aria-hidden="true"
                />
              )}
            </label>
          )}

          {/* Ajuda */}
          {helpText && (
            <div className="custom-select__help">
              <button
                type="button"
                className="custom-select__help-button"
                aria-label={`Ajuda sobre ${title ?? name}`}
                aria-describedby={helpId}
              >
                <CircleHelp size={15} />
              </button>

              <div
                id={helpId}
                role="tooltip"
                className="custom-select__tooltip"
              >
                {helpText}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Campo */}
      <div className="custom-select__wrapper">
        <select
          id={controlId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          data-testid={testId}
          className={selectClasses}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="custom-select__chevron"
          aria-hidden="true"
        />
      </div>

      {/* Mensagem de erro */}
      {hasError && (
        <div id={messageId} className="custom-select__error">
          {error}
        </div>
      )}
    </div>
  );
}
