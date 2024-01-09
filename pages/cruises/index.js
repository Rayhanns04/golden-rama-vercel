import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Swiper } from "swiper/react";
import { CruiseHistory, CruiseListItem } from "../../src/components/card";
import { FormCruiseSearch } from "../../src/components/form";
import Layout from "../../src/components/layout";
import { useLocalStorage } from "../../src/hooks";
import {
  getCruiseDestinations,
  getCruises,
} from "../../src/services/cruise.service";

const Cruises = (props) => {
  const router = useRouter();
  const { destinations, period_month, period_year } = props;
  const [history, setHistory] = useLocalStorage("cruise_search", []);

  const form = {
    destination: "",
    period_month: "",
    period_year: new Date().getFullYear().toString(),
  };

  const handleSubmit = (values, actions) => {
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    router.push({ pathname: "/cruises/search", query: values });
  };

  const cruises = useInfiniteQuery(
    ["getCruises"],
    ({ pageParam = 1 }) => getCruises({ pageParam: pageParam }),
    {
      getNextPageParam: (lastpage) => {
        try {
          if (lastpage) {
            if (lastpage.meta.pagination.pageCount === 0) return undefined;
            if (
              lastpage.meta.pagination.page !==
              lastpage.meta.pagination.pageCount
            ) {
              return lastpage.meta.pagination.page + 1;
            } else return undefined;
          }
        } catch (error) {
          console.error(error);
          return undefined;
        }
      },
    }
  );

  return (
    <Layout
      type="alt"
      bgheader={"/svg/cruises/header-bg.svg"}
      pagetitle={"Cruise"}
    >
      <Box as={"section"} py={"24px"}>
        <Box mx={"auto"} maxW={{ lg: "container.lg", xl: "container.xl" }}>
          <Formik initialValues={form} onSubmit={handleSubmit}>
            <Form>
              <FormCruiseSearch
                destinations={destinations}
                period_month={period_month}
                period_year={period_year}
              />
            </Form>
          </Formik>
        </Box>
      </Box>
      <Box mx={"-24px"} py={"24px"} bg={"brand.blue.100"} as={"section"}>
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
            <CruiseHistory
              item={history}
              setItem={setHistory}
              handleClick={handleSubmit}
            />
          </Stack>
        </SimpleGrid>
      </Box>
      <Box py={"24px"} as={"section"}>
        <Stack
          pb={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <Heading color={"neutral.text.high"} fontSize={"md"}>
            Trending Package
          </Heading>
          <Text fontSize={"sm"} color={"neutral.text.medium"}>
            Mulai perjalanan anda dengan cruise yang sering dipakai orang lain
          </Text>
        </Stack>
        <Box py={"24px"} mx={"-24px"} px={"24px"} bg={"brand.blue.100"}>
          <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
            <CruiseListItem query={cruises} />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async (ctx) => {
  try {
    const period_month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var min = new Date().getFullYear();
    var max = min + 2;
    var years = [];

    for (var i = min; i <= max; i++) {
      years.push(i);
    }

    const destinations = await getCruiseDestinations();
    return {
      props: {
        destinations: destinations.data,
        period_month,
        period_year: years,
        meta: {
          title: "Cruise",
        },
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
export default Cruises;
