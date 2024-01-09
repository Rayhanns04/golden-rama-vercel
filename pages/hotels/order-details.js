import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Stack,
  Tag,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useSteps, Steps, Step } from "chakra-ui-steps";
import Layout from "../../src/components/layout";
import ListDetail from "../../src/components/list-detail";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomTags } from "../../src/components/tags";
import DateIcon from "../../public/svg/icons/date.svg";
import UserMultipleIcon from "../../public/svg/icons/user-multiple.svg";
import AirlineIcon from "../../public/svg/icons/airline-outline.svg";
import { paymentData } from "../../src/state/hotel/hotel.slice";
import { checkPromo } from "../../src/services/promo.service";
import { checkRate, bookingHotel } from "../../src/services/hotel.service";
import { convertRupiah, createArrayPassanger } from "../../src/helpers";
import date from "../../src/helpers/date";
import { differenceInDays } from "date-fns";

const OrderDetails = () => {
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const steps = useSteps({
    initialStep: 0,
  });
  const dispatch = useDispatch();
  const toast = useToast();
  const handleNextStep = () => {
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [form, setForm] = useState({});
  const { hotelDetail } = useSelector((state) => state.hotelReducer);
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);

  const [traveler, setTraveler] = useState(
    createArrayPassanger({ adult: 0, child: 0 })
  );
  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });
  const [title, setTitle] = useState();
  const [requests, setRequests] = useState([]);
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
  const handleBack = () => {
    //detect if router back is available
    if (router.back()) {
      return router.back();
    }
    //if not, close the modal
    return window.close();
  };
  const { data, isLoading } = useQuery(
    ["checkRate", hotelDetail],
    async () => {
      try {
        const response = await checkRate(hotelDetail?.rateKey);
        if (!response.hotel) {
          toast({
            title: "Error",
            description:
              "Produk yang anda pilih tidak tersedia / sudah habis. Silahkan pilih produk lainnya.",
            status: "error",
            duration: 10000,
            isClosable: true,
          });
          handleBack();
        }
        const serviceFee = response?.hotel.serviceFee;
        const subtotal = response?.hotel.subTotal;
        const total = response?.hotel.totalNet;
        const differentDate = differenceInDays(
          new Date(response.hotel.checkOut),
          new Date(response.hotel.checkIn)
        );
        setForm({
          ...form,
          differentDate,
          transaction: {
            subtotal:
              typeof subtotal === "string"
                ? parseInt(response?.hotel.subTotal.split(".")[0])
                : subtotal,
            total:
              typeof total === "string"
                ? parseInt(response.hotel.totalNet.split(".")[0])
                : total,
            discount: 0,
            serviceFee:
              typeof serviceFee === "string"
                ? parseInt(total - subtotal)
                : serviceFee,
          },
        });
        setTraveler(
          createArrayPassanger({
            adult: response?.hotel.rooms[0].rates[0].adults,
            child: response?.hotel.rooms[0].rates[0].children,
          })
        );
        return response;
      } catch (error) {
        toast({
          title: "Error",
          description:
            "Produk yang anda pilih tidak tersedia / sudah habis. Silahkan pilih produk lainnya.",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
        handleBack();
      }
    },
    {
      enabled: !!hotelDetail,
    }
  );
  const rates = data?.hotel.rooms[0].rates[0];
  const handleTraveler = (item) => {
    setTitle(item.title);
    if (traveler.some((i) => i.key === item.key)) {
      const index = traveler.findIndex((e) => e.key === item.key);
      const currentTraveler = [...traveler];
      currentTraveler[index] = item;
      setTraveler(currentTraveler);
    } else {
      setTraveler([...traveler, item]);
    }
  };

  const handleChange = (e, type) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    if (type == "customer") {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const handlePromo = (promoCode) => {
    const payload = {
      promo: promoCode,
      totalPrice: form?.transaction.subtotal,
      category: "hotel",
      room: hotelDetail.roomCode,
      hotel: hotelDetail.hotelcode.toString(),
    };
    mutationPromo.mutate(payload);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      traveler,
      customer,
      remark: requests.join(", "),
      hotel: {
        rateKey: hotelDetail?.rateKey,
        roomId: data?.hotel.rooms[0].rates[0].rooms,
      },
      phone: hotelDetail?.phone,
      title: title,
    };
    mutateBooking(payload);
  };

  const { mutate: mutateBooking, isLoading: isLoadingBooking } = useMutation(
    async (data) => {
      const response = await bookingHotel(data, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (data) => {
        dispatch(paymentData({ transaction: data }));
        router.push("/hotels/payment");
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
            description: "Silahkan cek kembali data anda",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        }
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
        });
        setForm({
          ...form,
          transaction: {
            subtotal: form.transaction.subtotal,
            total:
              form.transaction.subtotal -
              response.promo_detail.discount_amount +
              form.transaction.serviceFee,
            serviceFee: form.transaction.serviceFee,
            discount: form.transaction.discount,
            promoCode: response.promo_detail.promoCode,
            discountPromo: response.promo_detail.discount_amount,
            unique_code: response?.unique_code || null,
          },
        });
      },
      onError: (error) => {
        setIsPromoAvailable({
          available: false,
          totalDiscount: 0,
          error: error?.response?.data?.error,
        });
        setForm({
          ...form,
          transaction: {
            subtotal: form.transaction.subtotal,
            total: form.transaction.subtotal + form.transaction.serviceFee,
            serviceFee: form.transaction.serviceFee,
            discountPromo: 0,
            promoCode: "",
          },
        });
      },
    }
  );

  const list = [
    [
      {
        title: "Promo",
        details: [
          { handlePromo: handlePromo, category: "hotel", isPromoAvailable },
        ],
      },
      {
        title: "Rincian Biaya",
        tag: "Harga dalam Rupiah",
        details: [
          [
            {
              label: `Kamar ${
                rates?.rooms > 1 ? "(" + rates?.rooms + "x)" : ""
              }`,
              value: convertRupiah(form?.transaction?.subtotal),
            },
            // form?.transaction?.serviceFee && {
            //   label: "Service Fee",
            //   value: convertRupiah(form?.transaction?.serviceFee),
            // },
            { label: "Pajak dan Layanan", value: "Sudah Termasuk" },
          ],
          [
            form?.transaction?.discountPromo && {
              label: "Diskon (KODE PROMO)",
              value: `-${convertRupiah(form?.transaction?.discountPromo)}`,
              bold: ["label", "value"],
              green: ["value"],
            },
            {
              label: "Harga yang Anda Bayar",
              value: convertRupiah(form?.transaction?.total),
              bold: ["label", "value"],
            },
          ],
        ],
      },
    ],
    [
      {
        details: [
          {
            handleChange: handleChange,
            customer: customer,
          },
          {
            handleTraveler: handleTraveler,
            people: traveler,
            customer: customer,
          },
          {
            requestsState: [requests, setRequests],
          },
        ],
      },
    ],
  ];

  const card = isLoading
    ? {}
    : {
        upper_title: data?.hotel.name,
        upper_details: [
          {
            type: "mail",
            text: hotelDetail?.email,
          },
          {
            type: "phone",
            text: hotelDetail?.phone,
          },
        ],
        lower_title: data?.hotel.name,
        lower_details: [
          {
            type: "date",
            text: date(new Date(data?.hotel?.checkIn)),
            tag: "Check In",
          },
          {
            type: "date",
            text: date(new Date(data?.hotel?.checkOut)),
            tag: "Check Out",
          },
        ],
      };

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const LowerSection = () => (
    <HStack
      justifyContent="space-between"
      py="16px"
      spacing={12}
      alignItems="center"
    >
      <Stack flexShrink={0} spacing={0}>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color="brand.orange.400"
          w="full"
        >
          IDR {convertRupiah(form?.transaction?.total)}
        </Text>
        <Text fontSize={"sm"}>Untuk {form.differentDate} malam</Text>
      </Stack>
      <CustomOrangeFullWidthButton
        isLoading={isLoadingBooking}
        onClick={() => {
          steps.activeStep !== 1 ? handleNextStep() : handleSubmit();
        }}
      >
        Lanjutkan
      </CustomOrangeFullWidthButton>
    </HStack>
  );
  return (
    <Layout type="nested" position="relative" pagetitle={"Detail Pemesanan"}>
      <Grid
        templateColumns={{ md: "repeat(3,1fr)" }}
        columnGap="calc(20px + 24px)"
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx="auto"
        py={{ md: "24px" }}
      >
        <GridItem colSpan={{ md: 2 }} order={isLargerThan768 ? -1 : 1}>
          <Steps
            orientation="horizontal"
            responsive={false}
            id={"checkout-detail"}
            activeStep={steps.activeStep}
          >
            {list.map((item, index) => (
              <Step key={index}>
                <ListDetail details={item} isLackField={isError} />
              </Step>
            ))}
          </Steps>
        </GridItem>
        <GridItem>
          <Box
            position={{ base: "static", md: "sticky" }}
            top={24}
            spacing="16px"
          >
            <Box
              bg="brand.blue.100"
              mx={{ base: "-24px", md: 0 }}
              px="24px"
              py="24px"
              borderRadius={{ md: "12px" }}
            >
              <Card card={card} />
            </Box>
            {isLargerThan768 && <LowerSection />}
          </Box>
        </GridItem>
      </Grid>
      <Box
        hidden={isLargerThan768}
        position="sticky"
        bottom={0}
        bg="white"
        borderTop="1px solid #e9e9e9"
      >
        <LowerSection />
      </Box>
    </Layout>
  );
};

