import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSteps } from "chakra-ui-steps";
import { differenceInDays } from "date-fns";
import { Field } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { InsuranceDetails } from "../../src/components/card";
import CheckoutDetail from "../../src/components/checkout-detail";
import Layout from "../../src/components/layout";
import { SelectForm } from "../../src/components/person";
import _ from "underscore";
import { checkIsPromoAvailable, createArrayPassanger } from "../../src/helpers";
import { convertToRupiah } from "../../src/helpers/delimeterRupiah";
import {
  bookingInsurance,
  getTravelNeeds,
} from "../../src/services/insurance.service";
import countries from "/src/mocks/countries.json";
import { CustomDropdown } from "../../src/components/dropdown";
import { paymentData } from "../../src/state/insurance/insurance.slice";
import { checkPromo } from "../../src/services/promo.service";
import moment from "moment";
import { useEffect } from "react";

const InsuranceOrderDetails = (props) => {
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { insuranceDetail } = useSelector((state) => state.insuranceReducer);
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );
  const steps = useSteps({
    initialStep: 0,
  });
  const { nextStep, prevStep, setStep, reset, activeStep } = steps;
  function handleNextStep() {
    nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);

  const mappingTraveler = {
    adult: parseInt(insuranceDetail.adults) ?? 1,
    child: parseInt(insuranceDetail.children) ?? 0,
  };

  const [customers, setCustomers] = useState(
    createArrayPassanger(mappingTraveler)
  );

  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });

  const handleChange = (e, type) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    if (type == "customer") {
      setCustomer({ ...customer, [name]: value });
    }
  };
  const additionalCoverageTotal = insuranceDetail.additionalCoverage
    ? insuranceDetail.additionalCoverage.reduce((acc, obj) => {
        return acc + obj.MainRate;
      }, 0)
    : 0;
  const TravellerTypePrice =
    insuranceDetail.TravellerTypeName === "Family"
      ? insuranceDetail.MainRate
      : insuranceDetail.MainRate *
        (mappingTraveler.adult + mappingTraveler.child);
  const total_prices = TravellerTypePrice + additionalCoverageTotal;
  useEffect(() => {
    setForm({
      ...form,
      transaction: {
        ...form.transaction,
        total:
          form?.transaction.discountPromo != undefined &&
          form?.transaction.discountPromo != 0
            ? total_prices - form.transaction.discountPromo
            : total_prices,
        subTotal: TravellerTypePrice,
      },
    });
  }, [total_prices]);
  const [form, setForm] = useState({
    transaction: {
      total: total_prices,
      subTotal: TravellerTypePrice,
      discount: 0,
    },
    journeys: [
      {
        ...insuranceDetail,
        OriginID: insuranceDetail.origins,
        RegionID: insuranceDetail.RegionID,
        DestinationID: insuranceDetail.DestinationID,
        // AdditionalDestinationIDs: insuranceDetail. "",
        ProductID: insuranceDetail.ID,
        // AlreadyTravelling: insuranceDetail. "",
        // DepartureDate: insuranceDetail.travel_start_date ,
        // TravelStartDate: insuranceDetail. "2022-11-19",
        // TravelEndDate: insuranceDetail. "2022-11-20",
        NumOfPersons: (
          parseInt(insuranceDetail.adults) + parseInt(insuranceDetail.children)
        ).toString(),
        CoverageIDs: _.pluck(insuranceDetail.additionalCoverage, "ID").join(
          ","
        ),
        TravelStartDate: insuranceDetail.travel_start_date,
        TravelEndDate: insuranceDetail.travel_end_date,
      },
    ],
  });
  const detail_prices = [
    [
      {
        t: `${insuranceDetail.PlanName} (${
          differenceInDays(
            // add 1 day
            new Date(insuranceDetail.travel_end_date),
            new Date(insuranceDetail.travel_start_date)
          ) + 1
        } hari)`,
        p: parseInt(TravellerTypePrice).toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
        b: true,
      },
      ...(insuranceDetail.additionalCoverage
        ? insuranceDetail.additionalCoverage?.map((item, index) => {
            return {
              t: `${item.Name}`,
              p: convertToRupiah(parseInt(item.MainRate)),
              b: true,
            };
          })
        : []),
    ],
    [
      form?.transaction?.discountPromo != undefined &&
        form?.transaction?.discountPromo != 0 && {
          t: "Diskon (KODE PROMO)",
          p: `-${convertToRupiah(form?.transaction?.discountPromo)}`,
        },
      {
        t: `Harga yang Anda Bayar`,
        p: parseInt(form.transaction.total).toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
      },
    ],
  ];
  const handleTraveler = (item) => {
    if (customers.some((i) => i.key === item.key)) {
      const index = customers.findIndex((e) => e.key === item.key);
      const currentTraveler = [...customers];
      currentTraveler[index] = item;
      setCustomers(currentTraveler);
    } else {
      setCustomers([...customers, item]);
    }
  };

  const otherPersonFields = [
    {
      name: "relationship",
      label: "Relationship",
      type: "radio",
      options:
        insuranceDetail.TravellerTypeName === "Family"
          ? ["Spouse", "Child"]
          : ["Friend", "Family"],
    },
  ];
  const globalFields = [
    ...otherPersonFields,
    {
      name: "title",
      label: "Title",
      type: "radio",
      options: ["Mr", "Mrs", "Ms", "Mstr", "Miss"],
    },
    [
      {
        name: "first_name",
        label: "Nama Depan",
        type: "text",
      },
      {
        name: "last_name",
        label: "Nama Belakang",
        type: "text",
      },
    ],
    {
      name: "gender",
      label: "Jenis Kelamin",
      type: "radio",
      options: ["Male", "Female"],
    },
    {
      name: "birthplace",
      label: "Tempat Lahir",
      content: (
        <Field name={"birthplace"}>
          {({ field, form }) => (
            <FormControl
              isRequired
              isInvalid={form.errors[field.name] && form.touched[field.name]}
            >
              <FormLabel
                htmlFor={field.name}
                fontSize="sm"
                color="neutral.text.medium"
                textTransform="capitalize"
              >
                Pilih Tempat Lahir
              </FormLabel>
              <SelectForm
                isRequired
                isInsurance
                form={form}
                field={field}
                name={field.name}
                placeholder="Kota Asal"
                selected={field.value}
              />
              <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      ),
      placeholder: "Tempat Lahir",
    },
    {
      name: "dob",
      label: "Tanggal Lahir",
      type: "date",
    },
    {
      name: "phone",
      label: "Nomor Telepon",
      // type: "text",
      content: (
        <Field name={"phone"}>
          {({ field, form }) => (
            <FormControl
              isRequired
              isInvalid={form.errors[field.name] && form.touched[field.name]}
            >
              <FormLabel
                htmlFor={field.name}
                fontSize="sm"
                color="neutral.text.medium"
                textTransform="capitalize"
              >
                Nomor Telepon
              </FormLabel>
              <InputGroup>
                <InputLeftAddon fontSize={"sm"}>+62</InputLeftAddon>
                <Input
                  variant={"filled"}
                  {...field}
                  type="tel"
                  placeholder="phone number"
                />
              </InputGroup>
              <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      ),
    },
    {
      name: "email",
      label: "Email",
      type: "email",
    },
    {
      name: "address",
      label: "Alamat",
      type: "textarea",
    },
  ];
  const travelNeeds = useQuery(["getTravelNeeds"], async () => {
    const response = await getTravelNeeds();
    return Promise.resolve(response);
  });
  const insuredFields = [
    ...globalFields,
    {
      name: "city",
      label: "Kota",
      placeholder: "Kota",
      content: (
        <Field name={"city"}>
          {({ field, form }) => (
            <FormControl
              isRequired
              isInvalid={form.errors[field.name] && form.touched[field.name]}
            >
              <FormLabel
                htmlFor={field.name}
                fontSize="sm"
                color="neutral.text.medium"
                textTransform="capitalize"
              >
                Kota
              </FormLabel>
              <SelectForm
                isRequired
                isInsurance
                form={form}
                field={field}
                name={field.name}
                placeholder="Kota Asal"
                selected={field.value}
              />
              <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      ),
    },
    {
      name: "TravelNeedID",
      // type: "radio",
      label: "Kebutuhan Perjalanan",
      content: (
        <Field name={"TravelNeedID"} type={"radio"}>
          {({ field, form }) => (
            <FormControl
              isRequired
              isInvalid={
                form.errors["TravelNeedID"] && form.touched["TravelNeedID"]
              }
            >
              <FormLabel
                htmlFor={field.name}
                fontSize="sm"
                color="neutral.text.medium"
                textTransform="capitalize"
              >
                {"Kebutuhan Perjalanan"}
              </FormLabel>
              <CustomDropdown
                title="Pilih"
                value={form.values[field.name]}
                label={
                  travelNeeds.data.filter((prev, next) => {
                    return prev.ID.toString() === form.values[field.name];
                  })?.[0]?.Name
                }
                placeholder={"Pilih Kebutuhan Perjalanan"}
              >
                <RadioGroup
                  onChange={(next) =>
                    form.setFieldValue(field.name, next, false)
                  }
                  // {...field}
                  value={form.values[field.name]}
                >
                  <Stack spacing={5} py={5}>
                    {travelNeeds.data?.map((item, index) => (
                      <Radio
                        flexDirection={"row-reverse"}
                        colorScheme={"brand.blue"}
                        justifyContent={"space-between"}
                        key={index}
                        value={item.ID.toString()}
                      >
                        {item.Name}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </CustomDropdown>
              <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      ),
    },
  ];

  const identityFields = [
    {
      name: "passport_type",
      label: "Jenis ID",
      type: "radio",
      options: ["KTP", "Passport"],
    },
    {
      name: "passport",
      label: "Nomor ID",
      required: true,
      type: "text",
    },
    {
      name: "publisher_country",
      label: "Negara Penerbit",
      type: "select",
      placeholder: "Negara Penerbit",
      options: countries,
    },
  ];

  const dispatch = useDispatch();

  const mutation = useMutation(
    async (form) => {
      try {
        const response = await bookingInsurance(form, jwt);
        return Promise.resolve(response);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
      // return Promise.reject(response);
    },
    {
      onSuccess: (response) => {
        dispatch(paymentData({ transaction: response }));
        router.push({ pathname: "/insurances/payment" });
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
      totalPrice: total_prices,
      category: "insurance",
      product: insuranceDetail.destinations,
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
            subTotal: total_prices,
            total: total_prices - response.promo_detail.discount_amount,
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
            subTotal: TravellerTypePrice,
            total: total_prices,
            discountPromo: 0,
            promoCode: "",
          },
        });
      },
    }
  );

  const toast = useToast();

  const handleSubmit = () => {
    //validation when age > 70 only basic insurance
    customers.forEach((customer) => {
      let age = moment().diff(customer.dob, "years");
      if (age >= 70) {
        if (form.journeys[0].TravellerTypeName != "Individual") {
          return toast({
            position: "top",
            title: `Umur penumpang melebihi 70 tahun, tidak bisa memilih asuransi selain Individual!`,
            status: "error",
            duration: 9000,
            isClosable: true,
            variant: "subtle",
          });
        }
        //check if in PlanName contains basic or Executive
        if (
          !form.journeys[0].PlanName.toLowerCase().includes("basic") &&
          !form.journeys[0].PlanName.toLowerCase().includes("executive")
        ) {
          return toast({
            position: "top",
            title: `Umur penumpang melebihi 70 tahun, tidak bisa memilih asuransi selain Basic dan Executive!`,
            status: "error",
            duration: 9000,
            isClosable: true,
            variant: "subtle",
          });
        }
      }
    });
    if (
      !customer?.fullName ||
      !customer?.email ||
      !customer?.phone ||
      customers.some((item) => {
        return !item.first_name;
      })
    )
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
    let journeys = {
      ...form,
      transaction: {
        ...form.transaction,
        total: form.transaction.total,
        subTotal: total_prices,
      },
      traveler: customers,
      customer: customer,
    };
    mutation.mutate(journeys);
  };

  const Price = (props) => {
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
            <Text fontSize={"xs"}>Harga yang anda bayar</Text>
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
      type="nested"
      position="relative"
      pagetitle={
        activeStep == 0
          ? "Rencana Perjalanan"
          : activeStep == 1
          ? "Form Pemesanan"
          : ""
      }
    >
      <Box as={"section"} px={{ md: "24px" }} mx={"-24px"}>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <InsuranceDetails details={insuranceDetail} hidden={isDesktop} />
          <Grid
            templateColumns={{ md: "repeat(3,1fr)" }}
            py={"24px"}
            columnGap={"calc(20px + 24px)"}
          >
            <GridItem colSpan={{ md: 2 }}>
              <CheckoutDetail
                category={"insurance"}
                steps={steps}
                customFields={[...insuredFields, ...identityFields]}
                detail_prices={detail_prices}
                people={customers}
                customer={customer}
                handleChange={handleChange}
                handleTraveler={handleTraveler}
                handlePromo={handlePromo}
                isPromoAvailable={isPromoAvailable}
                isInsurance
                isLackField={isError}
              />
            </GridItem>
            <Price hidden={isDesktop} />
            {/* Price */}
            <GridItem position={"relative"}>
              <Stack position={"sticky"} top={24} spacing="12px">
                <InsuranceDetails
                  details={insuranceDetail}
                  hidden={!isDesktop}
                />
                <Price hidden={!isDesktop} />
                {/* <PackagePrice hidden={!isDesktop} /> */}
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

export default InsuranceOrderDetails;
