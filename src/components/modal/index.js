import {
  Button,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { CustomOrangeFullWidthButton } from "../button";

const CustomModal = ({
  title,
  children,
  footer,
  footerLeft,
  isOpen,
  onClose,
  onReset,
  hidefooter,
  size = "lg",
  notrounded,
  drawer,
  initialFocusRef = null,
  onSubmit,
  footerOnClose,
  closeButton,
  ...props
}) => {
  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior={"inside"}
      size={size}
      initialFocusRef={initialFocusRef}
      motionPreset={"slideInBottom"}
      autoFocus={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          as={Heading}
          size={"md"}
          color="neutral.text.high"
          textAlign={"center"}
        >
          {title ?? "Modal Title"}
        </ModalHeader>
        {closeButton && <ModalCloseButton />}
        <Divider />
        <ModalBody>{children}</ModalBody>
        <Divider />
        {!hidefooter && (
          <ModalFooter gap={2}>
            {onReset && (
              <CustomOrangeFullWidthButton mt={0} onClick={onReset} isoutlined>
                Reset
              </CustomOrangeFullWidthButton>
            )}
            {footerLeft ?? <></>}
            {typeof footer == "string" ? (
              <CustomOrangeFullWidthButton
                mt={0}
                onClick={() => {
                  if (onSubmit) onSubmit();
                  if (onClose) onClose();
                }}
              >
                {footer ?? "Submit"}
              </CustomOrangeFullWidthButton>
            ) : footer ? (
              footer
            ) : (
              <CustomOrangeFullWidthButton
                mt={0}
                onClick={() => {
                  if (onSubmit) onSubmit();
                  if (onClose) onClose();
                }}
              >
                {footerOnClose ?? "Pilih"}
              </CustomOrangeFullWidthButton>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
