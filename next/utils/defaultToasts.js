import { toast } from "react-toastify";

const defaultPosition = "bottom-center";
const defaultTheme = "light";

export function toastSuccess(text) {
    toast.success(text, {
        position: defaultPosition,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: defaultTheme
    });
}

export function toastError(text) {
    toast.error(text, {
        position: defaultPosition,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: defaultTheme
    });
}
