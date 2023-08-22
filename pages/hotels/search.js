import {
  Box,
  Stack,
  Text,
  useDisclosure,
  IconButton,
  Collapse,
  SimpleGrid,
  Skeleton,
  Badge,
  StackDivider,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { HotelListItem } from "../../src/components/card";
import { FormHotelFilter, HotelSearchForm } from "../../src/components/form";
import Layout from "../../src/components/layout";
import {
  getTotalDataTourV2,
  getToursV2,
} from "../../src/services/tour.service";
import EditIcon from "../../public/svg/icons/edit.svg";
import { SearchFilters } from "../../src/components/search";
import { CustomDivider } from "../../src/components/divider";
import { getCountriesFromIsoCode } from "../../src/services/country.service";
import { useLocalStorage } from "../../src/hooks";
import date from "../../src/helpers/date";
import isToday from "date-fns/isToday";
import intervalToDuration from "date-fns/intervalToDuration";
import { differenceInDays } from "date-fns";
import { getHotels } from "../../src/services/hotel.service";
import { useInView } from "react-intersection-observer";

const SearchHotels = (props) => {
  const router = useRouter();
  const query = router.query;
  const { populars } = props;
  const [total, setTotal] = useState(0);

  const { ref: trigger, inView } = useInView();
  useEffect(() => {
    if (inView) {
      showMoreItems();
    }
  }, [inView]);

  const [history, setHistory] = useLocalStorage("hotel_search", []);

  const getHotel = async ({ pageParam = 1 }) => {
    const filter = {
      stay: {
        checkIn: query.checkin_date,
        checkOut: query.checkout_date,
      },
      occupancies: [
        {
          rooms: parseInt(query.rooms) ?? 0,
          adults: parseInt(query.adult) ?? 1,
          children: parseInt(query.children) ?? 0,
          paxes: query.children_ages
            ? Array.isArray(query.children_ages)
              ? query.children_ages
                  .map((age, index) => {
                    if (index < query.children) {
                      return {
                        type: "CH",
                        age: parseInt(age),
                      };
                    }
                  })
                  .filter((item) => item)
              : [{ type: "CH", age: parseInt(query.children_ages) }]
            : undefined,
        },
      ],
      language: "IND",
      customfilters: {
        sort: query.sort ?? null,
        stars: query.stars ?? [],
        freecancel: query.freecancel === "true" ?? false,
        reschedule: query.reschedule === "true" ?? false,
        facilities: {
          swimmingpool: query.facilities?.includes("swimmingpool") ?? false,
          wifi: query.facilities?.includes("wifi") ?? false,
          spa: query.facilities?.includes("spa") ?? false,
          parking: query.facilities?.includes("parking") ?? false,
          breakfast: query.facilities?.includes("breakfast") ?? false,
          bathub: query.facilities?.includes("bathub") ?? false,
          ac: query.facilities?.includes("ac") ?? false,
          shower: query.facilities?.includes("shower") ?? false,
          kulkas: query.facilities?.includes("kulkas") ?? false,
          bbq: query.facilities?.includes("bbq") ?? false,
          bathroom: query.facilities?.includes("bathroom") ?? false,
          sofa: query.facilities?.includes("sofa") ?? false,
        },
      },
      filter: {
        minRate: parseInt(query.min_price) ?? 0,
        maxRate: parseInt(query.max_price) ?? 16000000,
      },
      page: pageParam,
      limit: 9,
      // lastIndex: pageParam,
    };
    if (query.places === "nearby") {
      filter.geolocation = {
        latitude: -7.4315,
        longitude: 109.2473,
        radius: 20,
        unit: "km",
      };
    }
    if (query.places !== "nearby") {
      filter.regions = {
        code: query.code,
        type: query.type,
        zoneCode: query?.zones ?? null,
      };
    }

    const response = await getHotels(filter);

    return response.data;
  };

  const hotels = useInfiniteQuery(["getHotels", query], getHotel, {
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.hasMore) {
        return lastpage.page + 1;
      } else {
        return false;
      }
      // lastpage.nextCursor;
    },
    keepPreviousData: true,
  });

  const { isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } = hotels;

  const showMoreItems = () => {
    fetchNextPage();
  };

  const handleSubmit = (values) => {
    // setShownItems(9);
    values.checkout_date = date(values.checkout_date, "yyyy-MM-dd");
    values.checkin_date = date(values.checkin_date, "yyyy-MM-dd");
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    router.replace({ pathname: `/hotels/search`, query: values }, undefined, {
      shallow: true,
    });
  };
  const differenceDate = differenceInDays(
    new Date(query.checkout_date),
    new Date(query.checkin_date)
  );

  // const { data, isLoading, isError } = tours;
  const EditSearch = ({
    selected,
    totalData,
    isLoading,
    // airlines,
    ...props
  }) => {
    const {
      tour_type,
      airlines,
      area,
      destination,
      sort,
      // totalData,
    } = props.data;
    const data = {
      tour_type,
      area,
      destination,
    };
    const { isOpen, onToggle } = useDisclosure();
    // const response = await getTours(variables, params);
    const tour_duration = [
      { label: "< 1 Week", value: "1" },
      { label: "> 1 Week", value: "2" },
    ];

    const initialValues = {
      sort: query.sort ?? null,
      max_price: query.max_price ?? 16000000,
      min_price: query.min_price ?? 0,
      places: query.places ?? "",
      checkin_date: new Date(query.checkin_date) ?? new Date(),
      checkout_date: new Date(query.checkout_date) ?? "",
      rooms: parseInt(query.rooms) ?? 0,
      adult: parseInt(query.adult) ?? 0,
      children: parseInt(query.children) ?? 0,
      children_ages: query.children_ages ?? [],
      code: query.code ?? "",
      zones: query.zones ?? "",
      type: query.type ?? "",
      desc: query.desc ?? "",
      stars: query.stars ?? [],
      facilities: query.facilities ?? "",
      freecancel: query.freecancel === "true" ?? "",
      reschedule: query.reschedule === "true" ?? "",
    };

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
            Temukan Hotel
          </CustomOrangeFullWidthButton>
        </SimpleGrid>
      );
    };
    return (
      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={(val) => handleSubmit(val)}
        >
          <Form>
            <Box
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              as={"section"}
              bg={"white"}
              // mx={"-24px"}
            >
              <Collapse in={!isOpen}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  // px={"24px"}
                  py={"16px"}
                >
                  <Skeleton isLoaded={!hotels.isLoading}>
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
                        {query.places || "Semua Hotel"}
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
                  {props.data && (
                    <HotelSearchForm
                      history={history}
                      actionButton={<ActionButton />}
                      populars={populars}
                    />
                  )}
                </Stack>
              </Collapse>
              <Stack
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={"12px"}
                divider={
                  <StackDivider
                    display={{ base: "block", md: "none" }}
                    borderColor={"brand.blue.400"}
                  />
                }
                direction={"row"}
              >
                <Stack
                  spacing={"32px"}
                  flexShrink={0}
                  direction={"row"}
                  alignItems={"center"}
                >
                  <Box>
                    <Text
                      color={"brand.blue.400"}
                      fontSize={"xs"}
                      fontWeight={"bold"}
                    >
                      {date(new Date(query.checkin_date), "dd LLL, yyyy")}
                    </Text>
                    <Text fontSize={"xs"}>
                      {isToday(new Date(query.checkin_date))
                        ? "Hari ini"
                        : date(new Date(query.checkin_date), "EEEE")}
                    </Text>
                  </Box>
                  <Stack>
                    <Badge
                      colorScheme={"brand.orange"}
                      color="brand.orange.500"
                      textTransform={"capitalize"}
                      fontWeight="normal"
                    >
                      {/* count night duration */}
                      {differenceInDays(
                        new Date(query.checkout_date),
                        new Date(query.checkin_date)
                      )}{" "}
                      malam
                    </Badge>
                  </Stack>
                  <Box>
                    <Text
                      color={"brand.blue.400"}
                      fontSize={"xs"}
                      fontWeight={"bold"}
                    >
                      {date(new Date(query.checkout_date), "dd LLL, yyyy")}
                    </Text>
                    <Text fontSize={"xs"}>
                      {isToday(new Date(query.checkout_date))
                        ? "Hari ini"
                        : date(new Date(query.checkout_date), "EEEE")}
                    </Text>
                  </Box>
                </Stack>
                <Stack flexShrink={0}>
                  <Text
                    color={"brand.blue.400"}
                    fontSize={"xs"}
                    fontWeight={"bold"}
                  >
                    {query.rooms} Kamar
                  </Text>
                </Stack>
              </Stack>
            </Box>
            <CustomDivider />
            <SearchFilters
              isLoading={isLoading}
              filter={
                <FormHotelFilter
                  tour_type={tour_type}
                  airlines={airlines}
                  tour_duration={tour_duration}
                />
              }
              title={"Hotel"}
              result={hotels}
              airlines={airlines}
              data={data}
              totalData={totalData}
              sort={sort}
            />
          </Form>
        </Formik>
      </Box>
    );
  };
  //check if type hotel redirect to hotel page
  if (query.type === "hotel") {
    let slug = query.places.toLowerCase().replace(/ /g, "-");
    const values = {
      checkin_date: query.checkin_date,
      checkout_date: query.checkout_date,
      rooms: query.rooms,
      adult: query.adult,
      children: query.children,
      children_ages: query.children_ages,
    };
    router.replace(
      { pathname: `/hotels/${slug}-${query.code}`, query: values },
      undefined,
      {
        shallow: true,
      }
    );
  } else {
    return (
      <Layout
        type={"nested"}
        metatitle={`Hasil Pencarian Hotel di ${
          !hotels.isLoading ? query.places || "Semua Tujuan" : "..."
        }`}
        pagetitle={"Hasil Pencarian Hotel"}
      >
        <EditSearch
          isLoading={isLoading}
          selected={query}
          totalData={total}
          data={props}
          // airlines={airlines}
          handleSubmit={handleSubmit}
        />
        <Box as={"section"} px={"24px"} bg={"brand.blue.100"} mx={"-24px"}>
          <Stack
            spacing={"16px"}
            py={"24px"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
          >
            <HotelListItem query={hotels} differenceDate={differenceDate} />
            {hasNextPage && (
              <Center mt={4}>
                <Spinner ref={trigger}></Spinner>
              </Center>
            )}
            {/* <CustomOrangeFullWidthButton
              hidden={!hasNextPage}
              onClick={fetchNextPage}
              isLoading={isFetchingNextPage}
            >
              Lihat Lebih Banyak
            </CustomOrangeFullWidthButton> */}
          </Stack>
        </Box>
      </Layout>
    );
  }
};

