/* eslint-disable react-hooks/exhaustive-deps */
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
  convertTimeToCustomFormat,
  differenceDate,
  differenceDateLong,
  filterAirlines,
  filterFacility,
  filterFlightDepartureAndArrival,
  filterFlightType,
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
import { sassTrue } from "sass";

const SearchFlights = ({
  additionalData,
  dataQuery,
  noresults,
  dataflights
}) => {
  // let noresults = false
  const router = useRouter();
  // const dataQuery = router.query;
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

  const payload = query;

  // data save all 
  const [currentJourneySave, setCurrentJourneySave] = useState(dataflights?.currentJourneySave) 
  const [currentJourneyInFlightType, setCurrentJourneyInFligtType] = useState([]) 

  const [currentJourney, setCurrentJourney] = useState(dataflights?.currentJourney) 
  const [flights, setFlights] = useState(dataflights?.flights);
  const [statusSuccess, setStatusSuccess] = useState(dataflights?.status);
  const [additionFee, setAdditionalFee] = useState(dataflights?.additionalFee);

  
  // console.log('itemku', currentJourney)

  const dispatch = useDispatch();
  const { ref: trigger, inView } = useInView();
  const [sortBy, setSortBy] = useState("Harga Terendah");
  const [filter, setFilter] = useState({});
  const [shownItems, setShownItems] = useState(15);
  const [totalData, setTotalData] = useState(dataflights?.totalData);
  const [isLoading, setIsLoading] = useState(dataflights?.loading);
  const [position, setPosition] = useState(0);
  const [cart, setCart] = useState([]);
  const [checkoutPage, setCheckoutPage] = useState(false);
  const [isSmartCombo, setIsSmartCombo] = useState(true)
  const [isInternational, setIsInternational] = useState(dataflights?.isInternational);
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );
    
  const [originData, setOriginData] = useState('')
  const [destinationData, setDestinationData] = useState('')
  const [flightType, setFlightType] = useState('all'); 
  
  const fetchFlight = async () => {
    try {
      setIsLoading(true);
      const response = await getFlights(payload, isSmartCombo);
      // console.log('itemku', response, query);

      if(response.success === false){
        setIsLoading(false)
        setStatusSuccess(false);
      }

      if (response.success === true) {
        setStatusSuccess(true);
        setIsLoading(false)
        
        const schedules = response.data?.Schedules;

        schedules.map((item)=>{
          if(item.IsInternational){
            setIsInternational(true)
          }
        })
        const lowestPriceFlights = schedules[position]?.Flights.slice(0).sort((a, b) => a.Fare - b.Fare);

        const updatedCurrentJourney = response.data?.Schedules?.map((journey, index) => {
          if (index === position) {
            return {
              ...journey,
              Flights: lowestPriceFlights
            };
          }
          return journey; 
        });

        setCurrentJourney(updatedCurrentJourney);
        setCurrentJourneySave(updatedCurrentJourney);

        setFlights(response.data?.Schedules[position]?.Flights?.slice(0, shownItems));
        setTotalData(response.data?.Schedules[position]?.Flights?.length);
        setAdditionalFee(response.data?.Schedules[position]?.AdditionalFee);
        setIsLoading(false);
      } 
    } catch (error) {
      setIsLoading(false);
      setStatusSuccess(false);
    }
  };

  useEffect(() => {
    if(statusSuccess === false){
      fetchFlight();
    }
  }, [statusSuccess]);
  
  useEffect(() => {
    if (
      (query?.isRoundTrip === 'false' && cart?.length === 1) ||
      (query?.isRoundTrip === 'true' && cart?.length === 2)
    ) {
      setCheckoutPage(true);
    }

    if (checkoutPage) {
      dispatch(
        orderData({
          data: cart,
          query: query,
          isDomestic: !isInternational,
          addFee: additionFee
        })
      );
      router.push({ pathname: "/flights/order-details" });
    }
  }, [checkoutPage, query?.isRoundTrip, cart?.length]);

  useEffect(()=>{
    const updatedCurrentJourney = currentJourney.map((journey, index) => {
      if (index === position) {
        return {
          ...journey,
          Flights: sortFlight(sortBy, journey.Flights)
        };
      }
      return journey; 
    });
    setCurrentJourney(updatedCurrentJourney);
    // console.log('itemku', updatedCurrentJourney)
  },[sortBy])

  useEffect(()=>{

    const applyAllFilters = (flights) => {
      let filteredFlights = flights;
      
      if (filter?.transits?.length > 0) {
        filteredFlights = filterTransit(filteredFlights, filter.transits);
      }
      if (filter?.airlines?.length > 0) {
        filteredFlights = filterAirlines(filteredFlights, filter.airlines);
      }
      if (filter?.others?.length > 0) {
        filteredFlights = filterOthers(filteredFlights);
      }
      if (filter?.facilities?.length > 0){
        filteredFlights = filterFacility(filteredFlights);
      }
      if (filter?.departure_times?.length > 0){
        filteredFlights = filterFlightDepartureAndArrival(filteredFlights,"departure", filter.departure_times)
      }
      if (filter?.arrival_times?.length > 0){
        filteredFlights = filterFlightDepartureAndArrival(filteredFlights,"arrival", filter.arrival_times );
      }
      if (filter?.max_price !== 16000000 || filter?.min_price !== 0 ){
        filteredFlights = filterPrice(filteredFlights, filter.min_price, filter.max_price);
      } 

        return filteredFlights;
      };

      const updatedCurrentJourney = currentJourney.map((journey, index) => {
        if (index === position) {
          return {
            ...journey,
            Flights: applyAllFilters(journey.Flights)
          };
        }
        return journey;
      });

      setCurrentJourney(updatedCurrentJourney);
    // else {
    //   if (cart?.[0]?.isCombine !== true) {
    //     setTotalData(response.data[position].journeys.length);
    //   }
    // }
  },[filter])

  useEffect(()=>{
    if(flightType === 'all'){
      setCurrentJourney(currentJourneySave)
    } else {
      const updatedCurrentJourney = currentJourney.map((journey, index) => {
        if (index === position) {
          return {
            ...journey,
            Flights: filterFlightType(journey.Flights, flightType)
          };
        }
        return journey;
      });
      setCurrentJourney(updatedCurrentJourney);
    }
  },[flightType, position])

  useEffect(() => {
    if (inView && (totalData > flights?.length)  ) {
      showMoreItems();
    }
  }, [inView]);
  
  const handleFilter = (filter, dataAirlines) => { 
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

    if(JSON.stringify(filter) === JSON.stringify(initialFilter)){
      setIsLoading(true);
      if(position === 0){
        setCurrentJourney(currentJourneySave)
      } else {
        setCurrentJourney(currentJourneyInFlightType)
      }
    } else {
      setIsLoading(true);
      if(position === 0){
        setCurrentJourney(currentJourneySave)
      } else {
        setCurrentJourney(currentJourneyInFlightType)
      }
      const filterBody = {
        min_price: filter?.min_price,
        max_price: filter?.max_price,
        transits: filter?.transits,
        departure_times: filter?.departure_times,
        arrival_times: filter?.arrival_times,
        airlines: filter.airlines?.map((id) => {
          const airline = dataAirlines.find((data) => data.id === id.toString());
          return airline ? airline.name : '';
        }),
        others: filter?.others,
        // facilities: [],
        is_filtered: filter?.is_filtered === false ? true : true,
        is_smart_combo: filter?.is_smart_combo,
      }

      // console.log('itemku', 'salah satu')
      setFilter(filterBody);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const showMoreItems = () => {
    setShownItems((prev) => prev + 15);
    setIsLoading(true)
    setTotalData(currentJourney[position]?.Flights?.length);
    setFlights(currentJourney[position]?.Flights?.slice(0, shownItems));
    setTimeout(() => {
      setIsLoading(false)
    }, 1000);
  };

  const handleViewAll = () => {
    showMoreItems();
  };

  const handlePosition = (e, value, journey) => {
    e.preventDefault();
    if (!(e.target.innerHTML === "Detail")) {
      setFlightType(journey?.FlightType)
      if(cart?.length === 0){
        setPosition(position + 1);
      }
      setIsLoading(true);
      setCart([...cart, journey]);

      // console.log('itemku2', "jalan gk si", query?.isRoundTrip, position, position === 1, flightType)
      if (query?.isRoundTrip === 'true') {
        window.scrollTo({ top: 0, behavior: "smooth" });
        // console.log('itemkuresult', position + 1, flightType)
        const updatedCurrentJourney = currentJourneySave.map((journeyCurrent, index) => {
          if (index === 1) {
              return {
                ...journeyCurrent,
                Flights: filterFlightType(journeyCurrent?.Flights, journey?.FlightType)
              };
            }
            return journeyCurrent;
          });
        setCurrentJourneyInFligtType(updatedCurrentJourney)

        // console.log('itemkuresult',updatedCurrentJourney, currentJourneySave)

        // setFlights(currentJourney[1].Flights?.slice(0, shownItems));
        // // setTotalData(currentJourney[1].Flights?.length);
        // if(flightType !== 'all'){
        //   const updatedCurrentJourney = currentJourneySave.map((journey, index) => {
        //     if (index === position) {
        //       return {
        //         ...journey,
        //         Flights: filterFlightType(journey.Flights, flightType)
        //       };
        //     }
        //     return journey;
        //   });
        //   setCurrentJourneyInFligtType(updatedCurrentJourney)
        // }
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 1000);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const SortButton = ({ sortByState }) => {
    const [sortBy, setSortBy] = sortByState;
    const [value, setValue] = useState("Harga Terendah");
    // console.log('itemku99', value)
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
        setIsLoading(true)
        setSortBy(value);
        // handleFilter(filter);
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
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
          id: "0",
          name: "Langsung",
        },
        {
          id: "1",
          name: "1 Transit",
        },
        {
          id: "2",
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

    if(position === 0){
      data.airlines = getAirlineAvailable(currentJourneySave[position]?.Flights);
    } else {
      data.airlines = getAirlineAvailable(currentJourneyInFlightType[position]?.Flights);
    }
    // setAirlineDataMaskapai(getAirlineAvailable(airlines));

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
          onSubmit={() => handleFilter(filter, data?.airlines)}
          onReset={() => setFilter(initialFilter)}
          title={"Filter"}
          footer={"Terapkan"}
          notrounded
        >
          {/* {query?.isRoundTrip == "true" && (
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
          )} */}
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
  // console.log(cart)
  // console.log('departure date',departureDateTime)

  return (
    <Layout
      type={"nested"}
      metatitle={`Hasil Pencarian Tiket ${
        query.isRoundTrip == "true" ? `Round Trip` : `One Way`
      }: 🛫${query?.originCode} 🛬${
        query?.destinationCode
      }, ${
        departureDateTime
          ? date(new Date(departureDateTime), "d LLL yy") + " "
          : null
      }`}
      pagetitle={"Hasil Pencarian Tiket"}
      hideBottomBar>
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
              {date(new Date(departureDateTime), "iii, d LLL yy") + " "}
              {query.isRoundTrip == "true" && "- " + date(new Date(returnDateTime), "iii, d LLL yy" )}
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
                  {getClassCode(query?.cabinClasses)}
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
                  {query?.isRoundTrip === "true" && index == 0
                    ? "Pergi"
                    : query?.isRoundTrip === "true" && index == 1
                    ? "Pulang"
                    : ""}
                </Badge>
                <Stack>
                  <Text color="neutral.text.medium">
                    {`${date(
                      new Date(item?.DepartDate),
                      "dd LLL yy"
                    )}, ${item?.DepartTime.replace(/:/, '.')} - ${item?.ArriveTime.replace(/:/, '.')}
                     (${convertTimeToCustomFormat(item?.Duration)})`}
                  </Text>
                  <Text color="neutral.text.medium">
                    {`${item?.Origin} - ${
                      item?.Destination
                    }`}{" "}
                    <Text color="black" fontWeight="semibold" as="span">
                      {`• ${convertRupiah(
                        item?.Fare
                      )} per pax`}
                      {/* {`• ${convertRupiah(
                        sumPriceFareFinal(item.segments, item.connectingType)
                      )} per pax`} */}
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
                  setFlightType('all')
                  const currentFlight = currentJourney[0]?.Flights;
                  setTotalData(currentFlight.length);
                  setFlights(currentFlight.slice(0, shownItems));
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 1000);
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
               {`${currentJourney[position]?.Flights?.length === undefined ? 0 : currentJourney[position]?.Flights?.length } Tersedia`}
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
              {currentJourneySave[position]?.Flights?.length > 0 && (
                <FilterButton
                  airlines={currentJourney[position]?.Flights}
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
            {currentJourney?.length !== 0 ? (
              currentJourney[position]?.Flights?.slice(0, shownItems).map((item, index) => {
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
                {/* {(!isLoading && (currentJourney[0]?.Flights?.length === 0)) ? (
                  <NoResults href="/flights" />
                ) : (
                  <Center>
                    <Spinner mx={"auto"} />
                  </Center>
                )} */}
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

        {isLoading && cart?.length < 1 && (
          <Center>
            <Spinner mx={"auto"} />
          </Center>
        )}

        {(!isLoading && ((currentJourney[0]?.Flights?.length === 0) || (currentJourney?.length === 0)) ) && (
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
//   console.log('additionalData', additionalData)
//   try {
//     additionalData = await getFlights(query, query?.is_smart_combo);
//     // if (additionalData.data[0].journeys.length === 0) {
//     //   noresults = true;
//     //   additionalData = false;
//     //   totalFlight = 0;
//     // }
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
//       // totalFlight: totalFlight ?? additionalData.data.length,
//       totalFlight: totalFlight,
//       meta: {
//         title: "Hasil Pencarian Tiket",
//       },
//     },
//   };
// }

export async function getServerSideProps(context) {
  const { departureDate, returnDate, originCode, destinationCode, adult, child, infant, cabinClasses, airlines, isRoundTrip, is_smart_combo } = context.query;

  let query = {
    departureDate: departureDate,
    returnDate: returnDate,
    originCode: originCode,
    destinationCode: destinationCode,
    adult: adult,
    child: child,
    infant: infant,
    cabinClasses: [cabinClasses],
    airlines: airlines,
    isRoundTrip: isRoundTrip,
    is_smart_combo: is_smart_combo,
  };
  const payload = query;
  let status = false
  let loading = false;
  let isInternational = false
  let additionalFee = 0
  let totalData = 0
  let flights = []
  let currentJourney = []
  let currentJourneySave = []

  try {
    loading = true
    const response = await getFlights(payload, is_smart_combo);

    if(response.success === false){
      loading = false
      status = false
    }

    if (response.success === true) {
      status = true;
      loading = false;
      
      const schedules = response.data?.Schedules;

      schedules.map((item)=>{
        if(item.IsInternational){
          isInternational = true 
        }
      })

      const lowestPriceFlights = schedules[0]?.Flights.slice(0).sort((a, b) => a.Fare - b.Fare);

      const updatedCurrentJourney = response.data?.Schedules?.map((journey, index) => {
        if (index === 0) {
          return {
            ...journey,
            Flights: lowestPriceFlights
          };
        }
        return journey; 
      });

      currentJourney = updatedCurrentJourney
      currentJourneySave = updatedCurrentJourney

      flights = response.data?.Schedules[0]?.Flights?.slice(0, 15)
      totalData = response.data?.Schedules[0]?.Flights?.length
      additionalFee = response.data?.Schedules[0]?.AdditionalFee;
      loading = false;
    }
    
    return {
      props: {
        dataQuery: {
          departureDate: departureDate,
          returnDate: returnDate,
          originCode: originCode,
          destinationCode: destinationCode,
          adult: adult,
          child: child,
          infant: infant,
          cabinClasses: cabinClasses,
          airlines: airlines,
          isRoundTrip: isRoundTrip,
          is_smart_combo: is_smart_combo,
        },
        dataflights : {
          status: status,
          loading: loading,
          isInternational: isInternational,
          additionalFee: additionalFee,
          totalData:  totalData,
          flights: flights,
          currentJourney: currentJourney,
          currentJourneySave: currentJourneySave,
        }
      }
    };
  } catch (error) {
    loading  = false;
    status = false
  }
}

export default SearchFlights;