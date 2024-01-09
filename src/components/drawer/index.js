import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { CustomOrangeFullWidthButton } from "../button";

export const CustomDrawer = ({
  title,
  children,
  footer,
  footerLeft,
  isOpen,
  onClose,
  onSubmit,
  onReset,
  hidefooter,
  notrounded,
  drawer,
  initialFocusRef = null,
  size = notrounded ? "full" : "md",
  footerOnClose,
  ...props
}) => {
  return (
    <>
      <Head>
        {isOpen && notrounded && (
          <>
            <meta name="theme-color" content={"white"} />
            Head
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content={"white"}
            />
          </>
        )}
      </Head>
      <Drawer
        {...props}
        initialFocusRef={initialFocusRef}
        // isFullHeight={true}
        finalFocusRef={drawer}
        isOpen={isOpen}
        autoFocus={false}
        returnFocusOnClose={false}
        placement={useBreakpointValue(
          {
            base: "bottom",
            md: "right",
          },
          { ssr: false }
        )}
        size={size}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent
          maxH={"100vh"}
          roundedTop={useBreakpointValue(
            {
              base: notrounded ? "none" : "2xl",
              md: "none",
            },
            { ssr: false }
          )}
          maxHeight={useBreakpointValue(
            {
              base: "full",
              md: "auto",
            },
            { ssr: false }
          )}
        >
          <DrawerHeader py={"20px"} alignItems={"center"}>
            <Stack alignItems={"center"}>
              <Heading
                color={"neutral.text.high"}
                fontSize={20}
                as={"h3"}
                textAlign={"center"}
              >
                {title ?? "Pilih Destinasi"}
              </Heading>
              <DrawerCloseButton m={0} />
            </Stack>
          </DrawerHeader>
          <Divider />
          <DrawerBody px={"24px"}>{children ?? ""}</DrawerBody>
          <Divider />
          {!hidefooter && (
            <DrawerFooter gap={1}>
              {onReset && (
                <CustomOrangeFullWidthButton
                  mt={0}
                  onClick={onReset}
                  isoutlined
                >
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
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
