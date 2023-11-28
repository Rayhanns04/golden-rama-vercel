import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import CopyToClipboard from "react-copy-to-clipboard";
import Countdown from "react-countdown";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../src/components/layout";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
} from "../../src/components/button";
import Clipboard from "../../public/svg/icons/clipboard.svg";
import Checked from "../../public/svg/icons/checked.svg";
import Unchecked from "../../public/svg/icons/unchecked.svg";
import WalletIcon from "../../public/svg/flights/wallet.svg";
import {
  getPaymentMethods,
  generateVirtualAccount,
  generateCreditCard,
  paymentTravelCard,
} from "../../src/services/payment.service";
import { useSelector } from "react-redux";
import { convertDateToTimestamp, convertRupiah } from "../../src/helpers";
import { useMutation } from "@tanstack/react-query";
import { FlightDetails } from "../../src/components/card";
import { getOrderDetail } from "../../src/services/flight.service";

const Payment = (props) => {
  const router = useRouter();
  const toast = useToast();
  const { paymentMethods, defaultPaymentMethod } = props;
  const { data, query, orderDetail, transaction } = useSelector(
    (state) => state.orderReducer
  );

  const [selectedPayment, setSelectedPayment] = useState(defaultPaymentMethod);
  const [isWaiting, setIsWaiting] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [statusPayment, setStatusPayment] = useState(false);
  const [pin, setPin] = useState("");
  const { user, jwt, isLoggedIn } = useSelector((s) => s.authReducer);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenPIN,
    onOpen: onOpenPIN,
    onClose: onClosePIN,
  } = useDisclosure();
  const handleSelectPayment = (selected) => {
    setSelectedPayment(selected);
  };
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  const handlePayment = () => {
    const form = {
      order_id: orderDetail?.data?.orderNumber, // orderDetail.data.pnrid
    };
    if (!selectedPayment) {
      return toast({
        title: "Harap pilih metode pembayaran terlebih dahulu!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (selectedPayment.attributes.productCode == "CREDITCARD") {
      mutationCreditCard.mutate(form);
    }
    if (selectedPayment.attributes.productCode == "TRAVELCARD") {
      if (!pin || pin == "") {
        return toast({
          title: "PIN Wajib Diisi",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      if (isLoggedIn && user.card?.card) {
        mutationTravelCard.mutate({
          ...form,
          pinCode: pin,
          cardNumber: user.card?.card,
        });
        setPin("");
      }
    } else {
      form.bank_code = selectedPayment.attributes.bankCode;
      mutationVirtualAccount.mutate(form);
    }
  };

  const handleStatusPayment = () => {
    const form = {
      orderNumber: orderDetail.data.orderNumber,
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

  const mutationTravelCard = useMutation(
    async (form) => {
      const response = await paymentTravelCard(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        if (response.data.reference_number)
          router.push({
            pathname: "/flights/order-success",
            query: {
              orderNumber: response.data.order_id,
            },
          });
        else setStatusPayment(false);
      },
      onError: (error) => {
        if (
          error.response.data.error.message ==
            "Card blacklisted, too many attempt" ||
          error.response.data.error.message == "Card blacklisted"
        ) {
          return toast({
            title: "Kartu Anda Diblokir, Silahkan Hubungi Customer Service",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: "Cek Kembali PIN Anda / Saldo Anda",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
            pathname: "/flights/order-success",
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

  const onOpenModalPIN = () => {
    onOpenPIN();
  };

  const handlePIN = (pin) => {
    setPin(pin);
  };

  return (
    <Layout type={"nested"} pagetitle={"Pembayaran"} hideBottomBar>
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
                      p: `IDR ${convertRupiah(transaction?.total)}`,
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
                      Cek Status Pembayaran
                    </CustomOrangeFullWidthButton>

                    <CustomOrangeFullWidthButton
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
            <FlightDetails query={query} data={data} hidden={!isDesktop} />
            <SimpleGrid
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={4}
              spacing={12}
              columns={[1, 1, 1, 2]}
            >
              <Stack spacing={5} minH="55vh">
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
                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  bg="brand.blue.100"
                  borderRadius="6px"
                  px="16px"
                  py="20px"
                >
                  <HStack alignItems="center">
                    {selectedPayment ? (
                      <Center w="50px" h="26px" bg="white">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedPayment.attributes.logo.data.attributes.url}`}
                          alt="bank"
                          width={50}
                          height={26}
                          objectFit="contain"
                        />
                      </Center>
                    ) : (
                      <WalletIcon />
                    )}
                    <Text fontWeight="semibold">
                      {selectedPayment
                        ? selectedPayment.attributes.productName
                        : "Pilih Metode Pembayaran"}
                    </Text>
                  </HStack>
                  {selectedPayment ? <Checked /> : <Unchecked />}
                </HStack>
                <Text color="neutral.text.low">
                  {selectedPayment?.attributes?.productCode === "CREDITCARD"
                    ? "Nasabah YTH, Untuk pembayaran dengan menggunakan Kartu Kredit, tagihan yang akan tercetak di lembar tagihan kartu kredit pelanggan adalah atas nama ESPAY"
                    : ""}
                </Text>
              </Stack>
              <Stack spacing={"12px"}>
                <FlightDetails query={query} data={data} hidden={isDesktop} />
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
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="brand.orange.400"
                    w="full"
                  >
                    IDR {convertRupiah(transaction?.total)}
                  </Text>
                  <CustomOrangeFullWidthButton
                    isLoading={
                      mutationCreditCard.isLoading ||
                      mutationTravelCard.isLoading ||
                      mutationVirtualAccount.isLoading
                    }
                    disabled={selectedPayment === "0"}
                    onClick={() =>
                      selectedPayment?.attributes?.productCode === "TRAVELCARD"
                        ? onOpenModalPIN()
                        : handlePayment()
                    }
                  >
                    Bayar
                  </CustomOrangeFullWidthButton>
                </HStack>
              </Stack>
            </SimpleGrid>
          </Box>
        </Box>
      )}
      <ModalPIN
        isOpen={isOpenPIN}
        onClose={onClosePIN}
        handleSubmit={handlePayment}
        pinCode={handlePIN}
      />
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
  const { isLoggedIn, user } = useSelector((s) => s.authReducer);
  const toast = useToast();
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
      <Button
        as={motion.div}
        onClick={onOpen}
        ref={ref}
        fontWeight="semibold"
        color="brand.blue.400"
        cursor="pointer"
        animate={{
          scale: [1, 1.1, 1, 1.1, 1],
          backgroundColor: ["#fff", "#f0f4f5", "#fff", "#f0f4f5", "#fff"],
        }}
      >
        Ubah
      </Button>
      <CustomFilterButton
        isOpen={isOpen}
        onClose={onClose}
        title="Pilih Metode"
      >
        <Stack spacing={5}>
          {isLoggedIn && (
            <>
              <Stack spacing={5}>
                <Stack py="12px">
                  <Text fontSize="lg" fontWeight="semibold">
                    Travel Card
                  </Text>
                  <Text fontSize="sm" color="neutral.text.low">
                    Anda dapat melakukan transfer melalui Kartu Travel Card
                  </Text>
                </Stack>
                <Stack>
                  {paymentMethods
                    .filter((item) => {
                      return item.attributes.productCode === "TRAVELCARD";
                    })
                    .map((item, index) => (
                      <HStack
                        key={index}
                        alignItems="center"
                        justifyContent="space-between"
                        borderRadius="6px"
                        py="20px"
                        onClick={() =>
                          user.card?.card
                            ? handleSelectPayment(item)
                            : toast({
                                title: "Kartu Travel Card belum terdaftar",
                                description:
                                  "Silahkan daftarkan kartu travel card anda terlebih dahulu",
                                status: "error",
                                duration: 9000,
                                isClosable: true,
                              })
                        }
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
                        {selectedPayment?.id == item.id ? (
                          <Checked />
                        ) : (
                          <Unchecked />
                        )}
                      </HStack>
                    ))}
                </Stack>
              </Stack>
            </>
          )}
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
                return (
                  item.attributes.productCode !== "CREDITCARD" &&
                  item.attributes.productCode !== "TRAVELCARD"
                );
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
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.attributes.logo.data.attributes.url}`}
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
                  {selectedPayment?.id == item.id ? <Checked /> : <Unchecked />}
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
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.attributes.logo.data.attributes.url}`}
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

const ModalPIN = ({ isOpen, onClose, handleSubmit, pinCode }) => {
  const [show, setShow] = useState(false);

  return (
    <CustomFilterButton
      isOpen={isOpen}
      onClose={onClose}
      title="Input PIN"
      footer="Input PIN"
      onSubmit={() => {
        handleSubmit();
        onClose();
      }}
    >
      <Stack spacing={5}>
        <Text fontSize="sm" color="neutral.text.low">
          Masukkan PIN Anda untuk melanjutkan pembayaran
        </Text>
        <Input
          type={show ? "text" : "password"}
          placeholder="Masukkan PIN"
          onChange={(e) => pinCode(e.target.value)}
          maxLength={4}
        />
      </Stack>
    </CustomFilterButton>
  );
};

export const getServerSideProps = async () => {
  const paymentMethods = await getPaymentMethods();
  return {
    props: {
      paymentMethods,
      defaultPaymentMethod: null,
      meta: {
        title: "Pembayaran",
      },
    },
  };
};
