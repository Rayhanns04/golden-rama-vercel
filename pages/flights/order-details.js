/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Box,
  HStack,
  Stack,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Tab,
  Text,
  Button,
  VStack,
  Spinner,
  useBreakpointValue,
  Heading,
  useToast,
  Divider,
  Center,
  GridItem,
  Grid,
  SimpleGrid,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../src/components/layout";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
} from "../../src/components/button";
import CheckoutDetail from "../../src/components/checkout-detail";
import { useDispatch, useSelector } from "react-redux";
import {
  bookingFlight,
  getDetailPrice,
} from "../../src/services/flight.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  convertDateFlightPage,
  convertRupiah,
  convertTimeFlightPage,
  createArrayPassanger,
  differenceDateLong,
  getClassCode,
  getPaxFaresName,
  mappingPriceFlight,
  simplifyBodyDetailFlight,
  simplifyJourneysFlight,
  sumTaxPrice,
} from "../../src/helpers";
import { checkoutData } from "../../src/state/order/order.slice";
import { checkPromo } from "../../src/services/promo.service";
import { FlightDetails, FlightPriceDetails } from "../../src/components/card";
import { useSteps } from "chakra-ui-steps";
// console.log('orderData', data, journeys?.flights, query, isDomestic, user)

const OrderDetails = () => {
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60 * 5);
  let timeoutId = null;

  const startTimer = () => {
    timeoutId = setTimeout(() => {
      setIsTimeOpen(true);
    }, remainingTime * 1000);
  };

  React.useEffect(() => {
    startTimer();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [remainingTime, startTimer, timeoutId]);

  const { data, query, isDomestic, addFee } = useSelector(
    (state) => state.orderReducer
  );

  // console.log('itemkudomestic', isDomestic)

  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);
  const [isChoosed, setIsChoosed] = useState(false);
  const [form, setForm] = useState({
    journeys: data
  });

  const {journeys} = form;

  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });

  const [traveler, setTraveler] = useState(createArrayPassanger(query));
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  const steps = useSteps({
    initialStep: 0,
  });

  function handleNextStep() {
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  totalPrice;
  
  const [totalFareFlight, setTotalFareFlight] = useState([])
  const [fareTotal, setFareTotal] = useState()
  const [fareDetail, setFareDetail] = useState()
  const [serviceFee, setServiceFee] = useState(20000)
  const [priceOriginal, setPriceOrignal] = useState()
  const [resultFareBreakdown, setResultFareBreakdown] = useState([])
  
  const dataQuery = {
    adult: query?.adult,
    child: query?.child,
    infant: query?.infant
  }

  useEffect(() => {
    if(query?.isRoundTrip === 'true'){
      let totalData = data?.flights?.length
      const totalFareAll = []
      setIsLoading(true)
      let resultFareBreakdownTemp = []

      data?.flights?.map(async (item, index)=>{
        if(item?.FlightType === 'GdsBfm'){
          let totalAmountByPaxType = {};
          item?.FareBreakdowns?.forEach(function(item) {
            var paxType = item.PaxType;
            var charges = item.Charges;
            
            var totalAmount = charges.reduce(function(total, charge) {
                return total + charge.Amount;
            }, 0);
        
            if (totalAmountByPaxType[paxType] === undefined) {
                totalAmountByPaxType[paxType] = 0;
            }
        
            totalAmountByPaxType[paxType] += totalAmount;
          });

          var result = Object.keys(totalAmountByPaxType).map(function(paxType) {
            return {
                "PaxType": paxType,
                "TotalAmount": totalAmountByPaxType[paxType]
            };
          });

          // console.log('itemkuGdsBfm', result)
          resultFareBreakdownTemp[index] = result
          totalFareAll.push(item?.Fare)
          // setResultFareBreakdown([...resultFareBreakdown, result])
          
          setPriceOrignal(item?.Fare)
        } else if (item?.FlightType === 'NonGds'){
          if(item?.IsConnecting === false && item?.IsMultiClass === false){
            const fareItem = simplifyJourneysFlight(item, query, isDomestic)
            try {
              const response = await getDetailPrice(fareItem, jwt);

              var totalAmountByPaxType = {};
              
              response?.data?.Details.forEach(function(item) {
                var paxType = item.Code;
                var amount = item.Amount;
            
                if (totalAmountByPaxType[paxType] === undefined) {
                    totalAmountByPaxType[paxType] = 0;
                }
                totalAmountByPaxType[paxType] += amount;
              });

              var result = Object.keys(totalAmountByPaxType).map(function(paxType) {
                return {
                    "PaxType": paxType,
                    "TotalAmount": totalAmountByPaxType[paxType]
                };
              });

              // console.log('itemkuNonGds', response)
              setServiceFee(response?.data?.AdditionalFee?.ServiceFee?.value)
              setFareDetail(response?.data?.Details)

              // ubah response nyaaaaaa
              const filteredResponse = result.filter(
                (item) => item.PaxType === "ADT" || item.PaxType === "CHD"
              );

              const totalADT = result.find((item) => item.PaxType === "ADT")?.TotalAmount;
              const totalCHD = result.find((item) => item.PaxType === "CHD")?.TotalAmount;

              const sumTotal = result
                .filter((item) => item.PaxType !== "ADT" && item.PaxType !== "CHD" && item.PaxType !== "INFT")
                .reduce((total, item) => total + item.TotalAmount, 0);

              const totalToDistribute = sumTotal / (Number(dataQuery.adult) + Number(dataQuery.child));

              const updatedResponse = filteredResponse.map((item) => ({
                ...item,
                TotalAmount: item.PaxType === "ADT" ? item.TotalAmount + totalToDistribute * Number(dataQuery.adult) : item.TotalAmount + totalToDistribute * Number(dataQuery.child)
              }));

              const finalResponse = [
                ...updatedResponse,
                ...result.filter((item) => item.PaxType === "INFT")
              ];

              // console.log('itemku4', finalResponse )
              
              totalFareAll.push(response?.data?.Total)
              resultFareBreakdownTemp[index] = finalResponse
              // setFareTotal(fareTotal+response?.data?.Total)
            } catch (error) {
              console.error('Terjadi kesalahan saat mengambil detail harga:', error);
            }
            // setFareTotal(totalFareAll?.reduce((a, b)=> a + b, 0))
          } else if(item?.IsConnecting === true && item?.IsMultiClass === true) {

            const fareItem = simplifyJourneysFlight(item, query, isDomestic)
            try {
              const response = await getDetailPrice(fareItem, jwt);
  
              var totalAmountByPaxType = {};

              response?.data?.Details.forEach(function(item) {
                var paxType = item.Code;
                var amount = item.Amount;
            
                if (totalAmountByPaxType[paxType] === undefined) {
                    totalAmountByPaxType[paxType] = 0;
                }
                totalAmountByPaxType[paxType] += amount;
              });

              var result = Object.keys(totalAmountByPaxType).map(function(paxType) {
                return {
                    "PaxType": paxType,
                    "TotalAmount": totalAmountByPaxType[paxType]
                };
              });

              // ubah response nyaaaaaa
              const filteredResponse = result.filter(
                (item) => item.PaxType === "ADT" || item.PaxType === "CHD"
              );

              const totalADT = result.find((item) => item.PaxType === "ADT")?.TotalAmount;
              const totalCHD = result.find((item) => item.PaxType === "CHD")?.TotalAmount;

              const sumTotal = result
                .filter((item) => item.PaxType !== "ADT" && item.PaxType !== "CHD" && item.PaxType !== "INFT")
                .reduce((total, item) => total + item.TotalAmount, 0);

              const totalToDistribute = sumTotal / (Number(dataQuery.adult) + Number(dataQuery.child));

              const updatedResponse = filteredResponse.map((item) => ({
                ...item,
                TotalAmount: item.PaxType === "ADT" ? item.TotalAmount + totalToDistribute * Number(dataQuery.adult) : item.TotalAmount + totalToDistribute * Number(dataQuery.child)
              }));

              const finalResponse = [
                ...updatedResponse,
                ...result.filter((item) => item.PaxType === "INFT")
              ];

              // console.log('itemku5', finalResponse )

              // resultFareBreakdownTemp.push(finalResponse)
              totalFareAll.push(response?.data?.Total)
              setServiceFee(response?.data?.AdditionalFee?.ServiceFee?.value)
              setFareDetail(response?.data?.Details)
              resultFareBreakdownTemp[index] = finalResponse
              // if(response.success){
              // }
              
            } catch (error) {
              console.error('Terjadi kesalahan saat mengambil detail harga:', error);
            }
          }
        }
        
        if(totalData === totalFareAll?.length){
          setIsLoading(false)
        }
        setResultFareBreakdown(resultFareBreakdownTemp)
        setFareTotal(totalFareAll?.reduce((a, b)=> a + b, 0))
      })
      // console.log('itemku', totalFareAll)
      
    } else {
      data?.flights?.map(async (item)=>{
        setIsLoading(true)
        if(item?.FlightType === 'GdsBfm'){
          let totalAmountByPaxType = {};
          item?.FareBreakdowns?.forEach(function(item) {
            var paxType = item.PaxType;
            var charges = item.Charges;
            
            var totalAmount = charges.reduce(function(total, charge) {
                return total + charge.Amount;
            }, 0);
        
            if (totalAmountByPaxType[paxType] === undefined) {
                totalAmountByPaxType[paxType] = 0;
            }
        
            totalAmountByPaxType[paxType] += totalAmount;
          });

          var result = Object.keys(totalAmountByPaxType).map(function(paxType) {
            return {
                "PaxType": paxType,
                "TotalAmount": totalAmountByPaxType[paxType]
            };
          });

          setResultFareBreakdown([result])
          setFareTotal(item?.Fare)
          setPriceOrignal(item?.Fare)
        } else if (item?.FlightType === 'NonGds'){

          if(item?.IsConnecting === false){
            const fareItem = simplifyJourneysFlight(item, query, isDomestic)
            try {
              const response = await getDetailPrice(fareItem, jwt);

              // console.log('itemku6', response)
              var totalAmountByPaxType = {};
              response?.data?.Details.forEach(function(item) {
                var paxType = item.Code;
                var amount = item.Amount;
            
                if (totalAmountByPaxType[paxType] === undefined) {
                    totalAmountByPaxType[paxType] = 0;
                }
                totalAmountByPaxType[paxType] += amount;
              });

              var result = Object.keys(totalAmountByPaxType).map(function(paxType) {
                return {
                    "PaxType": paxType,
                    "TotalAmount": totalAmountByPaxType[paxType]
                };
              });

              // ubah response nyaaaaaa
              const filteredResponse = result.filter(
                (item) => item.PaxType === "ADT" || item.PaxType === "CHD"
              );

              const totalADT = result.find((item) => item.PaxType === "ADT")?.TotalAmount;
              const totalCHD = result.find((item) => item.PaxType === "CHD")?.TotalAmount;

              const sumTotal = result
                .filter((item) => item.PaxType !== "ADT" && item.PaxType !== "CHD" && item.PaxType !== "INFT")
                .reduce((total, item) => total + item.TotalAmount, 0);

              const totalToDistribute = sumTotal / (Number(dataQuery.adult) + Number(dataQuery.child));

              const updatedResponse = filteredResponse.map((item) => ({
                ...item,
                TotalAmount: item.PaxType === "ADT" ? item.TotalAmount + totalToDistribute * Number(dataQuery.adult) : item.TotalAmount + totalToDistribute * Number(dataQuery.child)
              }));

              const finalResponse = [
                ...updatedResponse,
                ...result.filter((item) => item.PaxType === "INFT")
              ];

              setResultFareBreakdown([finalResponse])
              setServiceFee(response?.data?.AdditionalFee?.ServiceFee?.value)
              setFareDetail(response?.data?.Details)
              setFareTotal(response?.data?.Total)
            } catch (error) {
              console.error('Terjadi kesalahan saat mengambil detail harga:', error);
            }
          } else if(item?.IsConnecting === true && item?.IsMultiClass === true) {

            const fareItem = simplifyJourneysFlight(item, query, isDomestic)
            try {
              const response = await getDetailPrice(fareItem, jwt);
              setServiceFee(response?.data?.AdditionalFee?.ServiceFee?.value)
              setFareDetail(response?.data?.Details)
              setFareTotal(response?.data?.Total)

              // console.log('itemku7', response)

              var totalAmountByPaxType = {};
              fareDetail.forEach(function(item) {
                var paxType = item.Code;
                var amount = item.Amount;
            
                if (totalAmountByPaxType[paxType] === undefined) {
                    totalAmountByPaxType[paxType] = 0;
                }
                totalAmountByPaxType[paxType] += amount;
              });

              var result = Object.keys(totalAmountByPaxType).map(function(paxType) {
                return {
                    "PaxType": paxType,
                    "TotalAmount": totalAmountByPaxType[paxType]
                };
              });


              // ubah response nyaaaaaa
              const filteredResponse = result.filter(
                (item) => item.PaxType === "ADT" || item.PaxType === "CHD"
              );

              const totalADT = result.find((item) => item.PaxType === "ADT")?.TotalAmount;
              const totalCHD = result.find((item) => item.PaxType === "CHD")?.TotalAmount;

              const sumTotal = result
                .filter((item) => item.PaxType !== "ADT" && item.PaxType !== "CHD" && item.PaxType !== "INFT")
                .reduce((total, item) => total + item.TotalAmount, 0);

              const totalToDistribute = sumTotal / (Number(dataQuery.adult) + Number(dataQuery.child));

              const updatedResponse = filteredResponse.map((item) => ({
                ...item,
                TotalAmount: item.PaxType === "ADT" ? item.TotalAmount + totalToDistribute * Number(dataQuery.adult) : item.TotalAmount + totalToDistribute * Number(dataQuery.child)
              }));

              const finalResponse = [
                ...updatedResponse,
                ...result.filter((item) => item.PaxType === "INFT")
              ];

              setResultFareBreakdown([finalResponse])
              setServiceFee(response?.data?.AdditionalFee?.ServiceFee?.value)
              setFareDetail(response?.data?.Details)
              setFareTotal(response?.data?.Total)

            } catch (error) {
               console.error('Terjadi kesalahan saat mengambil detail harga:', error);
            }
          }
        }
        setIsLoading(false)
      
    })
  }
  }, [query?.isRoundTrip, data?.flights, isDomestic, jwt, query]);


  const [isPromoAvailable, setIsPromoAvailable] = useState({
    available: false,
    totalDiscount: 0,
    promoCode: ""
  });
  const [totalPrice, setTotalPrice] = useState({});

  // console.log('itemku3', isPromoAvailable, form)

  // datasementara 
  const priceArray = {
    isLoading: false
  }

  const handleChange = (e, type) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    if (type == "customer") {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const handleTraveler = (item) => {
    if (traveler.some((i) => i.key === item.key)) {
      const index = traveler.findIndex((e) => e.key === item.key);
      const currentTraveler = [...traveler];
      currentTraveler[index] = item;
      setTraveler(currentTraveler);
    } else {
      setTraveler([...traveler, item]);
    }
  };
  const toast = useToast();

  const handleSubmit = () => {
    if (
      !customer?.fullName ||
      !customer?.email ||
      !customer?.phone ||
      traveler.some((item) => {
        return !item.first_name;
      })
    ) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
      return toast({
        position: "top",
        title: "Harap isi informasi kontak!",
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "subtle",
      });
    }
    // return alert("Harap isi informasi kontak!");
    const payload = {
      ...form,
      traveler: traveler,
      customer: customer,
      prices: resultFareBreakdown,
      totalprice: fareTotal,
      query: query,
      isInternational: !isDomestic
    };

    mutation.mutate(payload);
  };

  console.log('itemku1', form, traveler,
            customer,
            resultFareBreakdown,
            fareTotal,
            query,
            !isDomestic)
  
  const handlePromo = (promoCode) => {
    const payload = {
      promo: promoCode,
      totalPrice: totalPrice.total,
      category: "flight",
    };
    mutationPromo.mutate(payload);
  };

  const mutation = useMutation(async (form) => {
      const response = await bookingFlight(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        if (response?.messageChange != null) {
          toast({
            title: `${response?.messageChange}`,
            status: "error",
            isClosable: true,
            variant: "subtle",
            timeOut: 10000,
          });
        }
        dispatch(checkoutData({ orderDetail: response }));
        router.push({ pathname: "/flights/payment" });
      },
      onError: (error) => {
        if (error.response) {
          toast({
            title: "Booking Gagal",
            description:
              error.response.data.error.message ??
              "Terjadi Kesalahan Server, Silahkan coba beberapa saat lagi!",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Booking Gagal",
            description:
              "Silahkan cek kembali ketersediaan kursi atau data diri penumpang!",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      },
    }
  );

  const mutationPromo = useMutation(
    async (data) => {
      const response = await checkPromo(data, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        setIsPromoAvailable({
          available: true,
          totalDiscount: response.promo_detail.discount_amount,
          promoCode: response.promo_detail.promoCode
        });
        setForm({
          ...form,
          transaction: {
            subTotal: fareTotal,
            total: (fareTotal+serviceFee) - isPromoAvailable?.totalDiscount,
            discount: isPromoAvailable?.totalDiscount,
            downPayment: 0,
            promoCode: isPromoAvailable?.promoCode,
            discountPromo: isPromoAvailable?.totalDiscount,
            unique_code: response?.unique_code || null,
            serviceFee: serviceFee
          },
        });
      },
      onError: (error) => {
        setIsPromoAvailable({
          available: false,
          totalDiscount: 0,
          error: error?.response?.data?.error,
        });
      },
    }
  );

  const TotalPrice = ({ ...props }) => {
    return (
      <Box position={"sticky"} bottom={0}>
        {/* <Divider hidden={!isDesktop} variant="dashed" /> */}
        <HStack
          {...props}
          bg={{ base: "white", md: "transparent" }}
          p={{ base: "24px", md: 0 }}
          // borderTop={{ base: "1px dashed #9E9E9E", md: "none" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="brand.orange.400"
            w="full"
            whiteSpace={"nowrap"}
          >
              {
                isLoading ? 
                <Spinner/> : 
                <>IDR {convertRupiah(fareTotal+serviceFee)}</>
              }
            <Text
              fontSize={"xs"}
              color="neutral.text.low"
              fontWeight={"normal"}
              as={"span"}
            >
              per pax
            </Text>
          </Text>
          <CustomOrangeFullWidthButton
            maxW={"180px"}
            onClick={() => setIsChoosed(true)}
            // disabled={price.isLoading && !price.data?.priceFinalCustom}
          >
            {
              isLoading ? (
                <Spinner />
              ) : fareTotal !== undefined ? (
                "Pilih Tiket"
              ) : (
                "Tiket Tidak Tersedia"
              )
            }
          </CustomOrangeFullWidthButton>
        </HStack>
      </Box>
    );
  };

  const TabContent = ({ type, onChoose, journey, status }) => {

    const { query } = useSelector((state) => state.orderReducer);
    // const payload = simplifyBodyDetailFlight(journey, query);
    const isDesktop = useBreakpointValue(
      { base: false, md: true },
      { ssr: false }
    );
    const [detailPrice, setDetailPrice] = useState([]);
    const [totalTaxPrice, setTotalTaxPrice] = useState(0);

    const [flights, setFlights] = useState([])

    useEffect(()=>{
      if(journey?.TotalTransit === 0){
        setFlights([journey])
      } else if(journey?.TotalTransit === 1) {
        setFlights([...journey?.ConnectingFlights])
      } else {
        setFlights([])
      }
    },[journey])

    return (
      <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
        <Grid
          templateColumns={{ md: "repeat(3,1fr)" }}
          // pt={"24px"}
          columnGap={"calc(20px + 24px)"}
        >
          <GridItem colSpan={3} p={"24px"} bg={"brand.blue.100"}>
            <HStack>
              {[
                query.isRoundTrip == "true"
                  ? `Round Trip - ${status}`
                  : "One Way",
                  type === "transit" ? 
                  (journey?.TotalTransit === 0 ? "Langsung" : `${journey?.TotalTransit} Transit`)
                  : "Langsung"
              ].map((item, index) => (
                <Badge
                  key={index}
                  variant="unstyled"
                  fontWeight="regular"
                  textTransform="none"
                  bg="brand.orange.400"
                  color="white"
                >
                  {item}
                </Badge>
              ))}
            </HStack>
            <Text my="12px" fontWeight="semibold" fontSize={"lg"}>
              Ke{" "}
              {journey?.DestinationCityName}
            </Text>
            <Stack spacing={"24px"} py={"24px"}>
              {flights.map((item, index) => (
                <Box as={"section"} key={index}>
                  <Stack
                    w="full"
                    p={"16px"}
                    gap={"16px"}
                    borderTopRadius={"12px"}
                    bg={"white"}
                  >
                    <Stack spacing={"24px"}>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <HStack>
                          <HStack alignItems={"center"}>
                            <Text fontSize={"xs"} fontWeight={"semibold"}>
                              {`${item?.AirlineName} | `}
                            </Text>
                            <Text fontSize={"xs"}>{`${
                              item?.Number
                            } | ${getClassCode(query?.cabinClasses)}`}</Text>
                          </HStack>
                        </HStack>
                        <Badge>{`${item?.Number}`}</Badge>
                      </HStack>
                      <HStack alignItems={"stretch"} gap={4}>
                        <VStack
                          justifyContent={"space-between"}
                          alignItems={"end"}
                          textAlign={"right"}
                        >
                          {[ 
                            {
                              a: item?.DepartTime,
                              b: item?.DepartDate
                            }, 
                            {
                              a: item?.ArriveTime,
                              b: item?.ArriveDate
                            }    
                          ].map(
                              (datetime, index) => (
                                <Box key={index}>
                                  <Text
                                    fontSize={{ base: "sm", md: "md" }}
                                    fontWeight={"semibold"}
                                  >
                                    {datetime?.a?.replace(/:/, '.')}
                                  </Text>
                                  <Text fontSize={{ base: "sm", md: "md" }}>
                                    {convertDateFlightPage(datetime?.b)}
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
                              c: `${item?.OriginCityName}, ${item?.Origin}`,
                              a: `${item?.OriginAirportName}`
                            },
                            {
                              b: `${item.Duration.split(':')[0]} JAM ${item.Duration.split(':')[1]} MENIT`,
                            },
                            {
                              c: `${item?.DestinationCityName}, ${item?.Destination}`,
                              a: `${item?.DestinationAirportName}`,
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
                    </Stack>
                  </Stack>
                  <Box
                    as={"section"}
                    position={"relative"}
                    w="full"
                    p={"16px"}
                    borderTop={"1px"}
                    borderTopColor={"gray.200"}
                    borderTopStyle={"dashed"}
                    borderBottomRadius={"12px"}
                    bg={"white"}
                  >
                    {[{ left: "-8px" }, { right: "-8px" }].map(
                      (item, index) => (
                        <Box
                          {...item}
                          key={index}
                          position="absolute"
                          top={"-8px"}
                          bg={"brand.blue.100"}
                          w={"16px"}
                          h={"16px"}
                          borderRadius="full"
                        />
                      )
                    )}
                    <HStack
                      justifyContent={"space-between"}
                      alignItems={"center"}>
                        <HStack>
                          <Image
                            src="/svg/nav/tours.svg"
                            alt="tours"
                            width={20}
                            height={20}
                          />
                          <Text fontSize={"sm"} fontWeight={"semibold"}>
                              {item?.TotalTransit == 0 ? (
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                fontWeight={"semibold"}>
                                Bagasi {" "} {item?.Facilities !== null ? item?.Facilities[0]?.Value : ' - '}
                              </Text>
                            ) : 
                            (
                              <>
                                {
                                item?.ConnectingFlights.map((item, index)=>(
                                    <Text
                                      key={index}
                                      fontSize={{ base: "sm", md: "md" }}
                                      fontWeight={"semibold"}>
                                      Bagasi {" "} {item?.Facilities !== null ? item?.Facilities[index]?.Value : ' - '}
                                    </Text>
                                  ))
                                }
                              </>
                            ) 
                            }
                          </Text>
                        </HStack>
                        <Image
                          hidden
                          src="/svg/icons/chevron-down.svg"
                          alt="chevron-down"
                          width={16}
                          height={16}
                        />
                      </HStack>
                    </Box>
                    {item?.TotalTransit > 0 || index < flights?.length - 1 &&(
                      <VStack
                        p={"12px"}
                        mt={'8px'}
                        bg={"brand.blue.100"}
                        borderRadius={"12px"}
                        justifyContent={"center"}
                        alignText={"center"}
                      >
                        <Text fontSize={"sm"} color={"neutral.text.low"}>
                        {`Transit selama ${item?.Duration?.split(':')[0]} Jam ${item?.Duration?.split(':')[1]} Menit di`}
                        </Text>
                        <Text
                          fontWeight={"semibold"}
                          fontSize={"sm"}
                          color={"neutral.text.medium"}
                        >
                          {`${item?.DestinationCityName} (${item?.Destination}) ${item?.DestinationAirportName }`}                      
                        </Text>
                      </VStack>
                    )}
                </Box>
              ))}
            </Stack>
          </GridItem>
        </Grid>
        {/* {!price?.isLoading ? (
          <TotalPrice hidden={isDesktop} />
        ) : (
          <Center>
            <Spinner></Spinner>
          </Center>
        )} */}
      </Box>
    );
  };

  const FlightPrice = (props) => {
    return (
      <HStack
        {...props}
        bottom={0}
        position={{ base: "sticky", md: "static" }}
        bg={{ base: "white", md: "white" }}
        h={"min-content"}
        p={"24px"}
        border={"1px solid"}
        borderTop={{
          base: "1px dashed #9E9E9E",
          md: "1px solid #e0e0e0",
        }}
        borderColor={"neutral.color.line.secondary"}
        borderTopColor={"neutral.color.line.secondary"}
        justifyContent="space-between"
        rounded={{ base: "none", md: "lg" }}
        alignItems="center"
      >
        {!isLoading ? (
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="brand.orange.400"
            w="full"
          >
            IDR {convertRupiah((fareTotal+serviceFee) - isPromoAvailable?.totalDiscount)}
          </Text>
        ) : (
          <Spinner></Spinner>
        )}
        <CustomOrangeFullWidthButton
          isLoading={mutation.isLoading}
          disabled={mutation.isLoading}
          onClick={() =>
            steps.activeStep !== 1 ? handleNextStep() : handleSubmit()
          }
        >
          Lanjutkan
        </CustomOrangeFullWidthButton>
      </HStack>
    );
  };

  const handleTimeCloseModal = () => {
    setIsTimeOpen(false);
    setRemainingTime(60);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const TimerModal = ({ isOpen, onClose, handleSubmit }) => {
    return (
      <CustomFilterButton
        isOpen={isOpen}
        onClose={onClose}
        title="Waktu Habis"
        footer="Reload Halaman"
        onSubmit={() => {
          handleSubmit();
          onClose();
        }}
      >
        <Stack spacing={5}>
          <Text fontSize="sm" color="neutral.text.low">
            Waktu pemesanan Anda telah habis. Silahkan melakukan pemesanan
            kembali.
          </Text>
        </Stack>
      </CustomFilterButton>
    );
  };

  return (
    <Layout type={"nested"} pagetitle={"Detail Pemesanan"} hideBottomBar>
      <Box position={"relative"}>
        {isChoosed ? (
          <>
            <Box
              as={"section"}
              bg={"white"}
              // bg={{ base: "brand.blue.100", md: "brand.blue.100" }}
              mx={"-24px"}>
              <Box
                maxW={{ lg: "container.lg", xl: "container.xl" }}
                mx={"auto"}>
                <FlightDetails query={query} data={data} hidden={!isDesktop} />
                <Grid
                  templateColumns={{ md: "repeat(3,1fr)" }}
                  py={"24px"}
                  columnGap={"calc(20px + 24px)"}>
                  <GridItem colSpan={{ md: 2 }}>
                    <CheckoutDetail
                      category={"flight"}
                      steps={steps}
                      detail_prices={fareTotal}
                      // additionals={additionals}
                      isDomestic={isDomestic}
                      people={traveler}
                      customer={customer}
                      handleChange={handleChange}
                      handleTraveler={handleTraveler}
                      handlePromo={handlePromo}
                      isPromoAvailable={isPromoAvailable}
                      isLackField={isError}
                      isKTP = {data?.flights?.find((item) => (item?.AirlineName === "Citilink" || item?.AirlineName === "AirAsia"))}                      
                    />
                  </GridItem>
                  <FlightPrice hidden={!isDesktop} />
                  <GridItem>
                    <Stack spacing={"12px"} position={"sticky"} top={24}>
                      <FlightDetails
                        query={query}
                        data={data}
                        hidden={isDesktop}
                      />
                      <Box
                        border={"1px solid"}
                        borderColor={"neutral.color.line.secondary"}
                        rounded={"lg"}
                        hidden={isDesktop}
                        p={"24px"}
                      >
                        <Text
                          as={Heading}
                          pb="16px"
                          fontSize={{ base: "lg", md: "md" }}
                          fontWeight="semibold"
                        >
                          Rincian Harga
                        </Text>
                        <FlightPriceDetails detail_prices={fareTotal+serviceFee} />
                      </Box>
                      <FlightPrice hidden={isDesktop} />
                    </Stack>
                  </GridItem>
                </Grid>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            as={"section"}
            bg={"brand.blue.100"}
            // bg={{ base: "brand.blue.100", md: "brand.blue.100" }}
            mx={"-24px"}
          >
            <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
              <SimpleGrid columns={[2, 3]}>
                <GridItem colSpan={[2]}>
                  <Tabs variant="unstyled">
                    <Stack
                      maxW={{ lg: "container.lg", xl: "container.xl" }}
                      mx={"auto"}
                      p={"24px"}
                      borderBottomWidth={1}
                      borderBottomStyle={"dashed"}
                      borderBottomColor={"brand.blue.200"}
                      // borderBottom="1px dashed #A0BBC5"
                      bg={"brand.blue.100"}
                    >
                      <HStack as={TabList} spacing={4}>
                        <Tab
                          borderRadius="full"
                          bg="white"
                          _selected={{ color: "white", bg: "brand.blue.400" }}
                        >
                          Penerbangan Pergi
                        </Tab>
                        {query.isRoundTrip === "true" ? (
                          <Tab
                            borderRadius="full"
                            bg="white"
                            _selected={{ color: "white", bg: "brand.blue.400" }}
                          >
                            Penerbangan Pulang
                          </Tab>
                        ) : (
                          ""
                        )}
                      </HStack>
                    </Stack>
                    <TabPanels>
                      <TabPanel p={0}>
                        <TabContent
                          type={
                            data.flights[0].IsConnecting === false
                              ? "direct"
                              : "transit"
                          }
                          status="Pergi"
                          onChoose={() => setIsChoosed(true)}
                          journey={data.flights[0]}
                        />
                      </TabPanel>
                      <TabPanel p={0}>
                        {query.isRoundTrip == "true" ? (
                          <TabContent
                            type={
                              data.flights[0].IsConnecting === true
                                ? "transit"
                                : "direct"
                            }
                            status="Pulang"
                            journey={data.flights[1]}
                            onChoose={() => {
                              setIsChoosed(true)
                              // alert('ini kedua')
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </GridItem>
                <GridItem colSpan={[2, 1]}>
                  <Box m={{ base: 0, md: 5 }}>
                    <Stack position={"sticky"} top={24} spacing="12px">
                      <Box
                        borderRadius={{ base: 0, md: "xl" }}
                        p={"24px"}
                        bg="white"
                      >
                        <Text pb="1px" fontSize="lg" fontWeight="semibold">
                          Detail Harga
                        </Text>
                              <>
                                <VStack
                                  alignItems="start"
                                  py={"16px"}
                                  // borderBottom="1px dashed #9E9E9E"
                                  >
                                  <>
                                    {
                                      journeys .flights.map((item, index) => (
                                        <>
                                          <Text
                                            color="brand.blue.400"
                                            fontWeight="semibold"
                                            fontSize={"sm"}
                                            key={index}
                                          >
                                            Tiket penerbangan {index + 1} •{" "}
                                            {
                                              item?.IsConnecting === false ? item?.AirlineName : item?.ConnectingFlights[0]?.AirlineName
                                            }
                                          </Text>
                                          {
                                            isLoading ? 
                                            (
                                              <Center width="100%">
                                                <Spinner></Spinner>
                                              </Center>
                                            ): (
                                              <>
                                                {
                                                  dataQuery.adult !== "0" && (
                                                    <HStack
                                                      w="full"
                                                      justifyContent="space-between"
                                                      // pt={2}
                                                    >
                                                      <Text fontSize="sm" color="neutral.text.medium">
                                                        Dewasa (x{dataQuery?.adult})
                                                      </Text>
                                                      {
                                                        resultFareBreakdown[index]?.map((item, index) => {
                                                          if(item?.PaxType === "ADT"){
                                                            return (
                                                              <Text key={index} fontSize="sm" color="neutral.text.medium">
                                                                IDR {convertRupiah(item?.TotalAmount)}
                                                              </Text>
                                                            )
                                                          } 
                                                        })
                                                      }
                                                    </HStack>
                                                  )
                                                }

                                                {
                                                  dataQuery.child !== "0" && (
                                                    <HStack
                                                      w="full"
                                                      justifyContent="space-between"
                                                    >
                                                      <Text fontSize="sm" color="neutral.text.medium">
                                                        Anak-anak (x{dataQuery?.child})
                                                      </Text>
                                                      {
                                                        resultFareBreakdown[index]?.map((item, index) => {
                                                          if(item?.PaxType === "CHD"){
                                                            return (
                                                              <Text key={index} fontSize="sm" color="neutral.text.medium">
                                                                IDR {convertRupiah(item?.TotalAmount)}
                                                              </Text>
                                                            )
                                                          } 
                                                        })
                                                      }
                                                    </HStack>
                                                  )
                                                }

                                                {
                                                  dataQuery.infant !== "0" && (
                                                    <HStack
                                                      w="full"
                                                      justifyContent="space-between"
                                                    >
                                                      <Text fontSize="sm" color="neutral.text.medium">
                                                        Bayi (x{dataQuery?.infant})
                                                      </Text>
                                                      {
                                                        resultFareBreakdown[index]?.map((item, index) => {
                                                          if(item?.PaxType === "INF" || item?.PaxType === "INFT"){
                                                            return (
                                                              <Text key={index} fontSize="sm" color="neutral.text.medium">
                                                                {
                                                                  item?.TotalAmount !== 0 ? (
                                                                    `IDR ${convertRupiah(item?.TotalAmount)}`
                                                                  ) : (`IDR 0`)
                                                                }
                                                              </Text>
                                                            )
                                                          } 
                                                        })
                                                      }
                                                    </HStack>
                                                  )
                                                }
                                              </>
                                            )
                                          }
                                          
                                        </>
                                      ))
                                    }
                                    <Divider variant={"dashed"} />
                                  </>
                                  <HStack
                                    w="full"
                                    justifyContent="space-between"
                                    pt={4}
                                  >
                                    <Text fontSize="sm" color="neutral.text.medium">
                                      Pajak
                                    </Text>
                                    <Text fontSize="sm" color="neutral.text.medium">
                                      Sudah Termasuk
                                      {/* IDR {convertRupiah(i.total)} */}
                                    </Text>
                                  </HStack>
                                  <HStack w="full" justifyContent="space-between">
                                    <Text fontSize="sm" color="neutral.text.medium">
                                      Service Fee
                                    </Text>
                                    {
                                      isLoading ? 
                                      <Spinner/> :
                                      (
                                        <Text fontSize="sm" color="neutral.text.medium">
                                          IDR{" "}
                                          {convertRupiah(serviceFee)}
                                          {/* {convertRupiah(price?.data?.priceMargin ?? 0)} */}
                                        </Text>
                                      )
                                    }
                                  </HStack>
                                  <Divider variant={"dashed"} />
                                </VStack>
                                <HStack justifyContent="space-between" py="16px">
                                  <Text>Total Pembayaran</Text>
                                  {
                                    isLoading ? 
                                    <Spinner/> : (
                                      <Text fontWeight="semibold">
                                        IDR{" "}
                                        {convertRupiah(fareTotal+serviceFee)}
                                        {/* {convertRupiah(price?.data?.priceFinalCustom)} */}
                                      </Text>
                                    )
                                  }
                                </HStack>
                              </>
                        {/* {!priceArray?.isLoading ? (
                          
                        ) : (
                          <Center>
                            <Spinner></Spinner>
                          </Center>
                        )} */}
                      </Box>
                      <Box
                        position={"sticky"}
                        bottom={0}
                        rounded={{ base: "none", md: "xl" }}
                        p={{ base: 0, md: "24px" }}
                        bg="white"
                      >
                        <TotalPrice />
                      </Box>
                    </Stack>
                  </Box>
                </GridItem>
              </SimpleGrid>
            </Box>
          </Box>
        )}
        <TimerModal
          isOpen={isTimeOpen}
          onClose={handleTimeCloseModal}
          handleSubmit={handleReload}
        />
      </Box>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Detail Pemesanan",
      },
    },
  };
};

export default OrderDetails;
