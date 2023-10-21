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
import { getDetailPrice, getFlights } from "../../src/services/flight.service";
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

const SearchFlights = ({
  additionalData,
  totalFlight,
  // noresults,
  ...props
}) => {
  let noresults = false
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

  const dispatch = useDispatch();
  const { ref: trigger, inView } = useInView();
  const [sortBy, setSortBy] = useState("Harga Terendah");
  const [filter, setFilter] = useState({});
  const [shownItems, setShownItems] = useState(15);
  const [totalData, setTotalData] = useState(0);
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [cart, setCart] = useState([]);
  const [checkoutPage, setCheckoutPage] = useState(false);
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );

  console.log(flights)
  console.log(noresults)

  useEffect(() => {
    if (flights.length === 0) setIsLoading(!noresults ?? true);
    const fetchFlight = async (
      query,
      shownItems,
      position,
      sort,
      filter = null
    ) => {
      setIsLoading(true);
      // const payload = simplifyQuerySearch(query);
      const payload = query;
      
      let issmartcombo = true;
      if (query?.is_smart_combo == "false" || filter?.is_smart_combo == "false")
      issmartcombo = false;
      const response = await getFlights(payload, issmartcombo);
      let currentFlight = response.data?.Schedules[position]?.Flights;
      // console.log(currentFlight)

      // if (
      //   query.is_round_trip === "true" &&
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
      // if (query.is_round_trip === "true" && query?.is_smart_combo == "true") {
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
      setFlights(currentFlight.slice(0, shownItems));
      setTotalData(currentFlight.length);

      setIsLoading(false);
    };

    if (!filter.is_filtered) fetchFlight(query, shownItems, position, sortBy);
    else fetchFlight(query, shownItems, position, sortBy, filter);
  }, [filter, shownItems, position, sortBy, query?.is_smart_combo]);
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

  useEffect(() => {
    if (checkoutPage) {
      dispatch(
        orderData({
          data: cart,
          query: query,
          isDomestic: filterIsDomestic(additionalData.data),
        })
      );
      router.push({ pathname: "/flights/order-details" });
    }
  }, [checkoutPage]);

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
          {query?.is_round_trip == "true" && (
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

  const DetailButton = ({ type, item, query, segments, empty, setIsEmpty }) => {
    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const loginToast = useLoginToast();
    const payload = simplifyBodyDetailFlight(item, query);
    // const { data, isLoading } = useQuery(
    //   ["getPriceFlight", payload],
    //   async () => {
    //     const response = await getDetailPrice(payload);
    //     return Promise.resolve(response);
    //   }
    // );
    const data = item;
    empty = data ? setIsEmpty(false) : setIsEmpty(true);
    const cta = isDesktop ? "Detail Penerbangan" : "Detail";
    const connectingType = item;
    if (isLoading)
      return (
        <Center>
          <Spinner />
        </Center>
        // <Skeleton>
        //   <Text
        //     as={Link}
        //     color={"brand.blue.400"}
        //     fontSize={{ base: "sm", md: "md" }}
        //     fontWeight="semibold"
        //     onClick={onOpen}
        //   >
        //     Detail Penerbangan
        //   </Text>
        // </Skeleton>
      );
    else
      return data ? (
        <>
          <Text
            as={LinkOverlay}
            color={"brand.blue.400"}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="semibold"
            onClick={onOpen}
          >
            {cta}
          </Text>
          <CustomFilterButton
            drawer={drawerRef}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            title={"Detail Penerbangan"}
            notrounded={type === "transit"}
            footer={
              <CustomOrangeFullWidthButton
                mt={0}
                py={0}
                onClick={(e) =>
                  loginToast(() => handlePosition(e, position, item))
                }
              >
                Pilih
              </CustomOrangeFullWidthButton>
            }
            footerLeft={
              <HStack w={"full"} m={"auto"}>
                <Stack spacing={0}>
                  {item.isDiscount ? (
                    <Text
                      as={"span"}
                      fontSize={{ base: "xs", md: "sm" }}
                      color={"neutral.text.low"}
                      textDecoration={"line-through"}
                    >
                      {/* {`IDR ${
                        convertRupiah(data?.data?.farePerPax?.total) ?? ""
                      }`} */}
                      {`IDR ${convertRupiah(
                        sumPriceFareFinal(item.segments, item.connectingType)
                      )}`}
                    </Text> //harga coret
                  ) : (
                    <></>
                  )}
                  <Skeleton isLoaded={!isLoading}>
                    <Text
                      whiteSpace={"nowrap"}
                      fontWeight={"semibold"}
                      color={"brand.orange.400"}
                    >
                      {/* {`IDR ${convertRupiah(
                        data?.data?.farePerPax?.total -
                          data?.data?.farePerPax?.priceDiscount ?? "100.000"
                      )}`}{" "} */}
                      {`IDR ${convertRupiah(
                        sumPriceFareFinal(item.segments, item.connectingType)
                      )}`}
                      <chakra.span
                        fontWeight={"normal"}
                        textColor={"neutral.text.low"}
                        fontSize={"xs"}
                      >
                        per pax
                      </chakra.span>
                    </Text>
                  </Skeleton>
                </Stack>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.low"}
                >
                  {/* per pax */}
                </Text>
              </HStack>
            }
          >
            <Stack spacing={"24px"} py={"24px"}>
              {segments.map((item, index) => {
                if (
                  item.flightDesignator.carrierName === "Malaysia Airlines" &&
                  connectingType.connectingType != "THROUGH"
                ) {
                  // console.log("item", item);
                }
                return (
                  <Stack key={index} spacing={"24px"}>
                    <HStack
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <HStack>
                        {/* <Image
                    src="/png/singapore-airlines.png"
                    alt="Singapore Airlines"
                    width={16}
                    height={22}
                    objectFit="contain"
                  /> */}
                        <HStack alignItems={"center"}>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={"semibold"}
                          >
                            {`${item.flightDesignator.carrierName}`}
                          </Text>
                          <Badge>
                            {`
                        ${item.flightDesignator.carrierCode} ${item.flightDesignator.flightNumber}`}
                          </Badge>
                          <Text fontSize={{ base: "sm", md: "md" }}>{`| ${
                            connectingType.connectingType != "THROUGH"
                              ? getClassCode(
                                  item.fares[0]?.fareGroupCode ??
                                    router.query.class
                                )
                              : getClassCode(
                                  connectingType.segments[0].fares[0]
                                    .fareGroupCode
                                )
                          }`}</Text>
                        </HStack>
                      </HStack>
                    </HStack>
                    <HStack alignItems={"stretch"} gap={4}>
                      <VStack
                        justifyContent={"space-between"}
                        alignItems={"end"}
                        textAlign={"right"}
                      >
                        {[item.departureDateTime, item.arrivalDateTime].map(
                          (datetime, index) => (
                            <Box key={index}>
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                fontWeight={"semibold"}
                              >
                                {convertTimeFlightPage(datetime)}
                              </Text>
                              <Text fontSize={{ base: "sm", md: "md" }}>
                                {convertDateFlightPage(datetime)}
                              </Text>
                            </Box>
                          )
                        )}
                      </VStack>
                      <Box py={"12px"}>
                        <VStack
                          h={"full"}
                          borderRight="1px dashed #41778A"
                          position={"relative"}
                        >
                          {["top", "bottom"].map((item, index) => (
                            <Box
                              key={index}
                              position="absolute"
                              {...{ [item]: "-4px" }}
                              bg={"brand.blue.400"}
                              w={"16px"}
                              h={"16px"}
                              border={"5px solid #F0F4F5"}
                              borderRadius="full"
                            />
                          ))}
                        </VStack>
                      </Box>
                      <VStack
                        justifyContent={"space-between"}
                        alignItems={"start"}
                        gap={2}
                      >
                        {[
                          {
                            c: `${item.origin.city}, ${item.origin.code}`,
                            a: `${item.origin.airport}`,
                          },
                          {
                            b: `${item.legs[0].durationHours} JAM ${item.legs[0].durationMinutes} MENIT`,
                          },
                          {
                            c: `${item.destination.city}, ${item.destination.code}`,
                            a: `${item.destination.airport}`,
                          },
                        ].map((item, index) =>
                          item.b ? (
                            <Badge key={index}>{item.b}</Badge>
                          ) : (
                            <Box key={index}>
                              <Text
                                color={"brand.blue.400"}
                                fontWeight={"semibold"}
                              >
                                {item.c}
                              </Text>
                              <Text
                                color={"neutral.text.medium"}
                                fontSize={{ base: "sm", md: "md" }}
                              >
                                {item.a}
                              </Text>
                            </Box>
                          )
                        )}
                      </VStack>
                    </HStack>
                    <VStack pt={5} textAlign={"left"} alignItems={"start"}>
                      <HStack key={index} gap={2} alignItems={"start"}>
                        <Image
                          src={"/svg/nav/tours.svg"}
                          alt={"baggage"}
                          width={20}
                          height={20}
                          objectFit="contain"
                        />
                        <VStack alignItems={"start"}>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={"semibold"}
                          >
                            {connectingType.connectingType != "THROUGH"
                              ? item.fares?.[0]?.defaultBaggage
                              : connectingType.segments[0].fares?.[0]
                                  ?.defaultBaggage}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                    {type === "transit" && index < segments.length - 1 && (
                      <VStack
                        p={"12px"}
                        bg={"brand.blue.100"}
                        borderRadius={"12px"}
                        justifyContent={"center"}
                        alignText={"center"}
                      >
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          color={"neutral.text.low"}
                        >
                          {`Transit selama ${differenceDateLong(
                            segments[index].arrivalDateTime,
                            segments[index + 1].departureDateTime
                          )} di`}
                        </Text>
                        <Text
                          fontWeight={"semibold"}
                          fontSize={{ base: "sm", md: "md" }}
                          color={"neutral.text.medium"}
                        >
                          {`${item.destination.city} (${item.destination.code}) ${item.destination.airport}`}
                        </Text>
                      </VStack>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </CustomFilterButton>
        </>
      ) : (
        <Text>Habis</Text>
      );
  };

  const FlightItem = ({ item }) => {
    console.log(item)
    const [isEmpty, setIsEmpty] = useState(false);
    const loginToast = useLoginToast();
    const { logos, names, classFlight } = item.segments.reduce(
      (acc, curr) => {
        if (!acc.logos.includes(curr.flightDesignator.carrierCode)) {
          acc.logos = [...acc.logos, curr.flightDesignator.carrierCode];
        }
        if (!acc.names.includes(curr.flightDesignator.carrierName)) {
          acc.names = [...acc.names, curr.flightDesignator.carrierName];
        }
        if (item.connectingType == "THROUGH") {
          if (
            acc.classFlight !==
            getClassCode(item.segments[0].fares[0].fareGroupCode)
          ) {
            acc.classFlight = "Multi-class";
          }
        }
        if (item.connectingType === "DIRECT" || item.connectingType === "SUM") {
          if (acc.classFlight !== getClassCode(curr.fares[0].fareGroupCode)) {
            acc.classFlight = "Multi-class";
          }
        }
        return acc;
      },
      {
        logos: [],
        names: [],
        classFlight: getClassCode(item.segments[0].fares[0].fareGroupCode),
      }
    );
    let diffHoursTransit = 0;
    let diffMinutesTransit = 0;
    if (item.segments.length > 0) {
      //count hours and time
      diffHoursTransit =
        item.segments[0].legs[0].durationHours +
        item.segments[item.segments.length - 1].legs[0].durationHours;
      diffMinutesTransit =
        item.segments[0].legs[0].durationMinutes +
        item.segments[item.segments.length - 1].legs[0].durationMinutes;
      if (diffMinutesTransit > 59) {
        diffHoursTransit = diffHoursTransit + 1;
        diffMinutesTransit = diffMinutesTransit - 60;
      }
      const transitTime = differenceDateLong(
        item.segments[0].arrivalDateTime,
        item.segments[item.segments.length - 1].departureDateTime
      ).split(" ");
      // console.log(transitTime, "transitTime")
      diffHoursTransit = parseInt(transitTime[0]) + diffHoursTransit;
      diffMinutesTransit = parseInt(transitTime[2]) + diffMinutesTransit;
      if (diffMinutesTransit > 59) {
        diffHoursTransit = diffHoursTransit + 1;
        diffMinutesTransit = diffMinutesTransit - 60;
      }
    }

    const setIsEmptyState = (value) => {
      setIsEmpty(value);
    };
    const images =
      logos.length === 2 ? [logos[0], null, null, logos[1]] : logos;
    return (
      // isEmpty ? null :
      <LinkBox
        cursor={isLoading ? "not-allowed" : "pointer"}
        // onClick={(e) => handlePosition(e, position, item)}
        // key={index}
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent={"space-evenly"}
          w="full"
          p={"16px"}
          // gap={"16px"}
          alignItems={{ base: "stretch", md: "flex-end" }}
          // borderTopRadius={{ base: "12px", md: "inherit" }}
          // borderRadius={{ base: 0, md: "lg" }}
          borderRadius={"lg"}
          bg={"white"}
          columnGap={"72px"}
          minH={"160px"}
        >
          {/* Flight Airline */}
          <Flex
            minW="20%"
            direction={{ base: "row", md: "column" }}
            justifyContent={"space-between"}
            alignSelf="stretch"
            fontSize={{ base: "xs", md: "sm" }}
          >
            <Skeleton
              w={isLoading ? "125px" : "auto"}
              h={isLoading ? "20px" : "auto"}
              startColor={"gray.50"}
              endColor={"gray.200"}
              borderRadius={"4px"}
              isLoaded={!isLoading}
            >
              <HStack gap={0} alignItems={"center"}>
                <Stack direction={"row"} alignItems={"flex-start"}>
                  <SimpleGrid flexShrink={0} columns={logos.length > 1 ? 2 : 1}>
                    {images.map((image, index) => (
                      <Box
                        key={index}
                        position="relative"
                        w={
                          logos.length > 1
                            ? isDesktop
                              ? "30px"
                              : "18px"
                            : isDesktop
                            ? "60px"
                            : "24px"
                        }
                        h={
                          logos.length > 1
                            ? isDesktop
                              ? "30px"
                              : "18px"
                            : isDesktop
                            ? "60px"
                            : "24px"
                        }
                      >
                        {image && (
                          <Image
                            layout="fill"
                            src={`/png/Airline/${image}.png`}
                            alt="airline"
                            objectFit={"contain"}
                          />
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                  <Stack alignItems={"flex-start"}>
                    <HStack>
                      <Text fontSize={{ base: "sm", md: "xs" }}>
                        {names.join(" + ")}
                      </Text>
                      {/* <Text fontSize={{ base: "sm", md: "xs" }}>•</Text> */}
                      {/* <Text
                        fontSize={{ base: "sm", md: "xs" }}
                        fontWeight={"semibold"}
                      >{`${item.segments[0].flightDesignator.carrierCode}${item.segments[0].flightDesignator.flightNumber}`}</Text> */}
                    </HStack>
                    <Text hidden={!isDesktop} fontWeight={"bold"}>
                      {classFlight}
                    </Text>
                    {/* add text with border rounded , with text smart combo */}
                    {item.isCombine && (
                      <Text
                        fontSize={{ base: "xx-small", md: "xx-small" }}
                        fontWeight={"semibold"}
                        color={"blue.400"}
                        border={"1px"}
                        borderColor={"blue.400"}
                        borderRadius={"4px"}
                        px={"4px"}
                        py={"2px"}
                        mw={"fit-content"}
                      >
                        Smart Combo
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </HStack>
            </Skeleton>
            <Skeleton
              w={isLoading ? "52px" : "auto"}
              h={isLoading ? "20px" : "auto"}
              startColor={"gray.50"}
              endColor={"gray.200"}
              borderRadius={"4px"}
              isLoaded={!isLoading}
            >
              <DetailButton
                type={item.connectingType != "DIRECT" ? "transit" : "direct"}
                item={item}
                query={query}
                setIsEmpty={setIsEmptyState}
                empty={isEmpty}
                segments={item.segments}
              />
            </Skeleton>
          </Flex>
          <Stack
            alignSelf={"center"}
            w={"full"}
            direction={{ base: "column", md: "column" }}
          >
            {/* Flight Duration */}
            <HStack
              flexGrow={1}
              justifyContent={"space-between"}
              alignItems={"flex-start"}
            >
              <VStack alignItems={"start"} spacing={isLoading ? "auto" : "-1"}>
                <Skeleton
                  w={isLoading ? "28px" : "auto"}
                  h={isLoading ? "14px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <Text fontWeight={"semibold"}>
                    {item.segments[0].origin.code}
                  </Text>
                </Skeleton>
                <Skeleton
                  w={isLoading ? "50px" : "auto"}
                  h={isLoading ? "14px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <Text
                    color={"neutral.text.medium"}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {item.segments[0].origin.city}
                  </Text>
                </Skeleton>
              </VStack>
              {isLoading ? (
                <>
                  <SkeletonCircle
                    size={"14px"}
                    startColor={"gray.50"}
                    endColor={"gray.200"}
                    alignSelf={"center"}
                  />
                  <Skeleton
                    w={"102px"}
                    h={"14px"}
                    startColor={"gray.50"}
                    endColor={"gray.200"}
                    borderRadius={"4px"}
                  />
                  <SkeletonCircle
                    size={"14px"}
                    startColor={"gray.50"}
                    endColor={"gray.200"}
                    alignSelf={"center"}
                  />
                </>
              ) : (
                <Center
                  borderBottom={"1px"}
                  borderBottomStyle={"dashed"}
                  borderBottomColor={"brand.blue.500"}
                  w="full"
                  py={1}
                  position="relative"
                >
                  <Text
                    fontSize={{ base: "xs", md: "xs" }}
                    color={"neutral.text.low"}
                  >
                    {item.connectingType != "DIRECT"
                      ? `${
                          item.segments.length - 1
                        } Transit • ${diffHoursTransit}j ${diffMinutesTransit}m`
                      : `Langsung • ${item.segments[0].legs[0].durationHours}j ${item.segments[0].legs[0].durationMinutes}m`}
                  </Text>
                  <Box
                    position="absolute"
                    bottom={"-9px"}
                    left={"0px"}
                    bg={"brand.blue.400"}
                    w={"16px"}
                    h={"16px"}
                    border={"5px solid #F0F4F5"}
                    borderRadius="full"
                  ></Box>
                  <Box
                    position="absolute"
                    bottom={"-9px"}
                    right={"0px"}
                    bg={"brand.blue.400"}
                    w={"16px"}
                    h={"16px"}
                    border={"5px solid #F0F4F5"}
                    borderRadius="full"
                  ></Box>
                </Center>
              )}
              <VStack alignItems={"end"} spacing={isLoading ? "auto" : "-1"}>
                <Skeleton
                  w={isLoading ? "28px" : "auto"}
                  h={isLoading ? "14px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <Text fontWeight={"semibold"}>
                    {item.segments[item.segments.length - 1].destination.code}
                  </Text>
                </Skeleton>
                <Skeleton
                  w={isLoading ? "50px" : "auto"}
                  h={isLoading ? "14px" : "auto"}
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <Text
                    color={"neutral.text.medium"}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {item.segments[item.segments.length - 1].destination.city}
                  </Text>
                </Skeleton>
              </VStack>
            </HStack>
            {/* Flight Date and Time */}
            <HStack
              flexGrow={1}
              justifyContent={"space-between"}
              alignItems={"center"}
              fontSize="sm"
            >
              <Skeleton
                w={isLoading ? "101px" : "auto"}
                h={isLoading ? "17px" : "auto"}
                startColor={"gray.50"}
                endColor={"gray.200"}
                borderRadius={"4px"}
                isLoaded={!isLoading}
              >
                <HStack>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    flexGrow={1}
                    fontWeight="thin"
                  >
                    {convertDateFlightPage(item.segments[0].departureDateTime)}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }}>•</Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    flexGrow={1}
                    fontWeight="semibold"
                  >
                    {convertTimeFlightPage(item.segments[0].departureDateTime)}
                  </Text>
                </HStack>
              </Skeleton>
              {/* <Divider /> */}
              <Skeleton
                w={isLoading ? "101px" : "auto"}
                h={isLoading ? "17px" : "auto"}
                startColor={"gray.50"}
                endColor={"gray.200"}
                borderRadius={"4px"}
                isLoaded={!isLoading}
              >
                <HStack>
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="thin">
                    {convertDateFlightPage(
                      item.segments[item.segments.length - 1].arrivalDateTime
                    )}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }}>•</Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="semibold"
                  >
                    {convertTimeFlightPage(
                      item.segments[item.segments.length - 1].arrivalDateTime
                    )}
                  </Text>
                </HStack>
              </Skeleton>
            </HStack>
          </Stack>

          <Stack
            hidden={!isDesktop}
            // display={{ base: "none", md: "block" }}
            flexShrink={0}
            alignSelf={"center"}
            alignItems={"center"}
          >
            <Stack spacing={0}>
              {item.isDiscount ? (
                <Skeleton
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  borderRadius={"4px"}
                  isLoaded={!isLoading}
                >
                  <Text
                    as={"span"}
                    fontSize={{ base: "xs", md: "sm" }}
                    color={"neutral.text.low"}
                    textDecoration={"line-through"}
                  >
                    {`IDR ${
                      convertRupiah(
                        sumPriceFare(item.segments, item.connectingType)
                      ) ?? ""
                    }`}
                  </Text>
                </Skeleton>
              ) : (
                <></>
              )}
              <Skeleton
                startColor={"gray.50"}
                endColor={"gray.200"}
                borderRadius={"4px"}
                isLoaded={!isLoading}
              >
                <Text
                  fontSize={"lg"}
                  fontWeight={"bold"}
                  color={"brand.orange.400"}
                >
                  {`IDR ${convertRupiah(
                    sumPriceFareFinal(item.segments, item.connectingType)
                  )}`}
                </Text>
              </Skeleton>
            </Stack>
            <Skeleton
              isLoaded={!isLoading}
              startColor={"gray.50"}
              endColor={"gray.200"}
              borderRadius={"4px"}
              w={"full"}
            >
              <CustomOrangeFullWidthButton
                disabled={isEmpty || isLoading}
                onClick={(e) =>
                  loginToast(() => handlePosition(e, position, item))
                }
              >
                Pilih
              </CustomOrangeFullWidthButton>
            </Skeleton>
          </Stack>
        </Stack>
        <Box
          hidden={isDesktop}
          as={"section"}
          position={"relative"}
          w="full"
          p={"16px"}
          borderTop={"1px"}
          borderTopColor={"gray.200"}
          borderTopStyle={"dashed"}
          borderBottomRadius={"lg"}
          bg={"white"}
        >
          <Box
            position="absolute"
            top={"-8px"}
            left={"-8px"}
            bg={"brand.blue.100"}
            w={"16px"}
            h={"16px"}
            borderRadius="full"
          ></Box>
          <Box
            position="absolute"
            top={"-8px"}
            right={"-8px"}
            bg={"brand.blue.100"}
            w={"16px"}
            h={"16px"}
            borderRadius="full"
          ></Box>
          <HStack justifyContent={"space-between"} alignItems={"center"}>
            <Skeleton
              w={isLoading ? "101px" : "auto"}
              h={isLoading ? "22px" : "auto"}
              startColor={"gray.50"}
              endColor={"gray.200"}
              borderRadius={"4px"}
              isLoaded={!isLoading}
            >
              <Text
                fontWeight={"semibold"}
                fontSize={{ base: "md", md: "lg" }}
                color={"brand.orange.400"}
              >
                {getClassCode(item.segments[0].fares[0].fareGroupCode)}
              </Text>
            </Skeleton>
            <Stack spacing={0}>
              {item.isDiscount && (
                <Skeleton
                  startColor={"gray.50"}
                  endColor={"gray.200"}
                  isLoaded={!isLoading}
                >
                  <Text
                    as={"span"}
                    fontSize={{ base: "sm", md: "md" }}
                    color={"neutral.text.low"}
                    textDecoration={"line-through"}
                  >
                    {`IDR ${
                      convertRupiah(
                        sumPriceFare(item.segments, item.connectingType)
                      ) ?? ""
                    }`}
                  </Text>
                </Skeleton>
              )}
              <Skeleton
                w={isLoading ? "101px" : "auto"}
                h={isLoading ? "22px" : "auto"}
                startColor={"gray.50"}
                endColor={"gray.200"}
                borderRadius={"4px"}
                isLoaded={!isLoading}
              >
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight={"semibold"}
                  bg={"brand.orange.400"}
                  color={"white"}
                  px={2}
                  py={0.5}
                  borderRadius={"4px"}
                >
                  {`IDR ${convertRupiah(
                    sumPriceFareFinal(item.segments, item.connectingType)
                  )}`}
                </Text>
              </Skeleton>
            </Stack>
          </HStack>
        </Box>
      </LinkBox>
    );
  };

  const departureDateTime =
    additionalData.data?.[0]?.journeys?.[0]?.segments?.[0]?.departureDateTime;
  return (
    <Layout
      type={"nested"}
      metatitle={`Hasil Pencarian Tiket ${
        query.is_round_trip == "true" ? `Round Trip` : `One Way`
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
                {query.is_round_trip == "true" ? `Round Trip` : `One Way`}
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
                  additionalData.data[0].journeys[0]?.segments[0]?.departureDateTime
                ),
                "iii, d LLL yy"
              ) + " "}
              {query.is_round_trip == "true" &&
                "- " +
                  date(
                    new Date(
                      additionalData.data[1].journeys[0]?.segments[0].departureDateTime
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
            {additionalData.data && (
              <HStack gap={1}>
                <VStack alignItems={"start"} spacing={"-1"}>
                  <Text fontWeight={"semibold"} color={"brand.blue.400"}>
                    {additionalData?.data[0].originCode}
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
                    {additionalData?.data[0].destinationCode}
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
                  {getClassCode(query.class)}
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
                  {query.is_round_trip === "true" && index == 0
                    ? "Pergi"
                    : query.is_round_trip === "true" && index == 1
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
              {additionalData.data && (
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
                console.log("item", item);
                return (
                  <>
                    <FlightItem item={item} key={index} />
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

export async function getServerSideProps(ctx) {
  const query = simplifyQuerySearch(ctx.query);
  let additionalData,
    totalFlight,
    noresults = false;
  try {
    additionalData = await getFlights(query, query?.is_smart_combo);
    if (additionalData.data[0].journeys.length === 0) {
      noresults = true;
      additionalData = false;
      totalFlight = 0;
    }
    // if (additionalData.filter?.[0]?.combinedJourneys?.length > 0) {
    //   additionalData.data[0].journeys = additionalData.data[0].journeys.concat(
    //     additionalData.filter[0].combinedJourneys?.map((item) => {
    //       if (
    //         item?.journeys?.[0]?.segments?.length > 0 &&
    //         item?.journeys?.[0] !== undefined &&
    //         item?.journeys?.[0] !== null &&
    //         item !== undefined &&
    //         item !== null
    //       ) {
    //         const data = {
    //           ...item?.journeys?.[0],
    //           isCombine: true,
    //         };
    //         return data;
    //       }
    //     })
    //   );
    // }
    // //jika ada additionalData.data[0].journeys yang undefined maka hapus
    // additionalData.data[0].journeys = additionalData.data[0].journeys.filter(
    //   (item) => item !== undefined
    // );
    // console.log("additionalData", additionalData.data[0].journeys.length);
  } catch (error) {
    console.error(error);

    noresults = true;
    additionalData = false;
    totalFlight = 0;
  }

  return {
    props: {
      additionalData,
      noresults,
      totalFlight: totalFlight ?? additionalData.data.length,
      meta: {
        title: "Hasil Pencarian Tiket",
      },
    },
  };
}

export default SearchFlights;