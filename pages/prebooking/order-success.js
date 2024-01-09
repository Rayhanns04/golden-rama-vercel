import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import Layout from "../../src/components/layout";
import MailIcon from "../../public/svg/icons/mail.svg";
import * as Yup from "yup";
import { PrebookingDetails } from "../../src/components/card";
import {
  getOrderDetail,
  getPrebooking,
  postResendEmail,
  resendEmail,
} from "../../src/services/prebooking.service";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomDivider } from "../../src/components/divider";
import date from "../../src/helpers/date";
import { useMutation } from "@tanstack/react-query";
const PrebookingSuccess = (props) => {
  const router = useRouter();
  const { query } = router;
  const { orderNumber } = query;
  const handleBack = () => {
    return router.back();
  };
  const { detail } = props;
  console.log(
    "🚀 ~ file: order-success.js:44 ~ PrebookingSuccess ~ detail",
    detail
  );
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );
  const toast = useToast();
  const flights = detail.order_details[0].product.journeys.flights;
  const mutation = useMutation(resendEmail, {
    onSuccess: () =>
      toast({
        title: "Sukses",
        description: "Harap cek email anda",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "subtle",
      }),
    onError: (error) =>
      toast({
        title: "Error",
        description: "Sepertinya ada masalah. Coba lagi",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "subtle",
      }),
  });
  return (
    <Layout type="nested" pagetitle={"Detail Pesanan"}>
      <Box as={"section"} mx={"-24px"}>
        <Stack
          p={"24px"}
          mx={"auto"}
          bg={"brand.blue.400"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
        >
          <Heading color={"white"} fontSize={"md"}>
            Informasi Penting
          </Heading>
          <Text color={"white"} fontSize={"sm"}>
            Pihak Golden Rama akan menguhubungi anda untuk informasi lebih
            lanjut mengenai pesanan. Semua informasi trekiat pesanan dan kode
            pre-booking ini bisa di cek kembali di email anda.
          </Text>
        </Stack>
      </Box>
      <SimpleGrid
        spacingX={"24px"}
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={"auto"}
        columns={[1, 1, 1, 2]}
      >
        <Box mx={{ base: "-24px", md: 0 }} bg={"brand.blue.100"}>
          <PrebookingDetails flights={flights} />
        </Box>
        <Box>
          <Stack as={"section"} py={"24px"}>
            <VStack alignItems={"start"}>
              <HStack w="full" justifyContent="space-between">
                <Text fontSize="sm" color="neutral.text.medium">
                  Waktu Booking
                </Text>
                <Text fontSize="sm" color="neutral.text.medium">
                  {date(new Date(detail.createdAt), "dd LLLL yyyy, pp")}
                  {/* 2 Juli 2022, 12.30 PM */}
                </Text>
              </HStack>
              <HStack w="full" justifyContent="space-between">
                <Text fontSize="sm" color="neutral.text.medium">
                  Kode Pre-Book
                </Text>
                <Text fontSize="sm" color="neutral.text.medium">
                  {detail.orderNumber}
                </Text>
              </HStack>
            </VStack>
          </Stack>
          <CustomDivider />
          <Stack as={"section"} py={"24px"}>
            <Heading fontSize={"md"}>Informasi Kontak</Heading>
            <Divider variant={"dashed"} />
            <HStack w="full" justifyContent="space-between">
              <Text fontSize="sm" color="neutral.text.medium">
                Nama Lengkap
              </Text>
              <Text fontSize="sm" color="neutral.text.medium">
                {detail.customer.full_name}
              </Text>
            </HStack>
            <HStack w="full" justifyContent="space-between">
              <Text fontSize="sm" color="neutral.text.medium">
                Email
              </Text>
              <Text fontSize="sm" color="neutral.text.medium">
                {detail.customer.email}
              </Text>
            </HStack>
            <HStack w="full" justifyContent="space-between">
              <Text fontSize="sm" color="neutral.text.medium">
                Nomor Telepon
              </Text>
              <Text fontSize="sm" color="neutral.text.medium">
                {detail.customer.phone}
              </Text>
            </HStack>
            <Text fontSize="sm">
              Tidak menerima email pre-booking? kirim ulang ke email
            </Text>
            <Box mt={"25px"}>
              <Formik
                onSubmit={async (val, action) => {
                  // alert(JSON.stringify(val, null, 2));
                  mutation.mutateAsync({
                    email: val.email,
                    orderNumber: orderNumber,
                  });
                  action.setSubmitting("false");
                }}
                validationSchema={Yup.object({
                  email: Yup.string().email().required(),
                })}
                initialValues={{
                  email: detail.customer.email,
                }}
              >
                {({ isSubmitting }) => {
                  return (
                    <Form>
                      <Field name={"email"}>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.email && form.touched.email}
                          >
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <MailIcon />
                              </InputLeftElement>
                              <Input
                                // readOnly
                                // rounded={"lg"}
                                py={"20px"}
                                borderColor={"transparent"}
                                bg={"brand.blue.100"}
                                color={"neutral.text.high"}
                                {...field}
                                colorScheme={"brand.blue"}
                                type="email"
                                placeholder="Masukan alamat email"
                              />
                              <InputRightElement pr={"36px"}>
                                <Button
                                  colorScheme={"brand.blue"}
                                  color={"brand.blue.400"}
                                  size={"sm"}
                                  type="submit"
                                  isLoading={mutation.isLoading}
                                  disabled={mutation.isLoading}
                                  variant={"unstyled"}
                                >
                                  Kirim
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Stack>
          <Stack px={{ base: "24px", xl: 0 }} mx={{ base: "-24px", md: 0 }}>
            <Divider hidden={!isDesktop} />
            <Box pb={"24px"}>
              <CustomOrangeFullWidthButton
                onClick={() => router.push("/")}
                mt={0}
              >
                Kembali Ke Beranda
              </CustomOrangeFullWidthButton>
            </Box>
          </Stack>
        </Box>
      </SimpleGrid>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { query } = ctx;
    const detail = await getOrderDetail(query.orderNumber);
    return {
      props: {
        detail,
        title: "Detail Pesanan",
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default PrebookingSuccess;
