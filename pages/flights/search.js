/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  chakra,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Wrap,
  VStack,
  useDisclosure,
  useBreakpointValue,
  Spinner,
  LinkBox,
  Checkbox,
  LinkOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../src/components/layout";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
} from "./../../src/components/button";
import { CustomRangeSlider } from "../../src/components/range";
import {
  CustomCheckbox,
  CustomCheckboxFill,
} from "../../src/components/checkbox";
import ChevronDown from "../../public/svg/icons/chevron-filled-down.svg";
import InfoIcon from "../../public/svg/icons/info.svg";
import { getAirports, getDetailPrice, getFlights } from "../../src/services/flight.service";
import {
  convertDateFlightPage,
  convertRupiah,
  convertTimeFlightPage,
  differenceDate,
  differenceDateLong,
  filterAirlines,
  filterFacility,
  filterFlightDepartureAndArrival,
  filterIsDomestic,
  filterOthers,
  filterPrice,
  filterTransit,
  getAirlineAvailable,
  getClassCode,
  simplifyBodyDetailFlight,
  simplifyQuerySearch,
  sortFlight,
  sumPriceFare,
  sumPriceFareFinal,
} from "../../src/helpers";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { orderData } from "../../src/state/order/order.slice";
import { NoResults } from "../../src/components/card";
import { useInView } from "react-intersection-observer";
import date from "../../src/helpers/date";
import { useLoginToast } from "../../src/hooks";
import FlightItem from "../../src/components/flights/FlightItem";

