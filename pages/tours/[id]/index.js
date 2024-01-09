import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Divider,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
  ShareButton,
  WishlistButton,
} from "../../../src/components/button";
import {
  CustomTags,
  CustomTagsOutlineIcon,
} from "../../../src/components/tags";
import { Fragment, useState } from "react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  addDaysWithMonthName,
  convertDateWithMonthName,
  convertRupiah,
  getMealString,
} from "../../../src/helpers";
import { format, parse } from "date-fns";
import {
  getSlugTours,
  getTourBySlugV2,
  getTourBySlugWithIteneraryV2,
} from "../../../src/services/tour.service";

import AirlineIcon from "../../../public/svg/icons/airline.svg";
import AirlineOutlineIcon from "../../../public/svg/icons/airline-outline.svg";
import ChevronRightIcon from "../../../public/svg/icons/chevron-right.svg";
import FoodIcon from "../../../public/svg/icons/food.svg";
import Image from "next/image";
import InfoIcon from "../../../public/svg/icons/info.svg";
import Layout from "../../../src/components/layout";
import LuggageIcon from "../../../public/svg/icons/luggage.svg";
import MapIcon from "../../../public/svg/icons/map.svg";
import NextLink from "next/link";
import { TnC } from "../../../src/components/card";
import { TourDetailOrder } from "../../../src/components/form";
import WeatherIcon from "../../../public/svg/icons/weather.svg";
import { checkoutData } from "../../../src/state/tour/tour.slice";
import { redirect } from "next/dist/server/api-utils";
import { useDispatch } from "react-redux";
import { useLoginToast } from "../../../src/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useRouter } from "next/router";
import IMAGE_PLACEHOLDER from "public/jpg/header-tour.jpg"

