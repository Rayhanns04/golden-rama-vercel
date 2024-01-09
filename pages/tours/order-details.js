/* eslint-disable react-hooks/rules-of-hooks */
import {
  Badge,
  Box,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
  Grid,
  GridItem,
  Divider,
  Portal,
  PortalManager,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import Layout from "../../src/components/layout";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import CheckoutDetail from "../../src/components/checkout-detail";
import { useDispatch, useSelector } from "react-redux";
import {
  bookingTour,
  getTourBySlugWithIteneraryV2,
} from "../../src/services/tour.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CustomTags } from "../../src/components/tags";
import { TourDetails } from "../../src/components/card";
import {
  addDays,
  checkIsPromoAvailable,
  convertRupiah,
  createArrayPassanger,
  mappingDetailPrice,
  mappingRooms,
  stringSplit,
  totalPriceTour,
} from "../../src/helpers";
import { paymentData } from "../../src/state/tour/tour.slice";
import { useRouter } from "next/router";
import { checkPromo } from "../../src/services/promo.service";
import { useSteps } from "chakra-ui-steps";

const OrderDetails = () => {
  const [isError, setIsError] = useState(false);
  const steps = useSteps({
    initialStep: 0,
  });
  function handleNextStep() {
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const router = useRouter();
  const dispatch = useDispatch();
  const { tourDetail } = useSelector((state) => state.tourReducer);
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);
  const mappingTraveler = {
    adult: tourDetail?.participants?.adults,
    child: tourDetail?.participants?.children,
  };
  const [traveler, setTraveler] = useState(
    createArrayPassanger(mappingTraveler)
  );
  const [form, setForm] = useState({});
  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });
  const [price, setPrice] = useState({});
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
  let slug = {
    tourSlug: tourDetail.slug,
    departureId: tourDetail.departure_date,
  };
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  const { data, isLoading } = useQuery(["getTourDetail"], async () => {
    const result = await getTourBySlugWithIteneraryV2(slug);
    const rooms = mappingRooms(mappingTraveler, result.departure.prices);
    const priceTotal = totalPriceTour(mappingTraveler, result.departure.prices);
    setForm({
      ...form,
      transaction: {
        subTotal: priceTotal.total,
        total: priceTotal.total,
        discount: priceTotal.totalDiscount,
        downPayment: priceTotal.totalDownPayment,
        serviceFee: priceTotal.serviceFee,
      },
      tours: {
        tourId: result.id,
        departureId: tourDetail.departure_date,
        isDp: true,
        isIncludeVisa: false,
        name: result.name,
        slug: result.slug,
        departure: {
          id: result.departure.id,
          code: result.departure.code,
          date: result.departure.date,
          duration: result.departure.duration,
        },
        rooms: rooms,
        groups: result.groups,
        airlines: result.departure.airlines,
        price: result.departure.price,
      },
    });
    setPrice(result.departure.prices);
    return Promise.resolve(result);
  });

  const detail_prices = !isLoading
    ? mappingDetailPrice(
        mappingTraveler,
        price,
        isPromoAvailable?.totalDiscount
      )
    : [];
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
    let payload = {
      ...form,
      traveler: traveler,
      customer: customer,
    };
    mutation.mutate(payload);
  };

  const mutation = useMutation(
    async (form) => {
      const response = await bookingTour(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        dispatch(paymentData({ transaction: response }));
        router.push({ pathname: "/tours/payment" });
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
            description: "Silahkan cek kembali data diri penumpang!",
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

  const handlePromo = (promoCode) => {
    const priceTotal = totalPriceTour(mappingTraveler, price);
    const payload = {
      promo: promoCode,
      totalPrice: priceTotal.total,
      category: "tour",
      product: tourDetail.departure_date,
    };
    mutationPromo.mutate(payload);
  };

  const mutationPromo = useMutation(
    async (data) => {
      const response = await checkPromo(data, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        const priceTotal = totalPriceTour(mappingTraveler, price);
        setIsPromoAvailable({
          available: true,
          totalDiscount: response.promo_detail.discount_amount,
        });
        setForm({
          ...form,
          transaction: {
            subTotal: priceTotal.total,
            total: priceTotal.total - response.promo_detail.discount_amount,
            discount: priceTotal.totalDiscount,
            downPayment: priceTotal.totalDownPayment,
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
      },
    }
  );

  const isSpesificPromo = checkIsPromoAvailable(tourDetail.slug);
  const TourPrice = (props) => {
    return (
      <Box
        {...props}
        position={{ base: "sticky", md: "static" }}
        w={"full"}
        bg={"white"}
        bottom={0}
        p={"24px"}
        borderTopWidth={1}
        borderTopStyle={"dashed"}
        borderTopColor={"neutral.color.line.secondary"}
      >
        {/* <Divider mb={2} variant={"dashed"} /> */}
        <HStack justifyContent="space-between" spacing={12} alignItems="center">
          <Stack flexShrink={0}>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="brand.orange.400"
              w="full"
            >
              DP IDR {convertRupiah(form?.transaction?.downPayment)}
            </Text>
            <Text fontSize={"sm"}>
              Total IDR {convertRupiah(form.transaction?.total)}
            </Text>
          </Stack>
          <CustomOrangeFullWidthButton
            onClick={() => {
              steps.activeStep !== 1 ? handleNextStep() : handleSubmit();
            }}
          >
            Lanjutkan
          </CustomOrangeFullWidthButton>
        </HStack>
      </Box>
    );
  };
  return (
    <Layout
      type={"nested"}
      position={"relative"}
      pagetitle={"Detail Pemesanan"}
    >
      {!isLoading ? (
        <Box as={"section"} px={{ md: "24px" }} mx={"-24px"}>
          <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
            <TourDetails
              data={data}
              hidden={!isDesktop || steps.activeStep === 1}
            />
            <Grid
              templateColumns={{ md: "repeat(3,1fr)" }}
              py={"24px"}
              columnGap={"calc(20px + 24px)"}
            >
              <GridItem colSpan={{ md: 2 }}>
                <CheckoutDetail
                  category={"tour"}
                  steps={steps}
                  totalDownPayment={form?.transaction?.downPayment}
                  detail_prices={detail_prices}
                  people={traveler}
                  customer={customer}
                  handleChange={handleChange}
                  handleTraveler={handleTraveler}
                  handlePromo={handlePromo}
                  isPromoAvailable={isPromoAvailable}
                  isSpesificPromo={isSpesificPromo}
                  isLackField={isError}
                />
              </GridItem>
              <TourPrice hidden={!isDesktop} />
              <GridItem position={"relative"}>
                <Stack position={"sticky"} top={24} spacing="12px">
                  <TourDetails data={data} hidden={isDesktop} />
                  <TourPrice hidden={isDesktop} />
                </Stack>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      ) : (
        <Spinner></Spinner>
      )}
    </Layout>
  );
};

export default OrderDetails;
