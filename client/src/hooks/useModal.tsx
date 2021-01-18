import * as React from "react";
import { useState } from "react";

interface ModalContent {
  content: JSX.Element | boolean;
  title: string;
}

export default () => {
  let [modal, setModal] = useState(false);
  let [modalContent, setModalContent] = useState<ModalContent>({
    content: <></>,
    title: "",
  });

  let handleModal = (content: JSX.Element | boolean = false, title: string) => {
    setModal(!modal);
    if (content) {
      setModalContent({ content, title });
    }
  };
  return { modal, handleModal, modalContent };
};
