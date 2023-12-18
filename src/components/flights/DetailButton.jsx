import { chakra, Center, HStack, Skeleton, Spinner, Stack, Text, VStack, Box, Badge, useDisclosure, LinkOverlay } from "@chakra-ui/react";
import { CustomFilterButton, CustomOrangeFullWidthButton } from "../button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLoginToast } from "../../hooks";
import { convertDateFlightPage, convertRupiah, convertTimeFlightPage, getClassCode, simplifyBodyDetailFlight } from "../../helpers";
import { breakdownTransitTime, calculateTimeDifference, calculateTimeTotalTransitDifference } from "../../helpers/date";


const DetailButton = ({ type, item, query, segments, empty, setIsEmpty, isDesktop, isLoading, originData, handlePosition }) => {

  const drawerRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loginToast = useLoginToast();

  const totalTransit = item?.totalTransit || 0
  const [journey, setJourney] = useState([])

  useEffect(()=>{
    if(item?.TotalTransit === 0){
      setJourney([item])
    } else if(item?.TotalTransit > 0) {
      setJourney([...item?.ConnectingFlights])
    } else {
      setJourney([])
    }
  },[item, totalTransit])

  const data = item;
  empty = data ? setIsEmpty(false) : setIsEmpty(true);
  const cta = isDesktop ? "Detail Penerbangan" : "Detail";
  const connectingType = item?.IsConnecting;
  if (isLoading){
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
  } else {
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
            <CustomOrangeFullWidthButton mt={0} py={0} onClick={(e) => loginToast(() => handlePosition(e, 0, item))}>
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
                    textDecoration={"line-through"}>
                    {`IDR ${convertRupiah(item?.Fare) ?? ""}`}
                  </Text>
                ) : (
                  <></>
                )}
                <Skeleton isLoaded={!isLoading}>
                  <Text
                    whiteSpace={"nowrap"}
                    fontWeight={"semibold"}
                    color={"brand.orange.400"}>
                    {`IDR ${
                      convertRupiah(item?.Fare) ?? ""
                    }`}
                    <chakra.span
                      fontWeight={"normal"}
                      textColor={"neutral.text.low"}
                      fontSize={"xs"}>
                      {" "}per pax
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
          }>

          <Stack spacing={"24px"} py={"24px"}>
            {journey?.map((flight, index) => {
              return (
                <Stack key={index} spacing={"24px"}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <HStack>
                      <Image
                        src={`${flight?.AirlineImageUrl}`}
                        alt="Singapore Airlines"
                        width={16}
                        height={22}
                        objectFit="contain"
                      />
                      <HStack alignItems={"center"}>
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          fontWeight={"semibold"}
                        >
                          {`${flight?.AirlineName}`}
                        </Text>
                        <Badge>
                          {`${flight?.Number}`}
                        </Badge>
                        <Text fontSize={{ base: "sm", md: "md" }}>
                          {`| ${getClassCode(query?.cabinClasses)}`}
                        </Text>
                      </HStack>
                    </HStack>
                  </HStack>
                  <HStack alignItems={"stretch"} gap={4}>
                    <VStack
                      justifyContent={"space-between"}
                      alignItems={"end"}
                      textAlign={"right"}
                    >
                    {
                    [ 
                      {
                        a: flight?.DepartTime,
                        b: flight?.DepartDate
                      }, 
                      {
                        a: flight?.ArriveTime,
                        b: flight?.ArriveDate
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
                          c: `${flight?.OriginCityName}, ${flight?.Origin}`,
                          a: `${flight?.OriginAirportName}`
                        },
                        {
                          b: `${flight.Duration.split(':')[0]} JAM ${flight.Duration.split(':')[1]} MENIT`,
                        },
                        {
                          c: `${flight?.DestinationCityName}, ${flight?.Destination}`,
                          a: `${flight?.DestinationAirportName}`,
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
                        {flight?.TotalTransit == 0 ? (
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={"semibold"}>
                            Bag {" "} {flight?.Facilities !== null ? flight?.Facilities[0]?.Value : '-'}
                          </Text>
                        ) : 
                        (
                          <>
                            {
                            flight?.ConnectingFlights.map((item, index)=>(
                                <Text
                                  key={index}
                                  fontSize={{ base: "sm", md: "md" }}
                                  fontWeight={"semibold"}>
                                  Bag {" "} {flight?.Facilities !== null ? flight?.Facilities[index]?.Value : ''}
                                </Text>
                              ))
                            }
                          </>
                        ) 
                        }
                      </VStack>
                    </HStack>
                  </VStack>
                  {flight?.TotalTransit > 0 || index < journey?.length - 1 && (
                    <VStack
                      p={"12px"}
                      bg={"brand.blue.100"}
                      borderRadius={"12px"}
                      justifyContent={"end"}
                      alignText={"center"}
                      >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color={"neutral.text.low"}>
                          {`Transit selama ${breakdownTransitTime(String(item?.ConnectingFlights[index]?.ClassObjects[0]?.TransitTime))} di`}
                      </Text>
                      <Text
                        fontWeight={"semibold"}
                        fontSize={{ base: "sm", md: "md" }}
                        textAlign="center"
                        color={"neutral.text.medium"}>
                        {`${flight?.DestinationCityName} (${flight?.Destination}) ${flight?.DestinationAirportName }`}
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
    }
  };

export default DetailButton;
