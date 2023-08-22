import {
  Box,
  Heading,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
  useToken,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import ArrowRight from "../../../public/svg/icons/arrow-right.svg";
import SearchIcon from "../../../public/svg/header-search.svg";
import Logo from "../../../public/svg/logo-gr-white.svg";
import { getTheme } from "../../services/theme.service";
import NextLink from "next/link";
import { useScrollPosition } from "../../hooks";

import React from "react";

const BgHeader = ({
  nofixedheader,
  pagedescription,
  pagetitle = "Page Title",
  bgheader,
  bgoption,
  ...props
}) => {
  const [brandBlue] = useToken("colors", ["brand.blue.400"]);
  const { data: theme } = useQuery(["getTheme"], getTheme);
  const router = useRouter();
  const scrollPosition = useScrollPosition();
  const handleClose = () => {
    //detect if router back is available
    if (router.back()) {
      return router.back();
    }
    //if not, close the modal
    return window.close();
  };
  return (
    <>
      <Head>
        {!props.hidden && (
          <>
            <meta name="theme-color" content={brandBlue} />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content={brandBlue}
            />
          </>
        )}
      </Head>
      <Box
        // maxH={"180px"}
        inset={0}
        overflow={"hidden"}
        roundedBottom={"3xl"}
        // maxH={"145px"}
        px={18}
        pt={18}
        h={
          bgoption?.isMobile && scrollPosition <= 16
            ? bgoption.heightHeaderMobile
            : bgoption?.isMobile
            ? "160px"
            : "auto"
        }
        // minH={"200px"}
        position={!nofixedheader ? "sticky" : "relative"}
        zIndex={10}
        bg={"brand.blue.400"}
        transition="all 0.5s ease"
        {...props}
      >
        {typeof bgheader === "string" && !bgheader.includes("undefined") && (
          <Image
            alt={pagetitle ?? "background header"}
            src={bgheader ?? "/svg/tours/header-bg.svg"}
            layout={"fill"}
            objectPosition={bgoption?.objectPosition || "top"}
            objectFit={bgoption?.objectFit || "cover"}
          />
        )}
        <Box
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          justifyItems={"center"}
          mx={"auto"}
          // mx={{ base: "24px", md: "auto" }}
          // mx={"24px"}
        >
          <HStack maxH={70} justifyContent={"space-between"}>
            {/* <NextLink href={"/"} passHref> */}
            <IconButton
              color={"white"}
              variant={"unstyled"}
              aria-label={"Open Navigation"}
              icon={<ArrowRight />}
              onClick={handleClose}
            />
            {/* </NextLink> */}
            <Box position={"relative"} zIndex={1}>
              {/* <NextLink passHref href="/">
                <Link>
                  {theme?.logo_white?.data ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${theme.logo_white.data.attributes.url}`}
                      alt="logo"
                      width={120}
                      height={45}
                      objectFit="contain"
                    />
                  ) : (
                    <Logo />
                  )}
                </Link>
              </NextLink> */}
            </Box>
            <IconButton
              variant={"unstyled"}
              aria-label={"Search"}
              visibility={"hidden"}
              icon={<SearchIcon />}
            />
          </HStack>
          <Stack
            position={"relative"}
            py={30}
            // alignItems={{ base: "flex-start", md: "center" }}
            columnGap={4}
            // direction={{ base: "column", md: "row" }}
          >
            <Heading fontSize={{ base: 32, md: 40 }} color={"white"} as={"h1"}>
              {pagetitle}
            </Heading>
            {pagedescription && (
              <Text
                fontFamily={"heading"}
                as={"h2"}
                // fontWeight={"bold"}
                fontSize={{ base: 18, md: 24 }}
                color={"white"}
              >
                {pagedescription}
              </Text>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default BgHeader;
