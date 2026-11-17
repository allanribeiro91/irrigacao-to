import Swal, { type SweetAlertIcon } from "sweetalert2";

import "sweetalert2/dist/sweetalert2.min.css";
import "./index.css";

type SwalType = SweetAlertIcon;

interface BaseOptions {
  title?: string;
  text?: string;
  icon?: SwalType;
  confirmButtonText?: string;
  confirmButtonColor?: string;
}

interface AlertOptions extends BaseOptions {
  timer?: number;
  showProgressBar?: boolean;
}

interface ConfirmOptions extends BaseOptions {
  cancelButtonText?: string;
  cancelButtonColor?: string;
  reverseButtons?: boolean;
}

interface ToastOptions {
  title: string;
  text?: string;
  icon?: SwalType;
  timer?: number;
  position?: "top" | "top-end" | "bottom" | "bottom-end";
  showProgressBar?: boolean;
}

const COLORS = {
  primary: "#0f33d5",
  secondary: "#64748b",
};

const customClass = {
  popup: "custom-swal__popup",
  title: "custom-swal__title",
  htmlContainer: "custom-swal__content",
  actions: "custom-swal__actions",
  confirmButton: "custom-swal__confirm",
  cancelButton: "custom-swal__cancel",
  timerProgressBar: "custom-swal__progress",
};

const CustomSwal = {
  /**
   * Exibe mensagem informativa, de sucesso,
   * atenção ou erro.
   */
  async alert({
    title = "Atenção",
    text = "",
    icon = "info",
    confirmButtonText = "OK",
    confirmButtonColor = COLORS.primary,
    timer,
    showProgressBar = false,
  }: AlertOptions = {}): Promise<void> {
    await Swal.fire({
      title,
      text,
      icon,
      confirmButtonText,
      timer,
      timerProgressBar: showProgressBar,
      showConfirmButton: true,
      buttonsStyling: false,
      customClass,
      background: "#ffffff",
      color: "#243047",
      didOpen: (popup) => {
        popup.style.setProperty(
          "--custom-swal-confirm-color",
          confirmButtonColor,
        );
      },
    });
  },

  /**
   * Exibe confirmação e retorna true somente
   * quando o usuário confirma.
   */
  async confirm({
    title = "Confirmação",
    text = "Tem certeza que deseja continuar?",
    icon = "question",
    confirmButtonText = "Sim",
    cancelButtonText = "Cancelar",
    confirmButtonColor = COLORS.primary,
    cancelButtonColor = COLORS.secondary,
    reverseButtons = true,
  }: ConfirmOptions = {}): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons,
      focusCancel: true,
      buttonsStyling: false,
      customClass,
      background: "#ffffff",
      color: "#243047",
      didOpen: (popup) => {
        popup.style.setProperty(
          "--custom-swal-confirm-color",
          confirmButtonColor,
        );
        popup.style.setProperty(
          "--custom-swal-cancel-color",
          cancelButtonColor,
        );
      },
    });

    return result.isConfirmed;
  },

  /**
   * Exibe notificação rápida sem bloquear
   * a interação com a página.
   */
  async toast({
    title,
    text,
    icon = "success",
    timer = 3000,
    position = "top-end",
    showProgressBar = true,
  }: ToastOptions): Promise<void> {
    await Swal.fire({
      toast: true,
      position,
      icon,
      title,
      text,
      timer,
      timerProgressBar: showProgressBar,
      showConfirmButton: false,
      customClass: {
        popup: "custom-swal__toast",
        title: "custom-swal__toast-title",
        timerProgressBar: "custom-swal__progress",
      },
      background: "#ffffff",
      color: "#243047",
    });
  },
};

export default CustomSwal;
