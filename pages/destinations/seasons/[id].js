import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { TourListMonthAhead } from "../../../src/components/card";
import Layout from "../../../src/components/layout";
import { getTourGroupsV2 } from "../../../src/services/tour.service";
import _ from "underscore";
import { convertDatefilterTour } from "../../../src/helpers";
import { addYears, isBefore } from "date-fns";
import date from "../../../src/helpers/date";

const Seasons = (props) => {
  const router = useRouter();
  const { id: season } = router.query;
  const { area, period, seasons } = props;
  return (
    <Layout bg="brand.blue.100" type="nested" pagetitle={"Detail Tour Bulan"}>
      <Box
        minH={160}
        as="section"
        // maxW={{ lg: "container.lg", xl: "container.xl" }}
        // px="24px"
        position={"relative"}
        mx={"-24px"}
        // mx={{ base: "-24px", md: "auto" }}
        bg="brand.blue.100"
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justify={"space-between"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <Heading
            px={"24px"}
            textTransform={"uppercase"}
            fontSize={24}
            color="brand.blue.400"
          >
            {`Jelajahi ${
              seasons.filter((item) => {
                return item.value === season;
              })[0].name
            }`}
          </Heading>
          <Flex flexShrink={0} position="relative" right={0} w={160} h={160}>
            <Image
              priority
              // objectFit="contain"
              src={"/png/destinations/season.png"}
              alt={"month"}
              layout="fill"
            />
          </Flex>
        </Stack>
      </Box>
      <Box as="section" py={"24px"}>
        <TourListMonthAhead area={area} period={period} />
      </Box>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const seasons = ["winter", "spring", "summer", "fall"];
  const paths = seasons.map((season) => {
    return {
      params: {
        id: season,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (ctx) => {
  const seasons = [
    { name: "Musim Dingin", value: "winter", months: [12, 1, 2] },
    { name: "Musim Semi", value: "spring", months: [3, 4, 5] },
    { name: "Musim Panas", value: "summer", months: [6, 7, 8] },
    { name: "Musim Gugur", value: "fall", months: [9, 10, 11] },
  ];
  const { id: season } = ctx.params;
  try {
    const area = await getTourGroupsV2();
    const period = seasons
      .filter((item) => {
        return item.value === season;
      })[0]
      .months.map((item) => {
        const monthNumber = new Date(
          `${item} 1, ${new Date().getFullYear()}`
        ).getMonth();
        const year = new Date(new Date().getFullYear(), monthNumber);
        const years = isBefore(year, new Date())
          ? addYears(new Date(), 1).getFullYear()
          : new Date().getFullYear();
        return `${monthNumber + 1}-${years}`;
      });

    return {
      props: {
        area,
        period: period,
        seasons,
        meta: {
          title: `${seasons.find((item) => item.value === season).name} Tour`,
        },
      },
      revalidate: 10,
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default Seasons;