const SearchFlights = ({
  additionalData,
  totalFlight,
  noresults,
  ...props
}) => {
  // let noresults = false
  // console.log(additionalData)
  const router = useRouter();
  const dataQuery = router.query;
  
  let query = {
    departureDate: dataQuery?.departureDate,
    returnDate: dataQuery?.returnDate,
    originCode: dataQuery?.originCode,
    destinationCode: dataQuery?.destinationCode,
    adult: dataQuery?.adult,
    child: dataQuery?.child,
    infant: dataQuery?.infant,
    cabinClasses: [dataQuery?.cabinClasses],
    airlines: dataQuery?.airlines,
    isRoundTrip: dataQuery?.isRoundTrip,
    is_smart_combo: dataQuery?.is_smart_combo,
  };

  // console.log(query)

  const [currentJourney, setCurrentJourney] = useState() 
  const [flights, setFlights] = useState([]);


  const [statusSuccess, setStatusSuccess] = useState(false);

  const dispatch = useDispatch();
  const { ref: trigger, inView } = useInView();
  const [sortBy, setSortBy] = useState("Harga Terendah");
  const [filter, setFilter] = useState({});
  const [shownItems, setShownItems] = useState(15);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [cart, setCart] = useState([]);
  const [checkoutPage, setCheckoutPage] = useState(false);
  const [isSmartCombo, setIsSmartCombo] = useState(true)
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );

  const [originData, setOriginData] = useState('')
  const [destinationData, setDestinationData] = useState('')

  // console.log(flights)
  // console.log(noresults)

  const fetchFlight = async (
    query,
    shownItems,
    position,
    sort,
    filter = null
  ) => {
    setIsLoading(true);
    const payload = query;
    // console.log(payload);

    try {
      const response = await getFlights(payload, isSmartCombo);
      
      const originName = await getAirports(query?.originCode)
      const destinationName = await getAirports(query?.destinationCode)
    
      if(originName?.length > 0){
        setOriginData(originName)
      }

      if(destinationName?.length > 0){
        setDestinationData(destinationName)
      }

      if (response.success === true) {
        const currentFlight = response.data?.Schedules[position]?.Flights;
        setCurrentJourney(response.data?.Schedules[position]);


        setFlights(currentFlight.slice(0, shownItems));
        setTotalData(currentFlight.length);
        setIsLoading(false);
        setStatusSuccess(true);
      } else if (response.success === false) {
        setStatusSuccess(false);
      }
    } catch (error) {
      // console.error('Error fetching flight data:', error);
      setIsLoading(false);
      setStatusSuccess(false);
    }

    // const payload = simplifyQuerySearch(query);
    // if (
    //   query.isRoundTrip === "true" &&
    //   cart?.[0]?.isCombine === true &&
    //   position === 1 &&
    //   query?.is_smart_combo == "true"
    // ) {
    //   //search flight for return from combine flight. search with cart[0].journeyKey
    //   currentFlight = response.filter[0]?.combinedJourneys?.filter((item) => {
    //     return item?.journeys[0].journeyKey === cart[0].journeyKey;
    //   });
    //   // tidak mengambil journey array pertama karena sudah diambil di search pertama
    //   currentFlight = currentFlight[0]?.journeys.slice(1);
    //   //add isCombine to each flight
    //   currentFlight = currentFlight.map((item) => {
    //     item.isCombine = true;
    //     return item;
    //   });
    //   // hide when journeyKey is same on array
    //   // let currentFlights = currentFlight;
    //   // currentFlight = currentFlights.filter((item, index) => {
    //   //   return (
    //   //     currentFlights.findIndex(
    //   //       (item2) => item2.journeyKey === item.journeyKey
    //   //     ) === index
    //   //   );
    //   // });

    //   setTotalData(currentFlight.length);
    // }
    // if (filter) {
    //   if (filter?.transits?.length > 0)
    //     currentFlight = filterTransit(currentFlight, filter.transits);
    //   if (filter?.airlines?.length > 0)
    //     currentFlight = filterAirlines(currentFlight, filter.airlines);
    //   if (filter?.others?.length > 0)
    //     currentFlight = filterOthers(currentFlight);
    //   if (filter?.facilities?.length > 0)
    //     currentFlight = filterFacility(currentFlight);
    //   if (filter?.departure_times?.length > 0)
    //     currentFlight = filterFlightDepartureAndArrival(
    //       currentFlight,
    //       "departure",
    //       filter.departure_times
    //     );
    //   if (filter?.arrival_times?.length > 0)
    //     currentFlight = filterFlightDepartureAndArrival(
    //       currentFlight,
    //       "arrival",
    //       filter.arrival_times
    //     );
    //   currentFlight = filterPrice(
    //     currentFlight,
    //     filter.min_price,
    //     filter.max_price
    //   );
    //   setTotalData(currentFlight.length);
    //   setIsLoading(false);
    // } else {
    //   if (cart?.[0]?.isCombine !== true) {
    //     setTotalData(response.data[position].journeys.length);
    //   }
    // }
    // //sort flight
    // currentFlight = sortFlight(sortBy, currentFlight);
    // //jika isCombine true, maka tampilkan di paling atas
    // if (query.isRoundTrip === "true" && query?.is_smart_combo == "true") {
    //   let isCombine = currentFlight.filter((item) => {
    //     return item.isCombine === true;
    //   });
    //   let currFlight = currentFlight.filter((item) => {
    //     return item.isCombine !== true;
    //   });
    //   currFlight = [...isCombine, ...currFlight];
    //   currentFlight = currFlight;
    // }
    // // hide when journeyKey is same on array
    // let currentFlights = currentFlight;
    // currentFlight = currentFlights.filter((item, index) => {
    //   return (
    //     currentFlights.findIndex(
    //       (item2) => item2.journeyKey === item.journeyKey
    //     ) === index
    //   );
    // });
    // setFlights(currentFlight.slice(0, shownItems));

    // setTotalData(currentFlight.length);

    // setIsLoading(false);
  };
  
  useEffect(() => {
    if (flights.length === 0 || statusSuccess === false) {
      setIsLoading(!noresults ?? true);
      fetchFlight(query, shownItems, position, sortBy, filter);
    } else {
      setIsLoading(false);
    }
  }, [flights, statusSuccess, noresults, query, shownItems, position, sortBy, filter]);

  const handleFilter = (filter) => {
    setIsLoading(true);
    filter.is_filtered = true;
    setFilter(filter);
  };

  useEffect(() => {
    if (inView) {
      showMoreItems();
    }
  }, [inView]);
  const showMoreItems = () => {
    setShownItems((prev) => prev + 15);
  };

  const handleViewAll = () => {
    showMoreItems();
  };

  const handlePosition = (e, value, journey) => {
    e.preventDefault();
    if (!(e.target.innerHTML === "Detail")) {
      setCart([...cart, journey]);
      if (position < totalFlight - 1) {
        setPosition(value + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCheckoutPage(true);
      }
      setIsLoading(true);
    }
  };

  // useEffect(() => {
  //   if (checkoutPage) {
  //     dispatch(
  //       orderData({
  //         data: cart,
  //         query: query,
  //         isDomestic: filterIsDomestic(additionalData.data),
  //       })
  //     );
  //     router.push({ pathname: "/flights/order-details" });
  //   }
  // }, [additionalData.data, cart, checkoutPage, dispatch, query, router]);

  const SortButton = ({ sortByState }) => {
    const [sortBy, setSortBy] = sortByState;
    const [value, setValue] = useState("");
    const data = [
      "Harga Terendah",
      "Harga Tertinggi",
      "Keberangkatan Pagi",
      "Keberangkatan Malam",
      "Durasi Singkat",
      "Durasi Panjang",
    ];

    const handleSortBy = () => {
      try {
        setSortBy(value);
        // handleFilter(filter);
      } catch (error) {
        console.log(error);
      }
    };

    const handleResetSortBy = () => {
      try {
        setSortBy("Harga Terendah");
        setValue("");
        // handleFilter(filter);
      } catch (error) {
        console.log(error);
      }
    };

    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button
          variant={"link"}
          colorScheme={"brand.blue"}
          fontWeight={"normal"}
          size={{ base: "xs", md: "sm" }}
          onClick={onOpen}
          leftIcon={
            <Image
              src={"/svg/icons/sort.svg"}
              alt={"Filter Icon"}
              width={20}
              height={20}
            />
          }
        >
          Urutkan
        </Button>
        <CustomFilterButton
          drawer={drawerRef}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          title={"Urutkan"}
          onSubmit={handleSortBy}
          onReset={handleResetSortBy}
          footer={"Terapkan"}
        >
          <RadioGroup onChange={setValue} value={value == "" ? sortBy : value}>
            <Stack spacing={5} py={5}>
              {data?.map((item, index) => (
                <Radio
                  flexDirection={"row-reverse"}
                  colorScheme={"brand.blue"}
                  justifyContent={"space-between"}
                  key={index}
                  value={item}
                >
                  {item}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </CustomFilterButton>
      </>
    );
  };

  const FilterButton = ({ airlines, handleFilter }) => {
    const initialFilter = {
      min_price: 0,
      max_price: 16000000,
      transits: [],
      departure_times: [],
      arrival_times: [],
      airlines: [],
      others: [],
      // facilities: [],
      is_filtered: false,
      is_smart_combo: query?.is_smart_combo == "true" ? true : false,
    };
    const [filter, setFilter] = useState(initialFilter);
    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleChange = (type, item) => {
      if (filter[type].includes(item.id)) {
        setFilter({
          ...filter,
          [type]: filter[type].filter((i) => i !== item.id),
        });
      } else {
        setFilter({
          ...filter,
          [type]: [...filter[type], item.id],
        });
      }
    };

    
    const times = [
      {
        id: "1",
        range: "00.00 - 06.00 WIB",
      },
      {
        id: "2",
        range: "06.00 - 12.00 WIB",
      },
      {
        id: "3",
        range: "12.00 - 18.00 WIB",
      },
      {
        id: "4",
        range: "18.00 - 24.00 WIB",
      },
    ];

    const data = {
      transits: [
        {
          id: "1",
          name: "Langsung",
        },
        {
          id: "2",
          name: "1 Transit",
        },
        {
          id: "3",
          name: "2 Transit",
        },
      ],
      departure_times: times,
      arrival_times: times,
      others: [
        {
          id: "1",
          name: "Bisa Refund",
        },
      ],
      // facilities: [
      //   {
      //     id: "1",
      //     name: "Bagasi",
      //   },
      // ],
    };

    const tabs = [
      {
        name: "Transit",
        label: "transits",
        type: "checkbox",
      },
      {
        name: "Waktu Berangkat",
        label: "departure_times",
        type: "tag",
      },
      {
        name: "Waktu Tiba",
        label: "arrival_times",
        type: "tag",
      },
      {
        name: "Maskapai",
        label: "airlines",
        type: "checkbox",
        extendable: false,
      },
      {
        name: "Lainnya",
        label: "others",
        type: "checkbox",
      },
      // {
      //   name: "Fasilitas",
      //   label: "facilities",
      //   type: "checkbox",
      //   extendable: false,
      // },
    ];

    data.airlines = getAirlineAvailable(airlines);

    return (
      <>
        <Button
          variant={"link"}
          colorScheme={"brand.blue"}
          fontWeight={"normal"}
          size={{ base: "xs", md: "sm" }}
          onClick={onOpen}
          leftIcon={
            <Image
              src={"/svg/icons/filter.svg"}
              alt={"Sort Icon"}
              width={20}
              height={20}
            />
          }
        >
          Filter
        </Button>
        <CustomFilterButton
          drawer={drawerRef}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          onSubmit={() => handleFilter(filter)}
          onReset={() => setFilter(initialFilter)}
          title={"Filter"}
          footer={"Terapkan"}
          notrounded
        >
          {query?.isRoundTrip == "true" && (
            <Box>
              <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
              <Stack spacing={"24px"} py={"24px"}>
                <Heading fontSize={"md"}>Smart Combo</Heading>
                <Stack spacing={5} py={5}>
                  <Checkbox
                    spacing={0}
                    alignItems={"start"}
                    size={"md"}
                    isChecked={filter.is_smart_combo}
                    colorScheme="brand.blue"
                    flexDir={"row-reverse"}
                    w="full"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        is_smart_combo: e.target.checked,
                      });
                      //add to query
                      const query = {
                        ...router.query,
                        is_smart_combo: e.target.checked,
                      };
                      router.push({
                        pathname: router.pathname,
                        query,
                      });
                    }}
                  >
                    <Text
                      color={"neutral.text.high"}
                      fontSize={{ baes: "md", md: "lg" }}
                      fontWeight={"normal"}
                    >
                      Smart Combo
                    </Text>
                  </Checkbox>
                </Stack>
              </Stack>
            </Box>
          )}
          <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
          <Stack spacing={"24px"} py={"24px"}>
            <Heading fontSize={"md"}>Rentang Harga</Heading>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Badge
                textAlign={"center"}
                colorScheme={"gray"}
                minWidth={"160"}
                fontSize={{ base: "sm", md: "md" }}
                rounded={"full"}
                fontWeight={"normal"}
                py={"8px"}
                color={"blackAlpha.700"}
              >
                <Editable
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "IDR",
                  }).format(filter.min_price)}
                >
                  <EditablePreview />
                  <EditableInput readOnly />
                </Editable>
              </Badge>
              <Badge
                textAlign={"center"}
                colorScheme={"gray"}
                minWidth={"160"}
                fontSize={{ base: "sm", md: "md" }}
                rounded={"full"}
                fontWeight={"normal"}
                py={"8px"}
                color={"blackAlpha.700"}
              >
                <Editable
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "IDR",
                  }).format(filter.max_price)}
                >
                  <EditablePreview />
                  <EditableInput readOnly />
                </Editable>
              </Badge>
            </Stack>
            <CustomRangeSlider
              min={0}
              value={[filter.min_price, filter.max_price]}
              max={100000000}
              handleChange={(val) =>
                setFilter({ ...filter, min_price: val[0], max_price: val[1] })
              }
            />
          </Stack>
          {/* </Box> */}
          {tabs.map((tab, index) =>
            tab.type === "checkbox" ? (
              <Box key={index}>
                <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
                <Stack spacing={"24px"} py={"24px"}>
                  <Heading fontSize={"md"}>{tab.name}</Heading>
                  <Stack spacing={5} py={5}>
                    {data[tab.label].map((item, index) => (
                      <CustomCheckbox
                        key={index}
                        values={filter[tab.label]}
                        item={item}
                        field={{
                          onChange: () => handleChange(tab.label, item),
                        }}
                      />
                    ))}
                  </Stack>
                  {tab.extendable && (
                    <Button
                      variant={"unstyled"}
                      fontSize={{ base: "sm", md: "md" }}
                      color={"brand.blue.400"}
                      fontWeight={"thin"}
                      rightIcon={<ChevronDown />}
                    >
                      Lihat Semua
                    </Button>
                  )}
                </Stack>
              </Box>
            ) : (
              <Box key={index}>
                <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
                <Stack spacing={"24px"} py={"24px"}>
                  <Heading fontSize={"md"}>{tab.name}</Heading>
                  <Wrap spacingY={"16px"} spacingX={"1px"}>
                    {data[tab.label].map((item, index) => (
                      <CustomCheckboxFill
                        key={index}
                        field={{
                          checked: filter[tab.label].includes(item.id),
                          onChange: () => handleChange(tab.label, item),
                        }}
                        value={item.range}
                      />
                    ))}
                  </Wrap>
                </Stack>
              </Box>
            )
          )}
        </CustomFilterButton>
      </>
    );
  };

  
  // const departureDateTime = additionalData.data?.[0]?.journeys?.[0]?.segments?.[0]?.departureDateTime;

  const departureDateTime = query?.departureDate;
  const returnDateTime = query?.returnDate;
  console.log(cart)
  // console.log('departure date',departureDateTime)

  return (
    <Layout
      type={"nested"}
      metatitle={`Hasil Pencarian Tiket ${
        query.isRoundTrip == "true" ? `Round Trip` : `One Way`
      }: 🛫${additionalData?.data?.[0]?.originCode} 🛬${
        additionalData?.data?.[0]?.destinationCode
      }, ${
        departureDateTime
          ? date(new Date(departureDateTime), "d LLL yy") + " "
          : null
      }`}
      pagetitle={"Hasil Pencarian Tiket"}
      hideBottomBar
    >
      {!noresults && (
        <Box as={"section"} px={"24px"} mx={"-24px"}>
          <Stack
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            direction={"row"}
            justifyContent={"space-between"}
            pt={"16px"}
          >
            <Text
              display={"flex"}
              alignSelf={"center"}
              fontSize={{ base: "sm", md: "md" }}
            >
              Hasil Pencarian &quot;
              <Text as={"span"} fontWeight={"bold"} color={"brand.blue.400"}>
                {query.isRoundTrip == "true" ? `Round Trip` : `One Way`}
              </Text>
              &quot;
            </Text>
            <IconButton
              size={{ base: "sm", md: "md" }}
              variant={"unstyled"}
              onClick={() => router.push("/flights")}
              icon={
                <Image
                  width={20}
                  height={20}
                  src="/svg/icons/edit.svg"
                  alt="edit"
                />
              }
            />
          </Stack>
          <Stack maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
            <Text fontSize={{ base: "sm", md: "md" }}>
              {date(
                new Date(
                  departureDateTime
                  ),
                "iii, d LLL yy"
              ) + " "}
              {query.isRoundTrip == "true" &&
                "- " +
                  date(
                    new Date(
                      returnDateTime
                    ),
                    "iii, d LLL yy"
                  )}
            </Text>
          </Stack>
          <Stack
            mx={"auto"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            // px={{ base: "24px", xl: 0 }}
            py={"16px"}
          >
            {query?.originCode !== '' && (
              <HStack gap={1}>
                <VStack alignItems={"start"} spacing={"-1"}>
                  <Text fontWeight={"semibold"} color={"brand.blue.400"}>
                    {query?.originCode}
                  </Text>
                  <Text
                    hidden
                    color={"neutral.text.medium"}
                    fontSize={{ base: "xs", md: "sm" }}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                  >
                    {additionalData?.data[0].originCityName}
                  </Text>
                </VStack>
                <Image
                  src="/svg/flights/line.svg"
                  alt="line"
                  width={100}
                  height={16}
                />
                <VStack alignItems={"start"} spacing={"-1"}>
                  <Text fontWeight={"semibold"} color={"brand.blue.400"}>
                    {query?.destinationCode}
                  </Text>
                  <Text
                    hidden
                    color={"neutral.text.medium"}
                    fontSize={{ base: "xs", md: "sm" }}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                  >
                    {additionalData?.data[0].destinationCityName}
                  </Text>
                </VStack>
              </HStack>
            )}
            <Divider
              orientation="vertical"
              colorScheme={"brand.blue"}
              variant="solid"
              size="3px"
              w="3px"
              h="32px"
            />
            <HStack gap={2}>
              <Button
                size="sm"
                display="flex"
                justifyContent={"center"}
                alignItems="center"
                gap={1}
                variant="unstyled"
                leftIcon={
                  <Image
                    objectFit="contain"
                    src="/svg/flights/people.svg"
                    alt="people"
                    width={16}
                    height={16}
                  />
                }
              >
                <Text
                  color={"neutral.text.medium"}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="thin"
                >
                  {parseInt(query.adult) +
                    parseInt(query.child) +
                    parseInt(query.infant)}
                </Text>
              </Button>
              <Button
                size="sm"
                display="flex"
                justifyContent={"center"}
                alignItems="center"
                gap={1}
                leftIcon={
                  <Image
                    objectFit="contain"
                    src="/svg/flights/class.svg"
                    alt="class"
                    width={16}
                    height={16}
                  />
                }
                variant="unstyled"
              >
                <Text
                  color={"neutral.text.medium"}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="thin"
                >
                  {query?.cabinClasses}
                </Text>
              </Button>
            </HStack>
          </Stack>
        </Box>
      )}

      <Box
        spacing={"16px"}
        mx={"-24px"}
        py={"5px"}
        bg={"brand.blue.100"}
        as={"section"}
      />
      <Box hidden={noresults} as={"section"} mx={"-24px"} px={"24px"}>
        {cart &&
          cart.map((item, index) => (
            <HStack
              key={index}
              justifyContent="space-between"
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              py="24px"
            >
              <HStack alignItems="start">
                <Badge
                  bg="brand.orange.400"
                  color="white"
                  textTransform="capitalize"
                >
                  {query.isRoundTrip === "true" && index == 0
                    ? "Pergi"
                    : query.isRoundTrip === "true" && index == 1
                    ? "Pulang"
                    : ""}
                </Badge>
                <Stack>
                  <Text color="neutral.text.medium">
                    {`${date(
                      new Date(item.segments[0].departureDateTime),
                      "dd LLL yy"
                    )}, ${convertTimeFlightPage(
                      item.segments[0].departureDateTime
                    )} - ${convertTimeFlightPage(
                      item.segments[item.segments.length - 1].arrivalDateTime
                    )} (${differenceDate(
                      item.segments[0].departureDateTime,
                      item.segments[item.segments.length - 1].arrivalDateTime
                    )})`}
                  </Text>
                  <Text color="neutral.text.medium">
                    {`${item.segments[0].origin.code} - ${
                      item.segments[item.segments.length - 1].destination.code
                    }`}{" "}
                    <Text color="black" fontWeight="semibold" as="span">
                      {`• ${convertRupiah(
                        sumPriceFareFinal(item.segments, item.connectingType)
                      )} per pax`}
                    </Text>
                  </Text>
                </Stack>
              </HStack>
              <Button
                variant={"unstyled"}
                onClick={(e) => {
                  setPosition(0);
                  setCart([]);
                  setIsLoading(true);
                }}
                fontWeight="semibold"
                color="brand.blue.400"
              >
                Ubah
              </Button>
            </HStack>
          ))}
        <Divider />
        <HStack
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          py={"20px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          // h={"60px"}
        >
          {!isLoading && (
            <Text
              color={"neutral.text.medium"}
              fontSize={{ base: "xs", md: "sm" }}
            >
              {`${totalData} Tersedia`}
            </Text>
          )}
          {isLoading ? (
            <Box
              position="relative"
              justifyContent={"flex-end"}
              w={"74px"}
              h={"45px"}
            >
              <Image
                priority
                src="/png/Loading.gif"
                alt="loading"
                layout="fill"
                objectFit="contain"
                className="scale-up-image"
              />
            </Box>
          ) : (
            <HStack>
              {additionalData?.data && (
                <FilterButton
                  airlines={additionalData?.data[0].journeys}
                  handleFilter={handleFilter}
                />
              )}
              <SortButton sortByState={[sortBy, setSortBy]} />
            </HStack>
          )}
        </HStack>
      </Box>
      <Box as={"section"} mx={"-24px"} p={"24px"} bg={"brand.blue.100"}>
        {!noresults ? (
          <Stack
            mx={"auto"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            gap={"24px"}
          >
            {flights.length !== 0 ? (
              flights.map((item, index) => {
                // console.log("item", item);
                return (
                  <>
                    <FlightItem 
                      item={item} 
                      isLoading={isLoading} 
                      isDesktop={isDesktop} 
                      query={query} 
                      key={index} 
                      originData={originData} 
                      destinationData={destinationData} 
                      handlePosition={handlePosition} 
                      position={position}
                      />
                  </>
                );
              })
            ) : (
              <>
                {!isLoading ? (
                  <NoResults href="/flights" />
                ) : (
                  <Center>
                    <Spinner mx={"auto"} />
                  </Center>
                )}
              </>
            )}
            {shownItems <= totalData ? (
              <Center>
                <Spinner mx={"auto"} ref={trigger} />
              </Center>
            ) : (
              // <CustomOrangeFullWidthButton
              //   ref={trigger}
              //   // isLoading={isLoading}
              //   // onClick={handleViewAll}
              // >
              //   Lihat Lebih Banyak
              // </CustomOrangeFullWidthButton>
              <>
                {cart?.[0]?.isCombine === true && (
                  <>
                    <LinkBox
                      // onClick={onOpen}
                      maxW={{ lg: "container.lg", xl: "container.xl" }}
                      mx={"auto"}
                    >
                      <HStack
                        justifyContent={"space-between"}
                        p={"16px"}
                        bg={"white"}
                        rounded={"xl"}
                      >
                        <Stack spacing={"12px"}>
                          <Heading
                            display={"flex"}
                            alignItems={"center"}
                            fontSize={"md"}
                            color={"brand.blue.400"}
                          >
                            <chakra.span mr={"5px"}>
                              <InfoIcon />
                            </chakra.span>
                            Apakah anda tidak menemukan penerbangan yang sesuai
                            ?
                          </Heading>
                          <Text fontSize={"sm"}>
                            Anda bisa menekan tombol <b>Pilih Ulang</b> untuk
                            kembali memilih penerbangan pergi non smart combo
                          </Text>
                        </Stack>
                        {/* add button pilih ulang */}
                        <Button
                          borderRadius={"xl"}
                          onClick={(e) => {
                            setFilter({
                              ...filter,
                              is_smart_combo: false,
                            });
                            router.push({
                              pathname: router.pathname,
                              query: {
                                ...router.query,
                                is_smart_combo: false,
                              },
                              shallow: true,
                            });
                            setPosition(0);
                            setCart([]);
                            setIsLoading(true);
                          }}
                          fontWeight="semibold"
                          color="brand.blue.400"
                        >
                          Pilih Ulang
                        </Button>
                      </HStack>
                    </LinkBox>
                  </>
                )}
              </>
            )}
          </Stack>
        ) : (
          <NoResults href="/flights" />
        )}
      </Box>
    </Layout>
  );
};

// export async function getServerSideProps(ctx) {
//   const query = simplifyQuerySearch(ctx.query);
//   console.log(ctx)

//   let additionalData, totalFlight, noresults = false;
//   try {
//     additionalData = await getFlights(query, query?.is_smart_combo);
//     if (additionalData.data[0].journeys.length === 0) {
//       noresults = true;
//       additionalData = false;
//       totalFlight = 0;
//     }
//     // if (additionalData.filter?.[0]?.combinedJourneys?.length > 0) {
//     //   additionalData.data[0].journeys = additionalData.data[0].journeys.concat(
//     //     additionalData.filter[0].combinedJourneys?.map((item) => {
//     //       if (
//     //         item?.journeys?.[0]?.segments?.length > 0 &&
//     //         item?.journeys?.[0] !== undefined &&
//     //         item?.journeys?.[0] !== null &&
//     //         item !== undefined &&
//     //         item !== null
//     //       ) {
//     //         const data = {
//     //           ...item?.journeys?.[0],
//     //           isCombine: true,
//     //         };
//     //         return data;
//     //       }
//     //     })
//     //   );
//     // }
//     // //jika ada additionalData.data[0].journeys yang undefined maka hapus
//     // additionalData.data[0].journeys = additionalData.data[0].journeys.filter(
//     //   (item) => item !== undefined
//     // );
//     // console.log("additionalData", additionalData.data[0].journeys.length);
//   } catch (error) {
//     console.error(error);

//     noresults = true;
//     additionalData = false;
//     totalFlight = 0;
//   }

//   return {
//     props: {
//       additionalData,
//       noresults,
//       totalFlight: totalFlight ?? additionalData.data.length,
//       meta: {
//         title: "Hasil Pencarian Tiket",
//       },
//     },
//   };
// }

export default SearchFlights;