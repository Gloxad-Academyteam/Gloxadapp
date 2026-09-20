import { createPortal } from "react-dom";
import { useEffect, ReactNode } from "react";

type TModal = {
  children: ReactNode;
};

const Modal = ({ children }: TModal) => {
  const modalRoot = document.getElementById("modal") || document.body;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative z-10 my-auto flex items-center justify-center w-full">
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;