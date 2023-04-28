import { useState, ReactElement } from "react";
import Modal from "../components/Modal";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

export default function useModal() {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => setIsShowing(prev => !prev);

  const close = () => isShowing && setIsShowing(false);

  const modal = (content: ReactElement | ReactElement[]) => {
    return (
      <Modal isShowing={isShowing} close={() => setIsShowing(false)}>
        {content}
      </Modal>
    );
  };

  const open = (content: ReactElement | ReactElement[]) => {
    setIsShowing(true);
    modal(content);
  };

  return {
    isShowing,
    setIsShowing,
    open,
    close,
    toggle,
    modal,
  };
}
