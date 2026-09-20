import { ReactNode, useEffect, useRef } from "react";
import Button from "@components/Button";
import { GoXCircle } from "react-icons/go";

type TToggleModal = (value?: boolean) => void;

type TModalContentProp = {
  children: ReactNode;
  toggleModal: TToggleModal;
  autoCloseSeconds?: number;
};

const useModalContent = (
  toggleModal: TToggleModal,
  autoCloseSeconds?: number
) => {
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoCloseSeconds) return;

    timeoutIdRef.current = window.setTimeout(() => {
      toggleModal(false);
    }, autoCloseSeconds);

    return () => {
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCloseSeconds]);
};

const ModalContent = ({
  children,
  toggleModal,
  autoCloseSeconds,
}: TModalContentProp) => {
  useModalContent(toggleModal, autoCloseSeconds);

  return (
    <div className="relative">
      <div className="absolute top-[-25px] right-[-25px] z-10">
        <Button Icon={GoXCircle} isRound onClick={() => toggleModal()} />
      </div>
      {children}
    </div>
  );
};

export default ModalContent;

