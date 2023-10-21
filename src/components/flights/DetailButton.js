import { chakra, Center, HStack, Skeleton, Spinner, Stack, Text, VStack, Box, Badge, useDisclosure, LinkOverlay } from "@chakra-ui/react";
import { CustomFilterButton, CustomOrangeFullWidthButton } from "../button";
import Image from "next/image";
import { useRef } from "react";
import { useLoginToast } from "../../hooks";
import { simplifyBodyDetailFlight } from "../../helpers";


const DetailButton = ({ type, item, query, segments, empty, setIsEmpty, isDesktop, isLoading }) => {
    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const loginToast = useLoginToast();
    // const payload = simplifyBodyDetailFlightt(item, query);

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
                      {item?.Fare}
                      {/* {`IDR ${convertRupiah(
                        sumPriceFareFinal(item.segments, item.connectingType)
                      )}`} */}
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
                      {item?.Fare}
                      {/* {`IDR ${convertRupiah(
                        sumPriceFareFinal(item.segments, item.connectingType)
                      )}`} */}
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
            {/* <Stack spacing={"24px"} py={"24px"}>
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
                        <Image
                          src="/png/singapore-airlines.png"
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
            </Stack> */}
          </CustomFilterButton>
        </>
      ) : (
        <Text>Habis</Text>
      );
  };

export default DetailButton;
