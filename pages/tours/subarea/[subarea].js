import {
  Box,
  Heading,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import React, { useEffect } from "react";
import Layout from "../../../src/components/layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getTourTagsV2,
  getToursV2,
  getTourSubAreas,
  getTourSubAreaWithCountries,
  getTourAirlines,
} from "../../../src/services/tour.service";
import { CustomToursTabs } from "../../../src/components/tab";
import ExpandableHTML from "../../../src/components/expandable-html";
import { useDispatch } from "react-redux";
import { addMonths, parseISO } from "date-fns";
import { resetDataTour } from "../../../src/state/tour/tour.slice";
import { resetDataFlight } from "../../../src/state/order/order.slice";
import { Pagination } from "swiper";
import { convertDatefilterTour } from "../../../src/helpers";
import date from "../../../src/helpers/date";
import { compact } from "underscore";

const ToursSubArea = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { tour_type, sort, tour_duration } = props;

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

  const { query } = router;
  const [area, ..._subarea] = query.subarea?.split("-") || ["", ""];
  const subarea = _subarea.join("-");
  const itemPerPage = 200;

  const filter = {
    groupSlugIn: [query.subarea],
  };
  if (query.tour_tags && query.tour_tags !== "All")
    filter.tagIdIn = compact([
      ...query.tour_type?.split(",").map((type) => parseInt(type)),
      tourTags.data?.find((tag) => tag.name === query.tour_tags)?.id,
    ]);
  if (query.min_price) filter.minPrice = parseInt(query.min_price);
  if (query.max_price) filter.maxPrice = parseInt(query.max_price);
  if (query.sort) filter.sortBy = query.sort;
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

  const subArea = useQuery(["getTourSubAreaWithCountries", subarea], () =>
    getTourSubAreaWithCountries(subarea)
  );
  const countries = subArea.data?.attributes.countries?.data;

  const tours = useInfiniteQuery(
    ["getTours", query],
    ({ pageParam = 0 }) =>
      getToursV2({ ...filter, itemPerPage: itemPerPage, page: pageParam }),
    {
      getNextPageParam: (lastpage, pages) => {
        if (lastpage.length === itemPerPage) {
          return pages.length + 1;
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
        pathname: `/tours/subarea/${query.subarea}`,
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

  const _bgheader = `${process.env.NEXT_PUBLIC_BACKEND_URL}${subArea.data?.attributes?.image?.data?.attributes?.url}`;

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout
      pagetitle={subArea.data?.attributes.name}
      pagedescription={subArea.data?.attributes.subtitle}
      type={"bg"}
      bgheader={_bgheader.includes("undefined") ? "" : _bgheader}
      bgoption={{
        objectPosition: "center",
      }}
    >
      <Box mx={"-24px"} py={"24px"} as={"section"}>
        <Stack
          pb={"24px"}
          px={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <Heading color={"neutral.text.high"} fontSize={"md"}>
            Destinasi Populer
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
            {(!Array.isArray(countries) || subArea.isLoading
              ? Array.from({ length: 6 })
              : countries
            ).map((country, index) => {
              const imageUrl = country?.attributes?.image_mobile?.data
                ? process.env.NEXT_PUBLIC_BACKEND_URL +
                  country.attributes.image_mobile.data.attributes.formats.small
                    .url
                : `https://flagcdn.com/w320/${country?.attributes.isoCode2?.toLowerCase()}.jpg`;
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
                  <NextLink
                    href={`/tours/country/${country?.attributes.isoCode2}`}
                  >
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
                          isLoaded={!subArea.isLoading}
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
                            alt="Country"
                            src={imageUrl}
                            layout="fill"
                            objectPosition={"center"}
                            objectFit="cover"
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
                            {country?.attributes.name}
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
        <Box
          px={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <ExpandableHTML htmlText={subArea.data?.attributes.description} />
        </Box>
      </Box>
      <Box pb={"24px"} bg="brand.blue.100" mx={"-24px"} as={"section"}>
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

// export const getStaticPaths = async () => {
//   const subAreas = await getTourSubAreas();
//   const paths = subAreas.map((subArea) => ({
//     params: { subarea: subArea.attributes.slug },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps = async (ctx) => {
//   const tour_type = await getTourTagsV2();
//   const { subarea } = ctx.params;
//   const newsubarea = subarea.split("-").slice(1).join("-");
//   const details = await getTourSubAreaWithCountries(newsubarea);
//   const tour_duration = [
//     { label: "< 10 Hari", value: "1" },
//     { label: "> 10 Hari", value: "2" },
//   ];

//   const sort = [
//     { label: "Harga Terendah", value: "LOWEST_PRICE" },
//     { label: "Harga Tertinggi", value: "HIGHEST_PRICE" },
//     { label: "Durasi Tersingkat", value: "SHORTEST_DURATION" },
//     { label: "Durasi Terlama", value: "LONGEST_DURATION" },
//   ];

//   return {
//     props: {
//       tour_type,
//       tour_duration,
//       sort,
//       meta: {
//         title: details?.attributes?.subtitle || null,
//         description: details?.attributes?.description || null,
//         image: `https://prod1-api.goldenrama.com${
//           details?.attributes?.countries?.data?.[0]?.attributes?.image_mobile
//             ?.data?.attributes?.formats?.medium?.url || null
//         }`,
//       },
//     },
//     revalidate: 10,
//   };
// };

export const getServerSideProps = async (ctx) => {
  try {
    const tour_type = await getTourTagsV2();
    const { subarea } = ctx.params;
    const newsubarea = subarea.split("-").slice(1).join("-");
    const details = await getTourSubAreaWithCountries(newsubarea);
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

    return {
      props: {
        tour_type,
        tour_duration,
        sort,
        meta: {
          title: details?.attributes?.subtitle || null,
          description: details?.attributes?.description || null,
          image: `https://prod1-api.goldenrama.com${
            details?.attributes?.countries?.data?.[0]?.attributes?.image_mobile
              ?.data?.attributes?.formats?.medium?.url || null
          }`,
        },
      },
    };
  } catch (error) {
    console.error(error);
    // Handle errors as needed
    return {
      notFound: true,
    };
  }
};



export default ToursSubArea;
