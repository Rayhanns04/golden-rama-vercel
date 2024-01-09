import { Box, Stack, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Layout from "../../../src/components/layout";
import { useRouter } from "next/router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getTourTagsV2,
  getToursV2,
  getTourAirlines,
} from "../../../src/services/tour.service";
import {
  getCountries,
  getCountriesFromIsoCode,
} from "../../../src/services/country.service";
import { CustomToursTabs } from "../../../src/components/tab";
import ExpandableHTML from "../../../src/components/expandable-html";
import { useDispatch } from "react-redux";
import { addMonths, parseISO } from "date-fns";
import { resetDataTour } from "../../../src/state/tour/tour.slice";
import { resetDataFlight } from "../../../src/state/order/order.slice";
import { convertDatefilterTour } from "../../../src/helpers";
import date from "../../../src/helpers/date";
import { compact } from "underscore";

const ToursCountry = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

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

  const filter = {
    countryCodeIn: [query.country],
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

  const { data: countries } = useQuery(["getCountry", query.country], () =>
    getCountriesFromIsoCode(query.country)
  );

  const country = countries?.[0];

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
        pathname: `/tours/country/${query.country}`,
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
  const _bgheader = `${process.env.NEXT_PUBLIC_BACKEND_URL}${
    country?.attributes[isLargerThan768 ? "image" : "image_mobile"]?.data
      ?.attributes?.url
  }`;

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout
      pagetitle={country?.attributes.name}
      type={"bg"}
      bgheader={_bgheader.includes("undefined") ? "" : _bgheader}
      bgoption={{
        isMobile: !isLargerThan768,
        objectPosition: "center",
        heightHeaderMobile: "500px",
      }}
    >
      <Box pb={"24px"} bg="brand.blue.100" mx={"-24px"} as={"section"}>
        <Stack
          p="24px"
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <ExpandableHTML htmlText={country?.attributes.description} />

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
//   const countries = await getCountries("");
//   const paths = countries.map((country) => ({
//     params: { country: country.attributes.isoCode2 },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps = async (ctx) => {
//   const tour_type = await getTourTagsV2();
//   const { country } = ctx.params;

//   const detailCountry = await getCountriesFromIsoCode(country);
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
//         title: `Paket Tour ${detailCountry?.[0]?.attributes?.name ?? ""}`,
//         description: `Paket Tour ${
//           detailCountry?.[0]?.attributes?.name ?? ""
//         }, ${detailCountry?.[0]?.attributes?.description ?? ""} `,
//         image: `https://prod1-api.goldenrama.com${detailCountry?.[0]?.attributes?.image?.data?.attributes?.url}`,
//       },
//     },
//     revalidate: 10,
//   };
// };

export const getServerSideProps = async (ctx) => {
  try {
    const tour_type = await getTourTagsV2();
    const { country } = ctx.params;

    const detailCountry = await getCountriesFromIsoCode(country);
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
          title: `Paket Tour ${detailCountry?.[0]?.attributes?.name ?? ""}`,
          description: `Paket Tour ${
            detailCountry?.[0]?.attributes?.name ?? ""
          }, ${detailCountry?.[0]?.attributes?.description ?? ""} `,
          image: `https://prod1-api.goldenrama.com${detailCountry?.[0]?.attributes?.image?.data?.attributes?.url}`,
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


export default ToursCountry;
