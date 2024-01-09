import {
  chakra,
  Collapse,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  VStack,
  Button,
  Link,
  Box,
  Divider,
  Heading,
  ModalOverlay,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  DrawerCloseButton,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  DrawerHeader,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import ChevronDownIcon from "../../../public/svg/icons/chevron-filled-down.svg";
import TourIcon from "../../../public/svg/nav/tours.svg";
import FlightsIcon from "../../../public/svg/nav/flights.svg";
import AttractionsIcon from "../../../public/svg/nav/attractions.svg";
import HotelsIcon from "../../../public/svg/nav/hotels.svg";
import LogoutIcon from "../../../public/svg/nav/logout.svg";
import HomepageIcon from "../../../public/svg/nav/homepage.svg";
import PackagesIcon from "../../../public/svg/nav/packages.svg";
import CruisesIcon from "../../../public/svg/nav/cruises.svg";
import ProductsIcon from "../../../public/svg/nav/products.svg";
import ArticleIcon from "../../../public/svg/nav/article.svg";
import BurgerMenuIcon from "../../../public/svg/header-burgermenu.svg";
import LogoGR from "../../../public/svg/logo-gr.svg";
import SearchIcon from "../../../public/svg/header-search.svg";
import CloseIcon from "../../../public/svg/header-close.svg";
import InsuranceIcon from "../../../public/svg/nav/insurances.svg";
import NextLink from "next/link";
import Image from "next/image";
import React, { Fragment } from "react";
import { CustomOrangeFullWidthButton } from "../button";
import { useLocalStorage } from "../../hooks";
import Account from "../../../pages/account";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/account.service";
import { useRouter } from "next/router";
import { getProductCategoryList } from "../../services/product_category.service";
import { getTheme } from "../../services/theme.service";

const Header = ({ nofixedheader = true, ...props }) => {
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const product_category = useQuery(
    ["getProductCategoryListHeader"],
    getProductCategoryList
  );
  const { data: theme } = useQuery(["getTheme"], getTheme);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data, isLoading, isError } = product_category;
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );
  const router = useRouter();
  const vacationItems =
    !isLoading && product_category.data
      ? product_category.data.map((item) => {
          return {
            name: item.attributes.name,
            icon: item.attributes.icon,
            action: item.attributes.url,
            type: "vacation",
          };
        })
      : [];
  // const vacationItems = [
  //   {
  //     name: "Tur",
  //     icon: <TourIcon />,
  //     action: "/tours",
  //     type: "vacation",
  //   },
  //   {
  //     name: "Tiket Pesawat",
  //     icon: <FlightsIcon />,
  //     action: "/flights",
  //     type: "vacation",
  //   },
  //   // {
  //   //   name: "Atraksi",
  //   //   icon: <AttractionsIcon />,
  //   //   action: "/attractions",
  //   //   type: "vacation",
  //   // },
  //   {
  //     name: "Hotel",
  //     icon: <HotelsIcon />,
  //     action: "/hotels",
  //     type: "vacation",
  //   },
  //   // {
  //   //   name: "Hotel",
  //   //   icon: "/svg/nav/hotels.svg",
  //   //   action: "/hotels",
  //   //   type: "vacation",
  //   // },
  //   // {
  //   //   name: "Paket",
  //   //   icon: <PackagesIcon />,
  //   //   action: "/packages  ",
  //   //   type: "vacation",
  //   // },
  //   {
  //     name: "Cruise",
  //     icon: <CruisesIcon />,
  //     action: "/cruises",
  //     type: "vacation",
  //   },
  //   // {
  //   //   name: "Atraksi & Hiburan",
  //   //   icon: <AttractionsIcon />,
  //   //   action: "/attractions",
  //   //   type: "vacation",
  //   // },
  //   {
  //     name: "Asuransi Perjalanan",
  //     icon: <InsuranceIcon />,
  //     action: "/insurances",
  //     type: "vacation",
  //   },
  //   {
  //     name: "Dokumen & Visa",
  //     icon: <ArticleIcon />,
  //     action: "/visa",
  //     type: "vacation",
  //   },
  // ];

  const logout = [
    {
      name: "Log Out",
      icon: <LogoutIcon />,
      action: () => {},
    },
  ];

  const items = [
    {
      name: "Beranda",
      icon: {
        data: {
          attributes: {
            name: "/svg/nav/homepage.svg",
          },
        },
      },
      action: "/",
      hidden: router.pathname === "/",
    },
    {
      name: "Liburan",
      icon: {
        data: {
          attributes: {
            name: "/svg/nav/homepage.svg",
          },
        },
      },
      action: "/",
      children: vacationItems,
    },
    {
      name: "Promo",
      icon: {
        data: {
          attributes: {
            name: "/svg/nav/products.svg",
          },
        },
      },
      action: "/promo",
    },
    // {
    //   name: "Artikel",
    //   icon: "/svg/nav/article.svg",
    //   action: "/article",
    // },
    // {
    //   name: "Tentang Kami",
    //   icon: "/svg/nav/about-us.svg",
    //   action: "/about-us",
    // },
  ];

  const itemsMobile = [...items];
  itemsMobile.splice(1, 0, ...vacationItems);
  const Account = () => {
    return (
      <>
        {isLoggedIn ? (
          <LinkBox>
            <NextLink href="/account">
              <Link rel="canonical">
                <HStack id={"header-account"}>
                  <Flex hidden overflow={"hidden"} rounded={"full"}>
                    <Image
                      alt={"Profile Picture"}
                      width={50}
                      height={50}
                      src={"https://dummyimage.com/50x50"}
                    />
                  </Flex>
                  <Stack>
                    <Heading as={"h3"} fontSize={{ base: "md", md: "lg" }}>
                      {user?.full_name}
                    </Heading>
                    <Text
                      color={"neutral.text.low"}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {user?.email}
                    </Text>
                  </Stack>
                </HStack>
              </Link>
            </NextLink>
          </LinkBox>
        ) : (
          <LoginRegister />
        )}
      </>
    );
  };
  const NavigationMobile = ({ items, isOpen, onClose, onOpen, ...props }) => {
    return (
      <Box {...props}>
        <Drawer
          placement={useBreakpointValue(
            {
              base: "top",
              md: "left",
            },
            { ssr: false }
          )}
          onClose={onClose}
          isOpen={isOpen}
        >
          <DrawerOverlay />
          <DrawerContent maxH={"100vh"} position={"relative"} overflow={"auto"}>
            <DrawerHeader p={0} position={"sticky"} zIndex={2} top={0}>
              <Box inset={0} py={18} zIndex={1} bg={"white"}>
                <HStack mx={"24px"} justifyContent={"space-between"}>
                  <IconButton
                    visibility={"hidden"}
                    onClick={onOpen}
                    variant={"unstyled"}
                    aria-label={"Open Navigation"}
                    width={"24px"}
                    height={"24px"}
                    icon={<BurgerMenuIcon />}
                  />
                  <NextLink href={"/"}>
                    <Link rel="canonical">
                      {theme?.logo?.data ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${theme.logo.data.attributes.url}`}
                          alt="logo"
                          width={120}
                          height={45}
                          objectFit="contain"
                        />
                      ) : (
                        <LogoGR />
                      )}
                    </Link>
                  </NextLink>
                  <IconButton
                    variant={"unstyled"}
                    aria-label={"Search"}
                    onClick={onClose}
                    width={"24px"}
                    height={"24px"}
                    icon={<CloseIcon />}
                  />
                </HStack>
              </Box>
            </DrawerHeader>
            <Stack spacing={0} pb={3}>
              <Box p={"24px"}>
                <Account />
              </Box>
              <Divider />
              {items
                .filter((item) => {
                  return !item.children;
                })
                .map((item, index) => (
                  <NavigationItem key={index} item={item} />
                ))}
            </Stack>
          </DrawerContent>
          {/* <Collapse in={isOpen} animateOpacity>
      </Collapse> */}
        </Drawer>
      </Box>
    );
  };

  const CustomMenu = ({ title, children }) => {
    return (
      <Menu>
        <MenuButton
          // onMouseOver={onOpen}
          // onMouseLeave={onClose}
          // onClick={onOpen}
          as={Link}
          textColor={"neutral.900"}
          _expanded={{ textColor: "brand.blue.400" }}
          _focus={{ textColor: "brand.blue.400" }}
          _hover={{ textColor: "brand.blue.400" }}
        >
          <HStack>
            <chakra.span>{title}</chakra.span>
            <ChevronDownIcon />
          </HStack>
        </MenuButton>
        <MenuList>
          {/* <MenuList onMouseOver={onOpen} onMouseLeave={onClose}> */}
          {children}
        </MenuList>
      </Menu>
    );
  };

  const HeaderMobile = () => {
    return (
      <>
        <Box
          {...props}
          inset={0}
          maxH={"fit-content"}
          p={18}
          position={!nofixedheader ? "sticky" : "static"}
          zIndex={10}
          bg={"white"}
        >
          <Stack
            direction={"row"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            justifyItems={"center"}
            mx={"auto"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <IconButton
              onClick={onOpen}
              variant={"unstyled"}
              aria-label={"Open Navigation"}
              width={"24px"}
              height={"24px"}
              icon={<BurgerMenuIcon />}
            />
            <NextLink href={"/"} passHref>
              <Link rel="canonical">
                {theme?.logo?.data ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${theme.logo.data.attributes.url}`}
                    alt="logo"
                    width={120}
                    height={45}
                    objectFit="contain"
                  />
                ) : (
                  <LogoGR />
                )}
              </Link>
            </NextLink>
            <NextLink href="/search">
              <Link rel="canonical">
                <IconButton
                  variant={"unstyled"}
                  aria-label={"Search"}
                  width={"24px"}
                  height={"24px"}
                  icon={<SearchIcon />}
                />
              </Link>
            </NextLink>
          </Stack>
          <NavigationMobile
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            items={itemsMobile.filter((item) => {
              return !item.hidden;
            })}
          />
        </Box>
      </>
    );
  };

  const NavigationItem = ({ item, hideIcon = false, ...props }) => {
    return (
      <>
        {item.action && typeof item.action == "string" ? (
          <NextLink href={item.action ?? "#"}>
            <Link
              rel="canonical"
              fontWeight={400}
              textColor={"neutral.900"}
              _hover={{
                backgroundColor: "#F1F1F1",
                textDecoration: "none",
                textColor: "brand.blue.400",
              }}
            >
              <Stack>
                <Flex
                  px={"24px"}
                  py={15}
                  justify={"space-between"}
                  align={"center"}
                >
                  <HStack spacing={"16px"}>
                    <Image
                      objectFit="contain"
                      src={
                        item.icon?.data?.attributes?.url
                          ? BASE_URL + item.icon?.data?.attributes?.url
                          : item.icon?.data?.attributes?.name
                      }
                      // layout={"fill"}
                      width={24}
                      height={24}
                      alt={item.icon?.data?.attributes?.ur}
                      // position="absolute"
                      // objectPosition={"right"}
                    />
                    {/* {item.icon && !hideIcon && item.icon} */}
                    <Text>{item.name}</Text>
                  </HStack>
                </Flex>
              </Stack>
            </Link>
          </NextLink>
        ) : (
          item.action &&
          typeof item.action == "function" && (
            <Stack key={index}>
              <Flex
                px={"24px"}
                py={15}
                justify={"space-between"}
                align={"center"}
                _hover={{
                  backgroundColor: "#F1F1F1",
                  textDecoration: "none",
                  textColor: "brand.blue.400",
                }}
              >
                <HStack spacing={"16px"}>
                  {item.icon}
                  <Text>{item.name}</Text>
                </HStack>
              </Flex>
            </Stack>
          )
        )}
      </>
    );
  };

  const LoginRegister = () => {
    return (
      <HStack>
        <NextLink href="/auth?type=login">
          <Link rel="canonical">
            <CustomOrangeFullWidthButton mt={0}>
              Login
            </CustomOrangeFullWidthButton>
          </Link>
        </NextLink>
        <NextLink href="/auth?type=register">
          <Link rel="canonical">
            <CustomOrangeFullWidthButton isoutlined mt={0}>
              Register
            </CustomOrangeFullWidthButton>
          </Link>
        </NextLink>
      </HStack>
    );
  };
  return isDesktop ? (
    <>
      <Box
        {...props}
        inset={0}
        maxH={"fit-content"}
        p={18}
        position={!nofixedheader ? "sticky" : "static"}
        zIndex={10}
        bg={"white"}
      >
        <Stack
          direction={"row"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          justifyItems={"center"}
          mx={"auto"}
          // mx={{ base: "24px", md: "auto" }}
          justifyContent={"space-between"}
        >
          <Flex
            gap="16px"
            alignItems={"center"}
            spacing={"80px"}
            justifyContent="flex-end"
          >
            <NextLink href={"/"}>
              <Link rel="canonical">
                {theme?.logo?.data ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${theme.logo.data.attributes.url}`}
                    alt="logo"
                    width={120}
                    height={45}
                    objectFit="contain"
                  />
                ) : (
                  <LogoGR />
                )}
              </Link>
            </NextLink>

            <HStack spacing={"40px"}>
              {items
                .filter((item) => {
                  return !item.hidden;
                })
                .map((item, i) => {
                  return (
                    <Fragment key={i}>
                      {!item.children ? (
                        <NextLink key={i} href={item.action ?? "#"}>
                          <Link
                            rel="canonical"
                            fontWeight={400}
                            _hover={{ textColor: "brand.blue.400" }}
                            textColor={"neutral.900"}
                          >
                            <Stack>
                              <Flex justify={"space-between"} align={"center"}>
                                <HStack spacing={"16px"}>
                                  <Text>{item.name}</Text>
                                </HStack>
                              </Flex>
                            </Stack>
                          </Link>
                        </NextLink>
                      ) : (
                        <CustomMenu key={i} title={item.name}>
                          {item.children.map((child, index) => (
                            <MenuItem p={0} display={"block"} key={index}>
                              <NavigationItem item={child} />
                            </MenuItem>
                          ))}
                        </CustomMenu>
                      )}
                    </Fragment>
                  );
                })}
            </HStack>
          </Flex>
          <HStack>
            <Account />
            <NextLink href="/search">
              <Link rel="canonical">
                <IconButton
                  variant={"unstyled"}
                  aria-label={"Search"}
                  width={"24px"}
                  height={"24px"}
                  icon={<SearchIcon />}
                />
              </Link>
            </NextLink>
          </HStack>
        </Stack>
      </Box>
    </>
  ) : (
    <HeaderMobile />
  );
};

export default Header;
