import {
  chakra,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  GridItem,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Center,
  Spinner,
  TableContainer,
  Table,
  AccordionIcon,
  Tbody,
  Tr,
  Td,
  Link,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  CustomOrangeFullWidthButton,
  ShareButton,
  WishlistButton,
} from "../../../src/components/button";
import { BannerAllPhotos, TnC } from "../../../src/components/card";
import LuggageIcon from "../../../public/svg/icons/luggage.svg";
import MapIcon from "../../../public/svg/icons/map.svg";
import WeatherIcon from "../../../public/svg/icons/weather.svg";
import HotelIcon from "../../../public/svg/icons/hotel.svg";
import TagsIcon from "../../../public/svg/icons/tags.svg";
import ShipIcon from "../../../public/svg/icons/cruise.svg";
import Layout from "../../../src/components/layout";
import {
  CustomTags,
  CustomTagsOutlineIcon,
} from "../../../src/components/tags";
import {
  getAllPackages,
  getPackageDetail,
} from "../../../src/services/package.service";
import { PackageDetailOrder } from "../../../src/components/form";
import * as Yup from "yup";
import { Formik, useFormikContext } from "formik";
import { checkoutData } from "../../../src/state/package/package.slice";
import { useDispatch } from "react-redux";
import { useLoginToast } from "../../../src/hooks";

