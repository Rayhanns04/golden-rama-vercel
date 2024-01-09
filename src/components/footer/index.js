import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import React from "react";

const Footer = (props) => {
  const footer_nav = [
    {
      name: "Tentang Kami",
      url: "/about-us",
    },
    {
      name: "Karir",
      url: "/career",
    },
    {
      name: "Syarat & Ketentuan",
      url: "/terms-conditions",
    },
    {
      name: "Media",
      url: "/media",
    },
    {
      name: "Kebijakan & Privasi",
      url: "/privacy-policy",
    },
    {
      name: "Hubungi Kami",
      url: "/contact-us",
    },
    {
      name: "Tanggapan",
      url: "/contact",
    },
    {
      name: "FAQ",
      url: "/faqs",
    },
  ];

  return (
    <Stack as={"footer"} bg={"neutral.color.bg.secondary"}>
      <Stack
        spacing={"20px"}
        position={"relative"}
        pt={"32px"}
        mb={"36px"}
        mx={"24px"}
      >
        {/* <Image
          width={120}
          height={45}
          alt="logo"
          src={"/svg/logo-gr.svg"}
        />
        <Text  fontSize={"sm"} color={"neutral.text.medium"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam.
          Elit ex exercitation duis sit magna ea officia. Lor ipsum dolor sit
          amet, consectetur adipiscing elit aliquam. Elit ex exercitation duis
          sit magna ea officia.
        </Text>
        <HStack spacing={"20px"} justifyContent={"center"}>
          <Box>
            <Image width={135} height={40} src={"/svg/icons/play-store.svg"} />
          </Box>
          <Box>
            <Image width={135} height={40} src={"/svg/icons/app-store.svg"} />
          </Box>
        </HStack> */}
        <Stack>
          <Text
            fontSize={"md"}
            textAlign={"center"}
            color={"neutral.text.medium"}
            mb={15}
            fontWeight={"bold"}
          >
            Ikuti Kami
          </Text>
          <HStack justify={"center"} spacing={"15px"}>
            <Link isExternal href="https://www.facebook.com/goldenramatours">
              <Image
                alt="Facebook Golden Rama"
                src="/svg/footer/icons/facebook.svg"
                width={36}
                height={36}
              />
            </Link>
            <Link isExternal href="https://www.instagram.com/goldenramatours">
              <Image
                alt="Instagram Golden Rama"
                src="/svg/footer/icons/instagram.svg"
                width={36}
                height={36}
              />
            </Link>
            <Link isExternal href="https://www.twitter.com/goldenramatours">
              <Image
                alt="Twitter Golden Rama"
                src="/svg/footer/icons/twitter.svg"
                width={36}
                height={36}
              />
            </Link>
            <Link isExternal href="https://www.tiktok.com/@goldenramatours">
              <Image
                alt="Tiktok Golden Rama"
                src="/svg/footer/icons/tiktok.svg"
                width={36}
                height={36}
              />
            </Link>
            <Link
              isExternal
              href="https://www.linkedin.com/company/pt-golden-rama-express/"
            >
              <Image
                alt="LinkedIn Golden Rama"
                src="/svg/footer/icons/linkedin.svg"
                width={36}
                height={36}
              />
            </Link>
            <Link
              isExternal
              href="https://www.youtube.com/channel/UCt4TY-khy3p78TcjgW77cgg"
            >
              <Image
                alt="Youtube Golden Rama"
                src="/svg/footer/icons/youtube.svg"
                width={36}
                height={36}
              />
            </Link>
            <Link isExternal href="https://wa.me/6281511221133">
              <Image
                alt="Whatsapp Golden Rama"
                src="/svg/footer/icons/whatsapp.svg"
                width={36}
                height={36}
              />
            </Link>
          </HStack>
        </Stack>
        <Stack gap={"10px"}>
          <HStack
            gap={1}
            divider={<StackDivider borderColor={"neutral.black.700"} />}
            wrap={"wrap"}
            justifyContent="center"
          >
            {footer_nav.map((item, index) => (
              <NextLink href={item.url} passHref key={index}>
                <Link color={"neutral.black.700"} fontSize="14px">
                  {item.name}
                </Link>
              </NextLink>
            ))}
          </HStack>
          <Text color={"neutral.black.700"} fontSize={"sm"} textAlign="center">
            Copyright © Golden Rama
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
