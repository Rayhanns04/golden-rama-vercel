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
import { useSelector } from "react-redux";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { PackageDetails } from "../../src/components/card";
import CheckoutDetail from "../../src/components/checkout-detail";
import Layout from "../../src/components/layout";
import { createArrayPassanger } from "../../src/helpers";
import { bookingPackages } from "../../src/services/package.service";
import { checkPromo } from "../../src/services/promo.service";

const PackagesOrderDetails = () => {
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { packageDetail } = useSelector((state) => state.packageReducer);
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);
  const steps = useSteps({ initialStep: 1 });
  const toast = useToast();
  function handleNextStep() {
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const mappingTraveler = {
    adult: parseInt(packageDetail?.participants?.adults),
    child: parseInt(packageDetail?.participants?.children),
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
  // parseInt(packageDetail.packages.child) *
  //   packageDetail.participants.children +
  // parseInt(packageDetail.packages.adult) * packageDetail.participants.adults;
  const [form, setForm] = useState({
    transaction: {
      total: totalPrice,
      subTotal: totalPrice,
      discount: 0,
    },
    package: { ...packageDetail },
  });
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
  const mutation = useMutation(
    async (form) => {
      try {
        const response = await bookingPackages(form, jwt);
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
          pathname: "/packages/order-success",
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
      totalPrice: packageDetail.totalPrice,
    };
    mutationPromo.mutate(payload);
  };
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
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
            subTotal: packageDetail.totalPrice,
            total:
              packageDetail.totalPrice - response.promo_detail.discount_amount,
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
  const detailPrices = [
    [
      {
        t: `Dewasa (${packageDetail.participants.adults})`,
        p: (
          packageDetail.participants.adults *
          parseInt(packageDetail.packages.adult)
        ).toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
      },
      {
        t: `Anak-anak (${packageDetail.participants.children})`,
        p: (
          packageDetail.participants.children *
          parseInt(packageDetail.packages.child)
        ).toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
        h: packageDetail.participants.children === 0,
      },
      {
        t: "Pajak (1,1%)",
        p: "Sudah Termasuk",
      },
      {
        t: "Biaya lainnya (SWAB)",
        p: "Sudah Termasuk",
      },
    ],
    [
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
      {
        t: "Harga yang anda bayar",
        p: totalPrice.toLocaleString("id-ID", { maximumFractionDigits: 0 }),
        b: true,
      },
    ],
  ];
  const PackagePrice = (props) => (
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
    <Layout type="nested" position="relative" pagetitle={"Detail Pemesanan"}>
      <Box as={"section"} px={{ md: "24px" }} mx={"-24px"}>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <PackageDetails
            data={packageDetail.package}
            packageDetail={packageDetail}
            hidden={isDesktop}
          />
          <Grid
            templateColumns={{ md: "repeat(3,1fr)" }}
            py={"24px"}
            columnGap={"calc(20px + 24px)"}
          >
            <GridItem colSpan={{ md: 2 }}>
              <CheckoutDetail
                category={"package"}
                steps={steps}
                handlePromo={handlePromo}
                people={traveler}
                customer={customer}
                handleTraveler={handleTraveler}
                handleChange={handleChange}
                detail_prices={detailPrices}
                isDomestic={packageDetail.package?.isDomestic}
                isPromoAvailable={isPromoAvailable}
                isLackField={isError}
              />
            </GridItem>
            <PackagePrice hidden={isDesktop} />
            <GridItem position={"relative"}>
              <Stack position={"sticky"} top={24} spacing="12px">
                <PackageDetails
                  data={packageDetail.package}
                  packageDetail={packageDetail}
                  hidden={!isDesktop}
                />
                <PackagePrice hidden={!isDesktop} />
              </Stack>
            </GridItem>
          </Grid>
        </Box>
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

export default PackagesOrderDetails;
