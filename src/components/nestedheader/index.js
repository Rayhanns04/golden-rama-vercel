import { HStack, IconButton, Box, Heading, useToken } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import ChevronRight from "../../../public/svg/icons/chevron-right.svg";
import { useRouter } from "next/router";
import Head from "next/head";

const NestedHeader = ({
  nofixedheader,
  pagetitle = "Page Title",
  isHotels = false,
  ...props
}) => {
  const router = useRouter();
  //if path order-success then redirect to home
  const { asPath } = router;
  const path = asPath.split("/")[2]?.split("?")[0];
  const isOrderSuccess = path == "order-success";
  const handleBack = () => {
    if (isOrderSuccess) {
      return router.push("/");
    }
    return router.back();
  };
  const handleClose = () => {
    //detect if router back is available
    if (router.back()) {
      return router.back();
    }
    //if not, close the modal
    return window.close();
  };
  const [bgHeader] = useToken("colors", [props.bg ?? "white"]);

  return (
    <>
      <Head>
        <meta name="theme-color" content={bgHeader} />
        <meta name="apple-mobile-web-app-status-bar-style" content={bgHeader} />
      </Head>
      <Box
        {...props}
        inset={0}
        maxH={"fit-content"}
        p={18}
        position={!nofixedheader ? "sticky" : "static"}
        zIndex={10}
        bg={props.bg ?? "white"}
      >
        <HStack
          maxW={{
            lg: "container.lg",
            xl: { lg: "container.lg", xl: "container.xl" },
          }}
          justifyItems={"center"}
          mx={"auto"}
          // mx={{ base: "24px", md: "auto" }}
          justifyContent={"space-between"}
        >
          <IconButton
            color={"neutral.text.high"}
            variant={"unstyled"}
            aria-label={"Open Navigation"}
            icon={<ChevronRight />}
            // onClick={isHotels ? handleClose : handleBack}
            onClick={handleClose}
          />
          <Heading
            color={"neutral.text.high"}
            fontSize={20}
            as={"h3"}
            textAlign={"center"}
          >
            {pagetitle ?? ""}
          </Heading>
          <NextLink hidden href={"/"} passHref>
            <IconButton
              visibility={"hidden"}
              variant={"unstyled"}
              aria-label={"Open Navigation"}
              w={"24px"}
              h={"24px"}
              icon={<ChevronRight />}
            />
          </NextLink>
        </HStack>
      </Box>
    </>
  );
};

export default NestedHeader;