export const getServerSideProps = async (ctx) => {
  const populars = {
    hotels: [],
    regions: [],
    cities: [],
    matching: [
      {
        code: "BAI",
        name: "Bali",
        countryCode: "ID",
        isoCode: "ID",
        id: 7914,
        countryId: {
          name: "Indonesia",
          isoCode: "ID",
        },
        type: "region",
        scoreMatching: "1.00",
      },
      {
        code: "AMI",
        name: "Lombok",
        countryCode: "ID",
        isoCode: "ID",
        id: 938,
        countryId: {
          name: "Indonesia",
          isoCode: "ID",
        },
        type: "region",
        scoreMatching: "1.00",
      },
      {
        zoneName: "Surabaya",
        zoneCode: "1",
        id: 23376,
        destinationId: {
          code: "SUB",
          name: "Surabaya",
          countryCode: "ID",
          isoCode: "ID",
          id: 5699,
          countryId: {
            name: "Indonesia",
            isoCode: "ID",
          },
        },
        type: "city",
        scoreMatching: 0.8571428571428571,
      },
      {
        zoneName: "Yogyakarta",
        zoneCode: "1",
        id: 40092,
        destinationId: {
          code: "JOG",
          name: "Yogyakarta",
          countryCode: "ID",
          isoCode: "ID",
          id: 10060,
          countryId: {
            name: "Indonesia",
            isoCode: "ID",
          },
        },
        type: "city",
        scoreMatching: 0.8888888888888888,
      },
      {
        code: "JAV",
        name: "Jakarta",
        countryCode: "ID",
        isoCode: "ID",
        id: 9997,
        countryId: {
          name: "Indonesia",
          isoCode: "ID",
        },
        type: "region",
        scoreMatching: "1.00",
      },
      {
        zoneName: "Bandung",
        zoneCode: "1",
        id: 31033,
        destinationId: {
          code: "BDO",
          name: "Bandung",
          countryCode: "ID",
          isoCode: "ID",
          id: 7956,
          countryId: {
            name: "Indonesia",
            isoCode: "ID",
          },
        },
        type: "city",
        scoreMatching: 0.8333333333333334,
      },
      {
        zoneName: "Singapore",
        zoneCode: "1",
        id: 50075,
        destinationId: {
          code: "SIN",
          name: "Singapura",
          countryCode: "SG",
          isoCode: "SG",
          id: 12270,
          countryId: {
            name: "Singapura",
            isoCode: "SG",
          },
        },
        type: "city",
        scoreMatching: 1,
      },
      {
        code: "BKK",
        name: "Bangkok",
        countryCode: "TH",
        isoCode: "TH",
        id: 1281,
        countryId: {
          name: "Thailand",
          isoCode: "TH",
        },
        type: "region",
        scoreMatching: "1.00",
      },
    ],
  };

  return {
    props: {
      populars,
      meta: {
        title: "Hasil Pencarian Hotel",
      },
    },
  };
};

export default SearchHotels;