const Card = ({ card }) => {
  return (
    <Box bg="white" borderRadius="12px" px="16px" py="14px">
      <Stack pb="16px" borderBottom="1px dashed #f1f1f1">
        <HStack spacing="8px">
          {card?.upper_tags?.map((tag) => (
            <CustomTags
              key={tag}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              fontSize="xs"
            >
              {tag}
            </CustomTags>
          ))}
        </HStack>
        <Text flexShrink={0} color="neutral.text.high" fontWeight="bold">
          {card?.upper_title}
        </Text>
        {/* {card?.upper_details?.map((detail, index) => (
          <HStack key={index} spacing="6px">
            {detail.type === "date" ? (
              <DateIcon />
            ) : detail.type === "people" ? (
              <UserMultipleIcon />
            ) : detail.type === "mail" ? (
              <MailIcon />
            ) : detail.type === "phone" ? (
              <PhoneIcon />
            ) : (
              <AirlineIcon />
            )}
            {detail.tag && (
              <Tag
                color="brand.orange.500"
                bg="brand.orange.100"
                size="sm"
                fontSize="xs"
              >
                {detail.tag}
              </Tag>
            )}
            <Text fontSize="xs">{detail.text}</Text>
          </HStack>
        ))} */}
        {/* <Text fontSize="xs">{card?.upper_subtitle}</Text> */}
      </Stack>
      {/* <Stack pt="16px" spacing="16px"> */}
      {/* <HStack spacing="8px">
          {card?.lower_tags?.map((tag) => (
            <CustomTags
              key={tag}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              fontSize="xs"
            >
              {tag}
            </CustomTags>
          ))}
        </HStack> */}
      {/* <Text flexShrink={0} color="neutral.text.high" fontWeight="bold">
          {card?.lower_title}
        </Text> */}
      {card?.lower_details?.map((detail, index) => (
        <HStack key={index} spacing="6px" mt="1em">
          {detail.type === "date" ? (
            <DateIcon />
          ) : detail.type === "people" ? (
            <UserMultipleIcon />
          ) : (
            <AirlineIcon />
          )}
          {detail.tag && (
            <Tag
              color="brand.orange.500"
              bg="brand.orange.100"
              size="sm"
              fontSize="xs"
            >
              {detail.tag}
            </Tag>
          )}
          <Text fontSize="xs">{detail.text}</Text>
        </HStack>
      ))}
      <Text fontSize="xs">{card?.lower_subtitle}</Text>
      {/* </Stack> */}
    </Box>
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
