import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { addMonths, parseISO } from "date-fns";
import {
  getTourAirlines,
  getTourAreas,
  getTourTagsV2,
  getToursV2,
} from "../../src/services/tour.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { CustomToursTabs } from "../../src/components/tab";
import { FormTourSearch } from "../../src/components/form";
import Image from "next/image";
import Layout from "../../src/components/layout";
import NextLink from "next/link";
import { Pagination } from "swiper";
import { TourHistory } from "../../src/components/card";
import { compact } from "underscore";
import { convertDatefilterTour } from "../../src/helpers";
import date from "../../src/helpers/date";
import { resetDataFlight } from "../../src/state/order/order.slice";
import { resetDataTour } from "../../src/state/tour/tour.slice";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../src/hooks";
import { useRouter } from "next/router";

const Tours = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  // console.log('itemtour1', props)

  const { tour_type, sort, tour_duration, meta } = props;

  const [history, setHistory] = useLocalStorage("tour_search", []);

  const handleSubmit = (values, actions) => {
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    router.push(`/tours/country/${values.destination}`);
  };

  const tourTags = useQuery(["getTourTags"], async () => {
    const tourTags = [
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
    ];
    return Promise.resolve(tourTags);
  });

  const form = {
    destination: "",
  };

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { query } = router;
  const itemPerPage = 200;
  const filter = {};
  if (query.tour_tags && query.tour_tags !== "All")
    filter.tagIdIn = compact([
      ...query.tour_type?.split(",").map((type) => parseInt(type)),
      tourTags.data?.find((tag) => tag.name === query.tour_tags)?.id,
    ]);
  if (query.min_price) filter.minPrice = parseInt(query.min_price);
  if (query.max_price) filter.maxPrice = parseInt(query.max_price);
  if (query.sort) filter.sortBy = query.sort;
  if (query.tour_type) {
    filter.tagIdIn = compact([
      ...query.tour_type?.split(",").map((type) => parseInt(type)),
    ]);
  }
  if (query.period_month) {
    const { start, end } = query.period_month.split(",").reduce((acc, curr) => {
      const [month, year] = curr.split(" ");
      const convertDateFilter = convertDatefilterTour(month, year);
      const date = parseISO(`${convertDateFilter}-01`);
      if (!acc.start || date < acc.start) acc.start = date;
      if (!acc.end || date > acc.end) acc.end = date;
      return acc;
    }, {});
    filter.minDepartureDate = date(start, "yyyy-MM");
    filter.maxDepartureDate = date(
      end === start ? addMonths(end, 1) : end,
      "yyyy-MM"
    );
  }
  if (query.airlines) filter.airlineCodeIn = query.airlines.split(",");
  switch (query.tour_duration) {
    case "1":
      filter.maxNumberOfDays = 9;
      break;
    case "2":
      filter.minNumberOfDays = 10;
      break;
    default:
      break;
  }

  const airlines = useQuery(["getAirlines", query], () => {
    const { airlineCodeIn, ...rest } = filter;
    return getTourAirlines(rest);
  });

  const areas = useQuery(["getTourAreas"], getTourAreas);

  const tours = useInfiniteQuery(
    ["getTours", query],
    ({ pageParam = 0 }) =>
      getToursV2({ ...filter, itemPerPage: itemPerPage, page: pageParam }),
    {
      getNextPageParam: (lastpage, pages) => {
        if (lastpage.length === itemPerPage) {
          return pages.length;
        } else {
          return false;
        }
      },
    }
  );

  const handleTourSubmit = (values, actions) => {
    actions.setSubmitting(false);
    router.replace(
      {
        pathname: "/tours",
        query: {
          ...values,
          tour_type: [...(values?.tour_type || [])].join(","),
          airlines: [...(values?.airlines || [])].join(","),
          period_month: [...(values?.period_month || [])].join(","),
        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    );
  };

  return (
    <Layout
      meta={meta}
      pagetitle={"Tour"}
      pagedescription={"Temukan liburan terbaik anda disini."}
      type={"bg"}
      bgheader={"/jpg/header-tour.jpg"}
      bgoption={{
        objectPosition: "center",
      }}
    >
      <Box as={"section"} py={"24px"}>
        <Box mx={"auto"} maxW={{ lg: "container.lg", xl: "container.xl" }}>
          <Formik initialValues={form} onSubmit={handleSubmit}>
            <Form>
              <FormTourSearch handleSubmit={handleSubmit} />
            </Form>
          </Formik>
        </Box>
      </Box>
      <Box mx={"-24px"} py={"24px"} as={"section"}>
        <Stack
          pb={"24px"}
          px={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <Heading color={"neutral.text.high"} fontSize={"md"}>
            Pilih Destinasi
          </Heading>
        </Stack>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <Swiper
            id="tours-destination"
            modules={[Pagination]}
            slidesOffsetBefore={24}
            slidesOffsetAfter={24}
            spaceBetween={10}
            slidesPerView={useBreakpointValue({ base: 2.5, md: "auto" })}
            pagination={{
              clickable: true,
              enabled: true,
            }}
          >
            {(!Array.isArray(areas.data) || areas.isLoading
              ? Array.from({ length: 6 })
              : areas.data
            ).map((area, index) => {

              function getImageUrl(data) {
                const formats = data?.attributes?.formats;

                const preferredFormats = [
                  "small",
                  "thumbnail",
                  "medium",
                  "large",
                ];

                for (const format of preferredFormats) {
                  if (formats?.[format]) {
                    return (
                      process.env.NEXT_PUBLIC_BACKEND_URL + formats[format].url
                    );
                  }
                }

                return "https://dummyimage.com/140x170/000/fff&text=area";
              }

              const imageUrl = area?.attributes.image?.data
                ? getImageUrl(area.attributes.image.data)
                : "https://dummyimage.com/140x170/000/fff&text=area";

              return (
                <SwiperSlide
                  key={index}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    maxWidth: "140px",
                    paddingBottom: "22px",
                  }}
                >
                  <NextLink href={`/tours/area/${area?.attributes.slug}`}>
                    <a rel="canonical">
                      <Box
                        as={SwiperSlide}
                        bg="gray.400"
                        borderRadius="5px"
                        overflow={"hidden"}
                        h={"170px"}
                      >
                        <Box
                          as={Skeleton}
                          isLoaded={!areas.isLoading}
                          position="relative"
                          w="full"
                          h="full"
                          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                          filter="brightness(0.9)"
                          _hover={{
                            transform: "scale(1.05)",
                            filter: "brightness(1)",
                          }}
                        >
                          <Image
                            alt="Item 1"
                            src={imageUrl}
                            layout="fill"
                            objectPosition={"center"}
                            objectFit="cover"
                            unoptimized
                            placeholder="empty"
                            // Handle image broken dengan placeholder
                            onError={(e) => {
                              e.target.src =
                                "https://stag-web.goldenrama.com/_next/image?url=%2Fjpg%2Fheader-tour.jpg&w=1920&q=75";
                              e.target.onerror = null; // Prevent infinite loop if the fallback image also fails to load
                            }}
                          />
                        </Box>
                        <Box
                          position="absolute"
                          bottom="0"
                          left="0"
                          w={"full"}
                          p={"10px"}
                          borderRadius="md"
                        >
                          <Text color="white" fontSize="sm" fontWeight="bold">
                            {area?.attributes.name}
                          </Text>
                        </Box>
                      </Box>
                    </a>
                  </NextLink>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>
      </Box>
      <Box mx={"-24px"} py={"24px"} as={"section"}>
        <SimpleGrid columns={1} spacing={"16px"}>
          <Box
            w={"full"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            px={{ base: "24px", xl: "0" }}
          >
            <Heading color={"neutral.text.high"} fontSize={"md"}>
              Pencarian Terakhir
            </Heading>
          </Box>
          <Stack
            justifyContent={"stretch"}
            mx={"auto"}
            w={"full"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
          >
            <TourHistory
              item={history}
              handleClick={handleSubmit}
              setItem={setHistory}
            />
          </Stack>
        </SimpleGrid>
      </Box>
      <Box py={"24px"} bg="brand.blue.100" mx={"-24px"} as={"section"}>
        <Stack
          px={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <CustomToursTabs
            tour_type={tour_type}
            tours={tours}
            handleSubmit={handleTourSubmit}
            tour_tags={tourTags}
            tour_duration={tour_duration}
            sort={sort}
            airlines={airlines.data}
          />
        </Stack>
      </Box>
    </Layout>
  );
};

export default Tours;

export const getServerSideProps = async (context) => {
  try {
    const tour_type = await getTourTagsV2();

    const tour_duration = [
      { label: "< 10 Hari", value: "1" },
      { label: "> 10 Hari", value: "2" },
    ];

    const sort = [
      { label: "Harga Terendah", value: "LOWEST_PRICE" },
      { label: "Harga Tertinggi", value: "HIGHEST_PRICE" },
      { label: "Durasi Tersingkat", value: "SHORTEST_DURATION" },
      { label: "Durasi Terlama", value: "LONGEST_DURATION" },
    ];

    const meta = {
      title: "Tour",
      description: "Temukan liburan terbaik anda disini.",
    };

    return {
      props: {
        tour_type,
        tour_duration,
        sort,
        meta,
      },
    };
  } catch (error) {
    return {
      props: {
        tour_type: "",
        tour_duration: "",
        sort: "",
        meta: "",
        notFound: true,
      },
    };
  }
};
