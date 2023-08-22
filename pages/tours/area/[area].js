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
  getTourAreas,
  getTourAreaWithSubAreas,
  getTourAirlines,
  getTourGroupsV2,
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
import { compact, sortBy } from "underscore";

const ToursArea = (props) => {
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

  const area = useQuery(["getTourAreaWithSubAreas"], () =>
    getTourAreaWithSubAreas(query.area)
  );

  const subAreas = area.data?.attributes.sub_areas?.data?.sort((a, b) => {
    if (a.attributes.order < b.attributes.order) return -1;
    if (a.attributes.order > b.attributes.order) return 1;
    return 0;
  });

  const tours = useInfiniteQuery(
    ["getTours", query],
    async ({ pageParam = 0 }) => {
      const _groups = await getTourGroupsV2();
      const groups = _groups
        ?.filter((group) => group.slug?.startsWith(query.area))
        .map((group) => group.slug);
      return getToursV2({
        ...filter,
        groupSlugIn: groups,
        itemPerPage: itemPerPage,
        page: pageParam,
      });
    },
    {
      getNextPageParam: (lastpage, pages) => {
        if (lastpage.length >= itemPerPage) {
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
        pathname: `/tours/area/${query.area}`,
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

  const _bgheader = `${process.env.NEXT_PUBLIC_BACKEND_URL}${area.data?.attributes?.image?.data?.attributes?.url}`;

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout
      pagetitle={area.data?.attributes.name}
      pagedescription={area.data?.attributes.subtitle}
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
            {(!Array.isArray(subAreas) || area.isLoading
              ? Array.from({ length: 6 })
              : subAreas
            ).map((subArea, index) => {
              const imageUrl = subArea?.attributes?.image?.data
                ? process.env.NEXT_PUBLIC_BACKEND_URL +
                  subArea.attributes.image.data.attributes.formats.small.url
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
                  <NextLink
                    href={`/tours/subarea/${query.area}-${subArea?.attributes.slug}`}
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
                          isLoaded={!area.isLoading}
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
                            alt="subArea"
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
                            {subArea?.attributes.name}
                          </Text>
                        </Box>
                      </Box>
                    </a>
                  </NextLink>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <Box
            px={"24px"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
          >
            <ExpandableHTML htmlText={area.data?.attributes.description} />
          </Box>
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

export const getStaticPaths = async () => {
  const areas = await getTourAreas();
  const paths = areas.map((area) => ({
    params: { area: area.attributes.slug },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (ctx) => {
  const tour_type = await getTourTagsV2();
  const { area } = ctx.params;
  const details = await getTourAreaWithSubAreas(area);
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
        title: details?.attributes?.subtitle,
        description: details?.attributes?.description,
        image: `https://prod1-api.goldenrama.com${details?.attributes?.image?.data?.attributes?.url}`,
      },
    },
    revalidate: 10,
  };
};

export default ToursArea;
