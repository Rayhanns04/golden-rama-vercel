import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import React from "react";
import { CustomOrangeFullWidthButton } from "../src/components/button";
import Layout from "../src/components/layout";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { sendFeedback } from "../src/services/feedback.service";
const Contact = (props) => {
  const toast = useToast();
  const router = useRouter();
  const mutation = useMutation(sendFeedback, {
    onSuccess: () => {
      toast({
        title: "Terima kasih",
        description: "Masukkan anda telah kami terima",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "subtle",
      });
      router.push("/");
    },
    onError: (error) => {
      toast({
        title: "Terima kasih",
        description: "Masukkan anda telah kami terima",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "subtle",
      });
      router.push("/");
    },
  });

  function handleSubmit(values, action) {
    mutation.mutate(values);
    action.resetForm();
  }

  return (
    <>
      <Head>
        <script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          async
          defer
        />
      </Head>
      <Layout pagetitle={"Saran dan Masukan"} meta={props.meta}>
        <Box
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          py={"24px"}
        >
          <Box as={"section"} py={"24px"}>
            <Stack spacing={"12px"}>
              <Heading fontSize={"2xl"}>Send us content</Heading>
              <Text fontSize={"md"}>Beri Kami Masukan dan Saran</Text>
              <Formik
                onSubmit={handleSubmit}
                initialValues={{
                  title: "mr",
                  name: "",
                  email: "",
                  phoneNumber: "",
                  feedback: "",
                  recaptcha: "",
                }}
                validationSchema={Yup.object().shape({
                  title: Yup.string().required("Mohon isi title"),
                  name: Yup.string().required("Mohon isi nama"),
                  email: Yup.string()
                    .email("Mohon isi email dengan benar")
                    .required("Mohon isi email"),
                  phoneNumber: Yup.number()
                    .min(10, "Minimal 10 angka")
                    .typeError("Mohon isi nomor telepon hanya dengan angka")
                    .required("Mohon isi nomor telepon"),
                  feedback: Yup.string()
                    .max(500, "Maksimal 500 karakter")
                    .required("Mohon isi pesan"),
                  recaptcha: Yup.string()
                    .required(
                      "Mohon isi reCaptcha, jika tidak muncul mohon refresh browser anda"
                    )
                    .nullable(),
                })}
              >
                {(formik) => (
                  <Form>
                    <Stack spacing="12px">
                      <Grid
                        templateColumns={{ md: "repeat(12,1fr)" }}
                        gap={"12px"}
                      >
                        <GridItem colSpan={{ base: 12, md: 2 }}>
                          <Field name="title">
                            {({ field, form }) => (
                              <FormControl
                                isRequired
                                isInvalid={
                                  formik.errors.title && formik.touched.title
                                }
                              >
                                <FormLabel fontSize={"sm"}>Title</FormLabel>
                                <Select
                                  {...field}
                                  size={"sm"}
                                  placeholder="Pilih title"
                                >
                                  {props.title.map((item, index) => (
                                    <option value={item.value} key={index}>
                                      {item.label}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage fontSize={"sm"}>
                                  {formik.errors.title}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 10 }}>
                          <Field name={"name"}>
                            {({ field, form }) => (
                              <FormControl
                                isRequired
                                isInvalid={
                                  formik.errors.name && formik.touched.name
                                }
                              >
                                <FormLabel fontSize={"sm"}>Nama</FormLabel>
                                <Input
                                  colorScheme={"brand.blue"}
                                  size={"sm"}
                                  {...field}
                                />
                                <FormErrorMessage fontSize={"sm"}>
                                  {formik.errors.name}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </GridItem>
                      </Grid>
                      <Field name={"email"}>
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={
                              formik.errors.email && formik.touched.email
                            }
                          >
                            <FormLabel fontSize={"sm"}>Email</FormLabel>
                            <Input
                              colorScheme={"brand.blue"}
                              size={"sm"}
                              {...field}
                              type={"email"}
                            />
                            <FormErrorMessage fontSize={"sm"}>
                              {formik.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name={"phoneNumber"}>
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={
                              formik.errors.phoneNumber &&
                              formik.touched.phoneNumber
                            }
                          >
                            <FormLabel fontSize={"sm"}>Nomor Kontak</FormLabel>
                            <Input
                              colorScheme={"brand.blue"}
                              size={"sm"}
                              {...field}
                              type={"tel"}
                            />
                            <FormErrorMessage fontSize={"sm"}>
                              {formik.errors.phoneNumber}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name={"feedback"}>
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={
                              formik.errors.feedback && formik.touched.feedback
                            }
                          >
                            <FormLabel fontSize={"sm"}>Saran Anda</FormLabel>
                            <Textarea
                              fontSize={"sm"}
                              {...field}
                              maxLength={500}
                              rows={4}
                            />
                            <FormErrorMessage fontSize={"sm"}>
                              {formik.errors.feedback}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name={"recaptcha"}>
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={
                              formik.errors.recaptcha &&
                              formik.touched.recaptcha
                            }
                          >
                            <Input
                              colorScheme={"brand.blue"}
                              size={"sm"}
                              type="hidden"
                              {...field}
                            />
                            <ReCAPTCHA
                              sitekey={
                                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                              }
                              onChange={(response) => {
                                formik.setFieldValue("recaptcha", response);
                              }}
                              asyncScriptOnLoad={() => {
                                console.log("done loading!");
                              }}
                            />
                            <FormErrorMessage>
                              {formik.errors.recaptcha}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <CustomOrangeFullWidthButton
                        onClick={formik.handleSubmit}
                        type="submit"
                        isLoading={mutation.isLoading}
                      >
                        Kirim
                      </CustomOrangeFullWidthButton>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export const getStaticProps = async (ctx) => {
  const title = [
    { label: "Mr.", value: "mr" },
    { label: "Mrs.", value: "mrs" },
    { label: "Ms.", value: "ms" },
    { label: "Mstr.", value: "mstr" },
    { label: "Miss.", value: "miss" },
  ];

  return {
    props: {
      title,
      meta: {
        title: "Saran dan Masukan",
      },
    },
  };
};

export default Contact;
