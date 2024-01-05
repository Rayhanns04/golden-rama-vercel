import {
  chakra,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  CloseButton,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
  Tag,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { Fragment, useEffect, useRef } from "react";
import NextLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { CustomTags, CustomTagsOutlineIcon } from "../tags";
import WeatherIcon from "../../../public/svg/icons/weather.svg";
import AirlineIcon from "../../../public/svg/icons/airline.svg";
import CruiseIcon from "../../../public/svg/icons/cruise.svg";
import BookmarkIcon from "../../../public/svg/icons/bookmark.svg";
import InfoIcon from "../../../public/svg/icons/info.svg";
import PeopleIcon from "/public/svg/icons/user-multiple.svg";
import ChevronRightIcon from "../../../public/svg/icons/chevron-right.svg";
import AirplaneIcon from "../../../public/svg/icons/airline-outline.svg";
import DateIcon from "../../../public/svg/icons/date.svg";
import UserIcon from "../../../public/svg/icons/user-multiple.svg";
import {
  addDaysWithMonthName,
  convertArrayAirlines,
  convertDateFlightPage,
  convertDateWithMonthName,
  convertRupiah,
  convertTimeFlightPage,
  differenceDate,
  formatSecretCardNumber,
  getClassCode,
  simplifyBodyDetailFlight,
  stringSplit,
  sumPriceFlight,
} from "../../helpers";
import ArrowRightIcon from "../../../public/svg/chevron-right.svg";
import FacebookIcon from "../../../public/svg/footer/icons/facebook.svg";
import TwitterIcon from "../../../public/svg/footer/icons/twitter.svg";
import InstagramIcon from "../../../public/svg/footer/icons/instagram.svg";
import LinkIcon from "../../../public/svg/footer/icons/link.svg";
import NoResultsIcon from "../../../public/svg/noresults.svg";
import NotFoundIcon from "../../../public/svg/notfound.svg";
import UnauthorizedIcon from "../../../public/svg/unauthorized.svg";
import WifiIcon from "../../../public/svg/icons/wifi.svg";
import BreakfastIcon from "../../../public/svg/icons/cutlery.svg";
import PoolIcon from "../../../public/svg/icons/pool.svg";
import AcIcon from "../../../public/svg/icons/hotel/ac.svg";
import ShowerIcon from "../../../public/svg/icons/hotel/shower.svg";
import StarOutlineIcon from "../../../public/svg/icons/star-outline.svg";
import TagsIcon from "../../../public/svg/icons/tags.svg";
import MapPinIcon from "../../../public/svg/icons/map-pin.svg";
import { CustomFilterButton, CustomOrangeFullWidthButton } from "../button";
import { convertToRupiah } from "../../helpers/delimeterRupiah";
import { Swiper, SwiperSlide } from "swiper/react";
import { Field, Form, Formik, useFormikContext } from "formik";
import date from "../../helpers/date";
import { getCountriesFromIsoCode } from "../../services/country.service";
import { useQuery } from "@tanstack/react-query";
import _ from "underscore";
import ChevronFilledDown from "../../../public/svg/icons/chevron-filled-down.svg";
import { getToursV2 } from "../../services/tour.service";
import { CustomDivider } from "../divider";
import { capitalizeFirstLetter } from "../../helpers/capitalizeFirstLetter";
import { useRouter } from "next/router";
import {
  getAttractionsDetailTicket,
  getStateById,
} from "../../services/attraction.service";
import { addDays } from "date-fns";
import { checkoutData } from "../../state/insurance/insurance.slice";
import { getAdditionalCoverage } from "../../services/insurance.service";
import { detail } from "../../state/promo/promo.slice";
import { getHotelDetail } from "../../services/hotel.service";
import { useLoginToast } from "../../hooks";
import { INSURANCE_BENEFITS } from "../../constants/insurance";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const ShareItem = ({ path }) => {
  const url = `https://goldenrama.com${path}`;
  const { hasCopied, onCopy } = useClipboard(url);
  const handleShare = (url) => {
    return window.open(
      url,
      "sharer",
      "toolbar=0,status=0,width=548,height=325"
    );
  };
  return (
    <HStack>
      <Link
        isExternal
        onClick={() =>
          handleShare(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
        }
      >
        <FacebookIcon />
      </Link>
      <Link
        isExternal
        onClick={() =>
          handleShare(`https://www.twitter.com/intent/tweet?text=${url}`)
        }
      >
        <TwitterIcon />
      </Link>
      <Link
        isExternal
        onClick={() => handleShare(`https://www.instagram.com/?url=${url}`)}
      >
        <InstagramIcon />
      </Link>
      <Button
        variant={"unstyled"}
        onClick={onCopy}
        href="https://www.facebook.com/"
      >
        {hasCopied ? "✅" : <LinkIcon />}
      </Button>
    </HStack>
  );
};

export const ErrorPage = ({
  products = null,
  errorCode = 404,
  errorMessage = "Page Not Found",
}) => (
  <Stack
    alignItems={"center"}
    justifyContent={"center"}
    mx={"-24px"}
    minH={"calc(100vh - 80px)"}
    // w={"full"}
  >
    <Box position={"absolute"} zIndex={2} top={{ base: "320px", md: "280px" }}>
      <Heading textAlign={"center"} fontSize={"5xl"}>
        {errorCode}
      </Heading>
      <Heading textAlign={"center"} fontSize={"lg"}>
        {errorMessage}
      </Heading>
    </Box>
    <NotFoundIcon style={{ transform: "scale(.8)" }} />
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      position={"absolute"}
      p={"24px"}
      zIndex={2}
      w={"full"}
      mx={"auto"}
      bottom={0}
    >
      <Box
        // bg={"neutral.color.bg.secondary"}
        // mx={"-24px"}
        // px={"24px"}
        py={50}
        w="full"
        //
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
      <NextLink href={"/"} passHref>
        <CustomOrangeFullWidthButton as={Link} maxW={"400px"}>
          Kembali ke Beranda
        </CustomOrangeFullWidthButton>
      </NextLink>
    </Stack>
  </Stack>
);

export const NoResults = ({ href = "/", hideButton = false }) => (
  <Box position={"relative"}>
    <Stack
      alignItems={"center"}
      // justifyContent={"center"}
      pt={50}
      mx={"24px"}
      minH={"calc(100vh - 250px)"}
      // w={"full"}
      position="relative"
    >
      <Box
        style={{ transform: "scale(.8)" }}
        width={300}
        height={300}
        alt={"Tidak ditemukan"}
      >
        <NoResultsIcon />
      </Box>
      <Heading fontSize={"lg"} textAlign={"center"}>
        Mohon Maaf hasil pencarian Anda tidak di temukan. Yuk coba mencari yang
        lain
      </Heading>
      <Box w={"full"} position={"relative"}>
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          // position={"absolute"}
          p={"24px"}
          zIndex={2}
          w={"full"}
          mx={"auto"}
          bottom={0}
        >
          {!hideButton && (
            <NextLink href={href} passHref>
              <CustomOrangeFullWidthButton m={0} as={Link} maxW={"400px"}>
                Lihat Pencarian
              </CustomOrangeFullWidthButton>
            </NextLink>
          )}
        </Stack>
      </Box>
    </Stack>
  </Box>
);

export const InsuranceItem = ({ item }) => {
  const router = useRouter();
  const { query } = router;
  const dispatch = useDispatch();
  const loginToast = useLoginToast();
  const benefit = INSURANCE_BENEFITS.find(
    (benefit) => benefit.name.toLowerCase() === item.PlanName.toLowerCase()
  );

  function handleSubmit() {
    dispatch(
      checkoutData({
        insuranceDetail: { ...item, ...query },
      })
    );
    router.push("/insurances/order-details");
  }

  return (
    <LinkBox>
      <Stack
        // h={"200px"}
        bg={"white"}
        justifyContent={"space-between"}
        p={"16px"}
        overflow="hidden"
        rounded={"2xl"}
        spacing={"24px"}
        direction={"row"}
      >
        <Stack bg={"white"}>
          <Heading color={"brand.blue.600"} fontSize={"18px"}>
            {item.PlanName}
          </Heading>
          <HStack alignItems="center">
            <Image
              src={"/svg/icons/map-pin.svg"}
              alt={"Date"}
              width={20}
              height={20}
            />
            <Flex gap={"5px"}>
              <Tag
                color="brand.orange.500"
                bg="brand.orange.100"
                size="sm"
                fontSize="xs"
              >
                Asal
              </Tag>
              <Text fontSize="xs" color="neutral.text.medium">
                {query.origins} -
              </Text>
              <Tag
                color="brand.orange.500"
                bg="brand.orange.100"
                size="sm"
                fontSize="xs"
              >
                Tujuan
              </Tag>
              <Text fontSize="xs" color="neutral.text.medium">
                {query.destinations}
              </Text>
            </Flex>
          </HStack>
          <CustomTagsOutlineIcon icon={<PeopleIcon />}>
            {item.TravellerTypeName}
          </CustomTagsOutlineIcon>
          <Text color={"brand.orange.400"} fontSize="md" fontWeight={"bold"}>
            IDR {convertRupiah(item.MainRate)}{" "}
            <Text
              as="span"
              color="neutral.text.low"
              fontWeight={"normal"}
              fontSize="xs"
            >
              per paket
            </Text>
          </Text>
          {benefit && (
            <a href={benefit.url} target="_blank" rel="noopener noreferrer">
              <LinkOverlay fontSize={"xs"} color={"brand.blue.400"}>
                <Flex alignItems={"center"} gap={"4px"}>
                  <Text>Lebih Lanjut Tentang Paket</Text>
                  <ArrowRightIcon />
                </Flex>
              </LinkOverlay>
            </a>
          )}
        </Stack>
        <Stack alignItems={"end"} justifyContent={"flex-end"}>
          <CustomOrangeFullWidthButton
            mt={0}
            onClick={() => loginToast(handleSubmit)}
          >
            Beli
          </CustomOrangeFullWidthButton>
        </Stack>
      </Stack>
    </LinkBox>
  );
};

export const Unauthorized = ({ withAuthButton }) => {
  const router = useRouter();
  return (
    <Box position={"relative"}>
      <Stack
        alignItems={"center"}
        // justifyContent={"center"}
        py={50}
        mx="auto"
        minH={"calc(100vh - 250px)"}
        // w={"full"}
        position="relative"
        textAlign="center"
        maxW="container.md"
      >
        <Box
          style={{ transform: "scale(.8)" }}
          width={300}
          height={300}
          alt={"Unauthorized"}
        >
          <UnauthorizedIcon />
        </Box>
        <Heading fontSize={"lg"} textAlign={"center"}>
          Belum Memiliki Akses
        </Heading>
        <Text>
          Kamu perlu login atau daftar terlebih dahulu untuk mengakses fitur ini
        </Text>
        <Stack hidden={!withAuthButton} spacing="8px" w="full">
          <CustomOrangeFullWidthButton onClick={() => router.push("/auth")}>
            Login
          </CustomOrangeFullWidthButton>
          <CustomOrangeFullWidthButton
            onClick={() => router.push("/auth?type=register")}
            isoutlined
          >
            Register
          </CustomOrangeFullWidthButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export const TourItem = ({ item }) => {
  const { tags, name } = item;
  const departures = item.departures.reduce((prev, item) => (prev = item));
  return (
    <NextLink href={`/tours/${item.slug}`}>
      <a rel="canonical">
        <LinkBox>
          <Stack
            justifyContent={"space-between"}
            h={"full"}
            bg={"white"}
            overflow={"hidden"}
            rounded={"xl"}
            // minH={{ base: 400, md: "auto" }}
          >
            <Box m={0} minH={150} w={"100%"} position={"relative"}>
              <Image
                layout={"fill"}
                objectFit={"cover"}
                alt={name}
                src={
                  (item.pictures && item?.pictures[0]?.url) ??
                  "https://dummyimage.com/350x150"
                }
              />
              <IconButton
                hidden
                zIndex={1}
                right={0}
                color={"whiteAlpha.900"}
                position={"absolute"}
                variant={"unstyled"}
                icon={<BookmarkIcon />}
              />
            </Box>
            <Stack
              flexGrow={1}
              justifyContent={"space-between"}
              p={"16px"}
              spacing={"8px"}
            >
              <Wrap>
                {tags &&
                  tags?.map((item, index) => (
                    <WrapItem key={index}>
                      {item.items &&
                        item.items.map((tag, indexItem) => (
                          <CustomTags key={indexItem} {...item}>
                            {tag.name}
                          </CustomTags>
                        ))}
                    </WrapItem>
                  ))}
              </Wrap>
              <Heading
                color={"neutral.text.high"}
                fontSize={{ base: "md", md: "lg" }}
                maxW={"full"}
                width={"auto"}
                minH={{ base: "auto", md: "60px" }}
                maxH={{ base: "auto", md: "60px" }}
              >
                {name}
              </Heading>
              <HStack spacing={"20px"}>
                {departures.duration && (
                  <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                    {departures.duration} Hari
                  </CustomTagsOutlineIcon>
                )}
                {departures.airlines && departures.airlines.length > 0 && (
                  <CustomTagsOutlineIcon icon={<AirlineIcon />}>
                    {departures.airlines[0].name}
                  </CustomTagsOutlineIcon>
                )}
              </HStack>
              <Stack spacing={0}>
                {item.startingPriceDiscount > 0 && (
                  <Text
                    as={"span"}
                    fontSize={{ base: "sm", md: "md" }}
                    color={"neutral.text.low"}
                    textDecoration={"line-through"}
                  >
                    {`IDR ${convertRupiah(item.startingPriceDiscount) ?? ""}`}
                  </Text>
                )}
                <HStack justifyContent={"space-between"}>
                  <Stack spacing={0}>
                    <Text
                      as={"span"}
                      fontWeight={"normal"}
                      textColor={"neutral.text.low"}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Mulai dari
                    </Text>
                    <Text
                      as={"span"}
                      color={"brand.orange.400"}
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight={"bold"}
                    >
                      {`IDR ${
                        convertRupiah(item.startingPrice) ?? "16.888.000"
                      }`}
                    </Text>
                  </Stack>
                  <Link
                    as="div"
                    fontSize={{ base: "sm", md: "md" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Link>
                </HStack>
              </Stack>
            </Stack>
          </Stack>
        </LinkBox>
      </a>
    </NextLink>
  );
};
export const PackageItem = ({ item }) => {
  const Item = () => (
    <NextLink href={`/packages/${item.slug}`}>
      <a rel="canonical">
        <LinkBox>
          <Stack
            justifyContent={"space-between"}
            h={"full"}
            bg={"white"}
            overflow={"hidden"}
            rounded={"xl"}
          >
            <Box m={0} minH={150} w={"100%"} position={"relative"}>
              <Image
                layout={"fill"}
                objectFit={"cover"}
                alt={
                  (item.pictures &&
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                      item?.pictures[0]?.url) ??
                  "Image fetch failed"
                }
                src={
                  (item.pictures &&
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                      item?.pictures[0]?.url) ??
                  "https://dummyimage.com/350x150"
                }
              />
              <IconButton
                hidden
                zIndex={1}
                right={0}
                color={"whiteAlpha.900"}
                position={"absolute"}
                variant={"unstyled"}
                icon={<BookmarkIcon />}
              />
            </Box>
            <Stack
              flexGrow={1}
              justifyContent={"space-between"}
              p={"16px"}
              spacing={"8px"}
            >
              <Wrap>
                <WrapItem>
                  <CustomTags>{item.category}</CustomTags>
                </WrapItem>
              </Wrap>
              <Heading
                color={"neutral.text.high"}
                fontSize={{ base: "md", md: "lg" }}
                minH={{ base: "auto", md: "60px" }}
                maxH={{ base: "auto", md: "60px" }}
              >
                {item.title}
              </Heading>
              <HStack spacing={"20px"}>
                <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                  {item.duration} Hari
                </CustomTagsOutlineIcon>
                <CustomTagsOutlineIcon icon={<MapPinIcon />}>
                  {item.isDomestic === true ? "Domestik" : "Internasional"}
                </CustomTagsOutlineIcon>
              </HStack>
              <Stack spacing={0}>
                <HStack
                  alignItems={"flex-end"}
                  justifyContent={"space-between"}
                >
                  <Stack spacing={0}>
                    {item.startingPrice ? (
                      <>
                        <Text
                          as={"span"}
                          fontWeight={"normal"}
                          textColor={"neutral.text.low"}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Mulai dari
                        </Text>
                        <Text
                          as={"span"}
                          color={"brand.orange.400"}
                          fontSize={{ base: "md", md: "lg" }}
                          fontWeight={"bold"}
                        >
                          {`IDR ${item.startingPrice?.toLocaleString("id-ID", {
                            maximumFractionDigits: 0,
                          })}`}
                          <chakra.span
                            fontWeight={"normal"}
                            color={"neutral.text.low"}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {" "}
                            per pax
                          </chakra.span>
                        </Text>
                      </>
                    ) : (
                      <Text
                        as={"span"}
                        color={"neutral.text.low"}
                        fontSize={{ base: "md", md: "lg" }}
                        // fontWeight={"bold"}
                      >
                        Tidak Tersedia
                      </Text>
                    )}
                  </Stack>
                  <Link
                    as="div"
                    fontSize={{ base: "sm", md: "md" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Link>
                </HStack>
              </Stack>
            </Stack>
          </Stack>
        </LinkBox>
      </a>
    </NextLink>
  );
  return (
    <>
      <Item />
      {/* <ItemDummy /> */}
    </>
  );
};
export const CruiseItem = ({ item }) => {
  const Item = () => (
    <NextLink href={`/cruises/${item.slug}`}>
      <a rel="canonical">
        <LinkBox>
          <Stack
            justifyContent={"space-between"}
            h={"full"}
            bg={"white"}
            overflow={"hidden"}
            rounded={"xl"}
          >
            <Box m={0} minH={150} w={"100%"} position={"relative"}>
              <Image
                layout={"fill"}
                objectFit={"cover"}
                alt={
                  (item.pictures &&
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                      item?.pictures[0]?.url) ??
                  "Image fetch failed"
                }
                src={
                  (item.pictures &&
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                      item?.pictures[0]?.url) ??
                  "https://dummyimage.com/350x150"
                }
              />
              <IconButton
                hidden
                zIndex={1}
                right={0}
                color={"whiteAlpha.900"}
                position={"absolute"}
                variant={"unstyled"}
                icon={<BookmarkIcon />}
              />
            </Box>
            <Stack
              flexGrow={1}
              justifyContent={"space-between"}
              p={"16px"}
              spacing={"8px"}
            >
              <Wrap>
                <WrapItem>
                  <CustomTags>{item.type}</CustomTags>
                </WrapItem>
              </Wrap>
              <Heading
                color={"neutral.text.high"}
                fontSize={{ base: "md", md: "lg" }}
              >
                {item.title}
              </Heading>
              <HStack spacing={"20px"}>
                <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                  {item.duration} Hari
                </CustomTagsOutlineIcon>
                <CustomTagsOutlineIcon icon={<CruiseIcon />}>
                  {item.ship}
                </CustomTagsOutlineIcon>
              </HStack>
              <Stack spacing={0}>
                {item.startingPriceDiscount && item.startingPriceDiscount > 0 && (
                  <Text
                    as={"span"}
                    fontSize={{ base: "sm", md: "md" }}
                    color={"neutral.text.low"}
                    textDecoration={"line-through"}
                  >
                    {`IDR ${convertRupiah(item.startingPriceDiscount) ?? ""}`}
                  </Text>
                )}
                <HStack justifyContent={"space-between"}>
                  <Stack spacing={0}>
                    <Text
                      as={"span"}
                      fontWeight={"normal"}
                      textColor={"neutral.text.low"}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Mulai dari
                    </Text>
                    <Text
                      as={"span"}
                      color={"brand.orange.400"}
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight={"bold"}
                    >
                      {`IDR ${
                        (item.startingPrice &&
                          parseInt(item.startingPrice).toLocaleString("id-ID", {
                            maximumFractionDate: 0,
                          })) ??
                        "0"
                      }`}
                    </Text>
                  </Stack>
                  <Link
                    as="div"
                    fontSize={{ base: "sm", md: "md" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Link>
                </HStack>
              </Stack>
            </Stack>
          </Stack>
        </LinkBox>
      </a>
    </NextLink>
  );
  return (
    <>
      <Item />
      {/* <ItemDummy /> */}
    </>
  );
};
export const AttractionItem = ({ item }) => {
  const { title } = item;
  const BASE_URL = item.photosUrl;

  return (
    <NextLink href={`/attractions/${item.uuid}`}>
      <a rel="canonical">
        <LinkBox>
          <Stack
            justifyContent={"space-between"}
            h={"full"}
            bg={"white"}
            overflow={"hidden"}
            rounded={"xl"}
          >
            <Box m={0} minH={150} w={"100%"} position={"relative"}>
              {item.photos && (
                <Image
                  layout={"fill"}
                  objectFit={"cover"}
                  alt={
                    BASE_URL + item?.photos[0]?.paths["680x325"] ??
                    "Image fetch failed"
                  }
                  src={ item.photos?.length === 0 ? "https://dummyimage.com/350x150" :
                    BASE_URL + item?.photos[0]?.paths["680x325"]
                  }
                />
              )}
              <IconButton
                hidden
                zIndex={1}
                right={0}
                color={"whiteAlpha.900"}
                position={"absolute"}
                variant={"unstyled"}
                icon={<BookmarkIcon />}
              />
            </Box>
            <Stack
              flexGrow={1}
              justifyContent={"space-between"}
              p={"16px"}
              spacing={"8px"}
            >
              <Heading
                color={"neutral.text.high"}
                fontSize={{ base: "md", md: "lg" }}
                minH={{ base: "auto", md: "55px" }}
                maxH={{ base: "auto", md: "55px" }}
              >
                {title}
              </Heading>
              <HStack spacing={"20px"}>
                {/* <CustomTagsOutlineIcon icon={<StarOutlineIcon />}>
              {item?.reviewAverageScore
                ? `Rating ${item?.reviewAverageScore}`
                : "No Rating"}
            </CustomTagsOutlineIcon> */}
                <CustomTagsOutlineIcon icon={<TagsIcon />}>
                  {item.categories[0]?.name ?? "-"}
                </CustomTagsOutlineIcon>
              </HStack>
              <Stack spacing={0}>
                {item.startingPriceDiscount > 0 && (
                  <Text
                    as={"span"}
                    fontSize={{ base: "sm", md: "md" }}
                    color={"neutral.text.low"}
                    textDecoration={"line-through"}
                  >
                    {`IDR ${convertRupiah(item.startingPriceDiscount) ?? ""}`}
                  </Text>
                )}
                <HStack justifyContent={"space-between"}>
                  <Stack spacing={0}>
                    <Text
                      as={"span"}
                      fontWeight={"normal"}
                      textColor={"neutral.text.low"}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Mulai dari
                    </Text>
                    <Text
                      as={"span"}
                      color={"brand.orange.400"}
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight={"bold"}
                    >
                      {item.basePrice
                        ? `IDR ${
                            convertRupiah(item.basePrice.toFixed()) ??
                            "16.888.000"
                          }`
                        : "Free"}
                    </Text>
                  </Stack>
                  <Link
                    as="div"
                    fontSize={{ base: "sm", md: "md" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Link>
                </HStack>
              </Stack>
            </Stack>
          </Stack>
        </LinkBox>
      </a>
    </NextLink>
  );
};

export const TourListItem = ({ query }) => {
  const { data, isLoading } = query;
  const CardSkeleton = () => {
    return (
      <Stack bg={"white"} overflow={"hidden"} rounded={"xl"}>
        <Skeleton isLoaded={!isLoading}>
          <Box m={0} minH={150} w={"100%"} position={"relative"} />
        </Skeleton>
        <Stack p={"16px"} spacing={"8px"}>
          <Wrap>
            <WrapItem>
              <Skeleton isLoaded={!isLoading}>
                <CustomTags />
                <CustomTags />
              </Skeleton>
            </WrapItem>
          </Wrap>
          <Skeleton isLoaded={!isLoading}>
            <Heading
              color={"neutral.text.high"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Title
            </Heading>
          </Skeleton>
          <HStack spacing={"20px"}>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                Weather
              </CustomTagsOutlineIcon>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<AirlineIcon />}>
                Airlines
              </CustomTagsOutlineIcon>
            </Skeleton>
          </HStack>
          <Stack spacing={0}>
            <HStack justifyContent={"space-between"}>
              <Stack spacing={0}>
                <Skeleton isLoaded={!isLoading}>
                  <Text
                    as={"span"}
                    color={"brand.orange.400"}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight={"bold"}
                  >
                    {`Mulai dari IDR 16.000.000`}
                  </Text>
                </Skeleton>
              </Stack>
              <Skeleton isLoaded={!isLoading}>
                <NextLink href={`#`} passHref>
                  <Flex
                    fontSize={{ base: "xs", md: "sm" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Flex>
                </NextLink>
              </Skeleton>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    );
  };
  return !isLoading ? (
    <>
      {data?.pages.map((item, index) => (
        <>
          {item.length !== 0 ? (
            <SimpleGrid key={index} columns={{ md: 2, lg: 3 }} spacing={"16px"}>
              {item.map((item, index) => (
                <TourItem item={item} key={index} />
              ))}
            </SimpleGrid>
          ) : (
            // <Portal>
            <NoResults href="/tours" />
            // </Portal>
          )}
        </>
      ))}
    </>
  ) : (
    <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={"16px"}>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </SimpleGrid>
  );
};
export const PackageListItem = ({ query }) => {
  const { data, isLoading, isError } = query;
  const CardSkeleton = () => {
    return (
      <Stack bg={"white"} overflow={"hidden"} rounded={"xl"}>
        <Skeleton isLoaded={!isLoading}>
          <Box m={0} minH={150} w={"100%"} position={"relative"} />
        </Skeleton>
        <Stack p={"16px"} spacing={"8px"}>
          <Wrap>
            <WrapItem>
              <Skeleton isLoaded={!isLoading}>
                <CustomTags />
                <CustomTags />
              </Skeleton>
            </WrapItem>
          </Wrap>
          <Skeleton isLoaded={!isLoading}>
            <Heading
              color={"neutral.text.high"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Title
            </Heading>
          </Skeleton>
          <HStack spacing={"20px"}>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                Weather
              </CustomTagsOutlineIcon>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<AirlineIcon />}>
                Airlines
              </CustomTagsOutlineIcon>
            </Skeleton>
          </HStack>
          <Stack spacing={0}>
            <HStack justifyContent={"space-between"}>
              <Stack spacing={0}>
                <Skeleton isLoaded={!isLoading}>
                  <Text
                    as={"span"}
                    fontWeight={"normal"}
                    textColor={"neutral.text.low"}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Mulai dari
                  </Text>
                  <Text
                    as={"span"}
                    color={"brand.orange.400"}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight={"bold"}
                  >
                    {`IDR 16.000.000`}
                  </Text>
                </Skeleton>
              </Stack>
              <Skeleton isLoaded={!isLoading}>
                <NextLink href={`#`} passHref>
                  <Flex
                    fontSize={{ base: "xs", md: "sm" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Flex>
                </NextLink>
              </Skeleton>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    );
  };
  return isLoading ? (
    <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={"16px"}>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </SimpleGrid>
  ) : isError ? (
    <NoResults />
  ) : (
    <>
      {data?.pages.map((item, index) => (
        <>
          {item.data.length !== 0 ? (
            <SimpleGrid key={index} columns={{ md: 2, lg: 3 }} spacing={"16px"}>
              {item.data.map((item, index) => (
                <PackageItem item={item} key={index} />
              ))}
            </SimpleGrid>
          ) : (
            // <Portal>
            <NoResults href="/packages" />
            // </Portal>
          )}
        </>
      ))}
    </>
  );
};
export const CruiseListItem = ({ query }) => {
  const { data, isLoading } = query;
  const CardSkeleton = () => {
    return (
      <Stack bg={"white"} overflow={"hidden"} rounded={"xl"}>
        <Skeleton isLoaded={!isLoading}>
          <Box m={0} minH={150} w={"100%"} position={"relative"} />
        </Skeleton>
        <Stack p={"16px"} spacing={"8px"}>
          <Wrap>
            <WrapItem>
              <Skeleton isLoaded={!isLoading}>
                <CustomTags />
                <CustomTags />
              </Skeleton>
            </WrapItem>
          </Wrap>
          <Skeleton isLoaded={!isLoading}>
            <Heading
              color={"neutral.text.high"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Title
            </Heading>
          </Skeleton>
          <HStack spacing={"20px"}>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                Weather
              </CustomTagsOutlineIcon>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<AirlineIcon />}>
                Airlines
              </CustomTagsOutlineIcon>
            </Skeleton>
          </HStack>
          <Stack spacing={0}>
            <HStack justifyContent={"space-between"}>
              <Stack spacing={0}>
                <Skeleton isLoaded={!isLoading}>
                  <Text
                    as={"span"}
                    fontWeight={"normal"}
                    textColor={"neutral.text.low"}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Mulai dari
                  </Text>
                  <Text
                    as={"span"}
                    color={"brand.orange.400"}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight={"bold"}
                  >
                    {`IDR 16.000.00`}
                  </Text>
                </Skeleton>
              </Stack>
              <Skeleton isLoaded={!isLoading}>
                <NextLink href={`#`}>
                  <Flex
                    fontSize={{ base: "xs", md: "sm" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Flex>
                </NextLink>
              </Skeleton>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    );
  };
  return !isLoading ? (
    <>
      {data?.pages.map((item, index) => (
        <Fragment key={index}>
          {item.data.length !== 0 ? (
            <SimpleGrid key={index} columns={{ md: 2, lg: 3 }} spacing={"16px"}>
              {item.data.map((item, index) => (
                <CruiseItem item={item} key={index} />
              ))}
            </SimpleGrid>
          ) : (
            // <Portal>
            <NoResults href="/cruises" />
            // </Portal>
          )}
        </Fragment>
      ))}
    </>
  ) : (
    <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={"16px"}>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </SimpleGrid>
  );
};

export const InsuranceProtectionsList = ({ detail_prices, ...props }) => {
  const router = useRouter();
  const { insuranceDetail } = useSelector((state) => state.insuranceReducer);
  const additionalCoverage = useQuery(["getAdditionalCoverage", props], () =>
  getAdditionalCoverage(insuranceDetail)
  );
  
  const dataResult = additionalCoverage?.data
  let dataAdditionalCoverage = {};

  if(dataResult){
    const newData = dataResult?.data?.map((item) => {
      const correspondingCoverage = dataResult?.priceOverview?.UsingCoverages.find(
        (coverage) => coverage.Name === item?.Name
      );
    
      return {
        ...item,
        MainRate: correspondingCoverage ? correspondingCoverage?.Premium : 0,
      };
    });
    
    // const result = {
    //   data: newData,
    //   priceOverview: {
    //     ...dataResult.priceOverview,
    //   },
    // };

    dataAdditionalCoverage = {
      data: newData
    }
  }

  const dispatch = useDispatch();
  function handleSubmit(values, action) {
    dispatch(
      checkoutData({
        insuranceDetail: {
          ...insuranceDetail,
          additionalCoverage: dataAdditionalCoverage.data.filter((value) => {
            return values.CoverageIDs.includes(value.ID.toString());
          }),
        },
      })
    );
    router.replace("/insurances/order-details", undefined, { shallow: true });
  }
  
  const SelectionButton = ({ title, children, ...props }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const formik = useFormikContext();
    return (
      <>
        <CustomFilterButton
          notrounded
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          onSubmit={async () => await formik.submitForm()}
          title={title ?? "Rencana Perjalanan"}
        >
          {children}
        </CustomFilterButton>
        <Button
          onClick={onOpen}
          variant={"link"}
          colorScheme="brand.blue"
          fontSize={"sm"}
        >
          Pilih
        </Button>
      </>
    );
  };

  return (
    <Formik
      initialValues={{
        CoverageIDs:
          insuranceDetail.dataAdditionalCoverage?.map((item) => {
            return item.ID.toString();
          }) ?? [],
      }}

      onSubmit={handleSubmit}
    >
      <Form>
        <Stack spacing={"24px"}>
          <Divider variant={"dashed"} py={"24px"} />
          <Flex justify={"space-between"}>
            <Stack spacing={0}>
              <Text color="neutral.text.high" fontWeight={"bold"} fontSize="sm">
                Pilih Cakupan Tambahan
              </Text>
              <Text fontSize={"sm"} color="neutral.text.low">
                Opsional, tambahkan yang diperlukan
              </Text>
            </Stack>
            <SelectionButton title={"Cakupan Tambahan"}>
              <Stack m={"-24px"} p={"24px"} spacing="24px" bg="brand.blue.100">
                <>
                  {dataAdditionalCoverage?.data
                      // ?.filter((item) => item.Name.replace(/\s/g, '') != "ProteksiCovid-19/Covid-19Protection")
                      ?.map((item, index) => (
                    <Stack
                      spacing={"12px"}
                      key={index}
                      bg={"white"}
                      rounded="xl"
                      p={"16px"}
                    >
                      <Stack>
                        <Text
                          fontSize={"md"}
                          color={"neutral.text.high"}
                          fontWeight="bold"
                        >
                          {item.Name}
                        </Text>
                        <Text fontSize={"sm"}>{item.Description}</Text>
                      </Stack>
                      <Divider variant={"dashed"} />
                      <Field type="checkbox" name="CoverageIDs">
                        {({ field, form }) => (
                          <Checkbox
                            {...field}
                            isChecked={form.values[field.name].includes(
                              item.ID.toString()
                            )}
                            value={item.ID}
                            mt={"12px"}
                            spacing={0}
                            // {...field}
                            alignItems={"start"}
                            size={"md"}
                            // isChecked={form.values.reschedule}
                            colorScheme="brand.blue"
                            w="full"
                            flexDir={"row-reverse"}
                          >
                            <Box justifyContent="space-between">
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                color="brand.orange.400"
                                fontWeight={"bold"}
                              >
                                IDR{" "}
                                {item.MainRate.toLocaleString("id-ID", {
                                  maximumFractionDigits: 0,
                                })} {item.Name === "Proteksi Covid-19/Covid- 19 Protection" ? "" : ""}
                              </Text>
                            </Box>
                          </Checkbox>
                        )}
                      </Field>
                    </Stack>
                  ))}
                </>
              </Stack>
            </SelectionButton>
          </Flex>
        </Stack>
      </Form>
    </Formik>
  );
};

export const InsuranceListItem = ({ query }) => {
  const router = useRouter();
  const myQuery = router.query;
  const { data, isLoading, isError } = query;
  const CardSkeleton = () => {
    return (
      <Stack
        // h={"200px"}
        bg={"white"}
        justifyContent={"space-between"}
        p={"16px"}
        overflow="hidden"
        rounded={"2xl"}
        spacing={"24px"}
        direction={"row"}
      >
        <Stack bg={"white"}>
          <Skeleton isLoaded={!isLoading}>
            <Heading color={"brand.blue.600"} fontSize={"18px"}>
              ASEAN
            </Heading>
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/map-pin.svg"}
                alt={"Date"}
                width={20}
                height={20}
              />
              <Flex gap={"5px"}>
                <Tag
                  color="brand.orange.500"
                  bg="brand.orange.100"
                  size="sm"
                  fontSize="xs"
                >
                  Asal
                </Tag>
                <Text fontSize="xs" color="neutral.text.medium">
                  Jakarta -
                </Text>
                <Tag
                  color="brand.orange.500"
                  bg="brand.orange.100"
                  size="sm"
                  fontSize="xs"
                >
                  Tujuan
                </Tag>
                <Text fontSize="xs" color="neutral.text.medium">
                  Malaysia
                </Text>
              </Flex>
            </HStack>
          </Skeleton>
          <CustomTagsOutlineIcon isLoading={isLoading} icon={<PeopleIcon />}>
            Individual
          </CustomTagsOutlineIcon>
          <Skeleton isLoaded={!isLoading}>
            <Text color={"brand.orange.400"} fontSize="md" fontWeight={"bold"}>
              IDR {convertRupiah(180000)}{" "}
              <Text
                as="span"
                color="neutral.text.low"
                fontWeight={"normal"}
                fontSize="xs"
              >
                per paket
              </Text>
            </Text>
          </Skeleton>
        </Stack>
        <Stack alignItems={"end"} justifyContent={"flex-end"}>
          <Skeleton isLoaded={!isLoading}>
            <CustomOrangeFullWidthButton mt={0}>
              Beli
            </CustomOrangeFullWidthButton>
          </Skeleton>
        </Stack>
      </Stack>
    );
  };
  return (
    <>
      {data?.length > 0 ? (
        data?.map((item, index) => <InsuranceItem key={index} item={item} />)
      ) : isLoading ? (
        <>
          <SimpleGrid columns={[1, 2, 3]} spacing={"16px"}>
            {Array.from({ length: 3 }).map((item, index) => (
              <CardSkeleton key={index} item={item} />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <NoResults href="/insurances" />
      )}
    </>
  );
};

export const AttractionListItem = ({ query }) => {
  const { data, isLoading } = query;
  const CardSkeleton = () => {
    return (
      <Stack bg={"white"} overflow={"hidden"} rounded={"xl"}>
        <Skeleton isLoaded={!isLoading}>
          <Box m={0} minH={150} w={"100%"} position={"relative"} />
        </Skeleton>
        <Stack p={"16px"} spacing={"8px"}>
          <Wrap>
            <WrapItem>
              <Skeleton isLoaded={!isLoading}>
                <CustomTags />
                <CustomTags />
              </Skeleton>
            </WrapItem>
          </Wrap>
          <Skeleton isLoaded={!isLoading}>
            <Heading
              color={"neutral.text.high"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Title
            </Heading>
          </Skeleton>
          <HStack spacing={"20px"}>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                Weather
              </CustomTagsOutlineIcon>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<AirlineIcon />}>
                Airlines
              </CustomTagsOutlineIcon>
            </Skeleton>
          </HStack>
          <Stack spacing={0}>
            <HStack justifyContent={"space-between"}>
              <Stack spacing={0}>
                <Skeleton isLoaded={!isLoading}>
                  <Text
                    as={"span"}
                    fontWeight={"normal"}
                    textColor={"neutral.text.low"}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Mulai dari
                  </Text>
                  <Text
                    as={"span"}
                    color={"brand.orange.400"}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight={"bold"}
                  >
                    {`IDR 16.000.000`}
                  </Text>
                </Skeleton>
              </Stack>
              <Skeleton isLoaded={!isLoading}>
                <NextLink href={`#`} passHref>
                  <Flex
                    fontSize={{ base: "xs", md: "sm" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Flex>
                </NextLink>
              </Skeleton>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    );
  };
  return !isLoading ? (
    <>
      {data?.pages.map((item, index) => (
        <>
          {item.data.length !== 0 ? (
            <SimpleGrid key={index} columns={[1, 2, 3]} spacing={"16px"}>
              {item.data.map((item, index) => (
                <AttractionItem item={item} key={index} />
              ))}
            </SimpleGrid>
          ) : (
            // <Portal>
            <NoResults href="/attractions" />
            // </Portal>
          )}
        </>
      ))}
    </>
  ) : (
    <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={"16px"}>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </SimpleGrid>
  );
};
export const TourListMonthAhead = ({ area, period }) => {
  const TourList = ({ item }) => {
    const query = useQuery(["getAllToursByMonth", item.slug], async () => {
      const response = await Promise.all(
        period.map(async (date) => {
          try {
            const filter = {
              groupSlugIn: item.slug,
              minPrice: 0,
              maxPrice: 999999999,
              minDepartureDate: date,
            };
            const response = await getToursV2(filter);
            return Promise.resolve(response);
          } catch (error) {
            console.error(error);

            return Promise.reject(error);
          }
        })
      );
      return Promise.resolve(...response);
    });
    const noData = !(query.data?.length !== 0);
    // if (tours.data && tours.data.pages[0].length !== 0)
    if (item?.name != "-") {
      return (
        <AccordionItem
          // hidden={noData}
          mx={{ base: "-24px", md: "auto" }}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          border="none"
        >
          <AccordionButton
            disabled={query.isLoading}
            py={{ base: "24px", md: "12px" }}
          >
            <Stack w="full">
              <Skeleton isLoaded={!query.isLoading}>
                <Heading
                  as={"h3"}
                  flex="1"
                  fontSize={20}
                  fontWeight="semibold"
                  textAlign="left"
                  textTransform={"uppercase"}
                >
                  {item.name}
                </Heading>
              </Skeleton>
              <Stack w="fit-content">
                <Skeleton isLoaded={!query.isLoading}>
                  <Text
                    hidden={query.data?.length === 0}
                    color="brand.orange.400"
                    fontSize={"sm"}
                  >
                    {`IDR 
                  ${String(
                    _.min(query.data, (item) => {
                      return item.startingPrice;
                    }).startingPrice
                  ).slice(0, 2)}
                  ${
                    query.data?.length > 1
                      ? " - " +
                        String(
                          _.max(query.data, (item) => {
                            return item.startingPrice;
                          }).startingPrice
                        ).slice(0, 2)
                      : ""
                  } juta`}
                  </Text>
                </Skeleton>
              </Stack>
            </Stack>
            <AccordionIcon />
          </AccordionButton>
          <Stack gap="16px" as={AccordionPanel} bg="brand.blue.100" p={"24px"}>
            {!noData ? (
              <>
                <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={"16px"}>
                  {query.data?.map((item, index) => (
                    <TourItem item={item} key={index} />
                  ))}
                </SimpleGrid>
                <Center>
                  <Button
                    hidden
                    color={"brand.blue.400"}
                    colorScheme={"brand.blue"}
                    fontWeight={"normal"}
                    variant={"unstyled"}
                    display={"flex"}
                    alignItems={"center"}
                    rightIcon={<ChevronFilledDown />}
                  >
                    Lihat Semua
                  </Button>
                </Center>
              </>
            ) : (
              <NoResults hideButton />
            )}
          </Stack>
        </AccordionItem>
      );
    }
  };

  if (area) {
    return (
      <Accordion allowToggle>
        {area.map((item, index) => (
          <TourList item={item} index={index} key={index} />
        ))}
      </Accordion>
    );
  } else return <NoResults />;
};

export const HotelListItem = ({ query, differenceDate = 1 }) => {
  // console.log(query);\
  const router = useRouter();
  const querys = router.query;
  const { data, isLoading } = query;
  const urlImg = process.env.NEXT_PUBLIC_URL_IMAGES;
  const Item = ({ item }) => {
    const { name, address, city, postalCode, facilities } = item.detail;
    let checkFacilities = [
      { name: "wifi", value: false },
      { name: "breakfast", value: false },
      { name: "pool", value: false },
      { name: "ac", value: false },
      { name: "shower", value: false },
    ];
    facilities?.map((facility) => {
      if (
        (facility.facilityCode === 550 && facility.facilityGroupCode === 70) ||
        (facility.facilityCode === 100 && facility.facilityGroupCode === 60) ||
        (facility.facilityCode === 261 && facility.facilityGroupCode === 60)
      ) {
        checkFacilities[0].value = true;
      }
      if (facility.facilityCode === 363 && facility.facilityGroupCode === 73) {
        checkFacilities[1].value = true;
      }
      if (
        (facility.facilityCode === 40 && facility.facilityGroupCode === 80) ||
        (facility.facilityCode === 360 && facility.facilityGroupCode === 20)
      ) {
        checkFacilities[2].value = true;
      }
      if (
        (facility.facilityCode === 170 && facility.facilityGroupCode === 60) ||
        (facility.facilityCode === 180 && facility.facilityGroupCode === 60) ||
        (facility.facilityCode === 10 && facility.facilityGroupCode === 70)
      ) {
        checkFacilities[3].value = true;
      }
      if (facility.facilityCode === 20 && facility.facilityGroupCode === 60) {
        checkFacilities[4].value = true;
      }
    });
    //check bb for breakfast from broadCode
    if (checkFacilities[1].value === false) {
      item.rooms?.map((room) => {
        room.rates = room.rates.filter((rate) => rate.boardCode === "BB");
        return (checkFacilities[1].value =
          room.rates.length > 0 ? true : false);
      });
    }
    let imageUrl;
    for (let i = 0; i < item.detail?.images?.length; i++) {
      if (item.detail?.images[i].imageTypeCode === "GEN") {
        imageUrl = item.detail?.images[i].path;
        break;
      }
    }
    return (
      // <div className="tex">{`${url}${item?.detail?.images[0]?.path}`}</div>
      <LinkBox>
        <NextLink
          href={{
            pathname: `/hotels/${item.slug}`,
            query: {
              checkin_date: querys.checkin_date,
              checkout_date: querys.checkout_date,
              rooms: querys.rooms,
              adult: querys.adult,
              children: querys.children,
              children_ages: querys.children_ages,
            },
          }}
          target="_blank"
          // rel="noopener noreferrer"
          passHref
        >
          <a target="_blank" rel="canonical">
            <Stack
              justifyContent={"space-between"}
              h={"full"}
              bg={"white"}
              overflow={"hidden"}
              rounded={"xl"}
            >
              <Box m={0} minH={150} w={"100%"} position={"relative"}>
                {item?.detail?.images ? (
                  <Image
                    layout={"fill"}
                    objectFit={"cover"}
                    alt={
                      item.detail?.images?.[0]?.type?.description?.content ??
                      "no image"
                    }
                    src={`${urlImg}/original/${imageUrl}`}
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src = "/png/300.png";
                    // }}
                  />
                ) : (
                  <Image
                    layout={"fill"}
                    objectFit={"cover"}
                    alt={"Image fetch failed"}
                    src={
                      "https://dummyimage.com/350x150.gif?text=Gambar%20tidak%20tersedia"
                    }
                  />
                )}
                <IconButton
                  hidden
                  zIndex={1}
                  right={0}
                  color={"whiteAlpha.900"}
                  position={"absolute"}
                  variant={"unstyled"}
                  icon={<BookmarkIcon />}
                />
              </Box>
              <Stack
                flexGrow={1}
                justifyContent={"space-between"}
                p={"16px"}
                spacing={"8px"}
              >
                <Heading
                  color={"neutral.text.high"}
                  fontSize={{ base: "md", md: "lg" }}
                >
                  {name}
                </Heading>
                {/* TODO: Address Hotel */}
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  {`${address} ${postalCode ? postalCode : ""}` ??
                    "Tidak ada alamat"}
                </Text>
                <Flex gap="4">
                  {checkFacilities[0].value && (
                    <CustomTagsOutlineIcon icon={<WifiIcon />}>
                      Free Wifi
                    </CustomTagsOutlineIcon>
                  )}
                  {checkFacilities[1].value && (
                    <CustomTagsOutlineIcon icon={<BreakfastIcon />}>
                      Sarapan
                    </CustomTagsOutlineIcon>
                  )}
                  {checkFacilities[4].value && !checkFacilities[1].value && (
                    <CustomTagsOutlineIcon icon={<ShowerIcon />}>
                      Shower
                    </CustomTagsOutlineIcon>
                  )}
                  {checkFacilities[2].value && (
                    <CustomTagsOutlineIcon icon={<PoolIcon />}>
                      Kolam Renang
                    </CustomTagsOutlineIcon>
                  )}
                  {!checkFacilities[2].value && checkFacilities[3].value && (
                    <CustomTagsOutlineIcon icon={<AcIcon />}>
                      AC
                    </CustomTagsOutlineIcon>
                  )}
                </Flex>
                <Divider variant={"dashed"} />
                <Stack spacing={0}>
                  <HStack alignItems="end" justifyContent={"space-between"}>
                    <Stack spacing={0}>
                      {item.isDiscount ? (
                        <Flex alignItems={"center"} gap="4px">
                          <CustomTags variant={"danger"}>Discount</CustomTags>
                          <Text
                            textDecoration={"line-through"}
                            color="neutral.text.low"
                            fontSize={"xs"}
                          >
                            {typeof item.beforeDiscount !== "number"
                              ? `IDR ${convertRupiah(
                                  item.beforeDiscount.split(".")[0]
                                )}`
                              : `IDR ${convertRupiah(item.beforeDiscount)}`}
                          </Text>
                        </Flex>
                      ) : (
                        <></>
                      )}
                      {item.minRate ? (
                        <Text
                          as={"span"}
                          color={"brand.orange.400"}
                          fontSize={{ base: "md", md: "lg" }}
                          fontWeight={"bold"}
                        >
                          {typeof item.minRate !== "number"
                            ? `IDR ${convertRupiah(item.minRate.split(".")[0])}`
                            : `IDR ${convertRupiah(item.minRate)}`}{" "}
                          <chakra.span
                            fontWeight={"normal"}
                            color={"neutral.text.low"}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {" "}
                            Untuk {differenceDate} malam
                          </chakra.span>
                        </Text>
                      ) : (
                        <Text
                          as={"span"}
                          color={"brand.orange.400"}
                          fontSize={{ base: "md", md: "lg" }}
                          fontWeight={"bold"}
                        >
                          KAMAR HABIS
                        </Text>
                      )}
                    </Stack>

                    <LinkOverlay
                      fontSize={{ base: "sm", md: "md" }}
                      alignContent={"center"}
                      color={"brand.blue.400"}
                    >
                      Lihat Detail
                      {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                      <Icon
                        ml={"10px"}
                        fill="none"
                        width="16px"
                        height="16px"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                          fill="#41778A"
                        />
                      </Icon>
                    </LinkOverlay>
                  </HStack>
                </Stack>
              </Stack>
            </Stack>
          </a>
        </NextLink>
      </LinkBox>
    );
  };
  const CardSkeleton = () => {
    return (
      <Stack bg={"white"} overflow={"hidden"} rounded={"xl"}>
        <Skeleton isLoaded={!isLoading}>
          <Box m={0} minH={150} w={"100%"} position={"relative"} />
        </Skeleton>
        <Stack p={"16px"} spacing={"8px"}>
          <Wrap>
            <WrapItem>
              <Skeleton isLoaded={!isLoading}>
                <CustomTags />
                <CustomTags />
              </Skeleton>
            </WrapItem>
          </Wrap>
          <Skeleton isLoaded={!isLoading}>
            <Heading
              color={"neutral.text.high"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Title
            </Heading>
          </Skeleton>
          <HStack spacing={"20px"}>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<WeatherIcon />}>
                Weather
              </CustomTagsOutlineIcon>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <CustomTagsOutlineIcon icon={<AirlineIcon />}>
                Airlines
              </CustomTagsOutlineIcon>
            </Skeleton>
          </HStack>
          <Stack spacing={0}>
            <HStack justifyContent={"space-between"}>
              <Stack spacing={0}>
                <Skeleton isLoaded={!isLoading}>
                  <Text
                    as={"span"}
                    fontWeight={"normal"}
                    textColor={"neutral.text.low"}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Mulai dari
                  </Text>
                  <Text
                    as={"span"}
                    color={"brand.orange.400"}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight={"bold"}
                  >
                    {`IDR 16.000.000`}
                  </Text>
                </Skeleton>
              </Stack>
              <Skeleton isLoaded={!isLoading}>
                <NextLink href={`#`}>
                  <Flex
                    as="a"
                    fontSize={{ base: "xs", md: "sm" }}
                    alignContent={"center"}
                    color={"brand.blue.400"}
                  >
                    Lihat Detail
                    {/* <Icon width="16" height="16" viewBox="0 0 16 16"> */}
                    <Icon
                      ml={"10px"}
                      fill="none"
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                        fill="#41778A"
                      />
                    </Icon>
                  </Flex>
                </NextLink>
              </Skeleton>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    );
  };
  return !isLoading ? (
    <>
      {data?.pages?.map((item, index) => (
        <>
          {item.length !== 0 && item.hotels.length > 0 ? (
            <SimpleGrid key={index} columns={{ md: 2, lg: 3 }} spacing={"16px"}>
              {item?.hotels.map((item, index) => (
                <Item item={item} key={index} />
              ))}
            </SimpleGrid>
          ) : (
            // <Portal>
            <NoResults href="/hotels" />
            // </Portal>
          )}
        </>
      ))}
    </>
  ) : (
    <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={"16px"}>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </SimpleGrid>
  );
};

export const ProductCategory = ({ query = null, data = null }) => {
  const Item = ({ item }) => {
    const image = item.attributes?.banner?.data?.attributes?.url;
    return (
      <LinkBox>
        <NextLink href={item.attributes.url ?? "#"}>
          <a rel="canonical">
            <Box
              overflow={"hidden"}
              rounded={"xl"}
              position={"relative"}
              cursor="pointer"
            >
              <LinkOverlay>
                <Box minH="100px">
                  <Image
                    objectFit="cover"
                    layout="fill"
                    src={
                      image
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`
                        : "https://dummyimage.com/360x120"
                    }
                    alt={item.attributes.name}
                    priority
                    style={{
                      filter: "brightness(0.7)",
                    }}
                  />{" "}
                </Box>
                <Flex justifyContent={"center"}>
                  <Heading
                    display="flex"
                    justifyContent={"center"}
                    alignItems={"center"}
                    color={"white"}
                    position={"absolute"}
                    inset={0}
                    fontSize={{ base: "md", md: "lg" }}
                    textAlign={"center"}
                  >
                    {item.attributes.name}
                  </Heading>
                </Flex>
              </LinkOverlay>
            </Box>
          </a>
        </NextLink>
      </LinkBox>
    );
  };
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={"16px"}>
      {query !== null ? (
        !query.isLoading ? (
          <>
            {query.data?.map((item, index) => {
              return <Item key={index} item={item} />;
            })}
            Hore
          </>
        ) : (
          <>
            <Skeleton h={"75px"} rounded={"lg"} />
            <Skeleton h={"75px"} rounded={"lg"} />
            <Skeleton h={"75px"} rounded={"lg"} />
            <Skeleton h={"75px"} rounded={"lg"} />
            <Skeleton h={"75px"} rounded={"lg"} />
            <Skeleton h={"75px"} rounded={"lg"} />
          </>
        )
      ) : (
        ""
      )}
      {data &&
        data.map((item, index) => {
          return <Item key={index} item={item} />;
        })}
    </SimpleGrid>
  );
};

export const FlightListItem = ({
  handlePosition,
  position,
  flights,
  isLoading,
  query,
  additionalData,
}) => {
  const DetailButton = ({ type, item, query, segments }) => {
    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const payload = simplifyBodyDetailFlight(item, query);

    const { data, isLoading } = useQuery(
      ["getPriceFlight", payload],
      async () => {
        const response = await getDetailPrice(payload);
        return Promise.resolve(response);
      }
    );

    return (
      data && (
        <>
          <Text
            as={Link}
            color={"brand.blue.400"}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="semibold"
            onClick={onOpen}
          >
            Detail
          </Text>
          <CustomFilterButton
            drawer={drawerRef}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            onSubmit={(e) => handlePosition(e, position, item)}
            title={"Detail Penerbangan"}
            notrounded={type === "transit"}
            footer={"Pilih"}
            footerLeft={
              <HStack w={"full"} mt={"auto"}>
                {!isLoading && (
                  <Text fontWeight={"semibold"} color={"brand.orange.400"}>
                    {`IDR ${convertRupiah(data.data.priceFinalCustom)}`}
                  </Text>
                )}
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.low"}
                >
                  per pax
                </Text>
              </HStack>
            }
          >
            <Stack spacing={"24px"} py={"24px"}>
              {segments.map((item, index) => (
                <Stack key={index} spacing={"24px"}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <HStack>
                      {/* <Image
                    src="/png/singapore-airlines.png"
                    alt="Singapore Airlines"
                    width={16}
                    height={22}
                    objectFit="contain"
                  /> */}
                      <HStack alignItems={"center"}>
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          fontWeight={"semibold"}
                        >
                          {`${item.flightDesignator.carrierName} |`}
                        </Text>
                        <Text fontSize={{ base: "sm", md: "md" }}>{`${
                          item.flightDesignator.carrierCode
                        }: ${
                          item.flightDesignator.flightNumber
                        } | ${getClassCode(
                          item.fares[0].fareGroupCode
                        )}`}</Text>
                      </HStack>
                    </HStack>
                    <Badge>
                      {`${item.flightDesignator.carrierCode} ${item.flightDesignator.flightNumber}`}
                    </Badge>
                  </HStack>
                  <HStack alignItems={"stretch"} gap={4}>
                    <VStack
                      justifyContent={"space-between"}
                      alignItems={"end"}
                      textAlign={"right"}
                    >
                      {[item.departureDateTime, item.arrivalDateTime].map(
                        (datetime, index) => (
                          <Box key={index}>
                            <Text
                              fontSize={{ base: "sm", md: "md" }}
                              fontWeight={"semibold"}
                            >
                              {convertTimeFlightPage(datetime)}
                            </Text>
                            <Text fontSize={{ base: "sm", md: "md" }}>
                              {convertDateFlightPage(datetime)}
                            </Text>
                          </Box>
                        )
                      )}
                    </VStack>
                    <Box py={"12px"}>
                      <VStack
                        h={"full"}
                        border="1px dashed #41778A"
                        position={"relative"}
                      >
                        {["top", "bottom"].map((item, index) => (
                          <Box
                            key={index}
                            position="absolute"
                            {...{ [item]: "-4px" }}
                            bg={"brand.blue.400"}
                            w={"16px"}
                            h={"16px"}
                            border={"5px solid #F0F4F5"}
                            borderRadius="full"
                          />
                        ))}
                      </VStack>
                    </Box>
                    <VStack
                      justifyContent={"space-between"}
                      alignItems={"start"}
                      gap={2}
                    >
                      {[
                        {
                          c: `${item.origin.city}, ${item.origin.code}`,
                          a: `${item.origin.airport}`,
                        },
                        {
                          b: `${item.legs[0].durationHours} JAM ${item.legs[0].durationMinutes} MENIT`,
                        },
                        {
                          c: `${item.destination.city}, ${item.destination.code}`,
                          a: `${item.destination.airport}`,
                        },
                      ].map((item, index) =>
                        item.b ? (
                          <Badge key={index}>{item.b}</Badge>
                        ) : (
                          <Box key={index}>
                            <Text
                              color={"brand.blue.400"}
                              fontWeight={"semibold"}
                            >
                              {item.c}
                            </Text>
                            <Text
                              color={"neutral.text.medium"}
                              fontSize={{ base: "sm", md: "md" }}
                            >
                              {item.a}
                            </Text>
                          </Box>
                        )
                      )}
                    </VStack>
                  </HStack>
                  <VStack pt={5} textAlign={"left"} alignItems={"start"}>
                    {item.fares.map((facility, index) => (
                      <HStack key={index} gap={2} alignItems={"start"}>
                        <Image
                          src={"/svg/nav/tours.svg"}
                          alt={"baggage"}
                          width={20}
                          height={20}
                          objectFit="contain"
                        />
                        <VStack alignItems={"start"}>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={"semibold"}
                          >
                            {facility.defaultBaggage}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                  {type === "transit" && index < segments.length - 1 && (
                    <VStack
                      p={"12px"}
                      bg={"brand.blue.100"}
                      borderRadius={"12px"}
                      justifyContent={"center"}
                      alignText={"center"}
                    >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color={"neutral.text.low"}
                      >
                        {`Transit selama ${differenceDateLong(
                          segments[index].arrivalDateTime,
                          segments[index + 1].departureDateTime
                        )} di`}
                      </Text>
                      <Text
                        fontWeight={"semibold"}
                        fontSize={{ base: "sm", md: "md" }}
                        color={"neutral.text.medium"}
                      >
                        {`${item.destination.city} (${item.destination.code}) ${item.destination.airport}`}
                      </Text>
                    </VStack>
                  )}
                </Stack>
              ))}
            </Stack>
          </CustomFilterButton>
        </>
      )
    );
  };
  return (
    <>
      {!isLoading &&
        flights.map((item, index) => (
          <Box
            onClick={(e) => handlePosition(e, position, item)}
            key={index}
            as={"section"}
          >
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent={"space-between"}
              w="full"
              p={"16px"}
              gap={"16px"}
              borderTopRadius={"12px"}
              bg={"white"}
            >
              <HStack
                justifyContent={"space-between"}
                alignItems={"center"}
                fontSize={{ base: "xs", md: "sm" }}
              >
                <Skeleton
                  w={isLoading ? "125px" : "auto"}
                  h={isLoading ? "20px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <HStack gap={1} alignItems={"center"}>
                    {/* <Image
        src="/png/batik-air.png"
        alt="airline"
        width={24}
        height={24}
      /> */}
                    <HStack>
                      <Text fontSize={{ base: "sm", md: "xs" }}>
                        {item.segments[0].flightDesignator.carrierName}
                      </Text>
                      <Text fontSize={{ base: "sm", md: "xs" }}>•</Text>
                      <Text
                        fontSize={{ base: "sm", md: "xs" }}
                        fontWeight={"semibold"}
                      >{`${item.segments[0].flightDesignator.carrierCode}${item.segments[0].flightDesignator.flightNumber}`}</Text>
                    </HStack>
                  </HStack>
                </Skeleton>
                <Skeleton
                  w={isLoading ? "52px" : "auto"}
                  h={isLoading ? "20px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <DetailButton
                    type={
                      item.connectingType != "DIRECT" ? "transit" : "direct"
                    }
                    item={item}
                    query={query}
                    segments={item.segments}
                  />
                </Skeleton>
              </HStack>
              <HStack
                flexGrow={1}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
              >
                <VStack
                  alignItems={"start"}
                  spacing={isLoading ? "auto" : "-1"}
                >
                  <Skeleton
                    w={isLoading ? "28px" : "auto"}
                    h={isLoading ? "14px" : "auto"}
                    startColor={"gray.50"}
                    endColor={"gray.200"}
                    borderRadius={"4px"}
                    isLoaded={!isLoading}
                  >
                    <Text fontWeight={"semibold"}>
                      {additionalData.data[0].originCode}
                    </Text>
                  </Skeleton>
                  <Skeleton
                    w={isLoading ? "50px" : "auto"}
                    h={isLoading ? "14px" : "auto"}
                    startColor={"gray.50"}
                    endColor={"gray.200"}
                    borderRadius={"4px"}
                    isLoaded={!isLoading}
                  >
                    <Text
                      color={"neutral.text.medium"}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {additionalData.data[0].originCityName}
                    </Text>
                  </Skeleton>
                </VStack>
                {isLoading ? (
                  <>
                    <SkeletonCircle
                      size={"14px"}
                      startColor={"gray.50"}
                      endColor={"gray.200"}
                      alignSelf={"center"}
                    />
                    <Skeleton
                      w={"102px"}
                      h={"14px"}
                      startColor={"gray.50"}
                      endColor={"gray.200"}
                      borderRadius={"4px"}
                    />
                    <SkeletonCircle
                      size={"14px"}
                      startColor={"gray.50"}
                      endColor={"gray.200"}
                      alignSelf={"center"}
                    />
                  </>
                ) : (
                  <Center
                    borderBottom={"1px"}
                    borderBottomStyle={"dashed"}
                    borderBottomColor={"brand.blue.500"}
                    w="full"
                    py={1}
                    position="relative"
                  >
                    <Text
                      fontSize={{ base: "xx-small", md: "xs" }}
                      color={"neutral.text.low"}
                    >
                      {item.connectingType != "DIRECT"
                        ? `${item.segments.length} Transit • ${differenceDate(
                            item.segments[0].departureDateTime,
                            item.segments[item.segments.length - 1]
                              .arrivalDateTime
                          )}`
                        : `Langsung • ${differenceDate(
                            item.segments[0].departureDateTime,
                            item.segments[0].arrivalDateTime
                          )}`}
                    </Text>
                    <Box
                      position="absolute"
                      bottom={"-9px"}
                      left={"0px"}
                      bg={"brand.blue.400"}
                      w={"16px"}
                      h={"16px"}
                      border={"5px solid #F0F4F5"}
                      borderRadius="full"
                    ></Box>
                    <Box
                      position="absolute"
                      bottom={"-9px"}
                      right={"0px"}
                      bg={"brand.blue.400"}
                      w={"16px"}
                      h={"16px"}
                      border={"5px solid #F0F4F5"}
                      borderRadius="full"
                    ></Box>
                  </Center>
                )}
                <VStack alignItems={"end"} spacing={isLoading ? "auto" : "-1"}>
                  <Skeleton
                    w={isLoading ? "28px" : "auto"}
                    h={isLoading ? "14px" : "auto"}
                    startColor={"gray.50"}
                    endColor={"gray.200"}
                    borderRadius={"4px"}
                    isLoaded={!isLoading}
                  >
                    <Text fontWeight={"semibold"}>
                      {additionalData.data[0].destinationCode}
                    </Text>
                  </Skeleton>
                  <Skeleton
                    w={isLoading ? "50px" : "auto"}
                    h={isLoading ? "14px" : "auto"}
                    startColor={"gray.50"}
                    endColor={"gray.200"}
                    borderRadius={"4px"}
                    isLoaded={!isLoading}
                  >
                    <Text
                      color={"neutral.text.medium"}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {additionalData.data[0].destinationCityName}
                    </Text>
                  </Skeleton>
                </VStack>
              </HStack>
              <HStack
                flexGrow={1}
                justifyContent={"space-between"}
                alignItems={"center"}
                fontSize="sm"
              >
                <Skeleton
                  w={isLoading ? "101px" : "auto"}
                  h={isLoading ? "17px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <HStack>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      flexGrow={1}
                      fontWeight="thin"
                    >
                      {convertDateFlightPage(
                        item.segments[0].departureDateTime
                      )}
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>•</Text>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      flexGrow={1}
                      fontWeight="semibold"
                    >
                      {convertTimeFlightPage(
                        item.segments[0].departureDateTime
                      )}
                    </Text>
                  </HStack>
                </Skeleton>
                {/* <Divider /> */}
                <Skeleton
                  w={isLoading ? "101px" : "auto"}
                  h={isLoading ? "17px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <HStack>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="thin">
                      {convertDateFlightPage(item.segments[0].arrivalDateTime)}
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>•</Text>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                    >
                      {convertTimeFlightPage(item.segments[0].arrivalDateTime)}
                    </Text>
                  </HStack>
                </Skeleton>
              </HStack>
            </Stack>
            <Box
              as={"section"}
              position={"relative"}
              w="full"
              p={"16px"}
              borderTop={"1px"}
              borderTopColor={"gray.200"}
              borderTopStyle={"dashed"}
              borderBottomRadius={"12px"}
              bg={"white"}
            >
              <Box
                position="absolute"
                top={"-8px"}
                left={"-8px"}
                bg={"brand.blue.100"}
                w={"16px"}
                h={"16px"}
                borderRadius="full"
              ></Box>
              <Box
                position="absolute"
                top={"-8px"}
                right={"-8px"}
                bg={"brand.blue.100"}
                w={"16px"}
                h={"16px"}
                borderRadius="full"
              ></Box>
              <HStack justifyContent={"space-between"} alignItems={"center"}>
                <Skeleton
                  w={isLoading ? "101px" : "auto"}
                  h={isLoading ? "22px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <Text
                    fontWeight={"semibold"}
                    fontSize={{ base: "md", md: "lg" }}
                    color={"brand.orange.400"}
                  >
                    {getClassCode(item.segments[0].fares[0].fareGroupCode)}
                  </Text>
                </Skeleton>
                <Skeleton
                  w={isLoading ? "101px" : "auto"}
                  h={isLoading ? "22px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight={"semibold"}
                    bg={"brand.orange.400"}
                    color={"white"}
                    px={2}
                    py={0.5}
                    borderRadius={"4px"}
                  >
                    {`IDR ${convertRupiah(sumPriceFlight(item.segments))}`}
                  </Text>
                </Skeleton>
              </HStack>
            </Box>
          </Box>
        ))}
    </>
  );
};

export const FlightPriceDetails = ({
  detail_prices,
  isPromoAvailable,
  ...props
}) => {
  return (
    <VStack
      {...props}
      alignItems="start"
      py={"16px"}
      borderBottom="1px dashed #E9E9E9"
    >
      <Text color="brand.blue.400" fontWeight="semibold">
        Total Pembayaran
      </Text>
      <HStack w="full" justifyContent="space-between">
        <Text fontSize={{ base: "sm", md: "md" }} color="neutral.text.medium">
          Total
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="neutral.text.medium">
          {convertRupiah(detail_prices.data.priceFinalCustom)}
        </Text>
      </HStack>
      {isPromoAvailable && isPromoAvailable.available && (
        <HStack w="full" justifyContent="space-between">
          <Text fontSize={{ base: "sm", md: "md" }} color="neutral.text.medium">
            Promo
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={"green.400"}
            fontWeight={"semibold"}
          >
            {convertRupiah(isPromoAvailable.totalDiscount)}
          </Text>
        </HStack>
      )}
    </VStack>
  );
};

export const FlightDetails = ({ query, data, ...props }) => {
  return (
    <Box
      {...props}
      bg={"brand.blue.100"}
      rounded={{ base: "none", md: "lg" }}
      px={props.px ?? "24px"}
      py={"24px"}
    >
      <Badge
        variant="unstyled"
        fontWeight="regular"
        textTransform="none"
        bg="brand.orange.400"
        mb="24px"
        color="white"
      >
        {query.is_round_trip == "true" ? "Round Trip" : "One Way"}
      </Badge>
      <Accordion allowToggle>
        {data.flights.map((item, index) => (
          <AccordionItem mx={"-24px"} key={index} border="none">
            <AccordionButton>
              <Box
                flex="1"
                color="brand.blue.400"
                fontWeight="semibold"
                textAlign="left"
              >
                Penerbangan{" "}
                {query.is_round_trip == "true" && index === 0
                  ? "Pergi"
                  : query.is_round_trip == "true" && index === 1
                  ? "Pulang"
                  : "Pergi"}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Stack
                bg="white"
                spacing={"16px"}
                px="16px"
                py="14px"
                borderRadius="8px"
              >
                <Text fontWeight="semibold">
                  {`${item.segments[0].origin.city} (${
                    item.segments[0].origin.code
                  }) - ${
                    item.segments[item.segments.length - 1].destination.city
                  } (${
                    item.segments[item.segments.length - 1].destination.code
                  })`}
                </Text>
                <Box alignContent={"center"}>
                  <Divider variant={"dashed"} />
                </Box>
                <Stack spacing={15}>
                  {[
                    {
                      i: `${
                        query.is_round_trip == "true" && index === 1
                          ? `/svg/flights/destination.svg`
                          : `/svg/flights/departure.svg`
                      }`,
                      t: `${convertArrayAirlines(item.segments)}`,
                    },
                    {
                      i: "/svg/flights/date.svg",
                      t: `${date(
                        new Date(item.segments[0].departureDateTime),
                        "dd LLL yyyy"
                      )}, ${convertTimeFlightPage(
                        item.segments[0].departureDateTime
                      )} - ${convertTimeFlightPage(
                        item.segments[item.segments.length - 1].arrivalDateTime
                      )}`,
                    },
                    {
                      i: "/svg/flights/people.svg",
                      t: `${
                        query.adult != "0" ? `${query.adult} Dewasa,` : ""
                      } ${
                        query.child != "0" ? `${query.child} Anak-anak,` : ""
                      } ${
                        query.infant != "0" ? `${query.infant} Bayi,` : ""
                      } ${getClassCode(query.class)}`,
                    },
                  ].map((item, index) => (
                    <Stack key={index}>
                      <HStack>
                        <Image
                          src={item.i}
                          alt={item.i}
                          width={20}
                          height={20}
                        />
                        <Text fontSize="sm" color="neutral.text.medium">
                          {item.t}
                        </Text>
                      </HStack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export const FlightHistory = ({ item, setItem, handleClick }) => {
  const handleRemoveItem = (index) => {
    setItem((items) => items.filter((s, i) => i !== index));
  };
  // Return maximum 4 items
  item = item.filter((item, index) => {
    return index <= 3;
  });
  return (
    <Swiper
      spaceBetween={12}
      slidesOffsetBefore={24}
      slidesOffsetAfter={24}
      slidesPerView={"auto"}
      cssMode={false}
    >
      {item.map((item, index) => (
        <SwiperSlide key={index} style={{ maxWidth: "250px" }}>
          <Formik initialValues={item} onSubmit={handleClick}>
            {(formik) => (
              <LinkBox p={"16px"} bg={"white"} rounded={"xl"}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Stack direction={"column"}>
                    <HStack alignItems={"start"}>
                      <Image
                        alt={"Last search Icon"}
                        width={16}
                        height={16}
                        src={"/svg/tours/last-search.svg"}
                      />
                      <VStack alignItems={"start"} spacing={"-1"}>
                        <Text
                          fontWeight={"semibold"}
                          color={"neutral.text.high"}
                        >
                          {item.flights[0].departure.code}
                        </Text>
                        <Text
                          color={"neutral.text.low"}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {item.flights[0].departure.city}
                        </Text>
                      </VStack>
                      <Text>....</Text>
                      <VStack alignItems={"start"} spacing={"-1"}>
                        <Text
                          fontWeight={"semibold"}
                          color={"neutral.text.high"}
                        >
                          {item.flights[0].destination.code}
                        </Text>
                        <Text
                          color={"neutral.text.low"}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {item.flights[0].destination.city}
                        </Text>
                      </VStack>
                    </HStack>
                    <Stack spacing={0}>
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color={"neutral.text.medium"}
                      >
                        {item.flights[0].departure_date
                          ? date(
                              new Date(item.flights[0].departure_date),
                              "dd LLL yyyy"
                            )
                          : "Tidak ada tanggal pulang"}
                      </Text>
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color={"neutral.text.medium"}
                      >
                        {item.flights[0].adult +
                          item.flights[0].child +
                          item.flights[0].infant}{" "}
                        Penumpang, {getClassCode(item.flights[0].class)}
                      </Text>
                      <LinkOverlay href="#" onClick={formik.handleSubmit} />
                    </Stack>
                  </Stack>
                  <CloseButton
                    zIndex={2}
                    onClick={() => handleRemoveItem(index)}
                  />
                </Stack>
              </LinkBox>
            )}
          </Formik>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export const TourHistory = ({ item, setItem, handleClick }) => {
  // const [item, setItem] = useLocalStorage;
  const handleRemoveItem = (index) => {
    setItem((items) => items.filter((s, i) => i !== index));
  };
  // Return maximum 4 items
  item = item.filter((item, index) => {
    return index <= 3;
  });

  const countryName = useQuery(["getCountryNamesHistory", item], async () => {
    try {
      const value = await Promise.all(
        item?.map(async (data) => {
          if (data.destination) {
            const response = await getCountriesFromIsoCode(data.destination);
            return Promise.resolve(response[0].attributes.name);
          } else {
            return Promise.resolve("");
          }
        })
      );
      return Promise.resolve(value);
    } catch (error) {
      // console.error(error);

      return Promise.reject(error);
    }
  });

  return (
    <Swiper
      spaceBetween={12}
      slidesOffsetBefore={useBreakpointValue(
        { base: 24, xl: 0 },
        { ssr: false }
      )}
      slidesOffsetAfter={24}
      slidesPerView={"auto"}
      // cssMode={false}
      style={{ width: "inherit" }}
    >
      {item.length !== 0 ? (
        item?.map((item, index) => (
          <SwiperSlide key={index} style={{ maxWidth: "250px" }}>
            <LinkBox
              p={"16px"}
              bg={"white"}
              rounded={"xl"}
              borderWidth={"1px"}
              borderColor={"neutral.color.line.secoundary"}
            >
              <Formik initialValues={item} onSubmit={handleClick}>
                {(formik) => (
                  <Form>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack direction={"column"}>
                        <HStack>
                          <Skeleton isLoaded={!countryName.isLoading}>
                            <Image
                              alt={"Last search Icon"}
                              width={16}
                              height={16}
                              src={"/svg/tours/last-search.svg"}
                            />
                          </Skeleton>
                          <Skeleton isLoaded={!countryName.isLoading}>
                            <Text color="neutral.text.high" fontWeight={"bold"}>
                              {/* {item?.area?.length > 0
                              ? area.map((i) => {
                                  if (i.slug === item.area) {
                                    return i.name;
                                  }
                                })
                              : "Tidak ada area"} */}
                              {(countryName.data && countryName.data[index]) ||
                                "Semua Tur"}
                            </Text>
                          </Skeleton>
                        </HStack>
                        <Stack spacing={0}>
                          {/* <Text fontSize={"xs"}>
                            {item?.destination?.length > 0
                              ? destination.map((i) => {
                                  if (i.isoCode2 === item.destination) {
                                    return i.name;
                                  }
                                })
                              : "Tidak ada destinasi"}
                          </Text> */}
                          <Skeleton isLoaded={!countryName.isLoading}>
                            <Text color="neutral.text.high" fontSize={"xs"}>
                              {item?.period_year?.length > 0
                                ? `${item?.period_month} ${item?.period_year}`
                                : "Tidak ada periode keberangkatan"}
                            </Text>
                          </Skeleton>
                          <LinkOverlay href="#" onClick={formik.handleSubmit} />
                        </Stack>
                      </Stack>
                      <CloseButton
                        zIndex={2}
                        onClick={() => handleRemoveItem(index)}
                      />
                    </Stack>
                  </Form>
                )}
              </Formik>
            </LinkBox>
          </SwiperSlide>
        ))
      ) : (
        <Center>
          <Text>Tidak ada history</Text>
        </Center>
      )}
    </Swiper>
  );
};
export const CruiseHistory = ({ item, setItem, handleClick }) => {
  // const [item, setItem] = useLocalStorage;
  const handleRemoveItem = (index) => {
    setItem((items) => items.filter((s, i) => i !== index));
  };
  // Return maximum 4 items
  item = item.filter((item, index) => {
    return index <= 3;
  });

  return (
    <Swiper
      spaceBetween={12}
      slidesOffsetBefore={useBreakpointValue(
        { base: 24, xl: 0 },
        { ssr: false }
      )}
      slidesOffsetAfter={24}
      slidesPerView={"auto"}
      // cssMode={false}
      style={{ width: "inherit" }}
    >
      {item.length !== 0 ? (
        item?.map((item, index) => (
          <SwiperSlide key={index} style={{ maxWidth: "250px" }}>
            <LinkBox p={"16px"} bg={"white"} rounded={"xl"}>
              <Formik initialValues={item} onSubmit={handleClick}>
                {(formik) => (
                  <Form>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack direction={"column"}>
                        <HStack>
                          <Image
                            alt={"Last search Icon"}
                            width={16}
                            height={16}
                            src={"/svg/tours/last-search.svg"}
                          />
                          <Text color="neutral.text.high" fontWeight={"bold"}>
                            {item.destination || "Semua Package"}
                          </Text>
                        </HStack>
                        <Stack spacing={0}>
                          <Text color="neutral.text.high" fontSize={"xs"}>
                            {item?.period_year?.length > 0
                              ? `${item?.period_month} ${item?.period_year}`
                              : "Tidak ada periode keberangkatan"}
                          </Text>
                          <LinkOverlay href="#" onClick={formik.handleSubmit} />
                        </Stack>
                      </Stack>
                      <CloseButton
                        zIndex={2}
                        onClick={() => handleRemoveItem(index)}
                      />
                    </Stack>
                  </Form>
                )}
              </Formik>
            </LinkBox>
          </SwiperSlide>
        ))
      ) : (
        <Center>
          <Text>Tidak ada history</Text>
        </Center>
      )}
    </Swiper>
  );
};
export const PackageHistory = ({ item, setItem, handleClick }) => {
  // const [item, setItem] = useLocalStorage;
  const handleRemoveItem = (index) => {
    setItem((items) => items.filter((s, i) => i !== index));
  };
  // Return maximum 4 items
  item = item.filter((item, index) => {
    return index <= 3;
  });

  return (
    <Swiper
      spaceBetween={12}
      slidesOffsetBefore={useBreakpointValue(
        { base: 24, xl: 0 },
        { ssr: false }
      )}
      slidesOffsetAfter={24}
      slidesPerView={"auto"}
      // cssMode={false}
      style={{ width: "inherit" }}
    >
      {item.length !== 0 ? (
        item?.map((item, index) => (
          <SwiperSlide key={index} style={{ maxWidth: "250px" }}>
            <LinkBox p={"16px"} bg={"white"} rounded={"xl"}>
              <Formik initialValues={item} onSubmit={handleClick}>
                {(formik) => (
                  <Form>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack direction={"column"}>
                        <HStack>
                          <Image
                            alt={"Last search Icon"}
                            width={16}
                            height={16}
                            src={"/svg/tours/last-search.svg"}
                          />
                          <Text color="neutral.text.high" fontWeight={"bold"}>
                            {item.destination || "Semua Package"}
                          </Text>
                        </HStack>
                        <Stack spacing={0}>
                          <Text color="neutral.text.high" fontSize={"xs"}>
                            {item?.period_year?.length > 0
                              ? `${item?.period_month} ${item?.period_year}`
                              : "Tidak ada periode keberangkatan"}
                          </Text>
                          <LinkOverlay href="#" onClick={formik.handleSubmit} />
                        </Stack>
                      </Stack>
                      <CloseButton
                        zIndex={2}
                        onClick={() => handleRemoveItem(index)}
                      />
                    </Stack>
                  </Form>
                )}
              </Formik>
            </LinkBox>
          </SwiperSlide>
        ))
      ) : (
        <Center>
          <Text>Tidak ada history</Text>
        </Center>
      )}
    </Swiper>
  );
};

export const HotelHistory = ({ item, setItem, handleClick }) => {
  // const [item, setItem] = useLocalStorage;
  const handleRemoveItem = (index) => {
    setItem((items) => items.filter((s, i) => i !== index));
  };
  // Return maximum 4 items
  item = item.filter((item, index) => {
    return index <= 3;
  });

  const countryName = useQuery(["getCountryNamesHistory", item], async () => {
    try {
      const value = await Promise.all(
        item?.map(async (data) => {
          if (data.destination) {
            const response = await getCountriesFromIsoCode(data.destination);
            return Promise.resolve(response[0].attributes.name);
          } else {
            return Promise.resolve("");
          }
        })
      );
      return Promise.resolve(value);
    } catch (error) {
      // console.error(error);

      return Promise.reject(error);
    }
  });

  return (
    <Swiper
      spaceBetween={12}
      slidesOffsetBefore={useBreakpointValue(
        { base: 24, md: 0 },
        { ssr: false }
      )}
      slidesOffsetAfter={24}
      slidesPerView={"auto"}
      // cssMode={false}
      style={{ width: "inherit" }}
    >
      {item.length !== 0 ? (
        item?.map((item, index) => (
          <SwiperSlide key={index} style={{ maxWidth: "300px" }}>
            <LinkBox p={"16px"} bg={"white"} rounded={"xl"}>
              <Formik initialValues={item} onSubmit={handleClick}>
                {(formik) => (
                  <Form>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack direction={"column"}>
                        <HStack>
                          <Skeleton isLoaded={!countryName.isLoading}>
                            <Image
                              alt={"Last search Icon"}
                              width={16}
                              height={16}
                              src={"/svg/tours/last-search.svg"}
                            />
                          </Skeleton>
                          <Skeleton isLoaded={!countryName.isLoading}>
                            <Text color="neutral.text.high" fontWeight={"bold"}>
                              {/* {item?.area?.length > 0
                              ? area.map((i) => {
                                  if (i.slug === item.area) {
                                    return i.name;
                                  }
                                })
                              : "Tidak ada area"} */}
                              {item.places || "Tidak ada data"}
                            </Text>
                          </Skeleton>
                        </HStack>
                        <Stack spacing={0}>
                          <Text fontSize={"xs"}>
                            {item.checkin_date && item.checkout_date
                              ? `${date(
                                  new Date(item.checkin_date),
                                  "dd LLLL yyyy"
                                )} - ${date(
                                  new Date(item.checkout_date),
                                  "dd LLLL yyyy"
                                )}`
                              : "Tidak ada tanggal"}
                          </Text>
                          <Skeleton isLoaded={!countryName.isLoading}>
                            <Text fontSize={"xs"}>
                              {`${item.rooms && item.rooms} Kamar, ${
                                item.adult && item.adult
                              } Tamu Dewasa, ${
                                item.children && item.children
                              } Tamu Anak`}
                            </Text>
                          </Skeleton>
                          <LinkOverlay href="#" onClick={formik.handleSubmit} />
                        </Stack>
                      </Stack>
                      <CloseButton
                        zIndex={2}
                        onClick={() => handleRemoveItem(index)}
                      />
                    </Stack>
                  </Form>
                )}
              </Formik>
            </LinkBox>
          </SwiperSlide>
        ))
      ) : (
        <Center>
          <Text>Tidak ada history</Text>
        </Center>
      )}
    </Swiper>
  );
};
export const AttractionHistory = ({
  item,
  setItem,
  types,
  handleClick,
  places,
}) => {
  // const [item, setItem] = useLocalStorage;
  const handleRemoveItem = (index) => {
    setItem((items) => items.filter((s, i) => i !== index));
  };
  // Return maximum 4 items
  item = item.filter((item, index) => {
    return index <= 3;
  });

  const attractionsLabel = useQuery(
    ["getAttractionsLabelDropdown", item],
    async () => {
      try {
        const response = await Promise.all(
          item.map(async (item, index) => {
            const response = await getStateById(item.places);

            return Promise.resolve(response.data?.[0]?.attributes);
          })
        );
        // console.log(response, "response");
        return Promise.resolve(
          response.filter((item) => {
            return item != undefined;
          })
        );
      } catch (error) {
        // console.error(error);
        return Promise.reject(error);
      }
    }
  );
  return (
    <Swiper
      spaceBetween={12}
      slidesOffsetBefore={useBreakpointValue(
        { base: 24, md: 0 },
        { ssr: false }
      )}
      slidesOffsetAfter={24}
      slidesPerView={"auto"}
      // cssMode={false}
      style={{ width: "inherit" }}
    >
      {item.length !== 0 ? (
        item?.map((item, index) => (
          <SwiperSlide key={index} style={{ maxWidth: "300px" }}>
            <LinkBox p={"16px"} bg={"white"} rounded={"xl"}>
              <Formik initialValues={item} onSubmit={handleClick}>
                {(formik) => (
                  <Form>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack direction={"column"}>
                        <HStack>
                          <Image
                            alt={"Last search Icon"}
                            width={16}
                            height={16}
                            src={"/svg/tours/last-search.svg"}
                          />
                          <Text color="neutral.text.high" fontWeight={"bold"}>
                            {item.places.length !== 0
                              ? attractionsLabel.data &&
                                attractionsLabel.data?.map((item, i) => {
                                  if (index === i) {
                                    return item.name ?? item.title;
                                  }
                                })
                              : "Semua atraksi"}
                          </Text>
                        </HStack>
                        <Stack spacing={0}>
                          <Text fontSize={"xs"}>
                            {item.type
                              ? types.map((type) => {
                                  if (type.uuid === item.type) {
                                    return type.name;
                                  }
                                })
                              : "Semua tipe atraksi"}
                          </Text>
                          <LinkOverlay href="#" onClick={formik.handleSubmit} />
                        </Stack>
                      </Stack>
                      <CloseButton
                        zIndex={2}
                        onClick={() => handleRemoveItem(index)}
                      />
                    </Stack>
                  </Form>
                )}
              </Formik>
            </LinkBox>
          </SwiperSlide>
        ))
      ) : (
        <Center>
          <Text>Tidak ada history</Text>
        </Center>
      )}
    </Swiper>
  );
};

export const TourDetails = ({ data, ...props }) => {
  const { tourDetail } = useSelector((state) => state.tourReducer);
  return (
    <Box
      {...props}
      bg={"brand.blue.100"}
      rounded={{ base: "none", md: "lg" }}
      px={props.px ?? "24px"}
      py={"24px"}
    >
      <Stack bg="white" px="16px" py="14px" borderRadius="8px">
        <VStack alignItems="start" spacing=".5" pb="16px">
          <HStack>
            {data?.tags.length > 0 &&
              data?.tags[0].items.length > 0 &&
              data?.tags[0].items.map((tag, index) => (
                <Box key={index}>
                  <CustomTags>{tag.name}</CustomTags>
                </Box>
              ))}
            <Text fontSize="lg" fontWeight="semibold">
              Tour Series - {data?.groups[0].name}
            </Text>
          </HStack>
          <Text fontSize="sm" color="neutral.text.medium">
            Tour ID : {stringSplit(data?.departure?.code, ".")[0]}
          </Text>
        </VStack>
        <Divider variant={"dashed"} />
        <Stack>
          <Text fontSize="lg" fontWeight="semibold">
            {data.name}
          </Text>
          <VStack alignItems="start">
            {[
              {
                i: "/svg/flights/date.svg",
                t: `${convertDateWithMonthName(
                  data?.departure?.date
                )} - ${addDaysWithMonthName(
                  data?.departure?.date,
                  data?.departure?.duration
                )}                    `,
              },
              {
                i: "/svg/flights/people.svg",
                t: `${
                  tourDetail.participants?.adults
                    ? `${tourDetail.participants.adults} Dewasa`
                    : ""
                } ${
                  tourDetail.participants.children
                    ? `, ${tourDetail.participants.children} Anak-anak`
                    : ""
                }`,
              },
              {
                i: "/svg/flights/departure.svg",
                t: `${
                  data.departure.airlines?.[0]?.name ?? "Tidak ada airlines"
                }`,
              },
            ].map((item, index) => (
              <HStack key={index} alignItems="center">
                <Image src={item.i} alt={item.i} width={20} height={20} />
                <Text fontSize="sm" color="neutral.text.medium">
                  {item.t}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Stack>
      </Stack>
    </Box>
  );
};
export const CruiseDetails = ({ data, cruiseDetail, ...props }) => {
  const adultsCount = cruiseDetail.participants.adults;
  const childrenCount = cruiseDetail.participants.children;
  return (
    <Box
      {...props}
      bg={"brand.blue.100"}
      rounded={{ base: "none", md: "lg" }}
      px={props.px ?? "24px"}
      py={"24px"}
    >
      <Stack bg="white" px="16px" spacing={"16px"} py="14px" borderRadius="8px">
        <VStack alignItems="start" spacing=".5">
          <Box>
            <Text fontSize="lg" fontWeight="semibold">
              {`Paket ${data.type}`}
            </Text>
            <Text fontSize="sm">
              Kode Paket: {cruiseDetail.departures.name}
            </Text>
          </Box>
        </VStack>
        <Divider variant={"dashed"} />
        <Stack>
          <Stack>
            <Text fontSize="md" fontWeight="semibold">
              {data.title}{" "}
            </Text>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/date.svg"}
                alt={"Date"}
                width={20}
                height={20}
              />
              <Flex gap={"5px"}>
                <Text fontSize="sm" color="neutral.text.medium">
                  {date(new Date(cruiseDetail.departures.date), "dd LLL yyyy")}{" "}
                  -{" "}
                  {date(
                    addDays(
                      new Date(cruiseDetail.departures.date),
                      cruiseDetail.departures.duration - 1
                    ),
                    "dd LLL yyyy"
                  )}
                </Text>
                <Tag
                  color="brand.orange.500"
                  bg="brand.orange.100"
                  size="sm"
                  fontSize="xs"
                >
                  {cruiseDetail.departures.duration} Hari
                </Tag>
              </Flex>
            </HStack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/user-multiple.svg"}
                alt={"Participants"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {[
                  {
                    count: adultsCount,
                    type: "Dewasa",
                  },
                  {
                    count: childrenCount,
                    type: "Anak-anak",
                  },
                ]
                  .filter((item) => {
                    return parseInt(item.count) !== 0;
                  })
                  .map((item) => {
                    return `${item.count} ${item.type}`;
                  })
                  .join(", ")}
              </Text>
            </HStack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/cruise.svg"}
                alt={"Cruise"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {data.ship}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export const PrebookingDetails = ({ flights, ...rest }) => {
  const Item = ({ flight }) => {
    return (
      <Stack bg={"white"} p={"16px"} rounded={"lg"}>
        <Heading fontSize={"md"}>
          {flight.departure.city} ({flight.departure.code}) -{" "}
          {flight.destination.city} ({flight.destination.code})
        </Heading>
        <Divider variant={"dashed"} />
        <CustomTagsOutlineIcon icon={<AirplaneIcon />}>
          {flight.departure.city} ({flight.departure.code}) -{" "}
          {flight.destination.city} ({flight.destination.code})
        </CustomTagsOutlineIcon>
        <CustomTagsOutlineIcon icon={<DateIcon />}>
          {/* 26 Maret, 13.45 - 16.30{" "} */}
          {date(new Date(flight.departure_date), "dd LLL yyyy")}{" "}
        </CustomTagsOutlineIcon>
        <CustomTagsOutlineIcon icon={<UserIcon />}>
          {Object.keys(flight)
            .map((item) => {
              if (item === "adult") {
                if (flight[item] !== 0) return `${flight[item]} Dewasa`;
              } else if (item === "child") {
                if (flight[item] !== 0) return `${flight[item]} Anak`;
              } else if (item === "infant") {
                if (flight[item] !== 0) return `${flight[item]} Infant`;
              }
            })
            // .filter((item) => {
            //   return !item.includes(0);
            // })
            .filter((item) => {
              return item !== undefined;
            })
            .join(", ")}
          , {getClassCode(flight.class)}{" "}
        </CustomTagsOutlineIcon>
      </Stack>
    );
  };
  return (
    <Stack
      {...rest}
      as={"section"}
      // mx={{ base: "-24px", md: 0 }}
      p={"24px"}
      bg={"brand.blue.100"}
    >
      <Heading fontSize={"md"}>Prebooking Flight</Heading>
      <Accordion defaultIndex={[0, 1]} allowMultiple mx={"-24px"}>
        <AccordionItem mx={"-24px"} border={0}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Heading fontSize={"sm"} color={"brand.blue.400"} as={"h2"}>
                Penerbangan Pergi
              </Heading>
            </Box>
            <AccordionIcon color={"brand.blue.400"} />
          </AccordionButton>
          <AccordionPanel pt={"20px"}>
            <Item flight={flights[0]} />
          </AccordionPanel>
        </AccordionItem>
        {flights[1] ? (
          <AccordionItem mx={"-24px"} border={0}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading fontSize={"sm"} color={"brand.blue.400"} as={"h2"}>
                  Penerbangan Pulang
                </Heading>
              </Box>
              <AccordionIcon color={"brand.blue.400"} />
            </AccordionButton>
            <AccordionPanel pt={"20px"}>
              <Item flight={flights[1]} />
            </AccordionPanel>
          </AccordionItem>
        ) : (
          <></>
        )}
      </Accordion>{" "}
    </Stack>
  );
};

export const PackageDetails = ({ data, packageDetail, ...props }) => {
  const adultsCount = packageDetail.participants.adults;
  const childrenCount = packageDetail.participants.children;
  return (
    <Box
      {...props}
      bg={"brand.blue.100"}
      rounded={{ base: "none", md: "lg" }}
      px={props.px ?? "24px"}
      py={"24px"}
    >
      <Stack bg="white" px="16px" spacing={"16px"} py="14px" borderRadius="8px">
        <VStack alignItems="start" spacing=".5">
          <Box>
            <Text fontSize="lg" fontWeight="semibold">
              {`${data.title}`}
            </Text>
            <Text fontSize="sm">Paket ID: {packageDetail.departures.name}</Text>
          </Box>
        </VStack>
        <Divider variant={"dashed"} />
        <Stack>
          <Stack>
            <Text fontSize="md" fontWeight="semibold">
              {packageDetail.packages.name}{" "}
            </Text>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/date.svg"}
                alt={"Date"}
                width={20}
                height={20}
              />
              <Flex gap={"5px"}>
                <Text fontSize="sm" color="neutral.text.medium">
                  {date(new Date(packageDetail.departures.date), "dd LLL yyyy")}{" "}
                  -{" "}
                  {date(
                    addDays(
                      new Date(packageDetail.departures.date),
                      packageDetail.departures.duration - 1
                    ),
                    "dd LLL yyyy"
                  )}
                </Text>
                <Tag
                  color="brand.orange.500"
                  bg="brand.orange.100"
                  size="sm"
                  fontSize="xs"
                >
                  {packageDetail.departures.duration} Hari
                </Tag>
              </Flex>
            </HStack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/user-multiple.svg"}
                alt={"Participants"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {[
                  {
                    count: adultsCount,
                    type: "Dewasa",
                  },
                  {
                    count: childrenCount,
                    type: "Anak-anak",
                  },
                ]
                  .filter((item) => {
                    return parseInt(item.count) !== 0;
                  })
                  .map((item) => {
                    return `${item.count} ${item.type}`;
                  })
                  .join(", ")}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export const InsuranceDetails = ({ details, ...props }) => {
  return (
    <Box
      {...props}
      bg={"brand.blue.100"}
      rounded={{ base: "none", md: "lg" }}
      px={props.px ?? "24px"}
      py={"24px"}
    >
      <Stack bg="white" px="16px" spacing={"16px"} py="14px" borderRadius="8px">
        <VStack alignItems="start" spacing=".5">
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="neutral.text.high">
              {/* {`${data.title}`} */}
              {details?.PlanName}
            </Text>
            {/* <Text fontSize="sm">
                Paket ID: {packageDetail.departures.name}
              </Text> */}
          </Box>
        </VStack>
        <Divider variant={"dashed"} />
        <Stack>
          <Stack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/map-pin.svg"}
                alt={"Date"}
                width={20}
                height={20}
              />
              <Flex gap={"5px"}>
                <Tag
                  color="brand.orange.500"
                  bg="brand.orange.100"
                  size="sm"
                  fontSize="xs"
                >
                  Asal
                </Tag>
                <Text fontSize="xs" color="neutral.text.medium">
                  {details?.origins} -
                </Text>
                <Tag
                  color="brand.orange.500"
                  bg="brand.orange.100"
                  size="sm"
                  fontSize="xs"
                >
                  Tujuan
                </Tag>
                <Text fontSize="xs" color="neutral.text.medium">
                  {details?.destinations}
                </Text>
              </Flex>
            </HStack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/date.svg"}
                alt={"Date"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {date(new Date(details?.travel_start_date), "EEE, dd LLL yyyy")}{" "}
                - {date(new Date(details?.travel_end_date), "EEE, dd LLL yyyy")}
              </Text>
            </HStack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/user-multiple.svg"}
                alt={"Participants"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {details?.package_type},{" "}
                {[
                  {
                    count: parseInt(details?.adults),
                    type: "Dewasa",
                  },
                  {
                    count: parseInt(details?.children),
                    type: "Anak-anak",
                  },
                ]
                  .filter((item) => {
                    return parseInt(item.count) !== 0;
                  })
                  .map((item) => {
                    return `${item.count} ${item.type}`;
                  })
                  .join(", ")}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export const TravelTopUpDetail = ({ details, ...props }) => {
  return (
    <Box
      {...props}
      bg={"brand.blue.100"}
      rounded={{ base: "none", md: "lg" }}
      px={props.px ?? "24px"}
      py={"24px"}
    >
      <Stack bg="white" px="16px" spacing={"16px"} py="14px" borderRadius="8px">
        <VStack alignItems="start" spacing=".5">
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="neutral.text.high">
              Top Up Travel Privilage Card
            </Text>
          </Box>
        </VStack>
        <Divider variant={"dashed"} />
        <Stack>
          <Stack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/checked2.svg"}
                alt={"Participants"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {formatSecretCardNumber(details.card.card)}
              </Text>
            </HStack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/checked2.svg"}
                alt={"Participants"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                Rp. {convertRupiah(details.totalTransaction)}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export const AttractionsDetails = ({ data, attractionDetail, ...props }) => {
  const { ticketId } = attractionDetail;
  const ticket = useQuery(["getDetailTicket", ticketId], async () => {
    const response = await getAttractionsDetailTicket(ticketId);
    return Promise.resolve(response);
  });
  const adultsCount = attractionDetail.participants.adults ?? 0;
  const childrenCount = attractionDetail.participants.children ?? 0;
  return (
    <Box
      {...props}
      bg={"brand.blue.100"}
      rounded={{ base: "none", md: "lg" }}
      px={props.px ?? "24px"}
      py={"24px"}
    >
      <Stack bg="white" px="16px" py="14px" borderRadius="8px">
        <VStack alignItems="start" spacing=".5" pb="16px">
          <HStack>
            <Text fontSize="lg" fontWeight="semibold">
              {data?.title}
            </Text>
          </HStack>
          {/* {attractionDetail.ticketId && (
            <Text fontSize="sm" color="neutral.text.medium">
              Tiket ID : {attractionDetail.ticketId}
            </Text>
          )} */}
        </VStack>
        <Divider variant={"dashed"} />
        <Stack>
          <Text fontSize="sm" fontWeight="semibold">
            {ticket.data && ticket.data?.data?.title}
          </Text>
          <VStack alignItems="start">
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/date.svg"}
                alt={"Date"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {date(
                  new Date(attractionDetail.departure_date),
                  "LLL, dd MMM yyyy"
                )}
              </Text>
            </HStack>
            <HStack alignItems="center">
              <Image
                src={"/svg/icons/user-multiple.svg"}
                alt={"Participants"}
                width={20}
                height={20}
              />
              <Text fontSize="sm" color="neutral.text.medium">
                {[
                  {
                    count: adultsCount,
                    type: "Dewasa",
                  },
                  {
                    count: childrenCount,
                    type: "Anak-anak",
                  },
                ]
                  .filter((item) => {
                    return parseInt(item.count);
                  })
                  .map((item) => {
                    return `${item.count} ${item.type}`;
                  })
                  .join(", ")}
              </Text>
            </HStack>
          </VStack>
        </Stack>
      </Stack>
    </Box>
  );
};

export const PromoItems = ({ query }) => {
  const Item = ({ item = null, isLoading = false }) => {
    const dispacth = useDispatch();
    const router = useRouter();
    const handleNextPage = () => {
      dispacth(detail({ promoDetail: item }));
      router.push(`/promo/${item.code}`);
    };
    console.log(item);
    return (
      <>
        {!isLoading ? (
          <LinkBox onClick={() => handleNextPage()}>
            <Stack
              h={"250px"}
              bg={"white"}
              overflow="hidden"
              rounded={"2xl"}
              // spacing={"12px"}
              direction={"row"}
            >
              <Box
                position={"relative"}
                // style={{ aspectRatio: 16 / 9 }}
                width={"180px"}
                overflow={"hidden"}
              >
                <Image
                  objectFit="cover"
                  layout={"fill"}
                  alt={item.name ?? ""}
                  src={`${
                    item.image
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`
                      : item.banner
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.banner.url}`
                      : "/png/150.png"
                  }`}
                />
              </Box>
              <Stack
                h={"full"}
                p={"12px"}
                justifyContent={"space-around"}
                bg={"white"}
                // spacing={"16px"}
              >
                <Heading color={"brand.blue.600"} fontSize={"18px"}>
                  {item.name}
                </Heading>
                <Stack spacing={"12px"}>
                  <Box>
                    <Text
                      fontSize={"sm"}
                      color={"neutral.text.high"}
                      fontWeight={"bold"}
                    >
                      Periode
                    </Text>
                    <Text fontSize={"sm"}>{` ${date(
                      new Date(item.startDate),
                      "dd LLL yyyy"
                    )} - ${date(new Date(item.endDate), "dd LLL yyyy")}`}</Text>
                  </Box>
                  <Box>
                    <Text fontSize={"xs"} color={"neutral.text.low"}>
                      Hingga
                    </Text>
                    <Text
                      fontWeight={"bold"}
                      fontSize={"md"}
                      color={"brand.orange.400"}
                    >
                      {`IDR ${convertRupiah(item.discount_amount)}`}
                    </Text>
                  </Box>
                  <NextLink href={"#"}>
                    <LinkOverlay>
                      <Link fontSize={"sm"} color={"brand.blue.400"}>
                        <HStack justifyContent="end">
                          <Text>Lihat Semua</Text>
                          <ArrowRightIcon />
                        </HStack>
                      </Link>
                    </LinkOverlay>
                  </NextLink>
                </Stack>
              </Stack>
            </Stack>
          </LinkBox>
        ) : (
          <Stack
            bg={"white"}
            overflow="hidden"
            rounded={"2xl"}
            // spacing={"12px"}
            direction={"row"}
          >
            <Skeleton isLoaded={!isLoading}>
              <Flex
                position={"relative"}
                style={{ aspectRatio: 4 / 3 }}
                overflow={"hidden"}
                w={"150px"}
                // shrink={0}
              />
            </Skeleton>
            <Stack
              w={"full"}
              p={"12px"}
              justifyContent={"center"}
              bg={"white"}
              spacing={"16px"}
            >
              <Skeleton isLoaded={!isLoading}>
                <Heading color={"brand.blue.600"} fontSize={"18px"}>
                  Promo
                </Heading>
              </Skeleton>
              <Stack spacing={"24px"}>
                <Box>
                  <Skeleton isLoaded={!isLoading}>
                    <Text
                      fontSize={"sm"}
                      color={"neutral.text.high"}
                      fontWeight={"bold"}
                    >
                      Periode
                    </Text>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Text fontSize={"sm"}>1 Jan 2022 - 1 Jan 2022</Text>
                  </Skeleton>
                </Box>
                <Divider variant={"dashed"} />
                <Skeleton isLoaded={!isLoading}>
                  <Text
                    fontWeight={"bold"}
                    fontSize={"md"}
                    color={"brand.orange.400"}
                  >
                    {`Hingga IDR 18.000.000`}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isLoading}>
                  <Link fontSize={"sm"} color={"brand.blue.400"}>
                    <HStack justifyContent="end">
                      <Text>Lihat Semua</Text>
                      <ArrowRightIcon />
                    </HStack>
                  </Link>
                </Skeleton>
              </Stack>
            </Stack>
          </Stack>
        )}
      </>
    );
  };
  return (
    <>
      {!query.isLoading ? (
        query?.data?.data.length > 0 ? (
          <SimpleGrid columns={[1, 1, 2, 3]} w={"full"} gap={"16px"}>
            {query?.data?.data?.map((item, i) => {
              const image = item.attributes?.banner?.data
                ? item.attributes?.banner?.data[0].attributes?.url
                : "";
              const amount = item.attributes?.amount;
              const name = item.attributes?.name;
              const startDate = item.attributes?.start_date;
              const endDate = item.attributes?.end_date;
              const id = item.id;
              const newItem = {
                image,
                amount,
                name,
                startDate,
                endDate,
                id,
                ...item.attributes,
              };
              return (
                <Item item={newItem} key={i} />
                // <Fragment key={i}>
                //   {page?.map((item, index) => {
                //     return <Item item={newItem} key={index} />;
                //   })}
                // </Fragment>
              );
            })}
          </SimpleGrid>
        ) : (
          <NoResults hideButton />
        )
      ) : (
        <SimpleGrid columns={[1, 1, 2, 3]} w={"full"} gap={"16px"}>
          <Item isLoading={true} />
          <Item isLoading={true} />
          <Item isLoading={true} />
        </SimpleGrid>
      )}
    </>
  );
};

export const BannerAllPhotos = ({
  title,
  description,
  page,
  length,
  items,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const drawerRef = useRef();
  return (
    <>
      <Button
        onClick={onOpen}
        rounded={"none"}
        roundedTopLeft={"lg"}
        variant={"solid"}
        p={"8px"}
        fontSize={{ base: "xs", md: "sm" }}
        colorScheme={"blackAlpha"}
      >
        Semua Foto
      </Button>
      <CustomFilterButton
        drawer={drawerRef}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        notrounded
        title={"Semua Foto"}
        hidefooter
      >
        <Box py={"24px"}>
          <Heading fontSize={"2xl"}>{title ?? "Tidak ada nama tempat"}</Heading>
          <Text fontSize={"xs"}>{description ?? "Tidak ada alamat"}</Text>
        </Box>
        <CustomDivider />
        <Box py={"24px"}>
          <Heading fontSize={"md"}>Semua Foto {page ?? "Hotel"}</Heading>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            {length ?? 0} Foto Tersedia{" "}
          </Text>
        </Box>
        <SimpleGrid pb={"24px"} gap={"12px"} columns={[1]}>
          {items ? (
            items.map((item, index) =>
              item == "https://cdn.bemyguest.com.sgnull" ? null : (
                <Image
                  objectFit={"contain"}
                  alt={item}
                  key={index}
                  src={item}
                  width={360}
                  height={240}
                />
              )
            )
          ) : (
            <>
              {Array.from({ length: 8 }).map((item, index) => (
                <Image
                  objectFit={"contain"}
                  alt={item}
                  key={index}
                  src={"https://dummyimage.com/360x240"}
                  width={360}
                  height={240}
                />
              ))}
            </>
          )}
        </SimpleGrid>
      </CustomFilterButton>
    </>
  );
};

export const TnC = ({ html }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  return (
    <>
      <LinkBox
        onClick={onOpen}
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={"auto"}
      >
        <HStack
          justifyContent={"space-between"}
          p={"16px"}
          bg={"white"}
          rounded={"xl"}
        >
          <Stack spacing={"12px"}>
            <Heading
              display={"flex"}
              alignItems={"center"}
              fontSize={"md"}
              color={"brand.blue.400"}
            >
              <chakra.span mr={"5px"}>
                <InfoIcon />
              </chakra.span>
              Syarat dan Ketentuan
            </Heading>
            <Text fontSize={"sm"}>
              Dengan melakukan pemesanan maka anda menerima syarat dan ketetuan.
              Harap baca terlebih dahulu untuk memastikan.
            </Text>
          </Stack>
          <LinkOverlay href="#" transform={"rotate(180deg)"}>
            <ChevronRightIcon />
          </LinkOverlay>
        </HStack>
      </LinkBox>
      <CustomFilterButton
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        notrounded
        title={"Syarat dan Ketentuan"}
        hidefooter
      >
        {router.route !== "/tours/[id]" ? (
          <Box p={"16px"}>
            <Text
              as={"div"}
              fontSize={"sm"}
              dangerouslySetInnerHTML={{
                __html: html || "",
              }}
            />
          </Box>
        ) : (
          <Accordion allowMultiple mx={"-24px"} px={"12px"}>
            <AccordionItem border={0} pb={"20px"}>
              <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                <AccordionButton>
                  <Box flex="1" fontWeight={"bold"} textAlign="left">
                    Biaya Tour Sudah Termasuk
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel py={"16px"}>
                <Stack px={"24px"} spacing={"24px"}>
                  <ol>
                    <li>
                      <p>
                        Tiket pesawat internasional kelas ekonomi
                        (non-refundable, non-endorsable, non-reroutable)
                        berdasarkan harga tiket group atau harga promosi
                        lainnya.
                      </p>
                    </li>
                    <li>
                      <p>
                        Akomodasi, menginap di hotel berbintang dengan ketentuan
                        02 (dua) orang dalam satu kamar (twin sharing). Jika
                        menginginkan satu kamar sendiri akan dikenakan tambahan
                        (Single Supplement).
                      </p>
                    </li>
                    <li>
                      <p>
                        Bagasi cuma-cuma 1 potong dengan berat maksimum 20kg
                        atau sesuai dengan peraturan penerbangan yang digunakan
                        dan 1 handbag kecil untuk dibawa ke kabin pesawat.
                      </p>
                    </li>
                    <li>
                      <p>
                        Makan sesuai dengan tertera di jadwal perjalanan,
                        transportasi dan acara tour sesuai dengan jadwal acara
                        tour.
                      </p>
                    </li>
                    <li>
                      <p>Tour leader dari Golden Rama Tours &amp; Travel.</p>
                    </li>
                  </ol>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"20px"}>
              <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                <AccordionButton>
                  <Box flex="1" fontWeight={"bold"} textAlign="left">
                    Biaya Tour Tidak Termasuk
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel py={"16px"}>
                <Stack px={"24px"} spacing={"24px"}>
                  <ol>
                    <li>
                      <p>
                        PPn 1.1%, Airport tax international, fuel surcharge,
                        asuransi perjalanan, Biaya paspor dan visa (atau sesuai
                        dengan yang tercantum di jadwal perjalanan)
                      </p>
                    </li>
                    <li>
                      <p>
                        Pengeluaran pribadi seperti: mini bar, room service,
                        telpon, laundry, tambahan makanan dan minuman di
                        restoran dll.
                      </p>
                    </li>
                    <li>
                      <p>
                        Acara tour tambahan (optional tour) yang mungkin
                        diadakan selama perjalanan.
                      </p>
                    </li>
                    <li>
                      <p>
                        Biaya kelebihan berat barang-barang bawaan diatas 20kg
                        (excess baggage) atau sesuai dengan peraturan maskapai
                        penerbangan yang digunakan.&nbsp;
                      </p>
                    </li>
                    <li>
                      <p>
                        Biaya bagi barang-barang yang dikenakan pajak
                        &nbsp;masuk oleh bea cukai di Indonesia maupun di
                        negara-negara yang dikunjungi.
                      </p>
                    </li>
                    <li>
                      <p>
                        Tip untuk pengemudi, porter, local guide dan tour
                        leader.
                      </p>
                    </li>
                    <li>
                      <p>
                        Biaya single supplement bagi peserta yang menempati 1
                        kamar sendiri.
                      </p>
                    </li>
                    <li>
                      <p>
                        Antigen, PCR test, Hotel karantina (jika diperlukan).
                      </p>
                    </li>
                  </ol>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"20px"}>
              <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                <AccordionButton>
                  <Box flex="1" fontWeight={"bold"} textAlign="left">
                    Pendaftaran & Pembayaran
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel py={"16px"}>
                <Stack px={"24px"} spacing={"24px"}>
                  <ol>
                    <li>
                      Uang muka pendaftaran yang dibayarkan kepada PT. Golden
                      Rama Express tidak dapat dikembalikan (Down Payment
                      Non-Refundable) dengan pembayaran
                      <ul>
                        <li>
                          <p>
                            Rp. 7.000.000 + biaya visa (jika ada) per peserta
                            untuk tujuan Korea, Turki, Asia Tenggara, China, dan
                            Taiwan
                          </p>
                        </li>
                        <li>
                          <p>
                            Rp 10.000.000 + biaya visa (jika ada) per peserta
                            untuk tujuan Jepang, Eropa, Amerika, Kanada,
                            Australia, Selandia Baru, Afrika, dan Asia
                            Tengah.&nbsp;
                          </p>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Peserta bersedia memenuhi kelengkapan persyaratan dokumen
                      sesuai jadwal dan ketentuan dari pihak kedutaan negara
                      tujuan. Biaya visa tetap harus dibayarkan walaupun visa
                      tidak disetujui atau terlambat diterbitkan oleh kedutaan
                      dan merupakan kesalahan dari kedutaan (tidak sesuai dengan
                      waktu penyelesaian proses visa dari kedutaan). Demikian
                      juga jika terdapat biaya lain seperti pembatalan hotel,
                      tiket pesawat / kereta dan juga biaya tour lainnya (jika
                      ada) yang terjadi karena hal tersebut.
                    </li>
                    <li>
                      <p>
                        Pendaftaran tanpa disertai deposit (Down Payment)
                        bersifat tidak mengikat dan dapat dibatalkan tanpa
                        pemberitahuan terlebih dahulu kepada peserta.
                      </p>
                    </li>
                    <li>
                      <p>
                        Pelunasan biaya tour dilakukan 14 hari sebelum tanggal
                        keberangkatan.
                      </p>
                    </li>
                    <li>
                      <p>
                        Pendaftaran yang dilakukan kurang dari 15 hari sebelum
                        tanggal keberangkatan harus langsung melakukan
                        pembayaran secara lunas.
                      </p>
                    </li>
                    <li>
                      <p>
                        Bagi pendaftar yang berusia di atas 70 tahun atau
                        memiliki keterbatasan fungsi anggota tubuh/keterbatasan
                        secara mental wajib didampingi oleh anggota keluarga,
                        teman atau saudara yang sehat secara jasmani dan rohani
                        dan bisa bertanggung jawab selama perjalanan.
                      </p>
                    </li>
                  </ol>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"20px"}>
              <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                <AccordionButton>
                  <Box flex="1" fontWeight={"bold"} textAlign="left">
                    Deviasi
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel py={"16px"}>
                <Stack px={"24px"} spacing={"24px"}>
                  <p>
                    (Deviasi; Perubahan, perpanjangan, penambahan/penyimpangan
                    rute perjalanan di luar rute perjalanan yang telah
                    dijadwalkan oleh Golden Rama Tours &amp; Travel)
                  </p>
                  <ol>
                    <li>
                      <p>
                        Deviasi dapat diproses apabila sudah melakukan deposit
                        dan melampirkan fotokopi paspor.
                      </p>
                    </li>
                    <li>
                      <p>
                        Deviasi dapat dilakukan apabila jumlah peserta yang
                        berangkat dan yang pulang telah memenuhi kuota dari
                        ketentuan maskapai penerbangan.
                      </p>
                    </li>
                    <li>
                      <p>
                        Apabila deviasi sudah disetujui maka akan dikenakan
                        biaya sesuai dengan ketentuan maskapai penerbangan dan
                        tidak dapat kembali ke jadwal semula.
                      </p>
                    </li>
                    <li>
                      <p>
                        Golden Rama Tours &amp; Travel tidak menjamin konfirmasi
                        pesawat, hotel dan sebagainya bila peserta menghendaki
                        perpanjangan jadwal paket tour. Apabila permintaan
                        deviasi tidak dapat disetujui oleh pihak maskapai
                        penerbangan maka peserta secara otomatis akan kembali ke
                        jadwal semula.
                      </p>
                    </li>
                    <li>
                      <p>
                        Deviasi yang akan mempersingkat jadwal paket tour, tidak
                        diberikan pengurangan biaya dari biaya paket standar
                        semula.
                      </p>
                    </li>
                  </ol>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"20px"}>
              <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                <AccordionButton>
                  <Box flex="1" fontWeight={"bold"} textAlign="left">
                    Pembatalan
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel py={"16px"}>
                <Stack px={"24px"} spacing={"24px"}>
                  <p>
                    Jika terjadi pembatalan acara tour oleh peserta sebelum
                    tanggal keberangkatan maka biaya pembatalan adalah sebagai
                    berikut:
                  </p>
                  <ul>
                    <li>
                      <p>
                        Setelah pendaftaran : Uang muka pendaftaran (Non
                        Refundable)
                      </p>
                    </li>
                    <li>
                      <p>
                        30-15 hari kalender sebelum tanggal keberangkatan &nbsp;
                        &nbsp; &nbsp; : 50% dari biaya tour
                      </p>
                    </li>
                    <li>
                      <p>
                        14-07 hari kalender sebelum tanggal keberangkatan &nbsp;
                        &nbsp; &nbsp; : 75% dari biaya tour
                      </p>
                    </li>
                    <li>
                      <p>
                        06-00 hari kalender sebelum tanggal keberangkatan &nbsp;
                        &nbsp; &nbsp; : 100% dari biaya tour
                      </p>
                    </li>
                  </ul>
                  <p>Biaya pembatalan di atas juga berlaku bagi:</p>
                  <ol>
                    <li>
                      <p>
                        Peserta yang mengganti tanggal keberangkatan atau
                        mengganti paket/jenis tour.
                      </p>
                    </li>
                    <li>
                      <p>
                        Peserta yang terlambat memberikan persyaratan visa dari
                        batas waktu yang telah ditentukan Golden Rama Tours
                        &amp; Travel dan mengakibatkan peserta tidak dapat
                        berangkat tepat pada waktunya karena permohonan visa
                        masih diproses oleh kedutaan.
                      </p>
                    </li>
                    <li>
                      <p>
                        Pembatalan yang dilakukan oleh salah satu pihak (peserta
                        atau Golden Rama Tours &amp; Travel) karena bencana
                        alam, perang, wabah penyakit, aksi teroris atau keadaan
                        &lsquo;Force Majeure&rsquo; lainnya. Jika hal-hal
                        tersebut terjadi maka ketentuan-ketentuan di atas dapat
                        berubah sewaktu-waktu tanpa pemberitahuan terlebih
                        dahulu, tergantung dari kebijakan pihak maskapai
                        penerbangan, hotel dan agen di luar negeri.
                      </p>
                    </li>
                  </ol>
                  <p>
                    (Force Majeure; Suatu kejadian yang terjadi di luar
                    kemampuan manusia dan tidak dapat dihindarkan sehingga suatu
                    kegiatan tidak dapat dilaksanakan sebagaimana mestinya).
                  </p>
                  <ol>
                    <li>
                      <p>
                        Golden Rama Tours &amp; Travel berhak membatalkan
                        pendaftaran peserta tour yang belum membayar uang muka
                        atau pelunasan sesuai batas waktu yang telah ditentukan
                        Golden Rama Tours &amp; Travel.
                      </p>
                    </li>
                    <li>
                      <p>
                        Bila permohonan visa ditolak, sedangkan tiket sudah
                        diterbitkan sebelumnya karena keharusan sehubungan
                        dengan tenggat waktu yang ditentukan maskapai
                        penerbangan, maka biaya visa tidak dapat dikembalikan
                        dan peserta juga mempunyai kewajiban untuk menanggung
                        biaya lainnya yang muncul sesuai dengan peraturan dari
                        maskapai penerbangan, hotel dan agen perjalanan di luar
                        negeri.
                      </p>
                    </li>
                    <li>
                      <p>
                        Uang muka pendaftaran peserta tidak dapat dikembalikan
                        bila peserta melakukan pembatalan secara sepihak.
                      </p>
                    </li>
                  </ol>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"20px"}>
              <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                <AccordionButton>
                  <Box flex="1" fontWeight={"bold"} textAlign="left">
                    Pengembalian Uang
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel py={"16px"}>
                <Stack px={"24px"} spacing={"24px"}>
                  <ol>
                    <li>
                      <p>
                        Tiket pesawat udara, kereta api, dan transportasi
                        lainnya serta akomodasi yang tidak terpakai tidak dapat
                        diuangkan kembali (non-refundable).
                      </p>
                    </li>
                    <li>
                      <p>
                        Bila calon peserta tour berhalangan/sakit sebelum
                        tanggal keberangkatan yang dijadwalkan maka pengembalian
                        uang/biaya pembatalan, akan mengacu kepada pasal
                        pembatalan.
                      </p>
                    </li>
                    <li>
                      <p>
                        Bila ada pelayanan dalam paket yang tidak digunakan oleh
                        para peserta dikarenakan berhalangan atau sakit selama
                        perjalanan, para peserta tidak berhak menuntut uang
                        kembali.
                      </p>
                    </li>
                    <li>
                      <p>
                        peserta tour yang tidak diijinkan masuk atau dikenakan
                        tindakan deportasi oleh pihak imigrasi Negara setempat
                        (walaupun sudah memiliki visa), atau yang ditolak oleh
                        perusahaan penerbangan, atau dalam perjalanan menderita
                        sakit, atau ada kelainan jiwa, atau dalam perjalanan
                        mengalami kecelakaan, yang terpaksa harus kembali atau
                        menyimpang dari perjalanan yang telah ditentukan dalam
                        acara tour, atau terpaksa membatalkan sebagian/hampir
                        seluruh perjalanan setelah keberangkatan, tidak berhak
                        atas pengembalian uang atau bentuk pengembalian lain
                        apapun atas jasa-jasa yang belum atau tidak digunakan.
                      </p>
                    </li>
                  </ol>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"20px"}>
              <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                <AccordionButton>
                  <Box flex="1" fontWeight={"bold"} textAlign="left">
                    Hal-hal Lainnya
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel py={"16px"}>
                <Stack px={"24px"} spacing={"24px"}>
                  <p>
                    Pihak Golden Rama Tours &amp; Travel dan seluruh agen tidak
                    bertanggung jawab dan tidak bisa dituntut atas:
                  </p>
                  <ol>
                    <li>
                      <p>
                        Kecelakaan, kehilangan koper dan keterlambatan tibanya
                        koper akibat tindakan pihak maskapai penerbangan atau
                        alat pengangkutan lainnya, maka standard penggantian
                        didasarkan pada ketentuan maskapai penerbangan
                        internasional atau penyedia jasa pengangkutan yang
                        digunakan.
                      </p>
                    </li>
                    <li>
                      <p>
                        Kehilangan barang pribadi, koper, titipan barang di
                        airport, hotel dan tindakan kriminal yang menimpa
                        peserta tour selama perjalanan.
                      </p>
                    </li>
                    <li>
                      <p>
                        Keterlambatan atau pembatalan jadwal penerbangan, dan
                        seluruh kejadian yang terjadi di luar kuasa pihak Golden
                        Rama Tours &amp; Travel.
                      </p>
                    </li>
                    <li>
                      <p>
                        Perubahan atau berkurangnya acara perjalanan akibat dari
                        bencana alam, kerusuhan dan lain sebagainya yang
                        bersifat &lsquo;Force Majeure&rsquo;.
                      </p>
                    </li>
                    <li>
                      <p>
                        Meninggalkan peserta akibat sakit yang diderita atau
                        kecelakaan selama dalam tour.
                      </p>
                    </li>
                  </ol>
                  <p>
                    Pihak Golden Rama Tours &amp; Travel dan seluruh agen
                    berhak:
                  </p>
                  <ol>
                    <li>
                      <p>
                        Demi kenyamanan dan kelancaran perencanaan perjalanan
                        tour, Golden Rama Tours &amp; Travel berhak untuk
                        menerbitkan tiket pesawat, kereta api dan transportasi
                        lainnya, akomodasi, tiket masuk objek wisata tanpa
                        melakukan konfirmasi lisan maupun tertulis kepada
                        pendaftar yang telah melakukan deposit. &nbsp;
                      </p>
                    </li>
                    <li>
                      <p>
                        Membatalkan tanggal keberangkatan tour, apabila jumlah
                        peserta kurang dari 15 peserta dewasa, dan biaya tour
                        yang telah dibayarkan akan dikembalikan seluruhnya.
                      </p>
                    </li>
                    <li>
                      <p>
                        Demi kenyamanan dan kelancaran perencanaan perjalanan
                        tour, Golden Rama Tours &amp; Travel berhak meminta
                        peserta tour untuk keluar dari rombongan apabila peserta
                        tour yang bersangkutan mencoba membuat kerusuhan,
                        mengacaukan acara tour, meminta dengan paksa, dan
                        memberikan informasi yang tidak benar mengenai acara
                        tour, dll.
                      </p>
                    </li>
                    <li>
                      <p>
                        Mengganti hotel-hotel yang akan digunakan berhubung
                        hotel tersebut sudah penuh dan mengganti dengan hotel
                        lain yang setaraf sesuai dengan pertimbangan dan
                        konfirmasi. Apabila dalam periode tour di kota-kota yang
                        dikunjungi sedang berlangsung pameran/konferensi maka
                        akan diganti dengan hotel-hotel lain yang setaraf di
                        kota-kota terdekat.
                      </p>
                    </li>
                    <li>
                      <p>
                        Jadwal tour dapat berubah sewaktu-waktu mengikuti
                        kondisi yang memungkinkan dengan tanpa mengurangi isi
                        dalam acara tour tersebut.
                      </p>
                    </li>
                    <li>
                      <p>
                        Pihak Golden Rama Tours &amp; Travel berhak menagih
                        selisih harga tour dan lain-lainnya (jika terjadi
                        kenaikan harga tour, airport tax, dll) kepada calon
                        peserta.
                      </p>
                    </li>
                  </ol>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </CustomFilterButton>
    </>
  );
};
