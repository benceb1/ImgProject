import * as React from "react";
import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

import { ModalContext } from "#root/context/modalContext";

interface ModalProps {}

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalWrapper = styled.div`
  margin: 0 1rem 0 1rem;
  box-shadow: 0, 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  position: relative;
  overflow-x: hidden;
  min-width: 200px;
  max-height: 700px;
  z-index: 100;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-height: none;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1rem 0 1rem;
  border-bottom: 1px solid #dadce0;
  h2 {
    margin: 18px 0 18px 0;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 1rem 0 1rem;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    height: calc(100vh - 60px);
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

const Modal: React.FC<ModalProps> = ({}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  let { modalContent, handleModal, modal } = useContext(ModalContext);
  const modalRef = useRef<any>();
  const closeModal = (e: any) => {
    if (modalRef.current === e.target) {
      handleModal();
    }
  };
  if (modal) {
    return createPortal(
      isMobile ? (
        <ModalWrapper>
          <CloseModalButton
            aria-label="Close modal"
            onClick={() => handleModal()}
          />
          <ModalHeader>
            <h3>{modalContent.title}</h3>
          </ModalHeader>
          <ModalContent>{modalContent.content}</ModalContent>
        </ModalWrapper>
      ) : (
        <Background onClick={closeModal} ref={modalRef}>
          <ModalWrapper>
            <CloseModalButton
              aria-label="Close modal"
              onClick={() => handleModal()}
            />
            <ModalHeader>
              <h3>{modalContent.title}</h3>
            </ModalHeader>
            <ModalContent>{modalContent.content}</ModalContent>
          </ModalWrapper>
        </Background>
      ),
      document.querySelector<any>("#modal-root")
    );
  } else return null;
};
export default Modal;
