import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import CopyToClipboard from "react-copy-to-clipboard";
import Countdown from "react-countdown";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../src/components/layout";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
} from "../../../src/components/button";
import Clipboard from "../../../public/svg/icons/clipboard.svg";
import Checked from "../../../public/svg/icons/checked.svg";
import Unchecked from "../../../public/svg/icons/unchecked.svg";
import {
  getPaymentMethods,
  generateVirtualAccount,
  generateCreditCard,
} from "../../../src/services/payment.service";
import { useSelector } from "react-redux";
import { convertDateToTimestamp, convertRupiah } from "../../../src/helpers";
import { useMutation } from "@tanstack/react-query";
import {
  AttractionsDetails,
  InsuranceDetails,
  TravelTopUpDetail,
} from "../../../src/components/card";
import { getOrderDetail } from "../../../src/services/travelcard.service";

const Payment = (props) => {
  const router = useRouter();
  const toast = useToast();
  const { paymentMethods } = props;
  const { insuranceDetail, transaction } = useSelector(
    (state) => state.travelcardReducer
  );
  const { user, jwt } = useSelector((s) => s.authReducer);
  const [selectedPayment, setSelectedPayment] = useState("0");
  const [isWaiting, setIsWaiting] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [statusPayment, setStatusPayment] = useState(false);
  const handleSelectPayment = (selected) => {
    setSelectedPayment(selected);
  };
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  // Select BCA as Default Payment
  useEffect(() => {
    const Mandiri = paymentMethods.filter(
      (item) => item.attributes.productCode === "MANDIRIATM"
    )[0];
    setSelectedPayment(Mandiri);
  }, [paymentMethods]);

  const handlePayment = () => {
    const form = {
      order_id: transaction.orderNumber,
    };
    if (selectedPayment.attributes.productCode != "CREDITCARD") {
      form.bank_code = selectedPayment.attributes.bankCode;
      mutationVirtualAccount.mutate(form);
    } else {
      mutationCreditCard.mutate(form);
    }
  };

  const handleStatusPayment = () => {
    const form = {
      orderNumber: transaction.orderNumber,
    };
    mutationCheckStatusPayment.mutate(form);
  };

  const mutationVirtualAccount = useMutation(
    async (form) => {
      const response = await generateVirtualAccount(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        setPaymentDetail(response);
        setIsWaiting(true);
      },
    }
  );

  const mutationCreditCard = useMutation(
    async (form) => {
      const response = await generateCreditCard(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        location.href = response.redirect_url;
      },
    }
  );

  const mutationCheckStatusPayment = useMutation(
    async (form) => {
      const response = await getOrderDetail(form);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        if (response.status == "paid" || response.status == "confirmed")
          router.push({
            pathname: "/account/travel-card/order-success",
            query: {
              orderNumber: response.orderNumber,
            },
          });
        else setStatusPayment(false);
      },
    }
  );

  const handleCopy = () => {
    toast({
      title: "",
      description: "Berhasil dicopy",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Layout type={"nested"} pagetitle={"Pembayaran Travel Card"} hideBottomBar>
      {isWaiting && paymentDetail != null ? (
        <Box
          as={"section"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          py={{ md: "24px" }}
        >
          <Grid
            templateColumns={{ md: "repeat(3,1fr)" }}
            // py={"24px"}
            columnGap={"calc(20px + 24px)"}
          >
            <GridItem colSpan={{ md: 2 }}>
              <HStack
                alignItems="center"
                justifyContent="space-between"
                bg={"brand.blue.400"}
                px={"24px"}
                py={"16px"}
              >
                <Text fontWeight="semibold" color="white">
                  Selesaikan Dalam
                </Text>
                <Countdown
                  date={convertDateToTimestamp(paymentDetail.expired)}
                  renderer={({ hours, minutes, seconds }) => {
                    return (
                      <HStack alignItems="center">
                        {[hours, minutes, seconds].map((item, index) => (
                          <HStack key={index} alignItems="center">
                            {index > 0 && (
                              <Text color="white" fontWeight="semibold">
                                :
                              </Text>
                            )}
                            <Center
                              bg="white"
                              w="30px"
                              h="30px"
                              borderRadius="6px"
                              color="brand.blue.400"
                              fontWeight="semibold"
                            >
                              {item}
                            </Center>
                          </HStack>
                        ))}
                      </HStack>
                    );
                  }}
                />
              </HStack>
              <Box bg={"brand.blue.100"} p={"24px"}>
                <Stack spacing={5}>
                  {[
                    {
                      t: "Virtual Account",
                      i: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedPayment.attributes.logo.data.attributes.url}`,
                    },
                    {
                      t: "Nomor Virtual Account",
                      p: `${paymentDetail.va_number}`,
                      c: true,
                    },
                    {
                      t: "Total Pembayaran",
                      p: `IDR ${transaction.totalTransaction.toLocaleString(
                        "id-ID",
                        {
                          maximumFractionDigits: 0,
                        }
                      )}`,
                    },
                    {
                      t: "Status Pembayaran",
                      p: `${statusPayment ? "Sudah dibayar" : "Belum dibayar"}`,
                    },
                  ].map((item, index, arr) => (
                    <HStack
                      key={index}
                      justifyContent="space-between"
                      borderBottom={
                        index === arr.length - 1 ? "none" : "1px dashed #9E9E9E"
                      }
                      py="12px"
                    >
                      <Stack spacing={0.75}>
                        <Text fontSize="sm" color="neutral.text.low">
                          {item.t}
                        </Text>
                        {item.p && (
                          <Text fontSize="lg" fontWeight="semibold">
                            {item.p}
                          </Text>
                        )}
                        {item.i && (
                          <Box
                            position={"relative"}
                            height={"30px"}
                            width={"100%"}
                          >
                            <Image
                              src={item.i}
                              alt="bank"
                              layout={"fill"}
                              objectPosition={"left"}
                              objectFit="contain"
                            />
                          </Box>
                        )}
                      </Stack>
                      {item.c && (
                        <CopyToClipboard
                          onCopy={handleCopy}
                          text={item.p.replaceAll(" ", "")}
                        >
                          <IconButton aria-label="copy" icon={<Clipboard />} />
                        </CopyToClipboard>
                      )}
                    </HStack>
                  ))}
                </Stack>
              </Box>
            </GridItem>
            <GridItem position={"relative"}>
              <Stack spacing={"12px"} position={"sticky"} top={24}>
                <Stack
                  as="section"
                  pb={{ base: "24px", md: 0 }}
                  py={{ base: "24px", md: 0 }}
                  spacing={2}
                >
                  <Heading fontSize="lg" fontWeight="semibold">
                    Tata Cara Pembayaran
                  </Heading>
                  <Text color="neutral.text.medium" fontSize={"sm"}>
                    Lakukan pembayaran untuk pesanan Anda dengan mengikuti
                    beberapa langkah berikut :
                  </Text>
                  <Accordion allowMultiple>
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton
                        _hover={{ background: "transparent" }}
                        px={0}
                      >
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"18px"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Melalui Mobile Banking
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"24px"}>
                          <Text
                            as={"div"}
                            fontSize={"sm"}
                            dangerouslySetInnerHTML={{
                              __html:
                                selectedPayment?.attributes?.howToPayMobile,
                            }}
                          />
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton
                        _hover={{ background: "transparent" }}
                        px={0}
                      >
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"18px"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Melalui ATM
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"24px"}>
                          <Text
                            as={"div"}
                            fontSize={"sm"}
                            dangerouslySetInnerHTML={{
                              __html: selectedPayment?.attributes?.howToPay,
                            }}
                          />
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Box
                    py="6px"
                    borderTop={{ base: "1px solid #9E9E9E", md: 0 }}
                  >
                    <CustomOrangeFullWidthButton
                      onClick={() => handleStatusPayment()}
                    >
                      Saya Sudah Membayar
                    </CustomOrangeFullWidthButton>

                    <CustomOrangeFullWidthButton
                      isoutlined
                      onClick={() => router.push("/")}
                    >
                      Kembali ke Beranda
                    </CustomOrangeFullWidthButton>
                  </Box>
                </Stack>
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      ) : (
        <Box
          as={"section"}
          bg={"white"}
          // bg={{ base: "brand.blue.100", md: "brand.blue.100" }}
          mx={"-24px"}
        >
          <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
            <TravelTopUpDetail
              details={{ ...transaction, card: user.card, jwt }}
              hidden={!isDesktop}
            />
            <SimpleGrid
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              spacing={12}
              columns={[1, 1, 1, 2]}
            >
              <Stack mx={"24px"} spacing={5} minH="55vh">
                <HStack
                  justifyContent="space-between"
                  py="24px"
                  borderBottom="1px dashed #9E9E9E"
                >
                  <Text fontSize="lg" fontWeight="semibold">
                    Metode Pembayaran
                  </Text>
                  <DrawerMethods
                    paymentMethods={paymentMethods}
                    handleSelectPayment={handleSelectPayment}
                    selectedPayment={selectedPayment}
                  />
                </HStack>
                <Text color="neutral.text.low">
                  {selectedPayment?.attributes?.productCode === "BCAATM"
                    ? "Rekomendasi metode pembayaran"
                    : "Metode pembayaran yang dipilih"}
                </Text>
                {paymentMethods &&
                  paymentMethods.map((item, index) => (
                    <HStack
                      alignItems="center"
                      justifyContent="space-between"
                      bg="brand.blue.100"
                      borderRadius="6px"
                      px="16px"
                      py="20px"
                      hidden={selectedPayment && selectedPayment.id != item.id}
                      key={index}
                      onClick={() => handleSelectPayment(item)}
                    >
                      <HStack alignItems="center">
                        <Center w="50px" h="26px" bg="white">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.logo.data.attributes.url}`}
                            alt="bank"
                            width={50}
                            height={26}
                            objectFit="contain"
                          />
                        </Center>
                        <Text fontWeight="semibold">
                          {item.attributes.productName}
                        </Text>
                      </HStack>
                      {selectedPayment && selectedPayment.id == item.id && (
                        <Checked />
                      )}
                    </HStack>
                  ))}
                <Text color="neutral.text.low">
                  {selectedPayment?.attributes?.productCode === "CREDITCARD"
                    ? "Nasabah YTH, Untuk pembayaran dengan menggunakan Kartu Kredit, tagihan yang akan tercetak di lembar tagihan kartu kredit pelanggan adalah atas nama ESPAY"
                    : ""}
                </Text>
              </Stack>
              <Stack spacing={"12px"}>
                <TravelTopUpDetail
                  details={{ ...transaction, card: user.card, jwt }}
                  hidden={isDesktop}
                />
                <HStack
                  bg={{ base: "transparent", md: "white" }}
                  h={"min-content"}
                  p={"24px"}
                  border={"1px solid"}
                  borderTop={{
                    base: "1px dashed #9E9E9E",
                    md: "1px solid #e0e0e0",
                  }}
                  borderColor={"neutral.color.line.secondary"}
                  borderTopColor={"neutral.color.line.secondary"}
                  justifyContent="space-between"
                  rounded={{ base: "none", md: "lg" }}
                  alignItems="center"
                >
                  {/* <Text
                                        fontSize="lg"
                                        fontWeight="semibold"
                                        color="brand.orange.400"
                                        w="full"
                                    >
                                        IDR {convertRupiah(transaction.totalTransaction)}
                                    </Text> */}
                  <CustomOrangeFullWidthButton
                    isLoading={
                      mutationCreditCard.isLoading ||
                      mutationVirtualAccount.isLoading
                    }
                    disabled={
                      selectedPayment === "0" ||
                      mutationCreditCard.isLoading ||
                      mutationVirtualAccount.isLoading
                    }
                    onClick={() => handlePayment()}
                  >
                    Bayar Sekarang
                  </CustomOrangeFullWidthButton>
                </HStack>
              </Stack>
            </SimpleGrid>
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default Payment;

const DrawerMethods = ({
  paymentMethods,
  handleSelectPayment,
  selectedPayment,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();
  const methods = ["Mandiri", "BCA", "BNI", "BRI", "Card"];
  const handleSubmit = (values, actions) => {
    setTimeout(() => {
      actions.setSubmitting(false);
      alert(JSON.stringify(values, null, 2));
      onClose();
    }, 1000);
  };
  return (
    <>
      <Text
        onClick={onOpen}
        ref={ref}
        fontWeight="semibold"
        color="brand.blue.400"
      >
        Ubah
      </Text>
      <CustomFilterButton
        isOpen={isOpen}
        onClose={onClose}
        title="Pilih Metode"
      >
        <Stack spacing={5}>
          <Stack py="12px">
            <Text fontSize="lg" fontWeight="semibold">
              Virtual Account
            </Text>
            <Text fontSize="sm" color="neutral.text.low">
              Anda dapat melakukan transfer melalui Mobile Banking
            </Text>
          </Stack>
          <Stack>
            {paymentMethods
              .filter((item) => {
                return item.attributes.productCode !== "CREDITCARD";
              })
              .map((item, index) => (
                <HStack
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                  borderRadius="6px"
                  py="20px"
                  onClick={() => handleSelectPayment(item)}
                >
                  <HStack alignItems="center">
                    <Center
                      minW="50px"
                      h="26px"
                      borderWidth="0.5px"
                      borderColor="neutral.text.low"
                      borderRadius="4px"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.logo.data.attributes.url}`}
                        alt="logo"
                        width={50}
                        height={26}
                        objectFit="contain"
                      />
                    </Center>
                    <Text flexBasis="80%" fontWeight="semibold">
                      {item.attributes.productName}
                    </Text>
                  </HStack>
                  {selectedPayment.id == item.id ? <Checked /> : <Unchecked />}
                </HStack>
              ))}
          </Stack>
          <Stack spacing={5}>
            <Stack py="12px">
              <Text fontSize="lg" fontWeight="semibold">
                Kartu Debit/Kredit
              </Text>
              {/* <Text fontSize="sm" color="neutral.text.low">
                Anda dapat melakukan transfer melalui Mobile Banking
              </Text> */}
            </Stack>
            <Stack>
              {paymentMethods
                .filter((item) => {
                  return item.attributes.productCode === "CREDITCARD";
                })
                .map((item, index) => (
                  <HStack
                    key={index}
                    alignItems="center"
                    justifyContent="space-between"
                    borderRadius="6px"
                    py="20px"
                    onClick={() => handleSelectPayment(item)}
                  >
                    <HStack alignItems="center">
                      <Center
                        minW="50px"
                        h="26px"
                        borderWidth="0.5px"
                        borderColor="neutral.text.low"
                        borderRadius="4px"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.logo.data.attributes.url}`}
                          alt="logo"
                          width={50}
                          height={26}
                          objectFit="contain"
                        />
                      </Center>
                      <Text flexBasis="80%" fontWeight="semibold">
                        {item.attributes.productName}
                      </Text>
                    </HStack>
                    {selectedPayment && selectedPayment.id == item.id ? (
                      <Checked />
                    ) : (
                      <Unchecked />
                    )}
                  </HStack>
                ))}
            </Stack>
          </Stack>
        </Stack>
      </CustomFilterButton>
    </>
  );
};

export const getServerSideProps = async () => {
  const paymentMethods = await getPaymentMethods();

  return {
    props: {
      paymentMethods,
      title: {
        title: "Pembayaran Travel Card",
      },
    },
  };
};
