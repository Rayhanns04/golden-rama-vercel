import {
  chakra,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useRef } from "react";
import { CustomDrawer } from "../drawer";
import ChevronDownIcon from "../../../public/svg/icons/chevron-filled-down.svg";
import CustomModal from "../modal";

export const CustomDropdown = ({
  children,
  title,
  placeholder,
  label,
  value = null,
  innerbutton,
  notrounded,
  footer,
  responsive = true,
  ignoreRef,
  initialFocusRef = null,
  cusDisclosure,
  rightIcon,
  onSubmit,
  ...props
}) => {
  const drawerRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEmpty = value?.length === 0 || value === 0;
  const Dropdown = () => {
    return (
      <Button
        {...props}
        fontWeight={"normal"}
        p={"15px"}
        h={"fit-content"}
        fontSize={props.fontSize ?? { base: "sm", md: "md" }}
        variant={"dropdown"}
        justifyContent={"space-between"}
        ref={drawerRef}
        w={"full"}
        color={isEmpty ? "neutral.text.low" : "neutral.text.high"}
        bg={props.bg}
        colorScheme={props.colorScheme ?? "gray"}
        onClick={cusDisclosure?.onOpen || onOpen}
      >
        {innerbutton ? (
          innerbutton
        ) : (
          <>
            <HStack gap="10px">
              {rightIcon}
              <Text>{isEmpty ? placeholder : label || value}</Text>
            </HStack>
            <chakra.span color={"neutral.text.high"}>
              <ChevronDownIcon />
            </chakra.span>
          </>
        )}
      </Button>
    );
  };
  // return children;
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );

  return (
    <>
      {/* <Dropdown /> */}
      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
      {!responsive ? (
        <>
          <Dropdown />
          <CustomDrawer
            initialFocusRef={initialFocusRef}
            drawer={drawerRef}
            isOpen={cusDisclosure?.isOpen || isOpen}
            onOpen={cusDisclosure?.onOpen || onOpen}
            onClose={cusDisclosure?.onClose || onClose}
            onSubmit={onSubmit}
            title={title}
            notrounded={notrounded}
            footer={footer}
          >
            {children}
          </CustomDrawer>
        </>
      ) : (
        <>
          <Dropdown />
          {isDesktop ? (
            <CustomModal
              initialFocusRef={initialFocusRef}
              footer={footer}
              title={title}
              closeButton
              onOpen={cusDisclosure?.isOpen || onOpen}
              onClose={cusDisclosure?.onClose || onClose}
              isOpen={cusDisclosure?.isOpen || isOpen}
              onSubmit={onSubmit}
            >
              {children}
            </CustomModal>
          ) : (
            <CustomDrawer
              initialFocusRef={initialFocusRef}
              drawer={drawerRef}
              isOpen={cusDisclosure?.isOpen || isOpen}
              onOpen={cusDisclosure?.isOpen || onOpen}
              onClose={cusDisclosure?.onClose || onClose}
              onSubmit={onSubmit}
              title={title}
              notrounded={notrounded}
              footer={footer}
            >
              {children}
            </CustomDrawer>
          )}
        </>
      )}
    </>
  );
};
