import { toast, Bounce } from "react-toastify";

const defaultConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Bounce,
};

export const notifySuccess = (message) => {
  toast.success(message, defaultConfig);
};

export const notifyError = (message) => {
  toast.error(message, defaultConfig);
};

export const notifyWarning = (message) => {
  toast.warning(message, defaultConfig);
};

export const notifyInfo = (message) => {
  toast.info(message, defaultConfig);
};