const TourDetail = (props) => {
  const { details, meta } = props;
  const router = useRouter();
  const [departure, setDeparture] = useState(0);
  const { id } = router.query;
  const formRef = useRef();
  const initialValues = {
    departure_date: departure,
    participants: {
      children: 0,
      adults: 1,
    },
  };

  const dispatch = useDispatch();
  const loginToast = useLoginToast();

  const [imageError, setImageError] = useState(false);

  const handleSubmit = (values, action) => {
    try {
      dispatch(checkoutData({ tourDetail: { ...values, slug: id } }));
      router.push({ pathname: "/tours/order-details" });
    } catch (error) {
      console.error(error);
      action.setSubmitting(false);
    }
  };

  const tour = useQuery(["getTour", id, initialValues], async () => {
    const response = details;
    if (initialValues.departure_date == 0)
      setDeparture(response.departures[0].id);
    return Promise.resolve(response);
  });
  // console.log("🚀 ~ file: index.js:110 ~ tour ~ tour:", tour);

  const itenerary = useQuery(["getItenerary", id, departure], async () => {
    let slug = {
      tourSlug: id,
      departureId: departure,
    };
    const result = await getTourBySlugWithIteneraryV2(slug);
    return Promise.resolve(result);
  });
  // console.log(
  // "🚀 ~ file: index.js:120 ~ itenerary ~ itenerary:",
  // itenerary.data?.departure?.itineraries?.[0]?.flights?.[0]?.airline?.name
  // );

  const handleSelect = (value) => {
    setDeparture(parseInt(value));
  };

  const formatTime = (dateString) => {
    const dateStr = dateString;

    // Parse the date string into a Date object
    const date = new Date(
      dateStr.replace(
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5:$6"
      )
    );

    // Format the date using date-fns
    const formattedTime = format(date, "HH:mm");
    return formattedTime;
  };

  const formatDate = (dateString) => {
    const dateStr = dateString;

    // Parse the date string into a Date object
    const date = new Date(
      dateStr.replace(
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5:$6"
      )
    );

    // Format the date using date-fns
    const formattedTime = format(date, "dd MMM yyyy");
    return formattedTime;
  };

  return (
    <>
      <Layout
        type={"nested"}
        pagetitle={tour?.data?.name || "Rincian Paket Perjalanan"}
        meta={meta}
      >
        <SimpleGrid
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          position={"relative"}
          spacing={4}
          flexWrap={"wrap"}
          columns={[1, 1, 1, 2]}
        >
          <GridItem colSpan={[1, 2]}>
            <SimpleGrid columns={[1, 2]} spacing={4} position={"relative"}>
              <Stack columns={1} position={"relative"}>
                <Box
                  id={"banner-details-banner"}
                  as={"section"}
                  mx={{ base: "-24px", md: 0 }}
                  position={"relative"}
                >
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{
                      clickable: true,
                    }}
                    autoHeight={true}
                    navigation={true}
                    spaceBetween={0}
                    slidesPerView={1}
                  >
                    {!tour.isLoading ? (
                      tour.data?.pictures?.map((item, index) => (
                        <SwiperSlide key={index}>
                          <Box
                            position={"relative"}
                            shadow={"lg"}
                            height={"200px"}
                            overflow={"hidden"}
                          >
                            <Image
                              objectPosition={"center"}
                              objectFit="cover"
                              src={imageError ? IMAGE_PLACEHOLDER : item.url}
                              alt={item?.title}
                              layout={"fill"}
                              placeholder="empty"
                              onError={() => {
                                setImageError(true);
                              }}
                            />
                          </Box>
                        </SwiperSlide>
                      ))
                    ) : (
                      <Skeleton isLoaded={!tour.isLoading} p={4}>
                        <Box
                          position={"relative"}
                          shadow={"lg"}
                          height={"200px"}
                          overflow={"hidden"}
                        />
                      </Skeleton>
                    )}
                  </Swiper>
                  <HStack
                    zIndex={1}
                    p={"16px"}
                    position={"absolute"}
                    top={0}
                    right={0}
                  >
                    <WishlistButton data={tour.data} type="tour" slug={id} />
                    <ShareButton
                      url={window.location.href}
                      text={tour.data?.name}
                    />
                  </HStack>
                  <NextLink href={`${id}/gallery`}>
                    <LinkBox
                      as={"a"}
                      rel="canonical"
                      zIndex={1}
                      p="6px"
                      position="absolute"
                      bottom={0}
                      right={0}
                      bg="rgba(0, 0, 0, .78)"
                      borderTopLeftRadius="4px"
                      cursor="pointer"
                    >
                      <Text color="white" fontSize="xs" fontWeight="bold">
                        Semua Foto
                      </Text>
                    </LinkBox>
                  </NextLink>
                </Box>
                <Box id="tour-details" as={"section"}>
                  <Stack py={"16px"}>
                    <Stack pb={"10px"}>
                      <Wrap>
                        {tour.data?.tags.length > 0 &&
                          tour.data?.tags.map((item, index) => (
                            <Fragment key={index}>
                              {item.items.length > 0 &&
                                item.items.map((tag, index) => (
                                  <Box key={index}>
                                    <CustomTags>{tag.name}</CustomTags>
                                  </Box>
                                ))}
                            </Fragment>
                          ))}
                      </Wrap>
                      <Skeleton isLoaded={!tour.isLoading}>
                        <Heading fontSize={"2xl"} color={"neutral.text.high"}>
                          {tour.data?.name}
                        </Heading>
                      </Skeleton>
                      <Skeleton isLoaded={!tour.isLoading}>
                        <Text fontSize={{ base: "xs", md: "sm" }}>
                          {tour.data?.groups[0].name}
                        </Text>
                      </Skeleton>
                    </Stack>
                    <Divider my={"12px"} variant={"dashed"} />
                    <SimpleGrid pt={"10px"} spacingY={"16px"} columns={2}>
                      {/* {tour.data?.departures.length > 0 &&
                tour.data?.departures[0].airlines.length > 0 && ( */}
                      {itenerary.data?.departure?.itineraries?.[0]?.flights?.[0]
                        ?.airline?.name && (
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<AirlineIcon />}
                          isLoading={tour.isLoading}
                        >
                          {itenerary.data?.departure?.itineraries?.[0]
                            ?.flights?.[0]?.airline?.name ??
                            "Tidak ada airlines"}
                        </CustomTagsOutlineIcon>
                      )}
                      {/* )} */}
                      {/* {tour.data?.departures.length > 0 && ( */}
                      <CustomTagsOutlineIcon
                        color={"brand.blue.400"}
                        icon={<WeatherIcon />}
                        isLoading={tour.isLoading}
                      >
                        {`${tour.data?.departures[0].duration} Hari`}
                      </CustomTagsOutlineIcon>
                      {/* )} */}
                      {/* <CustomTagsOutlineIcon
                  color={"brand.blue.400"}
                  icon={<HotelIcon />}
                >
                  Hotel Bintang 4
                </CustomTagsOutlineIcon> */}
                      {/* {tour.data?.countries.length > 0 && ( */}
                      <CustomTagsOutlineIcon
                        color={"brand.blue.400"}
                        icon={<MapIcon />}
                        isLoading={tour.isLoading}
                      >
                        {`${tour.data?.countries.length} Negara`}
                      </CustomTagsOutlineIcon>
                      {/* )} */}
                      {/* <CustomTagsOutlineIcon
                  color={"brand.blue.400"}
                  icon={<TagIcon />}
                >
                  Photo Activity
                </CustomTagsOutlineIcon> */}
                      {/* {tour.data?.departures.length > 0 && ( */}
                      <CustomTagsOutlineIcon
                        color={"brand.blue.400"}
                        icon={<LuggageIcon />}
                        isLoading={tour.isLoading}
                      >
                        {`${tour.data?.departures.length} Keberangkatan`}
                      </CustomTagsOutlineIcon>
                      {/* )} */}
                    </SimpleGrid>
                  </Stack>
                  <Text
                    fontSize="sm"
                    dangerouslySetInnerHTML={{
                      __html: tour?.data?.description,
                    }}
                  />
                </Box>
              </Stack>
              <Box
                h={"fit-content"}
                position={"sticky"}
                top={"80px"}
                id="tour-order"
                as={"section"}
                p={"24px"}
                mx={{ base: "-24px", md: 0 }}
                // my={{ base: 0, md: 5 }}
                rounded={{ base: "none", md: "xl" }}
                bg={"brand.blue.100"}
              >
                {!tour.isLoading && !itenerary.isLoading && (
                  <TourDetailOrder
                    handleSubmit={handleSubmit}
                    innerRef={formRef}
                    initialValues={initialValues}
                    handleSelect={handleSelect}
                    departures={tour?.data?.departures}
                    price={itenerary?.data?.departure?.prices}
                  />
                )}
              </Box>
            </SimpleGrid>
          </GridItem>
          <GridItem
            colSpan={[1, 2]}
            id={"tour-itenerary-details"}
            as={"section"}
          >
            <Stack
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
            >
              <Heading color={"brand.blue.400"} fontSize={"20px"}>
                Itinerary Perjalanan
              </Heading>
              <Accordion allowMultiple mx={"0px"}>
                {!itenerary.isLoading &&
                  itenerary.data?.departure?.itineraries.map((item, index) => (
                    <AccordionItem
                      mx={"-24px"}
                      key={index}
                      border={0}
                      pb={"20px"}
                    >
                      <Heading
                        fontWeight={"bold"}
                        color={"brand.blue.400"}
                        as={"h2"}
                      >
                        <AccordionButton
                          flex={1}
                          px={"24px"}
                          justifyContent={"space-between"}
                        >
                          <Stack
                            direction={"row"}
                            spacing={"12px"}
                            fontFamily={"body"}
                            textAlign="left"
                            fontSize={"sm"}
                          >
                            <Text
                              color={"neutral.text.low"}
                              flexShrink={0}
                              as={"span"}
                            >
                              Hari {item.dayNumber}
                            </Text>{" "}
                            <Text as={"span"} color={"brand.orange.400"}>
                              {item.title}
                            </Text>
                          </Stack>
                          <AccordionIcon />
                        </AccordionButton>
                      </Heading>
                      <AccordionPanel px={"24px"} py={"16px"}>
                        <Stack spacing={"24px"}>
                          <Text
                            fontSize={"sm"}
                            fontWeight={"normal"}
                            color={"brand.blue.400"}
                            as={"h4"}
                          >
                            {addDaysWithMonthName(
                              itenerary.data?.departure?.date,
                              index
                            )}
                          </Text>
                          <Text
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                          <Divider my={"10px"} variant={"dashed"} />
                          <HStack spacing={"6px"}>
                            <FoodIcon />
                            <Text
                              color={"neutral.text.low"}
                              fontWeight={"normal"}
                            >
                              {getMealString(item.meal)}
                            </Text>
                          </HStack>
                          {item.flights.length > 0 && item.flights && (
                            <Stack spacing={"6px"} direction={"row"}>
                              <AirlineOutlineIcon />
                              <Stack>
                                <Text
                                  color={"neutral.text.high"}
                                  fontWeight={"normal"}
                                >
                                  Detail Penerbangan
                                </Text>

                                {/* Todo: fix format date */}
                                <Text>
                                  {`${item.flights[0].airline.code} | ${
                                    item.flights[0].origin.code
                                  } - ${item.flights[0].destination.code} ${
                                    item.flights[0].departsAt
                                      ? formatDate(item.flights[0].departsAt)
                                      : ""
                                  } - ${
                                    item.flights[0].arrivesAt
                                      ? formatDate(item.flights[0].arrivesAt)
                                      : ""
                                  }`}{" "}
                                  {" | "}
                                  {formatTime(item.flights[0].departsAt)} -{" "}
                                  {formatTime(item.flights[0].arrivesAt)}
                                </Text>
                              </Stack>
                            </Stack>
                          )}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
              </Accordion>
            </Stack>
          </GridItem>
        </SimpleGrid>
        <Box
          id={"tour-price"}
          mx={"-24px"}
          p={"24px"}
          as={"section"}
          bg={"brand.blue.100"}
        >
          <Box mx={"auto"} maxW={{ lg: "container-lg", xl: "container.xl" }}>
            <Stack spacing={"5px"}>
              <Heading
                color={"brand.blue.400"}
                fontWeight={"bold"}
                fontSize={{ base: "md", md: "lg" }}
              >
                Harga Tour
              </Heading>
              {itenerary.data?.departure?.startingPriceDiscount ? (
                <Text
                  fontSize={"sm"}
                  color="neutral.text.low"
                  textDecor={"line-through"}
                >
                  {`IDR ${convertRupiah(
                    itenerary?.data?.departure?.startingPriceOriginal
                  )}`}
                </Text>
              ) : (
                <></>
              )}
              <Skeleton isLoaded={!itenerary.isLoading}>
                <Text
                  as={Heading}
                  color={"brand.orange.400"}
                  fontWeight={"bold"}
                  fontSize={"24px"}
                >
                  {`IDR ${convertRupiah(
                    itenerary?.data?.departure?.startingPrice
                  )}`}
                  <chakra.span
                    fontWeight={"normal"}
                    textColor={"neutral.text.low"}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    /pax
                  </chakra.span>
                </Text>
              </Skeleton>

              {/* {!isLoading ? (
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.low"}
                >
                  Grand Total IDR {convertRupiah(totalPrice)}
                </Text>
              ) : (
                <Spinner></Spinner>
              )} */}
            </Stack>
          </Box>
        </Box>
        <Box id={"tour-itenerary"} as={"section"} my={"16px"}>
          {!itenerary.isLoading ? (
            <Stack
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
            >
              <Accordion
                defaultIndex={[0]}
                allowMultiple
                mx={"-24px"}
                px={"12px"}
              >
                <AccordionItem border={0} pb={"20px"}>
                  <Heading
                    fontWeight={"bold"}
                    color={"brand.blue.400"}
                    as={"h2"}
                  >
                    <AccordionButton>
                      <Box flex="1" fontWeight={"bold"} textAlign="left">
                        Detail Harga
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel py={"16px"}>
                    <Stack spacing={"24px"}>
                      <TableContainer fontSize={"sm"}>
                        <Table variant={"simple"}>
                          <Thead>
                            <Tr>
                              <Th
                                fontFamily={"body"}
                                fontWeight={"normal"}
                                fontSize={"sm"}
                                color={"brand.blue.400"}
                                textTransform={"capitalize"}
                                px={0}
                                border={0}
                                colSpan={2}
                              >
                                Dewasa
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Twin Sharing
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {convertRupiah(
                                  itenerary?.data?.departure?.prices
                                    ?.adultTwinSharing?.price ?? 0
                                )}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Single
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {convertRupiah(
                                  itenerary?.data?.departure?.prices
                                    ?.adultSingle?.price ?? 0
                                )}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <TableContainer fontSize={"sm"}>
                        <Table variant={"simple"}>
                          <Thead>
                            <Tr>
                              <Th
                                fontFamily={"body"}
                                fontWeight={"normal"}
                                fontSize={"sm"}
                                color={"brand.blue.400"}
                                textTransform={"capitalize"}
                                px={0}
                                border={0}
                                colSpan={2}
                              >
                                Anak-anak
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Twin Sharing
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {convertRupiah(
                                  itenerary?.data?.departure?.prices
                                    ?.childTwinSharing?.price ?? 0
                                )}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                No Bed
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {convertRupiah(
                                  itenerary?.data?.departure?.prices?.childNoBed
                                    ?.price ?? 0
                                )}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <TableContainer fontSize={"sm"}>
                        <Table variant={"simple"}>
                          <Thead>
                            <Tr>
                              <Th
                                fontFamily={"body"}
                                fontWeight={"normal"}
                                fontSize={"sm"}
                                color={"brand.blue.400"}
                                textTransform={"capitalize"}
                                px={0}
                                border={0}
                                colSpan={2}
                              >
                                Lainnya
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Down Payment (per pax)
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {convertRupiah(
                                  itenerary?.data?.departure?.prices
                                    ?.downPayment?.price ?? 0
                                )}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Pajak
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {itenerary?.data?.departure?.prices
                                  ?.vatPercent > 0
                                  ? `${itenerary?.data?.departure?.prices?.vatPercent}%`
                                  : "Sudah termasuk"}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Airport Tax
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {itenerary?.data?.departure?.prices
                                  ?.airportTaxAndFuel?.price > 0
                                  ? convertRupiah(
                                      itenerary?.data?.departure?.prices
                                        ?.airportTaxAndFuel?.price
                                    )
                                  : "Sudah termasuk"}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Swab
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {itenerary?.data?.departure?.prices?.swab > 0
                                  ? convertRupiah(
                                      itenerary?.data?.departure?.prices
                                        ?.swab ?? 0
                                    )
                                  : "Sudah termasuk"}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td px={0} py={"8px"} border={0}>
                                Visa
                              </Td>
                              <Td
                                px={0}
                                py={"8px"}
                                textAlign={"right"}
                                border={0}
                              >
                                {itenerary?.data?.departure?.prices?.visa
                                  ?.price > 0
                                  ? convertRupiah(
                                      itenerary?.data?.departure?.prices?.visa
                                        ?.price ?? 0
                                    )
                                  : "Sudah termasuk"}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
                {/* <AccordionItem border={0} pb={"20px"}>
                  <Heading
                    fontWeight={"bold"}
                    color={"brand.blue.400"}
                    as={"h2"}
                  >
                    <AccordionButton>
                      <Box flex="1" fontWeight={"bold"} textAlign="left">
                        Termasuk Dalam Tour
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel py={"16px"}>
                    <Stack spacing={"24px"}></Stack>
                  </AccordionPanel>
                </AccordionItem> */}
                {/* <AccordionItem border={0} pb={"20px"}>
                  <Heading
                    fontWeight={"bold"}
                    color={"brand.blue.400"}
                    as={"h2"}
                  >
                    <AccordionButton>
                      <Box flex="1" fontWeight={"bold"} textAlign="left">
                        Tidak Termasuk Dalam Tour
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel py={"16px"}>
                    <Stack spacing={"24px"}></Stack>
                  </AccordionPanel>
                </AccordionItem> */}
                {/* <AccordionItem border={0} pb={"20px"}>
                  <Heading
                    fontWeight={"bold"}
                    color={"brand.blue.400"}
                    as={"h2"}
                  >
                    <AccordionButton>
                      <Box flex="1" fontWeight={"bold"} textAlign="left">
                        Syarat dan Ketentuan
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel py={"16px"}>
                    <HStack justifyContent="space-between">
                      <Stack lineHeight={1}>
                        <Text fontSize="sm" fontWeight="semibold">
                          Syarat dan Ketentuan Tour.pdf
                        </Text>
                        <Text fontSize="sm">0.3 Mb</Text>
                      </Stack>
                      <a
                        href="/Syarat%20dan%20Ketentuan%20Tour.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button>Unduh</Button>
                      </a>
                    </HStack>
                  </AccordionPanel>
                </AccordionItem> */}
                {/* <AccordionItem border={0} pb={"20px"}>
                  <Heading
                    fontWeight={"bold"}
                    color={"brand.blue.400"}
                    as={"h2"}
                  >
                    <AccordionButton>
                      <Box flex="1" fontWeight={"bold"} textAlign="left">
                        Detail Harga
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel py={"16px"}>
                    <Stack spacing={"24px"}></Stack>
                  </AccordionPanel>
                </AccordionItem> */}
              </Accordion>
            </Stack>
          ) : (
            <Center p={4}>
              <Spinner />
            </Center>
          )}
        </Box>
        <Box
          bg={"brand.blue.100"}
          mx={"-24px"}
          px={"24px"}
          id={"terms-and-conditions"}
          py={"24px"}
          mb={"4px"}
          as={"section"}
        >
          <TnC />
        </Box>
        <Stack
          mx={{ base: "-24px", md: "auto" }}
          px={"24px"}
          pt={"24px"}
          roundedTop="xl"
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          position={{ base: "sticky", md: "sticky" }}
          bottom={0}
          bg={"white"}
          pb={"20px"}
          spacing={"12px"}
        >
          <CustomOrangeFullWidthButton
            isLoading={formRef.current && formRef.current.isSubmitting}
            disabled={formRef.current && formRef.current.isSubmitting}
            onClick={() => loginToast(formRef.current.handleSubmit)}
          >
            Pesan
          </CustomOrangeFullWidthButton>
          <CustomOrangeFullWidthButton
            as={Link}
            isExternal
            href="https://wa.me/6281511221133"
            isoutlined={true}
            border={0}
          >
            Hubungi Golden Rama E-Travel Assistant
          </CustomOrangeFullWidthButton>
        </Stack>
        {/* <CustomDivider /> */}
      </Layout>
    </>
  );
};

export default TourDetail;

// export const getStaticPaths = async () => {
//   const tours = await getSlugTours();
//   console.log('itemtour3', tours)
//   const paths = tours.map((tour) => ({
//     params: { id: tour.slug },
//   }));
//   return {
//     paths,
//     fallback: "blocking",
//   };
// };

// export const getStaticProps = async (ctx) => {
//   const { id } = ctx.params;
//   let slug = {
//     tourSlug: id,
//   };
//   const details = await getTourBySlugV2(slug);

//   if (!details) {
//     return {
//       redirect: {
//         destination: '/404',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       details,
//       meta: {
//         title: details?.name || "",
//         description: details?.description || "",
//         image: details?.pictures?.[0]?.thumbnailUrl || "",
//       },
//     },
//     revalidate: true,
//   };
// };

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.params;
  let slug = {
    tourSlug: id,
  };

  try {
    const details = await getTourBySlugV2(slug);

    if (
      !details ||
      details?.departures?.length < 1 ||
      details?.groups?.length < 1
    ) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      props: {
        details,
        meta: {
          title: details?.name || "",
          description: details?.description || "",
          image: details?.pictures?.[0]?.thumbnailUrl || "",
        },
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};
