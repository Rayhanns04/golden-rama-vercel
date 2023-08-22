import {
  chakra,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  ListItem,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  UnorderedList,
  useDisclosure,
  Wrap,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
  ShareButton,
  WishlistButton,
} from "../../src/components/button";
import Bookmark from "../../public/svg/icons/bookmark.svg";
import Layout from "../../src/components/layout";
import { CustomTags, CustomTagsOutlineIcon } from "../../src/components/tags";
import StarIcon from "../../public/svg/icons/star.svg";
import { CustomDivider } from "../../src/components/divider";
import ChevronFilledDown from "../../public/svg/icons/chevron-filled-down.svg";
import CutleryIcon from "../../public/svg/icons/cutlery.svg";
import UserIcon from "../../public/svg/icons/user-multiple.svg";
import BedIcon from "../../public/svg/icons/hotel/bed.svg";
import AlertIcon from "../../public/svg/icons/alert-red.svg";
import RoomIcon from "../../public/svg/icons/room.svg";
import FurnitureIcon from "../../public/svg/icons/furniture.svg";
import ShoppingIcon from "../../public/svg/icons/building-shopping.svg";
import FactoryIcon from "../../public/svg/icons/building-factory.svg";
import CateringIcon from "../../public/svg/icons/kitchenware.svg";
import MapIcon from "../../public/svg/icons/map-pin.svg";
import HotelIcon from "../../public/svg/icons/location.svg";
import PersonIcon from "../../public/svg/flights/person.svg";
import ExpandArrowIcon from "../../public/svg/icons/expand-arrow.svg";
import { checkoutData } from "../../src/state/hotel/hotel.slice";
import { Container } from "postcss";
import { Field, Form, Formik, withFormik, useFormikContext } from "formik";
import CustomCalendar from "../../src/components/calendar";
import { FormRangeDate } from "../../src/components/form";
import { convertRupiah } from "../../src/helpers";
import * as Yup from "yup";
import date from "../../src/helpers/date";
import {
  getHotelDetail,
  hotelAvailability,
} from "../../src/services/hotel.service";
import { data } from "autoprefixer";
import { capitalizeFirstLetter } from "../../src/helpers/capitalizeFirstLetter";
import { convertToRupiah } from "../../src/helpers/delimeterRupiah";
import { useState } from "react";
import { useLocalStorage } from "../../src/hooks";
import { CustomDropdown } from "../../src/components/dropdown";
import { resolve } from "styled-jsx/css";
import { addDays, differenceInDays } from "date-fns";
import { useLoginToast } from "../../src/hooks";
import moment from "moment";
const urlImg = process.env.NEXT_PUBLIC_URL_IMAGES;

