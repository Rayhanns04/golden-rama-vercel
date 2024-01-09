import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import React from "react";

const CustomPopover = ({
  actionButton,
  children,
  footer = null,
  arrow = null,
  closeButton = null,
  header = null,
  isOpen,
  onOpen,
  onClose,
  ...props
}) => {
  return (
    <Popover
      matchWidth={true}
      {...props}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      orientation={"horizontal"}
      placement={"bottom"}
    >
      <PopoverTrigger>
        {actionButton ?? <Button w={"full"}>Trigger</Button>}
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          {arrow && <PopoverArrow />}
          {closeButton && <PopoverCloseButton />}
          {header && <PopoverHeader>{header}</PopoverHeader>}
          <PopoverBody>{children}</PopoverBody>
          {footer && <PopoverFooter>{footer}</PopoverFooter>}
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default CustomPopover;
