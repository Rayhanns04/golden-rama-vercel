import {
  Box,
  Collapse,
  IconButton,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CruiseListItem } from "../../src/components/card";
import EditIcon from "../../public/svg/icons/edit.svg";

import Layout from "../../src/components/layout";
import { convertToArray } from "../../src/helpers";
import { useLocalStorage } from "../../src/hooks";
import {
  getCruiseDestinations,
  getCruises,
  getCruiseShip,
} from "../../src/services/cruise.service";
import { FormCruiseFilter, FormCruiseSearch } from "../../src/components/form";
import { CustomDivider } from "../../src/components/divider";
import { SearchFilters } from "../../src/components/search";

const CruiseSearch = (props) => {
  const router = useRouter();
  const { query } = router;
  const {
    destinations,
    period_month,
    period_year,
    sort,
    ship,
    cruise_duration,
  } = props;
  const cruises = useInfiniteQuery(
    ["getCruises", query],
    ({ pageParam = 1 }) => getCruises({ filters: query, pageParam: pageParam }),
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
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = cruises;
  const [history, setHistory] = useLocalStorage("cruise_search", []);
  const handleSubmit = (values, actions) => {
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    router.push({ pathname: "/cruises/search", query: values });
  };
  const form = {
    destination: query.destination ?? "",
    period_month: query.period_month ?? "",
    period_year: query.period_year ?? "",
  };
  const EditSearch = () => {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
    const ActionButton = () => {
      const formik = useFormikContext();
      return (
        <SimpleGrid
          columns={2}
          direction={"row"}
          pt={"24px"}
          alignItems={"center"}
          spacing={6}
        >
          <CustomOrangeFullWidthButton
            mt={0}
            isoutlined
            onClick={() => {
              onToggle();
              formik.handleReset();
            }}
          >
            Batal
          </CustomOrangeFullWidthButton>
          <CustomOrangeFullWidthButton
            // type="submit"
            isLoading={formik.isSubmitting}
            onClick={formik.handleSubmit}
            mt={0}
          >
            Terapkan
          </CustomOrangeFullWidthButton>
        </SimpleGrid>
      );
    };
    return (
      <Box>
        <Formik
          initialValues={{
            sort: query.sort ?? "RECOMMENDED",
            destination: query.destination ?? "Sura",
            period_month: query.period_month ?? "",
            period_year: query.period_year ?? "",
            max_price: query.max_price ?? 999999999,
            min_price: query.min_price ?? 0,
            type: convertToArray(query.type) ?? [],
            duration: query.duration ?? "",
            ship: convertToArray(query.ship) ?? [],
          }}
          onSubmit={(val) => handleSubmit(val)}
        >
          <Form>
            <Box
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              as={"section"}
              bg={"white"}
            >
              <Collapse in={!isOpen}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  // px={"24px"}
                  py={"16px"}
                >
                  <Skeleton isLoaded={!cruises.isLoading}>
                    <Text
                      display={"flex"}
                      alignSelf={"center"}
                      color={"neutral.text.high"}
                      fontSize={"sm"}
                    >
                      Hasil Pencarian &quot;
                      <Text
                        as={"span"}
                        fontWeight={"bold"}
                        color={"brand.blue.400"}
                      >
                        {query.destination || "Semua Cruise"}
                        {/* {selected.area} */}
                      </Text>
                      &quot;
                    </Text>
                  </Skeleton>
                  <IconButton
                    size={"sm"}
                    onClick={onToggle}
                    variant={"unstyled"}
                    icon={<EditIcon width={20} height={20} />}
                  />
                </Stack>
              </Collapse>
              <Collapse in={isOpen}>
                <Stack py={6}>
                  <FormCruiseSearch
                    handleSubmit={handleSubmit}
                    destinations={destinations}
                    period_month={period_month}
                    period_year={period_year}
                    actionButton={<ActionButton />}
                  />
                </Stack>
              </Collapse>
            </Box>
            <CustomDivider />
            <SearchFilters
              totalData={cruises.data?.pages[0]?.meta?.pagination?.total}
              isLoading={cruises.isLoading}
              title="Cruise"
              result={cruises}
              filter={
                <FormCruiseFilter ship={ship} duration={cruise_duration} />
              }
              data={cruises.data}
              sort={sort}
            />
          </Form>
        </Formik>
      </Box>
    );
  };

  return (
    <Layout
      type={"nested"}
      metatitle={`Hasil Pencarian Cruise ke ${
        query.destination || "Semua Tujuan"
      }, ${query.period_month} ${query.period_year}`}
      pagetitle={"Hasil Pencarian Cruise"}
    >
      <EditSearch />
      <Box as={"section"} px={"24px"} bg={"brand.blue.100"} mx={"-24px"}>
        <Stack
          spacing={"16px"}
          py={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <CruiseListItem query={cruises} />
          <CustomOrangeFullWidthButton
            hidden={!hasNextPage}
            onClick={fetchNextPage}
            isLoading={isFetchingNextPage}
          >
            Lihat Lebih Banyak
          </CustomOrangeFullWidthButton>
        </Stack>
      </Box>
    </Layout>
  );
};
export const getServerSideProps = async (ctx) => {
  try {
    const sort = [
      { label: "Direkomendasikan", value: "RECOMMENDED" },
      { label: "Durasi Tersingkat", value: "SHORTEST_DURATION" },
      { label: "Durasi Terlama", value: "LONGEST_DURATION" },
      { label: "Earlier Departure", value: "EARLIER_DEPARTURE" },
      { label: "Latest Departure", value: "LATEST_DEPARTURE" },
      { label: "Harga Terendah", value: "LOWEST_PRICE" },
      { label: "Harga Tertinggi", value: "HIGHEST_PRICE" },
    ];
    const cruise_duration = [
      { label: "< 1 Week", value: "1" },
      { label: "> 1 Week", value: "2" },
    ];
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

    const ship = await getCruiseShip();

    const destinations = await getCruiseDestinations();
    return {
      props: {
        cruise_duration,
        destinations: destinations.data,
        period_month,
        period_year: years,
        sort,
        ship,
        meta: {
          title: "Hasil Pencarian Cruise",
        },
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
export default CruiseSearch;
