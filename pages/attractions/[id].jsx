import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  GridItem,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  CustomOrangeFullWidthButton,
  ShareButton,
  WishlistButton,
} from "../../src/components/button";
import Bookmark from "../../public/svg/icons/bookmark.svg";
import { BannerAllPhotos } from "../../src/components/card";
import Layout from "../../src/components/layout";
import { Pagination, Navigation } from "swiper";
import { useQuery } from "@tanstack/react-query";
import {
  getAllAttractions,
  getAttractionsDetails,
  getAttractionsProductTypeDetails,
  getAttractionsProductTypeDetailsPriceList,
} from "../../src/services/attraction.service";
import { useRouter } from "next/router";
import { CustomDivider } from "../../src/components/divider";
import ClockIcon from "../../public/svg/icons/clock.svg";
import TagsIcon from "../../public/svg/icons/tag.svg";
import DocsIcon from "../../public/svg/icons/document.svg";
import LocationIcon from "../../public/svg/icons/location.svg";
import { CustomTagsOutlineIcon } from "../../src/components/tags";
import _ from "underscore";
import { convertRupiah, percentage } from "../../src/helpers";
import { useDispatch } from "react-redux";
import { Detail } from "../../src/components/pages/attractions";

const AttractionDetails = ({ data }) => {
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  const tourTypeRef = useRef();

  const attraction = useQuery(["getAttractionsDetails", id], async () => {
    try {
      // const response = await getAttractionsDetails(id);
      const response = data
      const result = {
        ...response?.detail,
      };

      const productTypes = await Promise.all(
        response.productTypes.map(async (item, index) => {
          try {
            const { uuid } = item;
            const response = await getAttractionsProductTypeDetails(uuid);
            return Promise.resolve(response);
          } catch (error) {
            return Promise.resolve(null);
          }
        })
      );
      const priceList = await Promise.all(
        response.productTypes.map(async (item) => {
          try {
            const { uuid } = item;
            const response = await getAttractionsProductTypeDetailsPriceList(
              uuid
            );
            return Promise.resolve(response);
          } catch (error) {
            return Promise.resolve(null);
          }
        })
      );
      // console.log("🚀 ~ file: [id].js:82 ~ attraction ~ priceList", priceList);
      //delete result if priceList is empty or error or null
      const filteredProductTypes = productTypes.filter((item) => item !== null);
      const filteredPriceList = priceList.filter((item) => item !== null);
      // console.log("🚀 ~ file: [id].js:82 ~ attraction ~ filteredPriceList", filteredPriceList);
      const minPrice = filteredPriceList?.map((list) => {
        const priceList = list.map((prices) => {
          // const keys = Object.keys(prices.prices);
          const keys = ["adults"];
          const array = keys.map((price) => {
            const item = prices.prices[price].filter((item) => {
              return item;
            });
            return _.min(item);
          });
          return _.min(array.filter((item) => isFinite(item)));
        });
        return parseInt(_.min(priceList));
      });
      filteredProductTypes?.map((response, index) => {
        const minPricePerProduct = minPrice?.[index];
        response.data.adultFinalPrice =
          minPricePerProduct +
            percentage(
              minPricePerProduct,
              response.data.adultRecommendedMarkup
            ) >
          response.data.adultParityPrice
            ? minPricePerProduct +
              percentage(
                minPricePerProduct,
                response.data.adultRecommendedMarkup
              )
            : response.data.adultParityPrice;
        // : 0;
        // response.data.childFinalPrice = response.data.childRecommendedMarkup
        //   ? minPrice +
        //       percentage(
        //         minPrice,
        //         response.data.childRecommendedMarkup
        //       ).toFixed() >
        //     response.data.childParityPrice
        //     ? minPrice +
        //       percentage(
        //         minPrice,
        //         response.data.childRecommendedMarkup
        //       ).toFixed()
        //     : response.data.childParityPrice
        //   : 0;
        // response.data.infantFinalPrice = response.data.infantRecommendedMarkup
        //   ? minPrice?.[index] +
        //       percentage(
        //         minPrice?.[index],
        //         response.data.infantRecommendedMarkup
        //       ).toFixed() >
        //     response.data.infantParityPrice
        //     ? minPrice?.[index] +
        //       percentage(
        //         minPrice?.[index],
        //         response.data.infantRecommendedMarkup
        //       ).toFixed()
        //     : response.data.infantParityPrice
        //   : 0;
        // response.data.seniorFinalPrice = response.data.seniorRecommendedMarkup
        //   ? minPrice?.[index] +
        //       percentage(
        //         minPrice?.[index],
        //         response.data.seniorRecommendedMarkup
        //       ).toFixed() >
        //     response.data.seniorParityPrice
        //     ? minPrice?.[index] +
        //       percentage(
        //         minPrice?.[index],
        //         response.data.seniorRecommendedMarkup
        //       ).toFixed()
        //     : response.data.seniorParityPrice
        //   : 0;
      });
      result.productTypes = filteredProductTypes;
      result.priceList = filteredPriceList;
      result.minPrice = minPrice;
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  });

  // console.log('itemku11', attraction?.data)

  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );

  return (
    <Layout
      type={"nested"}
      meta={{
        title: attraction.data?.title,
        description: attraction.data?.description,
        // keyword: attraction.data.metakeyword,
      }}
      pagetitle={attraction.data?.title}
    >
      <SimpleGrid
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={{ md: "auto" }}
        columns={[1, 2]}
        // bg={"red"}
        // color="white"
      >
        <GridItem colSpan={[2, 2, 1]} px={{ md: "24px" }}>
          <Box
            mx={{ base: "-24px", md: 0 }}
            id={"attraction-details-banner"}
            as={"section"}
            position={"relative"}
          >
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
              }}
              autoHeight={true}
              // navigation={true}
              spaceBetween={0}
              slidesPerView={1}
            >
              {/* {!attraction.isLoading ? (
              hotel.data ? (
                attraction.data?.pictures?.map((item, index) => (
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
                        alt={item.title ?? "Image description"}
                        layout={"fill"}
                      />
                    </Box>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <Box
                    position={"relative"}
                    shadow={"lg"}
                    height={"200px"}
                    overflow={"hidden"}
                  >
                    <Image
                      objectPosition={"center"}
                      objectFit="cover"
                      alt={"Image description"}
                      layout={"fill"}
                    />
                  </Box>
                </SwiperSlide>
              )
            ) : (
              <Skeleton isLoaded={!attraction.isLoading} p={4}>
                <Box
                  position={"relative"}
                  shadow={"lg"}
                  height={"200px"}
                  overflow={"hidden"}
                />
              </Skeleton>
            )} */}
              {!attraction.isLoading ? (
                attraction.data &&
                attraction.data.photos.map((item, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      position={"relative"}
                      shadow={"lg"}
                      height={{ base: "200px" }}
                      overflow={"hidden"}
                    >
                      <Image
                        objectPosition={"center"}
                        objectFit="cover"
                        src={`${attraction.data.photosUrl}${
                          isDesktop
                            ? item.paths["1280x720"]
                            : item.paths["680x325"]
                        }`}
                        alt={"Image description"}
                        layout={"fill"}
                      />
                    </Box>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <Skeleton>
                    <Box
                      position={"relative"}
                      shadow={"lg"}
                      height={{ base: "200px" }}
                      overflow={"hidden"}
                    />
                  </Skeleton>
                </SwiperSlide>
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
                data={attraction.data}
                type="attraction"
                slug={query.id}
              />
              <ShareButton
                url={window.location.href}
                text={attraction.data?.name}
              />
            </HStack>
            <HStack zIndex={1} position={"absolute"} bottom={0} right={0}>
              <Skeleton isLoaded={!attraction.isLoading}>
                <BannerAllPhotos
                  description={"Sentosa, Singapore"}
                  title={"Foto Adventure Cove Waterpark Singapore"}
                  page="Atraksi dan Hiburan"
                  length={attraction.data?.photos?.length ?? 0}
                  items={attraction.data?.photos?.map((item) => {
                    return `${attraction.data?.photosUrl}${item.paths["680x325"]}`;
                  })}
                  // items={attraction.data?.photos}
                />
              </Skeleton>
            </HStack>
          </Box>
          <Box id="attraction-details" as={"section"}>
            <Stack
              py={"16px"}
              mx={"auto"}
              maxW={{ lg: "container.lg", xl: "container.xl" }}
            >
              <Stack pb={"10px"}>
                {/* {attraction.data?.tags.length > 0 &&
                attraction.data?.tags[0].items.length > 0 &&
                attraction.data?.tags[0].items.map((tag, index) => (
                  <Box key={index}>
                    <CustomTags>{tag.name}</CustomTags>
                  </Box>
                ))} */}
                {/* <Box>
                <CustomTags>{"Kolam Renang"}</CustomTags>
              </Box> */}
                <Skeleton isLoaded={!attraction.isLoading}>
                  <Heading fontSize={"2xl"} color={"neutral.text.high"}>
                    {attraction.data?.title ?? "Villa Mandi Hotel Bali"}
                  </Heading>
                </Skeleton>
                <Skeleton isLoaded={!attraction.isLoading}>
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    {attraction.data?.address ?? "Tidak ada alamat"}
                  </Text>
                </Skeleton>
                <SimpleGrid columns={[2]} gap={"3px"} pt={"8px"}>
                  {attraction.data?.businessHoursFrom &&
                    attraction.data?.businessHoursTo && (
                      <CustomTagsOutlineIcon
                        isLoading={attraction.isLoading}
                        icon={<ClockIcon />}
                      >
                        Buka {attraction.data?.businessHoursFrom} -{" "}
                        {attraction.data?.businessHoursTo}
                      </CustomTagsOutlineIcon>
                    )}
                  {attraction.data?.typeName ? (
                    <CustomTagsOutlineIcon
                      isLoading={attraction.isLoading}
                      icon={<TagsIcon />}
                    >
                      {attraction.data?.typeName}
                    </CustomTagsOutlineIcon>
                  ) : (
                    <></>
                  )}
                  {/* <CustomTagsOutlineIcon
                    isLoading={attraction.isLoading}
                    icon={<StarIcon />}
                  >
                    {attraction.data?.reviewAverageScore === 0
                      ? "No Rating"
                      : `Rating ${attraction.data?.reviewAverageScore}`}
                  </CustomTagsOutlineIcon> */}
                  <CustomTagsOutlineIcon
                    isLoading={attraction.isLoading}
                    icon={<DocsIcon />}
                  >
                    {attraction.data?.productTypes[0].data.isNonRefundable
                      ? "Refundable"
                      : "No Refundable"}
                  </CustomTagsOutlineIcon>
                </SimpleGrid>
              </Stack>
            </Stack>
            <CustomDivider />
          </Box>
        </GridItem>
        <GridItem
          colSpan={[2, 2, 1]}
          px={{ md: "24px" }}
          ref={tourTypeRef}
          id="attraction-tour-types"
          mx={{ base: "-24px", md: 0 }}
          bg={"brand.blue.100"}
          as="section"
        >
          <Stack
            mx={"auto"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            p={"24px"}
            spacing={"24px"}
          >
            <Heading color={"brand.blue.400"} fontSize={"md"}>
              Pilihan Paket
            </Heading>
            <SimpleGrid columns={[1, 1, 1, 2]} gap={"24px"}>
              {!attraction.isLoading ? (
                attraction.data &&
                attraction.data?.productTypes.map((type, index) => (
                  <Stack
                    spacing={"12px"}
                    p={"24px"}
                    bg={"white"}
                    rounded={"xl"}
                    overflow="hidden"
                    key={index}
                  >
                    <Detail
                      type={type}
                      index={index}
                      attraction={attraction.data}
                      query={query}
                      id={id}
                      ticket={type.data}
                    />
                  </Stack>
                ))
              ) : (
                <>
                  {Array.from({ length: 3 }).map((item, index) => (
                    <Stack
                      key={index}
                      spacing={"12px"}
                      p={"24px"}
                      bg={"white"}
                      rounded={"xl"}
                      overflow="hidden"
                    >
                      <Box>
                        <Skeleton>
                          <Heading
                            fontSize={"md"}
                            color={"neutral.text.high"}
                          />
                        </Skeleton>
                      </Box>
                      <Divider variant={"dashed"} />
                      <Flex
                        justifyContent={"space-between"}
                        alignItems="flex-end"
                      >
                        <Stack>
                          <Skeleton>
                            <Text color={"neutral.text.low"} fontSize={"xs"}>
                              Mulai Dari
                            </Text>
                          </Skeleton>
                          <Skeleton>
                            <Text fontWeight={"bold"} color="brand.orange.400">
                              {/* IDR {convertRupiah(attraction.data?.minPrice[index])}{" "} */}
                              <Text
                                fontSize={"xs"}
                                fontWeight="normal"
                                color={"neutral.text.low"}
                                as="span"
                              >
                                /Pax
                              </Text>
                            </Text>
                          </Skeleton>
                        </Stack>
                        <Skeleton>
                          <CustomOrangeFullWidthButton
                            w="fit-content"
                            fontWeight="normal"
                          >
                            Pilih
                          </CustomOrangeFullWidthButton>
                        </Skeleton>
                      </Flex>
                    </Stack>
                  ))}
                </>
              )}
            </SimpleGrid>
          </Stack>
        </GridItem>
        <GridItem
          colSpan={[1, 2, 2]}
          // px={"0"}
          id="attraction-description"
          mx="-12px"
          // mx={{ base: "-24px", md: 0 }}
          as="section"
        >
          <Accordion allowMultiple mx={"auto"} py={"24px"}>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Highlight
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <SkeletonText noOfLines={10} isLoaded={!attraction.isLoading}>
                  <Text fontSize={"sm"}>{attraction.data?.highlights}</Text>
                </SkeletonText>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Deskripsi
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <SkeletonText noOfLines={10} isLoaded={!attraction.isLoading}>
                  <Text fontSize={"sm"}>{attraction.data?.description}</Text>
                  <Text fontSize={"sm"}>{attraction.data?.description}</Text>
                </SkeletonText>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Lokasi dan Peta
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <Stack gap="12px">
                  <Flex gap={"10px"} alignItems="flex-start">
                    <Icon mt="5px" w="16px" h="16px">
                      <LocationIcon />
                    </Icon>
                    <Box>
                      <Skeleton isLoaded={!attraction.isLoading}>
                        <Text fontSize={"sm"} color="neutral.text.medium">
                          {attraction.data?.address}
                        </Text>
                      </Skeleton>
                    </Box>
                  </Flex>
                  <Skeleton
                    textAlign={"right"}
                    isLoaded={!attraction.isLoading}
                  >
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${attraction.data?.latitude}, ${attraction.data?.longitude}`}
                      fontSize={"sm"}
                      fontWeight="bold"
                      isExternal
                      color="brand.blue.300"
                    >
                      Tampilkan Peta di Google Maps
                    </Link>
                  </Skeleton>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Highlight
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <SkeletonText noOfLines={10} isLoaded={!attraction.isLoading}>
                  <Text fontSize={"sm"}>{attraction.data?.highlights}</Text>
                </SkeletonText>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Additional Info
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <SkeletonText noOfLines={10} isLoaded={!attraction.isLoading}>
                  {attraction.data?.additionalInfo ? (
                    <Box
                      fontSize={"sm"}
                      dangerouslySetInnerHTML={{
                        __html: attraction.data?.additionalInfo?.replace(
                          /(\r\n|\r|\n)/g,
                          "<br>"
                        ),
                      }}
                    />
                  ) : (
                    <Text fontSize={"sm"}>Tidak ada Additional Info</Text>
                  )}
                </SkeletonText>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </GridItem>
      </SimpleGrid>
      <Stack
        // maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={{ base: "-24px", md: 0 }}
        px={"24px"}
        position={{ base: "sticky", md: "sticky" }}
        bottom={0}
        bg={"white"}
        pb={"20px"}
        spacing={"12px"}
      >
        <CustomOrangeFullWidthButton
          // as={CustomOrangeFullWidthButton}
          onClick={() =>
            tourTypeRef.current &&
            tourTypeRef.current.scrollIntoView({ behavior: "smooth", top: 80 })
          }
          maxW={"400px"}
          mx={"auto"}
          // isLoading={formRef.current && formRef.current.isSubmitting}
          // disabled={formRef.current && formRef.current.isSubmitting}
          // onClick={() => {
          //   if (formRef.current) {
          //     formRef.current.handleSubmit();
          //   }
          // }}
        >
          Pilih Atraksi
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
    </Layout>
  );
};

// export const getStaticPaths = async () => {
//   const attractions = await getAllAttractions();
//   const paths = attractions.map((attraction) => ({
//     params: { id: attraction.uuid },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps = async ({ params }) => {
//   try {
//     const { detail } = await getAttractionsDetails(params.id);
//     return {
//       props: {
//         data: null,
//         meta: {
//           title: detail.title || "Golden Rama E-Travel",
//           description: detail.description || "Golden Rama E-Travel",
//         },
//       },
//       revalidate: 10,
//     };
//   } catch (error) {
//     console.error(error);
//     return { notFound: true };
//   }
// };

export const getServerSideProps = async (context) => {
  const {id} = context.query
  
  try {
    const { detail, productTypes } = await getAttractionsDetails(id);
    return {
      props: {
        data: {
          detail : detail, 
          productTypes : productTypes
        },
        meta: {
          title: detail.title || "Golden Rama E-Travel",
          description: detail.description || "Golden Rama E-Travel",
        },
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};


export default AttractionDetails;
