import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormikContext } from "formik";
import Head from "next/head";
import React, { useRef } from "react";
import { CustomOrangeFullWidthButton } from "../src/components/button";
import Layout from "../src/components/layout";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import GlobalForm, { SelectForm } from "../src/components/person";
import { CustomDivider } from "../src/components/divider";
import Image from "next/image";
import { data } from "autoprefixer";
import date from "../src/helpers/date";
import axios from "axios";
const Contact = (props) => {
  const { period_month, period_year, meta } = props;
  const toast = useToast();
  const mutation = useMutation(
    async (value) => {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.post(`${BASE_URL}/corporate-incentives`, {
          data: {
            ...value,
            participants: {
              adults: value.adults,
              children: value.children,
            },
            name: `${value.title} ${value.first_name} ${value.last_name}`,
          },
        });
        return Promise.resolve(response);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    },
    {
      onSuccess: () => {
        toast({
          title: "Terima kasih",
          description: "Masukkan anda telah kami terima",
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "subtle",
        });
      },
      onError: () =>
        toast({
          title: "Error",
          description: "Sepertinya ada masalah dengan server. Coba lagi",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "subtle",
        }),
    }
  );
  async function handleSubmit(val, action) {
    await mutation.mutateAsync(val);
    action.resetForm();
    action.setSubmitting(false);
  }

  const guestInfoFields = [
    {
      name: "title",
      label: "Title",
      type: "radio",
      options: ["Mr", "Mrs", "Ms"],
      required: true,
    },
    [
      {
        name: "first_name",
        label: "Nama Depan",
        type: "text",
        required: true,
      },
      {
        name: "last_name",
        label: "Nama Belakang",
        type: "text",
        required: true,
      },
    ],
    {
      name: "company",
      label: "Nama Perusahaan (bila ada)",
      placeholder: "Isi Nama Perusahaan",
      type: "text",
    },
    {
      name: "companyPhone",
      label: "Nomor Telepon Perusahaan (bila ada)",
      placeholder: "Isi Nomor Telepon Perusahaan",
      type: "tel",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      label: "Nomor Telepon",
      type: "tel",
      required: true,
    },
  ];
  const tripInfoFields = [
    {
      name: "destination",
      label: "Ke mana Anda Ingin Pergi",
      placeholder: "Negara / Destinasi",
      setField: "countryName",
      type: "select",
    },
    {
      name: "period",
      type: "date",
      label: "Periode Keberangkatan",
    },
    {
      label: "Lama Perjalanan",
      name: "duration",
      type: "counter",
    },
    [
      {
        name: "adults",
        label: " Dewasa",
        placeholder: " Dewasa",
        type: "counter",
        rightIcon: (
          <Image
            alt="Person"
            width={24}
            height={24}
            src={"/svg/flights/person.svg"}
          />
        ),
      },
      {
        name: "children",
        placeholder: " Anak",
        label: " Anak",
        type: "counter",
        rightIcon: (
          <Image
            alt="Person"
            width={24}
            height={24}
            src={"/svg/flights/person.svg"}
          />
        ),
      },
    ],
    {
      label: "Catatan Lainnya",
      name: "notes",
      type: "textarea",
    },
  ];

  const formRef = useRef();

  const SubmitButton = () => {
    const form = useFormikContext();
    return (
      <CustomOrangeFullWidthButton type="submit" isLoading={form.isSubmitting}>
        Kirim
      </CustomOrangeFullWidthButton>
    );
  };
  return (
    <>
      <Head>
        <script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          async
          defer
        />
      </Head>
      <Layout type="nested" pagetitle={"Corporate Incentive"} meta={meta}>
        <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <Box as={"section"}>
            <Stack spacing={"12px"}>
              <Formik
                innerRef={formRef}
                onSubmit={handleSubmit}
                initialValues={{
                  adults: 0,
                  children: 0,
                  notes: "",
                  first_name: "",
                  last_name: "",
                  company: "",
                  phone: "",
                  companyPhone: "",
                  email: "",
                  contactedWith: "",
                  destination: "",
                  title: "",
                  period: "",
                  duration: 0,
                }}
                validationSchema={Yup.object().shape({
                  adults: Yup.number().min(1, "Mohon isi minimal 1").required(),
                  children: Yup.number().notRequired(),
                  title: Yup.string().required("Mohon isi gelar"),
                  contactedWith: Yup.string().required("Tidak boleh kosong"),
                  destination: Yup.string().required("Mohon isi Destinasi"),
                  period: Yup.string().required(
                    "Mohon isi Periode Keberangkatan"
                  ),
                  duration: Yup.number()
                    .min(1, "Mohon isi Durasi")
                    .required("Mohon isi Durasi"),
                  first_name: Yup.string().required("Mohon isi Nama Depan"),
                  last_name: Yup.string().notRequired(),
                  company: Yup.string().notRequired(),
                  email: Yup.string()
                    .email("Mohon isi email dengan benar")
                    .required("Mohon isi email"),
                  phone: Yup.number()
                    .min(10, "Minimal 10 angka")
                    .typeError("Mohon isi nomor telepon hanya dengan angka")
                    .required("Mohon isi nomor telepon"),
                  companyPhone: Yup.number()
                    .min(10, "Minimal 10 angka")
                    .typeError("Mohon isi nomor telepon hanya dengan angka")
                    .notRequired("Mohon isi nomor telepon"),
                  notes: Yup.string()
                    .max(500, "Maksimal 500 karakter")
                    .required("Mohon isi pesan"),
                })}
              >
                <Form>
                  {/* <Stack spacing="12px">
                    <Grid
                      templateColumns={{ md: "repeat(12,1fr)" }}
                      gap={"12px"}
                    >
                      <GridItem colSpan={6}>
                        <Field name={"name"}>
                          {({ field, form }) => (
                            <FormControl
                              isRequired
                              isInvalid={form.errors.name && form.touched.name}
                            >
                              <FormLabel fontSize={"sm"}>Nama</FormLabel>
                              <Input
                                colorScheme={"brand.blue"}
                                size={"sm"}
                                {...field}
                              />
                              <FormErrorMessage fontSize={"sm"}>
                                {form.errors.name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </GridItem>
                      <GridItem colSpan={6}>
                        <Field name={"company"}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.company && form.touched.company
                              }
                            >
                              <FormLabel fontSize={"sm"}>
                                Nama Perusahaan
                              </FormLabel>
                              <Input
                                colorScheme={"brand.blue"}
                                size={"sm"}
                                {...field}
                              />
                              <FormErrorMessage fontSize={"sm"}>
                                {form.errors.company}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </GridItem>
                    </Grid>
                    <Stack py={"12px"}>
                      <Heading size={"md"}>Contact Info</Heading>
                      <SimpleGrid gap={"12px"} columns={[1, 2]}>
                        <Field name={"phone"}>
                          {({ field, form }) => (
                            <FormControl
                              isRequired
                              isInvalid={
                                form.errors.phone && form.touched.phone
                              }
                            >
                              <FormLabel fontSize={"sm"}>
                                Nomor telepon
                              </FormLabel>
                              <Input
                                colorScheme={"brand.blue"}
                                size={"sm"}
                                {...field}
                                type={"tel"}
                              />
                              <FormErrorMessage fontSize={"sm"}>
                                {form.errors.phone}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name={"companyPhone"}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.companyPhone &&
                                form.touched.companyPhone
                              }
                            >
                              <FormLabel fontSize={"sm"}>
                                Nomor Telepon Kantor
                              </FormLabel>
                              <Input
                                colorScheme={"brand.blue"}
                                size={"sm"}
                                {...field}
                                type={"tel"}
                              />
                              <FormErrorMessage fontSize={"sm"}>
                                {form.errors.companyPhone}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>
                      <Field name={"email"}>
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={form.errors.email && form.touched.email}
                          >
                            <FormLabel fontSize={"sm"}>Email</FormLabel>
                            <Input
                              colorScheme={"brand.blue"}
                              size={"sm"}
                              {...field}
                              type={"email"}
                            />
                            <FormErrorMessage fontSize={"sm"}>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name={"notes"}>
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={form.errors.notes && form.touched.notes}
                          >
                            <FormLabel fontSize={"sm"}>Catatan</FormLabel>
                            <Textarea
                              fontSize={"sm"}
                              {...field}
                              maxLength={500}
                              rows={4}
                            />
                            <FormErrorMessage fontSize={"sm"}>
                              {form.errors.notes}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Stack>
                    <Field name={"recaptcha"}>
                      {({ field, form }) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            form.errors.recaptcha && form.touched.recaptcha
                          }
                        >
                          <Input
                            colorScheme={"brand.blue"}
                            size={"sm"}
                            type="hidden"
                            {...field}
                          />
                          <ReCAPTCHA
                            sitekey="6LdLCysiAAAAAI4x1mt4Xr5Dkd8pRpyC7Cyl034q"
                            onChange={(response) => {
                              form.setFieldValue("recaptcha", response);
                            }}
                            asyncScriptOnLoad={() => {
                              console.log("done loading!");
                            }}
                          />
                          <FormErrorMessage>
                            {form.errors.recaptcha}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <SubmitButton />
                  </Stack> */}
                  <Stack py={"24px"}>
                    <Heading pb={"24px"} fontSize={"md"}>
                      Informasi Tamu
                    </Heading>
                    <GlobalForm fields={guestInfoFields} />
                  </Stack>
                  <CustomDivider />
                  <Stack py={"24px"}>
                    <Heading pb={"24px"} fontSize={"md"}>
                      Bagaimana Kami Dapat Menghubungi Anda?
                    </Heading>
                    <Field name="contactedWith">
                      {({ field, form }) => (
                        <>
                          <FormControl
                            isRequired
                            isInvalid={
                              form.errors.contactedWith &&
                              form.touched.contactedWith
                            }
                          >
                            <RadioGroup colorScheme="brand.blue">
                              <Stack spacing="12px">
                                {[
                                  {
                                    label: "Whatsapp",
                                    value: "whatsapp",
                                  },
                                  {
                                    label: "Email",
                                    value: "email",
                                  },
                                ].map((item) => (
                                  <Radio
                                    justifyContent={"space-between"}
                                    flexDir={"row-reverse"}
                                    {...field}
                                    key={item.value}
                                    value={item.value}
                                    size="sm"
                                  >
                                    {item.label}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                            <FormErrorMessage>
                              {form.errors.contactedWith}
                            </FormErrorMessage>
                          </FormControl>
                        </>
                      )}
                    </Field>
                  </Stack>
                  <CustomDivider />
                  <Stack py={"24px"}>
                    <Heading pb={"24px"} fontSize={"md"}>
                      Informasi Perjalanan
                    </Heading>
                    <GlobalForm fields={tripInfoFields} />
                  </Stack>
                  <Box pb={"24px"}>
                    <SubmitButton />
                  </Box>
                </Form>
              </Formik>
            </Stack>
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export const getStaticProps = async (ctx) => {
  const period_month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var min = new Date().getFullYear();
  var max = min + 2;
  var years = [];

  const meta = {
    title: "Corporate Incentive",
  };

  for (var i = min; i <= max; i++) {
    years.push(i);
  }
  return {
    props: { period_month, period_year: years, meta },
  };
};

export default Contact;
