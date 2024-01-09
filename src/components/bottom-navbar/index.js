import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Link,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
const BottomNavbar = ({}) => {
  const router = useRouter();
  const showBottomNav =
    router.pathname === "/" ||
    router.pathname.startsWith("/account") ||
    router.pathname.startsWith("/saved") ||
    router.pathname.startsWith("/order-histories");
  const navigation = [
    {
      image: "/svg/footer/nav/homepage",
      name: "Homepage",
      isActive: router.pathname === "/",
      url: "/",
    },
    // {
    //   image: "/svg/footer/nav/saved",
    //   name: "Saved",
    // isActive: router.pathname.startsWith('')
    // url: "/saved",
    // },
    {
      image: "/svg/footer/nav/order",
      name: "Orders",
      isActive: router.pathname.startsWith("/order-histories"),
      url: "/order-histories",
    },
    {
      image: "/svg/footer/nav/account",
      name: "Account",
      isActive: router.pathname.startsWith("/account"),
      url: "/account",
    },
    {
      image: "/svg/footer/nav/whatsapp",
      name: "WhatsApp",
      url: "https://wa.me/6281511221133",
      isExternal: true,
    },
  ];
  return (
    <HStack
      hidden={!showBottomNav}
      display={{ base: "flex", md: "none" }}
      position={"sticky"}
      justifyContent={"space-evenly"}
      bottom={0}
      bg={"white"}
      zIndex={10}
    >
      {navigation?.map((item, index) => (
        <NextLink key={index} passHref href={item.url}>
          <Link isExternal={item.isExternal}>
            <Image
              priority
              alt={item.name}
              width={100}
              height={60}
              src={`${item.image}${
                // router.pathname.startsWith(item.url)
                item.isActive ? "-active.svg" : "-inactive.svg"
              }`}
              // src={item.image + "-inactive.svg"}
            />
          </Link>
        </NextLink>
      ))}
    </HStack>
  );
};

export default BottomNavbar;
