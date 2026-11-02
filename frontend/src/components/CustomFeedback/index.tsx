import { CheckCircle2, CircleX, Info, TriangleAlert, X } from "lucide-react";

import "./index.css";

export type FeedbackType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "cancelled";

interface FeedbackModalProps {
  open: boolean;
  type?: FeedbackType;
  title: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  showCancel?: boolean;

  onConfirm: () => void;
  onCancel?: () => void;
}

const iconByType = {
  success: CheckCircle2,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
  cancelled: CircleX,
};

export function CustomFeedback({
  open,
  type = "info",
  title,
  message,
  confirmText = "Ok",
  cancelText = "Cancelar",
  showCancel = false,
  onConfirm,
  onCancel,
}: FeedbackModalProps) {
  if (!open) {
    return null;
  }

  const Icon = iconByType[type];

  return (
    <div
      className="feedback-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="feedback-modal">
        <button
          type="button"
          className="feedback-modal__close"
          aria-label="Fechar"
          onClick={onCancel ?? onConfirm}
        >
          <X size={20} />
        </button>

        <div
          className={`
            feedback-modal__icon
            feedback-modal__icon--${type}
          `}
        >
          <Icon size={32} strokeWidth={2} />
        </div>

        <div className="feedback-modal__content">
          <h2 id="feedback-modal-title" className="feedback-modal__title">
            {title}
          </h2>

          <p className="feedback-modal__message">{message}</p>
        </div>

        <div className="feedback-modal__actions">
          {showCancel && (
            <button
              type="button"
              className="feedback-modal__button feedback-modal__button--secondary"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className={`
              feedback-modal__button
              feedback-modal__button--primary
              feedback-modal__button--${type}
            `}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
