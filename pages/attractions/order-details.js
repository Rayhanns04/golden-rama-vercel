import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useSteps } from "chakra-ui-steps";
import { Field, Form, Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { AttractionsDetails } from "../../src/components/card";
import CheckoutDetail from "../../src/components/checkout-detail";
import { CustomDropdown } from "../../src/components/dropdown";
import Layout from "../../src/components/layout";
import {
  attractionDynamicFormMapper,
  createArrayPassanger,
  mappingDetailPriceAttraction,
} from "../../src/helpers";
import * as Yup from "yup";
import _ from "underscore";
import { convertToRupiah } from "../../src/helpers/delimeterRupiah";
import { bookingAttraction } from "../../src/services/attraction.service";
import { checkPromo } from "../../src/services/promo.service";
import { paymentData } from "../../src/state/attraction/attraction.slice";
import GlobalForm from "../../src/components/person";
import { isAfter, isBefore } from "date-fns";
import { DynamicPerBookingFormik } from "../../src/components/form";

const OrderDetails = () => {
  const [isError, setIsError] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { attractionDetail } = useSelector((state) => state.attractionReducer);
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);
  const { serviceFee } = attractionDetail.ticketDetail;
  const { totalPrice } = attractionDetail;
  const additionalServiceFee = serviceFee.isFixed
    ? serviceFee.value
    : (parseInt(totalPrice) * serviceFee.value) / 100;
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
  const finalPrice =
    parseInt(totalPrice) + parseInt(additionalServiceFee.toFixed());
  const { productTypes, departure_date } = attractionDetail;
  const perBooking = productTypes?.options?.perBooking;
  const perPax = productTypes?.options?.perPax;

  const [dynamicPerBookingForm, setDynamicForm] = useState(
    attractionDynamicFormMapper(
      perBooking.filter(({ validFrom, validTo }) => {
        if (validFrom && validTo) {
          return;
          isAfter(new Date(departure_date), new Date(validFrom)) &&
            isBefore(new Date(departure_date), new Date(validTo));
        } else return true;
      })
    )
  );

  const [dynamicPerPaxForm, setDynamicPerPaxForm] = useState(
    attractionDynamicFormMapper(
      perPax.filter(({ validFrom, validTo }) => {
        if (validFrom && validTo) {
          return;
          isAfter(new Date(departure_date), new Date(validFrom)) &&
            isBefore(new Date(departure_date), new Date(validTo));
        } else return true;
      })
    )
  );

  // const dynamicPerBookingFormik = useFormik({
  //   initialValues: dynamicPerBookingForm.reduce((prev, val) => {
  //     return { ...prev, [val.name]: "" };
  //   }, {}),
  //   onSubmit: (values) => {
  //     console.log(values);
  //   },
  //   validationSchema: Yup.object(
  //     dynamicPerBookingForm.reduce((prev, val) => {
  //       return {
  //         ...prev,
  //         [val.name]: Yup.string().when([], {
  //           is: val.required,
  //           then: Yup.string().required(`${val.label} Harap Diisi`),
  //           otherwise: Yup.string().notRequired(),
  //         }),
  //       };
  //     }, {})
  //   ),
  // });

  const perBookingRef = useRef();

  const steps = useSteps({
    initialStep: 0,
  });
  function handleNextStep() {
    steps.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const [form, setForm] = useState({
    transaction: {
      subTotal: finalPrice,
      total: finalPrice,
      discount: 0,
      downPayment: 0,
    },
    attraction: {
      messege: "",
      productTypeUuid: attractionDetail.ticketId,
      timeSlotUuid:
        attractionDetail.ticketDetail.timeslots.length > 0
          ? attractionDetail.ticketDetail.timeslots[0].uuid
          : null,
      arrivalDate: attractionDetail.departure_date,
      partnerReference: "",
      adults: attractionDetail.participants.adults ?? 0,
      children: attractionDetail.participants.children ?? 0,
      seniors: attractionDetail.participants.seniors ?? 0,
    },
    productTypes: productTypes?.options,
  });

  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });

  const mappingTraveler = {
    adult: parseInt(attractionDetail?.participants?.adults),
    child: parseInt(attractionDetail?.participants?.children),
  };
  const [traveler, setTraveler] = useState(
    perPax.length !== 0 ? createArrayPassanger(mappingTraveler) : []
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

  const toast = useToast();
  const handleSubmit = () => {
    try {
      let mapObjectPerPax;
      const arrayDummyTraveler = ["i", "key", "paxType"];
      const mapObjectPerBooking = [];
      if (dynamicPerBookingForm.length !== 0) {
        mapObjectPerBooking = _.values(
          _.mapObject(perBookingRef.current.values, (value, key) => {
            if (Array.isArray(value)) {
              return value.map((item) => {
                return { uuid: key, value: item };
              });
            } else return { uuid: key, value: value };
          })
        );
        mapObjectPerBooking.forEach((item, index) => {
          if (Array.isArray(item)) {
            item.forEach((item) => {
              mapObjectPerBooking.push(item);
            });
            mapObjectPerBooking.splice(index, 1);
          }
        });
      }
      if (traveler) {
        mapObjectPerPax = traveler.map((item) => {
          const mapping = _.values(
            _.mapObject(item, (value, key) => {
              if (Array.isArray(value)) {
                return value.map((item) => {
                  return { uuid: key, value: item };
                });
              } else if (!arrayDummyTraveler.some((item) => item == key)) {
                return { uuid: key, value: value };
              }
            })
          );
          mapping.forEach((item, index) => {
            if (Array.isArray(item)) {
              item.forEach((item) => {
                mapping.push(item);
              });
              mapping.splice(index, 1);
            }
          });
          return _.compact(mapping);
        });
      }

      const toastFailedConfig = {
        position: "top",
        title: "Harap isi informasi kontak!",
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "subtle",
      };
      if (!customer?.fullName || !customer?.email || !customer?.phone) {
        return toast(toastFailedConfig);
      }
      //mapping traveler
      const options = {
        ...(mapObjectPerBooking.length !== 0
          ? {
              perBooking: mapObjectPerBooking,
            }
          : { perBooking: [] }),
        ...(traveler
          ? {
              perPax: mapObjectPerPax,
            }
          : {
              perPax: [],
            }),
      };

      let payload = {
        ...form,
        traveler: traveler,
        customer: customer,
        attraction: {
          ...form.attraction,
          options: options,
        },
      };
      if (dynamicPerBookingForm.length !== 0) {
        perBookingRef.current.submitForm().then(() => {
          return perBookingRef.current.isValid
            ? mutation.mutate(payload)
            : toast(toastFailedConfig);
        });
      } else return mutation.mutate(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const mutation = useMutation(
    async (form) => {
      const response = await bookingAttraction(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        dispatch(paymentData({ transaction: response }));
        router.push({ pathname: "/attractions/payment" });
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
      totalPrice: finalPrice,
      category: "attraction",
      product: attractionDetail.ticketId,
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
            subTotal: finalPrice,
            total: finalPrice - response.promo_detail.discount_amount,
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

  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  const detailPrices = mappingDetailPriceAttraction(
    attractionDetail.participants,
    attractionDetail.ticketDetail,
    attractionDetail.productTypes,
    isPromoAvailable?.totalDiscount
  );

  const AttractionPrice = (props) => {
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
            <Text fontSize={"sm"}>Harga yang anda bayar</Text>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="brand.orange.400"
              w="full"
            >
              IDR {convertToRupiah(parseInt(form.transaction.total))}
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
    <Layout type="nested" position="relative" pagetitle={"Detail Pemesanan"}>
      <Box as={"section"} px={{ md: "24px" }} mx={"-24px"}>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <AttractionsDetails
            data={attractionDetail.attraction}
            attractionDetail={attractionDetail}
            hidden={!isDesktop}
          />
          <Grid
            templateColumns={{ md: "repeat(3,1fr)" }}
            py={"24px"}
            columnGap={"calc(20px + 24px)"}
          >
            <GridItem colSpan={{ md: 2 }}>
              <CheckoutDetail
                category={"attraction"}
                steps={steps}
                attractionDetail={attractionDetail}
                dynamicPerPaxForm={dynamicPerPaxForm}
                dynamicForm={dynamicPerBookingForm}
                dynamicFormik={
                  <DynamicPerBookingFormik
                    innerRef={perBookingRef}
                    form={dynamicPerBookingForm}
                  />
                }
                handlePromo={handlePromo}
                people={traveler}
                handleTraveler={handleTraveler}
                handleChange={handleChange}
                detail_prices={detailPrices}
                isPromoAvailable={isPromoAvailable}
                isDomestic={true}
                isLackField={isError}
              />
            </GridItem>
            <AttractionPrice hidden={!isDesktop} />
            <GridItem position={"relative"}>
              <Stack position={"sticky"} top={24} spacing="12px">
                <AttractionsDetails
                  data={attractionDetail.attraction}
                  attractionDetail={attractionDetail}
                  hidden={isDesktop}
                />
                <AttractionPrice hidden={isDesktop} />
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      data: null,
      title: {
        name: "Detail Pemesanan",
      },
    },
  };
};
export default OrderDetails;
