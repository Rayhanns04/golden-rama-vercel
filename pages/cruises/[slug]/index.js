import {
  chakra,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
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
import ShipIcon from "../../../public/svg/icons/cruise.svg";
import Layout from "../../../src/components/layout";
import {
  CustomTags,
  CustomTagsOutlineIcon,
} from "../../../src/components/tags";
import {
  getAllCruises,
  getCruiseDetail,
} from "../../../src/services/cruise.service";
import { CruiseDetailOrder } from "../../../src/components/form";
import * as Yup from "yup";
import { Formik, useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { checkoutData } from "../../../src/state/cruise/cruise.slice";
import { useLoginToast } from "../../../src/hooks";

const CruisesDetail = (props) => {
  const { detail } = props;
  const router = useRouter();
  const toast = useToast();
  const loginToast = useLoginToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { query } = router;
  const cruise_price_ref = useRef();
  const [initialValues, setInitialValues] = useState({
    departures: detail.departures[0].date ?? "",
    participants: {
      children: 0,
      adults: 1,
    },
    type: {
      name: "",
      pax: "",
      price: 0,
    },
    // cabin: {},
  });
  const cruise = useQuery(["getCruiseDetail", query.slug], async () => {
    // const response = await getCruiseDetail(query.slug);
    const response = detail;
    return Promise.resolve(response);
  });
  const formRef = useRef();
  const dispatch = useDispatch();
  const handleSubmit = (values, action) => {
    if (!values.type.name)
      return toast({
        title: "Pilih tipe cruise terlebih dahulu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    try {
      dispatch(
        checkoutData({
          cruiseDetail: {
            ...values,
            slug: query.slug,
            cruise: cruise.data,
            departures: cruise.data.departures
              .filter((item) => {
                return item.date === values.departures;
              })
              .reduce((obj, item) => ((obj = item), obj), {}),
          },
        })
      );
      router.push({ pathname: "/cruises/order-details" });
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
            colSpan={[1, 2]}
            id={"cruise-itenerary-details"}
            as={"section"}
          >
            <Stack
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              py={"12px"}
            >
              <Heading color={"brand.blue.400"} fontSize={"20px"}>
                Itinerary Perjalanan
              </Heading>
              <Accordion allowMultiple mx={"0px"} gap={"20px"}>
                {!cruise.isLoading &&
                  cruise.data &&
                  cruise.data?.departures
                    .map((item) => {
                      if (item.date === formik?.values?.departures) {
                        return item;
                      }
                    })?.[0]
                    ?.itineraries.map((item, index) => (
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
            </Stack>
          </GridItem>
        )}
      </>
    );
  };
  const PriceDetails = () => {
    const formik = useFormikContext();
    const priceGroup = _.groupBy(formik.values.cabin, "type");
    return (
      <Box id={"cruise-itenerary"} as={"section"} my={"16px"}>
        {!cruise.isLoading ? (
          formik.values.cabin && (
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
                    {Object.keys(priceGroup).map((item, index) => {
                      return (
                        <Stack key={index} spacing={"12px"}>
                          <Text
                            textTransform={"uppercase"}
                            color={"brand.orange.400"}
                          >
                            {`Harga Cabin ${item}`}
                          </Text>
                          <TableContainer fontSize={"sm"}>
                            <Table variant={"simple"}>
                              <Tbody>
                                {priceGroup?.[item]?.map((detail, i) => (
                                  <Tr key={i}>
                                    <Td px={0} py={"8px"} border={0}>
                                      {detail.name}
                                    </Td>
                                    <Td
                                      px={0}
                                      py={"8px"}
                                      textAlign={"right"}
                                      border={0}
                                    >
                                      {parseInt(detail.value).toLocaleString(
                                        "id-ID",
                                        {
                                          maximumFractionDigits: 0,
                                        }
                                      )}
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                          <Divider
                            variant={"dashed"}
                            hidden={
                              Object.keys(priceGroup).lastIndexOf(item) ===
                              index
                            }
                          />
                        </Stack>
                      );
                    })}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Stack>
          )
        ) : (
          <Center p={4}>
            <Spinner />
          </Center>
        )}
      </Box>
    );
  };
  const CruiseCabinType = () => {
    const formik = useFormikContext();
    const startingPrice = parseInt(
      _.sortBy(
        cruise.data?.departures?.filter((item) => {
          return item.date === formik.values.departures;
        })[0]?.types,
        "startingPrice"
      )[0]?.startingPrice
    ).toLocaleString("id-ID", {
      maximumFractionDigits: 0,
    });
    console.log(startingPrice);
    return (
      <Box
        id={"cruise-price"}
        ref={cruise_price_ref}
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
              Mulai Dari
            </Heading>
            <Skeleton isLoaded={!cruise.isLoading}>
              <Stack spacing={"24px"}>
                <Text
                  as={Heading}
                  color={"brand.orange.400"}
                  fontWeight={"bold"}
                  fontSize={"24px"}
                >
                  {`IDR ${cruise.data && startingPrice && startingPrice !== "NaN" ? startingPrice :
                    parseInt(
                      _.sortBy(cruise.data?.departures, "startingPrice")[0]
                        .startingPrice
                    ).toLocaleString("id-ID", {
                      maximumFractionDigits: 0,
                    })
                    }`}
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
                  cabin di system pada saat pendaftaran serta kurs mata uang
                  asing.
                </Text>
                <Stack spacing="24px">
                  {cruise.data?.departures
                    .filter((item) => {
                      return item.date === formik?.values?.departures;
                    })[0]
                    .types?.map((item, index) => (
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
                                  isLoaded={!cruise.isLoading}
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
                                    <Text
                                      fontWeight={"bold"}
                                      color="brand.orange.400"
                                    >
                                      IDR{" "}
                                      {parseInt(price.value).toLocaleString(
                                        "id-ID",
                                        {
                                          maximumFractionDigits: 0,
                                        }
                                      )}
                                    </Text>
                                  </Stack>
                                  <Button
                                    colorScheme="brand.orange"
                                    color={
                                      isChoosed ? "brand.orange.400" : "white"
                                    }
                                    bg={
                                      isChoosed ? "white" : "brand.orange.400"
                                    }
                                    borderWidth="1px"
                                    borderColor="brand.orange.400"
                                    size="sm"
                                    fontWeight="normal"
                                    onClick={() =>
                                      formik.setFieldValue("type", type)
                                    }
                                    disabled={isChoosed}
                                  >
                                    Pilih
                                  </Button>
                                </Skeleton>
                              );
                            })}
                          </Stack>
                        </Flex>
                      </Stack>
                    ))}
                </Stack>
              </Stack>
            </Skeleton>
          </Stack>
        </Box>
      </Box>
    );
  };
  return (
    <Layout
      type={"nested"}
      metatitle={cruise.data && cruise.data.name}
      pagetitle={"Detail Cruise"}
      meta={{
        title: cruise.data?.metatitle,
        description: cruise.data?.metadescription,
        keyword: cruise.data?.metakeyword,
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
            // cabin: Yup.array()
            //   .of(
            //     Yup.object().shape({
            //       quantity: Yup.number(),
            //     })
            //   )
            //   .compact((q) => q.quantity === 0)
            //   .min(1, "Pilih minimal 1 jenis kabin")
            //   .required("Kabin harap diisi"),
            // cabin: Yup.object().required("Kabin harap dipilih"),
          })
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
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
                      {!cruise.isLoading ? (
                        cruise.data?.pictures ? (
                          cruise.data?.pictures.map((item, index) => (
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
                        <Skeleton isLoaded={!cruise.isLoading} p={4}>
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
                      <WishlistButton
                        data={cruise.data}
                        type="cruise"
                        slug={query.slug}
                      />
                      <ShareButton
                        url={window.location.href}
                        text={cruise.data?.title}
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
                  <Box id="cruise-details" as="section">
                    <Stack py={"16px"}>
                      <Stack pb={"10px"}>
                        <Box>
                          <CustomTags>{cruise.data?.type}</CustomTags>
                        </Box>
                        <Skeleton isLoaded={!cruise.isLoading}>
                          <Heading fontSize={"2xl"} color={"neutral.text.high"}>
                            {cruise.data?.title}
                          </Heading>
                        </Skeleton>
                        <Skeleton isLoaded={!cruise.isLoading}>
                          <Text fontSize={{ base: "xs", md: "sm" }}>
                            {cruise.data?.destination}
                          </Text>
                        </Skeleton>
                      </Stack>
                      <Divider my={"12px"} variant={"dashed"} />
                      <SimpleGrid pt={"10px"} spacingY={"16px"} columns={2}>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<ShipIcon />}
                          isLoading={cruise.isLoading}
                        >
                          {cruise.data?.ship ?? "No Ship"}
                        </CustomTagsOutlineIcon>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<WeatherIcon />}
                          isLoading={cruise.isLoading}
                        >
                          {`${cruise.data?.departures[0].duration} Hari` ??
                            "0 Hari"}
                        </CustomTagsOutlineIcon>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<MapIcon />}
                          isLoading={cruise.isLoading}
                        >
                          {`${cruise.data?.departures[0].totalCountry} Negara ${cruise.data?.departures[0].totalCity} Kota` ??
                            "0 Negara 0 Kota"}
                        </CustomTagsOutlineIcon>
                        <CustomTagsOutlineIcon
                          color={"brand.blue.400"}
                          icon={<LuggageIcon />}
                          isLoading={cruise.isLoading}
                        >
                          {`${cruise.data?.departures.length} Keberangkatan`}
                        </CustomTagsOutlineIcon>
                      </SimpleGrid>
                    </Stack>
                    <Text
                      fontSize="sm"
                      dangerouslySetInnerHTML={{
                        __html: cruise?.data?.description,
                      }}
                    />{" "}
                  </Box>
                </Stack>
                <Box
                  h={"fit-content"}
                  position={"sticky"}
                  top={"80px"}
                  id="cruise-order"
                  as={"section"}
                  p={"24px"}
                  mx={{ base: "-24px", md: 0 }}
                  // my={{ base: 0, md: 5 }}
                  rounded={{ base: "none", md: "xl" }}
                  bg={"brand.blue.100"}
                >
                  <Skeleton isLoaded={!cruise.isLoading}>
                    {cruise.data && (
                      <CruiseDetailOrder
                        innerRef={formRef}
                        initialValues={initialValues}
                        departures={cruise.data ? cruise.data?.departures : []}
                      />
                    )}
                  </Skeleton>
                </Box>
              </SimpleGrid>
            </GridItem>
            <Itineraries />
          </SimpleGrid>
          {!cruise.isLoading && cruise.data && (
            <>
              <CruiseCabinType />
              {/* <PriceDetails /> */}
            </>
          )}
          <Box
            bg={"brand.blue.100"}
            mx={"-24px"}
            px={"24px"}
            id={"terms-and-conditions"}
            py={"24px"}
            as={"section"}
          >
            <TnC html={cruise.data?.termAndCondition} />
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
              isLoading={formRef.current && formRef.current.isSubmitting}
              disabled={formRef.current && formRef.current.isSubmitting}
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

// export const getStaticPaths = async () => {
//   const cruises = await getAllCruises();
//   const paths = cruises.map((cruise) => ({
//     params: { slug: cruise.attributes.slug },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// };

// getStaticProps
export const getServerSideProps = async (ctx) => {
  // try {
  const { slug } = ctx.params;
  const detail = await getCruiseDetail(slug);
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
  // } catch (error) {
  //   console.error(error);
  //   return { notFound: true };
  // }
};

export default CruisesDetail;
