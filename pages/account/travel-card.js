import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  Toast,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import Layout from "../../src/components/layout";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomFilterButton } from "../../src/components/button";
import {
  formatCardNumber,
  formatCardExpiry,
  formatCardCVC,
  formatSecretCardNumber,
} from "../../src/helpers";
import EyeIcon from "../../public/svg/icons/eye.svg";
import EyeStreakIcon from "../../public/svg/icons/eye-streak.svg";
import { useDispatch, useSelector } from "react-redux";
import LockIcon from "../../public/svg/icons/lock.svg";
import {
  addCard,
  getBalanceCard,
  removeCard,
} from "../../src/services/travelcard.service";
import { useQuery } from "@tanstack/react-query";
import { userData } from "../../src/state/auth/auth.slice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

const TravelCard = () => {
  const dispatch = useDispatch;
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { jwt, user } = useSelector((s) => s.authReducer);
  const initialSavedCard = {
    card_number: user.card.card ?? "",
    pinCode: "",
    // expiry_date: user.card.expire ?? "",
    balance: 0,
    show: {
      card_number: false,
      balance: false,
    },
  };
  const [savedCard, setSavedCard] = useState(initialSavedCard),
    [isLoading, setIsLoading] = useState(false),
    [isError, setIsError] = useState(false),
    [msgError, setMsgError] = useState("");
  const initialValues = {
    card_number: user.card.card ?? "",
    pinCode: "",
    // expiry_date: user.card.expire ?? "",
    password: "",
    show: {
      card_number: false,
      pinCode: false,
      password: false,
      // expiry_date: false,
    },
  };
  const getBalance = useQuery(
    ["getBalance"],
    async () => {
      try {
        const response = await getBalanceCard({
          cardNumber: savedCard.card_number,
          jwt,
        });
        return response;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    {
      enabled: false,
      onSuccess: (data) => {
        setSavedCard({
          ...savedCard,
          balance: data.balance,
        });
        setIsError(false);
      },
      onError: (error) => {
        setIsError(true);
        setMsgError(error.response.data.error.message);
      },
    }
  );
  useEffect(() => {
    if (user.card?.card) {
      getBalance.refetch();
    }
  }, [user.card]);

  const handleSubmit = (values, actions) => {
    const { show, ...rest } = values;
    return new Promise((resolve) => {
      setIsLoading(true);
      setTimeout(async () => {
        try {
          const result = await addCard({
            ...rest,
            phone_number: user.phone,
            jwt: jwt,
          });
          if (result.status === 200) {
            router.push("/account");
            toast({
              title: result.data.message,
              status: "success",
              isClosable: true,
              variant: "subtle",
            });
          }
        } catch (error) {
          toast({
            title: error.response.data.error.message,
            status: "error",
            isClosable: true,
            variant: "subtle",
          });
        }
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };
  return (
    <Layout
      type="nested"
      metatitle="Travel Privilege Card"
      pagetitle="Travel Privilege Card"
    >
      <Center bg="brand.blue.100" mx="-24px" px="24px" pt="28px" pb="32px">
        <Stack
          justifyContent="end"
          w="366px"
          h="200px"
          bg="#D5A916"
          bgImage="url('/svg/card-world.svg')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
          borderRadius="8.5px"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            px="12px"
            pb="36px"
          >
            {formatSecretCardNumber(savedCard.card_number)}
          </Text>
        </Stack>
      </Center>
      <Container waxW="container.sm" px={0}>
        <Formik onSubmit={handleSubmit} initialValues={initialValues}>
          {({ isSubmitting, errors, touched, setFieldValue, values }) => (
            <Form hidden={user.card?.card}>
              <Box py="24px">
                <Text color="neutral.text.high" fontSize="lg" fontWeight="bold">
                  Aktifkan Kartu
                </Text>
                <Stack spacing="24px" py="24px">
                  <FormControl
                    isInvalid={errors.card_number && touched.card_number}
                  >
                    <FormLabel htmlFor="card_number">Nomor Kartu</FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        name="card_number"
                        id="card_number"
                        variant="filled"
                        colorScheme="gray"
                        type={values.show.card_number ? "text" : "password"}
                        placeholder="2019 XXXX XXXX 1819"
                        onChange={(e) =>
                          setFieldValue(
                            "card_number",
                            formatCardNumber(e.target.value)
                          )
                        }
                      />
                      <InputRightElement>
                        <IconButton
                          onClick={() =>
                            setFieldValue(
                              "show.card_number",
                              !values.show.card_number
                            )
                          }
                          variant="ghost"
                          aria-label="Show"
                          icon={
                            values.show.card_number ? (
                              <EyeStreakIcon />
                            ) : (
                              <EyeIcon />
                            )
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.card_number}</FormErrorMessage>
                  </FormControl>
                  {/* <FormControl
                    isInvalid={errors.expiry_date && touched.expiry_date}
                  >
                    <FormLabel htmlFor="expiry_date">
                      Masa Berlaku Kartu
                    </FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        name="expiry_date"
                        id="expiry_date"
                        variant="filled"
                        colorScheme="gray"
                        type={values.show.expiry_date ? "text" : "password"}
                        placeholder="MM / YY"
                        onChange={(e) =>
                          setFieldValue(
                            "expiry_date",
                            formatCardExpiry(e.target.value)
                          )
                        }
                      />
                      <InputRightElement>
                        <IconButton
                          onClick={() =>
                            setFieldValue(
                              "show.expiry_date",
                              !values.show.expiry_date
                            )
                          }
                          variant="ghost"
                          aria-label="Show"
                          icon={
                            values.show.expiry_date ? (
                              <EyeStreakIcon />
                            ) : (
                              <EyeIcon />
                            )
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText>
                      Masa berlaku kartu dapat dilihat pada kertas dokumen
                      penyerta kartu.
                    </FormHelperText>
                    <FormErrorMessage>{errors.expiry_date}</FormErrorMessage>
                  </FormControl> */}
                  <FormControl isInvalid={errors.pinCode && touched.pinCode}>
                    <FormLabel htmlFor="pinCode">PIN</FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        name="pinCode"
                        id="pinCode"
                        variant="filled"
                        colorScheme="gray"
                        type={values.show.pinCode ? "text" : "password"}
                        placeholder="XXXX"
                        onChange={(e) =>
                          setFieldValue(
                            "pinCode",
                            formatCardCVC(e.target.value)
                          )
                        }
                      />
                      <InputRightElement>
                        <IconButton
                          onClick={() =>
                            setFieldValue("show.pinCode", !values.show.pinCode)
                          }
                          variant="ghost"
                          aria-label="Show"
                          icon={
                            values.show.pinCode ? (
                              <EyeStreakIcon />
                            ) : (
                              <EyeIcon />
                            )
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                    {/* <FormHelperText>
                      3 angka kode pinCode dapat dilihat dibalik kartu
                    </FormHelperText> */}
                    <FormErrorMessage>{errors.pinCode}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.password && touched.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        name="password"
                        id="password"
                        variant="filled"
                        colorScheme="gray"
                        type={values.show.password ? "text" : "password"}
                        placeholder="Password"
                        pl="2.5em"
                      />
                      <InputLeftElement>
                        <LockIcon />
                      </InputLeftElement>
                      <InputRightElement>
                        <IconButton
                          onClick={() =>
                            setFieldValue(
                              "show.password",
                              !values.show.password
                            )
                          }
                          variant="ghost"
                          aria-label="Show"
                          icon={
                            values.show.password ? (
                              <EyeStreakIcon />
                            ) : (
                              <EyeIcon />
                            )
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
              <Box py="16px" bg="white">
                <CustomOrangeFullWidthButton
                  type="submit"
                  isLoading={isLoading}
                >
                  Simpan
                </CustomOrangeFullWidthButton>
              </Box>
            </Form>
          )}
        </Formik>
        <Box hidden={!user.card?.card} py="24px">
          <Text color="neutral.text.high" fontSize="lg" fontWeight="bold">
            Informasi Kartu
          </Text>
          <Stack py="32px" spacing="24px">
            <HStack justifyContent="space-between" fontSize="sm">
              <Text color="neutral.text.high">Nomor Kartu</Text>
              <HStack>
                <Text color="neutral.text.low">
                  {formatSecretCardNumber(
                    savedCard.card_number,
                    savedCard.show.card_number
                  )}
                </Text>
                <IconButton
                  onClick={() =>
                    setSavedCard({
                      ...savedCard,
                      show: {
                        ...savedCard.show,
                        card_number: !savedCard.show.card_number,
                      },
                    })
                  }
                  variant="unstyled"
                  ml={"auto"}
                  style={{ transform: "rotate(180deg)" }}
                  aria-label="Show"
                  icon={
                    savedCard.show.card_number ? <EyeStreakIcon /> : <EyeIcon />
                  }
                />
              </HStack>
            </HStack>
            <HStack justifyContent="space-between" fontSize="sm">
              <Text color="neutral.text.high">Status Kartu</Text>
              <Text color="nuetral.text.low">
                {getBalance.isLoading
                  ? "Loading..."
                  : isError
                  ? msgError
                  : "AKTIF"}
              </Text>
            </HStack>
          </Stack>
          <Box
            position="absolute"
            left={0}
            bg="brand.blue.100"
            h="8px"
            w="full"
          />
          <Text
            color="neutral.text.high"
            fontSize="lg"
            pt={5}
            fontWeight="bold"
          >
            Saldo Kartu
          </Text>
          <HStack pt="32px" pb="16px" justifyContent="space-between">
            <Text color="brand.orange.400" fontSize="2xl" fontWeight="bold">
              {savedCard.show.balance
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(savedCard.balance)
                : "Rp XXXXXXX"}
            </Text>
            <IconButton
              onClick={() =>
                setSavedCard({
                  ...savedCard,
                  show: {
                    ...savedCard.show,
                    balance: !savedCard.show.balance,
                  },
                })
              }
              variant="unstyled"
              aria-label="Show"
              style={{ transform: "rotate(180deg)" }}
              icon={savedCard.show.balance ? <EyeStreakIcon /> : <EyeIcon />}
            />
          </HStack>
          <Text color="neutral.text.low" fontSize="sm">
            Dengan memiliki saldo kamu dapat melakukan pembayaran produk golden
            rama dengan lebih mudah
          </Text>
          <Stack pt="58px">
            <Link
              href="/account/travel-card/topup"
              style={{ textDecoration: "none", color: "white" }}
            >
              <CustomOrangeFullWidthButton
              // onClick={() => (
              //   toast({
              //     title: "Fitur ini belum tersedia untuk saat ini.",
              //     status: "error",
              //     isClosable: true,
              //   })
              // )}
              >
                Top Up Saldo
              </CustomOrangeFullWidthButton>
            </Link>
            <Button
              onClick={onOpen}
              bg="white"
              border="1px solid #F5A623"
              color="brand.orange.400"
            >
              Hapus Kartu
            </Button>
          </Stack>
        </Box>
      </Container>
      <ModalDelete
        isOpen={isOpen}
        onClose={onClose}
        onDelete={async () => {
          const result = await removeCard({
            cardNumber: savedCard.card_number,
            jwt,
          });
          toast({
            title: result?.message || "Gagal menghapus kartu",
            status: result?.message ? "success" : "error",
            isClosable: true,
            variant: "subtle",
          });
          router.push("/account");
          onClose();
        }}
      />
    </Layout>
  );
};

export default TravelCard;

const ModalDelete = ({ isOpen, onClose, onDelete }) => {
  return (
    <CustomFilterButton
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Kartu"
      footer="Hapus"
      onSubmit={onDelete}
    >
      <Text color="neutral.text.high" fontSize="lg" fontWeight="bold">
        Kamu yakin ingin menghapus kartu?
      </Text>
      <Text color="neutral.text.low" fontSize="sm" pt="16px">
        Dengan Menghapus kartu anda harus menginput ulang kartu baru
      </Text>
    </CustomFilterButton>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      title: "Travel Privilege Card",
    },
  };
};
