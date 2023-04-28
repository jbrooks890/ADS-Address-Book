import { ReactElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/Modal.scss";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

type ModalPropsType = {
  isShowing: boolean;
  children: ReactElement | ReactElement[];
  close: Function;
};

export default function Modal({ isShowing, children, close }: ModalPropsType) {
  const [active, setActive] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    isShowing && setActive(true);
  }, []);

  return isShowing
    ? createPortal(
        <>
          <div className={`modal__overlay ${screen ? "screen" : "clear"}`} />
          <div
            className={`modal__wrapper flex col center ${
              active ? "active" : "inactive"
            }`}
            ref={wrapper}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
            // onClick={() => close()}
          >
            <div className={`modal flex col center`}>
              <button
                className="modal__close flex center"
                onClick={() => close()}
              >
                &times;
              </button>
              {children}
            </div>
          </div>
        </>,
        document.body
      )
    : null;
}
