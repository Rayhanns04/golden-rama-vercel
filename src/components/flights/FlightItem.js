import { Box, Center, Flex, HStack, LinkBox, SimpleGrid, Skeleton, SkeletonCircle, Stack, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import DetailButton from "./DetailButton";
import { CustomOrangeFullWidthButton } from "../button";
import { useEffect, useState } from "react";
import { useLoginToast } from "../../hooks";
import { convertDateFlightPage, convertRupiah, getClassCode } from "../../helpers";
import {
  getAirports,
  getRecommendedAirports,
} from "../../services/flight.service";

const FlightItem = ({ item, isLoading, isDesktop, query, destinationData, originData, handlePosition, position }) => {

  // console.log('originName',originData)
  
  const [totalTransit, setTotalTransit] = useState()
  const [isEmpty, setIsEmpty] = useState(false);
  const [imageLogos, setImageLogos] = useState('')
  const loginToast = useLoginToast();
  


  // const { logos, names, classFlight } = item.segments.reduce(
  //   (acc, curr) => {
  //     if (!acc.logos.includes(curr.flightDesignator.carrierCode)) {
  //       acc.logos = [...acc.logos, curr.flightDesignator.carrierCode];
  //     }
  //     if (!acc.names.includes(curr.flightDesignator.carrierName)) {
  //       acc.names = [...acc.names, curr.flightDesignator.carrierName];
  //     }
  //     if (item.connectingType == "THROUGH") {
  //       if (
  //         acc.classFlight !==
  //         getClassCode(item.segments[0].fares[0].fareGroupCode)
  //       ) {
  //         acc.classFlight = "Multi-class";
  //       }
  //     }
  //     if (item.connectingType === "DIRECT" || item.connectingType === "SUM") {
  //       if (acc.classFlight !== getClassCode(curr.fares[0].fareGroupCode)) {
  //         acc.classFlight = "Multi-class";
  //       }
  //     }
  //     return acc;
  //   },
  //   {
  //     logos: [],
  //     names: [],
  //     classFlight: getClassCode(item.segments[0].fares[0].fareGroupCode),
  //   }
  // );
  
  // let diffHoursTransit = 0;
  // let diffMinutesTransit = 0;
  // if (item.segments.length > 0) {
  //   //count hours and time
  //   diffHoursTransit =
  //     item.segments[0].legs[0].durationHours +
  //     item.segments[item.segments.length - 1].legs[0].durationHours;
  //   diffMinutesTransit =
  //     item.segments[0].legs[0].durationMinutes +
  //     item.segments[item.segments.length - 1].legs[0].durationMinutes;
  //   if (diffMinutesTransit > 59) {
  //     diffHoursTransit = diffHoursTransit + 1;
  //     diffMinutesTransit = diffMinutesTransit - 60;
  //   }
  //   const transitTime = differenceDateLong(
  //     item.segments[0].arrivalDateTime,
  //     item.segments[item.segments.length - 1].departureDateTime
  //   ).split(" ");
  //   // console.log(transitTime, "transitTime")
  //   diffHoursTransit = parseInt(transitTime[0]) + diffHoursTransit;
  //   diffMinutesTransit = parseInt(transitTime[2]) + diffMinutesTransit;
  //   if (diffMinutesTransit > 59) {
  //     diffHoursTransit = diffHoursTransit + 1;
  //     diffMinutesTransit = diffMinutesTransit - 60;
  //   }
  // }

  const setIsEmptyState = (value) => {
    setIsEmpty(value);
  };

  useEffect(()=>{
    if(item?.TotalTransit === 0){
      setImageLogos(item?.AirlineImageUrl)
    } else if(item?.TotalTransit > 0){
      setImageLogos(item.ConnectingFlights[0]?.AirlineImageUrl)
    }
  },[item?.AirlineImageUrl, item.ConnectingFlights, item?.TotalTransit, totalTransit])

    // const images = logos.length === 2 ? [logos[0], null, null, logos[1]] : logos;

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
                  {/* <SimpleGrid flexShrink={0} columns={logos.length > 1 ? 2 : 1}> */}
                  <SimpleGrid flexShrink={0}>
                    <Box
                      position="relative"
                      w={
                        imageLogos.length < 1
                          ? isDesktop
                            ? "30px"
                            : "18px"
                          : isDesktop
                          ? "60px"
                          : "24px"
                      }
                      h={
                        imageLogos.length < 1
                          ? isDesktop
                            ? "30px"
                            : "18px"
                          : isDesktop
                          ? "60px"
                          : "24px"
                      }>
                      <Image
                        layout="fill"
                        src={`${imageLogos}`}
                        alt="airline"
                        objectFit={"contain"}
                      />
                      </Box>
                  </SimpleGrid>
                  <Stack alignItems={"flex-start"}>
                    <HStack>
                      <Text fontSize={{ base: "sm", md: "xs" }}>
                        {item?.AirlineName}
                      </Text>
                      {/* <Text fontSize={{ base: "sm", md: "xs" }}>•</Text> */}
                      {/* <Text
                        fontSize={{ base: "sm", md: "xs" }}
                        fontWeight={"semibold"}
                      >{`${item.segments[0].flightDesignator.carrierCode}${item.segments[0].flightDesignator.flightNumber}`}</Text> */}
                    </HStack>
                    <Text hidden={!isDesktop} fontWeight={"bold"}>
                      {getClassCode(query?.cabinClasses)}
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
                isDesktop={isDesktop}
                originData={originData}
                isLoading={isLoading}
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
                    {item?.Origin}
                    {/* {item.segments[0].origin.code} */}
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
                    {
                      originData?.map((item)=>{
                        if(item?.attributes?.code === query?.originCode){
                          return item?.attributes?.cityName
                        }
                      })
                    }
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
                    color={"neutral.text.low"}>
                    {item?.TotalTransit === 0 ? "Langsung • " : "Transit • "}
                    { convertTimeToCustomFormat(item?.Duration)}
                    {/* {item.connectingType != "DIRECT"
                      ? `${
                          item.segments.length - 1
                        } Transit • ${diffHoursTransit}j ${diffMinutesTransit}m`
                      : `Langsung • ${item.segments[0].legs[0].durationHours}j ${item.segments[0].legs[0].durationMinutes}m`} */}
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
                    {item?.Destination}
                    {/* {item.segments[item.segments.length - 1].destination.code} */}
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
                    {
                      destinationData?.map((item)=>{
                        if(item?.attributes?.code === query?.destinationCode){
                          return item?.attributes?.cityName
                        }
                      })
                    }
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
                    {convertDateFlightPage(item?.DepartDate)}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }}>•</Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    flexGrow={1}
                    fontWeight="semibold"
                  >
                    {item?.DepartTime?.replace(/:/, '.')}
                    {/* {convertTimeFlightPage(item.segments[0].departureDateTime)} */}
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
                    {convertDateFlightPage(item?.ArriveDate)}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }}>•</Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="semibold"
                  >
                    {item?.ArriveTime.replace(/:/, '.')}
                    {/* {convertTimeFlightPage(
                      item.segments[item.segments.length - 1].arrivalDateTime
                    )} */}
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
                      convertRupiah(item?.Fare) ?? ""
                    }`}
                    {/* {`IDR ${
                      convertRupiah(
                        sumPriceFare(item.segments, item.connectingType)
                      ) ?? ""
                    }`} */}
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
                  {`IDR ${
                      convertRupiah(item?.Fare) ?? ""
                    }`}
                  {/* {`IDR ${convertRupiah(
                    sumPriceFareFinal(item.segments, item.connectingType)
                  )}`} */}
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
                }>
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
                {item?.Number}
                {/* {getClassCode(item.segments[0].fares[0].fareGroupCode)} */}
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
                  {item?.Fare}
                  {/* {`IDR ${convertRupiah(
                    sumPriceFareFinal(item.segments, item.connectingType)
                  )}`} */}
                </Text>
              </Skeleton>
            </Stack>
          </HStack>
        </Box>
      </LinkBox>
    );
  };

export default FlightItem;

function convertTimeToCustomFormat(inputTime) {
  const timeRegex = /^(\d{2}):(\d{2})$/;
  if (timeRegex.test(inputTime)) {
    const [hours, minutes] = inputTime.split(':');  
    const formattedTime = `${parseInt(hours)}j ${parseInt(minutes)}m`;
    return formattedTime;
  } else {
    return "Format waktu tidak valid";
  }
}