const HotelDetail = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const query = router.query;

  const loginToast = useLoginToast();
  const dispatch = useDispatch();
  const countItems = 3;
  const [showMore, setShowMore] = useState(countItems);
  const handleShow = () => {
    setShowMore(showMore + 99);
  };
  const handleClose = () => {
    setShowMore(countItems);
  };
  let differenceDate = 1;
  if (query.checkin_date && query.checkout_date) {
    differenceDate = differenceInDays(
      new Date(query.checkout_date),
      new Date(query.checkin_date)
    );
  }

  const [history, setHistory] = useLocalStorage("hotel_search", []);

  const hotel = useQuery(["getHotel", id], async () => {
    // return Promise.resolve("Ok");
    try {
      const response = await getHotelDetail(id.split("-").pop());
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  });
  const checkin = date(addDays(new Date(), 1), "yyyy-MM-dd");
  const checkout = date(addDays(new Date(), 2), "yyyy-MM-dd");
  const { error, ...available } = useQuery(
    ["getAvailableHotel", query],
    async () => {
      // return Promise.resolve("Ok");
      // new date +1 from today with new Date().setDate(new Date().getDate() + 1)
      const filters = {
        stay: {
          checkIn: query?.checkin_date || checkin,
          checkOut: query?.checkout_date || checkout,
        },
        occupancies: [
          {
            rooms: parseInt(query?.rooms || 1),
            adults: parseInt(query?.adult || 1),
            children: parseInt(query?.children || 0),
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
        details: id,
      };
      const response = await hotelAvailability(filters);
      return Promise.resolve(response.data);
    }
  );
  const formRef = useRef();

  const form = {
    places: id,
    checkin_date: query?.checkin_date || checkin,
    checkout_date: query?.checkout_date || checkout,
    rooms: query?.rooms ? parseInt(query?.rooms) : 1,
    adult: query?.adult ? parseInt(query?.adult) : 1,
    children: query?.children ? parseInt(query?.children) : 0,
    children_ages: query.children_ages
      ? Array.isArray(query.children_ages)
        ? query.children_ages
        : [query.children_ages]
      : [],
    room_type: "",
  };

  const handleSubmit = (values) => {
    return new Promise((resolve) => {
      const { places, ...rest } = values;
      rest.checkout_date = date(new Date(rest.checkout_date), "yyyy-MM-dd");
      rest.checkin_date = date(new Date(rest.checkin_date), "yyyy-MM-dd");
      router.push(
        {
          pathname: `/hotels/${places}`,
          query: rest,
        },
        undefined,
        { shallow: true }
      );
      resolve();
    });
  };

  let listFacilities = [
    {
      value: "wifi",
      label: "Free Wi-fi",
      checked: false,
    },
    {
      value: "swimmingpool",
      label: "Kolam Renang",
      checked: false,
    },
    {
      value: "spa",
      label: "Spa",
      checked: false,
    },
    {
      value: "parking",
      label: "Secure Parking",
      checked: false,
    },
    {
      value: "breakfast",
      label: "Makan Pagi",
      checked: false,
    },
    {
      value: "bathub",
      label: "Bathub",
      checked: false,
    },
    {
      value: "ac",
      label: "AC",
      checked: false,
    },
    {
      value: "shower",
      label: "Shower",
      checked: false,
    },
    {
      value: "fridge",
      label: "Kulkas",
      checked: false,
    },
    {
      value: "bbq",
      label: "BBQ",
      checked: false,
    },
    {
      value: "bathroom",
      label: "Bathroom",
      checked: false,
    },
    {
      value: "sofa",
      label: "Sofa",
      checked: false,
    },
  ];

  hotel?.data?.hotel?.facilities?.map((facility) => {
    if (
      (facility.facilityCode === 550 && facility.facilityGroupCode === 70) ||
      (facility.facilityCode === 100 && facility.facilityGroupCode === 60) ||
      (facility.facilityCode === 261 && facility.facilityGroupCode === 60)
    ) {
      return (listFacilities.find(
        (item) => item.value === "wifi"
      ).checked = true);
    }
    if (facility.facilityCode === 363 && facility.facilityGroupCode === 73) {
      return (listFacilities.find(
        (item) => item.value === "swimmingpool"
      ).checked = true);
    }
    if (
      (facility.facilityCode === 40 && facility.facilityGroupCode === 80) ||
      (facility.facilityCode === 360 && facility.facilityGroupCode === 20)
    ) {
      return (listFacilities.find(
        (item) => item.value === "breakfast"
      ).checked = true);
    }
    if (
      (facility.facilityCode === 170 && facility.facilityGroupCode === 60) ||
      (facility.facilityCode === 180 && facility.facilityGroupCode === 60) ||
      (facility.facilityCode === 10 && facility.facilityGroupCode === 70)
    ) {
      return (listFacilities.find(
        (item) => item.value === "ac"
      ).checked = true);
    }
    if (facility.facilityCode === 20 && facility.facilityGroupCode === 60) {
      return (listFacilities.find(
        (item) => item.value === "shower"
      ).checked = true);
    }
    if (facility.facilityCode === 500 && facility.facilityGroupCode === 70) {
      return (listFacilities.find(
        (item) => item.value === "parking"
      ).checked = true);
    }
    if (
      (facility.facilityCode === 620 && facility.facilityGroupCode === 74) ||
      (facility.facilityCode === 460 && facility.facilityGroupCode === 74) ||
      (facility.facilityCode === 450 && facility.facilityGroupCode === 74)
    ) {
      return (listFacilities.find(
        (item) => item.value === "spa"
      ).checked = true);
    }
    if (facility.facilityCode === 30 && facility.facilityGroupCode === 60) {
      return (listFacilities.find(
        (item) => item.value === "bathub"
      ).checked = true);
    }
    if (
      (facility.facilityCode === 571 && facility.facilityGroupCode === 70) ||
      (facility.facilityCode === 569 && facility.facilityGroupCode === 70)
    ) {
      return (listFacilities.find(
        (item) => item.value === "bbq"
      ).checked = true);
    }
    if (
      (facility.facilityCode === 130 && facility.facilityGroupCode === 60) ||
      (facility.facilityCode === 135 && facility.facilityGroupCode === 60)
    ) {
      return (listFacilities.find(
        (item) => item.value === "fridge"
      ).checked = true);
    }
    if (facility.facilityCode === 10 && facility.facilityGroupCode === 60) {
      return (listFacilities.find(
        (item) => item.value === "bathroom"
      ).checked = true);
    }
    if (
      (facility.facilityCode === 284 && facility.facilityGroupCode === 61) ||
      (facility.facilityCode === 284 && facility.facilityGroupCode === 62)
    ) {
      return (listFacilities.find(
        (item) => item.value === "sofa"
      ).checked = true);
    }
  });

  //check breakfast from array if not exist then add to array
  let checkf = listFacilities;
  if (
    checkf.map((item) => {
      if (item.value === "breakfast" && item.checked === true) {
        return item;
      }
    }).length === 0
  ) {
    hotel?.data?.hotel?.boards.map((board) => {
      if (board.code === "BB") {
        return listFacilities.push({
          value: "breakfast",
          label: "Makan Pagi",
        });
      }
    });
  }

  let availableRoomsType = [];
  available?.data?.rooms.map((room) => {
    room.rates.map((rate) => {
      availableRoomsType.push({
        ...rate,
        roomCode: room.code,
        roomName: room.name,
      });
    });
  });
  const quantityField = [
    {
      icon: <RoomIcon />,
      name: "rooms",
      label: "Jumlah Kamar",
      description: "(2-3 tamu per kamar)",
    },
    {
      icon: <PersonIcon />,
      name: "adult",
      label: "Dewasa",
      description: "(17 tahun ke atas)",
    },
    {
      icon: <PersonIcon />,
      name: "children",
      label: "Anak",
      description: "(Maksimal 17 tahun)",
    },
  ];
  const handleBookRoom = (rate) => {
    dispatch(
      checkoutData({
        hotelDetail: {
          ...rate,
          email: hotel.data.hotel.email,
          phone: hotel.data.hotel.phones[0].phoneNumber,
          hotelcode: hotel.data.hotel.code,
        },
      })
    );
    router.push("/hotels/order-details");
  };

  const QuantityForm = ({ name, fields, field }) => {
    const form = useFormikContext();
    const InnerButton = (
      <Flex gap={"10px"} w={"full"} alignItems={"center"}>
        {field.icon}
        <Text>{form.values[name]}</Text>
      </Flex>
    );

    return (
      <>
        <CustomDropdown title="Jumlah Kamar dan Tamu" innerbutton={InnerButton}>
          <Stack spacing={5} py={5}>
            {fields.map((item, index) => (
              <Flex
                key={index}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box>
                  <Text>{item.label}</Text>
                  <Text fontSize={"sm"} color="neutral.text.low">
                    {item.description}
                  </Text>
                </Box>
                <HStack spacing={5}>
                  <Button
                    disabled={form.values[item.name] === 0}
                    variant={"solid"}
                    colorScheme={"brand.blue"}
                    onClick={() =>
                      form.values[item.name] > 0 &&
                      form.setFieldValue(
                        item.name,
                        form.values[item.name] - 1,
                        false
                      )
                    }
                  >
                    -
                  </Button>
                  <Text fontWeight={"bold"}>{form.values[item.name]}</Text>
                  <Button
                    variant={"solid"}
                    colorScheme={"brand.blue"}
                    onClick={() =>
                      form.setFieldValue(
                        item.name,
                        form.values[item.name] + 1,
                        false
                      )
                    }
                  >
                    +
                  </Button>
                </HStack>
              </Flex>
            ))}
            <Box
              hidden={!form.values.children}
              py="24px"
              borderTop="1px dashed #e9e9e9"
            >
              <Text fontSize="xs" mb="24px">
                Mohon memasukan usia anak sehingga kami dapat mencarikan Anda
                kamar, ranjang dan penawaran terbaik
              </Text>
              <Stack spacing="24px">
                {[...Array(form.values.children)].map((_, index) => (
                  <HStack key={index} justifyContent="space-between">
                    <Box flexBasis="100%">
                      <Text color="neutral.text.high" fontSize="sm">
                        Usia Anak
                      </Text>
                      <Text color="neutral.text.medium" fontSize="xs">
                        (Maksimal 17 Tahun)
                      </Text>
                    </Box>
                    <CustomDropdown
                      title="Masukkan Umur Anak"
                      innerbutton={
                        <HStack w={"full"} justifyContent={"space-between"}>
                          <Text>
                            {form.values.children_ages?.[index]
                              ? `${form.values.children_ages[index]} Tahun`
                              : "Masukan Umur"}
                          </Text>
                          <ExpandArrowIcon />
                        </HStack>
                      }
                    >
                      <RadioGroup
                        onChange={(value) =>
                          form.setFieldValue(`children_ages.${index}`, value)
                        }
                        value={form.values.children_ages?.[index]}
                      >
                        <Stack spacing={6}>
                          {[...Array(17)].map((_, index) => (
                            <Radio
                              key={index}
                              flexDirection={"row-reverse"}
                              colorScheme={"brand.blue"}
                              justifyContent={"space-between"}
                              value={(index + 1).toString()}
                            >
                              {index + 1} Tahun
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </CustomDropdown>
                  </HStack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </CustomDropdown>
      </>
    );
  };

  const SubmitButton = () => {
    const formik = useFormikContext();
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        onClick={formik.submitForm}
      >
        Temukan Kamar
      </CustomOrangeFullWidthButton>
    );
  };
  const ShowAllPhotos = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const drawerRef = useRef();
    return (
      <>
        <Button
          onClick={onOpen}
          rounded={"none"}
          roundedTopLeft={"lg"}
          variant={"solid"}
          p={"8px"}
          fontSize={{ base: "xs", md: "sm" }}
          colorScheme={"blackAlpha"}
        >
          Semua Foto
        </Button>
        <CustomFilterButton
          drawer={drawerRef}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          notrounded
          title={"Semua Foto"}
          hidefooter
        >
          <Box py={"24px"}>
            <Heading fontSize={"2xl"}>
              {hotel.data?.hotel?.name?.content || ""}
            </Heading>
            <Text fontSize={"xs"}>
              {`${
                hotel.data?.hotel?.address?.street
              },${hotel.data?.hotel?.zone?.name.toLowerCase()} ${
                hotel.data?.hotel?.postalCode
              }` || ""}
            </Text>
          </Box>
          <CustomDivider />
          <Box py={"24px"}>
            {hotel.data?.hotel?.images ? (
              <>
                <Heading fontSize={"md"}>Semua Foto Hotel</Heading>
                <Text fontSize={"xs"}>
                  {`${hotel.data.hotel?.images.length} Foto Tersedia`}{" "}
                </Text>
                <SimpleGrid pb={"24px"} gap={"12px"} columns={[1]}>
                  {hotel.data?.hotel?.images?.map((item, index) => (
                    <Image
                      objectFit={"contain"}
                      alt={item}
                      key={index}
                      src={`${urlImg}/original/${item?.path}`}
                      width={360}
                      height={240}
                    />
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <Heading fontSize={"md"}>Tidak Ada Foto Hotel</Heading>
            )}
          </Box>
        </CustomFilterButton>
      </>
    );
  };
  return (
    <Layout
      type={"nested"}
      pagetitle={hotel.data?.hotel?.name?.content || "Detail Hotel"}
      isHotels
    >
      <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
        <Stack
          // columns={1}
          position={"relative"}
        >
          <Box
            mx={"-24px"}
            id={"hotel-details-banner"}
            as={"section"}
            position={"relative"}
          >
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
              }}
              autoHeight={true}
              // navigation={true}
              spaceBetween={0}
              slidesPerView={1}
            >
              {!hotel.isLoading && hotel?.data?.hotel?.images ? (
                hotel?.data?.hotel?.images?.map((item, index) => {
                  if (item.type.code === "GEN") {
                    return (
                      <SwiperSlide key={index}>
                        <Box
                          position={"relative"}
                          shadow={"lg"}
                          height={"200px"}
                          overflow={"hidden"}
                        >
                          <Image
                            objectPosition={"center"}
                            objectFit="cover"
                            src={`${urlImg}/original/${item?.path}`}
                            alt={
                              item.type?.description?.content ??
                              "Image description"
                            }
                            layout={"fill"}
                          />
                        </Box>
                      </SwiperSlide>
                    );
                  }
                })
              ) : (
                <Skeleton isLoaded={!hotel.isLoading} p={4}>
                  <Box
                    position={"relative"}
                    shadow={"lg"}
                    height={"200px"}
                    overflow={"hidden"}
                  />
                </Skeleton>
              )}
            </Swiper>
            <HStack
              zIndex={1}
              p={"16px"}
              position={"absolute"}
              top={0}
              right={0}
            >
              <WishlistButton
                data={{ ...hotel.data, price: availableRoomsType?.[0]?.net }}
                type="hotel"
                slug={id}
              />
              <ShareButton
                url={window.location.href}
                text={hotel.data?.hotel?.name?.content}
              />
            </HStack>
            <HStack zIndex={1} position={"absolute"} bottom={0} right={0}>
              <Skeleton isLoaded={!hotel.isLoading}>
                <ShowAllPhotos />
              </Skeleton>
            </HStack>
          </Box>
          <Box id="hotel-details" as={"section"}>
            <Stack
              py={"16px"}
              mx={"auto"}
              maxW={{ lg: "container.lg", xl: "container.xl" }}
            >
              <Stack pb={"10px"}>
                <Skeleton isLoaded={!hotel.isLoading}>
                  <Heading fontSize={"2xl"} color={"neutral.text.high"}>
                    {hotel.data?.hotel?.name?.content ??
                      "Hotel Name Not Available"}
                  </Heading>
                </Skeleton>
                <Skeleton isLoaded={!hotel.isLoading}>
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    {`${hotel.data?.hotel?.address?.street}, ${hotel.data?.hotel?.zone?.name} ${hotel.data?.hotel?.postalCode}` ||
                      ""}
                  </Text>
                </Skeleton>
                <Flex gap={"3px"} pt={"8px"}>
                  {Array.from({
                    length: parseInt(
                      hotel.data?.hotel?.category?.code.split("")[0]
                    ),
                  }).map((item, index) => (
                    <StarIcon key={index} />
                  ))}
                </Flex>
              </Stack>
            </Stack>
            <CustomDivider />
            {/* <Text
            fontSize="sm"
            dangerouslySetInnerHTML={{
              __html: hotel?.data?.description,
            }}
          /> */}
          </Box>
          <Box
            id="hotel-facilities"
            as={"section"}
            mx="auto"
            py={"24px"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
          >
            <Heading fontSize="md" color="brand.blue.400">
              Fasilitas Utama
            </Heading>
            <SimpleGrid columns={[4, 5, 6]} rowGap={"24px"} py={"24px"}>
              {listFacilities.map((item, index) => {
                if (item.checked) {
                  return (
                    <Stack
                      key={index}
                      justifyItems={"center"}
                      alignItems={"center"}
                    >
                      <Image
                        width={"24px"}
                        height={"24px"}
                        alt={item.label}
                        src={"/svg/icons/hotel/" + item.value + ".svg"}
                      />
                      <HStack>
                        <Text fontSize={{ base: "xs", md: "sm" }}>
                          {item.label ?? item.value ?? ""}
                        </Text>
                      </HStack>
                    </Stack>
                  );
                }
              })}
            </SimpleGrid>
            {/* <Center pb={"24px"}>
              <Button
                color={"brand.blue.400"}
                colorScheme={"brand.blue"}
                fontWeight={"normal"}
                variant={"unstyled"}
                display={"flex"}
                alignItems={"center"}
                // onClick={}
                rightIcon={<ChevronFilledDown />}
              >
                Lihat Semua
              </Button>
            </Center> */}
            <CustomDivider />
          </Box>
          <Box as="section" id="hotel-description">
            <Accordion allowMultiple mx={"-24px"} px={"12px"}>
              <AccordionItem border={0} pb={"20px"}>
                <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                  <AccordionButton>
                    <Box flex="1" fontWeight={"bold"} textAlign="left">
                      Fasilitas Lengkap
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Heading>
                <AccordionPanel py={"16px"}>
                  <Stack gap="12px">
                    <Flex gap={"10px"} alignItems="flex-start">
                      <ShoppingIcon />
                      <Box>
                        <Text
                          color="neutral.text.medium"
                          fontWeight={"bold"}
                          as="h4"
                        >
                          Tipe
                        </Text>
                        <UnorderedList>
                          <ListItem>
                            {
                              hotel.data?.hotel?.accommodationType
                                ?.typeDescription
                            }
                          </ListItem>
                        </UnorderedList>
                      </Box>
                    </Flex>
                    <Flex gap={"10px"} alignItems="flex-start">
                      <FurnitureIcon />
                      <Box>
                        <Text
                          color="neutral.text.medium"
                          fontWeight={"bold"}
                          as="h4"
                        >
                          Fasilitas Ruangan (Standar)
                        </Text>
                        <UnorderedList>
                          {hotel.data?.hotel?.facilities?.map((item, index) => {
                            if (item.facilityGroupCode === 60) {
                              return (
                                <ListItem key={index}>
                                  {item.description.content}
                                </ListItem>
                              );
                            }
                          })}
                        </UnorderedList>
                      </Box>
                    </Flex>
                    <Flex gap={"10px"} alignItems="flex-start">
                      <FactoryIcon />
                      <Box>
                        <Text
                          color="neutral.text.medium"
                          fontWeight={"bold"}
                          as="h4"
                        >
                          Fasilitas Umum
                        </Text>
                        <UnorderedList>
                          {hotel.data?.hotel?.facilities?.map((item, index) => {
                            if (item.facilityGroupCode === 70) {
                              return (
                                <ListItem key={index}>
                                  {item.description.content}
                                </ListItem>
                              );
                            }
                          })}
                        </UnorderedList>
                      </Box>
                    </Flex>
                    <Flex gap={"10px"} alignItems="flex-start">
                      <CateringIcon />
                      <Box>
                        <Text
                          color="neutral.text.medium"
                          fontWeight={"bold"}
                          as="h4"
                        >
                          Catering
                        </Text>
                        <UnorderedList>
                          {hotel.data?.hotel?.facilities?.map((item, index) => {
                            if (item.facilityGroupCode === 71) {
                              return (
                                <ListItem key={index}>
                                  {item.description.content}
                                </ListItem>
                              );
                            }
                          })}
                        </UnorderedList>
                      </Box>
                    </Flex>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border={0} pb={"20px"}>
                <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                  <AccordionButton>
                    <Box flex="1" fontWeight={"bold"} textAlign="left">
                      Lokasi dan Peta
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Heading>
                <AccordionPanel py={"16px"}>
                  <Stack gap="12px">
                    <Flex gap={"10px"} alignItems="flex-start">
                      <MapIcon />
                      <Box>
                        <Text fontSize={"sm"} color="neutral.text.medium">
                          {`${hotel.data?.hotel?.address?.street},${
                            hotel.data?.hotel?.zone?.name
                          }, ${hotel.data?.hotel?.country?.description?.content.toLowerCase()} ${
                            hotel.data?.hotel?.postalCode
                          }`}
                        </Text>
                      </Box>
                    </Flex>
                    <Link
                      fontSize={"sm"}
                      fontWeight="bold"
                      isExternal
                      textAlign={"right"}
                      color="brand.blue.300"
                      href={`https://www.google.com/maps/search/?api=1&query=${
                        hotel.data?.hotel?.address?.street
                      },${
                        hotel.data?.hotel?.zone?.name
                      }, ${hotel.data?.hotel?.country?.description?.content.toLowerCase()} ${
                        hotel.data?.hotel?.postalCode
                      }`}
                      target="_blank"
                    >
                      Tampilkan Peta di Google Maps
                    </Link>
                    <Divider variant={"dashed"} />
                    <Stack>
                      <Text
                        color="neutral.text.medium"
                        fontWeight={"bold"}
                        as="h4"
                      >
                        Area Sekitar
                      </Text>
                      <TableContainer>
                        <Table mx={"-15px"} variant="unstyled" size={"sm"}>
                          <Tbody>
                            {hotel.data?.hotel?.interestPoints?.map(
                              (item, index) => (
                                <Tr key={index}>
                                  <Td>{item.poiName}</Td>
                                  <Td textAlign={"right"} isNumeric>
                                    {parseInt(item.distance) / 1000} km
                                  </Td>
                                </Tr>
                              )
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border={0} pb={"20px"}>
                <Heading fontWeight={"bold"} color={"brand.blue.400"} as={"h2"}>
                  <AccordionButton>
                    <Box flex="1" fontWeight={"bold"} textAlign="left">
                      Tentang
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Heading>
                <AccordionPanel pt={"16px"}>
                  <Box
                    as="div"
                    dangerouslySetInnerHTML={{
                      __html: `${hotel.data?.hotel?.description?.content}`,
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <CustomDivider />
          </Box>
          <Box as="section" py="24px" id="hotel-rooms">
            <Heading fontSize={"md"} color="brand.blue.400">
              Pilihan Kamar
            </Heading>
            <Formik
              innerRef={formRef}
              initialValues={form}
              onSubmit={handleSubmit}
              // validationSchema={() =>
              //   Yup.object().shape({
              //     places: Yup.string().required("Lokasi wajib diisi"),
              //     checkin_date: Yup.string().required("Check In wajib diisi"),
              //     checkout_date: Yup.string().required("Check Out wajib diisi"),
              //     rooms: Yup.string().required("Jumlah Kamar wajib diisi"),
              //     room_type: Yup.string().required("Tipe Kamar wajib diisi"),
              //   })
              // }
            >
              <Form>
                <HStack gap="12px" py="24px">
                  <Field name="checkin_date">
                    {({ field, form }) => (
                      <FormControl
                        {...field}
                        isRequired
                        isInvalid={
                          form.errors.checkin_date && form.touched.checkin_date
                        }
                      >
                        <FormLabel fontSize={"sm"} color="neutral.text.medium">
                          Check In
                        </FormLabel>
                        <FormRangeDate
                          range={["checkin_date", "checkout_date"]}
                          name={"checkin_date"}
                          titles={["Check In", "Check Out"]}
                        />
                        <FormErrorMessage>
                          {form.errors.checkin_date}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="checkout_date">
                    {({ field, form }) => (
                      <FormControl
                        {...field}
                        isRequired
                        isInvalid={
                          form.errors.checkout_date &&
                          form.touched.checkout_date
                        }
                      >
                        <FormLabel fontSize={"sm"} color="neutral.text.medium">
                          Check Out
                        </FormLabel>
                        <FormRangeDate
                          range={["checkin_date", "checkout_date"]}
                          name={"checkout_date"}
                          titles={["Check In", "Check Out"]}
                        />
                        <FormErrorMessage>
                          {form.errors.checkout_date}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <Stack
                  columns={1}
                  // columns={{ base: 1, md: responsive ? 1 : 3 }}
                  spacing={"16px"}
                >
                  <Grid gap={"12px"} templateColumns={"repeat(2,1fr)"}>
                    {quantityField.map((f, i) => (
                      <GridItem key={i} colSpan={f.name === "rooms" ? 2 : 1}>
                        <FormControl isRequired={f.name === "rooms"}>
                          <FormLabel
                            fontSize={{ base: "sm", md: "md" }}
                            color={"neutral.text.medium"}
                          >
                            {f.label}
                          </FormLabel>
                          <QuantityForm
                            field={f}
                            name={f.name}
                            fields={quantityField}
                          />
                        </FormControl>
                      </GridItem>
                    ))}
                  </Grid>
                </Stack>
                <SubmitButton />
              </Form>
            </Formik>
            {available.isLoading ? (
              <>
                <SimpleGrid
                  columnGap={"12px"}
                  className="hotel-room-list"
                  //padding top
                  pt={"24px"}
                  columns={[1, 2, 3]}
                >
                  {Array(3)
                    .fill(0)
                    .map((_, index) => {
                      return (
                        <Box key={index}>
                          <Skeleton height="200px" />
                        </Box>
                      );
                    })}
                </SimpleGrid>
              </>
            ) : availableRoomsType.length > 0 && !available.isLoading ? (
              <>
                <SimpleGrid
                  columnGap={"12px"}
                  className="hotel-room-list"
                  //padding top
                  pt={"24px"}
                  columns={[1, 2, 3]}
                >
                  {availableRoomsType
                    ?.slice(0, showMore)
                    ?.map((rate, index) => {
                      return (
                        <Box key={index}>
                          <Swiper
                            modules={[Pagination, Navigation]}
                            pagination={{
                              clickable: true,
                            }}
                            autoHeight={true}
                            // navigation={true}
                            spaceBetween={12}
                            slidesPerView={1}
                          >
                            {hotel.data?.hotel?.images?.map((image, index) => {
                              if (image.roomCode == rate.roomCode) {
                                return (
                                  <SwiperSlide key={index}>
                                    <Box
                                      rounded="2xl"
                                      position={"relative"}
                                      height={"150px"}
                                      overflow={"hidden"}
                                    >
                                      <Image
                                        objectPosition={"center"}
                                        objectFit="cover"
                                        src={`${urlImg}/original/${image.path}`}
                                        alt={"Image description"}
                                        layout={"fill"}
                                      />
                                    </Box>
                                  </SwiperSlide>
                                );
                              }
                              //jika tidak ada sama sekali gambar untuk roomCode yang sama dengan rate.roomCode maka tampilkan gambar default 4 gambar yang tidak ada roomCode
                              if (
                                index ==
                                hotel.data?.hotel?.images?.length - 1
                              ) {
                                return (
                                  <SwiperSlide key={index}>
                                    <Box
                                      rounded="2xl"
                                      position={"relative"}
                                      height={"150px"}
                                      overflow={"hidden"}
                                    >
                                      <Image
                                        objectPosition={"center"}
                                        objectFit="cover"
                                        //random image from image hotel
                                        src={`${urlImg}/original/${hotel.data?.hotel?.images?.[0]?.path}`}
                                        alt={"Image description"}
                                        layout={"fill"}
                                      />
                                    </Box>
                                  </SwiperSlide>
                                );
                              }
                            })}
                            {hotel.data?.hotel?.images?.length == 0 && (
                              <SwiperSlide key={index}>
                                <Box
                                  rounded="2xl"
                                  position={"relative"}
                                  height={"150px"}
                                  overflow={"hidden"}
                                >
                                  <Image
                                    objectPosition={"center"}
                                    objectFit="cover"
                                    src={
                                      "https://dummyimage.com/350x150.gif?text=Gambar%20tidak%20tersedia"
                                    }
                                    alt={"Image description"}
                                    layout={"fill"}
                                  />
                                </Box>
                              </SwiperSlide>
                            )}
                          </Swiper>
                          <Box
                            my="16px"
                            overflow={"hidden"}
                            bg="neutral.color.bg.secondary"
                            rounded="xl"
                            p={"24px"}
                            maxH={"300px"}
                          >
                            <Text
                              fontWeight="bold"
                              color="neutral.text.high"
                              as="h3"
                              fontSize="md"
                            >
                              {rate.roomName.toUpperCase()}
                            </Text>
                            <Box py="12px">
                              <CustomTagsOutlineIcon icon={<UserIcon />}>
                                {query?.adult || "1"} Orang
                              </CustomTagsOutlineIcon>
                              <CustomTagsOutlineIcon icon={<BedIcon />}>
                                {capitalizeFirstLetter(
                                  rate.roomName.split(" ")[0].toLowerCase()
                                )}{" "}
                                Bed
                              </CustomTagsOutlineIcon>
                              {rate.boardCode === "BB" && (
                                <CustomTagsOutlineIcon icon={<CutleryIcon />}>
                                  Sarapan
                                </CustomTagsOutlineIcon>
                              )}
                            </Box>
                            {rate?.cancellationPolicies?.[0]?.from &&
                              (moment(
                                rate?.cancellationPolicies?.[0]?.from
                              ).isAfter(moment().format("YYYY-MM-DD")) ? (
                                <Alert
                                  p={0}
                                  gap={"4px"}
                                  status="error"
                                  variant="unstyled"
                                  fontSize={"xs"}
                                  color="brand.orange.400"
                                  // py="3px"
                                >
                                  <AlertIcon />
                                  Bebas Biaya Pembatalan Sebelum{" "}
                                  {new Date(
                                    rate?.cancellationPolicies?.[0]?.from
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </Alert>
                              ) : (
                                <Alert
                                  p={0}
                                  gap={"4px"}
                                  status="error"
                                  variant="unstyled"
                                  fontSize={"xs"}
                                  color="brand.orange.400"
                                  py="5px"
                                >
                                  {" "}
                                </Alert>
                              ))}
                            <Flex alignItems={"flex-end"} gap={"5px"}>
                              <Stack gap={"4px"} pt="35px">
                                {rate.isDiscount ? (
                                  <Flex alignItems={"center"} gap="4px">
                                    <CustomTags variant={"danger"}>
                                      Discount
                                    </CustomTags>
                                    <Text
                                      textDecoration={"line-through"}
                                      color="neutral.text.low"
                                      fontSize={"xs"}
                                    >
                                      {typeof rate.beforeDiscount !== "number"
                                        ? `IDR ${convertRupiah(
                                            rate.beforeDiscount.split(".")[0]
                                          )}`
                                        : `IDR ${convertRupiah(
                                            rate.beforeDiscount
                                          )}`}
                                    </Text>
                                  </Flex>
                                ) : (
                                  <></>
                                )}
                                <Text
                                  whiteSpace={"nowrap"}
                                  fontWeight={"semibold"}
                                  fontSize="md"
                                  color={"brand.orange.400"}
                                >
                                  {typeof rate.net !== "number"
                                    ? `IDR ${convertRupiah(
                                        rate.net.split(".")[0]
                                      )}`
                                    : `IDR ${convertRupiah(rate.net)}`}{" "}
                                  <chakra.span
                                    fontWeight={"normal"}
                                    textColor={"neutral.text.low"}
                                    fontSize={"xs"}
                                  >
                                    Untuk {differenceDate} malam
                                  </chakra.span>
                                </Text>
                              </Stack>
                              <CustomOrangeFullWidthButton
                                fontSize="sm"
                                fontWeight="normal"
                                px={"12px"}
                                py={"7px"}
                                onClick={() =>
                                  loginToast(() => handleBookRoom(rate))
                                }
                              >
                                Pesan
                              </CustomOrangeFullWidthButton>
                            </Flex>
                          </Box>
                        </Box>
                      );
                    })}
                </SimpleGrid>
                {showMore < availableRoomsType?.length ? (
                  <Center>
                    <Button
                      color={"brand.blue.400"}
                      colorScheme={"brand.blue"}
                      fontWeight={"normal"}
                      variant={"unstyled"}
                      display={"flex"}
                      alignItems={"center"}
                      onClick={handleShow}
                      rightIcon={<ChevronFilledDown />}
                    >
                      Lihat Semua
                    </Button>
                  </Center>
                ) : (
                  <Center>
                    <Button
                      color={"brand.blue.400"}
                      colorScheme={"brand.blue"}
                      fontWeight={"normal"}
                      variant={"unstyled"}
                      display={"flex"}
                      alignItems={"center"}
                      onClick={handleClose}
                      rightIcon={
                        <Box style={{ rotate: "180deg" }}>
                          <ChevronFilledDown />
                        </Box>
                      }
                    >
                      Tutup
                    </Button>
                  </Center>
                )}
              </>
            ) : (
              <Center h="10vh">
                <Text color="neutral.text.high" fontSize="md">
                  Tidak ada kamar yang tersedia
                </Text>
              </Center>
            )}
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.params;
  const details = await getHotelDetail(id.split("-").pop());
  return {
    props: {
      data: null,
      meta: {
        title: details?.data?.hotel?.name?.content || "Hotel Detail",
        description: details?.data?.hotel?.description?.content || "",
      },
    },
  };
};

export default HotelDetail;
