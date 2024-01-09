import {
  Box,
  Heading,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  useToken,
} from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import Head from "next/head";
import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import ChevronRight from "../../../public/svg/icons/chevron-right.svg";
import SearchIcon from "../../../public/svg/header-search.svg";
import Logo from "../../../public/svg/logo-gr-white.svg";
import { getTheme } from "../../services/theme.service";

export default function AltHeader({
  nofixedheader,
  pagedescription,
  pagetitle = "Page Title",
  bgheader,
  ...props
}) {
  const [brandBlue] = useToken("colors", ["brand.blue.400"]);
  const { data: theme } = useQuery(["getTheme"], getTheme);
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
        {...props}
        inset={0}
        overflow={"hidden"}
        roundedBottom={"3xl"}
        // maxH={"145px"}
        px={18}
        pt={18}
        // minH={"200px"}
        position={!nofixedheader ? "sticky" : "relative"}
        zIndex={10}
        bg={"brand.blue.400"}
      >
        <Image
          alt={pagetitle ?? "background header"}
          src={bgheader ?? "/svg/tours/header-bg.svg"}
          layout={"fill"}
          objectPosition={"top"}
          objectFit={
            (useBreakpointValue({ base: "cover", md: "cover" }), { ssr: false })
          }
        />
        <Box
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          justifyItems={"center"}
          mx={"auto"}
          // mx={{ base: "24px", md: "auto" }}
          // mx={"24px"}
        >
          <HStack maxH={70} justifyContent={"space-between"}>
            <NextLink href={"/"} passHref>
              <IconButton
                color={"white"}
                variant={"unstyled"}
                aria-label={"Open Navigation"}
                icon={<ChevronRight />}
              />
            </NextLink>
            <Box position={"relative"} zIndex={1}>
              <NextLink passHref href="/">
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
              </NextLink>
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
            <Heading fontSize={20} color={"white"} as={"h1"}>
              {pagetitle}
            </Heading>
            {pagedescription && (
              <Text fontSize={{ base: "xs", md: "sm" }} color={"white"}>
                {pagedescription}
              </Text>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
