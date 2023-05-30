import { useRef } from "react";
import { toast } from "react-toastify";
import { toastSuccess, toastError } from "../../utils/defaultToasts.js";

//This custom react hook can be used to create toast notifications.

//Example usage:

/*
import useToast from "../hooks/useToast";
const { notifyToast } = useToast();
notifyToast("Something happened.");
*/

export function useToast() {
    const toastId = useRef(null);
    const notifyToast = (text, error) => {
        if (!error) {
            toastId.current = toastSuccess(text);
        } else {
            toastId.current = toastError(text);
        }
    };
    const dismissToast = () => toast.dismiss(toastId.current);

    return { notifyToast, dismissToast };
}
