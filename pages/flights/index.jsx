import { Box, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../src/components/layout";
import { FormFlightSearch } from "../../src/components/form";
import { convertDateFlight, convertDateFlightWithYear } from "../../src/helpers";
import { CustomDivider } from "../../src/components/divider";
import { useDispatch } from "react-redux";
import { resetDataTour } from "../../src/state/tour/tour.slice";
import { resetDataFlight } from "../../src/state/order/order.slice";
import { useLocalStorage } from "../../src/hooks";
import { FlightHistory } from "../../src/components/card";

const Flights = (props) => {
  const { fields, classes } = props;
  const router = useRouter();
  const [history, setHistory] = useLocalStorage("flight_search", []);
  const dispatch = useDispatch();
  const [isMultiTrip, setIsMultiTrip] = useState(false);
  const initialForm = {
    departure: {
      name: "",
      city: "",
      code: "",
    },
    destination: {
      name: "",
      city: "",
      code: "",
    },
    departure_date:
      history.length > 0
        ? new Date(history[0].flights[0].departure_date)
        : new Date(),
    return_date:
      history.length > 0
        ? new Date(history[0].flights[0].return_date)
        : new Date(),
    class: history.length > 0 ? history[0].flights[0].class : "E",
    is_round_trip:
      history.length > 0 ? history[0].flights[0].is_round_trip : false,
    adult: history.length > 0 ? history[0].flights[0].adult : 1,
    child: history.length > 0 ? history[0].flights[0].child : 0,
    infant: history.length > 0 ? history[0].flights[0].infant : 0,
  };

  const handleSubmit = (values, actions) => {
    let query = {
      departureDate: convertDateFlightWithYear(values.flights[0].departure_date),
      returnDate:
        values.flights[0].is_round_trip == true
          ? convertDateFlightWithYear(values.flights[0].return_date)
          : "",
      originCode: values.flights[0].departure.code,
      destinationCode: values.flights[0].destination.code,
      adult: values.flights[0].adult,
      child: values.flights[0].child,
      infant: values.flights[0].infant,
      cabinClasses: [values.flights[0].class],
      airlines: "",
      isRoundTrip: values.flights[0].is_round_trip,
      is_smart_combo: values.flights[0].is_round_trip,
    };
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    router.push({ pathname: "/flights/search", query: query });
  };

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
  }, []);
  
  return (
    <Layout
      pagetitle={"Tiket Pesawat"}
      type={"alt"}
      bgheader={"/svg/flights/header-bg.svg"}
      hideBottomBar
    >
      <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
        <Flex as={"section"} py={"24px"} justify={"space-between"}>
          <HStack onClick={() => setIsMultiTrip(false)}>
            <Box hidden={isMultiTrip}>
              <Image
                src="/svg/flights/checked.svg"
                alt="Flights"
                width={15}
                height={15}
              />
            </Box>
            <Text
              color={isMultiTrip ? "neutral.text.low" : "brand.blue.400"}
              fontWeight={isMultiTrip ? "regular" : "semibold"}
            >
              Sekali Jalan / Pergi-Pulang
            </Text>
          </HStack>
          {/* <HStack onClick={() => setIsMultiTrip(true)}>
            <Box hidden={!isMultiTrip}>
              <Image
                src="/svg/flights/checked.svg"
                alt="Flights"
                width={15}
                height={15}
              />
            </Box>
            <Text
              color={isMultiTrip ? "brand.blue.400" : "neutral.text.low"}
              fontWeight={isMultiTrip ? "semibold" : "regular"}
            >
              Multi Kota
            </Text>
          </HStack> */}
        </Flex>
      </Box>
      <CustomDivider />
      <FormFlightSearch
        handleSubmit={handleSubmit}
        fields={fields}
        classes={classes}
        initialForm={initialForm}
        history={history}
      />
      <Box
        bg={"brand.blue.100"}
        // maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={"-24px"}
      >
        <Stack
          spacing={"16px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          py={"24px"}
          bg={"brand.blue.100"}
          as={"section"}>
          <Stack px={{ sm: '24px', lg: '0px' }}>
            <Heading
              color={"neutral.text.high"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Pencarian Terakhir
            </Heading>
            <FlightHistory
              handleClick={handleSubmit}
              item={history}
              setItem={setHistory}
            />
          </Stack>
        </Stack>
      </Box>
      {/* <Box as={"section"} py={"24px"}>
        <Stack>
          <Heading color={"neutral.text.high"} fontSize={{base: "md", md: 'lg'}}>
            Informasi Tiket
          </Heading>
          <Text color={"neutral.text.medium"}>Lorem ipsum dolor sit amet</Text>
        </Stack>
        <Stack spacing={5} py={5}>
          <Flex justifyContent={"space-between"} alignItems="center">
            <HStack alignItems={"center"} gap={1}>
              <Image
                src="/svg/flights/date.svg"
                alt="Date Icon"
                width={24}
                height={24}
              />
              <Text color={"neutral.text.high"} fontWeight="medium">
                Cara Reschedule Tiket
              </Text>
            </HStack>
            <Image
              src="/svg/icons/chevron-left-dark.svg"
              alt="Chevron Left Icon"
              width={24}
              height={24}
            />
          </Flex>
          <Flex justifyContent={"space-between"} alignItems="center">
            <HStack alignItems={"center"} gap={1}>
              <Image
                src="/svg/flights/wallet.svg"
                alt="Date Icon"
                width={24}
                height={24}
              />
              <Text color={"neutral.text.high"} fontWeight="medium">
                Cara Refund Tiket
              </Text>
            </HStack>
            <Image
              src="/svg/icons/chevron-left-dark.svg"
              alt="Chevron Left Icon"
              width={24}
              height={24}
            />
          </Flex>
        </Stack>
      </Box> */}
    </Layout>
  );
};

export default Flights;

export const getStaticProps = async () => { 
  const classes = [
    { label: "Economy", value: "Economy" },
    { label: "Premium Economy", value: "PremiumEconomy" },
    { label: "Business", value: "Business" },
    { label: "First", value: "First" },
    { label: "Premium First", value: "PremiumFirst" },
    // { label: "Business Class", value: "B" },
    // { label: "First Class", value: "F" },
  ];

  const fields = [
    {
      name: "departure",
      label: "Asal",
    },
    {
      name: "destination",
      label: "Tujuan",
    },
    {
      name: "departure_date",
      label: "Tanggal Pergi",
    },
    {
      name: "return_date",
      label: "Tanggal Pulang",
    },
    {
      name: "class",
      label: "Kelas Penerbangan",
    },
    [
      {
        name: "adult",
        label: "Dewasa",
        description: "Lebih dari 12 tahun",
      },
      {
        name: "child",
        label: "Anak",
        description: "2 - 11 tahun",
      },
      {
        name: "infant",
        label: "Bayi",
        description: "6 bulan - 1 tahun",
      },
    ],
  ];

  return {
    props: {
      classes,
      fields,
      meta: {
        title: "Tiket Pesawat",
      },
    },
  };
};
