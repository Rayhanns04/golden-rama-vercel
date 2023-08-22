/* eslint-disable @next/next/no-img-element */
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  StackDivider,
  WrapItem,
  Wrap,
  useBreakpointValue,
  LinkBox,
  LinkOverlay,
  useToast,
  Portal,
} from "@chakra-ui/react";
import Layout from "../src/components/layout";
import fs from "fs";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FreeMode, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { format } from "date-fns";
import ArrowRightIcon from "../public/svg/chevron-right.svg";
import { CustomToursTabs } from "../src/components/tab";
import {
  getPromoList,
  getPromoListHomepage,
  getPromoListUsingPage,
} from "../src/services/promo.service";
import { getBanner } from "../src/services/banner.service";
import { getTourHighlights } from "../src/services/tour.service";
import EventAcceptedIcon from "../public/svg/homepage/event-accepted.svg";
import WeatherCloudIcon from "../public/svg/homepage/weather-cloud.svg";
import WhatsappFloatIcon from "../public/svg/homepage/whatsapp-float.svg";
import ChevronFilledDown from "../public/svg/icons/chevron-filled-down.svg";
import { Form, Formik } from "formik";
import { EmailForm } from "../src/components/form";
import { getProductCategoryList } from "../src/services/product_category.service";
import { getArticles } from "../src/services/article.service";
import { ProductCategory } from "../src/components/card";
import { useDispatch } from "react-redux";
import { resetDataTour } from "../src/state/tour/tour.slice";
import { resetDataFlight } from "../src/state/order/order.slice";
import { Fragment, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { subscribe } from "../src/services/email.service";
import NotFound from "./404";
import { resetDataAttraction } from "../src/state/attraction/attraction.slice";
import { convertDateToMonthName } from "../src/helpers";
import { detail } from "../src/state/promo/promo.slice";

export default function Home({ data, meta }) {
  const router = useRouter();
  const { tourTags, banner, promo, products, airlines, articles } = data;
  const toast = useToast();
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
    dispatch(resetDataAttraction({}));
  }, []);

  const subscribeMutation = useMutation(
    async (value) => {
      try {
        const response = await subscribe(value);
        return Promise.resolve(response.data);
      } catch (error) {
        console.error(error);

        return Promise.reject(false);
      }
    },
    {
      onSuccess: () =>
        toast({
          title: "Terima kasih",
          description: "Anda telah berlangganan email kami",
          status: "success",
          duration: 5000,
          isClosable: true,
        }),
      onError: (error) =>
        toast({
          title: "Error",
          description: error ?? "Email sudah terdaftar",
          status: "success",
          duration: 5000,
          isClosable: true,
        }),
    }
  );

  const handleSubmitSubscription = (val, action) => {
    subscribeMutation
      .mutateAsync(val)
      .finally(() => action.setSubmitting(false));
  };
  const AirlinesPartners = () => {
    const countItems = isDesktop ? 6 : 20;
    const [showAirlines, setShowAirlines] = useState(countItems);
    const handleShowAirlines = () => {
      setShowAirlines(showAirlines + 99);
    };
    const handleCloseAirlines = () => {
      setShowAirlines(countItems);
    };
    useEffect(() => {
      isDesktop && setShowAirlines(countItems);
    }, [countItems]);
    return (
      <>
        <SimpleGrid
          px={{ md: "24px" }}
          py={"12px"}
          columns={[3, 10]}
          spacing={{ base: 0, md: 0 }}
        >
          {airlines.slice(0, showAirlines)?.map((e, i) => {
            return (
              <Center position={"relative"} w={"100%"} h={70} key={i}>
                <Image
                  alt={e}
                  layout="fill"
                  quality={100}
                  objectFit="contain"
                  src={`/png/homepage/airlines/color/${e}`}
                />
              </Center>
            );
          })}
        </SimpleGrid>
        {showAirlines < airlines?.length ? (
          <Center>
            <Button
              color={"brand.blue.400"}
              colorScheme={"brand.blue"}
              fontWeight={"normal"}
              variant={"unstyled"}
              display={"flex"}
              alignItems={"center"}
              onClick={handleShowAirlines}
              rightIcon={<ChevronFilledDown />}
            >
              Lihat Semua
            </Button>
          </Center>
        ) : (
          <Center>
            <Button
              color={"brand.blue.400"}
              colorScheme={"brand.blue"}
              fontWeight={"normal"}
              variant={"unstyled"}
              display={"flex"}
              alignItems={"center"}
              onClick={handleCloseAirlines}
              rightIcon={
                <Box style={{ rotate: "180deg" }}>
                  <ChevronFilledDown />
                </Box>
              }
            >
              Tutup
            </Button>
          </Center>
        )}
      </>
    );
  };

  return (
    <Layout meta={meta}>
      <Portal>
        {!isDesktop && (
          <Box
            float={"right"}
            position={"fixed"}
            right={"20px"}
            bottom={"10px"}
            zIndex={1}
          >
            <Link isExternal href="https://wa.me/6281511221133">
              <WhatsappFloatIcon />
            </Link>
          </Box>
        )}
      </Portal>
      {/* Banner */}
      <Box as={"section"} mx={"-24px"}>
        <Swiper
          id="homepage-banner"
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
          }}
          navigation={isDesktop ? false : true}
          // height={"auto"}
          spaceBetween={0}
          slidesPerView={1}
        >
          {banner &&
            banner.map((item, index) => {
              const desktop = item.attributes?.banner?.data?.attributes?.url;
              const mobile =
                item.attributes?.banner_mobile?.data?.attributes?.url;
              const description = item.attributes?.description;
              const url = item.attributes?.url;
              return (
                <Fragment key={index}>
                  {mobile && isDesktop && (
                    <SwiperSlide key={index}>
                      <LinkBox>
                        <Box
                          shadow={"lg"}
                          overflow={"hidden"}
                          style={{ aspectRatio: 828 / 1243 }}
                          // h={{ base: "640px" }}
                          w={"100%"}
                          // position={"relative"}
                        >
                          <NextLink passHref href={url}>
                            <LinkOverlay>
                              <Image
                                alt={description}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${mobile}`}
                                objectFit={"contain"}
                                layout="fill"
                                priority={index === 0}
                              />
                            </LinkOverlay>
                          </NextLink>
                        </Box>
                      </LinkBox>
                    </SwiperSlide>
                  )}
                  {desktop && !isDesktop && (
                    <SwiperSlide key={index}>
                      <LinkBox>
                        <Box
                          shadow={"lg"}
                          overflow={"hidden"}
                          style={{ aspectRatio: 750 / 223 }}
                          w={"100%"}
                          position={"relative"}
                        >
                          <NextLink passHref href={url}>
                            <LinkOverlay>
                              <Image
                                alt={description}
                                objectPosition={"center"}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${desktop}`}
                                objectFit={"contain"}
                                quality={100}
                                layout="fill"
                                priority={index === 0}
                              />
                            </LinkOverlay>
                          </NextLink>
                        </Box>
                      </LinkBox>
                    </SwiperSlide>
                  )}
                </Fragment>
              );
            })}
        </Swiper>
      </Box>
      {/* Penawaran Eksklusif */}
      {promo && promo.length !== 0 && (
        <Box
          as={"section"}
          my={30}
          mx={"auto"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          alignItems="flex-start"
        >
          <VStack alignItems={"flex-start"}>
            <HStack alignSelf={"stretch"} justifyContent={"space-between"}>
              <Heading
                textTransform={"uppercase"}
                color={"brand.blue.600"}
                as={"h3"}
                size={{ base: "md", md: "xl" }}
              >
                Penawaran Eksklusif
              </Heading>
              <NextLink href="/promo" passHref>
                <Link
                  fontSize={{ base: "sm", md: "md" }}
                  color={"brand.blue.400"}
                >
                  <HStack>
                    <Text>Lihat Semua</Text>
                    <ArrowRightIcon />
                  </HStack>
                </Link>
              </NextLink>
            </HStack>
            {/* <HStack alignSelf={"stretch"} spacing={3}>
            <Flex flex={"none"}>
              <Text
                color={"neutral.text.medium"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Berakhir dalam
              </Text>
            </Flex>
            <Box>
              <Alert
                bg={"alert.failed"}
                textColor={"white"}
                py={1}
                px={2}
                rounded={"full"}
              >
                <HStack spacing={2}>
                  <Icon
                    width="4"
                    height="4"
                    viewBox="0 0 16 16"
                    textColor={"white"}
                  >
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 5.33333V8L10 10M14 8C14 8.78793 13.8448 9.56815 13.5433 10.2961C13.2417 11.0241 12.7998 11.6855 12.2426 12.2426C11.6855 12.7998 11.0241 13.2417 10.2961 13.5433C9.56815 13.8448 8.78793 14 8 14C7.21207 14 6.43185 13.8448 5.7039 13.5433C4.97595 13.2417 4.31451 12.7998 3.75736 12.2426C3.20021 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.5913 2 11.1174 2.63214 12.2426 3.75736C13.3679 4.88258 14 6.4087 14 8Z"
                        stroke="white"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Icon>
                  <AlertTitle
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight={"normal"}
                  >
                    01:58:17
                  </AlertTitle>
                </HStack>
              </Alert>
            </Box>
            <Box
              borderTop={1}
              borderColor="neutral.color.line.secondary"
              borderStyle={"dashed"}
              w={"full"}
            />
          </HStack> */}
          </VStack>
          <Box mx={"-24px"} px={{ md: "24px", base: 0 }}>
            <Swiper
              modules={[Scrollbar]}
              scrollbar={{
                hide: true,
              }}
              spaceBetween={12}
              slidesOffsetBefore={isDesktop ? 24 : 0}
              slidesPerView={isDesktop ? 3.5 : 8}
              // slidesPerView={useBreakpointValue({ base: 3.5, md: 8 })}
            >
              {promo &&
                promo?.map((item, index) => {
                  const image = item.attributes?.banner?.url;
                  const { id } = item;
                  return (
                    <SwiperSlide key={index}>
                      <LinkBox
                        shadow={"lg"}
                        rounded={"lg"}
                        overflow={"hidden"}
                        position={"relative"}
                        // h={"150px"}
                        style={{ aspectRatio: 103 / 150 }}
                        mt={"42px"}
                        mb={"20px"}
                        onClick={() => {
                          dispatch(detail({ promoDetail: item.attributes }));
                          router.push(`/promo/${item.attributes.code}`);
                        }}
                      >
                        <NextLink passHref href={`#`}>
                          <LinkOverlay>
                            {image ? (
                              <Image
                                objectFit="cover"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                                alt={item}
                                layout={"fill"}
                              />
                            ) : (
                              <Image
                                objectFit="cover"
                                src={`https://imagedummy.com/640x180`}
                                alt={"No image available"}
                                layout={"fill"}
                              />
                            )}
                          </LinkOverlay>
                        </NextLink>
                      </LinkBox>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </Box>
        </Box>
      )}
      {/* PRODUK DAN LAYANAN KAMI */}
      <Box
        as={"section"}
        bg={"neutral.color.bg.secondary"}
        mx={"-24px"}
        px={"24px"}
        py={50}
      >
        <SimpleGrid
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          columns={[1]}
          alignItems="flex-start"
        >
          <VStack
            alignSelf={"center"}
            alignItems={{ base: "center", md: "flex-start" }}
            justifyContent={"space-between"}
          >
            <Heading
              textTransform={"uppercase"}
              color={"brand.blue.600"}
              as={"h3"}
              size={{ base: "md", md: "lg" }}
            >
              Produk dan Layanan Kami
            </Heading>
            <Text
              textAlign={"center"}
              color={"neutral.text.medium"}
              fontSize={{ base: "sm", md: "md" }}
            >
              Rekomendasi pilihan produk dan layanan untuk perjalanan Anda{" "}
            </Text>
          </VStack>
          <Box mt={"25px"} w={"full"}>
            <ProductCategory data={products} />
          </Box>
        </SimpleGrid>
      </Box>
      {/* SUSUN RENCANA PERJALANAN ANDA */}
      <Box
        hidden
        bg={"brand.blue.400"}
        mx={"-24px"}
        px={"24px"}
        as={"section"}
        py={50}
        alignItems="flex-start"
      >
        <SimpleGrid
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <VStack alignSelf={"stretch"} justifyContent={"space-between"}>
            <Heading
              textTransform={"uppercase"}
              as={"h3"}
              textColor={"white"}
              size={{ base: "md", md: "xl" }}
              textAlign={"center"}
            >
              Susun Rencana Perjalanan Anda
            </Heading>
            <Text
              textAlign={"center"}
              color={"white"}
              fontSize={{ base: "sm", md: "md" }}
            >
              Buat rencana perjalanan Tour impian kamu bersama keluarga atau
              teman-teman sekarang juga. Golden Rama akan siap membantu kamu
              untuk mewujudkannya.
            </Text>
          </VStack>
          <Flex justifyContent={"center"} mt={"25px"}>
            <NextLink href={"/tours"} passHref>
              <Button
                maxW={"400px"}
                as={"a"}
                textColor={"brand.blue.400"}
                w={"full"}
                bgColor={"white"}
              >
                Mulai Sekarang
              </Button>
            </NextLink>
          </Flex>
        </SimpleGrid>
      </Box>
      {/* MULAI PERJALANAN ANDA */}
      <Box
        mx={"-24px"}
        as={"section"}
        px={"24px"}
        pt={50}
        alignItems="flex-start"
      >
        <VStack
          alignItems={"flex-start"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <Heading
            textTransform={"uppercase"}
            color={"brand.blue.600"}
            as={"h3"}
            size={{ base: "md", md: "xl" }}
            pb={"12px"}
          >
            Mulai Perjalanan Anda
          </Heading>
        </VStack>
        <SimpleGrid columns={[1, 1, 2]} rowGap="6px" mx="-24px">
          {data.tourHighlights?.map((highlight, index) => (
            <Link
              key={index}
              href={highlight.attributes.url}
              // href={`/tours/country/HU`}
              target="_blank"
              rel="noopener noreferrer canonical"
            >
              <Box position="relative" cursor="pointer" overflow="clip">
                <Box
                  position="relative"
                  w="full"
                  h="414px"
                  transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                  filter="brightness(0.7)"
                  _hover={{
                    transform: "scale(1.05)",
                    filter: "brightness(0.9)",
                  }}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                      highlight.attributes.image.data.attributes.url || ""
                    }`}
                    alt={highlight.attributes.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                >
                  <Heading
                    color={"white"}
                    as={"h3"}
                    size={{ base: "md", md: "xl" }}
                    pb={"12px"}
                  >
                    {highlight.attributes.title}
                  </Heading>
                </Box>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
      {/* INSPIRASI DESTINASI LIBURAN */}
      <Box
        // hidden
        mx={"-24px"}
        as={"section"}
        py={"24px"}
        alignItems="flex-start"
        px={"24px"}
      >
        <VStack
          mx={"auto"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          alignItems={"flex-start"}
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            alignSelf={"stretch"}
            alignItems={"center"}
            columnGap={12}
          >
            <VStack spacing={3} pb={"12px"}>
              <Heading
                textTransform={"uppercase"}
                color={"brand.blue.600"}
                as={"h3"}
                textAlign={{ base: "center", md: "left" }}
                size={{ base: "md", md: "xl" }}
              >
                INSPIRASI DESTINASI LIBURAN
              </Heading>
              <Text
                fontSize={"sm"}
                textAlign={{ base: "center", md: "left" }}
                color={"neutral.text.medium"}
              >
                Pilih Destinasi liburan kamu dari Bulan - bulan Pilihan & Musim
                - musim menarik yang tak terlupakan.
              </Text>
            </VStack>
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing={"20px"}
              w={"100%"}
            >
              <Center
                as={LinkBox}
                position={"relative"}
                rounded={"xl"}
                backgroundColor={"black"}
                minH={"120px"}
                w={"100%"}
                bgSize={"cover"}
                sx={{
                  backgroundImage: "url('/jpg/InMonth.jpg')",
                }}
              >
                <NextLink href="/destinations" passHref>
                  <LinkOverlay fontSize={"xs"} color={"white"}>
                    <Flex
                      position={"absolute"}
                      top={0}
                      right={0}
                      alignSelf={"flex-end"}
                      p={"14px"}
                    >
                      <HStack>
                        <Text>Lihat Tour</Text>
                        <ArrowRightIcon />
                      </HStack>
                    </Flex>
                  </LinkOverlay>
                </NextLink>
                <VStack p={"24px"}>
                  <EventAcceptedIcon />
                  <Heading fontSize={"lg"} color={"white"} fontWeight={"bold"}>
                    Bulan
                  </Heading>
                </VStack>
              </Center>
              <Center
                as={LinkBox}
                position={"relative"}
                rounded={"xl"}
                backgroundColor={"black"}
                minH={"120px"}
                w={"100%"}
                bgSize={"cover"}
                sx={{
                  backgroundImage: "url('/png/InSession.png')",
                }}
              >
                <NextLink href="/destinations?active=musim" passHref>
                  <LinkOverlay fontSize={"xs"} color={"white"}>
                    <Flex
                      position={"absolute"}
                      top={0}
                      right={0}
                      alignSelf={"flex-end"}
                      p={"14px"}
                    >
                      <HStack>
                        <Text>Lihat Tour</Text>
                        <ArrowRightIcon />
                      </HStack>
                    </Flex>
                  </LinkOverlay>
                </NextLink>

                <VStack p={"24px"}>
                  <WeatherCloudIcon />
                  <Heading fontSize={"lg"} color={"white"} fontWeight={"bold"}>
                    Musim
                  </Heading>
                </VStack>
              </Center>
            </SimpleGrid>
          </Stack>
        </VStack>
      </Box>
      {/* LATEST TRAVEL POST */}
      <Box
        mx={"-24px"}
        as={"section"}
        py={"24px"}
        px={"24px"}
        alignItems="flex-start"
      >
        <VStack
          mx={"auto"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          alignItems={"flex-start"}
        >
          <Box
            mx={"-24px"}
            // px={{ md: "24px" }}
            alignSelf={"stretch"}
          >
            <VStack spacing={3} pb={"12px"}>
              <Heading
                textTransform={"uppercase"}
                color={"brand.blue.600"}
                as={"h3"}
                textAlign={"center"}
                size={{ base: "md", md: "xl" }}
              >
                LATEST TRAVEL POST
              </Heading>
            </VStack>
            <Box position="relative" id="travel-post-banner">
              <Swiper
                modules={[FreeMode, Pagination]}
                pagination={{
                  clickable: true,
                }}
                slidesOffsetAfter={24}
                slidesOffsetBefore={24}
                spaceBetween={24}
                slidesPerView={useBreakpointValue(
                  { base: 1.2, md: 2.3, lg: 3.4 },
                  { ssr: false }
                )}
                // slidesPerView={"auto"}
                freeMode={true}
              >
                {articles.data.map((article, index) => (
                  <SwiperSlide key={index}>
                    <Box pb="32px">
                      <NextLink href={`/article/${article.attributes?.slug}`}>
                        <a rel="canonical">
                          <Link
                            as={Stack}
                            w={"100%"}
                            border="1px solid #F2F2F2"
                            rounded="12px"
                          >
                            <Stack
                              h={"120px"}
                              w={"100%"}
                              roundedTop={"xl"}
                              overflow={"hidden"}
                              position={"relative"}
                            >
                              <Image
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${article.attributes.thumbnail.data.attributes.url}`}
                                alt="article"
                                layout="fill"
                                objectFit="cover"
                              />
                            </Stack>
                            <Stack p={"24px"}>
                              <Heading fontSize={"lg"}>
                                {article.attributes.title}
                              </Heading>
                            </Stack>
                          </Link>
                        </a>
                      </NextLink>
                    </Box>
                  </SwiperSlide>
                ))}
                <Box
                  zIndex={1}
                  fontSize={{ base: "sm", md: "md" }}
                  color={"brand.blue.400"}
                  position="absolute"
                  bottom={0}
                  right={0}
                >
                  <NextLink href="/article" passHref>
                    <HStack as={Link}>
                      <Text>Lihat Semua</Text>
                      <ArrowRightIcon />
                    </HStack>
                  </NextLink>
                </Box>
              </Swiper>
            </Box>
          </Box>
        </VStack>
      </Box>
      {/* SUSUN RENCANA PERJALANAN ANDA */}
      <Box
        bg={"brand.blue.400"}
        mx={"-24px"}
        px={"24px"}
        as={"section"}
        py={50}
        alignItems="flex-start"
      >
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <VStack alignItems={"flex-start"}>
            <VStack alignSelf={"stretch"} justifyContent={"space-between"}>
              <Heading
                textTransform={"uppercase"}
                as={"h3"}
                textColor={"white"}
                size={{ base: "md", md: "xl" }}
                textAlign={"center"}
              >
                TEMUKAN INSPIRASI UNTUK MENJELAJAH DUNIA
              </Heading>
              <Text
                textAlign={"center"}
                color={"white"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Masukkan alamat e-mail Anda untuk mendapatkan informasi menarik
                seputar destinasi liburan terbaik serta promo terbaru kami.
              </Text>
            </VStack>
          </VStack>
          <Box mt={"25px"} mx={"auto"}>
            <Formik
              validationSchema={() =>
                Yup.object().shape({
                  email: Yup.string()
                    .email("Harap diisi dengan format email yang benar")
                    .required("Email harap diisi"),
                })
              }
              onSubmit={handleSubmitSubscription}
              initialValues={{ email: "" }}
            >
              <Form>
                <EmailForm />
              </Form>
            </Formik>
          </Box>
        </Box>
      </Box>
      {/* MENGAPA MEMILIH GOLDEN RAMA */}
      <Box
        mx={"-24px"}
        bg={"brand.blue.100"}
        as={"section"}
        py={"24px"}
        alignItems="flex-start"
        px={"24px"}
      >
        <Box
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          alignItems={"flex-start"}
        >
          <Box mx={"-24px"} px={"24px"} alignSelf={"stretch"}>
            <Heading
              textTransform={"uppercase"}
              color={"brand.blue.600"}
              size={{ base: "md", md: "xl" }}
            >
              MENGAPA MEMILIH <br /> GOLDEN RAMA
            </Heading>
            <Swiper
              modules={[Navigation]}
              navigation={useBreakpointValue(
                { base: false, md: true },
                { ssr: false }
              )}
              id="travel-post-banner"
              spaceBetween={24}
              slidesPerView={useBreakpointValue(
                { base: 1.2, md: 1.6, lg: 2.4, xl: 3.6 },
                { ssr: false }
              )}
              slidesOffsetBefore={24}
              slidesOffsetAfter={24}
            >
              {data.whyChooseSection.map((item, index) => (
                <SwiperSlide key={index}>
                  <Box
                    shadow={"lg"}
                    rounded={"lg"}
                    overflow={"hidden"}
                    position={"relative"}
                    maxW={"348px"}
                    style={{ aspectRatio: 1 / 1 }}
                    mt={"42px"}
                    mb={"20px"}
                  >
                    <Image
                      objectFit="cover"
                      src={item.image}
                      alt={item}
                      layout={"fill"}
                      style={{
                        filter: "brightness(0.9)",
                      }}
                    />
                    <Box
                      display="flex"
                      flexDir="column"
                      justifyContent="center"
                      alignItems="center"
                      position="absolute"
                      left={0}
                      right={0}
                      mx="auto"
                      w={"full"}
                      h="full"
                      p={"10px"}
                      borderRadius="md"
                      textAlign="center"
                    >
                      <Text color="white" fontSize="5xl" fontWeight="bold">
                        # {index + 1}
                      </Text>
                      <Text color="white" fontSize="lg" fontWeight="bold">
                        {item.title}
                      </Text>
                      <Text color="white" fontSize="md" fontWeight="normal">
                        {item.description}
                      </Text>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      </Box>
      {/* MITRA MASKAPAI */}
      <Box
        mx={"-24px"}
        bg={"brand.blue.100"}
        as={"section"}
        py={"24px"}
        px={"24px"}
        alignItems="flex-start"
      >
        <VStack alignItems={"flex-start"}>
          <Box alignSelf={"stretch"}>
            <VStack>
              <Heading
                textTransform={"uppercase"}
                as={"h3"}
                color={"brand.blue.600"}
                textAlign={"center"}
                size={{ base: "md", md: "xl" }}
              >
                MITRA MASKAPAI
              </Heading>
            </VStack>
            <AirlinesPartners />
          </Box>
        </VStack>
      </Box>
      {/* GOLDEN RAMA TRAVEL MANAGEMENT */}
      <Box px={"24px"} mx={"-24px"} as={"section"} alignItems="flex-start">
        <Box
          mx={"-24px"}
          alignSelf={"stretch"}
          bg={"no-repeat center"}
          bgSize={"cover"}
          sx={{
            backgroundImage: "url('/png/unsplash_mSESwdMZr-A.png')",
          }}
        >
          <Center h={"150px"}>
            <Stack spacing={1}>
              {/* <Heading
                textAlign={"center"}
                color={"white"}
                fontSize={{ base: "xl", md: "3xl" }}
              >
                GOLDEN RAMA
              </Heading> */}
              <Heading
                textAlign={"center"}
                color={"white"}
                fontSize={{ base: "xl", md: "3xl" }}
              >
                BUSINESS TRAVEL MANAGEMENT
              </Heading>
            </Stack>
          </Center>
        </Box>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <SimpleGrid
            columns={2}
            direction={"row"}
            divider={
              <StackDivider
                // borderWidth={"1px"}
                borderStyle={"dashed"}
                variant={"dashed"}
                color={"neutral.text.low"}
              />
            }
            justifyContent={"center"}
            alignItems={"stretch"}
            columnGap={"19px"}
            py={"24px"}
          >
            <Stack
              borderRightStyle={"dashed"}
              borderRightColor={"neutral.text.low"}
              borderRightWidth={"1px"}
              justifyContent={"space-between"}
              spacing={"24px"}
              pr={5}
            >
              <Stack spacing={"24px"}>
                <Heading
                  fontWeight={"bold"}
                  fontSize={"xl"}
                  color={"brand.blue.400"}
                >
                  Corporate Incentive
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  Lebih dari sekedar pengaturan perjalanan ke luar negeri,
                  Golden Rama memahami bahwa insentif perjalanan wisata (travel
                  incentive) merupakan sebuah event yang harus dirancang dengan
                  kreativitas tingkat tinggi sesuai dengan kultur perusahaan
                  Anda.
                </Text>
              </Stack>
              <NextLink href="/corporate-incentive" passHref>
                <Button
                  as={Link}
                  fontWeight={"normal"}
                  color={"brand.blue.400"}
                  variant={"unstyled"}
                  rightIcon={<ArrowRightIcon />}
                  whiteSpace={"pre-wrap"}
                >
                  Hubungi Kami
                </Button>
              </NextLink>
            </Stack>
            <Stack justifyContent={"space-between"} spacing={"24px"}>
              <Stack spacing={"24px"}>
                <Heading
                  fontWeight={"bold"}
                  fontSize={"xl"}
                  color={"brand.blue.400"}
                >
                  Corporate Travel Management
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  Pengaturan perjalanan dinas ke luar kota dan luar negeri dalam
                  jumlah besar membutuhkan pengalaman, teknologi terkini, serta
                  jaringan yang luas untuk memastikan efisiensi yang maksimal
                  atas biaya yang Anda keluarkan.
                </Text>
              </Stack>
              <NextLink href="http://greet.id/" passHref>
                <Button
                  as={Link}
                  isExternal
                  fontWeight={"normal"}
                  color={"brand.blue.400"}
                  variant={"unstyled"}
                  rightIcon={<ArrowRightIcon />}
                  whiteSpace={"pre-wrap"}
                >
                  Lihat Selengkapnya
                </Button>
              </NextLink>
            </Stack>
          </SimpleGrid>
        </Box>
      </Box>
      {/* APA YANG MENARIK MINAT ANDA */}
      <Box hidden as={"section"} alignItems={"flex-start"}>
        <Stack
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          py={"24px"}
        >
          <Stack>
            <VStack spacing={3} pb={"12px"}>
              <Heading
                textTransform={"uppercase"}
                as={"h3"}
                color={"brand.blue.600"}
                size={{ base: "md", md: "xl" }}
              >
                APA YANG MENARIK MINAT ANDA
              </Heading>
              <Text
                color={"brand.blue.600"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis.
              </Text>
            </VStack>
            <Wrap>
              {data?.interested.map((item, i) => (
                <NextLink key={i} href="/" passHref>
                  <WrapItem
                    as={"a"}
                    display={"flex"}
                    width={"max-content"}
                    px={"16px"}
                    py={"8px"}
                    rounded={"full"}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="normal"
                    bgColor={"neutral.color.bg.secondary"}
                    color={"brand.blue.400"}
                    key={i}
                  >
                    {item}
                  </WrapItem>
                </NextLink>
              ))}
            </Wrap>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}
export const getStaticProps = async () => {
  try {
    const airlinesFolder = "./public/png/homepage/airlines/color";
    const airlineData = fs.readdirSync(airlinesFolder);
    const promo = await getPromoListUsingPage(1, true, false);
    const props = {
      data: {
        banner: await getBanner(),
        promo: promo.data,
        products: await getProductCategoryList(),
        articles: await getArticles({ pageParam: 1 }),
        tourHighlights: await getTourHighlights(),
        interested: [
          "Tour Eropa Barat",
          "Tour Super Hemat",
          "Flight Bali",
          "Labuan Bajo",
          "Tokyo",
          "Weekend Tour",
          "Jakarta Festival",
          "Holiday Tour",
          "Festival Perayaan Jepang",
        ],
        tourTags: [
          {
            name: "All",
          },
          {
            id: 1,
            name: "Amazing",
            image: "amazing.png",
            description:
              "Perjalanan liburan terbaik yang didesain dengan harga terpercaya untuk menghadirkan momen perjalanan yang tak terlupakan.",
          },
          {
            id: 30,
            name: "Super Sale",
            image: "super-sale.png",
            description:
              "Paket perjalanan wisata untuk menciptakan pengalaman bernilai dalam mengunjungi destinasi impian yang dikemas dengan pilihan harga terjangkau.",
          },
          {
            id: 6,
            name: "Favorite",
            image: "favorite.png",
            description:
              "Menghadirkan pengalaman berlibur dengan pilihan program perjalanan terlengkap yang dikemas dengan pelayanan terbaik di kelasnya untuk mewujudkan kesempurnaan perjalanan impian Anda.",
          },
          {
            id: 10,
            name: "Relaxing",
            image: "relaxing.png",
            description:
              "Kemewahan pengalaman berlibur ke beberapa destinasi impian Anda dengan pilihan waktu yang lebih leluasa.",
          },
          {
            id: 45,
            name: "Explore",
            image: "explore.png",
          },
        ],
        whyChooseSection: [
          {
            icon: "/png/homepage/why-choose/kualitas_layanan.png",
            title: "Kualitas Pelayanan",
            description:
              "Kerja keras serta pelayanan dengan sepenuh hati merupakan dedikasi kami untuk memberikan kualitas terbaik bagi Anda.",
            image: "/png/homepage/why-choose/choose-1.png",
          },
          {
            icon: "/png/homepage/why-choose/terbaik.png",
            title: "Terbaik",
            description:
              "Menawarkan produk perjalanan yang lengkap dan terbaik untuk mewujudkan pengalaman perjalanan yang tak terlupakan.",
            image: "/png/homepage/why-choose/choose-2.png",
          },
          {
            icon: "/png/homepage/why-choose/mudah_efisien.png",
            title: "Mudah dan Efisien",
            description:
              "Dengan teknologi yang terintegrasi, kami memberikan akses kemudahan pelayanan perjalanan Anda yang didukung dengan harga efisien.",
            image: "/png/homepage/why-choose/choose-3.png",
          },
          {
            icon: "/png/homepage/why-choose/berpengalaman.png",
            title: "Berpengalaman",
            description:
              "Sejak tahun 1971 Golden Rama selalu ada sebagai mitra dan sahabat Anda menuju destinasi yang luar biasa.",
            image: "/png/homepage/why-choose/choose-4.png",
          },
        ],
        airlines: airlineData,
      },
    };
    return {
      props: {
        ...props,
        meta: {},
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
