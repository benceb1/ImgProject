import * as React from "react";
import { createContext } from "react";
import useModal from "#root/hooks/useModal";
import Modal from "#root/components/Modal";

let ModalContext = createContext<any>({});

let ModalProvider = ({ children }: { children: any }) => {
  let { modal, handleModal, modalContent } = useModal();
  return (
    <ModalContext.Provider value={{ modal, handleModal, modalContent }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
