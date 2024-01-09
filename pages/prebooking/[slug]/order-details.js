import {
  Box,
  Grid,
  GridItem,
  HStack,
  Stack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useSteps } from "chakra-ui-steps";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomOrangeFullWidthButton } from "../../../src/components/button";
import { PrebookingDetails } from "../../../src/components/card";
import CheckoutDetail from "../../../src/components/checkout-detail";
import Layout from "../../../src/components/layout";
import { createArrayPassanger } from "../../../src/helpers";
import { postPrebooking } from "../../../src/services/prebooking.service";

const OrderDetails = () => {
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );
  const { data, query, isDomestic } = useSelector(
    (state) => state.orderReducer
  );
  const router = useRouter();
  const { prebookingDetail } = useSelector((state) => state.prebookingReducer);
  const { isLoggedIn, user } = useSelector((s) => s.authReducer);
  const steps = useSteps({ initialStep: 1 });
  const toast = useToast();
  function handleNextStep() {
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const mappingTraveler = {
    adult: parseInt(prebookingDetail.flights[0].adult),
    child: parseInt(prebookingDetail.flights[0].child),
    infant: parseInt(prebookingDetail.flights[0].infant),
  };
  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });
  const [traveler, setTraveler] = useState(
    createArrayPassanger(mappingTraveler)
  );
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
    )
      return toast({
        position: "top",
        title: "Harap isi informasi kontak!",
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "subtle",
      });
    let payload = {
      ...form,
      traveler: traveler,
      customer: customer,
    };
    mutation.mutate(payload);
  };
  const [form, setForm] = useState({
    journeys: { ...prebookingDetail },
    prebook: prebookingDetail.prebook,
  });
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
  const mutation = useMutation(
    async (form) => {
      try {
        console.log("🚀 ~ file: order-details.js:97 ~ form", form);
        const response = await postPrebooking(form);
        return Promise.resolve(response);
        // return Promise.reject(response);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    },
    {
      onSuccess: (response) => {
        router.push({
          pathname: "/prebooking/order-success",
          query: { orderNumber: response.orderNumber },
        });
      },
      onError: () => {
        toast({
          title: `Booking anda gagal, cek kembali data diri penumpang!`,
          status: "error",
          isClosable: true,
          variant: "subtle",
        });
      },
    }
  );
  const PrebookingPrice = (props) => (
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
            {form.transaction.total.toLocaleString("id-ID", {
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
  return (
    <Layout type={"nested"} pagetitle={"Detail Pemesanan"} hideBottomBar>
      <Box as={"section"} px={{ md: "24px" }} mx={"-24px"}>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          {/* Prebooking Details */}
          <PrebookingDetails
            flights={prebookingDetail.flights}
            hidden={isDesktop}
          />
          <Grid
            templateColumns={{ md: "repeat(3,1fr)" }}
            py={"24px"}
            columnGap={"calc(20px + 24px)"}
          >
            <GridItem colSpan={{ md: 2 }}>
              <CheckoutDetail
                category={"prebooking"}
                steps={steps}
                isDomestic={isDomestic}
                // handlePromo={handlePromo}
                people={traveler}
                customer={customer}
                handleTraveler={handleTraveler}
                handleChange={handleChange}
                // detail_prices={detailPrices}
                // isPromoAvailable={isPromoAvailable}
              />
            </GridItem>
            {/* Prebooking Price */}
            <PrebookingPrice hidden={isDesktop} />
            <GridItem position={"relative"}>
              <Stack position={"sticky"} top={24} spacing="12px">
                {/* Prebooking Details */}
                <Box rounded={"lg"}>
                  <PrebookingDetails
                    flights={prebookingDetail.flights}
                    hidden={!isDesktop}
                  />
                </Box>
                {/* Prebooking Price */}
                <PrebookingPrice hidden={!isDesktop} />
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
