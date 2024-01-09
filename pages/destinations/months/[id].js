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

const Months = (props) => {
  // const { id: month } = router.query;
  const { area, period, monthName } = props;
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
            {`Jelajahi Bulan ${monthName ?? "undefined"}`}
          </Heading>
          <Flex flexShrink={0} position="relative" right={0} w={160} h={160}>
            <Image
              priority
              // objectFit="contain"
              src={"/png/destinations/month.png"}
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
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const paths = months.map((month) => ({
    params: { id: month },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async (ctx) => {
  const { id: month } = ctx.params;
  try {
    const area = await getTourGroupsV2();
    const monthName = date(
      new Date(convertDatefilterTour(month, new Date().getFullYear())),
      "MMMM"
    );
    const monthNumber = new Date(
      `${month} 1, ${new Date().getFullYear()}`
    ).getMonth();
    const year = new Date(new Date().getFullYear(), monthNumber);
    const years = isBefore(year, new Date())
      ? addYears(new Date(), 1).getFullYear()
      : new Date().getFullYear();
    const period = convertDatefilterTour(month, years);

    return {
      props: {
        id: month,
        area,
        monthName,
        period: [period],
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};

export default Months;
