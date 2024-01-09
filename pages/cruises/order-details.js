import {
  Box,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useSteps } from "chakra-ui-steps";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CruiseDetails } from "../../src/components/card";
import CheckoutDetail from "../../src/components/checkout-detail";
import Layout from "../../src/components/layout";
import { convertRupiah, createArrayPassanger } from "../../src/helpers";
import { bookingCruise } from "../../src/services/cruise.service";
import { checkPromo } from "../../src/services/promo.service";

const OrderDetails = () => {
  const router = useRouter();
  const { cruiseDetail } = useSelector((state) => state.cruiseReducer);
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);

  const [isError, setIsError] = useState(false);
  const steps = useSteps({
    initialStep: 1,
  });
  const toast = useToast();
  function handleNextStep() {
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const mappingTraveler = {
    adult: parseInt(cruiseDetail?.participants?.adults),
    child: parseInt(cruiseDetail?.participants?.children),
  };
  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });
  const [traveler, setTraveler] = useState(
    createArrayPassanger(mappingTraveler)
  );
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
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
  const handleChange = (e, type) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    if (type == "customer") {
      setCustomer({ ...customer, [name]: value });
    }
  };
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
    let payload = {
      ...form,
      traveler: traveler,
      customer: customer,
    };
    mutation.mutate(payload);
  };
  const totalPrice = 0;
  // cruiseDetail.cabin.value * cruiseDetail.participants.adults +
  // cruiseDetail.cabin.value * cruiseDetail.participants.children;
  const [form, setForm] = useState({
    transaction: {
      total: totalPrice,
      subTotal: totalPrice,
      discount: 0,
    },
    cruise: { ...cruiseDetail },
  });
  const mutation = useMutation(
    async (form) => {
      try {
        const response = await bookingCruise(form, jwt);
        return Promise.resolve(response);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    },
    {
      onSuccess: (response) => {
        router.push({
          pathname: "/cruises/order-success",
          query: { orderNumber: response.orderNumber },
        });
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
    const payload = {
      promo: promoCode,
      totalPrice: cruiseDetail.totalPrice,
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
        setIsPromoAvailable({
          available: true,
          totalDiscount: response.promo_detail.discount_amount,
        });
        setForm({
          ...form,
          transaction: {
            subTotal: cruiseDetail.totalPrice,
            total:
              cruiseDetail.totalPrice - response.promo_detail.discount_amount,
            discount: 0,
            downPayment: 0,
            promoCode: response.promo_detail.promoCode,
            discountPromo: response.promo_detail.discount_amount,
            unique_code: response?.unique_code || null,
          },
        });
        return Promise.resolve({
          available: true,
          totalDiscount: response.promo_detail.discount_amount,
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
  const CruisePrice = (props) => {
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
          {/* <Stack flexShrink={0}>
            <Text fontSize={"sm"}>Harga yang anda bayar</Text>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="brand.orange.400"
              w="full"
            >
              IDR{" "}
              {parseInt(form.transaction.total).toLocaleString("id-ID", {
                maximumFractionDigits: 0,
              })}
            </Text>
          </Stack> */}
          <CustomOrangeFullWidthButton
            mt={0}
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
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );
  // const cabinDetail = {
  //   t: `${cruiseDetail.cabin.name} (${cruiseDetail.cabin.quantity}x)`,
  //   p: (
  //     parseInt(cruiseDetail.cabin.value) * cruiseDetail.cabin.quantity
  //   ).toLocaleString("id-ID", {
  //     maximumFractionDigits: 0,
  //   }),
  // };
  const detailPrices = [
    [
      // { ...cabinDetail },
      {
        t: `Cruise Tax`,
        p: "Sudah Termasuk",
      },
      {
        t: `PPN`,
        p: "Sudah Termasuk",
      },
      {
        t: "Diskon (KODE PROMO)",
        p: `${
          isPromoAvailable?.totalDiscount
            ? convertRupiah(isPromoAvailable?.totalDiscount)
            : "Tidak ada"
        }`,
        b: isPromoAvailable?.totalDiscount ? true : false,
        g: isPromoAvailable?.totalDiscount ? true : false,
        h: isPromoAvailable?.totalDiscount ? false : true,
      },
    ],
  ];
  return (
    <Layout type="nested" position="relative" pagetitle={"Detail Pemesanan"}>
      <Box as={"section"} px={{ md: "24px" }} mx={"-24px"}>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <CruiseDetails
            cruiseDetail={cruiseDetail}
            data={cruiseDetail.cruise}
            hidden={isDesktop}
          />
          <Grid
            templateColumns={{ md: "repeat(3,1fr)" }}
            py={"24px"}
            columnGap={"calc(20px + 24px)"}
          >
            <GridItem colSpan={{ md: 2 }}>
              <CheckoutDetail
                category={"cruise"}
                steps={steps}
                handlePromo={handlePromo}
                people={traveler}
                customer={customer}
                handleTraveler={handleTraveler}
                handleChange={handleChange}
                detail_prices={detailPrices}
                isPromoAvailable={isPromoAvailable}
                isLackField={isError}
              />
            </GridItem>
            <CruisePrice hidden={isDesktop} />
            <GridItem position={"relative"}>
              <Stack position={"sticky"} top={24} spacing="12px">
                <CruiseDetails
                  cruiseDetail={cruiseDetail}
                  data={cruiseDetail.cruise}
                  hidden={!isDesktop}
                />
                <CruisePrice hidden={!isDesktop} />
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      meta: {
        title: "Detail Pemesanan",
      },
    },
  };
};

export default OrderDetails;
