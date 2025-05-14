import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export function showSuccessToast(message: string, isHtmlStringEnabled = false) {
  toast.success(message, {
    hideProgressBar: true,
    transition: "slide",
    position: "bottom-right",
    dangerouslyHTMLString: isHtmlStringEnabled,
    autoClose: isHtmlStringEnabled ? false : 5000,
  });
}

export function showErrorToast(message: string, isHtmlStringEnabled = false) {
  toast.error(message, {
    hideProgressBar: true,
    transition: "slide",
    position: "bottom-right",
    dangerouslyHTMLString: isHtmlStringEnabled,
    autoClose: isHtmlStringEnabled ? false : 5000,
  });
}