const PackagesDetail = (props) => {
  const { detail } = props;
  const loginToast = useLoginToast();
  const toast = useToast();
  const router = useRouter();
  const { query } = router;
  const [initialValues, setInitialValues] = useState({
    departures: detail.departures[0].date,
    participants: {
      children: 0,
      adults: 1,
    },
    packages: {},
    type: {
      name: "",
      pax: "",
      price: 0,
    },
  });
  const packagePriceRef = useRef();
  const packages = useQuery(["getPackageDetail", query.slug], async () => {
    // const response = await getPackageDetail(query.slug);
    const response = detail;
    return Promise.resolve(response);
  });
  const formRef = useRef();
  const dispatch = useDispatch();
  const handleSubmit = (values, action) => {
    if (!values.type.name)
      return toast({
        title: "Pilih tipe paket terlebih dahulu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    try {
      dispatch(
        checkoutData({
          packageDetail: {
            ...values,
            slug: query.slug,
            package: packages.data,
            departures: packages.data.departures
              .filter((item) => {
                return item.date === values.departures;
              })
              .reduce((obj, item) => ((obj = item), obj), {}),
          },
        })
      );
      router.push({ pathname: "/packages/order-details" });
    } catch (error) {
      console.error(error);
      action.setSubmitting(false);
    }
  };
  const Itineraries = () => {
    const formik = useFormikContext();
    return (
      <>
        {formik.values.departures && (
          <GridItem
            pb={"24px"}
            colSpan={[1, 2]}
            id={"package-itenerary-details"}
            as={"section"}
          >
            <Stack
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
            >
              <Heading color={"brand.blue.400"} fontSize={"20px"}>
                Itinerary Perjalanan
              </Heading>
              <Accordion allowMultiple mx={"-24px"} gap={"20px"}>
                {!packages.isLoading &&
                  packages.data &&
                  packages.data?.departures
                    .filter((item) => {
                      // if (item.date === formik?.values?.departures) {
                      //   return item;
                      // }
                      return item.date === formik?.values?.departures;
                    })[0]
                    .itineraries.map((item, index) => (
                      <AccordionItem mx={"-24px"} key={index} border={0}>
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
                                Hari {item.day}
                              </Text>
                              <Text
                                as={"span"}
                                color={"brand.orange.400"}
                                textTransform={"uppercase"}
                              >
                                {item.name}
                              </Text>
                            </Stack>
                            <AccordionIcon />
                          </AccordionButton>
                        </Heading>
                        <AccordionPanel px={"24px"} py={"16px"}>
                          <Stack spacing={"24px"}>
                            <Text
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            />
                          </Stack>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
              </Accordion>
              <Text color={"neutral.text.medium"} fontSize="sm">
                <b>Note</b>: program acara dapat berubah sewaktu – waktu
                tergantung kondisi cuaca pada saat tour berlangsung.
              </Text>
            </Stack>
          </GridItem>
        )}
      </>
    );
  };
  const DetailPackageList = () => {
    const formik = useFormikContext();
    const startingPrice = parseInt(
      _.sortBy(
        packages.data?.departures?.filter((item) => {
          return item.date === formik.values.departures;
        })[0]?.types,
        "startingPrice"
      )[0]?.startingPrice
    ).toLocaleString("id-ID", {
      maximumFractionDigits: 0,
    });
    return (
      <>
        <Stack spacing={"5px"}>
          <Heading
            color={"brand.blue.400"}
            fontWeight={"bold"}
            fontSize={{ base: "md", md: "lg" }}
          >
            Pilihan Paket Mulai Dari
          </Heading>
          <Skeleton isLoaded={!packages.isLoading}>
            <Stack pb={"24px"} spacing={"24px"}>
              <Text
                as={Heading}
                color={"brand.orange.400"}
                fontWeight={"bold"}
                fontSize={"24px"}
              >
                {`IDR ${packages.data && startingPrice}`}
                <chakra.span
                  fontWeight={"normal"}
                  textColor={"neutral.text.low"}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  /pax
                </chakra.span>
              </Text>
              <Text fontSize={"sm"} color="neutral.text.medium">
                <b>Catatan</b> : Harga tertera merupakan harga Mulai dari dan
                dapat berubah sewaktu-waktu mengikuti harga dan ketersediaan
                pada saat pemesanan.
              </Text>
            </Stack>
          </Skeleton>
        </Stack>
        <Stack spacing="24px">
          {packages.data?.departures
            .filter((item) => {
              return item.date === formik?.values?.departures;
            })[0]
            .types.map((item, index) => (
              <Stack
                key={index}
                p="16px"
                bg="white"
                rounded="xl"
                spacing="12px"
              >
                <Text fontWeight={"bold"} color="neutral.text.high">
                  {item.name}
                </Text>
                <Text
                  px="16px"
                  dangerouslySetInnerHTML={{
                    __html: item.description,
                  }}
                />
                <Divider variant={"dashed"} />
                <Flex
                  key={index}
                  justifyContent={"space-between"}
                  alignItems="center"
                  w="full"
                >
                  <Stack w="full">
                    <Text color="neutral.text.low" fontSize={"xs"}>
                      Harga Mulai Dari
                    </Text>
                    {(item.prices || []).map((price, index) => {
                      const type = {
                        name: item.name,
                        pax: price.name,
                        price: price.value,
                      };
                      const isChoosed =
                        formik.values.type.name === item.name &&
                        formik.values.type.pax === price.name;
                      return (
                        <Skeleton
                          as={HStack}
                          key={index}
                          isLoaded={!packages.isLoading}
                          justifyContent={"space-between"}
                          w="full"
                        >
                          <Stack spacing={0}>
                            <Text
                              fontWeight={"semibold"}
                              color="brand.blue.400"
                            >
                              {price.name}
                            </Text>
                            <Text fontWeight={"bold"} color="brand.orange.400">
                              IDR{" "}
                              {parseInt(price.value).toLocaleString("id-ID", {
                                maximumFractionDigits: 0,
                              })}
                            </Text>
                          </Stack>
                          <Button
                            colorScheme="brand.orange"
                            color={isChoosed ? "brand.orange.400" : "white"}
                            bg={isChoosed ? "white" : "brand.orange.400"}
                            borderWidth="1px"
                            borderColor="brand.orange.400"
                            size="sm"
                            fontWeight="normal"
                            onClick={() => formik.setFieldValue("type", type)}
                            disabled={isChoosed}
                          >
                            Pilih
                          </Button>
                        </Skeleton>
                      );
                    })}
                  </Stack>
                  {/* <Stack>
                    <Skeleton isLoaded={!packages.isLoading}>
                      <CustomOrangeFullWidthButton
                        w="min-content"
                        mt={0}
                        onClick={(val) => {
                          formik.setFieldValue("packages", item);
                          formik.submitForm();
                        }}
                      >
                        Pilih
                      </CustomOrangeFullWidthButton>
                    </Skeleton>
                  </Stack> */}
                </Flex>
              </Stack>
            ))}
        </Stack>
      </>
    );
  };

  const WrapperWishlist = () => {
    const formik = useFormikContext();
    const startingPrice = parseInt(
      _.sortBy(
        packages.data?.departures?.filter((item) => {
          return item.date === formik.values.departures;
        })[0]?.types,
        "startingPrice"
      )[0]?.startingPrice
    );

    return (
      <WishlistButton
        data={{ ...packages.data, startingPrice: `${startingPrice}` }}
        type="package"
        slug={query.slug}
      />
    );
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const sortedHotelStars = packages.data?.departures[0].itineraries
    ?.filter((i) => i.hotelStars)
    ?.sort((a, b) => a.hotelStars - b.hotelStars);
  const rangeHotelStar = {
    min: sortedHotelStars?.[0]?.hotelStars || null,
    max: sortedHotelStars?.[sortedHotelStars?.length - 1]?.hotelStars || null,
  };
  const rangeHotelStarStr =
    rangeHotelStar.min === rangeHotelStar.max
      ? rangeHotelStar.min
      : `${rangeHotelStar.min} - ${rangeHotelStar.max}`;
  return (
    <Layout
      type={"nested"}
      pagetitle={packages.data?.name || "Detail Package"}
      meta={{
        title: packages.data?.metatitle,
        description: packages.data?.metadescription,
        keyword: packages.data?.metakeyword,
      }}
    >
      <Formik
        innerRef={formRef}
        validationSchema={() =>
          Yup.object().shape({
            departures: Yup.string().required(
              "Tanggal keberangkatan harap diisi"
            ),
            participants: Yup.object({
              adults: Yup.number()
                .min(1, "Peserta dewasa harus diisi")
                .required("Peserta dewasa harus diisi"),
              children: Yup.number().notRequired(),
            }),
          })
        }
        initialValues={initialValues}
        onSubmit={(val) => handleSubmit(val)}
      >
        <>
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
                      {!packages.isLoading ? (
                        packages.data?.pictures ? (
                          packages.data?.pictures.map((item, index) => (
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
                                  src={`${BASE_URL}${item.url}`}
                                  alt={item.title}
                                  layout={"fill"}
                                />
                              </Box>
                            </SwiperSlide>
                          ))
                        ) : (
                          <Box
                            position={"relative"}
                            shadow={"lg"}
                            height={"200px"}
                            overflow={"hidden"}
                          >
                            <Image
                              objectPosition={"center"}
                              objectFit="cover"
                              src={"https://dummyimage.com/400x180"}
                              alt={"No Image"}
                              layout={"fill"}
                            />
                          </Box>
                        )
                      ) : (
                        <Skeleton isLoaded={!packages.isLoading} p={4}>
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
                      <WrapperWishlist />
                      <ShareButton
                        url={window.location.href}
                        text={packages.data?.title}
                      />
                    </HStack>
                    <NextLink href={`${query.slug}/gallery`}>
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
                        <LinkOverlay
                          color="white"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          Semua Foto
                        </LinkOverlay>
                      </LinkBox>
                    </NextLink>
                  </Box>
                  <Box id="package-details" as="section">
                    <Stack py={"16px"}>
                      <Stack pb={"10px"}>
                        <Box>
                          <CustomTags>{packages.data?.category}</CustomTags>
                        </Box>
                        <Skeleton isLoaded={!packages.isLoading}>
                          <Heading fontSize={"2xl"} color={"neutral.text.high"}>
                            {packages.data?.title}
                          </Heading>
                        </Skeleton>
                        <Skeleton isLoaded={!packages.isLoading}>
                          <Text fontSize={{ base: "xs", md: "sm" }}>
                            {packages.data?.destination}
                          </Text>
                        </Skeleton>
                      </Stack>
                      <Divider my={"12px"} variant={"dashed"} />
                      <SimpleGrid pt={"10px"} spacingY={"16px"} columns={2}>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<WeatherIcon />}
                          isLoading={packages.isLoading}
                        >
                          {`${packages.data?.departures[0].duration} Hari` ??
                            "0 Hari"}
                        </CustomTagsOutlineIcon>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<MapIcon />}
                          isLoading={packages.isLoading}
                        >
                          {`${packages.data?.departures[0].totalCountry} Negara ${packages.data?.departures[0].totalCity} Kota` ??
                            "0 Negara 0 Kota"}
                        </CustomTagsOutlineIcon>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<HotelIcon />}
                          isLoading={packages.isLoading}
                        >
                          {rangeHotelStarStr
                            ? `Hotel Bintang ${rangeHotelStarStr}`
                            : "Tidak ada Hotel"}
                        </CustomTagsOutlineIcon>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<LuggageIcon />}
                          isLoading={packages.isLoading}
                        >
                          {`${packages.data?.departures.length} Keberangkatan`}
                        </CustomTagsOutlineIcon>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<TagsIcon />}
                          isLoading={packages.isLoading}
                        >
                          {packages.data?.category}
                        </CustomTagsOutlineIcon>
                      </SimpleGrid>
                    </Stack>
                    <Stack overflow={"auto"}>
                      <Text
                        fontSize="sm"
                        dangerouslySetInnerHTML={{
                          __html: packages?.data?.description,
                        }}
                      />{" "}
                    </Stack>
                  </Box>
                </Stack>
                <Box
                  h={"fit-content"}
                  position={"sticky"}
                  top={"80px"}
                  id="package-order"
                  as={"section"}
                  p={"24px"}
                  mx={{ base: "-24px", md: 0 }}
                  // my={{ base: 0, md: 5 }}
                  rounded={{ base: "none", md: "xl" }}
                  bg={"brand.blue.100"}
                >
                  <Skeleton isLoaded={!packages.isLoading}>
                    {packages.data && (
                      <PackageDetailOrder
                        innerRef={formRef}
                        initialValues={initialValues}
                        departures={packages.data?.departures}
                      />
                    )}
                  </Skeleton>
                </Box>
              </SimpleGrid>
            </GridItem>
            <Itineraries />
          </SimpleGrid>
          <Box
            ref={packagePriceRef}
            id={"package-price"}
            mx={"-24px"}
            p={"24px"}
            as={"section"}
            bg={"brand.blue.100"}
          >
            <Box mx={"auto"} maxW={{ lg: "container-lg", xl: "container.xl" }}>
              <DetailPackageList />
            </Box>
          </Box>
          <Box
            bg={"brand.blue.100"}
            mx={"-24px"}
            px={"24px"}
            id={"terms-and-conditions"}
            py={"24px"}
            as={"section"}
          >
            <TnC html={packages.data?.termAndCondition} />
          </Box>
          <Stack
            mx={{ base: "-24px", md: "auto" }}
            px={"24px"}
            roundedTop="xl"
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            position={{ base: "sticky", md: "sticky" }}
            bottom={0}
            bg={"white"}
            pb={"20px"}
            spacing={"12px"}
          >
            <CustomOrangeFullWidthButton
              onClick={() => loginToast(formRef.current.submitForm)}
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
        </>
      </Formik>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const packages = await getAllPackages();
  const paths = packages.map((item) => ({
    params: { slug: item.attributes.slug },
  }));
  return { paths, fallback: true };
};

export const getStaticProps = async ({ params }) => {
  try {
    const detail = await getPackageDetail(params.slug);
    return {
      props: {
        detail,
        meta: {
          title: detail.title,
          description: detail.description,
          image: `${process.env.NEXT_PUBLIC_BACKEND_URL}${detail.pictures?.[0]?.url}`,
        },
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default PackagesDetail;
