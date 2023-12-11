import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../src/components/layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { CustomHotelsTabs } from "../../src/components/tab";
import { Field, Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { resetDataTour } from "../../src/state/tour/tour.slice";
import { resetDataFlight } from "../../src/state/order/order.slice";
import { useLocalStorage } from "../../src/hooks";
import { HotelHistory } from "../../src/components/card";
import { CustomDropdown } from "../../src/components/dropdown";
import HotelIcon from "../../public/svg/icons/location.svg";
import CustomCalendar from "../../src/components/calendar";
import date from "../../src/helpers/date";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import _ from "underscore";
import { HotelSearchForm } from "../../src/components/form";

const Hotels = (props) => {
  const responsive = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { popular, populars } = props;

  const [history, setHistory] = useLocalStorage("hotel_search", []);

  const handleSubmit = (values) => {
    values.checkout_date = date(new Date(values.checkout_date), "yyyy-MM-dd");
    values.checkin_date = date(new Date(values.checkin_date), "yyyy-MM-dd");
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    router.push({ pathname: "/hotels/search", query: values });
  };

  const form = {
    places: "",
    checkin_date: "",
    checkout_date: "",
    rooms: 1,
    adult: 1,
    children: 0,
    children_ages: [],
    sort: "RECOMMENDED",
  };

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
  }, [dispatch]);

  return (
    <Layout
      bgheader={"/svg/hotel/header-bg.svg"}
      pagetitle={"Hotel"}
      type={"alt"}
    >
      <Box as={"section"} py={"24px"}>
        <Box mx={"auto"} maxW={{ lg: "container.lg", xl: "container.xl" }}>
          <Formik
            initialValues={form}
            onSubmit={handleSubmit}
            validationSchema={() =>
              Yup.object().shape({
                places: Yup.string().required("Lokasi wajib diisi"),
                checkin_date: Yup.string().required("Check In wajib diisi"),
                //checkout date cannot be less than checkin date
                checkout_date: Yup.string().when("checkin_date", {
                  is: (val) => val && val.length > 0,
                  then: Yup.string().test(
                    "is-checkout-date-greater-than-checkin-date",
                    "Check Out tidak boleh sama dengan Check In",
                    function (value) {
                      //format date to yyyy-mm-dd
                      const checkin_date = date(
                        new Date(this.parent.checkin_date),
                        "yyyy-MM-dd"
                      );
                      const checkout_date = date(new Date(value), "yyyy-MM-dd");
                      return checkout_date > checkin_date;
                    }
                  ),
                }),
                rooms: Yup.string().test(
                  "is-rooms-greater-than-0",
                  "Kamar tidak boleh kurang dari 1",
                  function (value) {
                    return value > 0;
                  }
                ),
                //adults cannot be less than 1 and maximum 2 adults per room
                adult: Yup.string()
                  .test(
                    "is-adult-greater-than-1",
                    "Jumlah Dewasa tidak boleh kurang dari 1",
                    function (value) {
                      return value > 0;
                    })
                  .when("rooms", {
                    is: (val) => {
                      return val == 1;
                    },
                    then: Yup.string().test(
                      "is-adult-greater-than-1",
                      "Maksimal 2 Dewasa per kamar",
                      function (value) {
                        return value <= 2;
                      }
                    ),
                  })
                  //max 2 adults per room
                  .when("rooms", {
                    is: (val) => val > 1,
                    then: Yup.string().test(
                      "is-adult-greater-than-1",
                      "Maksimal 2 Dewasa per kamar",
                      function (value) {
                        return this.parent.rooms * 2 >= value;
                      }),
                  }),
                //when 2 adult max 1 children per room
                children: Yup.string().when("adult", {
                  is: (val) => val == 1,
                  then: Yup.string().test(
                    "is-children-greater-than-1",
                    "Jumlah Anak tidak boleh lebih dari 1",
                    function (value) {
                      return value <= 1;
                    }
                  ),
                }),
                children_ages: Yup.array().when("children", {
                  is: (val) => val > 0,
                  then: Yup.array().min(1, "Umur anak wajib diisi"),
                }),
              })
            }
          >
            <Form>
              <HotelSearchForm history={history} populars={populars} />
            </Form>
          </Formik>
        </Box>
      </Box>
      {
        history.length > 0 && (
          <Box mx={"-24px"} py={"24px"} bg={"brand.blue.100"} as={"section"}>
            <SimpleGrid columns={1} spacing={"16px"}>
              <Box
                w={"full"}
                maxW={{ lg: "container.lg", xl: "container.xl" }}
                mx={"auto"}
              // px={{ base: "24px", xl: "0" }}
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
                <HotelHistory
                  item={history}
                  handleClick={handleSubmit}
                  setItem={setHistory}
                // area={area}
                // destination={allDestination}
                />
              </Stack>
            </SimpleGrid>
          </Box>
        )
      }
      <Box py={"24px"} as={"section"}>
        <Stack maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <Heading color={"neutral.text.high"} fontSize={"md"}>
            Trending Hotel
          </Heading>
          <Text fontSize={"sm"} color={"neutral.text.medium"}>
            Nginap ditempat nyaman agar liburan tetap asik
          </Text>
        </Stack>
        <Tabs
          m={"-24px"}
          py={"24px"}
          variant="solid-rounded"
          colorScheme="brand.blue"
          isLazy
        // display={"flex"}
        // flexDir={"column"}
        >
          <TabList
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            py={"24px"}
          >
            <Swiper
              spaceBetween={12}
              slidesOffsetBefore={useBreakpointValue(
                { base: 24, md: 0 },
                { ssr: false }
              )}
              slidesOffsetAfter={24}
              slidesPerView={"auto"}
              style={{ width: "100%", height: "100%" }}
            >
              {/* TODO: Hotel Tags Query */}
              {props.popular &&
                props.popular?.map((item, index) => (
                  <SwiperSlide style={{ width: "fit-content" }} key={index}>
                    <Tab
                      display={"flex"}
                      width={"max-content"}
                      px={"16px"}
                      py={"8px"}
                      fontSize={"sm"}
                      fontWeight="normal"
                      bgColor={"neutral.color.bg.secondary"}
                      color={"neutral.text.medium"}
                      _selected={{
                        bgColor: "brand.blue.400",
                        color: "brand.blue.100",
                      }}
                    >
                      {item.name}
                    </Tab>
                  </SwiperSlide>
                ))}
            </Swiper>
          </TabList>
          <TabPanels bg={"brand.blue.100"}>
            {props.popular &&
              props.popular?.map((item, index) => (
                <TabPanel key={index}>
                  <CustomHotelsTabs item={item} />
                </TabPanel>
              ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Layout >
  );
};

export default Hotels;

export const getStaticProps = async () => {
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
  const popular = [
    {
      name: "Lokasi Terdekat",
      code: "NEARBY",
    },
    {
      name: "Bali",
      code: "BAI",
    },
    {
      name: "Lombok",
      code: "AMI",
    },
    {
      name: "Surabaya",
      code: "SUB",
    },
    {
      name: "Yogyakarta",
      code: "JOG",
    },
    {
      name: "Jakarta",
      code: "JAV",
    },
    {
      name: "Bandung",
      code: "BDO",
    },
    {
      name: "Bogor",
      code: "ID5",
    },
    {
      name: "Solo",
      code: "SOC",
    },
    {
      name: "Semarang",
      code: "SRG",
    },
    {
      name: "Batam",
      code: "BTH",
    },
  ];

  return {
    props: {
      populars,
      popular,
      meta: {
        title: "Hotel",
      },
    },
  };
};
